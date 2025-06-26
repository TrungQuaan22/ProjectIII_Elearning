import React from 'react'
import { Box, Image, Text } from '@chakra-ui/react'

interface CategoryCardProp {
  title : string,
  icon: string 
}
const CategoryCard = ({ title, icon } : CategoryCardProp) => {
  return (
    <Box
      as='button'
      borderWidth='1px'
      borderRadius='md'
      // bg={isActive ? 'orange.500' : 'white'}
      // color={isActive ? "white" : "orange.500"}
      _hover={{ boxShadow: 'md' }}
      p={4}
      w='170px'
      h='145px'
      textAlign='center'
    >
      <Image src={icon} alt={title} boxSize='40px' mx='auto' mb={4} />
      <Text fontWeight="medium">{title}</Text>
    </Box>
  )
}

export default CategoryCard
