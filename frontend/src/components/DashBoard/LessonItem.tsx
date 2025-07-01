import React, { useState } from 'react'
import { LessonType, TopicType, LessonFormData } from 'src/types/curriculum.type'

interface LessonItemProps {
  lesson: LessonType
  topic: TopicType
  isEditing: boolean
  onEditLesson: (lesson: LessonType, topic: TopicType) => void
  onDeleteLesson: (lesson: LessonType, topic: TopicType) => void
  onUpdateLesson: (lessonData: LessonFormData) => void
  onCancelEdit: () => void
  errors: Record<string, string | undefined>
}

export default function LessonItem({
  lesson,
  topic,
  isEditing,
  onEditLesson,
  onDeleteLesson,
  onUpdateLesson,
  onCancelEdit,
  errors
}: LessonItemProps) {
  const [editForm, setEditForm] = useState<LessonFormData>({
    title: lesson.title,
    description: lesson.description || '',
    duration: lesson.duration || 0,
    video_url: lesson.video_url || ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdateLesson({
      ...editForm,
      duration: Number(editForm.duration)
    })
  }

  const handleCancel = () => {
    setEditForm({
      title: lesson.title,
      description: lesson.description || '',
      duration: lesson.duration || 0,
      video_url: lesson.video_url || ''
    })
    onCancelEdit()
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className='bg-white rounded-lg p-3 border border-gray-200 shadow-sm'>
      {isEditing ? (
        <form onSubmit={handleSubmit} className='space-y-3'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Tên bài học <span className='text-red-500'>*</span>
            </label>
            <input
              name='title'
              value={editForm.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.title && <p className='text-red-500 text-sm mt-1'>{errors.title}</p>}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Mô tả</label>
            <textarea
              name='description'
              value={editForm.description}
              onChange={handleChange}
              rows={2}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Thời lượng (phút)</label>
              <input
                name='duration'
                type='number'
                value={editForm.duration ? editForm.duration / 60 : 0}
                onChange={handleChange}
                min='0'
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.duration ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.duration && <p className='text-red-500 text-sm mt-1'>{errors.duration}</p>}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Video URL</label>
              <input
                name='video_url'
                value={editForm.video_url}
                onChange={handleChange}
                placeholder='https://youtube.com/watch?v=...'
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.video_url ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.video_url && <p className='text-red-500 text-sm mt-1'>{errors.video_url}</p>}
            </div>
          </div>

          <div className='flex gap-2'>
            <button
              type='submit'
              className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            >
              Lưu
            </button>
            <button
              type='button'
              onClick={handleCancel}
              className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
            >
              Hủy
            </button>
          </div>
        </form>
      ) : (
        <div className='flex items-center justify-between'>
          <div className='flex-1'>
            <h4 className='font-medium text-gray-800'>{lesson.title}</h4>
            {lesson.description && <p className='text-gray-600 text-sm mt-1'>{lesson.description}</p>}
            <div className='flex items-center gap-4 mt-2 text-sm text-gray-500'>
              {lesson.duration && <span>⏱️ {formatDuration(lesson.duration)}</span>}
              {lesson.video_url && <span>🎥 Có video</span>}
            </div>
          </div>
          <div className='flex gap-2'>
            <button
              onClick={() => onEditLesson(lesson, topic)}
              className='px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors'
            >
              Sửa
            </button>
            <button
              onClick={() => onDeleteLesson(lesson, topic)}
              className='px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors'
            >
              Xóa
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
