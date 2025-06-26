import React from 'react'
import Logo from 'src/components/LogoHeader/LogoHeader'
import NavHeader from 'src/components/NavHeader'
import SearchHeader from 'src/components/SearchHeader/SearchHeader'
import UserHeader from 'src/components/UserHeader/UserHeader'
import styles from './header.module.scss'
import { Flex } from '@chakra-ui/react'
import { useAppContext } from 'src/hooks/useAppContext'

export default function Header() {
  const { isAuthenticated } = useAppContext()
  return (
    <Flex justify='center' borderBottom='0.5px solid #ccc;' className={styles.header}>
      <header className={styles.container}>
        <div className={styles.section}>
          <Logo />
        </div>
        <div className={styles.section}>
          <NavHeader />
        </div>
        <div className={styles.section}>
          <div style={{ marginRight: '25px' }}>
            <SearchHeader />
          </div>
          <UserHeader isAuthenticate={isAuthenticated} />
        </div>
      </header>
    </Flex>
  )
}
