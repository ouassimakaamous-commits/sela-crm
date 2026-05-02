import { Calendar, Plus } from 'lucide-react'

export default function PageHeader({ title, subtitle, onAdd, addLabel = 'Ajouter', extra }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-3xl font-extrabold text-text1 tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-text3 mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {extra}
        <button className="flex items-center gap-2 bg-bg border border-border text-text2 px-3 py-2 rounded-xl text-sm font-medium hover:bg-border transition-colors">
          <Calendar size={14} />
          Mai 2025
        </button>
        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 bg-accent hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 shadow-sm"
          >
            <Plus size={16} />
            {addLabel}
          </button>
        )}
      </div>
    </div>
  )
}
