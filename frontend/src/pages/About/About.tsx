import { Box, Center, Flex, Heading, Image, Text, Icon } from '@chakra-ui/react'
import { about } from 'src/assets/images'
import { BreadcrumbCurrentLink, BreadcrumbLink, BreadcrumbRoot } from 'src/components/ui/breadcrumb'
import { FiShoppingBag, FiDollarSign, FiUsers, FiPackage, FiTruck, FiHeadphones, FiCheckCircle } from 'react-icons/fi'

export default function About() {
  const stats = [
    {
      icon: FiPackage,
      value: '10.5k',
      label: 'Sellers active our site',
      bg: 'white',
      iconBg: 'orange.100',
      iconColor: 'orange.400'
    },
    {
      icon: FiDollarSign,
      value: '33k',
      label: 'Monthly Product Sale',
      bg: 'white',
      iconBg: 'orange.100',
      iconColor: 'orange.400'
    },
    {
      icon: FiShoppingBag,
      value: '45.5k',
      label: 'Customer active in our site',
      bg: 'white',
      iconBg: 'orange.100',
      iconColor: 'orange.400'
    },
    {
      icon: FiUsers,
      value: '25k',
      label: 'Annual gross sale in our site',
      bg: 'white',
      iconBg: 'orange.100',
      iconColor: 'orange.400'
    }
  ]
  const features = [
    {
      icon: FiTruck,
      title: 'FREE AND FAST DELIVERY',
      description: 'Free delivery for all orders over $140',
      bg: 'white',
      iconBg: 'orange.100',
      iconColor: 'orange.400'
    },
    {
      icon: FiHeadphones,
      title: '24/7 CUSTOMER SERVICE',
      description: 'Friendly 24/7 customer support',
      bg: 'white',
      iconBg: 'orange.100',
      iconColor: 'orange.400'
    },
    {
      icon: FiCheckCircle,
      title: 'MONEY BACK GUARANTEE',
      description: 'We return money within 30 days',
      bg: 'white',
      iconBg: 'orange.100',
      iconColor: 'orange.400'
    }
  ]

  return (
    <Box margin='80px 0px'>
      {/* Breadcrumb */}
      <Box width='full' maxWidth='container.md' ml={155}>
        <BreadcrumbRoot>
          <BreadcrumbLink href='#'>Home</BreadcrumbLink>
          <BreadcrumbCurrentLink>About</BreadcrumbCurrentLink>
        </BreadcrumbRoot>
      </Box>

      <Flex gap={40} justify='space-between' padding='40px 0px'>
        <Center>
          <Box ml={155} w={525}>
            <Heading size='6xl' mb={50}>
              Our Story
            </Heading>
            <Text fontSize={16} fontWeight={400}>
              Launced in 2015, Exclusive is South Asia’s premier online shopping makterplace with an active presense in
              Bangladesh. Supported by wide range of tailored marketing, data and service solutions, Exclusive has
              10,500 sallers and 300 brands and serves 3 millioons customers across the region.{' '}
            </Text>
            <Text mt={12}>
              Exclusive has more than 1 Million products to offer, growing at a very fast. Exclusive offers a diverse
              assotment in categories ranging from consumer.
            </Text>
          </Box>
        </Center>
        <Box width='50%'>
          <Image src={about} width='100%' />
        </Box>
      </Flex>

      <Flex marginTop="100px" padding='50px 155px' justify='space-between'>
        {stats.map((stat, index) => (
          <Box
            key={index}
            borderRadius='md'
            width='270px'
            height='230px'
            borderWidth='1px'
            borderColor='gray.200'
            bg={stat.bg}
            textAlign='center'
            p='4'
            boxShadow='md'
            _hover={{
              bg: 'orange.400',
              color: 'white',
              borderColor: 'orange.400'
            }}
          >
            <Center
              w='80px'
              h='80px'
              backgroundColor='gray'
              opacity='0.7'
              borderRadius='full'
              margin='0 auto'
              mb='4'
              transition='background 0.3s'
              _hover={{
                bg: 'white'
              }}
            >
              <Center w='60px' h='60px' backgroundColor='rgba(255, 69, 0, 1)' borderRadius='full'>
                <Icon fontSize='32px' color='white'>
                  <stat.icon />
                </Icon>
              </Center>
            </Center>

            {/* Văn bản */}
            <Text
              fontSize='2xl'
              fontWeight='bold'
              _hover={{
                color: 'white'
              }}
            >
              {stat.value}
            </Text>
            <Text
              _hover={{
                color: 'white'
              }}
            >
              {stat.label}
            </Text>
          </Box>
        ))}
      </Flex>

      <Flex marginTop="100px" padding='50px 155px' justify='space-around' borderWidth='1px' borderColor='purple.200' borderStyle='dotted'>
        {features.map((feature, index) => (
          <Box
            key={index}
            borderRadius='md'
            width='300px'
            height='200px'
            bg={feature.bg}
            textAlign='center'
            p='4'
            transition='background 0.3s, color 0.3s'
            _hover={{
              bg: 'orange.400',
              color: 'white',
              borderColor: 'orange.400'
            }}
          >
            <Center
              w='80px'
              h='80px'
              backgroundColor={feature.iconBg}
              borderRadius='full'
              margin='0 auto'
              mb='4'
              transition='background 0.3s'
            >
              <Icon fontSize='32px' color={feature.iconColor}>
                <feature.icon />
              </Icon>
            </Center>

            <Text fontSize='lg' fontWeight='bold'>
              {feature.title}
            </Text>
            <Text mt='2' fontSize='sm' color='gray.600'>
              {feature.description}
            </Text>
          </Box>
        ))}
      </Flex>
    </Box>
  )
}
