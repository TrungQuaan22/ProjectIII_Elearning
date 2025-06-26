import { Request, Response, NextFunction } from 'express'
import userService from '~/services/users.services'
import { RegisterReqBody, LoginReqBody } from '~/models/requests/users.request'
import { hashPassword } from '~/utils/crypto'
import { ObjectId } from 'mongodb'

export const loginController = async (
  req: Request<Record<string, never>, unknown, LoginReqBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await userService.login({
      ...req.body,
      password: hashPassword(req.body.password)
    })
    res.json({
      message: 'Login success',
      data
    })
  } catch (error) {
    next(error)
  }
}

export const registerController = async (
  req: Request<Record<string, never>, unknown, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = await userService.register({
      ...req.body,
      password: hashPassword(req.body.password)
    })
    res.status(201).json({
      message: 'User created successfully',
      data: { user_id }
    })
  } catch (error) {
    next(error)
  }
}

export const getMeController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.getMe(req.user?._id.toString() as string) // req.user_id là user_id được lấy từ middleware verifyToken
    res.json({
      message: result.message,
      data: result.data
    })
  } catch (error) {
    next(error)
  }
}

export const logoutController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.logout(req.user?._id.toString() as string)
    res.json({
      message: result.message
    })
  } catch (error) {
    next(error)
  }
}
