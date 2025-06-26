import { Router } from 'express'
import {
  createCourseController,
  getCoursesController,
  getCourseByIdController,
  updateCourseController,
  deleteCourseController,
  addTopicController,
  updateTopicController,
  deleteTopicController,
  addLessonController,
  updateLessonController,
  deleteLessonController
} from '~/controllers/courses.controllers'
import { accessTokenValidator, verifyAdmin } from '~/middlewares/users.middlewares'
import {
  createCourseValidator,
  createTopicValidator,
  createLessonValidator,
  updateCourseValidator,
  updateTopicValidator,
  updateLessonValidator
} from '~/middlewares/courses.middlewares'

const coursesRouter = Router()

// Course routes (Admin only)
coursesRouter.post('/', accessTokenValidator, verifyAdmin, createCourseValidator, createCourseController)
coursesRouter.get('/', accessTokenValidator, verifyAdmin, getCoursesController)
coursesRouter.get('/:courseSlug', accessTokenValidator, verifyAdmin, getCourseByIdController)
coursesRouter.put('/:courseSlug', accessTokenValidator, verifyAdmin, updateCourseValidator, updateCourseController)
coursesRouter.delete('/:_id', accessTokenValidator, verifyAdmin, deleteCourseController)

// Topic routes (Admin only)
coursesRouter.post('/:courseSlug/topics', accessTokenValidator, verifyAdmin, createTopicValidator, addTopicController)
coursesRouter.put(
  '/:courseSlug/topics/:topicSlug',
  accessTokenValidator,
  verifyAdmin,
  updateTopicValidator,
  updateTopicController
)
coursesRouter.delete('/:course_id/topics/:topic_id', accessTokenValidator, verifyAdmin, deleteTopicController)

// Lesson routes (Admin only)
coursesRouter.post(
  '/:courseSlug/topics/:topicSlug/lessons',
  accessTokenValidator,
  verifyAdmin,
  createLessonValidator,
  addLessonController
)
coursesRouter.put(
  '/:courseSlug/topics/:topicSlug/lessons/:lessonSlug',
  accessTokenValidator,
  verifyAdmin,
  updateLessonValidator,
  updateLessonController
)
coursesRouter.delete(
  '/:courseSlug/topics/:topicSlug/lessons/:lessonSlug',
  accessTokenValidator,
  verifyAdmin,
  deleteLessonController
)

export default coursesRouter
