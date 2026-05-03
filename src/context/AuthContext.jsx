import { createContext, useContext, useState } from 'react'
import { Navigate } from 'react-router-dom'

export const ROLES = {
  ADMIN: 'admin',
  APPRENANT: 'apprenant',
  FORMATEUR: 'formateur',
}

const USERS = [
  {
    email: 'admin@centresela.ma',
    password: 'SelaAdmin2026!',
    role: ROLES.ADMIN,
    name: 'Administrateur',
  },
]

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const s = localStorage.getItem('sela_auth')
      return s ? JSON.parse(s) : null
    } catch { return null }
  })

  const login = (email, password) => {
    const normalized = email.toLowerCase().trim()
    const found = USERS.find(u => u.email === normalized && u.password === password)
    if (!found) return { success: false }
    const userData = { email: found.email, role: found.role, name: found.name, loggedAt: Date.now() }
    localStorage.setItem('sela_auth', JSON.stringify(userData))
    setUser(userData)
    return { success: true }
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
