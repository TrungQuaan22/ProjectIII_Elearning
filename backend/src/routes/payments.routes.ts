import { Router } from 'express'
import {
  createVNPayPaymentController,
  vnpayCallbackController,
  vnpayIPNController
} from '~/controllers/payments.controllers'
import { accessTokenValidator } from '~/middlewares/users.middlewares'

const paymentsRouter = Router()

// VNPAY routes
paymentsRouter.post('/vnpay/:order_id', accessTokenValidator, createVNPayPaymentController)
paymentsRouter.get('/vnpay/callback', vnpayCallbackController)
paymentsRouter.get('/vnpay/ipn', vnpayIPNController)

export default paymentsRouter
