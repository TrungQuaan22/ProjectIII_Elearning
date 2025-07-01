import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { getBlogBySlug } from 'src/apis/blogs.api'
import type { BlogType } from 'src/types/blog.type'

interface BlogDetailData {
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

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [blog, setBlog] = useState<BlogDetailData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      fetchBlogDetail(slug)
    }
  }, [slug])

  const fetchBlogDetail = async (blogSlug: string) => {
    setLoading(true)
    try {
      const data = await getBlogBySlug(blogSlug)
      setBlog(data)
    } catch (error) {
      console.error('Error fetching blog detail:', error)
      toast.error('Không thể tải chi tiết blog')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>Không tìm thấy bài viết</h1>
          <p className='text-gray-600 mb-8'>Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <Link
            to='/blogs'
            className='inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
          >
            Quay lại danh sách blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      {/* Breadcrumb */}
      <nav className='flex mb-8' aria-label='Breadcrumb'>
        <ol className='inline-flex items-center space-x-1 md:space-x-3'>
          <li className='inline-flex items-center'>
            <Link to='/' className='text-gray-700 hover:text-blue-600'>
              Trang chủ
            </Link>
          </li>
          <li>
            <div className='flex items-center'>
              <span className='mx-2 text-gray-400'>/</span>
              <Link to='/blogs' className='text-gray-700 hover:text-blue-600'>
                Blog
              </Link>
            </div>
          </li>
          <li aria-current='page'>
            <div className='flex items-center'>
              <span className='mx-2 text-gray-400'>/</span>
              <span className='text-gray-500'>{blog.title}</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Blog Header */}
      <article className='bg-white rounded-lg shadow-lg overflow-hidden'>
        {/* Blog Image */}
        {blog.thumbnail && (
          <div className='w-full h-64 md:h-96'>
            <img src={blog.thumbnail} alt={blog.title} className='w-full h-full object-cover' />
          </div>
        )}

        {/* Blog Content */}
        <div className='p-6 md:p-8'>
          {/* Title */}
          <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>{blog.title}</h1>

          {/* Meta Info */}
          <div className='flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200'>
            <div className='flex items-center'>
              <svg className='w-4 h-4 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z' clipRule='evenodd' />
              </svg>
              <span>Tác giả</span>
            </div>
            {blog.created_at && (
              <div className='flex items-center'>
                <svg className='w-4 h-4 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
                    clipRule='evenodd'
                  />
                </svg>
                <span>{formatDate(blog.created_at.toString())}</span>
              </div>
            )}
            {blog.updated_at && blog.updated_at !== blog.created_at && (
              <div className='flex items-center'>
                <svg className='w-4 h-4 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z'
                    clipRule='evenodd'
                  />
                </svg>
                <span>Cập nhật: {formatDate(blog.updated_at.toString())}</span>
              </div>
            )}
          </div>

          {/* Summary */}
          {blog.summary && (
            <div className='bg-blue-50 border-l-4 border-blue-400 p-4 mb-6'>
              <p className='text-blue-800 font-medium'>{blog.summary}</p>
            </div>
          )}

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className='flex flex-wrap gap-2 mb-6'>
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800'
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <div className='prose prose-lg max-w-none' dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>
      </article>

      {/* Back to Blogs */}
      <div className='mt-8 text-center'>
        <Link
          to='/blogs'
          className='inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors'
        >
          <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 19l-7-7m0 0l7-7m-7 7h18' />
          </svg>
          Quay lại danh sách blog
        </Link>
      </div>
    </div>
  )
}
