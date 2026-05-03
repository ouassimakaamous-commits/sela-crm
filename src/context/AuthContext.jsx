import { createContext, useContext, useState } from 'react'
import { Navigate } from 'react-router-dom'

export const ROLES = {
  ADMIN: 'admin',
  APPRENANT: 'apprenant',
  FORMATEUR: 'formateur',
}

const USERS = {
  'admin@centresela.ma': {
    password: 'SelaAdmin2026!',
    role: ROLES.ADMIN,
    name: 'Administrateur SELA',
  },
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const s = localStorage.getItem('sela_auth')
      return s ? JSON.parse(s) : null
    } catch { return null }
  })

  const login = (email, password) => {
    const cred = USERS[email.toLowerCase().trim()]
    if (!cred || cred.password !== password) {
      throw new Error('Email ou mot de passe incorrect')
    }
    const userData = { email, role: cred.role, name: cred.name }
    localStorage.setItem('sela_auth', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const logout = () => {
    localStorage.removeItem('sela_auth')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, ROLES }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

export function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/dashboard" replace />
  return children
}
