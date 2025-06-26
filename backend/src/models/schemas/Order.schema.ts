import { ObjectId } from 'mongodb'
import { OrderStatus } from '~/constants/enum'

interface OrderItem {
  course_id: ObjectId
}

interface OrderType {
  _id?: ObjectId
  user_id: ObjectId
  items: OrderItem[]
  total_amount: number
  status: OrderStatus
  payment_method?: string
  payment_id?: string
  created_at?: Date
  updated_at?: Date
}

export default class Order {
  _id: ObjectId
  user_id: ObjectId
  items: OrderItem[]
  total_amount: number
  status: OrderStatus
  payment_method: string
  payment_id: string
  created_at: Date
  updated_at: Date

  constructor(order: OrderType) {
    const date = new Date()
    this._id = order._id || new ObjectId()
    this.user_id = order.user_id
    this.items = order.items
    this.total_amount = order.total_amount
    this.status = order.status
    this.payment_method = order.payment_method || ''
    this.payment_id = order.payment_id || ''
    this.created_at = order.created_at || date
    this.updated_at = order.updated_at || date
  }
}
