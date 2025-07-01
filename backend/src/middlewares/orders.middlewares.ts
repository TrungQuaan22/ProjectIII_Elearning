import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'
import User from '~/models/schemas/User.schema'

export const createOrderValidator = validate(
  checkSchema(
    {
      payment_method: {
        notEmpty: {
          errorMessage: 'Payment method is required'
        },
        isString: {
          errorMessage: 'Payment method must be a string'
        },
        isIn: {
          options: [['credit_card', 'paypal', 'bank_transfer']],
          errorMessage: 'Payment method must be one of: credit_card, paypal, bank_transfer'
        }
      },
      shipping_address: {
        notEmpty: {
          errorMessage: 'Shipping address is required'
        },
        isString: {
          errorMessage: 'Shipping address must be a string'
        }
      },
      note: {
        optional: true,
        isString: {
          errorMessage: 'Note must be a string'
        }
      }
    },
    ['body']
  )
)

export const orderIdValidator = async (req: Request, res: Response, next: NextFunction) => {
  const order = await databaseService.orders.findOne({
    _id: new ObjectId(req.params.id)
  })

  if (!order) {
    throw new ErrorWithStatus({
      message: 'Order not found',
      status: 404
    })
  }

  // Check if user is authorized to access this order
  const user = req.user as User
  if (!user || order.user_id.toString() !== user._id.toString()) {
    throw new ErrorWithStatus({
      message: 'Access denied',
      status: 403
    })
  }

  next()
}
