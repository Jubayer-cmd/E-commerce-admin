import { createContext, useState, useEffect } from 'react'
import axios from 'axios'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialize authentication state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const { data } = await axios.get(
            'http://localhost:9000/api/v1/auth/me',
            {
              headers: { authorization: `Bearer ${token}` },
            }
          )
          setUser(data.data) // Set the user after fetching from the 'me' endpoint
        } catch (error) {
          // Remove token if error occurs (invalid/expired token)
          console.log(error)
          localStorage.removeItem('token')
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const handleAuth = async (url, credentials) => {
    try {
      setLoading(true)
      const { data } = await axios.post(url, credentials)
      const { token } = data
      localStorage.setItem('token', token)

      // Fetch user data after successful login/signup
      const { data: userData } = await axios.get(
        'http://localhost:9000/api/v1/auth/me',
        {
          headers: { authorization: `Bearer ${token}` },
        }
      )
      setUser(userData.data) // Set the user after fetching from 'me' endpoint
      return { success: true }
    } catch (error) {
      console.error('Authentication failed:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      }
    } finally {
      setLoading(false)
    }
  }

  const login = (email, password) =>
    handleAuth('http://localhost:9000/api/v1/auth/login', { email, password })

  const register = (data) =>
    handleAuth('http://localhost:9000/api/v1/auth/signup', data)

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const isAuthenticated = () => !!user

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isAuthenticated, loading }}
    >
      {children}
    </AuthContext.Provider>
  )
}
