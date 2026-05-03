import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, GraduationCap, Calendar,
  Clock, FileText, DollarSign, BarChart2, Settings,
  LogOut, X, ChevronLeft, ChevronRight, Pin, PinOff, UserCog
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useLogo } from '../../context/LogoContext'
import UserAvatar from './UserAvatar'

const NAV_ITEMS = [
  { icon: LayoutDashboard, path: '/dashboard',   label: 'Dashboard' },
  { icon: Users,           path: '/formateurs',  label: 'Formateurs' },
  { icon: GraduationCap,   path: '/apprenants',  label: 'Apprenants' },
  { icon: Calendar,        path: '/sessions',    label: 'Sessions' },
  { icon: Clock,           path: '/heures-sup',  label: 'Heures Sup' },
  { icon: FileText,        path: '/documents',   label: 'Documents' },
  { icon: DollarSign,      path: '/finances',    label: 'Finances' },
  { icon: BarChart2,       path: '/rapports',    label: 'Rapports' },
  { icon: UserCog,         path: '/utilisateurs', label: 'Utilisateurs' },
]

export default function Sidebar({ mobileOpen, onClose, expanded, locked, onToggle, onToggleLock }) {
  const location = useLocation()
  const navigate  = useNavigate()
  const { user, logout } = useAuth()
  const { logo } = useLogo()

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : 'SA'

  const handleNav = (path) => {
    navigate(path)
    onClose?.()
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────────────────── */}
      <div
        className={`hidden md:flex fixed left-0 top-0 bottom-0 bg-white border-r border-border z-50 flex-col transition-all duration-300 ease-in-out overflow-hidden ${
          expanded ? 'w-[240px]' : 'w-[68px]'
        }`}
      >
        {/* Logo row */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-border flex-shrink-0">
          {expanded ? (
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNav('/dashboard')}>
              {logo
                ? <img src={logo} alt="SELA" className="h-7 max-w-[110px] object-contain" />
                : <SelaLogo />
              }
            </div>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center cursor-pointer mx-auto" onClick={() => handleNav('/dashboard')}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <rect width="3" height="20" rx="1.5" fill="white" />
                <rect x="5" width="3" height="14" rx="1.5" fill="#DCA35A" />
              </svg>
            </div>
          )}
        </div>

        {/* Nav items */}
        <div className="flex flex-col flex-1 overflow-y-auto py-3 gap-0.5 px-2">
          {NAV_ITEMS.map(({ icon: Icon, path, label }) => {
            const active = location.pathname === path
            return (
              <Tooltip key={path} label={label} show={!expanded}>
                <button
                  onClick={() => handleNav(path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    active
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-text2 hover:bg-primary/10 hover:text-primary'
                  } ${expanded ? '' : 'justify-center'}`}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  {expanded && <span className="truncate">{label}</span>}
                </button>
              </Tooltip>
            )
          })}
        </div>

        {/* Bottom section */}
        <div className="flex flex-col gap-0.5 px-2 py-3 border-t border-border flex-shrink-0">
          <Tooltip label="Paramètres" show={!expanded}>
            <button
              onClick={() => handleNav('/parametres')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                location.pathname === '/parametres'
                  ? 'bg-primary text-white'
                  : 'text-text2 hover:bg-primary/10 hover:text-primary'
              } ${expanded ? '' : 'justify-center'}`}
            >
              <Settings size={18} className="flex-shrink-0" />
              {expanded && <span>Paramètres</span>}
            </button>
          </Tooltip>

          {/* User row */}
          <div className={`flex items-center gap-3 px-3 py-2 rounded-xl ${expanded ? '' : 'justify-center'}`}>
            <UserAvatar size="md" showPopover={true} />
            {expanded && (
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-semibold text-text1 truncate">{user?.name || 'Admin'}</span>
                <span className="text-[10px] text-text3 capitalize">{user?.role || 'admin'}</span>
              </div>
            )}
          </div>

          <Tooltip label="Se déconnecter" show={!expanded}>
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-150 ${expanded ? '' : 'justify-center'}`}
            >
              <LogOut size={18} className="flex-shrink-0" />
              {expanded && <span>Se déconnecter</span>}
            </button>
          </Tooltip>
        </div>

        {/* Toggle + Lock controls */}
        <div className={`flex items-center border-t border-border px-2 py-2 gap-1 flex-shrink-0 ${expanded ? 'justify-between' : 'flex-col'}`}>
          {/* Lock button */}
          <button
            onClick={onToggleLock}
            title={locked ? 'Déverrouiller' : 'Verrouiller'}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text3 hover:bg-bg hover:text-primary transition-colors"
          >
            {locked ? <Pin size={14} /> : <PinOff size={14} />}
          </button>

          {/* Collapse / expand button */}
          <button
            onClick={onToggle}
            title={expanded ? 'Réduire' : 'Agrandir'}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text3 hover:bg-bg hover:text-primary transition-colors"
          >
            {expanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ───────────────────────────────────────── */}
      <div className={`md:hidden fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-border z-50 flex flex-col transition-transform duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-4 h-16 border-b border-border flex-shrink-0">
          {logo
            ? <img src={logo} alt="SELA" className="h-7 max-w-[110px] object-contain" />
            : <SelaLogo />
          }
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-text3 hover:bg-bg transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col flex-1 overflow-y-auto py-3 gap-0.5 px-2">
          {NAV_ITEMS.map(({ icon: Icon, path, label }) => {
            const active = location.pathname === path
            return (
              <button
                key={path}
                onClick={() => handleNav(path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  active ? 'bg-primary text-white shadow-sm' : 'text-text2 hover:bg-bg'
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            )
          })}
        </div>

        <div className="flex flex-col gap-0.5 px-2 py-3 border-t border-border flex-shrink-0">
          <button
            onClick={() => handleNav('/parametres')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
              location.pathname === '/parametres' ? 'bg-primary text-white' : 'text-text2 hover:bg-bg'
            }`}
          >
            <Settings size={18} />
            Paramètres
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-150"
          >
            <LogOut size={18} />
            Se déconnecter
          </button>
        </div>
      </div>
    </>
  )
}

function Tooltip({ label, show, children }) {
  if (!show) return children
  return (
    <div className="relative group">
      {children}
      <div className="absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 bg-text1 text-white text-xs font-medium px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[60]">
        {label}
      </div>
    </div>
  )
}

function SelaLogo() {
  return (
    <svg width="80" height="26" viewBox="0 0 80 28" fill="none">
      <rect width="4" height="28" rx="2" fill="#00839F" />
      <rect x="6" width="4" height="20" rx="2" fill="#DCA35A" />
      <text x="16" y="20" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="800" fontSize="16" fill="#0D1B2A">SELA</text>
    </svg>
  )
}
