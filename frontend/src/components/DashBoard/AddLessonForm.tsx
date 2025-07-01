import React, { useState } from 'react'
import { TopicType, LessonFormData } from 'src/types/curriculum.type'

interface AddLessonFormProps {
  topic: TopicType
  onAddLesson: (topic: TopicType, lessonData: LessonFormData) => void
  errors?: Record<string, string | undefined>
}

export default function AddLessonForm({ topic, onAddLesson, errors = {} }: AddLessonFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() && description.trim() && duration && videoUrl.trim()) {
      onAddLesson(topic, {
        title: title.trim(),
        description: description.trim(),
        duration: Number(duration) * 60,
        video_url: videoUrl.trim()
      })
      setTitle('')
      setDescription('')
      setDuration('')
      setVideoUrl('')
      setShowForm(false)
    }
  }

  const handleCancel = () => {
    setTitle('')
    setDescription('')
    setDuration('')
    setVideoUrl('')
    setShowForm(false)
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className='w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors text-sm'
      >
        + Thêm bài học mới
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className='bg-white p-4 rounded-lg border border-gray-200 shadow-sm'>
      <h4 className='font-medium text-gray-800 mb-3'>Thêm bài học mới</h4>

      <div className='space-y-3'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Tên bài học <span className='text-red-500'>*</span>
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Nhập tên bài học'
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Mô tả bài học'
            rows={2}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.description && <p className='text-red-500 text-sm mt-1'>{errors.description}</p>}
        </div>

        <div className='grid grid-cols-2 gap-3'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Thời lượng (phút) <span className='text-red-500'>*</span>
            </label>
            <input
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder='0'
              type='number'
              min='1'
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.duration ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.duration && <p className='text-red-500 text-sm mt-1'>{errors.duration}</p>}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Video URL <span className='text-red-500'>*</span>
            </label>
            <input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder='https://youtube.com/watch?v=...'
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.video_url ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.video_url && <p className='text-red-500 text-sm mt-1'>{errors.video_url}</p>}
          </div>
        </div>

        <div className='flex gap-2'>
          <button
            type='submit'
            disabled={!title.trim() || !description.trim() || !duration || !videoUrl.trim()}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            Thêm bài học
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
