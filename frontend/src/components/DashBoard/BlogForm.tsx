import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import TinyMCECloudinary, { TinyMCERef } from './TinyMCECloudinary'
import { createBlog, updateBlog } from 'src/apis/blogs.api'
import { getCategories } from 'src/apis/categories.api'
import type { CategoryType } from 'src/types/category.type'
import { BlogStatus } from 'src/constants/enum'
import { useMutation } from '@tanstack/react-query'
import type { BlogType } from 'src/types/blog.type'

interface BlogFormData {
  title: string
  content: string
  category_id: string
  summary: string
  thumbnail: string
  tags: string[]
  status: BlogStatus
}

const initialFormData: BlogFormData = {
  title: '',
  content: '',
  category_id: '',
  summary: '',
  thumbnail: '',
  tags: [],
  status: BlogStatus.Draft
}

interface BlogFormProps {
  initialData?: BlogType | null
  onClose?: () => void
}

export default function BlogForm({ initialData, onClose }: BlogFormProps) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<BlogFormData>(
    initialData
      ? {
          title: initialData.title || '',
          content: initialData.content || '',
          category_id: initialData.category_id || '',
          summary: initialData.summary || '',
          thumbnail: initialData.thumbnail || '',
          tags: initialData.tags || [],
          status: initialData.status || BlogStatus.Draft
        }
      : initialFormData
  )
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [tagInput, setTagInput] = useState('')
  const editorRef = useRef<TinyMCERef>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (initialData && categories.length > 0) {
      setFormData({
        title: initialData.title || '',
        content: initialData.content || '',
        category_id: initialData.category_id || '',
        summary: initialData.summary || '',
        thumbnail: initialData.thumbnail || '',
        tags: initialData.tags || [],
        status: initialData.status || BlogStatus.Draft
      })
      if (editorRef.current) {
        editorRef.current.setContent(initialData.content || '')
      }
    }
  }, [initialData, categories])

  const fetchCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Không thể tải danh sách danh mục')
    }
  }

  const mutation = useMutation<BlogType, unknown, BlogFormData>({
    mutationFn: (blogData: BlogFormData) => {
      if (initialData && initialData.slug) {
        return updateBlog(initialData.slug, blogData)
      }
      return createBlog(blogData)
    },
    onSuccess: () => {
      toast.success(initialData ? 'Cập nhật blog thành công!' : 'Tạo blog thành công!')
      if (onClose) onClose()
      navigate('/dashboard/blogs')
    },
    onError: (error: unknown) => {
      console.error('Error creating blog:', error)
      let message = 'Có lỗi xảy ra khi tạo/cập nhật blog'
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: unknown }).response === 'object' &&
        (error as { response?: unknown }).response !== null
      ) {
        const response = (error as { response?: unknown }).response as { data?: unknown } | undefined
        if (response && 'data' in response && typeof response.data === 'object' && response.data !== null) {
          const data = response.data as { message?: unknown }
          if ('message' in data && typeof data.message === 'string') {
            message = data.message
          }
        }
      }
      toast.error(message)
    }
  })

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

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      toast.error('Vui lòng nhập tiêu đề blog')
      return
    }
    if (!formData.category_id) {
      toast.error('Vui lòng chọn danh mục')
      return
    }
    // Lấy content từ editor
    const content = editorRef.current?.getContent() || ''
    if (!content.trim()) {
      toast.error('Vui lòng nhập nội dung blog')
      return
    }
    const blogData = {
      ...formData,
      content
    }
    mutation.mutate(blogData)
  }

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <div className='bg-white rounded-lg shadow-md p-6'>
        <h1 className='text-2xl font-bold text-gray-900 mb-6'>{initialData ? 'Chỉnh sửa Blog' : 'Tạo Blog Mới'}</h1>

        <div className='space-y-6'>
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
          {/* Thumbnail */}
          <div>
            <label htmlFor='thumbnail' className='block text-sm font-medium text-gray-700 mb-2'>
              Ảnh đại diện <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              id='thumbnail'
              name='thumbnail'
              value={formData.thumbnail}
              onChange={handleInputChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              placeholder='Nhập link ảnh đại diện...'
              required
            />
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
              type='button'
              onClick={() => handleSubmit()}
              className='px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {mutation.status === 'pending'
                ? initialData
                  ? 'Đang cập nhật...'
                  : 'Đang tạo...'
                : initialData
                  ? 'Cập nhật Blog'
                  : 'Tạo Blog'}
            </button>
            <button
              type='button'
              onClick={onClose ? onClose : () => navigate('/dashboard/blogs')}
              className='px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500'
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
