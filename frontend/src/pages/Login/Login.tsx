import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import styles from './login.module.scss'
import { imgResLog } from 'src/assets/images'
import { Link } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { Button } from 'src/components/ui/button'
import { useLogin } from 'src/hooks/useAuth'

interface FormValues {
  email: string
  password: string
}

interface ValidationError {
  [key: string]: {
    type: string
    value: string
    msg: string
    path: string
    location: string
  }
}

interface LoginError {
  type: 'validation' | 'general'
  errors?: ValidationError
  message?: string
}

const Login: React.FC = () => {
  const loginMutation = useLogin()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const isLoading = loginMutation.isPending

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setError
  } = useForm<FormValues>({
    mode: 'onChange' // Kiểm tra lỗi ngay khi người dùng nhập
  })

  const onSubmit = async (data: FormValues) => {
    setErrorMessage(null)
    clearErrors()

    try {
      await loginMutation.mutateAsync(data)
    } catch (error: unknown) {
      const loginError = error as LoginError
      if (loginError.type === 'validation' && loginError.errors) {
        // Xử lý lỗi validation cho từng field
        // Set lỗi cho từng field trong react-hook-form
        Object.entries(loginError.errors).forEach(([field, errorData]) => {
          setError(field as keyof FormValues, {
            type: 'server',
            message: errorData.msg
          })
        })
      } else if (loginError.type === 'general' && loginError.message) {
        // Lỗi chung như "Email or password is incorrect"
        setErrorMessage(loginError.message)
      }
    }
  }

  const handleInputChange = (field: keyof FormValues) => {
    setErrorMessage(null)
    clearErrors(field)
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className={styles.container}>
      <div className={styles.imageSection}>
        <img src={imgResLog} alt='Shopping and phone' style={{ maxWidth: '100%', height: 'auto' }} />
      </div>
      <div className={styles.formSection}>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <h2>Log in to Exclusive</h2>
          <p>Enter your details below</p>

          {/* Email Field */}
          <div className={styles.inputGroup}>
            <input
              type='email'
              placeholder='Email'
              className={styles.inputField}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email format'
                }
              })}
              onChange={() => handleInputChange('email')}
            />
            <div className={styles.errorMessage}>
              {errors.email && <span className={styles.error}>{errors.email.message}</span>}
            </div>
          </div>

          {/* Password Field */}
          <div className={styles.inputGroup}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              className={styles.inputField}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              onChange={() => handleInputChange('password')}
            />
            <div className={styles.errorMessage}>
              {errors.password && <span className={styles.error}>{errors.password.message}</span>}
            </div>
            {/* Show/hide password */}
            <span className={styles.eyeIcon} onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* General Error Message */}
          <div className={styles.errorMessage}>
            {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>}
          </div>

          <div className={styles.forgetPassword}>
            <Link className={styles.forgetText} to='/forget-password'>
              Forget Password?
            </Link>
          </div>

          {/* Submit Button */}
          <Button type='submit' loading={isLoading} loadingText='Signing In' className={styles.submitButton}>
            Sign In
          </Button>

          <button type='button' className={styles.googleButton}>
            Sign up with Google
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
