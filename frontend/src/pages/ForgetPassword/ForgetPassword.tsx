import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Box, Button, Input, Heading, Text } from '@chakra-ui/react';
import { SkeletonText } from 'src/components/ui/skeleton';
import http from 'src/utils/http';

interface ForgetPasswordFormInputs {
  email: string;
}

const ForgetPassword: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ForgetPasswordFormInputs>();

  const [apiError, setApiError] = useState<string | null>(null); 
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<ForgetPasswordFormInputs> = async (data) => {
    setLoading(true); 
    try {
      
      setApiError(null);
      setSuccessMessage(null);

 
      const response = await http.post('auth/forgot-password', {
        email: data.email,
      });
      setSuccessMessage(response.data.message);
    } catch (error: any) {
      console.error('Error:', error);

      if (error?.response?.data?.message) {
        setApiError(error?.response?.data?.message);
      } else {
        setApiError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false); 
    }
  };

  const handleEmailChange = () => {
    setApiError(null);
    setSuccessMessage(null);
  };

  return (
    <Box maxW="md" mx="auto" mt="50px" mb="50px" p={5} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <Heading as="h2" size="lg" textAlign="center" mb={6}>
        Forget Password Form
      </Heading>

      {loading ? (
        // Hiển thị SkeletonText khi đang tải
        <SkeletonText noOfLines={4} />
      ) : (
        <>
          {!successMessage && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box>
                <label htmlFor="email">
                  <Text fontSize="md" mb={2} fontWeight="bold">
                    Email
                  </Text>
                </label>
                <Input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email address',
                    },
                  })}
                  onChange={handleEmailChange}
                />
                <Box minHeight="1.5rem">
                  {errors.email && (
                    <Text color="red.500" fontSize="sm" marginTop="5px">
                      {errors.email.message}
                    </Text>
                  )}
                  {apiError && (
                    <Text color="red.500" fontSize="sm" marginTop="5px">
                      {apiError}
                    </Text>
                  )}
                </Box>
              </Box>
              <Button mt="20px" colorScheme="" type="submit" width="full" backgroundColor="rgba(255, 69, 0, 0.7804);">
                Submit
              </Button>
            </form>
          )}
          {successMessage && (
            <Text color="green.600" fontSize="xl" textAlign="center" marginTop="20px">
              {successMessage}
            </Text>
          )}
        </>
      )}
    </Box>
  );
};

export default ForgetPassword;
