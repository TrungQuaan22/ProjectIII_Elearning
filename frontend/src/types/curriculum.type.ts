export interface LessonType {
  _id?: string
  title: string
  slug?: string
  description: string
  video_url?: string
  duration: number // in seconds
  order: number
  created_at?: Date
  updated_at?: Date
}

export interface TopicType {
  _id?: string
  title: string
  slug?: string
  summary: string
  order: number
  lessons?: LessonType[]
  created_at?: Date
  updated_at?: Date
}

// Form data interfaces for curriculum management
export interface TopicFormData {
  title: string
  summary?: string
}

export interface LessonFormData {
  title: string
  description?: string
  duration?: number
  video_url?: string
}

// API request/response interfaces
// Create requests - required fields
export interface CreateTopicRequest {
  title: string // Required
  summary: string // Required
}

export interface CreateLessonRequest {
  title: string // Required
  description: string // Required
  duration: number // Required
  video_url: string // Required
}

// Update requests - all fields optional
export interface UpdateTopicRequest {
  title?: string
  summary?: string
}

export interface UpdateLessonRequest {
  title?: string
  description?: string
  duration?: number
  video_url?: string
}

// Validation error interfaces
export interface TopicFormErrors {
  title?: string
  summary?: string
}

export interface LessonFormErrors {
  title?: string
  description?: string
  duration?: string
  video_url?: string
}

export interface CurriculumFormErrors {
  title?: string
  summary?: string
  description?: string
  duration?: string
  video_url?: string
  [key: string]: string | undefined
}
