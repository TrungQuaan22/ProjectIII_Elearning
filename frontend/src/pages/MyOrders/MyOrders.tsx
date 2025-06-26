import React from 'react'
import { Box, Text, Stack, Table, Image, Button } from '@chakra-ui/react'
import { BreadcrumbCurrentLink, BreadcrumbLink, BreadcrumbRoot } from 'src/components/ui/breadcrumb'
import styles from './MyOrders.module.scss'


export default function MyOrders() {
  return (
     <Box padding='50px 155px'>
          {/* breadcrumb */}
          <Box width='full' maxWidth='container.md' mb={8}>
            <BreadcrumbRoot>
              <BreadcrumbLink href='#'>Home</BreadcrumbLink>
              <BreadcrumbCurrentLink>My Orders</BreadcrumbCurrentLink>
            </BreadcrumbRoot>
          </Box>
          <Text>My Orders</Text>

          <Box className={styles.ordersContainer}>
            <Box className={styles.ordersHeader}>
                <p>ID</p>
                <p>Số lượng</p>
                <p>Ngày mượn</p>
                <p>Trạng thái</p>
            </Box>
            <Box className={styles.ordersRow}>
                
            </Box>
          </Box>
    </Box>
  )
}
