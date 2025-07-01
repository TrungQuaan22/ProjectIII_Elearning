import { Router } from 'express'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import {
  getUserEnrollmentsController,
  getEnrollmentByIdController,
  updateEnrollmentProgressController
} from '~/controllers/enrollments.controllers'

const enrollmentsRouter = Router()

// All routes require authentication
enrollmentsRouter.use(accessTokenValidator)

// Get user enrollments
enrollmentsRouter.get('/', getUserEnrollmentsController)

// Get enrollment detail
enrollmentsRouter.get('/:id', getEnrollmentByIdController)

// Update enrollment progress
enrollmentsRouter.put('/:id/progress', updateEnrollmentProgressController)

export default enrollmentsRouter
