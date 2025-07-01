import { Request, Response, NextFunction } from 'express'
import orderService from '~/services/orders.services'
import { CreateOrderReqBody, GetOrdersReqQuery } from '~/models/requests/orders.request'
import User from '~/models/schemas/User.schema'
import { OrderStatus } from '~/constants/enum'
import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'
import Order from '~/models/schemas/Order.schema'

export const createOrderController = async (
  req: Request<Record<string, never>, unknown, { course_ids: string[] }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as User
    const { course_ids } = req.body

    if (!course_ids || course_ids.length === 0) {
      throw new Error('Course IDs are required')
    }

    // Calculate total amount
    let total_amount = 0
    const courses = []

    for (const courseId of course_ids) {
      const course = await databaseService.courses.findOne({ _id: ObjectId.createFromHexString(courseId) })
      if (!course) {
        throw new Error(`Course with ID ${courseId} not found`)
      }
      total_amount += course.price
      courses.push(course)
    }

    // Create order
    const order = new Order({
      user_id: user._id,
      items: course_ids.map((courseId) => ({
        course_id: ObjectId.createFromHexString(courseId)
      })),
      total_amount,
      status: OrderStatus.Pending,
      payment_method: 'vnpay'
    })

    const result = await databaseService.orders.insertOne(order)

    res.status(201).json({
      message: 'Order created successfully',
      data: {
        order_id: result.insertedId.toString(),
        total_amount,
        courses: courses.map((course) => ({
          _id: course._id,
          title: course.title,
          price: course.price
        }))
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
