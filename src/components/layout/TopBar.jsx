import { useLocation, useNavigate } from 'react-router-dom'
import { Bell, ChevronRight } from 'lucide-react'

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Formateurs', path: '/formateurs' },
  { label: 'Apprenants', path: '/apprenants' },
  { label: 'Sessions', path: '/sessions' },
  { label: 'Heures Sup', path: '/heures-sup' },
  { label: 'Finances', path: '/finances' },
  { label: 'Rapports', path: '/rapports' },
]

const breadcrumbMap = {
  '/dashboard': 'Tableau de Bord',
  '/formateurs': 'Formateurs',
  '/apprenants': 'Apprenants',
  '/sessions': 'Sessions',
  '/heures-sup': 'Heures Supplémentaires',
  '/documents': 'Documents',
  '/finances': 'Finances',
  '/rapports': 'Rapports',
  '/parametres': 'Paramètres',
}

const avatars = [
  { initials: 'KA', color: '#00839F' },
  { initials: 'FZ', color: '#DCA35A' },
  { initials: 'MT', color: '#7C3AED' },
]

export default function TopBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const current = breadcrumbMap[location.pathname] || 'Page'

  return (
    <div className="fixed top-0 left-16 right-0 z-40">
      {/* Main nav bar */}
      <div className="bg-white border-b border-border px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <SelaLogo />
        </div>

        {/* Center tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={active ? 'nav-tab-active' : 'nav-tab'}
              >
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Avatar stack */}
          <div className="flex -space-x-2">
            {avatars.map((av, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: av.color }}
              >
                {av.initials}
              </div>
            ))}
          </div>
          <button className="text-xs font-semibold text-text2 bg-bg px-3 py-1.5 rounded-lg hover:bg-border transition-colors">
            Partagé
          </button>
          <button className="relative w-9 h-9 rounded-xl bg-bg hover:bg-border flex items-center justify-center transition-colors">
            <Bell size={16} className="text-text2" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
          </button>
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white text-xs font-bold cursor-pointer">
            SA
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-bg/80 backdrop-blur border-b border-border px-6 h-9 flex items-center gap-2 text-sm text-text3">
        <span className="font-medium text-text2">Centre SELA</span>
        <ChevronRight size={14} />
        <span className="font-semibold text-primary">{current}</span>
      </div>
    </div>
  )
}

function SelaLogo() {
  return (
    <svg width="80" height="28" viewBox="0 0 80 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="4" height="28" rx="2" fill="#00839F" />
      <rect x="6" width="4" height="20" rx="2" fill="#DCA35A" />
      <text x="16" y="20" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="800" fontSize="16" fill="#0D1B2A">SELA</text>
    </svg>
  )
}
