import { ObjectId } from 'mongodb'
import { BlogStatus } from '~/constants/enum'

interface BlogType {
  _id?: ObjectId
  title: string
  slug?: string
  content: string
  summary?: string
  tags?: string[]
  thumbnail?: string
  status: BlogStatus
  author_id: ObjectId
  category_id: ObjectId
  created_at?: Date
  updated_at?: Date
}

export default class Blog {
  _id: ObjectId
  title: string
  slug: string
  content: string
  summary: string
  tags: string[]
  thumbnail: string
  status: BlogStatus
  author_id: ObjectId
  category_id: ObjectId
  created_at: Date
  updated_at: Date

  constructor(blog: BlogType) {
    const date = new Date()
    this._id = blog._id || new ObjectId()
    this.title = blog.title
    this.slug = blog.slug || Blog.generateSlug(blog.title)
    this.content = blog.content
    this.summary = blog.summary || ''
    this.tags = blog.tags || []
    this.thumbnail = blog.thumbnail || ''
    this.status = blog.status
    this.author_id = blog.author_id
    this.category_id = blog.category_id
    this.created_at = blog.created_at || date
    this.updated_at = blog.updated_at || date
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
