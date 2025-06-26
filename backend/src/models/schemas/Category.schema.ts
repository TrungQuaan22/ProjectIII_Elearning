import { ObjectId } from 'mongodb'

export interface CategoryType {
  _id?: ObjectId
  name: string // bắt buộc
  image: string // bắt buộc
  slug?: string
  description?: string
  created_at?: Date
  updated_at?: Date
}

export default class Category {
  _id: ObjectId
  name: string
  image: string
  slug: string
  description: string
  created_at: Date
  updated_at: Date

  constructor(category: CategoryType) {
    const date = new Date()
    this._id = category._id || new ObjectId()
    this.name = category.name
    this.image = category.image
    this.slug = category.slug || Category.generateSlug(category.name)
    this.description = category.description || ''
    this.created_at = category.created_at || date
    this.updated_at = category.updated_at || date
  }

  static generateSlug(name: string): string {
    return name
      .normalize('NFD')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
      .toLowerCase()
  }
} 