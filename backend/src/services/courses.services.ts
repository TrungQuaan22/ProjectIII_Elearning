import { Filter, ObjectId, UpdateFilter } from 'mongodb'
import databaseService from './database.services'
import {
  CreateCourseReqBody,
  UpdateCourseReqBody,
  GetCoursesReqQuery,
  CreateTopicReqBody,
  CreateLessonReqBody
} from '~/models/requests/courses.request'
import { ErrorWithStatus } from '~/models/Errors'
import Course, { TopicType, LessonType, Topic, Lesson } from '~/models/schemas/Course.schema'
import { PublicCourse } from '~/models/responses/courses.response'
import User from '~/models/schemas/User.schema'

class CourseService {
  async createCourse(user: User, payload: CreateCourseReqBody) {
    const baseSlug = Course.generateSlug(payload.title)
    let slug = baseSlug
    const exists = await databaseService.courses.findOne({ slug })
    if (exists) {
      slug = `${baseSlug}-${Date.now()}`
    }
    const course = new Course({
      ...payload,
      slug,
      author_id: user._id
    })
    const result = await databaseService.courses.insertOne(course)
    return result.insertedId.toString()
  }

  async getCourses(query: GetCoursesReqQuery) {
    const { page = '1', limit = '10', status, search } = query
    const skip = (Number(page) - 1) * Number(limit)
    const match: Filter<Course> = {}

    if (status) {
      match.status = status
    }

    if (search) {
      match.$or = [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }]
    }

    const [courses, total] = await Promise.all([
      databaseService.courses.find(match).sort({ created_at: -1 }).skip(skip).limit(Number(limit)).toArray(),
      databaseService.courses.countDocuments(match)
    ])

