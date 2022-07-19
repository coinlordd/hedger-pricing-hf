import { Server } from 'http'
import { parse } from 'url'
import { WebSocket as WebSocketBase, WebSocketServer } from 'ws'

import logger from './logger'
import MassQuoteManager from '../FIX/managers/MassQuoteManager'

interface WebSocket extends WebSocketBase {
  isAlive: boolean
}

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

  wssQuote.on('connection', (ws: WebSocket) => {
    try {
      // Attach event handler to mark this client as alive when pinged.
      ws.isAlive = true
      ws.on('pong', () => (ws.isAlive = true))

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

  const interval = setInterval(() => {
    wssQuote.clients.forEach((wsBase) => {
      const ws = wsBase as WebSocket
      if (!ws.isAlive) {
        ws.terminate()
        return
      }

      ws.isAlive = false
      ws.ping(null, undefined)
    })
  }, 10000)

  wssQuote.on('close', () => {
    clearInterval(interval)
  })
}
