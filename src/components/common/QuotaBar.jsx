export default function QuotaBar({ used, total, showLabel = true }) {
  const pct = Math.min(Math.round((used / total) * 100), 100)
  const exceeded = used > total
  const near = pct >= 80 && !exceeded

  const barColor = exceeded
    ? 'bg-danger'
    : near
    ? 'bg-warning'
    : 'bg-primary'

  return (
    <div className="flex flex-col gap-1">
      {showLabel && (
        <div className="flex justify-between items-center">
          <span className="text-xs text-text3">{used}h / {total}h</span>
          <span className={`text-xs font-bold ${exceeded ? 'text-danger' : near ? 'text-warning' : 'text-primary'}`}>
            {exceeded ? `+${used - total}h` : `${pct}%`}
          </span>
        </div>
      )}
      <div className="h-2 bg-border rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  )
}
