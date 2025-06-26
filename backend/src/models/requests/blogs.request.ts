import { BlogStatus } from '~/constants/enum'
import { ObjectId } from 'mongodb'

/**
 * Interface for creating a new blog
 * @property title - Required: The title of the blog
 * @property content - Required: The main content of the blog
 * @property summary - Optional: A brief summary of the blog
 * @property tags - Optional: Array of tags for categorizing the blog
 * @property thumbnail - Optional: URL of the blog's thumbnail image
 * @property status - Optional: Initial status of the blog (defaults to Draft)
 * @property category_id - Required: The ID of the category for the blog
 */
export interface CreateBlogReqBody {
  title: string
  content: string
  summary?: string
  tags?: string[]
  thumbnail?: string
  status?: BlogStatus
  category_id: string
}

/**
 * Interface for updating an existing blog
 * All fields are optional as we may want to update only specific fields
 */
export interface UpdateBlogReqBody {
  title?: string
  content?: string
  summary?: string
  tags?: string[]
  thumbnail?: string
  status?: BlogStatus
}

/**
 * Interface for query parameters when getting blogs
 * Used for filtering and pagination
 */
export interface GetBlogsReqQuery {
  page?: string
  limit?: string
  status?: BlogStatus
  tag?: string
  author_id?: string
  search?: string
}

/**
 * Interface for URL parameters
 * Used in routes that require a blog ID
 */
export interface BlogParams {
  id: string
}

/**
 * Interface for the blog document in database
 * Extends CreateBlogReqBody and adds metadata fields
 */
export interface BlogDocument extends Omit<CreateBlogReqBody, 'status'> {
  _id: ObjectId
  author_id: ObjectId
  status: BlogStatus // Status is required in database
  created_at: Date
  updated_at: Date
}
