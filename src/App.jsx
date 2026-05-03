import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, ProtectedRoute } from './context/AuthContext'
import { LogoProvider } from './context/LogoContext'
import { StoreProvider } from './context/StoreContext'
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
import Utilisateurs from './pages/Utilisateurs'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LogoProvider>
          <StoreProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3500,
                style: {
                  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                  fontSize: '13px',
                  borderRadius: '14px',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                },
                success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
                error:   { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
              }}
            />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard"   element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
              <Route path="/formateurs"  element={<ProtectedRoute><Layout><Formateurs /></Layout></ProtectedRoute>} />
              <Route path="/apprenants"  element={<ProtectedRoute><Layout><Apprenants /></Layout></ProtectedRoute>} />
              <Route path="/sessions"    element={<ProtectedRoute><Layout><Sessions /></Layout></ProtectedRoute>} />
              <Route path="/heures-sup"  element={<ProtectedRoute><Layout><HeuresSup /></Layout></ProtectedRoute>} />
              <Route path="/documents"   element={<ProtectedRoute><Layout><Documents /></Layout></ProtectedRoute>} />
              <Route path="/finances"    element={<ProtectedRoute><Layout><Finances /></Layout></ProtectedRoute>} />
              <Route path="/rapports"    element={<ProtectedRoute><Layout><Rapports /></Layout></ProtectedRoute>} />
              <Route path="/parametres"  element={<ProtectedRoute><Layout><Parametres /></Layout></ProtectedRoute>} />
              <Route path="/utilisateurs" element={<ProtectedRoute><Layout><Utilisateurs /></Layout></ProtectedRoute>} />
            </Routes>
          </StoreProvider>
        </LogoProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
