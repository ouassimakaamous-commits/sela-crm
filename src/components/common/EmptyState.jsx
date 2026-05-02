export default function EmptyState({ icon = '🔍', message, cta, onCta }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <p className="text-text2 font-medium mb-4">{message}</p>
      {cta && onCta && (
        <button onClick={onCta} className="btn-primary">
          {cta}
        </button>
      )}
    </div>
  )
}
