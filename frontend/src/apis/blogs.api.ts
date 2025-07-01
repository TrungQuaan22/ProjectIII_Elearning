import http from 'src/utils/http'
import type { BlogType } from 'src/types/blog.type'

export interface BlogResponse {
  blogs: BlogType[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

export interface BlogDetailResponse {
  _id: string
  title: string
  slug: string
  content: string
  summary?: string
  tags?: string[]
  thumbnail?: string
  status: string
  author_id: string
  category_id: string
  created_at?: Date
  updated_at?: Date
}

export const getBlogs = async (page = 1, limit = 10): Promise<BlogResponse> => {
  const res = await http.get<{ data: BlogResponse }>(`/blogs?page=${page}&limit=${limit}`)
  return res.data.data
}

export const getBlogBySlug = async (slug: string): Promise<BlogDetailResponse> => {
  const res = await http.get<{ data: BlogDetailResponse }>(`/blogs/${slug}`)
  return res.data.data
}

export const createBlog = async (data: Omit<BlogType, '_id' | 'created_at' | 'updated_at' | 'slug' | 'author_id'>) => {
  const res = await http.post<BlogType>('/blogs', data)
  return res.data
}
export const updateBlog = async (slug: string, data: Partial<BlogType>) => {
  const res = await http.put<BlogType>(`/blogs/${slug}`, data)
  return res.data
}

export const deleteBlog = async (id: string) => {
  const res = await http.delete(`/blogs/${id}`)
  return res.data
}

export const getBlogsWithParams = async (params: {
  page?: number
  limit?: number
  search?: string
  category?: string
}) => {
  const query = new URLSearchParams()
  if (params.page) query.append('page', params.page.toString())
  if (params.limit) query.append('limit', params.limit.toString())
  if (params.search) query.append('search', params.search)
  if (params.category) query.append('category', params.category)
  const res = await http.get<{ data: BlogResponse }>(`/blogs?${query.toString()}`)
  return res.data.data
}
