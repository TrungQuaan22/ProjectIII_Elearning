import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { getCourseDetailByAdmin } from 'src/apis/courses.api'
import CourseForm from 'src/components/DashBoard/CourseForm'
import CurriculumBuilder from 'src/components/DashBoard/CurriculumBuilder'

export default function CourseEditPage() {
  const { slug } = useParams()
  const {
    data: course,
    isLoading,
    error
  } = useQuery({
    queryKey: ['course-detail', slug],
    queryFn: () => getCourseDetailByAdmin(slug!),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 phút
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  useEffect(() => {
    if (error) {
      console.error('Fetch course error:', error)
      toast.error('Có lỗi xảy ra khi tải thông tin khóa học. Vui lòng thử lại!')
    }
  }, [error])

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className='text-center py-12'>
        <p className='text-red-600 text-lg'>Không tìm thấy khóa học</p>
      </div>
    )
  }

  return (
    <div className='p-6 space-y-8 flex  gap-4'>
      <CourseForm mode='edit' initialData={course} />
      <CurriculumBuilder course={course} topics={course.topics || []} />
    </div>
  )
}
