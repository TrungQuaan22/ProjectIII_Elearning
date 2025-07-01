import { Request, Response, NextFunction } from 'express'
import {
  CreateCourseReqBody,
  UpdateCourseReqBody,
  GetCoursesReqQuery,
  CourseParams,
  CreateTopicReqBody,
  UpdateTopicReqBody,
  CreateLessonReqBody,
  UpdateLessonReqBody
} from '~/models/requests/courses.request'
import User from '~/models/schemas/User.schema'
import Course from '~/models/schemas/Course.schema'
import { Filter, ObjectId } from 'mongodb'
import databaseService from '~/services/database.services'
import { ErrorWithStatus } from '~/models/Errors'
import courseService from '~/services/courses.services'

export const createCourseController = async (
  req: Request<Record<string, never>, unknown, CreateCourseReqBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as User
    const course_id = await courseService.createCourse(user, req.body)

    res.status(201).json({
      message: 'Course created successfully',
      data: {
        course_id
      }
    })
  } catch (error) {
    next(error)
  }
}

export const getCoursesController = async (
  req: Request<Record<string, never>, unknown, unknown, GetCoursesReqQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await courseService.getCourses(req.query)
    res.json({
      message: 'Get courses successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const getCourseByIdController = async (
  req: Request<{ courseSlug: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const course = await courseService.getCourseBySlug(req.params.courseSlug)
    res.json({
      message: 'Get course successfully',
      data: course
    })
  } catch (error) {
    next(error)
  }
}

export const updateCourseController = async (
  req: Request<{ courseSlug: string }, unknown, UpdateCourseReqBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await courseService.updateCourseBySlug(req.params.courseSlug, req.body)
    res.json({
      message: 'Course updated successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const deleteCourseController = async (
  req: Request<{ courseSlug: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await courseService.deleteCourseBySlug(req.params.courseSlug)
    res.json({
      message: 'Course deleted successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const addTopicController = async (
  req: Request<{ courseSlug: string }, unknown, CreateTopicReqBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const topic_slug = await courseService.addTopic(req.params.courseSlug, req.body)
    res.status(201).json({
      message: 'Topic added successfully',
      data: { topic_slug }
    })
  } catch (error) {
    next(error)
  }
}

export const updateTopicController = async (
  req: Request<{ courseSlug: string; topicSlug: string }, unknown, UpdateTopicReqBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await courseService.updateTopicBySlug(req.params.courseSlug, req.params.topicSlug, req.body)
    res.json({
      message: 'Topic updated successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const deleteTopicController = async (
  req: Request<{ courseSlug: string; topicSlug: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await courseService.deleteTopicBySlug(req.params.courseSlug, req.params.topicSlug)
    res.json({
      message: 'Topic deleted successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const addLessonController = async (
  req: Request<{ courseSlug: string; topicSlug: string }, unknown, CreateLessonReqBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const lesson_slug = await courseService.addLesson(req.params.courseSlug, req.params.topicSlug, req.body)
    res.status(201).json({
      message: 'Lesson added successfully',
      data: { lesson_slug }
    })
  } catch (error) {
    next(error)
  }
}

export const updateLessonController = async (
  req: Request<{ courseSlug: string; topicSlug: string; lessonSlug: string }, unknown, UpdateLessonReqBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await courseService.updateLessonBySlug(
      req.params.courseSlug,
      req.params.topicSlug,
      req.params.lessonSlug,
      req.body
    )
    res.json({
      message: 'Lesson updated successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const deleteLessonController = async (
  req: Request<{ courseSlug: string; topicSlug: string; lessonSlug: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await courseService.deleteLessonBySlug(
      req.params.courseSlug,
      req.params.topicSlug,
      req.params.lessonSlug
    )
    res.json({
      message: 'Lesson deleted successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const getPublicCourseController = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const result = await courseService.getPublicCourse(req.params.id)
    if (!result) {
      return res.status(404).json({
        message: 'Course not found'
      })
    }
    res.json({
      message: 'Get course successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}
