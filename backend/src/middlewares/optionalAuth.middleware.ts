import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '~/utils/jwt'
import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  if (authHeader) {
    const access_token = authHeader.split(' ')[1]
    if (access_token) {
      try {
        const decoded = await verifyToken({
          token: access_token,
          secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
        })
        const user = await databaseService.users.findOne({ _id: new ObjectId(decoded.user_id) })
        if (user) {
          req.user = user
        }
      } catch (e) {
        // Nếu token sai thì vẫn cho qua, không gán req.user
      }
    }
  }
  next()
}
