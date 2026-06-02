import { useState, useEffect, useCallback } from 'react'

export function useAuth() {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('admin_token')
  )

  const isLoggedIn = !!token

  const login = useCallback((newToken: string) => {
    localStorage.setItem('admin_token', newToken)
    setToken(newToken)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('admin_token')
    setToken(null)
  }, [])

  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem('admin_token'))
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  return { token, isLoggedIn, login, logout }
}
