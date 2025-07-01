import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { BreadcrumbCurrentLink, BreadcrumbLink, BreadcrumbRoot } from 'src/components/ui/breadcrumb'
import CourseCard from 'src/components/CourseCard/CourseCard'
import { getAllCourses, GetCoursesParams } from 'src/apis/courses.api'
import { FiSearch, FiFilter, FiX } from 'react-icons/fi'
import { useDebounce } from 'src/hooks/useDebounce'
import { useSearchParams } from 'react-router-dom'

export default function ListCourses() {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchTerm = searchParams.get('search') || ''
  const [currentPage, setCurrentPage] = useState(1)
  const [limit] = useState(3) // Number of courses per page
  const [showFilters, setShowFilters] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')

  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchTerm, statusFilter])

  const queryParams: GetCoursesParams = {
    page: currentPage.toString(),
    limit: limit.toString(),
    search: debouncedSearchTerm || undefined,
    status: 'published'
  }

  const {
    data: coursesData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['courses', queryParams],
    queryFn: () => getAllCourses(queryParams),
    staleTime: 5 * 60 * 1000 // 5 minutes
  })

  useEffect(() => {
    if (error) {
      console.error('Fetch courses error:', error)
      toast.error('Có lỗi xảy ra khi tải danh sách khóa học. Vui lòng thử lại!')
    }
  }, [error])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({ search: e.target.value })
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearFilters = () => {
    setSearchParams({ search: '' })
    setStatusFilter('')
    setCurrentPage(1)
  }

  const totalPages = coursesData?.pagination.total_pages || 0
  const totalCourses = coursesData?.pagination.total || 0

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 py-4'>
          <BreadcrumbRoot>
            <BreadcrumbLink href='/'>Home</BreadcrumbLink>
            <BreadcrumbCurrentLink>Courses</BreadcrumbCurrentLink>
          </BreadcrumbRoot>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 py-8'>
        {/* Page Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>All Courses</h1>
          <p className='text-gray-600'>
            Discover {totalCourses} courses to enhance your skills and advance your career
          </p>
        </div>

        {/* Search and Filters */}
        <div className='bg-white rounded-lg shadow-sm p-6 mb-8'>
          <div className='flex flex-col lg:flex-row gap-4 items-center'>
            {/* Search Bar */}
            <div className='flex-1 w-full lg:w-auto'>
              <div className='relative'>
                <FiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                <input
                  type='text'
                  placeholder='Search courses...'
                  value={searchTerm || ''}
                  onChange={handleSearchChange}
                  className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchParams({ search: '' })}
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

        {/* Courses Grid */}
        {coursesData && coursesData.courses.length > 0 && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-8'>
            {coursesData.courses.map((course) => (
              <div key={course._id}>
                <CourseCard course={course} />
              </div>
            ))}
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
    </div>
  )
}
