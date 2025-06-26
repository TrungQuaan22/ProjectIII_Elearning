import databaseService from './database.services'
import Category, { CategoryType } from '../models/schemas/Category.schema'

const categoryService = {
  async createCategory(payload: { name: string; image: string; description?: string }) {
    const exists = await databaseService.categories.findOne({ name: payload.name })
    if (exists) {
      throw new Error('Category already exists')
    }
    const category = new Category(payload)
    await databaseService.categories.insertOne(category)
    return category
  },

  async getCategories() {
    return databaseService.categories.find().toArray()
  }
}

export default categoryService
