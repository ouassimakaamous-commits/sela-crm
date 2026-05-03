import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, ProtectedRoute } from './context/AuthContext'
import { LogoProvider } from './context/LogoContext'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Formateurs from './pages/Formateurs'
import Apprenants from './pages/Apprenants'
import Sessions from './pages/Sessions'
import HeuresSup from './pages/HeuresSup'
import Documents from './pages/Documents'
import Finances from './pages/Finances'
import Rapports from './pages/Rapports'
import Parametres from './pages/Parametres'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LogoProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
            <Route path="/formateurs" element={<ProtectedRoute><Layout><Formateurs /></Layout></ProtectedRoute>} />
            <Route path="/apprenants" element={<ProtectedRoute><Layout><Apprenants /></Layout></ProtectedRoute>} />
            <Route path="/sessions" element={<ProtectedRoute><Layout><Sessions /></Layout></ProtectedRoute>} />
            <Route path="/heures-sup" element={<ProtectedRoute><Layout><HeuresSup /></Layout></ProtectedRoute>} />
            <Route path="/documents" element={<ProtectedRoute><Layout><Documents /></Layout></ProtectedRoute>} />
            <Route path="/finances" element={<ProtectedRoute><Layout><Finances /></Layout></ProtectedRoute>} />
            <Route path="/rapports" element={<ProtectedRoute><Layout><Rapports /></Layout></ProtectedRoute>} />
            <Route path="/parametres" element={<ProtectedRoute><Layout><Parametres /></Layout></ProtectedRoute>} />
          </Routes>
        </LogoProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
