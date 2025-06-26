import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Input, Heading, Text } from '@chakra-ui/react';
import http from 'src/utils/http';

const ResetPassword: React.FC = () => {
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await http.post(`auth/reset-password/${token}`, {
        password: newPassword,
      });

      if (response.data.status === 'success') {
        setSuccessMessage('Password reset successful!');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <Box maxW="md" mx="auto" mt="50px" mb="50px" p={5} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <Heading as="h2" size="lg" textAlign="center" mb={6}>
        Reset Password
      </Heading>

      <Box>
        <Text fontSize="md" mb={2} fontWeight="bold">
          New Password
        </Text>
        <Input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          mb={4}
        />
        <Text fontSize="md" mb={2} fontWeight="bold">
          Confirm Password
        </Text>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          mb={4}
        />
        {error && <Text color="red.500" fontSize="sm" marginTop="5px">{error}</Text>}
        {successMessage && <Text color="green.500" fontSize="sm" marginTop="5px">{successMessage}</Text>}

        <Button
          colorScheme="orange"
          onClick={handleResetPassword}
          width="full"
          mt={4}
        >
          Reset Password
        </Button>
      </Box>
    </Box>
  );
};

export default ResetPassword;
