import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { Button } from 'src/components/ui/button'
import { imgResLog } from 'src/assets/images'
import styles from './register.module.scss'
import { useRegister } from 'src/hooks/useAuth'

interface FormValues {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
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

interface RegisterError {
  type: 'validation' | 'general'
  errors?: ValidationError
  message?: string
}

const Register: React.FC = () => {
  const registerMutation = useRegister()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const isLoading = registerMutation.isPending

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    getValues,
    clearErrors,
    setError
  } = useForm<FormValues>()

  const onSubmit = async (data: FormValues) => {
    setErrorMessage(null)
    clearErrors()
    
    const { confirm_password, ...registerData } = data
    
    try {
      await registerMutation.mutateAsync(registerData)
    } catch (error: unknown) {
      const registerError = error as RegisterError
      if (registerError.type === 'validation' && registerError.errors) {
        // Xử lý lỗi validation cho từng field
        Object.entries(registerError.errors).forEach(([field, errorData]) => {
          setError(field as keyof FormValues, {
            type: 'server',
            message: errorData.msg
          })
        })
      } else if (registerError.type === 'general' && registerError.message) {
        // Lỗi chung
        setErrorMessage(registerError.message)
      }
    }
  }

  const handleInputChange = (field: keyof FormValues) => {
    setErrorMessage(null)
    clearErrors(field)
  }

  return (
    <div className={styles.container}>
      <div className={styles.imageSection}>
        <img src={imgResLog} alt='Shopping and phone' style={{ maxWidth: '100%', height: 'auto' }} />
      </div>
      <div className={styles.formSection}>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <h2>Create an account</h2>
          <p>Enter your details below</p>
          
          <div className={styles.inputGroup}>
            <input
              type='text'
              placeholder='Name'
              className={styles.inputField}
              {...formRegister('name', {
                required: 'Name is required'
              })}
              onChange={() => handleInputChange('name')}
            />
            <div className={styles.errorMessage}>
              {errors.name && <span className={styles.error}>{errors.name.message}</span>}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <input
              type='email'
              placeholder='Email'
              className={styles.inputField}
              {...formRegister('email', {
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

          <div className={styles.inputGroup}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              className={styles.inputField}
              {...formRegister('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              onChange={() => handleInputChange('password')}
            />
            <div className={styles.icon} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
            <div className={styles.errorMessage}>
              {errors.password && <span className={styles.error}>{errors.password.message}</span>}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder='Confirm Password'
              className={styles.inputField}
              {...formRegister('confirm_password', {
                required: 'Please confirm your password',
                validate: (value) => value === getValues('password') || 'Passwords do not match'
              })}
              onChange={() => handleInputChange('confirm_password')}
            />
            <div className={styles.icon} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
            <div className={styles.errorMessage}>
              {errors.confirm_password && <span className={styles.error}>{errors.confirm_password.message}</span>}
            </div>
          </div>

          {/* General Error Message */}
          <div className={styles.errorMessage}>
            {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>}
          </div>

          <button type='submit' className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>

          <button type='button' className={styles.googleButton}>
            Sign up with Google
          </button>

          <p className={styles.link}>
            Already have an account?{' '}
            <span className={styles.login}>
              <Link to='/login'>Log in</Link>
            </span>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Register
