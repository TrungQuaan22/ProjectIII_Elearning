import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { CourseStatus } from '~/constants/enum'

export const createCourseValidator = validate(
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
      description: {
        notEmpty: {
          errorMessage: 'Description is required'
        },
        isString: {
          errorMessage: 'Description must be a string'
        },
        trim: true,
        isLength: {
          options: {
            min: 1,
            max: 500
          },
          errorMessage: 'Description must be between 1 and 500 characters'
        }
      },
      detailed_description: {
        notEmpty: {
          errorMessage: 'Detailed description is required'
        },
        isString: {
          errorMessage: 'Detailed description must be a string'
        },
        trim: true
      },
      thumbnail: {
        notEmpty: {
          errorMessage: 'Thumbnail is required'
        },
        isString: {
          errorMessage: 'Thumbnail must be a string'
        },
        trim: true,
        isURL: {
          errorMessage: 'Thumbnail must be a valid URL'
        }
      },
      price: {
        notEmpty: {
          errorMessage: 'Price is required'
        },
        isNumeric: {
          errorMessage: 'Price must be a number'
        },
        custom: {
          options: (value) => {
            if (value < 0) {
              throw new Error('Price must be greater than or equal to 0')
            }
            return true
          }
        }
      },
      status: {
        optional: true,
        isIn: {
          options: [Object.values(CourseStatus)],
          errorMessage: 'Status must be either draft or published'
        }
      }
    },
    ['body']
  )
)

export const createTopicValidator = validate(
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
      summary: {
        notEmpty: {
          errorMessage: 'Summary is required'
        },
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
      }
    },
    ['body']
  )
)

export const createLessonValidator = validate(
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
      description: {
        notEmpty: {
          errorMessage: 'Description is required'
        },
        isString: {
          errorMessage: 'Description must be a string'
        },
        trim: true,
        isLength: {
          options: {
            min: 1,
            max: 500
          },
          errorMessage: 'Description must be between 1 and 500 characters'
        }
      },
      duration: {
        notEmpty: {
          errorMessage: 'Duration is required'
        },
        isNumeric: {
          errorMessage: 'Duration must be a number'
        },
        custom: {
          options: (value) => {
            if (value < 0) {
              throw new Error('Duration must be greater than or equal to 0')
            }
            return true
          }
        }
      },
      video_url: {
        notEmpty: {
          errorMessage: 'Video URL is required'
        },
        isString: {
          errorMessage: 'Video URL must be a string'
        },
        trim: true,
        isURL: {
          errorMessage: 'Video URL must be a valid URL'
        }
      }
    },
    ['body']
  )
)

export const updateCourseValidator = validate(
  checkSchema(
    {
      title: {
        optional: true,
        isString: {
          errorMessage: 'Title must be a string'
        },
        trim: true,
        isLength: {
          options: { min: 1, max: 200 },
          errorMessage: 'Title must be between 1 and 200 characters'
        }
      },
      description: {
        optional: true,
        isString: {
          errorMessage: 'Description must be a string'
        },
        trim: true,
        isLength: {
          options: { min: 1, max: 500 },
          errorMessage: 'Description must be between 1 and 500 characters'
        }
      },
      detailed_description: {
        optional: true,
        isString: {
          errorMessage: 'Detailed description must be a string'
        },
        trim: true
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
      price: {
        optional: true,
        isNumeric: {
          errorMessage: 'Price must be a number'
        },
        custom: {
          options: (value) => {
            if (value < 0) {
              throw new Error('Price must be greater than or equal to 0')
            }
            return true
          }
        }
      },
      status: {
        optional: true,
        isIn: {
          options: [Object.values(CourseStatus)],
          errorMessage: 'Status must be either draft or published'
        }
      }
    },
    ['body']
  )
)

export const updateTopicValidator = validate(
  checkSchema(
    {
      title: {
        optional: true,
        isString: {
          errorMessage: 'Title must be a string'
        },
        trim: true,
        isLength: {
          options: { min: 1, max: 200 },
          errorMessage: 'Title must be between 1 and 200 characters'
        }
      },
      summary: {
        optional: true,
        isString: {
          errorMessage: 'Summary must be a string'
        },
        trim: true,
        isLength: {
          options: { min: 1, max: 500 },
          errorMessage: 'Summary must be between 1 and 500 characters'
        }
      }
    },
    ['body']
  )
)

export const updateLessonValidator = validate(
  checkSchema(
    {
      title: {
        optional: true,
        isString: {
          errorMessage: 'Title must be a string'
        },
        trim: true,
        isLength: {
          options: { min: 1, max: 200 },
          errorMessage: 'Title must be between 1 and 200 characters'
        }
      },
      description: {
        optional: true,
        isString: {
          errorMessage: 'Description must be a string'
        },
        trim: true,
        isLength: {
          options: { min: 1, max: 500 },
          errorMessage: 'Description must be between 1 and 500 characters'
        }
      },
      duration: {
        optional: true,
        isNumeric: {
          errorMessage: 'Duration must be a number'
        },
        custom: {
          options: (value) => {
            if (value < 0) {
              throw new Error('Duration must be greater than or equal to 0')
            }
            return true
          }
        }
      },
      video_url: {
        optional: true,
        isString: {
          errorMessage: 'Video URL must be a string'
        },
        trim: true,
        isURL: {
          errorMessage: 'Video URL must be a valid URL'
        }
      }
    },
    ['body']
  )
)
