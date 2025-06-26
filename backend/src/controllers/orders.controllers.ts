import { Request, Response, NextFunction } from 'express'
import orderService from '~/services/orders.services'
import { CreateOrderReqBody, GetOrdersReqQuery } from '~/models/requests/orders.request'
import User from '~/models/schemas/User.schema'
import { OrderStatus } from '~/constants/enum'
import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'
import Order from '~/models/schemas/Order.schema'

export const createOrderController = async (
  req: Request<Record<string, never>, unknown, CreateOrderReqBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as User
    const { items } = req.body

    // Calculate total amount
    let total_amount = 0
    for (const item of items) {
      const course = await databaseService.courses.findOne({ _id: ObjectId.createFromHexString(item.course_id) })
      if (!course) {
        throw new Error('Course not found')
      }
      total_amount += course.price
    }

    // Create order with only required fields
    const order = new Order({
      user_id: user._id,
      items: items.map((item) => ({
        course_id: ObjectId.createFromHexString(item.course_id)
      })),
      total_amount,
      status: OrderStatus.Pending
    })

    const result = await databaseService.orders.insertOne(order)

    res.status(201).json({
      message: 'Order created successfully',
      data: {
        order_id: result.insertedId.toString(),
        total_amount
      }
    })
  } catch (error) {
    next(error)
  }
}

export const getOrdersController = async (
  req: Request<Record<string, never>, unknown, unknown, GetOrdersReqQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as User
    const result = await orderService.getOrders(user._id.toString(), req.query)
    res.json({
      message: 'Get orders successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const getOrderByIdController = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User
    const result = await orderService.getOrderById(user._id.toString(), req.params.id)
    res.json({
      message: 'Get order successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const cancelOrderController = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User
    const result = await orderService.cancelOrder(user._id.toString(), req.params.id)
    res.json({
      message: 'Order cancelled successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}
