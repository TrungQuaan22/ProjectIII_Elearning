import { ObjectId } from 'mongodb'

export type EnrollmentStatus = 'active' | 'completed' | 'dropped'

interface EnrollmentType {
  _id?: ObjectId
  user_id: ObjectId
  course_id: ObjectId
  order_id: ObjectId
  progress: {
    completed_lessons: ObjectId[]
    current_lesson: ObjectId | null
    last_accessed_at: Date
  }
  status: EnrollmentStatus
  created_at?: Date
  updated_at?: Date
}

export default class Enrollment {
  _id?: ObjectId
  user_id: ObjectId
  course_id: ObjectId
  order_id: ObjectId
  progress: {
    completed_lessons: ObjectId[]
    current_lesson: ObjectId | null
    last_accessed_at: Date
  }
  status: EnrollmentStatus
  created_at: Date
  updated_at: Date

  constructor(enrollment: EnrollmentType) {
    this._id = enrollment._id
    this.user_id = enrollment.user_id
    this.course_id = enrollment.course_id
    this.order_id = enrollment.order_id
    this.progress = enrollment.progress
    this.status = enrollment.status
    this.created_at = enrollment.created_at || new Date()
    this.updated_at = enrollment.updated_at || new Date()
  }
}
