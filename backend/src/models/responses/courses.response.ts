import { ObjectId } from 'mongodb'
import { CourseStatus } from '~/constants/enum'

export interface PublicLesson {
  _id: ObjectId
  title: string
  slug: string
  description: string
  duration: number
  order: number
}

export interface PrivateLesson extends PublicLesson {
  video_url: string
}

export interface PublicTopic {
  _id: ObjectId
  title: string
  slug: string
  summary: string
  order: number
  lessons: PublicLesson[]
}

export interface PrivateTopic extends PublicTopic {
  lessons: PrivateLesson[]
}

export interface PublicCourse {
  _id: ObjectId
  title: string
  slug: string
  author_name: string
  description: string
  detailed_description: string
  thumbnail: string
  price: number
  status: CourseStatus
  topics: PublicTopic[]
}

export interface PrivateCourse extends PublicCourse {
  topics: PrivateTopic[]
}
