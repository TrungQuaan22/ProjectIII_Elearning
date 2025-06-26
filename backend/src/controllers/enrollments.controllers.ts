import { Request, Response, NextFunction } from 'express'
import enrollmentService from '~/services/enrollments.services'
import { GetUserCoursesReqQuery, GetCourseEnrollmentsReqQuery } from '~/models/requests/courses.request'
import { ObjectId } from 'mongodb'
export const enrollCourseController = async (req: Request<{ courseId: string }>, res: Response, next: NextFunction) => {
  try {
    const result = await enrollmentService.enroll(req.params.courseId, req.user?._id.toString() || '')
    res.status(201).json({
      message: 'Enrolled in course successfully',
      data: { enrollment_id: result }
    })
  } catch (error) {
    next(error)
  }
}

export const getUserCoursesController = async (
  req: Request<{ userId: string }, unknown, unknown, GetUserCoursesReqQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await enrollmentService.getUserCourses(req.params.userId, req.query)
    res.json({
      message: 'Get user courses successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const getCourseEnrollmentsController = async (
  req: Request<{ courseId: string }, unknown, unknown, GetCourseEnrollmentsReqQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await enrollmentService.getCourseEnrollments(req.params.courseId, req.query)
    res.json({
      message: 'Get course enrollments successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const updateProgressController = async (
  req: Request<{ enrollmentId: string }, unknown, { completedLessons: string[]; lastAccessedLesson: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await enrollmentService.updateProgress(
      req.params.enrollmentId,
      req.body.completedLessons.map((id) => new ObjectId(id)),
      new ObjectId(req.body.lastAccessedLesson)
    )
    res.json({
      message: 'Progress updated successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const updateStatusController = async (
  req: Request<{ enrollmentId: string }, unknown, { status: 'active' | 'completed' | 'expired' }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await enrollmentService.updateStatus(req.params.enrollmentId, req.body.status)
    res.json({
      message: 'Status updated successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}
