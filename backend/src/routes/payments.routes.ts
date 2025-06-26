import { Router } from 'express'
import { createVNPayPaymentController, vnpayCallbackController } from '~/controllers/payments.controllers'
import { accessTokenValidator } from '~/middlewares/users.middlewares'

const paymentsRouter = Router()

// VNPAY routes
paymentsRouter.post('/vnpay/:order_id', accessTokenValidator, createVNPayPaymentController)
paymentsRouter.get('/vnpay/callback', vnpayCallbackController)

export default paymentsRouter
