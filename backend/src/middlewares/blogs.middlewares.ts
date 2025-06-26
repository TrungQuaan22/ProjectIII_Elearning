import { Request, Response, NextFunction } from 'express'
import { UserRole } from '~/constants/enum'
import User from '~/models/schemas/User.schema'
import { validate } from '~/utils/validation'
import { checkSchema } from 'express-validator'
import { BlogStatus } from '~/constants/enum'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User
  if (user.role !== UserRole.Admin) {
    return res.status(403).json({ message: 'Access denied. Admin only.' })
  }
  next()
}

export const createBlogValidator = validate(
  checkSchema(
    {
      title: {
        notEmpty: {
          errorMessage: 'Title is required'
        },
        isString: {
          errorMessage: 'Title must be a string'
        },
        trim: true,
        isLength: {
          options: {
            min: 1,
            max: 200
          },
          errorMessage: 'Title must be between 1 and 200 characters'
        }
      },
      content: {
        notEmpty: {
          errorMessage: 'Content is required'
        },
        isString: {
          errorMessage: 'Content must be a string'
        },
        trim: true,
        isLength: {
          options: {
            min: 1,
            max: 10000
          },
          errorMessage: 'Content must be between 1 and 10000 characters'
        }
      },
      summary: {
        optional: true,
        isString: {
          errorMessage: 'Summary must be a string'
        },
        trim: true,
        isLength: {
          options: {
            min: 1,
            max: 500
          },
          errorMessage: 'Summary must be between 1 and 500 characters'
        }
      },
      tags: {
        optional: true,
        isArray: {
          errorMessage: 'Tags must be an array'
        },
        custom: {
          options: (value) => {
            if (!Array.isArray(value)) return false
            if (value.length === 0) return false
            if (value.some((tag) => typeof tag !== 'string')) return false
            if (value.some((tag) => tag.length === 0)) return false
            return true
          },
          errorMessage: 'Tags must be an array of non-empty strings'
        }
      },
      thumbnail: {
        optional: true,
        isString: {
          errorMessage: 'Thumbnail must be a string'
        },
        trim: true,
        isURL: {
          errorMessage: 'Thumbnail must be a valid URL'
        }
      },
      status: {
        optional: true,
        isIn: {
          options: [Object.values(BlogStatus)],
          errorMessage: 'Invalid status value'
        }
      },
      category_id: {
        notEmpty: {
          errorMessage: 'category_id is required'
        },
        custom: {
          options: (value) => {
            // Check valid ObjectId
            return typeof value === 'string' && value.length === 24
          },
          errorMessage: 'category_id must be a valid ObjectId'
        }
      }
    },
    ['body']
  )
)

export const updateBlogValidator = validate(
  checkSchema(
    {
      title: {
        optional: true,
        isString: {
          errorMessage: 'Title must be a string'
        },
        trim: true,
        isLength: {
          options: {
            min: 1,
            max: 200
          },
          errorMessage: 'Title must be between 1 and 200 characters'
        }
      },
      content: {
        optional: true,
        isString: {
          errorMessage: 'Content must be a string'
        },
        trim: true,
        isLength: {
          options: {
            min: 1,
            max: 10000
          },
          errorMessage: 'Content must be between 1 and 10000 characters'
        }
      },
      summary: {
        optional: true,
        isString: {
          errorMessage: 'Summary must be a string'
        },
        trim: true,
        isLength: {
          options: {
            min: 1,
            max: 500
          },
          errorMessage: 'Summary must be between 1 and 500 characters'
        }
      },
      tags: {
        optional: true,
        isArray: {
          errorMessage: 'Tags must be an array'
        },
        custom: {
          options: (value) => {
            if (!Array.isArray(value)) return false
            if (value.length === 0) return false
            if (value.some((tag) => typeof tag !== 'string')) return false
            if (value.some((tag) => tag.length === 0)) return false
            return true
          },
          errorMessage: 'Tags must be an array of non-empty strings'
        }
      },
      thumbnail: {
        optional: true,
        isString: {
          errorMessage: 'Thumbnail must be a string'
        },
        trim: true,
        isURL: {
          errorMessage: 'Thumbnail must be a valid URL'
        }
      },
      status: {
        optional: true,
        isIn: {
          options: [Object.values(BlogStatus)],
          errorMessage: 'Invalid status value'
        }
      }
    },
    ['body']
  )
)

export const blogIdValidator = validate(
  checkSchema(
    {
      id: {
        custom: {
          options: async (value, { req }) => {
            if (!ObjectId.isValid(value)) {
              throw new ErrorWithStatus({
                message: 'Invalid blog id',
                status: 400
              })
            }
            const blog = await databaseService.blogs.findOne({ _id: new ObjectId(value) })
            if (!blog) {
              throw new ErrorWithStatus({
                message: 'Blog not found',
                status: 404
              })
            }
            req.blog = blog
            return true
          }
        }
      }
    },
    ['params']
  )
)
