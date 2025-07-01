import { CourseType } from './course.type'

export interface EnrollmentType {
  id: string
  status: 'active' | 'completed' | 'dropped'
  enrolled_at: string
  progress: {
    completed_lessons: string[]
    current_lesson: string | null
    last_accessed_at: string
  }
  course: CourseType
}

export interface EnrollmentsResponse {
  enrollments: EnrollmentType[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}
