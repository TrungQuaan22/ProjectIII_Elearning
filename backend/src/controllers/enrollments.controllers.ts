import { Request, Response, NextFunction } from 'express'
import enrollmentService from '~/services/enrollments.services'
import { ObjectId } from 'mongodb'
import User from '~/models/schemas/User.schema'
import { EnrollmentStatus } from '~/models/schemas/Enrollment.schema'

//Lấy ra các khóa học đã đăng ký của user
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
//Lấy ra thông tin của khóa học đã đăng ký của user
export const getEnrollmentByIdController = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User
    const result = await enrollmentService.getEnrollmentById(user._id.toString(), req.params.id)
    res.json({
      message: 'Get course enrollments successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const updateEnrollmentProgressController = async (
  req: Request<{ id: string }, any, { completed_lessons: string[]; current_lesson: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as User
    const { completed_lessons, current_lesson } = req.body

    // Convert string IDs to ObjectIds
    const completedLessonsObjectIds = completed_lessons.map((id) => new ObjectId(id))
    const currentLessonObjectId = current_lesson ? new ObjectId(current_lesson) : null

    const result = await enrollmentService.updateProgress(
      req.params.id,
      completedLessonsObjectIds,
      currentLessonObjectId as ObjectId
    )

    res.json({
      message: 'Update enrollment progress successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const updateStatusController = async (
  req: Request<{ enrollmentId: string }, unknown, { status: EnrollmentStatus }>,
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
