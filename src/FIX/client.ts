import {
  Field,
  FIXParser,
  Fields,
  Messages,
  EncryptMethod,
  MarketDepth,
  MDUpdateType,
  SubscriptionRequestType,
} from 'fixparser'

import { SUPPORTED_MARKETS } from '../config/markets'
import { ClientOptions, IFIXOptions, MarketDataRequest } from '../FIX/interface'
import MessagesManager from './managers'
import MassQuoteManager from './managers/MassQuoteManager'

export class FIXClient extends MessagesManager {
  readonly client: FIXParser
  readonly verbose: boolean
  readonly reconnectFrequency: number
  readonly options: IFIXOptions

  constructor(client: FIXParser, clientOptions: ClientOptions, FIXOptions: IFIXOptions) {
    super(client, clientOptions.verbose)

    this.client = client
    this.verbose = clientOptions.verbose
    this.reconnectFrequency = clientOptions.reconnectFrequency
    this.options = FIXOptions
    this._initialize()
  }

  private _initialize() {
    this.verbose && console.log('[initialize]: Initializing...')
    this._connect()
    this._subscribeToAll()
  }

  private _connect() {
    this.verbose && console.log('[connect]: Attempting to connect...')
    this.client.connect({
      ...this.options,
      onReady: this._onReady.bind(this),
      onOpen: this._onOpen.bind(this),
      onMessage: this.onMessage.bind(this),
      onError: this._onError.bind(this),
      onClose: this._onClose.bind(this),
    })
  }

  private _subscribeToAll() {
    if (!this.isConnected()) {
      setTimeout(() => {
        this._subscribeToAll()
      }, this.reconnectFrequency)
    } else {
      this.verbose && console.log('[subscribeToAll]: Subscribing to all symbols...')
      for (let i = 0; i < SUPPORTED_MARKETS.length; i++) {
        this.sendMarketDataRequest({ market_id: SUPPORTED_MARKETS[i].market_id })
      }
    }
  }

  private _onReady() {
    this.verbose && console.log('[onReady]: Client is ready to connect')
  }

  private _onOpen() {
    this.verbose && console.log('[onOpen]: Connection is now open')
    this._sendLogon()
  }

  private _onClose() {
    this.verbose && console.log('[onClose]: Disconnected from remote')
    setTimeout(() => this._connect(), 3000)
  }

  private _onError(error?: Error) {
    this.verbose && console.warn('[onError]: Some error occurred: ', error)
  }

  private _getDefaultMessageFields(): Field[] {
    return [
      new Field(Fields.SenderCompID, this.client.sender),
      new Field(Fields.TargetCompID, this.client.target),
      new Field(Fields.MsgSeqNum, this.client.getNextTargetMsgSeqNum()),
      new Field(Fields.SendingTime, this.client.getTimestamp()),
    ]
  }

  private _sendLogon() {
    const logon = this.client.createMessage(
      ...this._getDefaultMessageFields(),
      new Field(Fields.MsgType, Messages.Logon),
      new Field(Fields.ResetSeqNumFlag, this.options.resetSeqNumFlag),
      new Field(Fields.EncryptMethod, EncryptMethod.None),
      new Field(Fields.HeartBtInt, this.client.heartBeatInterval),
      new Field(Fields.Username, this.options.username),
      new Field(Fields.Password, this.options.password)
    )
    this.client.send(logon)
  }

  public isConnected() {
    return this.client.isConnected()
  }

  public sendMarketDataRequest({ market_id }: MarketDataRequest) {
    const request = this.client.createMessage(
      ...this._getDefaultMessageFields(),
      new Field(Fields.MsgType, Messages.MarketDataRequest),
      new Field(Fields.Account, this.options.account),
      new Field(Fields.MDReqID, MassQuoteManager.getRequestID(market_id)), // bypass the PXM routing bug
      new Field(Fields.MarketDepth, MarketDepth.FullBook),

      // Symbol
      new Field(Fields.NoRelatedSym, 1),
      new Field(Fields.Symbol, market_id),

      // Subscription
      new Field(Fields.SubscriptionRequestType, SubscriptionRequestType.SnapshotPlusUpdates),
      new Field(Fields.MDUpdateType, MDUpdateType.IncrementalRefresh) // required for SnapshotPlusUpdates
    )
    this.client.send(request)
  }
}
