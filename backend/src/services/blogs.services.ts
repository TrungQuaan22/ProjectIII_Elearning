import { ObjectId } from 'mongodb'
import Blog from '~/models/schemas/Blog.schema'
import databaseService from './database.services'
import { BlogStatus } from '~/constants/enum'
import { CreateBlogReqBody, UpdateBlogReqBody, GetBlogsReqQuery } from '~/models/requests/blogs.request'

class BlogService {
  async create(payload: CreateBlogReqBody & { author_id: ObjectId }) {
    const baseSlug = Blog.generateSlug(payload.title)
    let slug = baseSlug
    const exists = await databaseService.blogs.findOne({ slug })
    if (exists) {
      slug = `${baseSlug}-${Date.now()}`
    }
    const result = await databaseService.blogs.insertOne(
      new Blog({
        ...payload,
        category_id: new ObjectId(payload.category_id),
        slug,
        status: payload.status || BlogStatus.Draft
      })
    )
    const blog = await databaseService.blogs.findOne({ _id: result.insertedId })
    return blog
  }

  async findById(id: string) {
    const blog = await databaseService.blogs.findOne({ _id: new ObjectId(id) })
    return blog
  }

  async findAll(query: GetBlogsReqQuery & { category?: string }) {
    const { page = '1', limit = '10', status, tag, author_id, search, category } = query
    const page_number = Number(page)
    const limit_number = Number(limit)
    const skip = (page_number - 1) * limit_number

    const match: any = {}
    if (status) {
      match.status = status
    }
    if (tag) {
      match.tags = tag
    }
    if (author_id) {
      match.author_id = new ObjectId(author_id)
    }
    if (search) {
      match.title = { $regex: search, $options: 'i' }
    }

    const pipeline: any[] = [
      { $match: match },
      {
        $lookup: {
          from: 'users',
          localField: 'author_id',
          foreignField: '_id',
          as: 'author'
        }
      },
      { $unwind: '$author' },
      {
        $lookup: {
          from: 'categories',
          localField: 'category_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } }
    ]
    if (category) {
      pipeline.push({ $match: { 'category.slug': category } })
    }
    pipeline.push(
      {
        $project: {
          _id: 1,
          title: 1,
          slug: 1,
          summary: 1,
          thumbnail: 1,
          tags: 1,
          status: 1,
          updated_at: 1,
          'author.name': 1,
          'author._id': 1,
          'category.name': 1,
          'category.slug': 1
        }
      },
      { $sort: { updated_at: -1 } },
      { $skip: skip },
      { $limit: limit_number }
    )

    const [blogs, total] = await Promise.all([
      databaseService.blogs.aggregate(pipeline).toArray(),
      databaseService.blogs.countDocuments(match)
    ])

    return {
      blogs: blogs.map((blog) => ({
        id: blog._id,
        title: blog.title,
        slug: blog.slug,
        summary: blog.summary,
        thumbnail: blog.thumbnail,
        tags: blog.tags,
        status: blog.status,
        updated_at: blog.updated_at,
        author: {
          id: blog.author._id,
          name: blog.author.name
        },
        category: blog.category
          ? {
              name: blog.category.name,
              slug: blog.category.slug
            }
          : null
      })),
      pagination: {
        page: page_number,
        limit: limit_number,
        total,
        total_pages: Math.ceil(total / limit_number)
      }
    }
  }

  async findBySlug(slug: string) {
    const blog = await databaseService.blogs.findOne({ slug })
    return blog
  }

  async update(id: string, payload: UpdateBlogReqBody) {
    const update_data: any = {}
    if (payload.title) update_data.title = payload.title
    if (payload.content) update_data.content = payload.content
    if (payload.summary) update_data.summary = payload.summary
    if (payload.tags) update_data.tags = payload.tags
    if (payload.thumbnail) update_data.thumbnail = payload.thumbnail
    if (payload.status) update_data.status = payload.status
    update_data.updated_at = new Date()

    const result = await databaseService.blogs.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update_data },
      { returnDocument: 'after' }
    )
    return result
  }

  async updateBySlug(slug: string, payload: UpdateBlogReqBody) {
    const update_data: any = {}
    if (payload.title) update_data.title = payload.title
    if (payload.content) update_data.content = payload.content
    if (payload.summary) update_data.summary = payload.summary
    if (payload.tags) update_data.tags = payload.tags
    if (payload.thumbnail) update_data.thumbnail = payload.thumbnail
    if (payload.status) update_data.status = payload.status
    update_data.updated_at = new Date()

    const result = await databaseService.blogs.findOneAndUpdate(
      { slug },
      { $set: update_data },
      { returnDocument: 'after' }
    )
    return result
  }

  async delete(id: string) {
    await databaseService.blogs.deleteOne({ _id: new ObjectId(id) })
  }

  async deleteBySlug(slug: string) {
    await databaseService.blogs.deleteOne({ slug })
  }
}

const blogService = new BlogService()
export default blogService
