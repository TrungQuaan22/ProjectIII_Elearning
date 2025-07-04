import { Request } from 'express'
import { TokenPayload } from '~/models/requests/users.request'
import User from '~/models/schemas/User.schema'
import Blog from '~/models/schemas/Blog.schema'

declare module 'express' {
  interface Request {
    user?: User
    decoded_authorization?: TokenPayload
    decoded_refresh_token?: TokenPayload
    decoded_email_verify_token?: TokenPayload
    decoded_forgot_password_token?: TokenPayload
    blog?: Blog
  }
}
