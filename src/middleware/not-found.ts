import { Request, Response } from 'express'

export const notFoundHandler = (request: Request, response: Response) => {
  const message = 'Resource not found'

  response.status(404).json({
    success: false,
    message: message,
  })
}
