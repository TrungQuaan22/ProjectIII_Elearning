import { Request, Response, NextFunction } from 'express'
import vnpayService from '~/services/vnpay.services'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'
import { ErrorWithStatus } from '~/models/Errors'

export const createVNPayPaymentController = async (
  req: Request<{ order_id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as User
    const { order_id } = req.params

    // Get order total amount
    const order = await databaseService.orders.findOne({
      _id: new ObjectId(order_id),
      user_id: user._id
    })

    if (!order) {
      throw new ErrorWithStatus({
        message: 'Order not found',
        status: 404
      })
    }

    // Get real IP address
    const ipAddr =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || '127.0.0.1'

    const paymentUrl = await vnpayService.createPaymentUrl(
      order_id,
      user._id.toString(),
      order.total_amount,
      Array.isArray(ipAddr) ? ipAddr[0] : ipAddr
    )

    res.json({
      message: 'Create payment URL successfully',
      data: { payment_url: paymentUrl }
    })
  } catch (error) {
    next(error)
  }
}

export const vnpayCallbackController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await vnpayService.verifyReturnUrl(req.query)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export const vnpayIPNController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await vnpayService.verifyIPN(req.query)
    res.json(result)
  } catch (error) {
    next(error)
  }
}
