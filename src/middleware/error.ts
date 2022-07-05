import { Request, Response, NextFunction } from 'express'

class HttpException extends Error {
  statusCode?: number
  status?: number
  message: string
  error: string | null

  constructor(statusCode: number, message: string, error?: string) {
    super(message)

    this.statusCode = statusCode
    this.message = message
    this.error = error || null
  }
}

export const errorHandler = (error: HttpException, request: Request, response: Response, next: NextFunction) => {
  const status = error.statusCode || error.status || 500

  response.status(status).json({
    success: false,
    message: error.message,
  })
}
