import { Router } from 'express'
import { getPublicCoursesController, getPublicCourseController } from '~/controllers/user-courses.controllers'

const userCoursesRouter = Router()

// Public routes - for browsing all available courses
userCoursesRouter.get('/', getPublicCoursesController)
userCoursesRouter.get('/:slug', getPublicCourseController)

export default userCoursesRouter
