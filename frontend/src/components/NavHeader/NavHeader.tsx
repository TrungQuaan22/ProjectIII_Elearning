import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAppContext } from 'src/hooks/useAppContext'
import styles from './NavHeader.module.scss'

  
export default function NavHeader() {
  // TODO: Replace with useAppContext
  const { isAuthenticated } = useAppContext()

  return (
    <div className={styles.container}>
      <ul className={styles.nav}>
        <li>
          <NavLink className={({ isActive }) => (isActive ? styles.activeNavLink : styles.navLink)} to='/' end>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink className={({ isActive }) => (isActive ? styles.activeNavLink : styles.navLink)} to='/contact'>
            Contact
          </NavLink>
        </li>
        <li>
          <NavLink className={({ isActive }) => (isActive ? styles.activeNavLink : styles.navLink)} to='/about'>
            About
          </NavLink>
        </li>
        <li>
          <NavLink className={({ isActive }) => (isActive ? styles.activeNavLink : styles.navLink)} to='/about'>
            Blog
          </NavLink>
        </li>
        {!isAuthenticated && (
          <>
          <li>
            <NavLink className={({ isActive }) => (isActive ? styles.activeNavLink : styles.navLink)} to='/register'>
              Sign Up
            </NavLink>
          </li>
          <li>
          <NavLink className={({ isActive }) => (isActive ? styles.activeNavLink : styles.navLink)} to='/login'>
            Login
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </div>
  )
}
