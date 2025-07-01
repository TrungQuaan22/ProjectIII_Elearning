import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi'
import { useQueryClient } from '@tanstack/react-query'

export default function PaymentCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const vnpParams = Object.fromEntries(searchParams.entries())
        console.log('VNPay callback params:', vnpParams)

        // Call backend to verify payment
        const apiUrl = `/api/payments/vnpay/callback?${searchParams.toString()}`
        console.log('Calling API:', apiUrl)

        const response = await fetch(apiUrl)
        console.log('Response status:', response.status)
        console.log('Response headers:', response.headers)

        const result = await response.json()
        console.log('API response:', result)

        if (result.success) {
          setStatus('success')
          setMessage('Thanh toán thành công! Bạn đã được đăng ký khóa học.')
          toast.success('Thanh toán thành công!')

          // Invalidate enrollments to refresh data
          queryClient.invalidateQueries({ queryKey: ['enrollments'] })

          // Redirect to enrollments after 3 seconds
          setTimeout(() => {
            navigate('/enrollments')
          }, 3000)
        } else {
          setStatus('failed')
          setMessage(`Thanh toán thất bại: ${result.message || 'Vui lòng thử lại.'}`)
          toast.error('Thanh toán thất bại!')
        }
      } catch (error) {
        console.error('Payment callback error:', error)
        setStatus('failed')
        setMessage('Có lỗi xảy ra khi xử lý thanh toán.')
        toast.error('Có lỗi xảy ra khi xử lý thanh toán!')
      }
    }

    handleCallback()
  }, [searchParams, navigate, queryClient])

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <FiLoader className='animate-spin text-blue-500' />
      case 'success':
        return <FiCheckCircle className='text-green-500' />
      case 'failed':
        return <FiXCircle className='text-red-500' />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'text-blue-600'
      case 'success':
        return 'text-green-600'
      case 'failed':
        return 'text-red-600'
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
      <div className='bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center'>
        <div className='flex justify-center mb-4'>
          <div className='text-6xl'>{getStatusIcon()}</div>
        </div>

        <h1 className={`text-2xl font-bold mb-4 ${getStatusColor()}`}>
          {status === 'loading' && 'Đang xử lý thanh toán...'}
          {status === 'success' && 'Thanh toán thành công!'}
          {status === 'failed' && 'Thanh toán thất bại!'}
        </h1>

        <p className='text-gray-600 mb-6'>{message}</p>

        {status === 'success' && (
          <div className='mb-6'>
            <p className='text-sm text-gray-500'>
              Bạn sẽ được chuyển hướng đến trang khóa học đã đăng ký trong vài giây...
            </p>
          </div>
        )}

        <div className='space-y-3'>
          <button
            onClick={() => navigate('/enrollments')}
            className='w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
          >
            Xem khóa học đã đăng ký
          </button>

          <button
            onClick={() => navigate('/courses')}
            className='w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50'
          >
            Khám phá thêm khóa học
          </button>
        </div>
      </div>
    </div>
  )
}
