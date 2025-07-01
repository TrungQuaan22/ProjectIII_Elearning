import { useState, useEffect } from 'react'
import { BreadcrumbCurrentLink, BreadcrumbLink, BreadcrumbRoot } from 'src/components/ui/breadcrumb'
import { Rating } from 'src/components/ui/rating'
import { useParams, useNavigate } from 'react-router-dom'
import DOMPurify from 'dompurify'
import { formatCurrency } from 'src/utils/utils'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getCourseDetail} from 'src/apis/courses.api'
import { CourseType, initialCourse } from 'src/types/course.type'
import { FiPlay, FiClock, FiBook, FiUser, FiStar } from 'react-icons/fi'
import React from 'react'
import { addToCart } from 'src/apis/cart.api'
import { toast } from 'react-toastify'
import { useAppContext } from 'src/hooks/useAppContext'
import { useEnrollments } from 'src/hooks/useEnrollments'
import { useCreateOrder } from 'src/hooks/useCreateOrder'

export default function CourseDetail() {
  const { courseSlug } = useParams<{ courseSlug: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [courseDetail, setCourseDetail] = useState<CourseType>(initialCourse)
  const { isAuthenticated } = useAppContext()

  const { data: courseDetailData, error } = useQuery({
    queryKey: ['course-detail', courseSlug],
    queryFn: () => getCourseDetail(courseSlug!),
    enabled: !!courseSlug,
    staleTime: 5 * 60 * 1000
  })

  // Get user enrollments to check if course is enrolled
  const { data: enrollmentsData } = useEnrollments()
  const enrollments = enrollmentsData?.enrollments || []

  // Check if current course is enrolled
  const isEnrolled = enrollments.some((enrollment) => enrollment.course._id === courseDetail._id)
  const enrollmentId = enrollments.find((enrollment) => enrollment.course._id === courseDetail._id)?.id

  useEffect(() => {
    if (error) {
      console.error('Fetch course detail error:', error)
      toast.error('Có lỗi xảy ra khi tải thông tin khóa học. Vui lòng thử lại!')
    }
  }, [error])

  console.log(courseDetailData)
  React.useEffect(() => {
    if (courseDetailData) {
      setCourseDetail(courseDetailData)
    }
  }, [courseDetailData])

  const totalLessons = courseDetail.topics?.reduce((total, topic) => total + (topic.lessons?.length || 0), 0) || 0
  const totalDuration =
    courseDetail.topics?.reduce(
      (total, topic) => total + (topic.lessons?.reduce((sum, lesson) => sum + (lesson.duration || 0), 0) || 0),
      0
    ) || 0

  const addToCartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      toast.success('Added to Cart')
      // Invalidate cart query to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Failed to add to Cart')
    }
  })

  // Handle authentication check for actions
  const handleAuthCheck = () => {
    if (!isAuthenticated) {
      // Store current path and redirect to login using React Router
      const currentPath = window.location.pathname
      console.log('Redirecting to login with path:', currentPath)
      navigate(`/login?redirect=${encodeURIComponent(currentPath)}`)
      return false
    }
    return true
  }

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (handleAuthCheck()) {
      addToCartMutation.mutate(courseDetail._id as string)
    }
  }

  // Handle Enroll Now
  const handleEnrollNow = () => {
    if (handleAuthCheck()) {
      // Validate course has _id and price
      if (!courseDetail._id) {
        toast.error('Khóa học không hợp lệ')
        return
      }

      if (!courseDetail.price || courseDetail.price <= 0) {
        toast.error('Khóa học này hiện không có giá')
        return
      }

      // Create direct order with single course
      createDirectOrderMutation.mutate([courseDetail._id])
    }
  }

  // Handle Continue Learning
  const handleContinueLearning = () => {
    if (enrollmentId) {
      navigate(`/learn/${enrollmentId}`)
    }
  }

  // Create direct order mutation
  const createDirectOrderMutation = useCreateOrder()

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 py-4'>
          <BreadcrumbRoot>
            <BreadcrumbLink href='/'>Home</BreadcrumbLink>
            <BreadcrumbLink href='/courses'>Courses</BreadcrumbLink>
            <BreadcrumbCurrentLink>{courseDetail.title}</BreadcrumbCurrentLink>
          </BreadcrumbRoot>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 py-8'>
        {/* Hero Section */}
        <div className='grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 mb-12'>
          {/* Left: Course Info */}
          <div className='flex flex-col gap-6'>
            <div>
              <span className='inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded mb-3'>
                {courseDetail.status}
              </span>
              <h1 className='text-4xl font-bold text-gray-900 mb-4'>{courseDetail.title}</h1>
              <p className='text-lg text-gray-600 mb-6'>{courseDetail.description}</p>
            </div>

            {/* Course Stats */}
            <div className='flex flex-wrap gap-8 w-full'>
              <div className='flex items-center gap-2'>
                <FiUser className='text-gray-500' />
                <span className='text-gray-700'>{courseDetail.author_name}</span>
              </div>
              <div className='flex items-center gap-2'>
                <FiBook className='text-gray-500' />
                <span className='text-gray-700'>{courseDetail.topics?.length || 0} chapters</span>
              </div>
              <div className='flex items-center gap-2'>
                <FiPlay className='text-gray-500' />
                <span className='text-gray-700'>{totalLessons} lessons</span>
              </div>
              <div className='flex items-center gap-2'>
                <FiClock className='text-gray-500' />
                <span className='text-gray-700'>{Math.round(totalDuration / 60)} minutes</span>
              </div>
            </div>

            {/* Rating */}
            <div className='flex items-center gap-2'>
              <Rating colorPalette='yellow' readOnly allowHalf value={4.5} />
              <span className='text-gray-600'>(4.5/5)</span>
              <span className='text-gray-500'>• 128 students enrolled</span>
            </div>
          </div>

          {/* Right: Course Card */}
          <div className='bg-white rounded-xl shadow-lg p-6 h-fit sticky top-8'>
            <img
              src={courseDetail.thumbnail}
              alt={courseDetail.title}
              className='w-full h-48 object-cover rounded-lg mb-6'
            />

            <div className='flex flex-col gap-4'>
              <div className='flex justify-between items-center'>
                <span className='text-3xl font-bold text-red-500'>{formatCurrency(courseDetail.price || 0)}</span>
                <span className='bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded'>
                  Best Seller
                </span>
              </div>

              <div className='flex flex-col gap-3'>
                {isEnrolled ? (
                  <button
                    onClick={handleContinueLearning}
                    className='w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors'
                  >
                    Continue Learning
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleEnrollNow}
                      disabled={createDirectOrderMutation.isPending}
                      className='w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-3 px-4 rounded-lg font-medium transition-colors'
                    >
                      {createDirectOrderMutation.isPending ? 'Processing...' : 'Enroll Now'}
                    </button>
                    <button
                      onClick={handleAddToCart}
                      disabled={addToCartMutation.isPending}
                      className='w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 transition-colors'
                    >
                      {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
                    </button>
                  </>
                )}
              </div>

              <hr className='my-4' />

              <div className='flex flex-col gap-2'>
                <h3 className='font-semibold text-gray-900'>This course includes:</h3>
                <div className='flex items-center gap-2'>
                  <FiPlay className='text-green-500' />
                  <span className='text-gray-600'>{totalLessons} lessons</span>
                </div>
                <div className='flex items-center gap-2'>
                  <FiClock className='text-green-500' />
                  <span className='text-gray-600'>{Math.round(totalDuration / 60)} hours of content</span>
                </div>
                <div className='flex items-center gap-2'>
                  <FiBook className='text-green-500' />
                  <span className='text-gray-600'>Lifetime access</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className='grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8'>
          {/* Left: Course Content */}
          <div className='flex flex-col gap-8'>
            {/* What you'll learn */}
            <div className='bg-white rounded-xl p-6 w-full'>
              <h2 className='text-2xl font-bold mb-4'>What you'll learn</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='flex items-start gap-2'>
                  <FiStar className='text-green-500 mt-1 flex-shrink-0' />
                  <span className='text-gray-700'>Master Node.js fundamentals and core concepts</span>
                </div>
                <div className='flex items-start gap-2'>
                  <FiStar className='text-green-500 mt-1 flex-shrink-0' />
                  <span className='text-gray-700'>Build RESTful APIs with Express.js</span>
                </div>
                <div className='flex items-start gap-2'>
                  <FiStar className='text-green-500 mt-1 flex-shrink-0' />
                  <span className='text-gray-700'>Connect and work with databases</span>
                </div>
                <div className='flex items-start gap-2'>
                  <FiStar className='text-green-500 mt-1 flex-shrink-0' />
                  <span className='text-gray-700'>Implement authentication and authorization</span>
                </div>
              </div>
            </div>

            {/* Course Description */}
            <div className='bg-white rounded-xl p-6 w-full'>
              <h2 className='text-2xl font-bold mb-4'>Course Description</h2>
              {courseDetail.detailed_description ? (
                <div
                  className='prose max-w-none'
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(courseDetail.detailed_description)
                  }}
                />
              ) : (
                <p className='text-gray-600'>No detailed description available.</p>
              )}
            </div>

            {/* Course Curriculum */}
            <div className='bg-white rounded-xl p-6 w-full'>
              <h2 className='text-2xl font-bold mb-4'>Course Curriculum</h2>
              <div className='flex flex-col gap-4'>
                {courseDetail.topics?.map((topic) => (
                  <div key={topic._id} className='border rounded-lg'>
                    <div className='p-4 bg-gray-50 border-b'>
                      <div className='flex justify-between items-center'>
                        <h3 className='font-semibold text-gray-900'>{topic.title}</h3>
                        <span className='text-sm text-gray-500'>{topic.lessons?.length} lessons</span>
                      </div>
                      {topic.summary && <p className='text-sm text-gray-600 mt-1'>{topic.summary}</p>}
                    </div>
                    {topic?.lessons && topic?.lessons?.length > 0 && (
                      <div className='flex flex-col'>
                        {topic.lessons?.map((lesson) => (
                          <div key={lesson._id} className='flex items-center gap-3 p-4 hover:bg-gray-50'>
                            <FiPlay className='text-gray-400 flex-shrink-0' />
                            <span className='flex-1 text-gray-700'>{lesson.title}</span>
                            <span className='text-sm text-gray-500'>{Math.round((lesson.duration || 0) / 60)} min</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Instructor Info */}
          <div className='flex flex-col gap-6'>
            <div className='bg-white rounded-xl p-6 w-full'>
              <h2 className='text-xl font-bold mb-4'>Instructor</h2>
              <div className='flex items-center gap-4'>
                <div className='w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center'>
                  <FiUser className='text-gray-500 text-xl' />
                </div>
                <div className='flex flex-col gap-1'>
                  <span className='font-semibold text-gray-900'>{courseDetail.author_name}</span>
                  <span className='text-sm text-gray-600'>Web Development Instructor</span>
                  <div className='flex items-center gap-2'>
                    <Rating colorPalette='yellow' readOnly allowHalf value={4.8} size='sm' />
                    <span className='text-sm text-gray-500'>4.8 instructor rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
