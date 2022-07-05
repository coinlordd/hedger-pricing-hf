import { Server } from 'http'
import { parse } from 'url'
import { WebSocket, WebSocketServer } from 'ws'

import logger from './logger'
import MassQuoteManager from '../FIX/managers/MassQuoteManager'

export default (server: Server) => {
  const wssQuote = new WebSocketServer({
    noServer: true,
  })

  server.on('upgrade', (request, socket, head) => {
    const { pathname } = request.url ? parse(request.url) : { pathname: '/' }

    if (pathname === '/v1/quotes') {
      wssQuote.handleUpgrade(request, socket, head, (websocket) => {
        wssQuote.emit('connection', websocket, request)
      })
    } else {
      socket.destroy()
    }
  })

  wssQuote.on('connection', (ws) => {
    try {
      const cachedQuotes = MassQuoteManager.cachedQuotes()
      ws.send(JSON.stringify(cachedQuotes))

      MassQuoteManager.addWebsocketCallback((quotes) => {
        wssQuote.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(quotes))
          }
        })
      })
    } catch (error) {
      logger.error(error)
      return ws.send(JSON.stringify({ error }))
    }
  })
}
