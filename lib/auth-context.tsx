'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase, UserData } from './supabase'

interface AuthContextType {
  user: UserData | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in (from session storage)
    const checkAuth = async () => {
      const stored = localStorage.getItem('judol_user')
      if (stored) {
        try {
          setUser(JSON.parse(stored))
        } catch (e) {
          localStorage.removeItem('judol_user')
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, message: data.message || 'Login gagal' }
      }

      setUser(data.user)
      localStorage.setItem('judol_user', JSON.stringify(data.user))
      return { success: true, message: 'Login berhasil' }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: 'Terjadi kesalahan' }
    }
  }

  const logout = async () => {
    setUser(null)
    localStorage.removeItem('judol_user')
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
