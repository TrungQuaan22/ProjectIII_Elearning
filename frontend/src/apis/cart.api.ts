import http from 'src/utils/http'
import { CartResponse } from 'src/types/cart.type'

export const addToCart = async (course_id: string) => {
  const response = await http.post('/cart/add', { course_id })
  return response.data
}

export const getCart = async (): Promise<CartResponse> => {
  const response = await http.get('/cart')
  return response.data
}

export const removeFromCart = async (course_id: string) => {
  const response = await http.post(`/cart/remove`, { course_id })
  return response.data
}

export const clearCart = async () => {
  const response = await http.delete('/cart/clear')
  return response.data
}
