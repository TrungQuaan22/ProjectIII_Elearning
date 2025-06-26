import { Box, Flex, Text, Input, Separator, Center, Textarea, Button } from '@chakra-ui/react'
import { BreadcrumbCurrentLink, BreadcrumbLink, BreadcrumbRoot } from 'src/components/ui/breadcrumb'
import { FiPhone, FiMail } from 'react-icons/fi'

export default function Contact() {
  return (
    <Box padding='50px 155px'>
      {/* Breadcrumb */}
      <Box width='full' maxWidth='container.md' mb={8}>
        <BreadcrumbRoot>
          <BreadcrumbLink href='#'>Home</BreadcrumbLink>
          <BreadcrumbCurrentLink>Contact</BreadcrumbCurrentLink>
        </BreadcrumbRoot>
      </Box>

      {/* Main content */}
      <Flex height='457px' width='full' gap='110px'>
        {/* Contact Information */}
        <Box width='340px' bg='white' boxShadow='2xl' borderRadius='md' p='6' fontFamily='Poppins'>
          {/* Call To Us */}
          <Flex align='center' mb='6'>
            <Center w='50px' h='50px' backgroundColor='rgba(255, 69, 0, 0.7804)' borderRadius='full' mr='4'>
              <FiPhone />
            </Center>
            <Text fontWeight='bold'>Call To Us</Text>
          </Flex>
          <Text fontSize={14}>We are available 24/7, 7 days a week.</Text>
          <Text mb='6' fontSize={14}>
            Phone: 0397259946
          </Text>
          <Separator borderColor='gray.500' mb='6' />

          {/* Write To Us */}
          <Flex align='center' mb='6'>
            <Center w='50px' h='50px' backgroundColor='rgba(255, 69, 0, 0.7804)' borderRadius='full' mr='4'>
              <FiMail />
            </Center>
            <Text fontWeight='bold'>Write To Us</Text>
          </Flex>
          <Text fontSize={14} mb='2'>
            Fill out our form and we will contact you within 24 hours.
          </Text>
          <Text fontSize={14}>Email: customer@exclusive.com</Text>
          <Text fontSize={14}>Email: support@exclusive.com</Text>
        </Box>

        {/* Contact Form */}
        <Box flex='1' bg='white' boxShadow='2xl' borderRadius='md' padding='40px 30px'>
          <Flex gap='4'>
            <Input variant='subtle' padding='5px 10px' placeholder='Your Name *' size='md' height={50} />
            <Input variant='subtle' padding='5px 10px' placeholder='Your Email *' size='md' height={50} />
            <Input variant='subtle' padding='5px 10px' placeholder='Your Phone *' size='md' height={50} />
          </Flex>
          <Textarea variant='subtle' placeholder='Your Message' padding={5} size='md' rows={6} mt={30} height={200} />
          <Flex justify={'flex-end'} mt={30}>
            <Button backgroundColor='rgba(255, 69, 0, 0.7804)' padding='20px 32px' size='md'>
              Send Message
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}
