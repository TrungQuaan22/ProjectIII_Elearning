import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CiLogout } from 'react-icons/ci'
import { FiShoppingBag } from 'react-icons/fi'
import { MdFavoriteBorder, MdOutlineShoppingCart } from 'react-icons/md'
import { CiUser } from 'react-icons/ci'
import PersonIcon from '@mui/icons-material/Person'
import styles from './UserHeader.module.scss'
import { useLogoutWithAPI } from 'src/hooks/useLogout'
import { useAppContext } from 'src/hooks/useAppContext'

interface UserHeaderProps {
  isAuthenticate: boolean
}

export default function UserHeader({ isAuthenticate }: UserHeaderProps) {
  const [showMenu, setShowMenu] = useState(false)
  const logoutMutation = useLogoutWithAPI()
  const { profile } = useAppContext()

  const menuRef = useRef<HTMLDivElement>(null)

  // TODO: Replace with Context API for cart and wishlist
  const wishlist: unknown[] = [] // Will be replaced with Context
  const cart = profile?.cart || []
  const toggleMenu = () => {
    setShowMenu((prev) => !prev)
  }

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setShowMenu(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Function to get user initials from name
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Function to render user avatar or initials
  const renderUserAvatar = () => {
    if (profile?.avatar) {
      return <img src={profile.avatar} alt={profile.name || 'User avatar'} className={styles.userAvatar} />
    } else if (profile?.name) {
      return <div className={styles.userInitials}>{getUserInitials(profile.name)}</div>
    } else {
      return <PersonIcon className={styles.icon} />
    }
  }

  return (
    <div className={styles.userHeader}>
      {/* Wishlist Icon */}
      <Link to='/wishlist' className={styles.icon}>
        {wishlist.length > 0 && (
          <div className={styles.badge}>
            <span>{wishlist.length}</span>
          </div>
        )}

        <MdFavoriteBorder />
      </Link>

      {/* Cart Icon */}
      <Link to='/cart' className={styles.icon}>
        {cart.length > 0 && (
          <div className={styles.badge}>
            <span>{cart.length}</span>
          </div>
        )}

        <MdOutlineShoppingCart />
      </Link>

      {/* User Avatar/Name */}
      {isAuthenticate && (
        <div className={styles.userMenuContainer} ref={menuRef}>
          <div className={styles.userAvatarContainer} onClick={toggleMenu}>
            {renderUserAvatar()}
          </div>
          {showMenu && (
            <div className={styles.userMenu}>
              <Link to='/my-account' className={styles.menuItem}>
                <span className={styles.menuIcon}>
                  <CiUser />
                </span>
                Manage My Account
              </Link>
              <Link to='/enrollments' className={styles.menuItem}>
                <span className={styles.menuIcon}>
                  <FiShoppingBag />
                </span>
                My Enrollments Courses
              </Link>
              <div className={styles.menuItem} onClick={handleLogout}>
                <span className={styles.menuIcon}>
                  <CiLogout />
                </span>
                Logout
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
