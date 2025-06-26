import { Router } from 'express'
import {
  createOrderController,
  getOrdersController,
  getOrderByIdController,
  cancelOrderController
} from '~/controllers/orders.controllers'
import { accessTokenValidator } from '~/middlewares/users.middlewares'

const ordersRouter = Router()

// Apply access token validator to all routes
ordersRouter.use(accessTokenValidator)

// Create order
ordersRouter.post('/', createOrderController)

// Get all orders
ordersRouter.get('/', getOrdersController)

// Get order by id
ordersRouter.get('/:id', getOrderByIdController)

// Cancel order
ordersRouter.put('/:id/cancel', cancelOrderController)

export default ordersRouter
