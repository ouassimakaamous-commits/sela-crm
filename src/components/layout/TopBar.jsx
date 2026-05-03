import { useLocation, useNavigate } from 'react-router-dom'
import { Bell, ChevronRight, LogOut, Menu } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useLogo } from '../../context/LogoContext'

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

export default function TopBar({ onMenuToggle }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { logo } = useLogo()
  const current = breadcrumbMap[location.pathname] || 'Page'

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : 'SA'

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="fixed top-0 left-0 right-0 md:left-16 z-40">
      {/* Main nav bar */}
      <div className="bg-white border-b border-border px-4 md:px-6 h-16 flex items-center justify-between gap-4">

        {/* Hamburger (mobile) */}
        <button
          onClick={onMenuToggle}
          className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-text2 hover:bg-bg transition-colors flex-shrink-0"
        >
          <Menu size={20} />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {logo
            ? <img src={logo} alt="Logo SELA" className="h-8 max-w-[100px] object-contain" />
            : <SelaLogo />
          }
        </div>

        {/* Center tabs (hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-1 overflow-x-auto">
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
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          <button className="relative w-9 h-9 rounded-xl bg-bg hover:bg-border flex items-center justify-center transition-colors">
            <Bell size={16} className="text-text2" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
          </button>
          <div
            className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white text-xs font-bold cursor-pointer"
            title={user?.name}
          >
            {initials}
          </div>
          <button
            onClick={handleLogout}
            title="Se déconnecter"
            className="w-9 h-9 rounded-xl bg-bg hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-text3 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-bg/80 backdrop-blur border-b border-border px-4 md:px-6 h-9 flex items-center gap-2 text-sm text-text3">
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
