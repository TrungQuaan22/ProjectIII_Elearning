import { ObjectId } from 'mongodb'
import Enrollment from '~/models/schemas/Enrollment.schema'
import databaseService from './database.services'
import { ErrorWithStatus } from '~/models/Errors'
import { GetUserCoursesReqQuery, GetCourseEnrollmentsReqQuery } from '~/models/requests/courses.request'

class EnrollmentService {
  async enroll(courseId: string, userId: string, expiresAt?: Date) {
    // Check if course exists
    const course = await databaseService.courses.findOne({ _id: new ObjectId(courseId) })
    if (!course) {
      throw new ErrorWithStatus({
        message: 'Course not found',
        status: 404
      })
    }

    // Check if user is already enrolled
    const existingEnrollment = await databaseService.enrollments.findOne({
      course_id: new ObjectId(courseId),
      user_id: new ObjectId(userId)
    })

    if (existingEnrollment) {
      throw new ErrorWithStatus({
        message: 'User is already enrolled in this course',
        status: 400
      })
    }

    // Create new enrollment
    const result = await databaseService.enrollments.insertOne(
      new Enrollment({
        user_id: new ObjectId(userId),
        course_id: new ObjectId(courseId),
        enrolled_at: new Date(),
        progress: {
          completed_lessons: [],
          last_accessed_lesson: new ObjectId(),
          last_accessed_at: new Date()
        },
        status: 'active',
        expires_at: expiresAt
      })
    )

    return result.insertedId.toString()
  }

  async getUserCourses(userId: string, query: GetUserCoursesReqQuery) {
    const { page = '1', limit = '10', status } = query
    const page_number = Number(page)
    const limit_number = Number(limit)
    const skip = (page_number - 1) * limit_number

    const match: any = { user_id: new ObjectId(userId) }
    if (status) {
      match.status = status
    }

    const [enrollments, total] = await Promise.all([
      databaseService.enrollments
        .aggregate([
          { $match: match },
          {
            $lookup: {
              from: 'courses',
              localField: 'course_id',
              foreignField: '_id',
              as: 'course'
            }
          },
          { $unwind: '$course' },
          {
            $lookup: {
              from: 'users',
              localField: 'course.author_id',
              foreignField: '_id',
              as: 'author'
            }
          },
          { $unwind: '$author' },
          {
            $project: {
              _id: 1,
              status: 1,
              enrolled_at: 1,
              progress: 1,
              expires_at: 1,
              'course._id': 1,
              'course.title': 1,
              'course.description': 1,
              'course.thumbnail': 1,
              'course.topics': 1,
              'author.name': 1
            }
          },
          { $sort: { enrolled_at: -1 } },
          { $skip: skip },
          { $limit: limit_number }
        ])
        .toArray(),
      databaseService.enrollments.countDocuments(match)
    ])

    return {
      enrollments: enrollments.map((enrollment) => ({
        id: enrollment._id,
        status: enrollment.status,
        enrolled_at: enrollment.enrolled_at,
        progress: enrollment.progress,
        expires_at: enrollment.expires_at,
        course: {
          id: enrollment.course._id,
          title: enrollment.course.title,
          description: enrollment.course.description,
          thumbnail: enrollment.course.thumbnail,
          topics: enrollment.course.topics.map((topic: any) => ({
            id: topic._id,
            title: topic.title,
            summary: topic.summary,
            order: topic.order,
            lessons: topic.lessons.map((lesson: any) => ({
              id: lesson._id,
              title: lesson.title,
              description: lesson.description,
              duration: lesson.duration,
              order: lesson.order
            }))
          })),
          author: {
            name: enrollment.author.name
          }
        }
      })),
      pagination: {
        page: page_number,
        limit: limit_number,
        total,
        total_pages: Math.ceil(total / limit_number)
      }
    }
  }

  async getCourseEnrollments(courseId: string, query: GetCourseEnrollmentsReqQuery) {
    const { page = '1', limit = '10', status } = query
    const page_number = Number(page)
    const limit_number = Number(limit)
    const skip = (page_number - 1) * limit_number

    const match: any = { course_id: new ObjectId(courseId) }
    if (status) {
      match.status = status
    }

    const [enrollments, total] = await Promise.all([
      databaseService.enrollments
        .aggregate([
          { $match: match },
          {
            $lookup: {
              from: 'users',
              localField: 'user_id',
              foreignField: '_id',
              as: 'user'
            }
          },
          { $unwind: '$user' },
          {
            $project: {
              _id: 1,
              status: 1,
              enrolled_at: 1,
              progress: 1,
              expires_at: 1,
              'user.name': 1,
              'user.email': 1
            }
          },
          { $sort: { enrolled_at: -1 } },
          { $skip: skip },
          { $limit: limit_number }
        ])
        .toArray(),
      databaseService.enrollments.countDocuments(match)
    ])

    return {
      enrollments: enrollments.map((enrollment) => ({
        id: enrollment._id,
        status: enrollment.status,
        enrolled_at: enrollment.enrolled_at,
        progress: enrollment.progress,
        expires_at: enrollment.expires_at,
        user: {
          name: enrollment.user.name,
          email: enrollment.user.email
        }
      })),
      pagination: {
        page: page_number,
        limit: limit_number,
        total,
        total_pages: Math.ceil(total / limit_number)
      }
    }
  }

  async updateProgress(enrollmentId: string, completedLessons: ObjectId[], lastAccessedLesson: ObjectId) {
    const result = await databaseService.enrollments.findOneAndUpdate(
      { _id: new ObjectId(enrollmentId) },
      {
        $set: {
          'progress.completed_lessons': completedLessons,
          'progress.last_accessed_lesson': lastAccessedLesson,
          'progress.last_accessed_at': new Date()
        }
      },
      { returnDocument: 'after' }
    )

    if (!result) {
      throw new ErrorWithStatus({
        message: 'Enrollment not found',
        status: 404
      })
    }

    return result
  }

  async updateStatus(enrollmentId: string, status: 'active' | 'completed' | 'expired') {
    const result = await databaseService.enrollments.findOneAndUpdate(
      { _id: new ObjectId(enrollmentId) },
      { $set: { status } },
      { returnDocument: 'after' }
    )

    if (!result) {
      throw new ErrorWithStatus({
        message: 'Enrollment not found',
        status: 404
      })
    }

    return result
  }
}

const enrollmentService = new EnrollmentService()
export default enrollmentService
