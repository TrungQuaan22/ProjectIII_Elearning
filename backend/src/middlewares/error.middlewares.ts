import { Request, Response, NextFunction } from 'express'
import { ErrorWithStatus } from '~/models/Errors'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ErrorWithStatus) {
    return res.status(err.status).json({
      message: err.message
    })
  }

  // Nếu không lọt vào if ở trên thì nó là lỗi mặc định
  // set name, stack về undefined để tránh lộ thông tin nhạy cảm
  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, { enumerable: true })
  })

  res.status(500).json({
    message: err.message
  })
}
