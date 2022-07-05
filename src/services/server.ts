import express from 'express'

import { PORT } from '../config'
import middleware from '../middleware/index'

export async function initializeServer() {
  const app = express()

  middleware(app)

  const server = app.listen(PORT, () => {
    console.log(`[server]: Running on port ${PORT}`)
  })

  return server
}
