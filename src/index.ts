require('dotenv').config()
require('./FIX')

import startup from './services/startup'
import logger from './services/logger'
import { initializeServer } from './services/server'
import initializeWebsockets from './services/websockets'

async function main() {
  try {
    await startup()
    const server = await initializeServer()
    initializeWebsockets(server)
  } catch (error) {
    logger.error(error)
  }
}

main()
