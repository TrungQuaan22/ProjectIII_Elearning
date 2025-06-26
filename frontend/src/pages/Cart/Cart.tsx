import React, { useEffect } from 'react'
import { Box, Button, Flex } from '@chakra-ui/react'
import { BreadcrumbCurrentLink, BreadcrumbLink, BreadcrumbRoot } from 'src/components/ui/breadcrumb'
import { FiTrash } from 'react-icons/fi'
import styles from './Cart.module.scss'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCart, removeFromCart } from 'src/apis/cart.api'
import { CartItem } from 'src/types/cart.type'
import { formatCurrency } from 'src/utils/utils'

export default function Cart() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Fetch cart data
  const {
    data: cartResponse,
    isLoading,
    error
  } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
    staleTime: 5 * 60 * 1000 // 5 minutes
  })

  useEffect(() => {
    if (error) {
      console.error('Fetch cart error:', error)
      toast.error('Có lỗi xảy ra khi tải giỏ hàng. Vui lòng thử lại!')
    }
  }, [error])

  const cartItems: CartItem[] = cartResponse?.data || []

  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => total + (item.course.price || 0), 0)

  // Remove item mutation
  const removeMutation = useMutation({
    mutationFn: (course_id: string) => removeFromCart(course_id),
    onSuccess: () => {
      toast.success('Item removed from cart successfully')
      // Refetch cart data
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Failed to remove item from cart')
    }
  })

  const handleRemoveItem = (course_id: string) => {
    removeMutation.mutate(course_id)
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty')
      return
    }
    navigate('/checkout')
  }

  return (
    <Flex justify={'center'}>
      <Box padding='50px 0px' width='1260px'>
        <Box width='full' maxWidth='container.md' mb={8}>
          <BreadcrumbRoot>
            <BreadcrumbLink href='/'>Home</BreadcrumbLink>
            <BreadcrumbCurrentLink>Cart</BreadcrumbCurrentLink>
          </BreadcrumbRoot>
        </Box>

        <div className={styles['cart-container']}>
          <div className={styles['cart-header']}>
            <p style={{ width: '240px' }}>Course</p>
            <p>Price</p>
            <p style={{ width: '100px' }}>Actions</p>
          </div>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p>Loading cart...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p>Your cart is empty</p>
              <Button onClick={() => navigate('/courses')} colorScheme='blue' mt={4}>
                Browse Courses
              </Button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div className={styles['cart-row']} key={item.course_id}>
                <div className={styles['product-info']}>
                  <div className={styles['product-img']}>
                    <img src={item.course.thumbnail} alt={item.course.title} />
                  </div>
                  <p>{item.course.title}</p>
                </div>
                <div className='text-xl font-thin text-black-500'>
                  <p>{formatCurrency(item.course.price)}</p>
                </div>
                <div className='flex items-center justify-center'>
                  <button
                    className='bg-blue-500 text-white p-2 rounded-md mr-10'
                    onClick={() => handleRemoveItem(item.course_id)}
                    disabled={removeMutation.isPending}
                    title='Remove from cart'
                  >
                    <FiTrash />
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Subtotal Section */}
          {cartItems.length > 0 && (
            <div className='mt-8 p-6 bg-gray-50 rounded-lg'>
              <div className='flex justify-between items-center mb-4'>
                <span className='text-lg font-semibold text-gray-700'>Subtotal:</span>
                <span className='text-2xl font-bold text-blue-600'>{formatCurrency(subtotal)}</span>
              </div>
              <div className='text-sm text-gray-500 mb-6'>Total items: {cartItems.length}</div>

              {/* Balanced Buttons */}
              <div className='flex gap-20 w-full justify-end'>
                <button
                  className='max-w-sm bg-gray-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 ease-in-out duration-300'
                  onClick={() => navigate('/courses')}
                >
                  Continue Shopping
                </button>
                <button
                  onClick={handleCheckout}
                  className='max-w-sm bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 ease-in-out duration-300'
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}

          {/* Show Continue Shopping button when cart is empty */}
          {cartItems.length === 0 && !isLoading && (
            <div className='mt-8 text-center'>
              <button
                className='bg-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600 ease-in-out duration-300'
                onClick={() => navigate('/courses')}
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </Box>
    </Flex>
  )
}
