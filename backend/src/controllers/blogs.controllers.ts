import { Request, Response, NextFunction } from 'express'
import blogService from '~/services/blogs.services'
import { ErrorWithStatus } from '~/models/Errors'
import { CreateBlogReqBody, UpdateBlogReqBody, GetBlogsReqQuery } from '~/models/requests/blogs.request'
import { BlogStatus } from '~/constants/enum'

export const createBlogController = async (
  req: Request<Record<string, never>, unknown, CreateBlogReqBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = req.user?._id

    if (!user_id) {
      throw new ErrorWithStatus({
        message: 'User not found',
        status: 401
      })
    }

    const blog = await blogService.create({
      ...req.body,
      author_id: user_id
    })

    res.status(201).json({
      message: 'Blog created successfully',
      data: blog
    })
  } catch (error) {
    next(error)
  }
}

export const getBlogsController = async (
  req: Request<Record<string, never>, unknown, unknown, GetBlogsReqQuery & { category?: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = { ...req.query, category: req.query.category }
    // Nếu không phải admin thì chỉ cho lấy blog published
    if (!req.user || req.user.role !== 'admin') {
      query.status = BlogStatus.Published
    }
    const result = await blogService.findAll(query)

    res.json({
      message: 'Get blogs successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const getBlogController = async (req: Request<{ slug: string }>, res: Response, next: NextFunction) => {
  try {
    const blog = await blogService.findBySlug(req.params.slug)
    if (!blog) {
      throw new ErrorWithStatus({
        message: 'Blog not found',
        status: 404
      })
    }
    res.json({
      message: 'Get blog successfully',
      data: blog
    })
  } catch (error) {
    next(error)
  }
}

export const updateBlogController = async (
  req: Request<{ slug: string }, unknown, UpdateBlogReqBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await blogService.updateBySlug(req.params.slug, req.body)
    if (!result) {
      throw new ErrorWithStatus({
        message: 'Blog not found',
        status: 404
      })
    }
    res.json({
      message: 'Blog updated successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const deleteBlogController = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    await blogService.delete(req.params.id)
    res.json({
      message: 'Blog deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}
