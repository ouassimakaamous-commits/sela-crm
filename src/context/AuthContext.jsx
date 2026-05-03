import { createContext, useContext, useState } from 'react'
import { Navigate } from 'react-router-dom'

export const ROLES = {
  ADMIN:     'admin',
  FORMATEUR: 'formateur',
  APPRENANT: 'apprenant',
}

const STORAGE_KEY = 'sela_users'

const SEED_USERS = [
  { id: 0, email: 'admin@centresela.ma', password: 'SelaAdmin2026!', role: ROLES.ADMIN, name: 'Administrateur', statut: 'Actif' },
]

function getStoredUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : SEED_USERS
  } catch { return SEED_USERS }
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
    const normalized = email.toLowerCase().trim()
    const users = getStoredUsers()
    const found = users.find(u =>
      u.email.toLowerCase() === normalized &&
      u.password === password &&
      u.statut !== 'Inactif'
    )
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

export function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" replace />
  return children
}
