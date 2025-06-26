import { Request, Response, NextFunction } from 'express'
import courseService from '~/services/courses.services'
import { ErrorWithStatus } from '~/models/Errors'
import User from '~/models/schemas/User.schema'
import { GetCoursesReqQuery } from '~/models/requests/courses.request'

export const getPublicCoursesController = async (
  req: Request<{}, {}, {}, GetCoursesReqQuery>,
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

export const getPrivateCourseController = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User
    const course = await courseService.getPrivateCourse(req.params.id, user._id.toString())

    if (!course) {
      throw new ErrorWithStatus({
        message: 'Course not found',
        status: 404
      })
    }

    res.json({
      message: 'Get course successfully',
      data: course
    })
  } catch (error) {
    next(error)
  }
}

export const getEnrolledCoursesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User
    const courses = await courseService.getEnrolledCourses(user._id.toString())

    res.json({
      message: 'Get enrolled courses successfully',
      data: courses
    })
  } catch (error) {
    next(error)
  }
}
