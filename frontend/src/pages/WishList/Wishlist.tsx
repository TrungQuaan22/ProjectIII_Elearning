import React, { useEffect } from 'react'
import { Box, Button, Center, Flex, Text } from '@chakra-ui/react'
import BookCard from 'src/components/CourseCard/CourseCard'
import styles from './Wishlist.module.scss'
import { BreadcrumbCurrentLink, BreadcrumbLink, BreadcrumbRoot } from 'src/components/ui/breadcrumb'
import { FiX } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

export default function Wishlist() {
  const navigate = useNavigate()
  const wishlist: any[] = [] // Will be replaced with Context/Query
  const cartItems: any[] = [] // Will be replaced with Context/Query
  const books: any[] = [] // Will be replaced with Context/Query

  useEffect(() => {
    // TODO: Fetch data via Context or React Query
  }, [])

  const handleRemoveFromWishlist = (id: number) => {
    // TODO: Remove from wishlist via Context
  }

  const handleAddToCart = (bookId: number) => {
    // TODO: Add to cart via Context
  }

  const handleMoveAllToBag = async () => {
    const ids = wishlist.map((item) => item.book.id)

    // TODO: Implement add to cart logic via Context
    console.error('Failed to add to cart')
  }

  return (
    <Flex justify={'center'}>
      <Box padding='50px 0px' width='1260px'>
        <Flex justifyContent='space-between' alignItems='center'>
          <Text fontWeight={500}>{`Wishlist (${wishlist.length})`}</Text>
          <Button variant='outline' padding='20px 50px' onClick={handleMoveAllToBag}>
            Move All To Bag
          </Button>
        </Flex>
        <Flex flexWrap='wrap' gap={4} justifyContent='left' gapX='21px' marginTop='80px'>
          {wishlist.map((item) => (
            <BookCard key={item.book.id} {...item.book} mode='wishlist' />
          ))}
        </Flex>
        <Flex justify='space-between' align='center'>
          <Text className={styles.justForYou} fontWeight={500}>
            Just For You
          </Text>
          <Button variant='outline' padding='20px 45px' onClick={() => navigate('/books')}>
            See All
          </Button>
        </Flex>
        <Flex flexWrap='wrap' gap={4} justifyContent='left' gapX='21px' marginTop='80px'>
          {books.slice(0, 5).map((item) => (
            <BookCard key={item.id} {...item} mode='wishlist' />
          ))}
        </Flex>
      </Box>
    </Flex>
  )
}
