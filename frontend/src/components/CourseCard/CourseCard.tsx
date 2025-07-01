import { Link } from 'react-router-dom'
import { getImagePrefix } from 'src/utils/utils'
import { CourseType } from 'src/types/course.type'
import { Icon } from '@iconify/react'
import { formatCurrency } from 'src/utils/utils'
const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating)
  const halfStars = rating % 1 >= 0.5 ? 1 : 0
  const emptyStars = 5 - fullStars - halfStars

  return (
    <>
      {Array(fullStars).fill(<Icon icon='tabler:star-filled' className='text-yellow-500 text-xl inline-block' />)}
      {halfStars > 0 && <Icon icon='tabler:star-half-filled' className='text-yellow-500 text-xl inline-block' />}
      {Array(emptyStars).fill(<Icon icon='tabler:star-filled' className='text-gray-400 text-xl inline-block' />)}
    </>
  )
}

export default function CourseCard({ course, to }: { course: CourseType; to?: string }) {
  return (
    <Link to={to || `/courses/${course.slug}`} className='block'>
      <div className='bg-white m-3 mb-12 px-3 pt-3 pb-12 shadow-course-shadow rounded-2xl  '>
        <div className='relative rounded-3xl'>
          <img src={`${getImagePrefix()}${course.thumbnail}`} alt='course-image' className='m-auto clipPath h-60 w-full object-cover' />
          <div className='absolute right-5 -bottom-2 bg-secondary rounded-full p-6'>
            <h3 className='text-white uppercase text-center text-sm font-medium'>
              best <br /> seller
            </h3>
          </div>
        </div>

        <div className='px-3 pt-6'>
          <div className='text-2xl font-bold text-black max-w-75% inline-block'>{course.title}</div>
          <h3 className='text-base font-normal pt-6 text-black/75'>{course.description}</h3>
          <div className='flex justify-between items-center py-6 border-b'>
            <div className='flex items-center gap-4'>
              <h3 className='text-red-700 text-2xl font-medium'>{5}</h3>
              <div className='flex'>
                {renderStars(5)} {/* Dynamic stars */}
              </div>
            </div>
            <h3 className='text-2xl font-medium text-red-700'>{course.price ? formatCurrency(course.price) : ''}</h3>
          </div>
          <div className='flex justify-between pt-6'>
            <div className='flex gap-4'>
              <Icon icon='solar:notebook-minimalistic-outline' className='text-primary text-xl inline-block me-2' />
              <h3 className='text-base font-medium text-black opacity-75'>{course.topics?.length} classes</h3>
            </div>
            <div className='flex gap-4'>
              <Icon icon='solar:users-group-rounded-linear' className='text-primary text-xl inline-block me-2' />
              <h3 className='text-base font-medium text-black opacity-75'>{course.author_name}</h3>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
