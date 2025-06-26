// import { AuthResponse } from 'src/types/auth.type'
// import http from 'src/utils/http'

// export const URL_LOGIN = 'login'
// export const URL_REGISTER = 'register'
// export const URL_LOGOUT = 'logout'
// export const URL_REFRESH_TOKEN = 'refresh-access-token'

// const authApi = {
//   registerAccount(body: { email: string; password: string }) {
//     return http.post<AuthResponse>(URL_REGISTER, body)
//   },
//   login(body: { email: string; password: string }) {
//     return http.post<AuthResponse>(URL_LOGIN, body)
//   },
//   logout() {
//     return http.post(URL_LOGOUT)
//   }
// }

// export default authApi

import http from 'src/utils/http'
import { UserType } from 'src/types/user.type'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  date_of_birth: string
}

export interface AuthResponse {
  message: string
  data: {
    access_token: string
    user: UserType
  }
}

export const authApi = {
  login(body: LoginRequest) {
    return http.post<AuthResponse>('users/login', body)
  },
  register(body: RegisterRequest) {
    return http.post<AuthResponse>('users/register', body)
  },
  logout() {
    return http.post('users/logout')
  },
  getProfile() {
    return http.get<{ user: UserType }>('users/my-profile')
  }
}
