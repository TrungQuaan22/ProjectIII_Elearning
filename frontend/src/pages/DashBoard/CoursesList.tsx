import React, { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { GetCoursesParams, getAllCoursesByAdmin, getCourseDetailByAdmin } from 'src/apis/courses.api'
import { FiSearch, FiFilter, FiX } from 'react-icons/fi'
import { useDebounce } from 'src/hooks/useDebounce'
import { useNavigate } from 'react-router-dom'

export default function CoursesList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [limit] = useState(10)
  const [showFilters, setShowFilters] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchTerm, statusFilter])

  const queryParams: GetCoursesParams = {
    page: currentPage.toString(),
    limit: limit.toString(),
    search: debouncedSearchTerm || undefined,
    status: statusFilter || undefined
  }

  const {
    data: coursesData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['courses', queryParams],
    queryFn: () => getAllCoursesByAdmin(queryParams),
    staleTime: 5 * 60 * 1000 // 5 minutes
  })

  useEffect(() => {
    if (error) {
      console.error('Fetch courses error:', error)
      toast.error('Có lỗi xảy ra khi tải danh sách khóa học. Vui lòng thử lại!')
    }
  }, [error])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('')
    setCurrentPage(1)
  }

  const totalPages = coursesData?.pagination?.total_pages || 0
  const totalCourses = coursesData?.pagination?.total || 0

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Quản lý khóa học</h1>
        <button
          onClick={() => navigate('/dashboard/courses/create')}
          className='bg-blue-600 text-white px-4 py-2 rounded'
        >
          + Tạo khóa học
        </button>
      </div>
      {/* {showCreate && (
        <div className='mb-8 bg-white p-4 rounded shadow'>
          <CourseCreatePage />
        </div>
      )} */}
      <div className='bg-white rounded-lg shadow-sm p-6 mb-8'>
        <div className='flex flex-col lg:flex-row gap-4 items-center'>
          {/* Search Bar */}
          <div className='flex-1 w-full lg:w-auto'>
            <div className='relative'>
              <FiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
              <input
                type='text'
                placeholder='Tìm kiếm khóa học...'
                value={searchTerm}
                onChange={handleSearchChange}
                className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                >
                  <FiX />
                </button>
              )}
            </div>
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className='flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
          >
            <FiFilter />
            Filters
          </button>

          {/* Clear Filters */}
          {(searchTerm || statusFilter) && (
            <button onClick={clearFilters} className='px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors'>
              Clear all
            </button>
          )}
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className='mt-4 pt-4 border-t border-gray-200'>
            <div className='flex flex-wrap gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                >
                  <option value=''>All Status</option>
                  <option value='published'>Published</option>
                  <option value='draft'>Draft</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Info */}
      {coursesData && (
        <div className='mb-6'>
          <p className='text-gray-600'>
            Showing {coursesData.courses.length} of {totalCourses} courses
            {debouncedSearchTerm && ` for "${debouncedSearchTerm}"`}
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className='flex justify-center items-center py-12'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className='text-center py-12'>
          <p className='text-red-600'>Failed to load courses. Please try again.</p>
        </div>
      )}

      {/* Courses Table */}
      {coursesData && coursesData.courses.length > 0 && (
        <div className='relative'>
          <div className='overflow-x-auto rounded-xl shadow'>
            <table className='min-w-full text-sm whitespace-nowrap'>
              <thead>
                <tr className='bg-indigo-50 text-indigo-700'>
                  <th className='px-4 py-3 text-left'>Ảnh</th>
                  <th className='px-4 py-3 text-left'>Tên khóa học</th>
                  <th className='px-4 py-3 text-left'>Mô tả</th>
                  <th className='px-4 py-3 text-left'>Trạng thái</th>
                  <th className='px-4 py-3 text-left'>Created At</th>
                  <th className='px-4 py-3 text-left'>Updated At</th>
                  <th className='px-4 py-3 text-center sticky right-0 bg-indigo-50 z-20'>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {coursesData.courses.map((course: import('src/types/course.type').CourseType, idx: number) => (
                  <tr
                    key={course._id}
                    className={`border-b border-gray-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-50 transition`}
                    onMouseEnter={() => {
                      if (typeof course.slug === 'string') {
                        queryClient.prefetchQuery({
                          queryKey: ['course-detail', course.slug],
                          queryFn: () => getCourseDetailByAdmin(course.slug as string)
                        })
                      }
                    }}
                  >
                    <td className='px-4 py-3'>
                      <img src={course.thumbnail} alt={course.title} className='w-20 h-12 object-cover rounded' />
                    </td>
                    <td className='px-4 py-3 font-bold'>{course.title}</td>
                    <td className='px-4 py-3'>{course.description}</td>
                    <td className='px-4 py-3'>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          course.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {course.status}
                      </span>
                    </td>
                    <td className='px-4 py-3'>
                      {course.created_at ? new Date(course.created_at).toLocaleDateString('vi-VN') : ''}
                    </td>
                    <td className='px-4 py-3'>
                      {course.updated_at ? new Date(course.updated_at).toLocaleDateString('vi-VN') : ''}
                    </td>
                    <td className='px-4 py-3 sticky right-0 bg-white z-10 text-center'>
                      <button
                        className='px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 shadow'
                        onClick={() => navigate(`/dashboard/courses/${course.slug}/edit`)}
                      >
                        Sửa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Results */}
      {coursesData && coursesData.courses.length === 0 && (
        <div className='text-center py-12'>
          <p className='text-gray-600 text-lg mb-4'>No courses found</p>
          <p className='text-gray-500'>Try adjusting your search terms or filters to find what you're looking for.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex justify-center items-center gap-2'>
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className='px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50'
          >
            Previous
          </button>

          {/* Page Numbers */}
          <div className='flex gap-1'>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-2 rounded-lg ${
                    currentPage === pageNum ? 'bg-blue-500 text-white' : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className='px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50'
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
