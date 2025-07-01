import { ObjectId } from 'mongodb'
import Enrollment, { EnrollmentStatus } from '~/models/schemas/Enrollment.schema'
import databaseService from './database.services'
import { ErrorWithStatus } from '~/models/Errors'
import { GetUserCoursesReqQuery, GetCourseEnrollmentsReqQuery } from '~/models/requests/courses.request'

class EnrollmentService {
  async enroll(courseId: string, userId: string, orderId: string) {
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
        order_id: new ObjectId(orderId),
        progress: {
          completed_lessons: [],
          current_lesson: null,
          last_accessed_at: new Date()
        },
        status: 'active'
      })
    )

    return result.insertedId.toString()
  }

  async getUserEnrollments(userId: string, query: GetUserCoursesReqQuery) {
    const { page = '1', limit = '10', status } = query
    const page_number = Number(page)
    const limit_number = Number(limit)
    const skip = (page_number - 1) * limit_number

    const match: any = { user_id: new ObjectId(userId) }
    if (status) {
      match.status = status
    }

    // Check if enrollments exist for this user
    const totalEnrollments = await databaseService.enrollments.countDocuments(match)

    if (totalEnrollments === 0) {
      return {
        enrollments: [],
        pagination: {
          page: page_number,
          limit: limit_number,
          total: 0,
          total_pages: 0
        }
      }
    }

    // First, let's see what enrollments we have
    const rawEnrollments = await databaseService.enrollments.find(match).toArray()
    if (rawEnrollments.length > 0) {
      // Check if course exists for this enrollment
      const courseId = rawEnrollments[0].course_id
      const course = await databaseService.courses.findOne({ _id: courseId })
      if (course) {
        const author = await databaseService.users.findOne({ _id: course.author_id })
        if (author) {
          console.log('Author name:', author.name)
        }
      }
    }

    // Try a simpler approach first - just get enrollments with basic course info
    const enrollments = await databaseService.enrollments
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
        {
          $addFields: {
            courseExists: { $gt: [{ $size: '$course' }, 0] }
          }
        },
        {
          $match: {
            courseExists: true
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
        {
          $addFields: {
            authorExists: { $gt: [{ $size: '$author' }, 0] }
          }
        },
        {
          $match: {
            authorExists: true
          }
        },
        { $unwind: '$author' },
        {
          $project: {
            _id: 1,
            status: 1,
            created_at: 1,
            progress: 1,
            'course._id': 1,
            'course.title': 1,
            'course.description': 1,
            'course.thumbnail': 1,
            'course.slug': 1,
            'course.price': 1,
            'course.topics': 1,
            'author.name': 1
          }
        },
        { $sort: { created_at: -1 } },
        { $skip: skip },
        { $limit: limit_number }
      ])
      .toArray()

    return {
      enrollments: enrollments.map((enrollment) => ({
        id: enrollment._id,
        status: enrollment.status,
        enrolled_at: enrollment.created_at,
        progress: enrollment.progress,
        course: {
          _id: enrollment.course._id,
          title: enrollment.course.title,
          description: enrollment.course.description,
          thumbnail: enrollment.course.thumbnail,
          slug: enrollment.course.slug,
          author_name: enrollment.author.name
        }
      })),
      pagination: {
        page: page_number,
        limit: limit_number,
        total: enrollments.length,
        total_pages: Math.ceil(enrollments.length / limit_number)
      }
    }
  }

  async getEnrollmentById(userId: string, enrollment_id: string) {
    const enrollment = await databaseService.enrollments.findOne({
      _id: new ObjectId(enrollment_id),
      user_id: new ObjectId(userId)
    })

    if (!enrollment) {
      throw new ErrorWithStatus({
        message: 'Enrollment not found',
        status: 404
      })
    }

    // Get course details
    const course = await databaseService.courses.findOne({ _id: enrollment.course_id })
    if (!course) {
      throw new ErrorWithStatus({
        message: 'Course not found',
        status: 404
      })
    }

    return {
      id: enrollment._id,
      status: enrollment.status,
      enrolled_at: enrollment.created_at,
      progress: enrollment.progress,
      course: {
        id: course._id,
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail,
        slug: course.slug,
        topics: course.topics || []
      }
    }
  }

  async updateProgress(enrollmentId: string, completedLessons: ObjectId[], currentLesson: ObjectId) {
    const result = await databaseService.enrollments.findOneAndUpdate(
      { _id: new ObjectId(enrollmentId) },
      {
        $set: {
          'progress.completed_lessons': completedLessons,
          'progress.current_lesson': currentLesson,
          'progress.last_accessed_at': new Date(),
          updated_at: new Date()
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

  async updateStatus(enrollmentId: string, status: EnrollmentStatus) {
    const result = await databaseService.enrollments.findOneAndUpdate(
      { _id: new ObjectId(enrollmentId) },
      {
        $set: {
          status,
          updated_at: new Date()
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
}

const enrollmentService = new EnrollmentService()
export default enrollmentService
