import React from 'react'
import styles from './SearchHeader.module.scss'
import { Search } from '@mui/icons-material'
export default function SearchHeader() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container_search}>
        <input type='text' placeholder='What are you looking for?' />
        <button>
          <Search />
        </button>
      </div>
    </div>
  )
}
