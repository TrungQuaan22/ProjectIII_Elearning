import React from 'react'
import { Box, Flex, Input, Select } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import styles from './FormFilter.module.scss'

export default function FormFilter() {
  const handleSearch = (value: string) => {
    // TODO: Update search via Context
  }

  const handleSort = (value: string) => {
    // TODO: Update sort via Context
  }

  return (
    <Box className={styles.formFilter}>
      <Flex justify={'space-between'}>
        <Box mb='10px'>
          <Text mb='5px' fontWeight={500}>
            Tìm kiếm tên sách
          </Text>
          <Input placeholder='Tìm kiếm tên sách' name='name' value={filters.name} onChange={handleInputChange} />
        </Box>
        <Box mb='10px'>
          <SelectRoot
            collection={ratingOptions}
            width='320px'
            value={filters.rating_filter}
            onValueChange={(e) =>
              setLocalFilters((prev) => ({
                ...prev,
                rating_filter: e.value
              }))
            }
          >
            <SelectLabel>Đánh giá</SelectLabel>
            <SelectTrigger>
              <SelectValueText placeholder='Chọn đánh giá' />
            </SelectTrigger>
            <SelectContent>
              {ratingOptions.items.map((option) => (
                <SelectItem item={option} key={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
        </Box>
        <Box mb='10px'>
          <SelectRoot
            collection={sortByOptions}
            width='320px'
            value={filters.sort_by}
            onValueChange={(e) =>
              setLocalFilters((prev) => ({
                ...prev,
                sort_by: e.value
              }))
            }
          >
            <SelectLabel>Sắp xếp theo</SelectLabel>
            <SelectTrigger>
              <SelectValueText placeholder='Chọn tiêu chí sắp xếp' />
            </SelectTrigger>
            <SelectContent>
              {sortByOptions.items.map((option) => (
                <SelectItem item={option} key={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
        </Box>
        <Flex justifyContent={'center'} direction={'column'} gap='10px'>
          <Button mt='15px' backgroundColor={'orangered'} onClick={applyFilters}>
            Áp dụng
          </Button>
        </Flex>
      </Flex>
    </Box>
  )
}
