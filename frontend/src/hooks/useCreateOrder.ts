import { createOrder, createVNPayPayment } from "src/apis/courses.api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"

export const useCreateOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (courseIds: string[]) => createOrder(courseIds),
    onSuccess: async (orderResult: {
      order_id: string
      total_amount: number
      courses: Array<{ _id: string; title: string; price: number }>
    }) => {
      try {
        // Create VNPay payment
        const paymentResult = await createVNPayPayment(orderResult.order_id)

        // Invalidate cart and enrollments to refresh data
        queryClient.invalidateQueries({ queryKey: ['cart'] })
        queryClient.invalidateQueries({ queryKey: ['enrollments'] })

        // Redirect to VNPay
        window.location.href = paymentResult.payment_url
      } catch (error) {
        console.error('Payment creation error:', error)
        toast.error('Có lỗi xảy ra khi tạo thanh toán. Vui lòng thử lại!')
      }
    },
    onError: (error: unknown) => {
      console.error('Order creation error:', error)
      toast.error('Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại!')
    }
  })
}
