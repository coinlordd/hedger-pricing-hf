import { Protocol } from 'fixparser'
import { ClientOptions, IFIXOptions } from '../FIX/interface'

export const PORT = parseInt((process.env.PORT as string) || '9000', 10)

export const clientOptions: ClientOptions = {
  verbose: true,
  reconnectFrequency: 10000,
}

export const license = process.env.FIXPARSER_LICENSE!

export const FIXOptions: IFIXOptions = {
  account: process.env.FIX_PRICING_ACCOUNT!,
  username: process.env.FIX_PRICING_USERNAME!,
  password: process.env.FIX_PRICING_PASSWORD!,
  host: process.env.FIX_PRICING_HOST,
  port: parseInt(process.env.FIX_PRICING_PORT!, 10),
  sender: process.env.FIX_PRICING_SENDER,
  target: process.env.FIX_PRICING_TARGET,
  protocol: 'tcp' as Protocol,
  fixVersion: 'FIX.4.4',
  logging: process.env.NODE_ENV !== 'production',
  resetSeqNumFlag: 'Y',
  heartbeatIntervalSeconds: 20,
}
