import { Message, FIXParser, Messages } from 'fixparser'

import MassQuoteManager from './MassQuoteManager'

export default class MessagesManager {
  readonly client: FIXParser
  readonly verbose: boolean

  constructor(client: FIXParser, verbose: boolean) {
    this.client = client
    this.verbose = verbose
  }

  protected onMessage(message: Message) {
    const parsed = this.client.parse(message.encode())

    for (let i = 0; i < parsed.length; i++) {
      const { data, messageType } = parsed[i]

      switch (messageType) {
        case Messages.Logon:
          return // TODO: what shall we do with this?
        case Messages.MassQuote:
          return MassQuoteManager.onMessage(data)
        default:
          // TODO: implement handler
          return new Error('Unsupported message type: ' + messageType)
      }
    }
  }
}
