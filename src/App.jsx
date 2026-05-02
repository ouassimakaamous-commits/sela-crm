import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
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
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/formateurs" element={<Layout><Formateurs /></Layout>} />
        <Route path="/apprenants" element={<Layout><Apprenants /></Layout>} />
        <Route path="/sessions" element={<Layout><Sessions /></Layout>} />
        <Route path="/heures-sup" element={<Layout><HeuresSup /></Layout>} />
        <Route path="/documents" element={<Layout><Documents /></Layout>} />
        <Route path="/finances" element={<Layout><Finances /></Layout>} />
        <Route path="/rapports" element={<Layout><Rapports /></Layout>} />
        <Route path="/parametres" element={<Layout><Parametres /></Layout>} />
      </Routes>
    </BrowserRouter>
  )
}
