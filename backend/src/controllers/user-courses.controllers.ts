import { Request, Response, NextFunction } from 'express'
import courseService from '~/services/courses.services'
import enrollmentService from '~/services/enrollments.services'
import { ErrorWithStatus } from '~/models/Errors'
import User from '~/models/schemas/User.schema'
import { GetCoursesReqQuery } from '~/models/requests/courses.request'

export const getPublicCoursesController = async (
  req: Request<Record<string, never>, unknown, unknown, GetCoursesReqQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await courseService.getPublicCoursesWithPagination(req.query)

    res.json({
      message: 'Get courses successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const getPublicCourseController = async (req: Request<{ slug: string }>, res: Response, next: NextFunction) => {
  try {
    const course = await courseService.getPublicCourse(req.params.slug)
    res.json({
      message: 'Get course successfully',
      data: course
    })
  } catch (error) {
    next(error)
  }
}

export const getUserEnrollmentsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User
    const result = await enrollmentService.getUserEnrollments(user._id.toString(), req.query)

    res.json({
      message: 'Get user enrollments successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}
