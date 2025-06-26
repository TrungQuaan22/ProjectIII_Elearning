import { ErrorWithStatus } from '~/models/Errors'
import { OrderStatus } from '~/constants/enum'
import databaseService from './database.services'
import { ObjectId } from 'mongodb'
import Enrollment, { EnrollmentStatus } from '~/models/schemas/Enrollment.schema'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let vnpay: any

// Initialize VNPay
const initVNPay = async () => {
  const { VNPay } = await import('vnpay')
  vnpay = new VNPay({
    tmnCode: process.env.VNPAY_TMN_CODE as string,
    secureSecret: process.env.VNPAY_SECURE_SECRET as string,
    vnpayHost: process.env.VNPAY_HOST as string,
    queryDrAndRefundHost: process.env.VNPAY_QUERY_DR_REFUND_HOST as string,
    testMode: process.env.NODE_ENV !== 'production',
    hashAlgorithm: 'SHA512',
    enableLog: true
  })
}

// Initialize VNPay when the service starts
initVNPay()

class VNPayService {
  async createPaymentUrl(order_id: string, user_id: string, amount: number) {
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
        message: 'Order is not pending',
        status: 400
      })
    }

    const paymentUrl = await vnpay.buildPaymentUrl({
      vnp_Amount: amount * 100, // Convert to smallest currency unit (VND)
      vnp_Command: 'pay',
      vnp_CreateDate: new Date().toISOString(),
      vnp_CurrCode: 'VND',
      vnp_IpAddr: '127.0.0.1', // TODO: Get real IP from request
      vnp_Locale: 'vn',
      vnp_OrderInfo: `Thanh toan don hang ${order_id}`,
      vnp_OrderType: 'other',
      vnp_ReturnUrl: `${process.env.CLIENT_URL}/payment/vnpay/callback`,
      vnp_TmnCode: process.env.VNPAY_TMN_CODE as string,
      vnp_TxnRef: order_id,
      vnp_Version: '2.1.0'
    })

    return paymentUrl
  }

  async verifyReturnUrl(vnpParams: any) {
    const isValid = await vnpay.verifyReturnUrl(vnpParams)
    if (!isValid) {
      throw new ErrorWithStatus({
        message: 'Invalid payment signature',
        status: 400
      })
    }

    const order_id = vnpParams.vnp_TxnRef
    const rspCode = vnpParams.vnp_ResponseCode
    const transactionNo = vnpParams.vnp_TransactionNo

    // Update order status
    const order = await databaseService.orders.findOne({ _id: new ObjectId(order_id) })
    if (!order) {
      throw new ErrorWithStatus({
        message: 'Order not found',
        status: 404
      })
    }

    if (rspCode === '00') {
      // Payment successful
      await databaseService.orders.updateOne(
        { _id: new ObjectId(order_id) },
        {
          $set: {
            status: OrderStatus.Completed,
            payment_id: transactionNo,
            updated_at: new Date()
          }
        }
      )

      // Create enrollments for each course
      const enrollments = order.items.map(
        (item) =>
          new Enrollment({
            user_id: order.user_id,
            course_id: item.course_id,
            order_id: order._id,
            progress: {
              completed_lessons: [],
              current_lesson: null,
              last_accessed_at: new Date()
            },
            status: 'active' as EnrollmentStatus
          })
      )

      await databaseService.enrollments.insertMany(enrollments)

      return {
        success: true,
        message: 'Payment successful',
        order_id
      }
    } else {
      // Payment failed
      await databaseService.orders.updateOne(
        { _id: new ObjectId(order_id) },
        {
          $set: {
            status: OrderStatus.Failed,
            payment_id: transactionNo,
            updated_at: new Date()
          }
        }
      )

      return {
        success: false,
        message: 'Payment failed',
        order_id
      }
    }
  }
}

const vnpayService = new VNPayService()
export default vnpayService
