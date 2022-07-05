import express, { Request, Response } from 'express'
import { SUPPORTED_MARKETS } from '../../config/markets'

export const infoRouter = express.Router()

infoRouter.get('/markets', async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: SUPPORTED_MARKETS,
  })
})
