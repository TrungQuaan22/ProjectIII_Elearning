import { Request, Response, NextFunction } from 'express'
import { ErrorWithStatus } from '~/models/Errors'
import User from '~/models/schemas/User.schema'
import courseService from '~/services/courses.services'

export const checkEnrollment = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const user = req.user as User
  const isEnrolled = await courseService.isUserEnrolled(user._id.toString(), id)
  if (!isEnrolled) {
    throw new ErrorWithStatus({
      message: 'You have not enrolled in this course',
      status: 403
    })
  }
}