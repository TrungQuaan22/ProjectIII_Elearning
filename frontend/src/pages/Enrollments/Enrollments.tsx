import React, { useEffect } from 'react'
import { BreadcrumbCurrentLink, BreadcrumbLink, BreadcrumbRoot } from 'src/components/ui/breadcrumb'
import { toast } from 'react-toastify'
import CourseCard from 'src/components/CourseCard/CourseCard'
import { FiBook } from 'react-icons/fi'
import { useEnrollments } from 'src/hooks/useEnrollments'

export default function Enrollments() {
  const { data: enrollmentsData, isLoading, error } = useEnrollments()

  useEffect(() => {
    if (error) {
      console.error('Fetch enrollments error:', error)
      toast.error('Có lỗi xảy ra khi tải danh sách khóa học đã đăng ký. Vui lòng thử lại!')
    }
  }, [error])

  const enrollments = enrollmentsData?.enrollments || []
  const totalEnrollments = enrollmentsData?.pagination?.total || 0

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 py-4'>
          <BreadcrumbRoot>
            <BreadcrumbLink href='/'>Home</BreadcrumbLink>
            <BreadcrumbCurrentLink>My Enrollments</BreadcrumbCurrentLink>
          </BreadcrumbRoot>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 py-8'>
        {/* Page Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>My Enrolled Courses</h1>
          <p className='text-gray-600'>
            {totalEnrollments > 0
              ? `You have enrolled in ${totalEnrollments} course${totalEnrollments > 1 ? 's' : ''}`
              : "You haven't enrolled in any courses yet"}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className='flex justify-center items-center py-12'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className='text-center py-12'>
            <p className='text-red-600'>{error instanceof Error ? error.message : 'Error loading courses'}</p>
          </div>
        )}

        {/* Courses Grid */}
        {enrollments.length > 0 && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6'>
            {enrollments.map((enrollment) => (
              <CourseCard key={enrollment.id} course={enrollment.course} to={`/learn/${enrollment.id}`} />
            ))}
          </div>
        )}

        {/* No Enrollments */}
        {!isLoading && !error && enrollments.length === 0 && (
          <div className='text-center py-12'>
            <div className='flex justify-center mb-4'>
              <FiBook className='text-gray-400 text-6xl' />
            </div>
            <p className='text-gray-600 text-lg mb-4'>No enrolled courses yet</p>
            <p className='text-gray-500 mb-6'>Start your learning journey by exploring our course catalog</p>
            <a
              href='/courses'
              className='inline-block bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors'
            >
              Browse Courses
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
