import { Book } from './course.type'

export interface Author {
  id: number
  full_name: string
  description?: string
  slug?: string
  deleted_at?: string | null
  created_at?: string
  updated_at?: string
  books?: Book[]
}
