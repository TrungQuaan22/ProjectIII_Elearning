import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getBlogs, deleteBlog } from 'src/apis/blogs.api'
import { BlogStatus } from 'src/constants/enum'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { BlogResponse } from 'src/apis/blogs.api'
import type { BlogType } from 'src/types/blog.type'

export default function BlogsListAdmin() {
  const [currentPage, setCurrentPage] = useState(1)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data, isLoading, isError } = useQuery<BlogResponse>({
    queryKey: ['blogs', currentPage],
    queryFn: () => getBlogs(currentPage, 9)
  })
  console.log(data)
  const blogs = data?.blogs || []
  const totalPages = data?.pagination?.total_pages || 1

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBlog(id),
    onSuccess: () => {
      toast.success('Đã xóa blog!')
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
    onError: () => toast.error('Xóa blog thất bại')
  })

  const handleDelete = (blog: BlogType) => {
    if (window.confirm('Bạn chắc chắn muốn xóa blog này?')) {
      deleteMutation.mutate(blog.id || blog._id || '')
    }
  }

  const handleEdit = (blog: BlogType) => {
    navigate(`/dashboard/blogs/edit/${blog.slug}`)
  }

  if (isLoading && blogs.length === 0) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
      </div>
    )
  }

  if (isError) {
    toast.error('Không thể tải danh sách blog')
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='text-red-500'>Đã xảy ra lỗi khi tải blog.</div>
      </div>
    )
  }

  const getStatusBadge = (status: BlogStatus) => {
    const statusConfig = {
      [BlogStatus.Draft]: { label: 'Bản nháp', className: 'bg-gray-100 text-gray-800' },
      [BlogStatus.Published]: { label: 'Đã xuất bản', className: 'bg-green-100 text-green-800' }
    }
    const config = statusConfig[status]
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      {/* Header */}
      <div className='text-center mb-12'>
        <h1 className='text-4xl font-bold text-gray-900 mb-4'>Blog</h1>
        <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
          Khám phá những bài viết mới nhất về công nghệ, học tập và phát triển bản thân
        </p>
      </div>

      {/* Blog Grid */}
      {blogs.length === 0 ? (
        <div className='text-center py-12'>
          <div className='text-gray-500 text-lg'>Chưa có bài viết nào</div>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'>
          {blogs.map((blog: BlogType) => (
            <article
              key={blog.id || blog._id}
              className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'
            >
              {/* Blog Image */}
              {blog.thumbnail && (
                <div className='aspect-w-16 aspect-h-9'>
                  <img src={blog.thumbnail} alt={blog.title} className='w-full h-48 object-cover' />
                </div>
              )}

              {/* Blog Content */}
              <div className='p-6'>
                {/* Category */}
                {blog.category && <div className='text-sm text-blue-600 font-medium mb-2'>{blog.category.name}</div>}

                {/* Title */}
                <h2 className='text-xl font-bold text-gray-900 mb-3 line-clamp-2'>
                  <Link to={`/blogs/${blog.slug}`} className='hover:text-blue-600 transition-colors'>
                    {blog.title}
                  </Link>
                </h2>

                {/* Summary */}
                {blog.summary && <p className='text-gray-600 mb-4 line-clamp-3'>{truncateText(blog.summary, 120)}</p>}

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className='flex flex-wrap gap-2 mb-4'>
                    {blog.tags.slice(0, 3).map((tag: string, index: number) => (
                      <span
                        key={index}
                        className='inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800'
                      >
                        {tag}
                      </span>
                    ))}
                    {blog?.tags?.length && blog.tags.length > 3 && (
                      <span className='inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800'>
                        +{blog.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Meta Info */}
                <div className='flex items-center justify-between text-sm text-gray-500'>
                  <div className='flex items-center space-x-4'>
                    {blog.author && <span>{blog.author.name}</span>}
                    {blog.updated_at && <span>{formatDate(blog.updated_at.toString())}</span>}
                  </div>
                  {getStatusBadge(blog.status)}
                </div>
                {/* Action Buttons */}
                <div className='flex gap-2 mt-4'>
                  <button
                    className='px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500'
                    onClick={() => handleEdit(blog)}
                  >
                    Sửa
                  </button>
                  <button
                    className='px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600'
                    onClick={() => handleDelete(blog)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex justify-center'>
          <nav className='flex items-center space-x-2'>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className='px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Trước
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className='px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Sau
            </button>
          </nav>
        </div>
      )}

      {/* Loading indicator for pagination */}
      {isLoading && blogs.length > 0 && (
        <div className='flex justify-center mt-8'>
          <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500'></div>
        </div>
      )}
    </div>
  )
}
