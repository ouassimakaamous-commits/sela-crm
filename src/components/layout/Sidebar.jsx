import { useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, GraduationCap, Calendar,
  Clock, FileText, DollarSign, BarChart2, Settings, LogOut, X
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const sidebarItems = [
  { icon: LayoutDashboard, path: '/dashboard', label: 'Dashboard' },
  { icon: Users, path: '/formateurs', label: 'Formateurs' },
  { icon: GraduationCap, path: '/apprenants', label: 'Apprenants' },
  { icon: Calendar, path: '/sessions', label: 'Sessions' },
  { icon: Clock, path: '/heures-sup', label: 'Heures Sup' },
  { icon: FileText, path: '/documents', label: 'Documents' },
  { icon: DollarSign, path: '/finances', label: 'Finances' },
  { icon: BarChart2, path: '/rapports', label: 'Rapports' },
]

export default function Sidebar({ mobileOpen, onClose }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : 'SA'

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const handleNav = (path) => {
    navigate(path)
    onClose?.()
  }

  return (
    <>
      {/* Desktop sidebar — always visible on md+ */}
      <div className="hidden md:flex fixed left-0 top-0 bottom-0 w-16 bg-white border-r border-border z-50 flex-col items-center py-4 gap-2">
        <SidebarContent
          location={location}
          sidebarItems={sidebarItems}
          initials={initials}
          onNav={handleNav}
          onLogout={handleLogout}
          compact
        />
      </div>

      {/* Mobile drawer */}
      <div className={`md:hidden fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-border z-50 flex flex-col py-4 transition-transform duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Close button */}
        <div className="flex items-center justify-between px-4 mb-4">
          <svg width="72" height="24" viewBox="0 0 80 28" fill="none">
            <rect width="4" height="28" rx="2" fill="#00839F" />
            <rect x="6" width="4" height="20" rx="2" fill="#DCA35A" />
            <text x="16" y="20" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="800" fontSize="16" fill="#0D1B2A">SELA</text>
          </svg>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-text3 hover:bg-bg transition-colors">
            <X size={16} />
          </button>
        </div>

        <SidebarContent
          location={location}
          sidebarItems={sidebarItems}
          initials={initials}
          onNav={handleNav}
          onLogout={handleLogout}
          compact={false}
        />
      </div>
    </>
  )
}

function SidebarContent({ location, sidebarItems, initials, onNav, onLogout, compact }) {
  if (compact) {
    return (
      <>
        <div
          className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center mb-2 cursor-pointer"
          onClick={() => onNav('/dashboard')}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect width="3" height="20" rx="1.5" fill="white" />
            <rect x="5" width="3" height="14" rx="1.5" fill="#DCA35A" />
          </svg>
        </div>

        <div className="flex flex-col items-center gap-1 flex-1">
          {sidebarItems.map(({ icon: Icon, path, label }) => {
            const active = location.pathname === path
            return (
              <div key={path} className="relative group">
                <button
                  onClick={() => onNav(path)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 ${
                    active ? 'bg-primary text-white shadow-sm' : 'text-text3 hover:bg-primary-light hover:text-primary'
                  }`}
                >
                  <Icon size={18} />
                </button>
                <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-text1 text-white text-xs font-medium px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  {label}
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="relative group">
            <button
              onClick={() => onNav('/parametres')}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 ${
                location.pathname === '/parametres' ? 'bg-primary text-white' : 'text-text3 hover:bg-primary-light hover:text-primary'
              }`}
            >
              <Settings size={18} />
            </button>
            <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-text1 text-white text-xs font-medium px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              Paramètres
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xs cursor-pointer hover:bg-primary hover:text-white transition-all duration-150">
            {initials}
          </div>
        </div>
      </>
    )
  }

  // Mobile expanded layout
  return (
    <>
      <div className="flex flex-col flex-1 px-3 gap-1 overflow-y-auto">
        {sidebarItems.map(({ icon: Icon, path, label }) => {
          const active = location.pathname === path
          return (
            <button
              key={path}
              onClick={() => onNav(path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                active ? 'bg-primary text-white' : 'text-text2 hover:bg-bg'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          )
        })}
      </div>

      <div className="flex flex-col gap-1 px-3 pt-3 border-t border-border mt-2">
        <button
          onClick={() => onNav('/parametres')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
            location.pathname === '/parametres' ? 'bg-primary text-white' : 'text-text2 hover:bg-bg'
          }`}
        >
          <Settings size={18} />
          Paramètres
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-150"
        >
          <LogOut size={18} />
          Se déconnecter
        </button>
      </div>
    </>
  )
}
