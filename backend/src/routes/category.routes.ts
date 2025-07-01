import express from 'express'
import { getCategoriesController } from '../controllers/category.controllers'


const categoryRouter = express.Router()

categoryRouter.get('/', getCategoriesController)

export default categoryRouter
