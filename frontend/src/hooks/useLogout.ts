import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authApi } from 'src/apis/auth.api'
import { useAppContext } from './useAppContext'

export const useLogoutWithAPI = () => {
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
