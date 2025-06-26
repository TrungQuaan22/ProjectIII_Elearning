import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import AuthLayout from 'src/layout/AuthLayout'
import DefaultLayout from 'src/layout/DefaultLayout'
import About from 'src/pages/About/About'
import MyAcount from 'src/pages/Account/MyAcount'
import CourseDetail from 'src/pages/CourseDetail/CourseDetail'
import Cart from 'src/pages/Cart'
import Checkout from 'src/pages/Checkout/Checkout'
import Contact from 'src/pages/Contact/Contact'
import Enrollments from 'src/pages/Enrollments/Enrollments'
import ForgetPassword from 'src/pages/ForgetPassword/ForgetPassword'
import Home from 'src/pages/Home'
import ListCourses from 'src/pages/ListCourses'
import Login from 'src/pages/Login'
import MyOrders from 'src/pages/MyOrders'
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
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: '/login',
          element: (
            <AuthLayout>
              <Login />
            </AuthLayout>
          )
        },
        {
          path: '/register',
          element: (
            <AuthLayout>
              <Register />
            </AuthLayout>
          )
        },
        {
          path: '/forget-password',
          element: (
            <AuthLayout>
              <ForgetPassword />
            </AuthLayout>
          )
        }
      ]
    },

    {
      path: '/contact',
      element: (
        <DefaultLayout>
          <Contact />
        </DefaultLayout>
      )
    },
    {
      path: '/about',
      element: (
        <DefaultLayout>
          <About />
        </DefaultLayout>
      )
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
          path: '/checkout/:cartId',
          element: (
            <DefaultLayout>
              <Checkout />
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
          path: '/my-orders',
          element: (
            <DefaultLayout>
              <MyOrders />
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
          path: '/learn/:courseSlug',
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
        <AuthLayout>
          <ResetPassword />
        </AuthLayout>
      )
    },
    {
      path: '/dashboard',
      element: <DashBoard />,
      children: [
        { index: true, element: <DashboardHome /> },
        { path: 'courses', element: <CoursesList /> },
        { path: 'courses/create', element: <CoursesCreate /> }
        // Có thể thêm các route khác như blogs ở đây
      ]
    },
    {
      path: '/dashboard/courses/:slug/edit',
      element: <CourseEditPage />
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
