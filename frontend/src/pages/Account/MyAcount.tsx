import React, { useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { BreadcrumbCurrentLink, BreadcrumbLink, BreadcrumbRoot } from 'src/components/ui/breadcrumb';
import { Link } from 'react-router-dom';
// import ChangePassword from './ChangePassword/ChangePassword';
// import ChangeProfile from './ChangeProfile/ChangeProfile';  // eslint-disable-line @typescript-eslint/no-unused-vars

export default function MyAcount() {
  const [isEditInfo, setEditInfo] = useState<null | 'profile' | 'password'>('profile');

  const handleCancel = () => {
    setEditInfo(null);
  };

  return (
    <Flex justifyContent="center">
      <Box padding="50px 0px" minWidth="1260px">
        {/* breadcrumb */}
        <Flex justifyContent="space-between">
          <Box maxWidth="container.md" mb={8}>
            <BreadcrumbRoot>
              <BreadcrumbLink href="#">Home</BreadcrumbLink>
              <BreadcrumbCurrentLink>My Account</BreadcrumbCurrentLink>
            </BreadcrumbRoot>
          </Box>
          <Text>Welcome! Alan</Text>
        </Flex>
        <Flex mt="50px">
          {/* sidebar */}
          <Flex direction="column" gap="20px" width="300px" height="600px">
            <Box>
              <Link to="#">
                <Text fontWeight={500}>Manage My Account</Text>
              </Link>
              <Flex direction="column" padding="10px 50px" gap="10px">
                <Text
                  onClick={() => setEditInfo('profile')}
                  cursor="pointer"
                  style={{ color: isEditInfo === 'profile' ? 'rgba(255, 69, 0, 0.78)' : 'black' }}
                >
                  My Profile
                </Text>
                <Text
                  cursor="pointer"
                  onClick={() => setEditInfo('password')}
                  style={{ color: isEditInfo === 'password' ? 'rgba(255, 69, 0, 0.78)' : 'black' }}
                >
                  Change Password
                </Text>
              </Flex>
            </Box>
            <Link to="/my-orders">
              <Text fontWeight={500}>My Orders</Text>
            </Link>
            <Link to="/wishlist">
              <Text fontWeight={500}>My WishList</Text>
            </Link>
          </Flex>
          {/* main-content */}
          <Box flex={1} padding="50px 80px" boxShadow="0px 1px 13px 0px rgba(0, 0, 0, 0.05)">
            {/* {isEditInfo === 'profile' && <ChangeProfile onCancel={handleCancel} />} */}
            {/* {isEditInfo === 'password' && <ChangePassword onCancel={handleCancel} />} */}
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}
