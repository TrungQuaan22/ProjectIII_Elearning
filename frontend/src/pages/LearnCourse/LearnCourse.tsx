import React, { useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { getCourseEnrollmentDetail } from 'src/apis/courses.api'
import { FiCheckCircle } from 'react-icons/fi'
import YouTube from 'react-youtube'

function getYoutubeId(url: string) {
  // Hỗ trợ các dạng link phổ biến
  const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[1].length === 11 ? match[1] : ''
}

export default function LearnCourse() {
  const { courseSlug } = useParams<{ courseSlug: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const lessonId = searchParams.get('lessonId')

  const { data, error } = useQuery({
    queryKey: ['learn-course', courseSlug],
    queryFn: () => getCourseEnrollmentDetail(courseSlug!),
    enabled: !!courseSlug
  })

  useEffect(() => {
    if (error) {
      console.error('Fetch course error:', error)
      toast.error('Có lỗi xảy ra khi tải thông tin khóa học. Vui lòng thử lại!')
    }
  }, [error])

  const course = data || { topics: [] }
  // Lấy tất cả bài học
  const allLessons = Array.isArray(course.topics)
    ? course.topics.flatMap((topic: any) =>
        Array.isArray(topic.lessons) ? topic.lessons.map((lesson: any) => ({ ...lesson, topic })) : []
      )
    : []
  console.log('allLessons', allLessons)
  // Xác định bài học đang học
  const currentLesson = lessonId ? allLessons.find((l: any) => l._id === lessonId) : allLessons[0]
  // Tính tiến độ
  const currentIndex = allLessons.findIndex((l: any) => l._id === currentLesson?._id)
  const progress = allLessons.length > 0 ? Math.round(((currentIndex + 1) / allLessons.length) * 100) : 0

  // Chuyển bài học
  const handleSelectLesson = (lesson: any) => {
    setSearchParams({ lessonId: lesson._id })
  }
  console.log('currentLesson', currentLesson)
  return (
    <div className='flex min-h-screen bg-black text-white'>
      {/* Sidebar */}
      <aside className='w-80 bg-[#18181b] border-r border-gray-800 flex-shrink-0 flex flex-col'>
        <div className='p-6 border-b border-gray-800'>
          <h1 className='text-2xl font-bold mb-2'>{course.title || '...'}</h1>
          <div className='text-sm text-gray-400'>
            Tiến độ: {currentIndex + 1}/{allLessons.length} bài ({progress}%)
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
                      return (
                        <div
                          key={lesson._id}
                          className={`px-8 py-3 flex items-center gap-2 cursor-pointer hover:bg-gray-800 ${isActive ? 'bg-gray-900 text-green-400 font-bold' : 'text-gray-300'}`}
                          onClick={() => handleSelectLesson(lesson)}
                        >
                          <span className='w-6 text-center'>{isActive ? <FiCheckCircle /> : lidx + 1}</span>
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
        </div>
      </main>
    </div>
  )
}
