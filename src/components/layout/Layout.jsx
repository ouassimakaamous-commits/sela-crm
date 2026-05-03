import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ChevronRight, Menu, Bell } from 'lucide-react'
import Sidebar from './Sidebar'
import { useAuth } from '../../context/AuthContext'

const BREADCRUMB_MAP = {
  '/dashboard':  'Tableau de Bord',
  '/formateurs': 'Formateurs',
  '/apprenants': 'Apprenants',
  '/sessions':   'Sessions',
  '/heures-sup': 'Heures Supplémentaires',
  '/documents':  'Documents',
  '/finances':   'Finances',
  '/rapports':   'Rapports',
  '/parametres': 'Paramètres',
  '/utilisateurs': 'Utilisateurs',
}

export default function Layout({ children }) {
  const location = useLocation()
  const { user } = useAuth()
  const [mobileNavOpen, setMobileNavOpen]   = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [sidebarLocked, setSidebarLocked]   = useState(true)

  const currentPage = BREADCRUMB_MAP[location.pathname] || 'Page'

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : 'SA'

  const marginLeft = sidebarExpanded ? 'md:ml-[240px]' : 'md:ml-[68px]'

  return (
    <div className="min-h-screen bg-bg flex">
      <Sidebar
        mobileOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        expanded={sidebarExpanded}
        locked={sidebarLocked}
        onToggle={() => setSidebarExpanded(e => !e)}
        onToggleLock={() => setSidebarLocked(l => !l)}
      />

      {/* Mobile overlay */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* Main content */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${marginLeft}`}>
        {/* Top header bar */}
        <div className="sticky top-0 z-30 bg-white border-b border-border flex items-center justify-between px-4 md:px-6 h-14">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileNavOpen(o => !o)}
            className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-text2 hover:bg-bg transition-colors"
          >
            <Menu size={20} />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-text3 hidden sm:block">Centre SELA</span>
            <ChevronRight size={14} className="text-text3 hidden sm:block" />
            <span className="font-semibold text-primary">{currentPage}</span>
          </div>

          {/* Right: bell + avatar */}
          <div className="flex items-center gap-2">
            <button className="relative w-9 h-9 rounded-xl bg-bg hover:bg-border flex items-center justify-center transition-colors">
              <Bell size={16} className="text-text2" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 px-4 md:px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  )
}
