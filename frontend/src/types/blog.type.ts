import { BlogStatus } from 'src/constants/enum'

export interface BlogType {
  id?: string
  _id?: string
  title: string
  slug?: string
  content?: string
  summary?: string
  tags?: string[]
  thumbnail?: string
  status: BlogStatus
  author_id?: string
  category_id?: string
  created_at?: Date
  updated_at?: Date
  author?: {
    id: string
    name: string
  }
  category?: {
    name: string
    slug: string
  }
}
