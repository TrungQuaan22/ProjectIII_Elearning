import { TopicType } from './curriculum.type'

export interface CourseType {
  _id?: string
  title?: string
  slug?: string
  author_name?: string
  description?: string
  detailed_description?: string // Mô tả chi tiết cho trang xem chi tiết khóa học
  thumbnail?: string
  price?: number
  author_id?: string
  status?: string
  topics?: TopicType[]
  created_at?: Date
  updated_at?: Date
}

export const initialCourse: CourseType = {
  _id: '6853cdb6314c48199e6d8e05',
  title: 'Edit Lập trình Web với Node.js',
  slug: 'lap-trinh-web-voi-reactjs',
  author_name: 'Giang Trung Quân',
  description: 'Khóa học lập trình web frontend',
  detailed_description:
    'Chi tiết về khóa học Node.js:\n- Giới thiệu về Node.js\n- Cài đặt môi trường\n- Xây dựng REST API\n- Kết nối database\n- Authentication & Authorization',
  thumbnail: 'https://files.fullstack.edu.vn/f8-prod/courses/12.png',
  price: 1200000,
  status: 'published',
  topics: [
    {
      _id: '6853d336b22ff59261dfb25a',
      title: 'Chương 1: Cách Setup dự án ReactJS',
      slug: 'chuong-1-cach-setup-du-an-reactjs',
      summary: 'Demo',
      order: 1,
      lessons: []
    },
    {
      _id: '6853d352b22ff59261dfb25b',
      title: 'Chương 2: ReactJS cơ bản',
      slug: 'chuong-2-reactjs-co-ban',
      summary: 'Demo',
      order: 2,
      lessons: []
    },
    {
      _id: '6853d371b22ff59261dfb25c',
      title: 'Chương 3: ReactJS Hook',
      slug: 'chuong-3-reactjs-hook',
      summary: 'Demo',
      order: 3,
      lessons: [
        {
          _id: '6853d3a8b22ff59261dfb25d',
          title: '(Updated)Bài 1: Node.js là gì?',
          slug: 'bai-1-node-js-la-gi',
          description: 'Hehehe Giới thiệu về Node.js',
          duration: 1200,
          order: 1
        }
      ]
    }
  ]
}

export const courseData: {
  heading: string
  imgSrc: string
  name: string
  students: number
  classes: number
  price: number
  rating: number
}[] = [
  {
    heading: 'Full stack modern javascript',
    name: 'Colt stelle',
    imgSrc: '/images/courses/courseone.png',
    students: 150,
    classes: 12,
    price: 20,
    rating: 4.4
  },
  {
    heading: 'Design system with React programme',
    name: 'Colt stelle',
    imgSrc: '/images/courses/coursetwo.png',
    students: 130,
    classes: 12,
    price: 20,
    rating: 4.5
  },
  {
    heading: 'Design banner with Figma',
    name: 'Colt stelle',
    imgSrc: '/images/courses/coursethree.png',
    students: 120,
    classes: 12,
    price: 20,
    rating: 5
  },
  {
    heading: 'We Launch Delia Webflow this Week!',
    name: 'Colt stelle',
    imgSrc: '/images/courses/courseone.png',
    students: 150,
    classes: 12,
    price: 20,
    rating: 5
  },
  {
    heading: 'We Launch Delia Webflow this Week!',
    name: 'Colt stelle',
    imgSrc: '/images/courses/coursetwo.png',
    students: 150,
    classes: 12,
    price: 20,
    rating: 5
  },
  {
    heading: 'We Launch Delia Webflow this Week!',
    name: 'Colt stelle',
    imgSrc: '/images/courses/coursethree.png',
    students: 150,
    classes: 12,
    price: 20,
    rating: 4.2
  }
]
