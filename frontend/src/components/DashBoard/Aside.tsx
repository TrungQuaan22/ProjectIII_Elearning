import React, { useState } from 'react'
import { NavLink, useLocation, matchPath, useNavigate } from 'react-router-dom'
import { FaBook, FaChevronDown, FaList, FaPen, FaPlus, FaSignOutAlt } from 'react-icons/fa'
import { useAppContext } from 'src/hooks/useAppContext'
import { useLogoutWithAPI } from 'src/hooks/useLogout'

export default function Aside() {
  const [openCourse, setOpenCourse] = useState(true)
  const location = useLocation()
  const isCourseList =
    matchPath('/dashboard/courses', location.pathname) && !matchPath('/dashboard/courses/create', location.pathname)
  const isCourseCreate = matchPath('/dashboard/courses/create', location.pathname)
  const isBlogList =
    matchPath('/dashboard/blogs', location.pathname) && !matchPath('/dashboard/blogs/create', location.pathname)
  const isBlogCreate = matchPath('/dashboard/blogs/create', location.pathname)
  const [openBlog, setOpenBlog] = useState(true)
  const logoutMutation = useLogoutWithAPI()

  const { logout } = useAppContext()
  const navigate = useNavigate()
  return (
    <aside className='w-64 bg-white shadow-lg min-h-screen p-4'>
      <div className='font-bold text-2xl mb-8 text-indigo-700'>Elearning Admin</div>
      <nav className='flex flex-col gap-2'>
        <NavLink to='/dashboard' className='font-semibold text-gray-700 py-2 px-4 rounded hover:bg-indigo-50'>
          Dashboard
        </NavLink>
        {/* Quản lý khóa học */}
        <div>
          <button
            className='flex items-center gap-2 w-full py-2 px-4 rounded hover:bg-indigo-50 text-gray-700 font-semibold'
            onClick={() => setOpenCourse((v) => !v)}
          >
            <FaBook /> Quản lý khóa học{' '}
            <FaChevronDown className={`ml-auto transition-transform ${openCourse ? 'rotate-180' : ''}`} />
          </button>
          {openCourse && (
            <div className='ml-6 flex flex-col gap-1 mt-1'>
              <NavLink
                to='/dashboard/courses'
                className={`flex items-center gap-2 py-2 px-3 rounded hover:bg-indigo-100 text-gray-600 ${isCourseList ? 'bg-indigo-100 font-bold' : ''}`}
              >
                <FaList /> Danh sách khóa học
              </NavLink>
              <NavLink
                to='/dashboard/courses/create'
                className={`flex items-center gap-2 py-2 px-3 rounded hover:bg-indigo-100 text-gray-600 ${isCourseCreate ? 'bg-indigo-100 font-bold' : ''}`}
              >
                <FaPlus /> Tạo khóa học
              </NavLink>
            </div>
          )}
        </div>
        {/* Quản lý bài viết */}
        <div>
          <button
            className='flex items-center gap-2 w-full py-2 px-4 rounded hover:bg-indigo-50 text-gray-700 font-semibold'
            onClick={() => setOpenBlog((v) => !v)}
          >
            <FaBook /> Quản lý bài viết{' '}
            <FaChevronDown className={`ml-auto transition-transform ${openBlog ? 'rotate-180' : ''}`} />
          </button>
          {openBlog && (
            <div className='ml-6 flex flex-col gap-1 mt-1'>
              <NavLink
                to='/dashboard/blogs'
                className={`flex items-center gap-2 py-2 px-3 rounded hover:bg-indigo-100 text-gray-600 ${isBlogList ? 'bg-indigo-100 font-bold' : ''}`}
              >
                <FaList /> Danh sách bài viết
              </NavLink>
              <NavLink
                to='/dashboard/blogs/create'
                className={`flex items-center gap-2 py-2 px-3 rounded hover:bg-indigo-100 text-gray-600 ${isBlogCreate ? 'bg-indigo-100 font-bold' : ''}`}
              >
                <FaPen /> Tạo bài viết
              </NavLink>
            </div>
          )}
        </div>
        {/* Logout */}
        <button
          className='flex items-center gap-2 w-full py-2 px-4 rounded hover:bg-indigo-50 text-gray-700 font-semibold'
          onClick={() => logoutMutation.mutate()}
        >
          <FaSignOutAlt /> Đăng xuất
        </button>
      </nav>
    </aside>
  )
}
