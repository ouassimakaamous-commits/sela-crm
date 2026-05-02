const configs = {
  'Validé':           { bg: 'bg-success/10',       text: 'text-success',   dot: 'bg-success' },
  'En attente':       { bg: 'bg-warning/10',        text: 'text-warning',   dot: 'bg-warning' },
  'Refusé':           { bg: 'bg-danger/10',         text: 'text-danger',    dot: 'bg-danger' },
  'Quota dépassé':    { bg: 'bg-danger/10',         text: 'text-danger',    dot: 'bg-danger' },
  'Actif':            { bg: 'bg-success/10',        text: 'text-success',   dot: 'bg-success' },
  'En congé':         { bg: 'bg-warning/10',        text: 'text-warning',   dot: 'bg-warning' },
  'En cours':         { bg: 'bg-primary-light',     text: 'text-primary',   dot: 'bg-primary' },
  'Planifiée':        { bg: 'bg-text3/10',          text: 'text-text2',     dot: 'bg-text3' },
  'Terminée':         { bg: 'bg-success/10',        text: 'text-success',   dot: 'bg-success' },
  'En formation':     { bg: 'bg-primary-light',     text: 'text-primary',   dot: 'bg-primary' },
  'Inscrit':          { bg: 'bg-accent-light',      text: 'text-accent',    dot: 'bg-accent' },
  'Certifié':         { bg: 'bg-success/10',        text: 'text-success',   dot: 'bg-success' },
  'Diplômé':          { bg: 'bg-purple-50',         text: 'text-purple-700',dot: 'bg-purple-500' },
}

export default function StatusBadge({ status, size = 'sm' }) {
  const cfg = configs[status] || { bg: 'bg-text3/10', text: 'text-text2', dot: 'bg-text3' }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold ${size === 'sm' ? 'text-xs' : 'text-sm'} ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  )
}
