import { ObjectId } from 'mongodb'
import { CourseStatus } from '~/constants/enum'

/**
 * Create Course Request Body
 * @description Create Course Request Body
 * @property {string} title - The title of the course
 * @property {string} description - The description of the course
 * @property {string} detailed_description - The detailed description of the course
 * @property {string} thumbnail - The thumbnail of the course
 * @property {number} price - The price of the course
 * @property {CourseStatus} status - The status of the course
 */
export interface CreateCourseReqBody {
  title: string
  description: string
  detailed_description: string
  thumbnail: string
  price: number
  status?: CourseStatus
}

/**
 * Update Course Request Body
 * @description Update Course Request Body
 * @property {string} title - The title of the course
 * @property {string} description - The description of the course
 * @property {string} detailed_description - The detailed description of the course
 * @property {string} thumbnail - The thumbnail of the course
 * @property {number} price - The price of the course
 * @property {CourseStatus} status - The status of the course
 */
export interface UpdateCourseReqBody {
  title?: string
  description?: string
  detailed_description?: string
  thumbnail?: string
  price?: number
  status?: CourseStatus
}

/**
 * Get Courses Request Query
 * @description Get Courses Request Query
 * @property {string} page - The page number
 * @property {string} limit - The limit of the courses
 * @property {CourseStatus} status - The status of the courses
 * @property {string} search - The search query
 */
export interface GetCoursesReqQuery {
  page?: string
  limit?: string
  status?: CourseStatus
  search?: string
}

/**
 * Get User Courses Request Query
 * @description Get User Courses Request Query
 * @property {string} page - The page number
 * @property {string} limit - The limit of the courses
 * @property {string} status - The status of the courses
 */
export interface GetUserCoursesReqQuery {
  page?: string
  limit?: string
  status?: CourseStatus
}

/**
 * Get Course Enrollments Request Query
 * @description Get Course Enrollments Request Query
 * @property {string} page - The page number
 * @property {string} limit - The limit of the courses
 * @property {string} status - The status of the courses
 */
export interface GetCourseEnrollmentsReqQuery {
  page?: string
  limit?: string
  status?: CourseStatus
}

/**
 * Course Params
 * @description Course Params
 * @property {string} _id - The ID of the course
 */
export interface CourseParams {
  _id: string
}

/**
 * Create Topic Request Body
 * @description Create Topic Request Body
 * @property {string} title - The title of the topic
 * @property {string} summary - The summary of the topic
 */
export interface CreateTopicReqBody {
  title: string
  summary: string
}

/**
 * Update Topic Request Body
 * @description Update Topic Request Body
 * @property {string} title - The title of the topic
 * @property {string} summary - The summary of the topic
 * @property {number} order - The order of the topic
 */
export interface UpdateTopicReqBody {
  title?: string
  summary?: string
  order?: number
}

/**
 * Topic Params
 * @description Topic Params
 * @property {string} course_id - The ID of the course
 * @property {string} topic_id - The ID of the topic
 */
export interface TopicParams {
  course_id: string
  topic_id: string
}

/**
 * Create Lesson Request Body
 * @description Create Lesson Request Body
 * @property {string} title - The title of the lesson
 * @property {string} description - The description of the lesson
 * @property {number} duration - The duration of the lesson
 * @property {number} order - The order of the lesson
 * @property {string} video_url - The URL of the video
 */
export interface CreateLessonReqBody {
  title: string
  description: string
  duration: number
  video_url: string
}

/**
 * Update Lesson Request Body
 * @description Update Lesson Request Body
 * @property {string} title - The title of the lesson
 * @property {string} description - The description of the lesson
 * @property {number} duration - The duration of the lesson
 */
export interface UpdateLessonReqBody {
  title?: string
  description?: string
  duration?: number
  order?: number
  video_url?: string
}

/**
 * Lesson Params
 * @description Lesson Params
 * @property {string} course_id - The ID of the course
 * @property {string} topic_id - The ID of the topic
 * @property {string} lesson_id - The ID of the lesson
 */
export interface LessonParams {
  course_id: string
  topic_id: string
  lesson_id: string
}

/**
 * Course Document
 * @description Course Document
 * @property {ObjectId} _id - The ID of the course
 * @property {ObjectId} author_id - The ID of the author
 * @property {CourseStatus} status - The status of the course
 */
export interface CourseDocument extends CreateCourseReqBody {
  _id: ObjectId
  author_id: ObjectId
  status: CourseStatus
  topics: {
    _id: ObjectId
    title: string
    summary: string
    order: number
    lessons: {
      _id: ObjectId
      title: string
      description: string
      video_url: string
      duration: number
      order: number
      created_at: Date
      updated_at: Date
    }[]
    created_at: Date
    updated_at: Date
  }[]
  enrolled_users: ObjectId[]
  created_at: Date
  updated_at: Date
}

/**
 * Enroll Course Request Body
 * @description Enroll Course Request Body
 * @property {string} courseId - The ID of the course
 * @property {string} userId - The ID of the user
 * @property {Date} expiresAt - The expiration date of the enrollment
 */
export interface EnrollCourseReqBody {
  courseId: string
  userId: string
  expiresAt?: Date // Optional expiration date
}

/**
 * Update Enrollment Request Body
 * @description Update Enrollment Request Body
 * @property {string} status - The status of the enrollment
 * @property {ObjectId[]} completedLessons - The IDs of the completed lessons
 * @property {ObjectId} lastAccessedLesson - The ID of the last accessed lesson
 * @property {Date} expiresAt - The expiration date of the enrollment
 */
export interface UpdateEnrollmentReqBody {
  status?: CourseStatus
  completedLessons?: ObjectId[]
  lastAccessedLesson?: ObjectId
  expiresAt?: Date
}
