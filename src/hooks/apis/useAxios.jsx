import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '@/lib/utils'

const URL = import.meta.env.VITE_APP_BACKEND_URL

const axiosSecure = axios.create({
  baseURL: URL,
})

const axiosPublic = axios.create({
  baseURL: URL,
})

// Secure hook for requests that need authentication
export const useAxiosSecure = () => {
  const { logOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const reqInterceptor = axiosSecure.interceptors.request.use((config) => {
      const token = localStorage.getItem('token')
      console.log('token', token)
      config.headers.authorization = `Bearer ${token}`
      return config
    })

    return () => {
      axiosSecure.interceptors.request.eject(reqInterceptor)
    }
  }, [])

  useEffect(() => {
    const resInterceptor = axiosSecure.interceptors.response.use(
      (res) => res,
      async (error) => {
        const status = error.response?.status
        if (status === 401 || status === 403) {
          // await logOut()
          navigate('/signin')
        }
        return Promise.reject(error)
      }
    )

    return () => {
      axiosSecure.interceptors.response.eject(resInterceptor)
    }
  }, [logOut, navigate])

  return axiosSecure
}

// Public hook for requests that don't need authentication
export const useAxiosPublic = () => {
  useEffect(() => {
    const reqInterceptor = axiosPublic.interceptors.request.use((config) => {
      console.log('Public request:', config)
      return config
    })

    return () => {
      axiosPublic.interceptors.request.eject(reqInterceptor)
    }
  }, [])

  return axiosPublic
}
