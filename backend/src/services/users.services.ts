import User from '~/models/schemas/User.schema'
import databaseService from './database.services'
import { RegisterReqBody, LoginReqBody } from '~/models/requests/users.request'
import { signToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enum'
import { ErrorWithStatus } from '~/models/Errors'
import { ObjectId } from 'mongodb'

class UserService {
  private signAccessToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.AccessToken },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: {
        algorithm: 'HS256',
        expiresIn: '1d'
      }
    })
  }

  private signRefreshToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.RefreshToken },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: {
        algorithm: 'HS256',
        expiresIn: '7d'
      }
    })
  }

  async register(payload: RegisterReqBody) {
    const result = await databaseService.users.insertOne(
      new User({ ...payload, date_of_birth: new Date(payload.date_of_birth) })
    )
    return result.insertedId.toString()
  }

  async login(payload: LoginReqBody) {
    const user = await databaseService.users.findOne({
      email: payload.email,
      password: payload.password // Password đã được hash trong middleware
    })

    if (!user) {
      throw new ErrorWithStatus({
        message: 'Email or password is incorrect',
        status: 401
      })
    }

    const user_id = user._id.toString()
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(user_id),
      this.signRefreshToken(user_id)
    ])

    // Get cart with course details
    const cartWithDetails = await Promise.all(
      user.cart.map(async (item: any) => {
        const course = await databaseService.courses.findOne({ _id: item.course_id })
        return {
          course_id: item.course_id.toString(),
          added_at: item.added_at.toISOString(),
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

    return {
      access_token: accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        cart: cartWithDetails
      }
    }
  }

  async findByEmail(email: string) {
    const result = await databaseService.users.findOne({ email })
    return Boolean(result)
  }

  async getMe(user_id: string) {
    const user = await databaseService.users.findOne(
      { _id: new ObjectId(user_id) },
      {
        projection: {
          password: 0, // Loại bỏ password
          email_verify_token: 0, // Loại bỏ token xác thực email
          forgot_password_token: 0 // Loại bỏ token quên mật khẩu
        }
      }
    )

    if (!user) {
      throw new ErrorWithStatus({
        message: 'User not found',
        status: 404
      })
    }

    // Get cart with course details
    const cartWithDetails = await Promise.all(
      user.cart.map(async (item: any) => {
        const course = await databaseService.courses.findOne({ _id: item.course_id })
        return {
          course_id: item.course_id.toString(),
          added_at: item.added_at.toISOString(),
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

    return {
      message: 'Lấy thông tin user thành công',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          cart: cartWithDetails,
          created_at: user.created_at,
          updated_at: user.updated_at
        }
      }
    }
  }

  async logout(user_id: string) {
    // Có thể thêm logic để blacklist token hoặc xóa refresh token từ database
    // Hiện tại chỉ trả về thông báo logout thành công
    return {
      message: 'Logout successful'
    }
  }
}

const userService = new UserService()
export default userService
