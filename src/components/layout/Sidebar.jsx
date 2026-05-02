import { useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, GraduationCap, Calendar,
  Clock, FileText, DollarSign, BarChart2, Settings, User
} from 'lucide-react'

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

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="fixed left-0 top-0 bottom-0 w-16 bg-white border-r border-border z-50 flex flex-col items-center py-4 gap-2">
      {/* Mini logo mark */}
      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center mb-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect width="3" height="20" rx="1.5" fill="white" />
          <rect x="5" width="3" height="14" rx="1.5" fill="#DCA35A" />
        </svg>
      </div>

      {/* Nav icons */}
      <div className="flex flex-col items-center gap-1 flex-1">
        {sidebarItems.map(({ icon: Icon, path, label }) => {
          const active = location.pathname === path
          return (
            <div key={path} className="relative group">
              <button
                onClick={() => navigate(path)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 ${
                  active
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text3 hover:bg-primary-light hover:text-primary'
                }`}
              >
                <Icon size={18} />
              </button>
              {/* Tooltip */}
              <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-text1 text-white text-xs font-medium px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                {label}
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom actions */}
      <div className="flex flex-col items-center gap-1">
        <div className="relative group">
          <button
            onClick={() => navigate('/parametres')}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 ${
              location.pathname === '/parametres'
                ? 'bg-primary text-white'
                : 'text-text3 hover:bg-primary-light hover:text-primary'
            }`}
          >
            <Settings size={18} />
          </button>
          <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-text1 text-white text-xs font-medium px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            Paramètres
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xs cursor-pointer hover:bg-primary hover:text-white transition-all duration-150">
          SA
        </div>
      </div>
    </div>
  )
}
