import { ErrorWithStatus } from '~/models/Errors'
import { OrderStatus } from '~/constants/enum'
import databaseService from './database.services'
import { ObjectId } from 'mongodb'
import Enrollment, { EnrollmentStatus } from '~/models/schemas/Enrollment.schema'
import crypto from 'crypto'
import moment from 'moment'
import qs from 'qs'

// Helper function to sort object parameters (required by VNPay)
function sortObject(obj: Record<string, any>) {
  const sorted: Record<string, any> = {}
  const str: string[] = []

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      str.push(encodeURIComponent(key))
    }
  }

  str.sort()

  for (let i = 0; i < str.length; i++) {
    sorted[str[i]] = encodeURIComponent(obj[str[i]]).replace(/%20/g, '+')
  }

  return sorted
}

class VNPayService {
  async createPaymentUrl(order_id: string, user_id: string, amount: number, ipAddr: string = '127.0.0.1') {
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

    // Set timezone
    process.env.TZ = 'Asia/Ho_Chi_Minh'

    const date = new Date()
    const createDate = moment(date).format('YYYYMMDDHHmmss')

    // VNPay configuration
    const tmnCode = process.env.VNPAY_TMN_CODE as string
    const secretKey = process.env.VNPAY_SECURE_SECRET as string
    const vnpUrl = process.env.VNPAY_HOST as string

    // Use hardcoded return URL for testing
    const returnUrl = 'http://localhost:3000/payment/vnpay/callback'

    console.log('Debug VNPay URL creation:')
    console.log('CLIENT_URL from env:', process.env.CLIENT_URL)
    console.log('Return URL:', returnUrl)

    // Create VNPay parameters
    const vnp_Params: Record<string, any> = {}
    vnp_Params['vnp_Version'] = '2.1.0'
    vnp_Params['vnp_Command'] = 'pay'
    vnp_Params['vnp_TmnCode'] = tmnCode
    vnp_Params['vnp_Locale'] = 'vn'
    vnp_Params['vnp_CurrCode'] = 'VND'
    vnp_Params['vnp_TxnRef'] = order_id
    vnp_Params['vnp_OrderInfo'] = `Thanh toan don hang ${order_id}`
    vnp_Params['vnp_OrderType'] = 'other'
    vnp_Params['vnp_Amount'] = amount * 100 // Convert to smallest currency unit
    vnp_Params['vnp_ReturnUrl'] = returnUrl
    vnp_Params['vnp_IpAddr'] = ipAddr
    vnp_Params['vnp_CreateDate'] = createDate

    console.log('VNPay parameters before sorting:', vnp_Params)

    // Sort parameters
    const sortedParams = sortObject(vnp_Params)

    // Create query string using qs library (same as VNPay example)
    const signData = qs.stringify(sortedParams, { encode: false })

    console.log('Sign data:', signData)

    // Create secure hash
    const hmac = crypto.createHmac('sha512', secretKey)
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')

    console.log('Secure hash:', signed)

    // Add secure hash to parameters
    sortedParams['vnp_SecureHash'] = signed

    // Create final URL
    const finalUrl = vnpUrl + '?' + qs.stringify(sortedParams, { encode: false })

    console.log('Final VNPay URL:', finalUrl)

    return finalUrl
  }

  async verifyReturnUrl(vnpParams: Record<string, any>) {
    const secureHash = vnpParams['vnp_SecureHash']

    // Remove secure hash from parameters for verification
    delete vnpParams['vnp_SecureHash']
    delete vnpParams['vnp_SecureHashType']

    // Sort parameters
    const sortedParams = sortObject(vnpParams)

    // Create query string
    const signData = qs.stringify(sortedParams, { encode: false })

    // Create secure hash for verification
    const secretKey = process.env.VNPAY_SECURE_SECRET as string
    const hmac = crypto.createHmac('sha512', secretKey)
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')

    // Verify signature
    if (secureHash !== signed) {
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

      // Remove courses from user's cart
      const courseIds = order.items.map((item) => item.course_id)
      await databaseService.users.updateOne(
        { _id: order.user_id },
        {
          $pull: {
            cart: {
              course_id: { $in: courseIds }
            }
          },
          $set: {
            updated_at: new Date()
          }
        }
      )

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

  async verifyIPN(vnpParams: Record<string, any>) {
    const secureHash = vnpParams['vnp_SecureHash']
    const orderId = vnpParams['vnp_TxnRef']
    const rspCode = vnpParams['vnp_ResponseCode']

    // Remove secure hash from parameters for verification
    delete vnpParams['vnp_SecureHash']
    delete vnpParams['vnp_SecureHashType']

    // Sort parameters
    const sortedParams = sortObject(vnpParams)

    // Create query string
    const signData = qs.stringify(sortedParams, { encode: false })

    // Create secure hash for verification
    const secretKey = process.env.VNPAY_SECURE_SECRET as string
    const hmac = crypto.createHmac('sha512', secretKey)
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')

    // Verify signature
    if (secureHash !== signed) {
      return { RspCode: '97', Message: 'Checksum failed' }
    }

    // Check if order exists
    const order = await databaseService.orders.findOne({ _id: new ObjectId(orderId) })
    if (!order) {
      return { RspCode: '01', Message: 'Order not found' }
    }

    // Check if order is still pending (not processed yet)
    if (order.status !== OrderStatus.Pending) {
      return { RspCode: '02', Message: 'This order has been updated to the payment status' }
    }

    if (rspCode === '00') {
      // Payment successful
      await databaseService.orders.updateOne(
        { _id: new ObjectId(orderId) },
        {
          $set: {
            status: OrderStatus.Completed,
            payment_id: vnpParams.vnp_TransactionNo,
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

      // Remove courses from user's cart
      const courseIds = order.items.map((item) => item.course_id)
      await databaseService.users.updateOne(
        { _id: order.user_id },
        {
          $pull: {
            cart: {
              course_id: { $in: courseIds }
            }
          },
          $set: {
            updated_at: new Date()
          }
        }
      )

      return { RspCode: '00', Message: 'Success' }
    } else {
      // Payment failed
      await databaseService.orders.updateOne(
        { _id: new ObjectId(orderId) },
        {
          $set: {
            status: OrderStatus.Failed,
            payment_id: vnpParams.vnp_TransactionNo,
            updated_at: new Date()
          }
        }
      )

      return { RspCode: '00', Message: 'Success' }
    }
  }
}

const vnpayService = new VNPayService()
export default vnpayService
