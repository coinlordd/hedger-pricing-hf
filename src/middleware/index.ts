import express, { Express } from 'express'
import compression from 'compression'
import helmet from 'helmet'

import { errorHandler } from './error'
import { notFoundHandler } from './not-found'
import { infoRouter } from '../routes/info/router'

export default (app: Express) => {
  app.use(compression())
  app.use(helmet())
  app.use(express.json())

  app.use('/v1', infoRouter)

  app.use(errorHandler)
  app.use(notFoundHandler)
}
