import { Request, Response } from 'express'
import categoryService from '../services/category.services'

const categoryController = {
  async createCategory(req: Request, res: Response) {
    const { name, image, description } = req.body
    if (!name || !image) {
      return res.status(400).json({ message: 'Name and image are required' })
    }
    const category = await categoryService.createCategory({ name, image, description })
    res.status(201).json(category)
  },

  async getCategories(req: Request, res: Response) {
    const categories = await categoryService.getCategories()
    res.json(categories)
  }
}

export default categoryController
