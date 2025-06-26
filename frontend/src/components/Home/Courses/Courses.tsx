'use client'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { Link } from 'react-router-dom'
import { getAllCourses } from 'src/apis/courses.api'
import { useQuery } from '@tanstack/react-query'
import CourseCard from 'src/components/CourseCard/CourseCard'

const settings = {
  dots: false,
  infinite: true,
  slidesToShow: 3,
  slidesToScroll: 2,
  arrows: false,
  autoplay: true,
  speed: 500,
  cssEase: 'linear',
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: true,
        dots: false
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        dots: false
      }
    }
  ]
}

const Courses = () => {
  const { data } = useQuery({
    queryKey: ['courses', {}],
    queryFn: () => getAllCourses({ status: 'published' }),
    staleTime: 5 * 60 * 1000
  })
  console.log('courses', data?.courses)
  return (
    <section id='courses' className='py-20'>
      <div className='container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4'>
        <div className='sm:flex justify-between items-center mb-20'>
          <h2 className='text-midnight_text text-4xl lg:text-5xl font-semibold mb-5 sm:mb-0'>Popular courses.</h2>
          <Link to={'/'} className='text-primary text-lg font-medium hover:tracking-widest duration-500'>
            Explore courses&nbsp;&gt;&nbsp;
          </Link>
        </div>
        <Slider {...settings}>
          {data?.courses.map((course) => (
            <div key={course._id}>
              <CourseCard course={course} />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  )
}

export default Courses
