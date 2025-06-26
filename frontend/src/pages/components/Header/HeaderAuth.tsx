import React from 'react'
import Logo from 'src/components/LogoHeader/LogoHeader'
import NavHeader from 'src/components/NavHeader'
import styles from './header.module.scss'
import SearchHeader from 'src/components/SearchHeader/SearchHeader'
import { Flex } from '@chakra-ui/react'
export default function HeaderAuth() {
  return (
    <Flex justify={'center'} className={styles.headerAuth}>
      <header className={styles.container}>
        <Logo />
        <NavHeader />
        <SearchHeader />
      </header>
    </Flex>
  )
}
