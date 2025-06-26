import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Text, Box } from '@chakra-ui/react'
import { GoTriangleRight } from 'react-icons/go'
import styles from './AsideFilter.module.scss'

export default function AsideFilter() {
  const [searchParams, setSearchParams] = useSearchParams()

  // TODO: Replace with Context API or React Query
  const categories: any[] = [] // Will be replaced with Context/Query
  const authors: any[] = [] // Will be replaced with Context/Query
  const publishers: any[] = [] // Will be replaced with Context/Query

  const [showAllCategories, setShowAllCategories] = useState(false)
  const [showAllAuthors, setShowAllAuthors] = useState(false)
  const [showAllPublishers, setShowAllPublishers] = useState(false)

  const currentFilter = Object.fromEntries(searchParams.entries())

  useEffect(() => {
    // TODO: Fetch data via Context or React Query
  }, [])

  const handleFilter = (filterKey: string, filterValue: string) => {
    searchParams.set(filterKey, filterValue)
    setSearchParams(searchParams)

    const newFilters = Object.fromEntries(searchParams.entries())
    // TODO: Update filters via Context
  }

  const renderList = (
    items: any[],
    filterKey: string,
    activeValue: string | undefined,
    showAll: boolean,
    setShowAll: (value: boolean) => void
  ) => {
    const visibleItems = showAll ? items : items.slice(0, 5)
    return (
      <Box>
        <ul>
          {visibleItems.map((item) => (
            <li key={item.id}>
              <button
                className={`${styles.listItem} ${activeValue === item.id.toString() ? styles.active : ''}`}
                onClick={() => handleFilter(filterKey, item.id.toString())}
              >
                {item.name || item.title || item.full_name}
              </button>
            </li>
          ))}
        </ul>
        {items.length > 5 && (
          <button className={styles.toggleButton} onClick={() => setShowAll(!showAll)}>
            {showAll ? 'Thu gọn' : 'Thêm'}
          </button>
        )}
      </Box>
    )
  }

  return (
    <div>
      <button
        onClick={() => {
          setSearchParams({})
          // TODO: Update filters via Context
        }}
      >
        Tất cả sản phẩm
      </button>

      <Text fontWeight={700}>Danh mục</Text>
      {renderList(categories, 'category_id', currentFilter['category_id'], showAllCategories, setShowAllCategories)}

      <hr />
      <Text fontWeight={700}>Tác giả</Text>
      {renderList(authors, 'author_id', currentFilter['author_id'], showAllAuthors, setShowAllAuthors)}

      <hr />
      <Text fontWeight={700}>Nhà xuất bản</Text>
      {renderList(publishers, 'publisher_id', currentFilter['publisher_id'], showAllPublishers, setShowAllPublishers)}
    </div>
  )
}
