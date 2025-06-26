import express from 'express'
import categoryController from '../controllers/category.controllers'

const router = express.Router()

router.post('/categories', categoryController.createCategory)
router.get('/categories', categoryController.getCategories)

export default router
