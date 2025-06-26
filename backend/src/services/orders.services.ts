import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import { CreateOrderReqBody, GetOrdersReqQuery } from '~/models/requests/orders.request'
import { ErrorWithStatus } from '~/models/Errors'
import { OrderStatus } from '~/constants/enum'
import Order from '~/models/schemas/Order.schema'

class OrderService {
  async createOrder(user_id: string, payload: CreateOrderReqBody) {
    // Get user's cart
    const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
    if (!user) {
      throw new ErrorWithStatus({
        message: 'User not found',
        status: 404
      })
    }

    if (!user.cart || user.cart.length === 0) {
      throw new ErrorWithStatus({
        message: 'Cart is empty',
        status: 400
      })
    }

    // Get course details and calculate total amount
    const courseIds = user.cart.map((item) => item.course_id)
    const courses = await databaseService.courses.find({ _id: { $in: courseIds } }).toArray()

    if (courses.length !== courseIds.length) {
      throw new ErrorWithStatus({
        message: 'Some courses not found',
        status: 404
      })
    }

    const total_amount = courses.reduce((sum, course) => sum + course.price, 0)

    // Create order
    const order = new Order({
      user_id: new ObjectId(user_id),
      items: user.cart,
      total_amount,
      payment_method: payload.payment_method,
      shipping_address: payload.shipping_address,
      note: payload.note,
      status: OrderStatus.Pending
    })

    const result = await databaseService.orders.insertOne(order)

    // Clear user's cart
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          cart: [],
          updated_at: new Date()
        }
      }
    )

    return {
      _id: result.insertedId,
      ...order
    }
  }

  async getOrders(user_id: string, query: GetOrdersReqQuery) {
    const { page = '1', limit = '10', status } = query
    const skip = (Number(page) - 1) * Number(limit)
    const match: any = { user_id: new ObjectId(user_id) }

    if (status) {
      match.status = status
    }

    const [orders, total] = await Promise.all([
      databaseService.orders.find(match).sort({ created_at: -1 }).skip(skip).limit(Number(limit)).toArray(),
      databaseService.orders.countDocuments(match)
    ])

    // Get course details for each order
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const courseIds = order.items.map((item) => item.course_id)
        const courses = await databaseService.courses.find({ _id: { $in: courseIds } }).toArray()

        return {
          ...order,
          items: order.items.map((item) => {
            const course = courses.find((c) => c._id.toString() === item.course_id.toString())
            return {
              ...item,
              course: course
                ? {
                    title: course.title,
                    thumbnail: course.thumbnail,
                    price: course.price
                  }
                : null
            }
          })
        }
      })
    )

    return {
      orders: ordersWithDetails,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        total_pages: Math.ceil(total / Number(limit))
      }
    }
  }

  async getOrderById(user_id: string, order_id: string) {
    const order = await databaseService.orders.findOne({
      _id: new ObjectId(order_id),
      user_id: new ObjectId(user_id)
    })

    if (!order) {
      throw new ErrorWithStatus({
        message: 'Order not found',
        status: 404
      })
    }

    // Get course details
    const courseIds = order.items.map((item) => item.course_id)
    const courses = await databaseService.courses.find({ _id: { $in: courseIds } }).toArray()

    return {
      ...order,
      items: order.items.map((item) => {
        const course = courses.find((c) => c._id.toString() === item.course_id.toString())
        return {
          ...item,
          course: course
            ? {
                title: course.title,
                thumbnail: course.thumbnail,
                price: course.price
              }
            : null
        }
      })
    }
  }

  async cancelOrder(user_id: string, order_id: string) {
    const order = await databaseService.orders.findOne({
      _id: new ObjectId(order_id),
      user_id: new ObjectId(user_id)
    })

    if (!order) {
      throw new ErrorWithStatus({
        message: 'Order not found',
        status: 404
      })
    }

    if (order.status !== OrderStatus.Pending) {
      throw new ErrorWithStatus({
        message: 'Cannot cancel order that is not pending',
        status: 400
      })
    }

    const result = await databaseService.orders.findOneAndUpdate(
      {
        _id: new ObjectId(order_id),
        user_id: new ObjectId(user_id)
      },
      {
        $set: {
          status: OrderStatus.Cancelled,
          updated_at: new Date()
        }
      },
      { returnDocument: 'after' }
    )

    return result
  }
}

const orderService = new OrderService()
export default orderService
