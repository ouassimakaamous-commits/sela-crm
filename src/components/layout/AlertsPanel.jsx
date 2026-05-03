import { X, AlertTriangle, Info, CheckCircle, Clock } from 'lucide-react'
import { alertes } from '../../data/mockData'

const TYPE_CONFIG = {
  warning: {
    icon: AlertTriangle,
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon_color: 'text-amber-500',
    dot: 'bg-amber-400',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon_color: 'text-blue-500',
    dot: 'bg-blue-400',
  },
  success: {
    icon: CheckCircle,
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon_color: 'text-green-500',
    dot: 'bg-green-400',
  },
}

export default function AlertsPanel({ open, onClose }) {
  const unread = alertes.filter(a => a.type === 'warning').length

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
          onClick={onClose}
        />
      )}

      {/* Slide-in panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[360px] max-w-full bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center">
              <span className="text-accent text-base">🔔</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-text1">Alertes & Notifications</h2>
              <p className="text-xs text-text3">{unread} non lue{unread > 1 ? 's' : ''}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text3 hover:bg-bg hover:text-text1 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Alert list */}
        <div className="flex-1 overflow-y-auto py-3 px-3 flex flex-col gap-2">
          {alertes.map((alerte) => {
            const cfg = TYPE_CONFIG[alerte.type] || TYPE_CONFIG.info
            const Icon = cfg.icon
            return (
              <div
                key={alerte.id}
                className={`flex gap-3 p-3.5 rounded-xl border ${cfg.bg} ${cfg.border} cursor-pointer hover:shadow-sm transition-shadow`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/80`}>
                  <Icon size={16} className={cfg.icon_color} />
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <p className="text-xs font-medium text-text1 leading-snug">{alerte.message}</p>
                  <div className="flex items-center gap-1.5">
                    <Clock size={10} className="text-text3" />
                    <span className="text-[10px] text-text3">{alerte.temps}</span>
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full ${cfg.dot} flex-shrink-0 mt-1`} />
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl text-sm font-medium text-text3 hover:bg-bg transition-colors"
          >
            Marquer tout comme lu
          </button>
        </div>
      </div>
    </>
  )
}
