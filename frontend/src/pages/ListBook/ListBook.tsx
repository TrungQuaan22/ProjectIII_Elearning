import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Box, Flex, HStack, Text } from '@chakra-ui/react'
import { BreadcrumbCurrentLink, BreadcrumbLink, BreadcrumbRoot } from 'src/components/ui/breadcrumb'
import CourseCard from 'src/components/CourseCard/CourseCard'
import AsideFilter from './AsideFilter/AsideFilter'
import FormFilter from './FormFilter/FormFilter'
import styles from './ListBook.module.scss'
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot
} from 'src/components/ui/pagination'

export default function ListBook() {
  const [searchParams, setSearchParams] = useSearchParams()
  const books: any[] = [] // Will be replaced with Context/Query
  const pagination: any = {} // Will be replaced with Context/Query
  const [page, setPage] = useState<number>(pagination.current_page)

  useEffect(() => {
    // TODO: Fetch books data via Context or React Query
  }, [])

  const handleFiltersChange = (filters: any) => {
    // TODO: Update filters via Context
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    setSearchParams({ ...Object.fromEntries(searchParams.entries()), page: newPage.toString() })
  }

  return (
    <Flex justify='center' align='center' mt='20px' padding={'50px 0px'}>
      <Box width='1260px'>
        <Flex gap='20px'>
          <Box flex={1}>
            <AsideFilter />
          </Box>
          <Box flex={5}>
            <FormFilter />
            <Flex gap='30px' flexWrap='wrap' justifyContent='left'>
              {books.map((book) => (
                <Box key={book.id}>
                  <CourseCard {...book} />
                </Box>
              ))}
            </Flex>
            <Flex justify='center' mt='20px'>
              <PaginationRoot
                count={pagination.total}
                pageSize={pagination.limit}
                page={page}
                onPageChange={(e) => handlePageChange(e.page)}
              >
                <HStack>
                  <PaginationPrevTrigger />
                  <PaginationItems />
                  <PaginationNextTrigger />
                </HStack>
              </PaginationRoot>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Flex>
  )
}
