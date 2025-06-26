import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authApi, LoginRequest, RegisterRequest } from 'src/apis/auth.api'
import { useAppContext } from './useAppContext'
import { setAccessTokenToLS, setProfileToLS, getReturnUrlFromQuery } from 'src/utils/auth'

// Interface cho lỗi validation từ API
interface ValidationError {
  [key: string]: {
    type: string
    value: string
    msg: string
    path: string
    location: string
  }
}

export const useLogin = () => {
  const { login } = useAppContext()

  return useMutation({
    mutationFn: (body: LoginRequest) => authApi.login(body),
    onSuccess: (response) => {
      const { access_token, user } = response.data.data

      // Save to localStorage
      setAccessTokenToLS(access_token)
      setProfileToLS(user)

      // Update context state
      login(access_token, user)

      // Show success message
      toast.success(response.data.message || 'Login successful!')

      // Navigate to return URL from query parameters or home
      const returnUrl = getReturnUrlFromQuery()
      console.log('Current URL:', window.location.href)
      console.log('Return URL:', returnUrl)
      console.log('Query params:', window.location.search)

      // Use window.location.replace for more reliable redirect
      window.location.replace(returnUrl)
    },
    onError: (error: unknown) => {
      // Xử lý lỗi validation
      const axiosError = error as { response?: { data?: unknown } }
      if (axiosError.response?.data && typeof axiosError.response.data === 'object') {
        const validationErrors = axiosError.response.data as ValidationError

        // Kiểm tra nếu có lỗi validation cho từng field
        if (validationErrors.email || validationErrors.password) {
          // Trả về lỗi validation để component xử lý
          throw {
            type: 'validation',
            errors: validationErrors
          }
        }
      }

      // Lỗi chung
      const message = (axiosError.response?.data as { message?: string })?.message || 'Login failed'
      toast.error(message)
      throw {
        type: 'general',
        message
      }
    }
  })
}

export const useRegister = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (body: RegisterRequest) => authApi.register(body),
    onSuccess: (response) => {
      toast.success(response.data.message || 'Registration successful! Please log in.')
      navigate('/login')
    },
    onError: (error: unknown) => {
      // Xử lý lỗi validation
      const axiosError = error as { response?: { data?: unknown } }
      if (axiosError.response?.data && typeof axiosError.response.data === 'object') {
        const validationErrors = axiosError.response.data as ValidationError

        // Kiểm tra nếu có lỗi validation cho từng field
        if (Object.keys(validationErrors).length > 0) {
          // Trả về lỗi validation để component xử lý
          throw {
            type: 'validation',
            errors: validationErrors
          }
        }
      }

      // Lỗi chung
      const message = (axiosError.response?.data as { message?: string })?.message || 'Registration failed'
      toast.error(message)
      throw {
        type: 'general',
        message
      }
    }
  })
}

export const useLogout = () => {
  const navigate = useNavigate()
  const { logout } = useAppContext()

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: (response) => {
      // Clear context state and localStorage
      logout()

      // Show success message
      toast.success(response.data?.message || 'Logout successful!')

      // Navigate to login
      navigate('/login')
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } }
      const message = axiosError.response?.data?.message || 'Logout failed'
      toast.error(message)

      // Even if logout API fails, clear local state
      logout()
      navigate('/login')
    }
  })
}

export const useGetProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => authApi.getProfile(),
    select: (data) => data.data.user,
    enabled: !!localStorage.getItem('access_token'),
    onError: (error: Error) => {
      console.error('Get profile error:', error)
      toast.error('Có lỗi xảy ra khi tải thông tin người dùng. Vui lòng thử lại!')
    }
  })
}
