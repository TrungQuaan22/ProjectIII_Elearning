import { BlogStatus } from "src/constants/enum"

export interface BlogType {
  _id?: string
  title: string
  slug?: string
  content: string
  summary?: string
  tags?: string[]
  thumbnail?: string
  status: BlogStatus
  author_id: string
  category_id: string
  created_at?: Date
  updated_at?: Date
}