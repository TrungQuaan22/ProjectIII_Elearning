import React, { useState } from 'react'
import { TopicType, LessonType } from 'src/types/curriculum.type'
import LessonItem from './LessonItem'
import AddLessonForm from './AddLessonForm'

interface LessonData {
  title: string
  description?: string
  duration?: number
  video_url?: string
}

interface TopicItemProps {
  topic: TopicType
  isEditing: boolean
  editingLesson: { lesson: LessonType; topic: TopicType } | null
  onAddLesson: (topic: TopicType, lessonData: LessonData) => void
  onEditTopic: (topic: TopicType) => void
  onEditLesson: (lesson: LessonType, topic: TopicType) => void
  onDeleteTopic: (topic: TopicType) => void
  onDeleteLesson: (lesson: LessonType, topic: TopicType) => void
  onUpdateTopic: (topicData: { title: string; summary?: string }) => void
  onUpdateLesson: (lessonData: LessonData) => void
  onCancelEdit: () => void
  errors: Record<string, string | undefined>
}

export default function TopicItem({
  topic,
  isEditing,
  editingLesson,
  onAddLesson,
  onEditTopic,
  onEditLesson,
  onDeleteTopic,
  onDeleteLesson,
  onUpdateTopic,
  onUpdateLesson,
  onCancelEdit,
  errors
}: TopicItemProps) {
  const [editForm, setEditForm] = useState({
    title: topic.title,
    summary: topic.summary || ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdateTopic(editForm)
  }

  const handleCancel = () => {
    setEditForm({ title: topic.title, summary: topic.summary || '' })
    onCancelEdit()
  }

  return (
    <div className='bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200'>
      {/* Topic Header */}
      <div className='flex justify-between items-start mb-4'>
        {isEditing ? (
          <form onSubmit={handleSubmit} className='flex-1 mr-4'>
            <div className='space-y-3'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Tên chương <span className='text-red-500'>*</span>
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
                  name='summary'
                  value={editForm.summary}
                  onChange={handleChange}
                  rows={2}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
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
            </div>
          </form>
        ) : (
          <div className='flex-1'>
            <h3 className='text-lg font-semibold text-gray-800 mb-1'>{topic.title}</h3>
            {topic.summary && <p className='text-gray-600 text-sm'>{topic.summary}</p>}
          </div>
        )}

        {!isEditing && (
          <div className='flex gap-2'>
            <button
              onClick={() => onEditTopic(topic)}
              className='px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors'
            >
              Sửa
            </button>
            <button
              onClick={() => onDeleteTopic(topic)}
              className='px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors'
            >
              Xóa
            </button>
          </div>
        )}
      </div>

      {/* Lessons List */}
      <div className='ml-4 space-y-2'>
        {topic.lessons?.map((lesson) => (
          <LessonItem
            key={lesson._id}
            lesson={lesson}
            topic={topic}
            isEditing={editingLesson?.lesson._id === lesson._id}
            onEditLesson={onEditLesson}
            onDeleteLesson={onDeleteLesson}
            onUpdateLesson={onUpdateLesson}
            onCancelEdit={onCancelEdit}
            errors={errors}
          />
        ))}

        {/* Add Lesson Form */}
        <AddLessonForm topic={topic} onAddLesson={onAddLesson} errors={errors} />
      </div>
    </div>
  )
}
