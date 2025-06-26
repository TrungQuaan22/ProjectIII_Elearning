import { UserRole, UserVerifyStatus } from 'src/constants/enum'
import { CartItem } from './cart.type'



export interface UserType {
  _id?: string
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
  cart?: CartItem[] // Cart items
}
