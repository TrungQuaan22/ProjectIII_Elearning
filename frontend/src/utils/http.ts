import axios, { AxiosInstance } from 'axios'
import { getAccessTokenFromLS, clearLS } from './auth'

class Http {
  instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: 'http://localhost:8000/api',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    //Request
    this.instance.interceptors.request.use((config) => {
      const token = getAccessTokenFromLS()
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    //Response
    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (!error.response) {
          console.error('Network or server error', error)
          return Promise.reject('Network error, please try again later.')
        }

        const { status } = error.response

        if (status === 401) {
          clearLS()
        }

        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance
export default http
