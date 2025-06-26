import { Request, Response, NextFunction } from 'express'
import { ParamSchema, checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { UserRole } from '~/constants/enum'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import { hashPassword } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'
import { ObjectId } from 'mongodb'
import User from '~/models/schemas/User.schema'

const passwordSchema: ParamSchema = {
  notEmpty: {
    errorMessage: 'Password is required'
  },
  isString: {
    errorMessage: 'Password must be a string'
  },
  isLength: {
    options: {
      min: 6,
      max: 50
    },
    errorMessage: 'Password must be between 6 and 50 characters'
  },
  isStrongPassword: {
    options: {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    },
    errorMessage: 'Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol'
  }
}

const nameSchema: ParamSchema = {
  notEmpty: {
    errorMessage: 'Name is required'
  },
  isString: {
    errorMessage: 'Name must be a string'
  },
  trim: true,
  isLength: {
    options: {
      min: 1,
      max: 100
    },
    errorMessage: 'Name must be between 1 and 100 characters'
  }
}

const dateOfBirthSchema: ParamSchema = {
  isISO8601: {
    options: {
      strict: true,
      strictSeparator: true
    },
    errorMessage: 'Date of birth must be in ISO8601 format'
  }
}

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        isEmail: {
          errorMessage: 'Invalid email format'
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const user = await databaseService.users.findOne({
              email: value,
              password: hashPassword(req.body.password)
            })
            if (user === null) {
              throw new Error('Email or password is incorrect')
            }
            req.user = user
            return true
          }
        }
      },
      password: passwordSchema
    },
    ['body']
  )
)

export const registerValidator = validate(
  checkSchema(
    {
      name: nameSchema,
      email: {
        isEmail: {
          errorMessage: 'Invalid email format'
        },
        trim: true,
        custom: {
          options: async (value) => {
            const user = await databaseService.users.findOne({ email: value })
            if (user) {
              throw new Error('Email already exists')
            }
            return true
          }
        }
      },
      password: passwordSchema,
      confirm_password: {
        isString: {
          errorMessage: 'Confirm password must be a string'
        },
        custom: {
          options: (value, { req }) => {
            if (value !== req.body.password) {
              throw new Error('Password and confirm password do not match')
            }
            return true
          }
        }
      },
      date_of_birth: dateOfBirthSchema
    },
    ['body']
  )
)

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: 'Access token is required',
                status: 401
              })
            }
            const access_token = value.split(' ')[1]
            if (!access_token) {
              throw new ErrorWithStatus({
                message: 'Access token is required',
                status: 401
              })
            }
            try {
              const decoded = await verifyToken({
                token: access_token,
                secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
              })
              const user = await databaseService.users.findOne({ _id: new ObjectId(decoded.user_id) })
              if (!user) {
                throw new ErrorWithStatus({
                  message: 'User not found',
                  status: 401
                })
              }
              req.user = user
              return true
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: error.message,
                  status: 401
                })
              }
              throw error
            }
          }
        }
      }
    },
    ['headers']
  )
)

export const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User
  if (!user || user.role !== UserRole.Admin) {
    throw new ErrorWithStatus({
      message: 'Access denied. Admin only.',
      status: 403
    })
  }
  next()
}
