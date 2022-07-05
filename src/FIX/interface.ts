import { Options } from 'fixparser'

export interface ClientOptions {
  verbose: boolean
  reconnectFrequency: number
}

export interface IFIXOptions extends Options {
  account: string
  username: string
  password: string
  resetSeqNumFlag: 'Y' | 'N'
}

export interface MarketDataRequest {
  market_id: string
}
