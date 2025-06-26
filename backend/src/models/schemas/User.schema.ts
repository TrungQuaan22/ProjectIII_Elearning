import { ObjectId } from 'mongodb'
import { UserVerifyStatus, UserRole } from '~/constants/enum'
import { Item } from './Item.schema'

interface UserType {
  _id?: ObjectId
  name?: string
  email: string
  date_of_birth?: Date
  password: string
  created_at?: Date
  updated_at?: Date
  email_verify_token?: string // jwt hoặc '' nếu đã xác thực email
  forgot_password_token?: string // jwt hoặc '' nếu đã xác thực email
  verify?: UserVerifyStatus
  role?: UserRole
  location?: string // optional
  avatar?: string // optional
  cart?: Item[] // Cart items
}

export default class User {
  _id: ObjectId
  name: string
  email: string
  date_of_birth: Date
  password: string
  created_at: Date
  updated_at: Date
  email_verify_token: string // jwt hoặc '' nếu đã xác thực email
  forgot_password_token: string // jwt hoặc '' nếu đã xác thực email
  verify: UserVerifyStatus
  role: UserRole
  location: string // optional
  avatar: string // optional
  cart: Item[] // Cart items

  constructor(user: UserType) {
    const date = new Date()
    this._id = user._id || new ObjectId()
    this.name = user.name || ''
    this.email = user.email
    this.date_of_birth = user.date_of_birth || date
    this.password = user.password
    this.created_at = user.created_at || date
    this.updated_at = user.updated_at || date
    this.email_verify_token = user.email_verify_token || ''
    this.forgot_password_token = user.forgot_password_token || ''
    this.verify = user.verify || UserVerifyStatus.Verified
    this.role = user.role || UserRole.User
    this.location = user.location || ''
    this.avatar = user.avatar || ''
    this.cart = user.cart || []
  }
}
