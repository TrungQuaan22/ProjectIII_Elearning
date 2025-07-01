import { NavLink } from 'react-router-dom'
import { useAppContext } from 'src/hooks/useAppContext'

export default function NavHeader() {
  const { isAuthenticated } = useAppContext()

  return (
    <div className='flex items-center justify-center'>
      <ul className='flex items-center justify-center gap-10'>
        <li>
          <NavLink className={({ isActive }) => (isActive ? 'text-green-500' : 'text-gray-500')} to='/' end>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink className={({ isActive }) => (isActive ? 'text-green-500' : 'text-gray-500')} to='/courses'>
            Courses
          </NavLink>
        </li>
        <li>
          <NavLink className={({ isActive }) => (isActive ? 'text-green-500' : 'text-gray-500')} to='/blogs'>
            Blog
          </NavLink>
        </li>
        {!isAuthenticated && (
          <>
            <li>
              <NavLink className={({ isActive }) => (isActive ? 'text-green-500' : 'text-gray-500')} to='/register'>
                Sign Up
              </NavLink>
            </li>
            <li>
              <NavLink className={({ isActive }) => (isActive ? 'text-green-500' : 'text-gray-500')} to='/login'>
                Login
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </div>
  )
}
