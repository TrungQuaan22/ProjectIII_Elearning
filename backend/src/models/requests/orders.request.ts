import { OrderStatus } from '~/constants/enum'

export interface AddToCartReqBody {
  course_id: string
}

export interface RemoveFromCartReqBody {
  course_id: string
}

export interface CreateOrderReqBody {
  items: {
    course_id: string
    price: number
  }[]
  payment_method: 'vnpay'
}

export interface UpdateOrderStatusReqBody {
  status: OrderStatus
  payment_status?: 'pending' | 'completed' | 'failed'
  payment_id?: string
}

export interface OrderParams {
  order_id: string
}

export interface CartParams {
  cart_id: string
}

export interface GetOrdersReqQuery {
  page?: string
  limit?: string
  status?: OrderStatus
}

export interface GetUserOrdersReqQuery {
  page?: string
  limit?: string
  status?: OrderStatus
}
