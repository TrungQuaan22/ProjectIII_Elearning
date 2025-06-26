import React from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { Button } from 'src/components/ui/button'
import { BreadcrumbCurrentLink, BreadcrumbLink, BreadcrumbRoot } from 'src/components/ui/breadcrumb'
import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
  const navigate = useNavigate()
  return (
    <Box padding='50px 155px'>
      <Box width='full' maxWidth='container.md' mb={8}>
        <BreadcrumbRoot>
          <BreadcrumbLink href='#'>Home</BreadcrumbLink>
          <BreadcrumbCurrentLink>404 Error</BreadcrumbCurrentLink>
        </BreadcrumbRoot>
      </Box>
      <Flex direction='column' justify='center' align='center' bg='white' p={5} gap='40px' height='80vh'>
        {/* 404 Text */}
        <Text fontSize='110px' fontWeight='bold' color='gray.800' mb={4}>
          404 Not Found
        </Text>
        <Text fontSize='md' color='gray.500' mb={8} fontFamily='Poppins'>
          Your visited page not found. You may go home page.
        </Text>

        {/* Back Button */}
        <Button colorPalette='orange' padding='10px 40px' size='xl' onClick={() => navigate('/')}>
          Back to home page
        </Button>
      </Flex>
    </Box>
  )
}

export default NotFoundPage
