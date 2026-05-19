import { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as loginRequest } from '../api/authApi'
import { saveAuthData, removeAuthData, getToken, getUser } from '../utils/tokenStorage'
import { getDashboardPath } from '../utils/roleRedirect'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
  const [token, setToken] = useState(getToken)
  const [user, setUser] = useState(getUser)
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getToken()))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setIsAuthenticated(Boolean(token))
  }, [token])

  const login = async (credentials) => {
    setLoading(true)
    setError(null)
    try {
      // Backend wraps response as: { status, message, data: LoginResponseDTO }
      // LoginResponseDTO is flat: { token, userId, name, email, role, status, citizenProfileCompleted }
      const response = await loginRequest(credentials)
      const loginData = response?.data  // this is the flat LoginResponseDTO

      if (!loginData?.token) throw new Error('No token received from server')
      if (!loginData?.role) throw new Error('No role received from server')

      // Store the whole loginData as "user" — it has userId, name, email, role, status
      saveAuthData({ token: loginData.token, user: loginData })
      setToken(loginData.token)
      setUser(loginData)
      setIsAuthenticated(true)
      navigate(getDashboardPath(loginData.role))
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Login failed'
      setError(msg)
      removeAuthData()
      setToken(null)
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    removeAuthData()
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
