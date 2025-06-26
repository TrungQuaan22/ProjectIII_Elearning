import { Router } from 'express'
import {
  getPrivateCourseController,
  getEnrolledCoursesController,
  getPublicCoursesController,
  getPublicCourseController
} from '~/controllers/user-courses.controllers'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { checkEnrollment } from '~/middlewares/users-courses.middlewares'

const userCoursesRouter = Router()

// Public routes
userCoursesRouter.get('/', getPublicCoursesController)
userCoursesRouter.get('/:slug', getPublicCourseController)

// Private routes (require authentication)
userCoursesRouter.get('/:id/private', accessTokenValidator, checkEnrollment, getPrivateCourseController)
userCoursesRouter.get('/enrolled', accessTokenValidator, getEnrolledCoursesController)

export default userCoursesRouter
