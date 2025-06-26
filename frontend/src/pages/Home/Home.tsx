import { useRef } from 'react'
import { Button, Text, Flex } from '@chakra-ui/react'
import { Toaster } from 'src/components/ui/toaster'
import { useNavigate } from 'react-router-dom'
import CustomSlider from 'src/components/CustomSlider'
import styles from './Home.module.scss'
import CategoryCard from 'src/components/CategoryCard/CategoryCard'
import { sliderSettings } from 'src/utils/utils'
import { BlogCard } from 'src/components/BlogCard/BlogCard'
import { useQuery } from '@tanstack/react-query'
import type { CategoryType } from 'src/types/category.type'
import { getCategories } from 'src/apis/categories.api'
import Courses from 'src/components/Home/Courses/Courses'
import Companies from 'src/components/Home/Companies'
import Hero from 'src/components/Home/Hero'
import Mentor from 'src/components/Home/Mentor'
import Newsletter from 'src/components/Home/Newsletter'
import Testimonial from 'src/components/Home/Testimonials'

export default function Home() {
  const navigate = useNavigate()
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    retry: false
  })
  const cateRef = useRef(null)

  const cateSettings = {
    ...sliderSettings,
    slidesToShow: 6,
    centerMode: true,
    centerPadding: '0px'
  }

  return (
    <>
      <Toaster />
      <Flex justify='center'>
        <div className='container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4'>
          <Hero />
          <Courses />
          <Companies />
          <Mentor />
          <Testimonial />
          <Newsletter />
          {/* Category */}
          <div className={styles.categories}>
            <Text fontSize={36} fontWeight={600} mt={10} className={styles.titleSection}>
              Categories Blogs
            </Text>
            <CustomSlider sliderRef={cateRef} settings={cateSettings}>
              {categories.map((category: CategoryType) => (
                <div
                  key={category._id}
                  className={styles.categoriesItem}
                  onClick={() => navigate(`/courses?category_id=${category._id}`)}
                >
                  <CategoryCard title={category.name} icon={category.image ? category.image : ''} />
                </div>
              ))}
            </CustomSlider>
          </div>

          <div className={styles.allCourseContainer}>
            <Text className={styles.titleSection}>Our Blogs</Text>
            <Text fontSize={36} fontWeight={600} mt={0}>
              Explore Our Blogs
            </Text>
            <Flex
              gap={10}
              justifyContent='space-between'
              flexWrap='wrap'
              w='100%'
              direction='column'
              alignItems='center'
              mt={10}
            >
              <BlogCard />
              <BlogCard />
              <BlogCard />
              <BlogCard />
            </Flex>
            <div className='flex justify-center mt-10'>
              <Button
                padding='25px 50px'
                variant='outline'
                colorScheme='blue'
                className='bg-blue-500 text-white hover:bg-blue-600 hover:text-white border-blue-500 py-5 px-10 mb-10'
                onClick={() => navigate('/blogs')}
              >
                View All Blogs
              </Button>
            </div>
          </div>
        </div>
      </Flex>
    </>
  )
}
