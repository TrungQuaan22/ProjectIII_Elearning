import React, { useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCourseEnrollmentDetail, updateEnrollmentProgress } from 'src/apis/courses.api'
import { FiCheckCircle } from 'react-icons/fi'
import YouTube from 'react-youtube'

function getYoutubeId(url: string) {
  // Hỗ trợ các dạng link phổ biến
  const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[1].length === 11 ? match[1] : ''
}

export default function LearnCourse() {
  const { enrollmentId } = useParams<{ enrollmentId: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const lessonId = searchParams.get('lessonId')
  const queryClient = useQueryClient()

  const { data, error } = useQuery({
    queryKey: ['learn-course', enrollmentId],
    queryFn: () => getCourseEnrollmentDetail(enrollmentId as string),
    enabled: !!enrollmentId
  })

  const updateProgressMutation = useMutation({
    mutationFn: ({ completedLessons, currentLesson }: { completedLessons: string[]; currentLesson: string }) =>
      updateEnrollmentProgress(enrollmentId as string, completedLessons, currentLesson),
    onSuccess: () => {
      // Invalidate and refetch enrollment data
      queryClient.invalidateQueries({ queryKey: ['learn-course', enrollmentId] })
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
    }
  })

  useEffect(() => {
    if (error) {
      console.error('Fetch course error:', error)
    }
  }, [error])

  const course = data?.course || { topics: [] }
  const enrollment = data

  // Lấy tất cả bài học
  const allLessons = Array.isArray(course.topics)
    ? course.topics.flatMap((topic: any) =>
        Array.isArray(topic.lessons) ? topic.lessons.map((lesson: any) => ({ ...lesson, topic })) : []
      )
    : []

  // Xác định bài học đang học
  const currentLesson = lessonId ? allLessons.find((l: any) => l._id === lessonId) : allLessons[0]

  // Tính tiến độ dựa trên enrollment progress
  const completedLessons = enrollment?.progress?.completed_lessons || []
  const progress = allLessons.length > 0 ? Math.round((completedLessons.length / allLessons.length) * 100) : 0

  // Tự động cập nhật tiến độ cho bài học đầu tiên khi mới vào khóa học
  useEffect(() => {
    if (data && allLessons.length > 0 && completedLessons.length === 0 && currentLesson) {
      // Nếu chưa có bài học nào được hoàn thành và có bài học đầu tiên
      const firstLesson = allLessons[0]
      if (firstLesson && !completedLessons.includes(firstLesson._id)) {
        updateProgressMutation.mutate({
          completedLessons: [firstLesson._id],
          currentLesson: firstLesson._id
        })
      }
    }
  }, [data, allLessons, completedLessons, currentLesson])

  // Chuyển bài học và cập nhật tiến độ
  const handleSelectLesson = async (lesson: any) => {
    setSearchParams({ lessonId: lesson._id })

    // Cập nhật tiến độ nếu bài học chưa được hoàn thành
    if (!completedLessons.includes(lesson._id)) {
      const newCompletedLessons = [...completedLessons, lesson._id]

      try {
        await updateProgressMutation.mutateAsync({
          completedLessons: newCompletedLessons,
          currentLesson: lesson._id
        })
      } catch (error) {
        console.error('Update progress error:', error)
      }
    }
  }

  // Đánh dấu bài học đã hoàn thành
  const isLessonCompleted = (lessonId: string) => {
    return completedLessons.includes(lessonId)
  }

  return (
    <div className='flex min-h-screen bg-black text-white'>
      {/* Sidebar */}
      <aside className='w-80 bg-[#18181b] border-r border-gray-800 flex-shrink-0 flex flex-col'>
        <div className='p-6 border-b border-gray-800'>
          <h1 className='text-2xl font-bold mb-2'>{course.title || '...'}</h1>
          <div className='text-sm text-gray-400'>
            Tiến độ: {completedLessons.length}/{allLessons.length} bài ({progress}%)
          </div>
          <div className='w-full bg-gray-700 h-2 rounded mt-2'>
            <div className='bg-green-500 h-2 rounded' style={{ width: `${progress}%`, transition: 'width 0.3s' }}></div>
          </div>
        </div>
        <div className='flex-1 overflow-y-auto'>
          {Array.isArray(course.topics) &&
            course.topics.map((topic: any) => (
              <div key={topic._id} className='border-b border-gray-800'>
                <div className='p-4 font-semibold text-base text-gray-200'>{topic.title}</div>
                <div>
                  {(!Array.isArray(topic.lessons) || topic.lessons.length === 0) && (
                    <div className='px-8 py-2 text-gray-500 text-sm'>Chưa có bài học</div>
                  )}
                  {Array.isArray(topic.lessons) &&
                    topic.lessons.map((lesson: any, lidx: number) => {
                      const isActive = lesson._id === currentLesson?._id
                      const isCompleted = isLessonCompleted(lesson._id)
                      return (
                        <div
                          key={lesson._id}
                          className={`px-8 py-3 flex items-center gap-2 cursor-pointer hover:bg-gray-800 ${
                            isActive ? 'bg-gray-900 text-green-400 font-bold' : 'text-gray-300'
                          } ${isCompleted ? 'text-green-400' : ''}`}
                          onClick={() => handleSelectLesson(lesson)}
                        >
                          <span className='w-6 text-center'>
                            {isCompleted ? <FiCheckCircle /> : isActive ? <FiCheckCircle /> : lidx + 1}
                          </span>
                          <span className='truncate'>{lesson.title}</span>
                        </div>
                      )
                    })}
                </div>
              </div>
            ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className='flex-1 flex flex-col min-h-screen'>
        <div className='p-8 flex-1 flex flex-col items-center bg-[#0a0a0a]'>
          {/* Video player */}
          {currentLesson?.video_url ? (
            <div className='w-full max-w-4xl aspect-video mb-8 rounded-lg overflow-hidden bg-black border border-gray-800'>
              <YouTube
                videoId={getYoutubeId(currentLesson.video_url)}
                opts={{
                  width: '100%',
                  height: '100%',
                  playerVars: {
                    autoplay: 0,
                    controls: 1
                  }
                }}
                className='w-full h-full'
                iframeClassName='w-full h-full'
                title={currentLesson.title}
              />
            </div>
          ) : (
            <div className='w-full max-w-4xl aspect-video mb-8 flex items-center justify-center bg-gray-900 rounded-lg border border-gray-800'>
              <span className='text-gray-500'>Chưa có video cho bài học này</span>
            </div>
          )}
          {/* Lesson info */}
          <div className='w-full max-w-4xl'>
            <h2 className='text-2xl font-bold mb-2'>{currentLesson?.title || 'Chọn bài học'}</h2>
            <div className='text-gray-400 mb-4'>{currentLesson?.description}</div>
            <div className='text-gray-500 text-sm'>
              {course.title} &bull; {currentLesson?.topic?.title}
            </div>
          </div>
          {/* Comment Q&A Placeholder */}
          <div className='w-full max-w-4xl mt-10'>
            <div className='bg-gray-800 rounded-lg p-6 text-center border border-gray-700'>
              <div className='text-lg font-semibold text-gray-200 mb-2'>Bình luận & Hỏi đáp</div>
              <div className='text-gray-400'>Tính năng bình luận sẽ sớm cập nhật!</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
