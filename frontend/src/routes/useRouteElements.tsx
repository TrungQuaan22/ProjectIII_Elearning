import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import DefaultLayout from 'src/layout/DefaultLayout'
import MyAcount from 'src/pages/Account/MyAcount'
import CourseDetail from 'src/pages/CourseDetail/CourseDetail'
import Cart from 'src/pages/Cart'
import Enrollments from 'src/pages/Enrollments/Enrollments'
import Home from 'src/pages/Home'
import ListCourses from 'src/pages/ListCourses'
import Login from 'src/pages/Login'
import NotFoundPage from 'src/pages/NotFound/NotFound'
import Register from 'src/pages/Register'
import ResetPassword from 'src/pages/ResetPassword/ResetPassword'
import Wishlist from 'src/pages/WishList/Wishlist'
import { useAppContext } from 'src/hooks/useAppContext'
import LearnCourse from 'src/pages/LearnCourse/LearnCourse'
import DashBoard from 'src/pages/DashBoard'
import DashboardHome from 'src/pages/DashBoard/DashboardHome'
import CoursesList from 'src/pages/DashBoard/CoursesList'
import CoursesCreate from 'src/pages/DashBoard/CoursesCreate'
import CourseEditPage from 'src/pages/DashBoard/CourseEditPage'
import BlogCreatePage from 'src/pages/DashBoard/BlogCreatePage'
import BlogEditPage from 'src/pages/DashBoard/BlogEditPage'
import PaymentCallback from 'src/pages/PaymentCallback/PaymentCallback'
import BlogsListAdmin from 'src/pages/Blogs/BlogsListAdmin'
import BlogDetail from 'src/pages/Blogs/BlogDetail'
import BlogsListUser from 'src/pages/Blogs/BlogsListUser'

function ProtectedRoute() {
  const { isAuthenticated } = useAppContext()
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

function RejectedRoute() {
  const { isAuthenticated } = useAppContext()
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: '/',
      element: (
        <DefaultLayout>
          <Home />
        </DefaultLayout>
      )
    },
    {
      path: '/courses',
      element: (
        <DefaultLayout>
          <ListCourses />
        </DefaultLayout>
      )
    },
    {
      path: '/blogs',
      element: (
        <DefaultLayout>
          <BlogsListUser />
        </DefaultLayout>
      )
    },
    {
      path: '/blogs/:slug',
      element: (
        <DefaultLayout>
          <BlogDetail />
        </DefaultLayout>
      )
    },
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: '/login',
          element: (
            <DefaultLayout>
              <Login />
            </DefaultLayout>
          )
        },
        {
          path: '/register',
          element: (
            <DefaultLayout>
              <Register />
            </DefaultLayout>
          )
        },
        {
          path: '/forget-password'
        }
      ]
    },

    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: '/cart',
          element: (
            <DefaultLayout>
              <Cart />
            </DefaultLayout>
          )
        },
        {
          path: '/wishlist',
          element: (
            <DefaultLayout>
              <Wishlist />
            </DefaultLayout>
          )
        },
        {
          path: '/my-account',
          element: (
            <DefaultLayout>
              <MyAcount />
            </DefaultLayout>
          )
        },
        {
          path: '/enrollments',
          element: (
            <DefaultLayout>
              <Enrollments />
            </DefaultLayout>
          )
        },
        {
          path: '/learn/:enrollmentId',
          element: (
            <DefaultLayout>
              <LearnCourse />
            </DefaultLayout>
          )
        }
      ]
    },
    {
      path: '/courses/:courseSlug',
      element: (
        <DefaultLayout>
          <CourseDetail />
        </DefaultLayout>
      )
    },
    {
      path: '/reset-password/:token ',
      element: (
        <DefaultLayout>
          <ResetPassword />
        </DefaultLayout>
      )
    },
    {
      path: '/dashboard',
      element: <DashBoard />,
      children: [
        { index: true, element: <DashboardHome /> },
        { path: 'courses', element: <CoursesList /> },
        { path: 'courses/create', element: <CoursesCreate /> },
        { path: 'blogs', element: <BlogsListAdmin /> },
        { path: 'blogs/create', element: <BlogCreatePage /> },
        { path: 'blogs/edit/:slug', element: <BlogEditPage /> }
      ]
    },
    {
      path: '/dashboard/courses/:slug/edit',
      element: <CourseEditPage />
    },
    {
      path: '/payment/vnpay/callback',
      element: <PaymentCallback />
    },
    {
      path: '*',
      element: (
        <DefaultLayout>
          <NotFoundPage />
        </DefaultLayout>
      )
    }
  ])
  return routeElements
}
