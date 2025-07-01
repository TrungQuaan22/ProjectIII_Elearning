import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import TinyMCECloudinary, { TinyMCERef } from 'src/components/DashBoard/TinyMCECloudinary'
import { getBlogBySlug, updateBlog } from 'src/apis/blogs.api'
import { getCategories } from 'src/apis/categories.api'
import { BlogStatus } from 'src/constants/enum'
import { useQuery } from '@tanstack/react-query'

interface BlogFormData {
  title: string
  content: string
  category_id: string
  thumbnail: string
  summary: string
  tags: string[]
  status: BlogStatus
}

const initialFormData: BlogFormData = {
  title: '',
  content: '',
  category_id: '',
  thumbnail: '',
  summary: '',
  tags: [],
  status: BlogStatus.Draft
}

export default function BlogEditPage() {
  const navigate = useNavigate()
  const { slug } = useParams<{ slug: string }>()

  // Fetch blog detail
  const {
    data: blog,
    isLoading: isLoadingBlog,
    error: errorBlog
  } = useQuery({
    queryKey: ['blog-detail', slug],
    queryFn: () => getBlogBySlug(slug!),
    enabled: !!slug
  })

  // Fetch categories
  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    error: errorCategories
  } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  })

  // Form state
  const [formData, setFormData] = useState<BlogFormData>(initialFormData)
  const [tagInput, setTagInput] = useState('')
  const editorRef = useRef<TinyMCERef>(null)

  // Fill form when blog/categories loaded
  useEffect(() => {
    if (blog && categories.length > 0) {
      setFormData({
        title: blog.title,
        content: blog.content || '',
        category_id: blog.category_id || '',
        thumbnail: blog.thumbnail || '',
        summary: blog.summary || '',
        tags: blog.tags || [],
        status: blog.status as BlogStatus
      })
      if (editorRef.current) {
        editorRef.current.setContent(blog.content || '')
      }
    }
  }, [blog, categories])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error('Vui lòng nhập tiêu đề blog')
      return
    }

    if (!formData.category_id) {
      toast.error('Vui lòng chọn danh mục')
      return
    }

    if (!slug) {
      toast.error('Không tìm thấy slug blog')
      return
    }

    // Lấy content từ editor
    const content = editorRef.current?.getContent() || ''
    if (!content.trim()) {
      toast.error('Vui lòng nhập nội dung blog')
      return
    }

    try {
      const blogData = {
        ...formData,
        content
      }
      await updateBlog(slug, blogData)
      toast.success('Cập nhật blog thành công!')
      navigate('/dashboard/blogs')
    } catch (error) {
      console.error('Error updating blog:', error)
      toast.error('Có lỗi xảy ra khi cập nhật blog')
    }
  }

  if (isLoadingBlog || isLoadingCategories) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
      </div>
    )
  }

  if (errorBlog || !blog) {
    return (
      <div className='text-center py-12'>
        <p className='text-red-600 text-lg'>Không tìm thấy blog</p>
      </div>
    )
  }

  if (errorCategories) {
    return (
      <div className='text-center py-12'>
        <p className='text-red-600 text-lg'>Không thể tải danh mục</p>
      </div>
    )
  }

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <div className='bg-white rounded-lg shadow-md p-6'>
        <h1 className='text-2xl font-bold text-gray-900 mb-6'>Chỉnh sửa Blog</h1>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Title */}
          <div>
            <label htmlFor='title' className='block text-sm font-medium text-gray-700 mb-2'>
              Tiêu đề <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              id='title'
              name='title'
              value={formData.title}
              onChange={handleInputChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              placeholder='Nhập tiêu đề blog...'
              required
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor='category_id' className='block text-sm font-medium text-gray-700 mb-2'>
              Danh mục <span className='text-red-500'>*</span>
            </label>
            <select
              id='category_id'
              name='category_id'
              value={formData.category_id}
              onChange={handleInputChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              required
            >
              <option value=''>Chọn danh mục</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Summary */}
          <div>
            <label htmlFor='summary' className='block text-sm font-medium text-gray-700 mb-2'>
              Tóm tắt
            </label>
            <textarea
              id='summary'
              name='summary'
              value={formData.summary}
              onChange={handleInputChange}
              rows={3}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              placeholder='Nhập tóm tắt blog...'
            />
          </div>

          {/* Tags */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Tags</label>
            <div className='flex gap-2 mb-2'>
              <input
                type='text'
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='Nhập tag và nhấn Enter...'
              />
              <button
                type='button'
                onClick={handleAddTag}
                className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                Thêm
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className='flex flex-wrap gap-2'>
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800'
                  >
                    {tag}
                    <button
                      type='button'
                      onClick={() => handleRemoveTag(tag)}
                      className='ml-2 text-blue-600 hover:text-blue-800'
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <label htmlFor='status' className='block text-sm font-medium text-gray-700 mb-2'>
              Trạng thái
            </label>
            <select
              id='status'
              name='status'
              value={formData.status}
              onChange={handleInputChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            >
              <option value={BlogStatus.Draft}>Bản nháp</option>
              <option value={BlogStatus.Published}>Xuất bản</option>
            </select>
          </div>

          {/* Content */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Nội dung <span className='text-red-500'>*</span>
            </label>
            <div className='border border-gray-300 rounded-md'>
              <TinyMCECloudinary initialValue={formData.content} ref={editorRef} />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className='flex gap-4 pt-6'>
            <button
              type='submit'
              className='px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              Cập nhật Blog
            </button>
            <button
              type='button'
              onClick={() => navigate('/dashboard/blogs')}
              className='px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500'
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
