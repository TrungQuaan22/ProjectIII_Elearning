import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { CourseType } from 'src/types/course.type'
import {
  TopicType,
  LessonType,
  TopicFormData,
  LessonFormData,
  CreateTopicRequest,
  CreateLessonRequest,
  CurriculumFormErrors
} from 'src/types/curriculum.type'
import { createTopic, updateTopic, deleteTopic, createLesson, updateLesson, deleteLesson } from 'src/apis/courses.api'
import TopicItem from './TopicItem'
import AddTopicForm from './AddTopicForm'

interface CurriculumBuilderProps {
  course: CourseType
  topics: TopicType[]
}

export default function CurriculumBuilder({ course, topics }: CurriculumBuilderProps) {
  const queryClient = useQueryClient()
  const [editingTopic, setEditingTopic] = useState<TopicType | null>(null)
  const [editingLesson, setEditingLesson] = useState<{ lesson: LessonType; topic: TopicType } | null>(null)
  const [errors, setErrors] = useState<CurriculumFormErrors>({})

  // Topic mutations
  const createTopicMutation = useMutation({
    mutationFn: (topicData: CreateTopicRequest) => createTopic(course.slug!, topicData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-detail', course.slug] })
      setErrors({})
      toast.success('Tạo chương thành công!')
    },
    onError: (error: Error) => {
      console.error('Create topic error:', error)
      toast.error('Có lỗi xảy ra khi tạo chương. Vui lòng thử lại!')
    },
    gcTime: 5 * 60 * 1000
  })

  const updateTopicMutation = useMutation({
    mutationFn: ({ topicSlug, topicData }: { topicSlug: string; topicData: TopicFormData }) =>
      updateTopic(course.slug!, topicSlug, topicData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-detail', course.slug] })
      setEditingTopic(null)
      setErrors({})
      toast.success('Cập nhật chương thành công!')
    },
    onError: (error: Error) => {
      console.error('Update topic error:', error)
      toast.error('Có lỗi xảy ra khi cập nhật chương. Vui lòng thử lại!')
    }
  })

  const deleteTopicMutation = useMutation({
    mutationFn: (topicSlug: string) => deleteTopic(course.slug!, topicSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-detail', course.slug] })
      toast.success('Xóa chương thành công!')
    },
    onError: (error: Error) => {
      console.error('Delete topic error:', error)
      toast.error('Có lỗi xảy ra khi xóa chương. Vui lòng thử lại!')
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  // Lesson mutations
  const createLessonMutation = useMutation({
    mutationFn: ({ topicSlug, lessonData }: { topicSlug: string; lessonData: CreateLessonRequest }) =>
      createLesson(course.slug!, topicSlug, lessonData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-detail', course.slug] })
      setErrors({})
      toast.success('Tạo bài học thành công!')
    },
    onError: (error: Error) => {
      console.error('Create lesson error:', error)
      toast.error('Có lỗi xảy ra khi tạo bài học. Vui lòng thử lại!')
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  const updateLessonMutation = useMutation({
    mutationFn: ({
      topicSlug,
      lessonSlug,
      lessonData
    }: {
      topicSlug: string
      lessonSlug: string
      lessonData: LessonFormData
    }) => updateLesson(course.slug!, topicSlug, lessonSlug, lessonData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-detail', course.slug] })
      setEditingLesson(null)
      setErrors({})
      toast.success('Cập nhật bài học thành công!')
    },
    onError: (error: Error) => {
      console.error('Update lesson error:', error)
      toast.error('Có lỗi xảy ra khi cập nhật bài học. Vui lòng thử lại!')
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  const deleteLessonMutation = useMutation({
    mutationFn: ({ topicSlug, lessonSlug }: { topicSlug: string; lessonSlug: string }) =>
      deleteLesson(course.slug!, topicSlug, lessonSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-detail', course.slug] })
      toast.success('Xóa bài học thành công!')
    },
    onError: (error: Error) => {
      console.error('Delete lesson error:', error)
      toast.error('Có lỗi xảy ra khi xóa bài học. Vui lòng thử lại!')
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  // Validation functions
  const validateTopic = (data: TopicFormData): boolean => {
    const newErrors: CurriculumFormErrors = {}

    if (!data.title.trim()) {
      newErrors.title = 'Tên chương là bắt buộc'
    } else if (data.title.length < 3) {
      newErrors.title = 'Tên chương phải có ít nhất 3 ký tự'
    }

    if (!data.summary?.trim()) {
      newErrors.summary = 'Mô tả chương là bắt buộc'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateLesson = (data: LessonFormData): boolean => {
    const newErrors: CurriculumFormErrors = {}

    if (!data.title.trim()) {
      newErrors.title = 'Tên bài học là bắt buộc'
    } else if (data.title.length < 3) {
      newErrors.title = 'Tên bài học phải có ít nhất 3 ký tự'
    }

    if (!data.description?.trim()) {
      newErrors.description = 'Mô tả bài học là bắt buộc'
    }

    if (!data.duration || data.duration <= 0) {
      newErrors.duration = 'Thời lượng bài học là bắt buộc và phải lớn hơn 0'
    }

    if (!data.video_url?.trim()) {
      newErrors.video_url = 'URL video là bắt buộc'
    } else if (!isValidUrl(data.video_url)) {
      newErrors.video_url = 'URL video không hợp lệ'
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

  // Event handlers
  const handleAddTopic = (topicData: TopicFormData) => {
    if (validateTopic(topicData)) {
      // Ensure all required fields are provided for create
      const createData: CreateTopicRequest = {
        title: topicData.title.trim(),
        summary: topicData.summary?.trim() || ''
      }
      createTopicMutation.mutate(createData)
    }
  }

  const handleEditTopic = (topic: TopicType) => {
    setEditingTopic(topic)
  }

  const handleUpdateTopic = (topicData: TopicFormData) => {
    if (editingTopic && validateTopic(topicData)) {
      updateTopicMutation.mutate({ topicSlug: editingTopic.slug!, topicData })
    }
  }

  const handleDeleteTopic = (topic: TopicType) => {
    if (window.confirm(`Bạn có chắc muốn xóa chương "${topic.title}"?`)) {
      deleteTopicMutation.mutate(topic.slug!)
    }
  }

  const handleAddLesson = (topic: TopicType, lessonData: LessonFormData) => {
    if (validateLesson(lessonData)) {
      // Ensure all required fields are provided for create
      const createData: CreateLessonRequest = {
        title: lessonData.title.trim(),
        description: lessonData.description?.trim() || '',
        duration: lessonData.duration || 0,
        video_url: lessonData.video_url?.trim() || ''
      }
      createLessonMutation.mutate({ topicSlug: topic.slug!, lessonData: createData })
    }
  }

  const handleEditLesson = (lesson: LessonType, topic: TopicType) => {
    setEditingLesson({ lesson, topic })
  }

  const handleUpdateLesson = (lessonData: LessonFormData) => {
    if (editingLesson && validateLesson(lessonData)) {
      updateLessonMutation.mutate({
        topicSlug: editingLesson.topic.slug!,
        lessonSlug: editingLesson.lesson.slug!,
        lessonData
      })
    }
  }

  const handleDeleteLesson = (lesson: LessonType, topic: TopicType) => {
    if (window.confirm(`Bạn có chắc muốn xóa bài học "${lesson.title}"?`)) {
      deleteLessonMutation.mutate({ topicSlug: topic.slug!, lessonSlug: lesson.slug! })
    }
  }

  const isLoading =
    createTopicMutation.isPending ||
    updateTopicMutation.isPending ||
    deleteTopicMutation.isPending ||
    createLessonMutation.isPending ||
    updateLessonMutation.isPending ||
    deleteLessonMutation.isPending

  return (
    <div className='w-full bg-white p-6 rounded-lg shadow-lg'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-bold text-gray-800'>Xây dựng Curriculum</h2>
        {isLoading && (
          <div className='flex items-center text-blue-600'>
            <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2'></div>
            Đang xử lý...
          </div>
        )}
      </div>

      {/* Topics List */}
      <div className='space-y-4'>
        {topics.map((topic) => (
          <TopicItem
            key={topic.slug}
            topic={topic}
            isEditing={editingTopic?.slug === topic.slug}
            editingLesson={editingLesson}
            onAddLesson={handleAddLesson}
            onEditTopic={handleEditTopic}
            onEditLesson={handleEditLesson}
            onDeleteTopic={handleDeleteTopic}
            onDeleteLesson={handleDeleteLesson}
            onUpdateTopic={handleUpdateTopic}
            onUpdateLesson={handleUpdateLesson}
            onCancelEdit={() => {
              setEditingTopic(null)
              setEditingLesson(null)
              setErrors({})
            }}
            errors={errors}
          />
        ))}
      </div>

      {/* Add Topic Form */}
      <div className='mt-6 pt-6 border-t border-gray-200'>
        <AddTopicForm onAddTopic={handleAddTopic} isLoading={createTopicMutation.isPending} errors={errors} />
      </div>
    </div>
  )
}
