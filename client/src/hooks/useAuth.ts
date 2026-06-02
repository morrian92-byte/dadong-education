import { useState, useEffect, useCallback } from 'react'
import type { UserInfo } from '../types'

function loadUser(): UserInfo | null {
  try {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function useAuth() {
  const [user, setUser] = useState<UserInfo | null>(loadUser)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))

  const isLoggedIn = !!token && !!user
  const isStudent = user?.role === 'student'
  const isTeacher = user?.role === 'teacher'
  const isAdmin = user?.role === 'admin'

  const login = useCallback((newToken: string, userInfo: UserInfo) => {
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(userInfo))
    setToken(newToken)
    setUser(userInfo)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }, [])

  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem('token'))
      setUser(loadUser())
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  return { user, token, isLoggedIn, isStudent, isTeacher, isAdmin, login, logout }
}
