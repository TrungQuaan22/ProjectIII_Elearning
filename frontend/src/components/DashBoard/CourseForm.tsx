import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { CourseType } from 'src/types/course.type'
import { createCourse, updateCourse } from 'src/apis/courses.api'
import { useNavigate } from 'react-router-dom'

type FormMode = 'add' | 'edit'

interface CourseFormProps {
  mode: FormMode
  initialData?: Partial<CourseType>
  onSuccess?: (course: CourseType) => void
}

interface FormData {
  title: string
  description: string
  detailed_description: string
  thumbnail: string
  price: number | string
  status: 'published' | 'draft'
}

interface FormErrors {
  title?: string
  description?: string
  detailed_description?: string
  thumbnail?: string
  price?: string
}

export default function CourseForm({ mode, initialData, onSuccess }: CourseFormProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [form, setForm] = useState<FormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    detailed_description: initialData?.detailed_description || '',
    thumbnail: initialData?.thumbnail || '',
    price: initialData?.price || '',
    status: (initialData?.status as 'published' | 'draft') || 'draft'
  })

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!form.title.trim()) {
      newErrors.title = 'Tên khóa học là bắt buộc'
    } else if (form.title.length < 5) {
      newErrors.title = 'Tên khóa học phải có ít nhất 5 ký tự'
    }

    if (!form.description.trim()) {
      newErrors.description = 'Mô tả ngắn là bắt buộc'
    } else if (form.description.length < 10) {
      newErrors.description = 'Mô tả ngắn phải có ít nhất 10 ký tự'
    }

    if (!form.detailed_description.trim()) {
      newErrors.detailed_description = 'Mô tả chi tiết là bắt buộc'
    } else if (form.detailed_description.length < 20) {
      newErrors.detailed_description = 'Mô tả chi tiết phải có ít nhất 20 ký tự'
    }

    if (!form.thumbnail.trim()) {
      newErrors.thumbnail = 'Thumbnail là bắt buộc'
    } else if (!isValidUrl(form.thumbnail)) {
      newErrors.thumbnail = 'URL thumbnail không hợp lệ'
    }

    if (form.price === '' || form.price === 0) {
      newErrors.price = 'Giá khóa học là bắt buộc'
    } else if (Number(form.price) < 0) {
      newErrors.price = 'Giá khóa học không được âm'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string)
      return true
    } catch {
      return false
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createCourse,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      onSuccess?.(data)
      toast.success('Tạo khóa học thành công!')
      navigate('/dashboard/courses')
    },
    onError: (error: Error) => {
      console.error('Create course error:', error)
      setIsSubmitting(false)
      toast.error('Có lỗi xảy ra khi tạo khóa học. Vui lòng thử lại!')
    }
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: Partial<CourseType> }) => updateCourse(slug, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      queryClient.invalidateQueries({ queryKey: ['course-detail', initialData?.slug] })
      onSuccess?.(data)
      toast.success('Cập nhật khóa học thành công!')
      navigate('/dashboard/courses')
    },
    onError: (error: Error) => {
      console.error('Update course error:', error)
      setIsSubmitting(false)
      toast.error('Có lỗi xảy ra khi cập nhật khóa học. Vui lòng thử lại!')
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    const courseData = {
      ...form,
      price: Number(form.price)
    }

    try {
      if (mode === 'add') {
        await createMutation.mutateAsync(courseData)
      } else {
        if (!initialData?.slug) {
          throw new Error('Course slug is required for update')
        }
        await updateMutation.mutateAsync({ slug: initialData.slug, data: courseData })
      }
    } catch (error) {
      console.error('Submit error:', error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className='w-full bg-white p-6 rounded-lg shadow-lg'>
      <h2 className='text-2xl font-bold mb-6 text-gray-800'>
        {mode === 'add' ? 'Tạo khóa học mới' : 'Chỉnh sửa khóa học'}
      </h2>

      <form onSubmit={handleSubmit} className='space-y-4'>
        {/* Title */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Tên khóa học <span className='text-red-500'>*</span>
          </label>
          <input
            name='title'
            value={form.title}
            onChange={handleChange}
            placeholder='Nhập tên khóa học'
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.title && <p className='text-red-500 text-sm mt-1'>{errors.title}</p>}
        </div>

        {/* Thumbnail */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Thumbnail URL <span className='text-red-500'>*</span>
          </label>
          <input
            name='thumbnail'
            value={form.thumbnail}
            onChange={handleChange}
            placeholder='https://example.com/image.jpg'
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.thumbnail ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.thumbnail && <p className='text-red-500 text-sm mt-1'>{errors.thumbnail}</p>}
        </div>

        {/* Price */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Giá khóa học <span className='text-red-500'>*</span>
          </label>
          <input
            name='price'
            type='number'
            value={form.price}
            onChange={handleChange}
            placeholder='0'
            min='0'
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.price ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.price && <p className='text-red-500 text-sm mt-1'>{errors.price}</p>}
        </div>

        {/* Short Description */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Mô tả ngắn <span className='text-red-500'>*</span>
          </label>
          <textarea
            name='description'
            value={form.description}
            onChange={handleChange}
            placeholder='Mô tả ngắn gọn về khóa học'
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.description && <p className='text-red-500 text-sm mt-1'>{errors.description}</p>}
        </div>

        {/* Detailed Description */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Mô tả chi tiết <span className='text-red-500'>*</span>
          </label>
          <textarea
            name='detailed_description'
            value={form.detailed_description}
            onChange={handleChange}
            placeholder='Mô tả chi tiết về nội dung khóa học'
            rows={5}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.detailed_description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.detailed_description && <p className='text-red-500 text-sm mt-1'>{errors.detailed_description}</p>}
        </div>

        {/* Status */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Trạng thái</label>
          <select
            name='status'
            value={form.status}
            onChange={handleChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          >
            <option value='draft'>Draft</option>
            <option value='published'>Published</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className='flex gap-3 pt-4'>
          <button
            type='submit'
            disabled={isSubmitting}
            className='flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            {isSubmitting ? (
              <span className='flex items-center justify-center'>
                <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                Đang xử lý...
              </span>
            ) : mode === 'add' ? (
              'Tạo khóa học'
            ) : (
              'Cập nhật khóa học'
            )}
          </button>

          <button
            type='button'
            onClick={() => navigate('/dashboard/courses')}
            className='px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors'
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  )
}
