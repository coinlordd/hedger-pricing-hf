import { Field, Fields } from 'fixparser'

interface Quote {
  market_id: string
  bidSpotRate: number
  offerSpotRate: number
  bidSize: number
  offerSize: number
}

enum IDError {
  NO_ID = 'NO_ID',
}

interface MassQuote {
  [market_id: string]: Quote
}

class QuoteIDManager {
  private map = new Map<string, number>()

  public getRequestID(platformID: string): number {
    const id = this.map.get(platformID)

    if (id) {
      return id
    }
    const newID = this.map.size + 1
    this.map.set(platformID, newID)
    return newID
  }

  public getPlatformID(requestID: number) {
    for (const [platformID, value] of this.map) {
      if (value == requestID) {
        return platformID
      }
    }
    return undefined
  }
}
const quoteIDManager = new QuoteIDManager()

class MassQuoteManager {
  private cache: MassQuote = {}
  private callback: (massQuote: MassQuote) => void = () => {}

  public onMessage(data: Field[]) {
    const quote = data.reduce((acc, field, i, arr) => {
      if (field.tag === Fields.QuoteSetID) {
        const market_id = this.getPlatformID(field.value as number)
        acc.market_id = market_id ?? IDError.NO_ID
        return acc
      }
      if (field.tag === Fields.BidSpotRate) {
        acc.bidSpotRate = field.value as number
        return acc
      }
      if (field.tag === Fields.OfferSpotRate) {
        acc.offerSpotRate = field.value as number
        return acc
      }
      if (field.tag === Fields.BidSize) {
        acc.bidSize = field.value as number
        return acc
      }
      if (field.tag === Fields.OfferSize) {
        acc.offerSize = field.value as number
        return acc
      }

      return acc
    }, {} as Quote)

    if (quote.market_id === IDError.NO_ID) return

    const newCache: MassQuote = {
      ...this.cache,
      [quote.market_id]: quote,
    }

    this.cache = newCache
    this.callback(newCache)
  }

  public cachedQuotes(): any {
    return this.cache
  }

  public addWebsocketCallback(callback: (massQuote: MassQuote) => void) {
    this.callback = callback
  }

  public getRequestID(market_id: string) {
    return quoteIDManager.getRequestID(market_id)
  }

  public getPlatformID(requestID: number) {
    return quoteIDManager.getPlatformID(requestID)
  }
}

export default new MassQuoteManager()
