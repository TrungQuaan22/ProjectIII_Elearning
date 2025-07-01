import { Request, Response } from 'express'
import categoryService from '../services/category.services'

export const createCategoryController = async (req: Request, res: Response) => {
  const { name, image, description } = req.body
  if (!name || !image) {
    return res.status(400).json({ message: 'Name and image are required' })
  }
  const category = await categoryService.createCategory({ name, image, description })
  res.status(201).json(category)
}

export const getCategoriesController = async (req: Request, res: Response) => {
  const categories = await categoryService.getCategories()
  res.json(categories)
}
