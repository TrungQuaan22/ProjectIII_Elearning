import http from 'src/utils/http'
import { CourseType } from 'src/types/course.type'
import { EnrollmentsResponse, EnrollmentType } from 'src/types/enrollment.type'
import {
  TopicType,
  LessonType,
  CreateTopicRequest,
  UpdateTopicRequest,
  CreateLessonRequest,
  UpdateLessonRequest
} from 'src/types/curriculum.type'

export interface GetCoursesParams {
  page?: string
  limit?: string
  status?: string
  search?: string
}

export interface CoursesResponse {
  courses: CourseType[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}
// All courses user can see no video url
export const getAllCourses = async (params: GetCoursesParams = {}): Promise<CoursesResponse> => {
  const searchParams = new URLSearchParams()
  if (params.page) searchParams.append('page', params.page)
  if (params.limit) searchParams.append('limit', params.limit)
  if (params.status) searchParams.append('status', params.status)
  if (params.search) searchParams.append('search', params.search)

  const res = await http.get<{ message: string; data: CoursesResponse }>(`/user-courses?${searchParams.toString()}`)
  return res.data.data
}
// All courses user can see no video url
export const getCourseDetail = async (courseSlug: string): Promise<CourseType> => {
  const res = await http.get<{ message: string; data: CourseType }>(`/user-courses/${courseSlug}`)
  return res.data.data
}
// All courses admin can see with video url
export const getCourseDetailByAdmin = async (courseSlug: string): Promise<CourseType> => {
  const res = await http.get<{ message: string; data: CourseType }>(`/courses/${courseSlug}`)
  return res.data.data
}

export const getCourseEnrollmentDetail = async (enrollmentId: string): Promise<EnrollmentType> => {
  const res = await http.get<{ message: string; data: EnrollmentType }>(`/enrollments/${enrollmentId}`)
  return res.data.data
}
// All courses admin can see with video url
export const getAllCoursesByAdmin = async (params: GetCoursesParams = {}): Promise<CoursesResponse> => {
  const searchParams = new URLSearchParams()
  if (params.page) searchParams.append('page', params.page)
  if (params.limit) searchParams.append('limit', params.limit)
  if (params.status) searchParams.append('status', params.status)
  if (params.search) searchParams.append('search', params.search)

  const res = await http.get<{ message: string; data: CoursesResponse }>(`/courses?${searchParams.toString()}`)
  return res.data.data
}

export const getCourseEnrollments = async (): Promise<EnrollmentsResponse> => {
  const res = await http.get<{ message: string; data: EnrollmentsResponse }>('/enrollments')
  return res.data.data
}

export const updateEnrollmentProgress = async (
  enrollmentId: string,
  completedLessons: string[],
  currentLesson: string
): Promise<EnrollmentType> => {
  const res = await http.put<{ message: string; data: EnrollmentType }>(`/enrollments/${enrollmentId}/progress`, {
    completed_lessons: completedLessons,
    current_lesson: currentLesson
  })
  return res.data.data
}

// Create new course (admin only)
export const createCourse = async (courseData: Partial<CourseType>): Promise<CourseType> => {
  const res = await http.post<{ message: string; data: CourseType }>('/courses', courseData)
  return res.data.data
}

// Update existing course (admin only)
export const updateCourse = async (courseSlug: string, courseData: Partial<CourseType>): Promise<CourseType> => {
  const res = await http.put<{ message: string; data: CourseType }>(`/courses/${courseSlug}`, courseData)
  return res.data.data
}

// Topic Management APIs
export const createTopic = async (courseSlug: string, topicData: CreateTopicRequest): Promise<TopicType> => {
  const res = await http.post<{ message: string; data: TopicType }>(`/courses/${courseSlug}/topics`, topicData)
  return res.data.data
}

export const updateTopic = async (
  courseSlug: string,
  topicSlug: string,
  topicData: UpdateTopicRequest
): Promise<TopicType> => {
  const res = await http.put<{ message: string; data: TopicType }>(
    `/courses/${courseSlug}/topics/${topicSlug}`,
    topicData
  )
  return res.data.data
}

export const deleteTopic = async (courseSlug: string, topicId: string): Promise<{ message: string }> => {
  const res = await http.delete<{ message: string }>(`/courses/${courseSlug}/topics/${topicId}`)
  return res.data
}

// Lesson Management APIs
export const createLesson = async (
  courseSlug: string,
  topicSlug: string,
  lessonData: CreateLessonRequest
): Promise<LessonType> => {
  const res = await http.post<{ message: string; data: LessonType }>(
    `/courses/${courseSlug}/topics/${topicSlug}/lessons`,
    lessonData
  )
  return res.data.data
}

export const updateLesson = async (
  courseSlug: string,
  topicSlug: string,
  lessonSlug: string,
  lessonData: UpdateLessonRequest
): Promise<LessonType> => {
  const res = await http.put<{ message: string; data: LessonType }>(
    `/courses/${courseSlug}/topics/${topicSlug}/lessons/${lessonSlug}`,
    lessonData
  )
  return res.data.data
}

export const deleteLesson = async (
  courseSlug: string,
  topicSlug: string,
  lessonSlug: string
): Promise<{ message: string }> => {
  const res = await http.delete<{ message: string }>(`/courses/${courseSlug}/topics/${topicSlug}/lessons/${lessonSlug}`)
  return res.data
}

export const createOrder = async (
  courseIds: string[]
): Promise<{
  order_id: string
  total_amount: number
  courses: Array<{
    _id: string
    title: string
    price: number
  }>
}> => {
  const res = await http.post<{
    message: string
    data: {
      order_id: string
      total_amount: number
      courses: Array<{
        _id: string
        title: string
        price: number
      }>
    }
  }>('/orders', { course_ids: courseIds })
  return res.data.data
}

export const createVNPayPayment = async (orderId: string): Promise<{ payment_url: string }> => {
  const res = await http.post<{ message: string; data: { payment_url: string } }>(`/payments/vnpay/${orderId}`)
  return res.data.data
}
