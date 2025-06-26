import { ObjectId } from 'mongodb'
import { CourseStatus } from '~/constants/enum'

/**
 * Lesson Type
 * @description Lesson Type
 * @property {ObjectId} _id - The ID of the lesson
 * @property {string} title - The title of the lesson
 * @property {string} description - The description of the lesson
 * @property {string} video_url - The URL of the video
 * @property {number} duration - The duration of the lesson in minutes
 * @property {number} order - The order of the lesson
 * @property {Date} created_at - The date the lesson was created
 */
export interface LessonType {
  _id?: ObjectId
  title: string
  slug?: string
  description: string
  video_url: string
  duration: number // in minutes
  order: number
  created_at?: Date
  updated_at?: Date
}

/**
 * Topic Type
 * @description Topic Type
 * @property {ObjectId} _id - The ID of the topic
 * @property {string} title - The title of the topic
 * @property {string} slug - The slug of the topic
 * @property {string} summary - The summary of the topic
 * @property {number} order - The order of the topic
 * @property {LessonType[]} lessons - The lessons of the topic
 * @property {Date} created_at - The date the topic was created
 * @property {Date} updated_at - The date the topic was updated
 */
export interface TopicType {
  _id?: ObjectId
  title: string
  slug?: string
  summary: string
  order: number
  lessons?: LessonType[]
  created_at?: Date
  updated_at?: Date
}

export class Topic {
  _id: ObjectId
  title: string
  slug: string
  summary: string
  order: number
  lessons: LessonType[]
  created_at: Date
  updated_at: Date

  constructor(topic: TopicType) {
    const date = new Date()
    this._id = topic._id || new ObjectId()
    this.title = topic.title
    this.slug = topic.slug || Topic.generateSlug(topic.title)
    this.summary = topic.summary
    this.order = topic.order
    this.lessons = topic.lessons || []
    this.created_at = topic.created_at || date
    this.updated_at = topic.updated_at || date
  }

  static generateSlug(title: string): string {
    return title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
  }
}

export class Lesson {
  _id: ObjectId
  title: string
  slug: string
  description: string
  duration: number
  order: number
  video_url: string
  created_at: Date
  updated_at: Date

  constructor(lesson: LessonType) {
    const date = new Date()
    this._id = lesson._id || new ObjectId()
    this.title = lesson.title
    this.slug = lesson.slug || Lesson.generateSlug(lesson.title)
    this.description = lesson.description
    this.duration = lesson.duration
    this.order = lesson.order
    this.video_url = lesson.video_url
    this.created_at = lesson.created_at || date
    this.updated_at = lesson.updated_at || date
  }

  static generateSlug(title: string): string {
    return title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
  }
}

/**
 * Course Type
 * @description Course Type
 * @property {ObjectId} _id - The ID of the course
 * @property {string} title - The title of the course
 * @property {string} slug - The slug of the course
 * @property {string} description - The description of the course
 * @property {string} detailed_description - The detailed description of the course
 */
interface CourseType {
  _id?: ObjectId
  title: string
  slug?: string
  description: string
  detailed_description: string // Mô tả chi tiết cho trang xem chi tiết khóa học
  thumbnail: string
  price: number
  author_id: ObjectId
  status?: CourseStatus
  topics?: TopicType[]
  created_at?: Date
  updated_at?: Date
}

/**
 * Course Model
 * @description Course Model
 * @property {ObjectId} _id - The ID of the course
 * @property {string} title - The title of the course
 * @property {string} slug - The slug of the course
 * @property {string} description - The description of the course
 */
export default class Course {
  _id: ObjectId
  title: string
  slug: string
  description: string
  detailed_description: string
  thumbnail: string
  price: number
  author_id: ObjectId
  status: CourseStatus
  topics: TopicType[]
  created_at: Date
  updated_at: Date

  constructor(course: CourseType) {
    const date = new Date()
    this._id = course._id || new ObjectId()
    this.title = course.title
    this.slug = course.slug || Course.generateSlug(course.title)
    this.description = course.description
    this.detailed_description = course.detailed_description
    this.thumbnail = course.thumbnail
    this.price = course.price
    this.author_id = course.author_id
    this.status = course.status || CourseStatus.Draft
    this.topics = course.topics || []
    this.created_at = course.created_at || date
    this.updated_at = course.updated_at || date
  }

  static generateSlug(title: string): string {
    return title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
  }
}
