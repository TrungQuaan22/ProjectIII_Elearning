import React, { useState } from 'react'
import { TopicFormData } from 'src/types/curriculum.type'

interface AddTopicFormProps {
  onAddTopic: (topicData: TopicFormData) => void
  isLoading?: boolean
  errors?: Record<string, string | undefined>
}

export default function AddTopicForm({ onAddTopic, isLoading = false, errors = {} }: AddTopicFormProps) {
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() && summary.trim()) {
      onAddTopic({ title: title.trim(), summary: summary.trim() })
      setTitle('')
      setSummary('')
      setShowForm(false)
    }
  }

  const handleCancel = () => {
    setTitle('')
    setSummary('')
    setShowForm(false)
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className='w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors'
      >
        + Thêm chương mới
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className='bg-white p-4 rounded-lg border border-gray-200 shadow-sm'>
      <h4 className='font-medium text-gray-800 mb-3'>Thêm chương mới</h4>

      <div className='space-y-3'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Tên chương <span className='text-red-500'>*</span>
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Nhập tên chương'
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.title && <p className='text-red-500 text-sm mt-1'>{errors.title}</p>}
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Mô tả <span className='text-red-500'>*</span>
          </label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder='Mô tả ngắn về chương này'
            rows={2}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.summary ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.summary && <p className='text-red-500 text-sm mt-1'>{errors.summary}</p>}
        </div>

        <div className='flex gap-2'>
          <button
            type='submit'
            disabled={isLoading || !title.trim() || !summary.trim()}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            {isLoading ? 'Đang thêm...' : 'Thêm chương'}
          </button>
          <button
            type='button'
            onClick={handleCancel}
            className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
          >
            Hủy
          </button>
        </div>
      </div>
    </form>
  )
}
