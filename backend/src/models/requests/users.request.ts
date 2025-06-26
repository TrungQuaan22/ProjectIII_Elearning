import { JwtPayload } from 'jsonwebtoken'
import { UserVerifyStatus, TokenType, UserRole } from '~/constants/enum'
import { ObjectId } from 'mongodb'
export interface RegisterReqBody {
  name: string
  email: string
  password: string
  date_of_birth: string
  role?: UserRole
}

export interface TokenPayload extends JwtPayload {
  user_id: ObjectId
  token_type: TokenType
  verify: UserVerifyStatus
  exp: number
  iat: number
}

export interface LoginReqBody {
  email: string
  password: string
}