    return {
      courses: courses.map((course) => ({
        ...course,
        slug: course.slug,
        topics:
          course.topics?.map((topic) => ({
            ...topic,
            slug: topic.slug,
            lessons:
              topic.lessons?.map((lesson) => ({
                ...lesson,
                slug: lesson.slug
              })) || []
          })) || []
      })),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        total_pages: Math.ceil(total / Number(limit))
      }
    }
  }

  async getCourseBySlug(slug: string) {
    const course = await databaseService.courses.findOne({ slug })
    if (!course) {
      throw new ErrorWithStatus({
        message: 'Course not found',
        status: 404
      })
    }
    return course
  }

  async updateCourse(id: string, payload: UpdateCourseReqBody) {
    const result = await databaseService.courses.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...payload,
          updated_at: new Date()
        }
      },
      { returnDocument: 'after' }
    )

    if (!result) {
      throw new ErrorWithStatus({
        message: 'Course not found',
        status: 404
      })
    }

    return result
  }

  async deleteCourse(id: string) {
    const result = await databaseService.courses.findOneAndDelete({ _id: new ObjectId(id) })
    if (!result) {
      throw new ErrorWithStatus({
        message: 'Course not found',
        status: 404
      })
    }
    return result
  }

  async addTopic(courseSlug: string, payload: CreateTopicReqBody) {
    const course = await databaseService.courses.findOne({ slug: courseSlug })
    if (!course) {
      throw new ErrorWithStatus({
        message: 'Course not found',
        status: 404
      })
    }
    const baseSlug = Topic.generateSlug(payload.title)
    let slug = baseSlug
    const exists = course.topics.find((t) => t.slug === slug)
    if (exists) {
      slug = `${baseSlug}-${Date.now()}`
    }
    const order = course.topics.length + 1
    const topic = new Topic({
      ...payload,
      slug,
      order
    })
    const result = await databaseService.courses.updateOne(
      { slug: courseSlug },
      {
        $push: { topics: topic }
      }
    )
    return topic.slug
  }

  async updateTopic(courseId: string, topicId: string, payload: { title?: string; summary?: string; order?: number }) {
    const update_data: UpdateFilter<Course> = {}
    if (payload.title) update_data['topics.$[topic].title'] = payload.title
    if (payload.summary) update_data['topics.$[topic].summary'] = payload.summary
    if (payload.order) update_data['topics.$[topic].order'] = payload.order
    update_data['topics.$[topic].updated_at'] = new Date()

    const result = await databaseService.courses.findOneAndUpdate(
      { _id: new ObjectId(courseId) },
      {
        $set: update_data
      },
      {
        arrayFilters: [{ 'topic._id': new ObjectId(topicId) }],
        returnDocument: 'after'
      }
    )

    if (!result) {
      throw new ErrorWithStatus({
        message: 'Course or topic not found',
        status: 404
      })
    }

    const topic = result.topics.find((t: TopicType) => t._id?.toString() === topicId)
    if (!topic) {
      throw new ErrorWithStatus({
        message: 'Topic not found',
        status: 404
      })
    }
    return topic
  }

  async deleteTopic(course_id: string, topic_id: string) {
    const course = await databaseService.courses.findOne({ _id: new ObjectId(course_id) })
    if (!course) {
      throw new ErrorWithStatus({
        message: 'Course not found',
        status: 404
      })
    }

    const topic = course.topics.find((t) => t._id?.toString() === topic_id)
    if (!topic) {
      throw new ErrorWithStatus({
        message: 'Topic not found',
        status: 404
      })
    }

    // Xóa topic
    const result = await databaseService.courses.updateOne(
      { _id: new ObjectId(course_id) },
      {
        $pull: { topics: { _id: new ObjectId(topic_id) } }
      }
    )

    if (result.matchedCount === 0) {
      throw new ErrorWithStatus({
        message: 'Course not found',
        status: 404
      })
    }

    return { deleted: true }
  }

  async addLesson(courseSlug: string, topicSlug: string, payload: CreateLessonReqBody) {
    const course = await databaseService.courses.findOne({ slug: courseSlug })
    if (!course) {
      throw new ErrorWithStatus({
        message: 'Course not found',
        status: 404
      })
    }

    const topic = course.topics.find((t) => t.slug === topicSlug)
    if (!topic) {
      throw new ErrorWithStatus({
        message: 'Topic not found',
        status: 404
      })
    }

    const baseSlug = Lesson.generateSlug(payload.title)
    let slug = baseSlug
    const exists = topic.lessons?.find((l) => l.slug === slug)
    if (exists) {
      slug = `${baseSlug}-${Date.now()}`
    }
    const order = (topic.lessons?.length || 0) + 1
    const lesson = new Lesson({
      ...payload,
      slug,
      order
    })

    const result = await databaseService.courses.updateOne(
      { slug: courseSlug, 'topics.slug': topicSlug },
      {
        $push: { 'topics.$.lessons': lesson }
      }
    )

    if (result.matchedCount === 0) {
      throw new ErrorWithStatus({
        message: 'Course or topic not found',
        status: 404
      })
    }

    return lesson.slug
  }

  async updateLesson(
    courseId: string,
    topicId: string,
    lessonId: string,
    payload: { title?: string; description?: string; duration?: number; order?: number; video_url?: string }
  ) {
    const update_data: UpdateFilter<Course> = {}
    if (payload.title) update_data['topics.$[topic].lessons.$[lesson].title'] = payload.title
    if (payload.description) update_data['topics.$[topic].lessons.$[lesson].description'] = payload.description
    if (payload.duration) update_data['topics.$[topic].lessons.$[lesson].duration'] = payload.duration
    if (payload.order) update_data['topics.$[topic].lessons.$[lesson].order'] = payload.order
    if (payload.video_url) update_data['topics.$[topic].lessons.$[lesson].video_url'] = payload.video_url
    update_data['topics.$[topic].lessons.$[lesson].updated_at'] = new Date()

    const result = await databaseService.courses.findOneAndUpdate(
      { _id: new ObjectId(courseId) },
      {
        $set: update_data
      },
      {
        arrayFilters: [{ 'topic._id': new ObjectId(topicId) }, { 'lesson._id': new ObjectId(lessonId) }],
        returnDocument: 'after'
      }
    )

    if (!result) {
      throw new ErrorWithStatus({
        message: 'Course, topic, or lesson not found',
        status: 404
      })
    }

    const topic = result.topics.find((t: TopicType) => t._id?.toString() === topicId)
    if (!topic) {
      throw new ErrorWithStatus({
        message: 'Topic not found',
        status: 404
      })
    }

    const lesson = topic.lessons?.find((l: LessonType) => l._id?.toString() === lessonId)
    if (!lesson) {
      throw new ErrorWithStatus({
        message: 'Lesson not found',
        status: 404
      })
    }

    return lesson
  }

  async deleteLesson(course_id: string, topic_id: string, lesson_id: string) {
    const course = await databaseService.courses.findOne({ _id: new ObjectId(course_id) })
    if (!course) {
      throw new ErrorWithStatus({
        message: 'Course not found',
        status: 404
      })
    }

    const topic = course.topics.find((t) => t._id?.toString() === topic_id)
    if (!topic) {
      throw new ErrorWithStatus({
        message: 'Topic not found',
        status: 404
      })
    }

    const lesson = topic.lessons?.find((l) => l._id?.toString() === lesson_id)
    if (!lesson) {
      throw new ErrorWithStatus({
        message: 'Lesson not found',
        status: 404
      })
    }

    // Xóa lesson
    const result = await databaseService.courses.updateOne(
      { _id: new ObjectId(course_id), 'topics._id': new ObjectId(topic_id) },
      {
        $pull: { 'topics.$.lessons': { _id: new ObjectId(lesson_id) } }
      }
    )

    if (result.matchedCount === 0) {
      throw new ErrorWithStatus({
        message: 'Course or topic not found',
        status: 404
      })
    }

    return { deleted: true }
  }

  async isUserEnrolled(user_id: string, course_id: string): Promise<boolean> {
    const enrollment = await databaseService.enrollments.findOne({
      user_id: new ObjectId(user_id),
      course_id: new ObjectId(course_id)
    })
    return !!enrollment
  }

  async getPublicCourse(course_slug: string): Promise<PublicCourse> {
    const course = await databaseService.courses.findOne({ slug: course_slug })
    if (!course) {
      throw new ErrorWithStatus({
        message: 'Course not found',
        status: 404
      })
    }

    const author = await databaseService.users.findOne({ _id: course.author_id })
    const author_name = author?.name || 'Unknown'

    return {
      _id: course._id,
      title: course.title,
      slug: course.slug,
      author_name,
      description: course.description,
      detailed_description: course.detailed_description,
      thumbnail: course.thumbnail,
      price: course.price,
      status: course.status,
      topics: course.topics.map((topic) => ({
        _id: topic._id || new ObjectId(),
        title: topic.title,
        slug: topic.slug || '',
        summary: topic.summary,
        order: topic.order,
        lessons:
          topic.lessons?.map((lesson) => ({
            _id: lesson._id || new ObjectId(),
            title: lesson.title,
            slug: lesson.slug || '',
            description: lesson.description,
            duration: lesson.duration,
            order: lesson.order
          })) || []
      }))
    }
  }

  async getPublicCourses(): Promise<PublicCourse[]> {
    const courses = await databaseService.courses.find({}).toArray()
    const authorIds = Array.from(new Set(courses.map((course) => course.author_id)))
    const authors = await databaseService.users.find({ _id: { $in: authorIds } }).toArray()

    return courses.map((course) => ({
      _id: course._id,
      title: course.title,
      slug: course.slug,
      author_name: authors.find((a) => a._id.toString() === course.author_id.toString())?.name || '',
      description: course.description,
      detailed_description: course.detailed_description,
      thumbnail: course.thumbnail,
      price: course.price,
      status: course.status,
      topics: course.topics.map((topic) => ({
        _id: topic._id || new ObjectId(),
        title: topic.title,
        slug: topic.slug || '',
        summary: topic.summary,
        order: topic.order,
        lessons:
          topic.lessons?.map((lesson) => ({
            _id: lesson._id || new ObjectId(),
            title: lesson.title,
            slug: lesson.slug || '',
            description: lesson.description,
            duration: lesson.duration,
            order: lesson.order
          })) || []
      }))
    }))
  }

  async getTopicBySlug(courseSlug: string, topicSlug: string) {
    const course = await databaseService.courses.findOne({ slug: courseSlug })
    if (!course) throw new ErrorWithStatus({ message: 'Course not found', status: 404 })
    const topic = course.topics.find((t) => t.slug === topicSlug)
    if (!topic) throw new ErrorWithStatus({ message: 'Topic not found', status: 404 })
    return topic
  }

  async getLessonBySlug(courseSlug: string, topicSlug: string, lessonSlug: string) {
    const course = await databaseService.courses.findOne({ slug: courseSlug })
    if (!course) throw new ErrorWithStatus({ message: 'Course not found', status: 404 })
    const topic = course.topics.find((t) => t.slug === topicSlug)
    if (!topic) throw new ErrorWithStatus({ message: 'Topic not found', status: 404 })
    const lesson = topic.lessons?.find((l) => l.slug === lessonSlug)
    if (!lesson) throw new ErrorWithStatus({ message: 'Lesson not found', status: 404 })
    return lesson
  }

  async updateCourseBySlug(slug: string, payload: UpdateCourseReqBody) {
    const result = await databaseService.courses.findOneAndUpdate(
      { slug },
      {
        $set: {
          ...payload,
          updated_at: new Date()
        }
      },
      { returnDocument: 'after' }
    )
    if (!result) {
      throw new ErrorWithStatus({ message: 'Course not found', status: 404 })
    }
    return result
  }

  async deleteCourseBySlug(slug: string) {
    const result = await databaseService.courses.findOneAndDelete({ slug })
    if (!result) {
      throw new ErrorWithStatus({ message: 'Course not found', status: 404 })
    }
    return result
  }

  async updateTopicBySlug(
    courseSlug: string,
    topicSlug: string,
    payload: { title?: string; summary?: string; order?: number }
  ) {
    const course = await databaseService.courses.findOne({ slug: courseSlug })
    if (!course) throw new ErrorWithStatus({ message: 'Course not found', status: 404 })
    const topicIndex = course.topics.findIndex((t) => t.slug === topicSlug)
    if (topicIndex === -1) throw new ErrorWithStatus({ message: 'Topic not found', status: 404 })
    const updateFields = { ...course.topics[topicIndex], ...payload, updated_at: new Date() }
    course.topics[topicIndex] = updateFields
    await databaseService.courses.updateOne({ slug: courseSlug }, { $set: { topics: course.topics } })
    return updateFields
  }

  async deleteTopicBySlug(courseSlug: string, topicSlug: string) {
    const course = await databaseService.courses.findOne({ slug: courseSlug })
    if (!course) throw new ErrorWithStatus({ message: 'Course not found', status: 404 })
    const topics = course.topics.filter((t) => t.slug !== topicSlug)
    await databaseService.courses.updateOne({ slug: courseSlug }, { $set: { topics } })
    return { deleted: true }
  }

  async updateLessonBySlug(
    courseSlug: string,
    topicSlug: string,
    lessonSlug: string,
    payload: { title?: string; description?: string; duration?: number; order?: number; video_url?: string }
  ) {
    const course = await databaseService.courses.findOne({ slug: courseSlug })
    if (!course) throw new ErrorWithStatus({ message: 'Course not found', status: 404 })
    const topic = course.topics.find((t) => t.slug === topicSlug)
    if (!topic) throw new ErrorWithStatus({ message: 'Topic not found', status: 404 })
    const lessonIndex = (topic.lessons || []).findIndex((l) => l.slug === lessonSlug)
    if (lessonIndex === -1) throw new ErrorWithStatus({ message: 'Lesson not found', status: 404 })
    const updateFields = { ...(topic.lessons || [])[lessonIndex], ...payload, updated_at: new Date() }
    if (!topic.lessons) topic.lessons = []
    topic.lessons[lessonIndex] = updateFields
    await databaseService.courses.updateOne(
      { slug: courseSlug, 'topics.slug': topicSlug },
      { $set: { 'topics.$.lessons': topic.lessons } }
    )
    return updateFields
  }

  async deleteLessonBySlug(courseSlug: string, topicSlug: string, lessonSlug: string) {
    const course = await databaseService.courses.findOne({ slug: courseSlug })
    if (!course) throw new ErrorWithStatus({ message: 'Course not found', status: 404 })
    const topic = course.topics.find((t) => t.slug === topicSlug)
    if (!topic) throw new ErrorWithStatus({ message: 'Topic not found', status: 404 })
    const lessons = topic.lessons?.filter((l) => l.slug !== lessonSlug) || []
    await databaseService.courses.updateOne(
      { slug: courseSlug, 'topics.slug': topicSlug },
      { $set: { 'topics.$.lessons': lessons } }
    )
    return { deleted: true }
  }

  async getPublicCoursesWithPagination(query: GetCoursesReqQuery) {
    const { page = '1', limit = '10', status, search } = query
    const skip = (Number(page) - 1) * Number(limit)
    const match: Filter<Course> = {}

    if (status) {
      match.status = status
    }

    if (search) {
      match.$or = [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }]
    }

    const [courses, total] = await Promise.all([
      databaseService.courses.find(match).sort({ created_at: -1 }).skip(skip).limit(Number(limit)).toArray(),
      databaseService.courses.countDocuments(match)
    ])

    // Get all unique author IDs
    const authorIds = Array.from(new Set(courses.map((course) => course.author_id)))
    const authors = await databaseService.users.find({ _id: { $in: authorIds } }).toArray()

    const publicCourses = courses.map((course) => ({
      _id: course._id,
      title: course.title,
      slug: course.slug,
      author_name: authors.find((a) => a._id.toString() === course.author_id.toString())?.name || '',
      description: course.description,
      detailed_description: course.detailed_description,
      thumbnail: course.thumbnail,
      price: course.price,
      status: course.status,
      topics: course.topics.map((topic) => ({
        _id: topic._id || new ObjectId(),
        title: topic.title,
        slug: topic.slug || '',
        summary: topic.summary,
        order: topic.order,
        lessons:
          topic.lessons?.map((lesson) => ({
            _id: lesson._id || new ObjectId(),
            title: lesson.title,
            slug: lesson.slug || '',
            description: lesson.description,
            duration: lesson.duration,
            order: lesson.order
          })) || []
      }))
    }))

    return {
      courses: publicCourses,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        total_pages: Math.ceil(total / Number(limit))
      }
    }
  }
}

const courseService = new CourseService()
export default courseService
