import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'
import User from '~/models/schemas/User.schema'

// Validate course_id
const courseIdSchema = {
  notEmpty: {
    errorMessage: 'Course ID is required'
  },
  isString: {
    errorMessage: 'Course ID must be a string'
  },
  custom: {
    options: async (value: string) => {
      if (!ObjectId.isValid(value)) {
        throw new Error('Invalid course ID format')
      }
      const course = await databaseService.courses.findOne({ _id: new ObjectId(value) })
      if (!course) {
        throw new Error('Course not found')
      }
      return true
    }
  }
}

// Validate quantity
const quantitySchema = {
  isInt: {
    options: { min: 1 },
    errorMessage: 'Quantity must be a positive integer'
  }
}

// Validate add to cart
export const addToCartValidator = validate(
  checkSchema(
    {
      course_id: courseIdSchema
    },
    ['body']
  )
)

// Validate remove from cart
export const removeFromCartValidator = validate(
  checkSchema(
    {
      course_id: courseIdSchema
    },
    ['body']
  )
)

// Validate update cart item
export const updateCartItemValidator = validate(
  checkSchema(
    {
      course_id: courseIdSchema,
      quantity: quantitySchema
    },
    ['body']
  )
)

// Check if course is already in cart
export const checkCourseInCart = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User
  const { course_id } = req.body

  const cartItem = user.cart?.find((item) => item.course_id.toString() === course_id)
  if (cartItem) {
    throw new ErrorWithStatus({
      message: 'Course already in cart',
      status: 400
    })
  }
  next()
}

// Check if course exists in cart
export const checkCourseExistsInCart = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User
  const { course_id } = req.body

  const cartItem = user.cart?.find((item) => item.course_id.toString() === course_id)
  if (!cartItem) {
    throw new ErrorWithStatus({
      message: 'Course not found in cart',
      status: 404
    })
  }
  next()
}

// Check if user has enrolled course
export const checkEnrolledCourse = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User
  const { course_id } = req.body

  const isEnrolled = await databaseService.enrollments.findOne({
    user_id: user._id,
    course_id: new ObjectId(course_id)
  })

  if (isEnrolled) {
    throw new ErrorWithStatus({
      message: 'You have already enrolled this course',
      status: 400
    })
  }
  next()
}
