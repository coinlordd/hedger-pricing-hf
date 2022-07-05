export enum Sector {
  STOCK = 'stock',
  FOREX = 'forex',
  CRYPTO = 'crypto',
}

export interface Market {
  market_id: string // EURUSD.E
  ticker: string // EUR
  currency: string // USD
  description: string // Euro/US Dollar
  sector: Sector
}

export const SUPPORTED_MARKETS: Market[] = [
  { market_id: 'EURUSD', ticker: 'EUR', currency: 'USD', description: 'Euro/US Dollar', sector: Sector.FOREX },
  { market_id: 'EURCHF', ticker: 'EUR', currency: 'CHF', description: 'Euro/Swiss Franc', sector: Sector.FOREX },
  {
    market_id: 'AUDUSD',
    ticker: 'AUD',
    currency: 'USD',
    description: 'Australian Dollar/US Dollar',
    sector: Sector.FOREX,
  },
  {
    market_id: 'AUDCHF',
    ticker: 'AUD',
    currency: 'CHF',
    description: 'Australian Dollar/Swiss Franc',
    sector: Sector.FOREX,
  },
  {
    market_id: 'AUDCAD',
    ticker: 'AUD',
    currency: 'CAD',
    description: 'Australian Dollar/Canadian Dollar',
    sector: Sector.FOREX,
  },
]
