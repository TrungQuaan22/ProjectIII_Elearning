import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import { ErrorWithStatus } from '~/models/Errors'
import { Item } from '~/models/schemas/User.schema'

interface CartItemWithDetails extends Item {
  course: {
    title: string
    thumbnail: string
    price: number
  } | null
}

class CartService {
  async addToCart(user_id: string, course_id: string) {
    // Check if course exists
    const course = await databaseService.courses.findOne({ _id: new ObjectId(course_id) })
    if (!course) {
      throw new ErrorWithStatus({
        message: 'Course not found',
        status: 404
      })
    }

    // Check if course already in cart
    const user = await databaseService.users.findOne({
      _id: new ObjectId(user_id),
      'cart.course_id': new ObjectId(course_id)
    })

    if (user) {
      throw new ErrorWithStatus({
        message: 'Course already in cart',
        status: 400
      })
    }

    const result = await databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      {
        $push: {
          cart: {
            course_id: new ObjectId(course_id),
            added_at: new Date()
          }
        },
        $set: { updated_at: new Date() }
      },
      { returnDocument: 'after' }
    )

    if (!result) {
      throw new ErrorWithStatus({
        message: 'User not found',
        status: 404
      })
    }

    return result.cart
  }

  async removeFromCart(user_id: string, course_id: string) {
    const result = await databaseService.users.findOneAndUpdate(
      {
        _id: new ObjectId(user_id),
        'cart.course_id': new ObjectId(course_id)
      },
      {
        $pull: {
          cart: { course_id: new ObjectId(course_id) }
        },
        $set: { updated_at: new Date() }
      },
      { returnDocument: 'after' }
    )

    if (!result) {
      throw new ErrorWithStatus({
        message: 'User or course not found in cart',
        status: 404
      })
    }

    return result.cart
  }

  async getCart(user_id: string): Promise<CartItemWithDetails[]> {
    const user = await databaseService.users.findOne({
      _id: new ObjectId(user_id)
    })

    if (!user) {
      throw new ErrorWithStatus({
        message: 'User not found',
        status: 404
      })
    }

    // Get course details for each item in cart
    const cartWithDetails = await Promise.all(
      user.cart.map(async (item: Item) => {
        const course = await databaseService.courses.findOne({ _id: item.course_id })
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
    )

    return cartWithDetails
  }

  async clearCart(user_id: string) {
    const result = await databaseService.users.findOneAndUpdate(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          cart: [],
          updated_at: new Date()
        }
      },
      { returnDocument: 'after' }
    )

    if (!result) {
      throw new ErrorWithStatus({
        message: 'User not found',
        status: 404
      })
    }

    return result.cart
  }
}

const cartService = new CartService()
export default cartService
