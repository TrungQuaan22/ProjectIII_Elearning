import { Router } from 'express'
import {
  createBlogController,
  getBlogsController,
  getBlogController,
  updateBlogController,
  deleteBlogController
} from '~/controllers/blogs.controllers'
import { accessTokenValidator, verifyAdmin } from '~/middlewares/users.middlewares'
import { createBlogValidator, updateBlogValidator, blogIdValidator } from '~/middlewares/blogs.middlewares'
import { optionalAuth } from '~/middlewares/optionalAuth.middleware'

const blogsRouter = Router()

// Public routes
blogsRouter.get('/', optionalAuth, getBlogsController)
blogsRouter.get('/:slug', getBlogController)

// Protected routes (require authentication and admin role)
blogsRouter.post('/', accessTokenValidator, verifyAdmin, createBlogValidator, createBlogController)
blogsRouter.put('/:slug', accessTokenValidator, verifyAdmin, updateBlogValidator, updateBlogController)
blogsRouter.delete('/:id', accessTokenValidator, verifyAdmin, blogIdValidator, deleteBlogController)

export default blogsRouter
