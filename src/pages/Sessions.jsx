import { useState } from 'react'
import { Search, Calendar as CalIcon, List, ChevronLeft, ChevronRight, Eye, Edit2, Users, Clock, X } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import StatusBadge from '../components/common/StatusBadge'
import Modal from '../components/common/Modal'
import SlidePanel from '../components/common/SlidePanel'
import { sessions, formateurs } from '../data/mockData'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, parseISO, addMonths, subMonths } from 'date-fns'
import { fr } from 'date-fns/locale'

const STATUS_COLOR = {
  'En cours':  { pill: 'bg-primary text-white',    dot: 'bg-primary' },
  'Planifiée': { pill: 'bg-accent text-white',      dot: 'bg-accent' },
  'Terminée':  { pill: 'bg-success text-white',     dot: 'bg-success' },
}

function CalendarView({ sessions }) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 4, 1))
  const [selectedDay, setSelectedDay]   = useState(null)

  const start    = startOfMonth(currentMonth)
  const end      = endOfMonth(currentMonth)
  const days     = eachDayOfInterval({ start, end })
  const startDow = getDay(start) === 0 ? 6 : getDay(start) - 1

  const getSessionsForDay = (day) =>
    sessions.filter(s => {
      try {
        const sd = parseISO(s.dateDebut)
        const ed = parseISO(s.dateFin)
        return day >= sd && day <= ed
      } catch { return false }
    })

  const selectedSessions = selectedDay ? getSessionsForDay(selectedDay) : []

  return (
    <div className="card p-5">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(m => subMonths(m, 1))}
          className="w-8 h-8 rounded-xl hover:bg-bg flex items-center justify-center text-text2 hover:text-primary transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <h3 className="text-sm font-bold text-text1 capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: fr })}
        </h3>
        <button
          onClick={() => setCurrentMonth(m => addMonths(m, 1))}
          className="w-8 h-8 rounded-xl hover:bg-bg flex items-center justify-center text-text2 hover:text-primary transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-text3 py-1.5">{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {Array(startDow).fill(null).map((_, i) => <div key={`e${i}`} />)}
        {days.map((day) => {
          const daySessions = getSessionsForDay(day)
          const isSelected  = selectedDay && isSameDay(day, selectedDay)
          const isToday     = isSameDay(day, new Date())
          const hasSessions = daySessions.length > 0
          return (
            <button
              key={day.toISOString()}
              onClick={() => setSelectedDay(prev => prev && isSameDay(prev, day) ? null : day)}
              className={`min-h-[68px] rounded-xl p-1.5 border text-left transition-all duration-150 ${
                isSelected
                  ? 'border-primary bg-primary-light shadow-sm'
                  : isToday
                  ? 'border-primary/40 bg-primary/5'
                  : hasSessions
                  ? 'border-border hover:border-primary/40 hover:bg-bg'
                  : 'border-transparent hover:border-border'
              }`}
            >
              <p className={`text-xs font-bold mb-1 ${isSelected || isToday ? 'text-primary' : 'text-text2'}`}>
                {format(day, 'd')}
              </p>
              <div className="space-y-0.5">
                {daySessions.slice(0, 2).map(s => {
                  const cfg = STATUS_COLOR[s.statut] || { pill: 'bg-bg text-text2' }
                  return (
                    <div key={s.id} className={`text-[9px] font-semibold px-1 py-0.5 rounded truncate ${cfg.pill}`}>
                      {s.intitule.split(' ').slice(0, 2).join(' ')}
                    </div>
                  )
                })}
                {daySessions.length > 2 && (
                  <div className="text-[9px] text-text3 font-semibold">+{daySessions.length - 2} autre(s)</div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 text-xs text-text3">
        {Object.entries(STATUS_COLOR).map(([label, cfg]) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
            {label}
          </span>
        ))}
      </div>

      {/* Day detail panel */}
      {selectedDay && (
        <div className="mt-4 border-t border-border pt-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-text1 capitalize">
              {format(selectedDay, 'EEEE d MMMM yyyy', { locale: fr })}
            </p>
            <button onClick={() => setSelectedDay(null)} className="w-6 h-6 rounded-lg hover:bg-bg flex items-center justify-center text-text3">
              <X size={12} />
            </button>
          </div>
          {selectedSessions.length === 0 ? (
            <p className="text-sm text-text3 text-center py-4">Aucune session ce jour</p>
          ) : (
            <div className="space-y-2">
              {selectedSessions.map(s => {
                const cfg = STATUS_COLOR[s.statut] || { pill: 'bg-bg text-text2' }
                return (
                  <div key={s.id} className="flex items-center gap-3 p-3 bg-bg rounded-xl">
                    <span className={`w-2 h-8 rounded-full flex-shrink-0 ${cfg.dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text1 truncate">{s.intitule}</p>
                      <p className="text-xs text-text3">{s.formateur} · {s.salle} · {s.duree}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${cfg.pill}`}>{s.statut}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function Sessions() {
  const [view, setView] = useState('table')
  const [search, setSearch] = useState('')
  const [filterStatut, setFilterStatut] = useState('Tous')
  const [showAdd, setShowAdd] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null)
  const [page, setPage] = useState(1)
  const perPage = 8

  const filtered = sessions.filter(s => {
    const ms = s.intitule.toLowerCase().includes(search.toLowerCase()) || s.formateur.toLowerCase().includes(search.toLowerCase())
    const mSt = filterStatut === 'Tous' || s.statut === filterStatut
    return ms && mSt
  })

  const paginated = filtered.slice((page - 1) * perPage, page * perPage)
  const totalPages = Math.ceil(filtered.length / perPage)

  return (
    <div>
      <PageHeader
        title="Sessions"
        subtitle={`${sessions.length} sessions enregistrées`}
        onAdd={() => setShowAdd(true)}
        addLabel="Nouvelle Session"
        extra={
          <div className="flex items-center bg-bg border border-border rounded-xl p-1 gap-1">
            <button onClick={() => setView('table')} className={`p-1.5 rounded-lg transition-colors ${view === 'table' ? 'bg-primary text-white' : 'text-text3'}`}><List size={14} /></button>
            <button onClick={() => setView('calendar')} className={`p-1.5 rounded-lg transition-colors ${view === 'calendar' ? 'bg-primary text-white' : 'text-text3'}`}><CalIcon size={14} /></button>
          </div>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text3" />
          <input className="input w-full pl-9" placeholder="Rechercher une session..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
        </div>
        <select className="input" value={filterStatut} onChange={e => { setFilterStatut(e.target.value); setPage(1) }}>
          <option>Tous</option>
          <option>En cours</option>
          <option>Planifiée</option>
          <option>Terminée</option>
        </select>
        <select className="input">
          <option>Tous formateurs</option>
          {formateurs.map(f => <option key={f.id}>{f.nom}</option>)}
        </select>
      </div>

      {view === 'calendar' ? (
        <CalendarView sessions={filtered} />
      ) : (
        <>
          {/* Mobile cards */}
          <div className="sm:hidden flex flex-col gap-3 mb-5">
            {paginated.map((s) => (
              <div key={s.id} className="card p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="font-bold text-sm text-text1 leading-snug flex-1">{s.intitule}</p>
                  <StatusBadge status={s.statut} />
                </div>
                <p className="text-xs text-text3 mb-3">{s.formateur} · {s.salle}</p>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-bg rounded-xl p-2 text-center">
                    <p className="text-sm font-bold text-text1">{s.inscrits}<span className="text-text3 font-normal">/{s.places}</span></p>
                    <p className="text-[10px] text-text3">Inscrits</p>
                  </div>
                  <div className="bg-bg rounded-xl p-2 text-center">
                    <p className="text-sm font-bold text-text1">{s.duree}</p>
                    <p className="text-[10px] text-text3">Durée</p>
                  </div>
                  <div className="bg-bg rounded-xl p-2 text-center">
                    <p className="text-sm font-bold text-accent">{s.hsGenerees}h</p>
                    <p className="text-[10px] text-text3">HS</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text3">{s.dateDebut} → {s.dateFin}</span>
                  <div className="flex gap-1">
                    <button onClick={() => setSelectedSession(s)} className="w-8 h-8 rounded-xl hover:bg-primary-light flex items-center justify-center text-text3 hover:text-primary transition-colors"><Eye size={14} /></button>
                    <button className="w-8 h-8 rounded-xl hover:bg-bg flex items-center justify-center text-text3 hover:text-text1 transition-colors"><Edit2 size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between px-1">
              <span className="text-sm text-text3">{filtered.length} session(s)</span>
              <div className="flex gap-1">{Array.from({ length: totalPages }, (_, i) => i + 1).map(p => <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-sm font-medium ${p === page ? 'bg-primary text-white' : 'text-text2 hover:bg-bg'}`}>{p}</button>)}</div>
            </div>
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-bg">
                  <th className="text-left px-4 py-3 label">Intitulé</th>
                  <th className="text-left px-4 py-3 label">Formateur</th>
                  <th className="text-center px-4 py-3 label">Début</th>
                  <th className="text-center px-4 py-3 label">Fin</th>
                  <th className="text-center px-4 py-3 label">Durée</th>
                  <th className="text-center px-4 py-3 label">Inscrits</th>
                  <th className="text-center px-4 py-3 label">Salle</th>
                  <th className="text-center px-4 py-3 label">HS générées</th>
                  <th className="text-center px-4 py-3 label">Financement</th>
                  <th className="text-center px-4 py-3 label">Statut</th>
                  <th className="text-center px-4 py-3 label">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginated.map((s) => (
                  <tr key={s.id} className="hover:bg-bg transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-sm text-text1 max-w-[200px] leading-tight">{s.intitule}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold">
                          {s.formateur.split(' ').map(n => n[0]).join('').slice(0,2)}
                        </div>
                        <span className="text-sm text-text2">{s.formateur.split(' ')[0]}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-text2">{s.dateDebut}</td>
                    <td className="px-4 py-3 text-center text-sm text-text2">{s.dateFin}</td>
                    <td className="px-4 py-3 text-center"><span className="text-sm font-semibold text-text1">{s.duree}</span></td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-semibold text-text1">{s.inscrits}</span>
                      <span className="text-xs text-text3">/{s.places}</span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-text2">{s.salle}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-sm font-bold ${s.hsGenerees > 0 ? 'text-accent' : 'text-text3'}`}>{s.hsGenerees}h</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        s.financement === 'OPCO' ? 'bg-primary-light text-primary' :
                        s.financement === 'CPF' ? 'bg-accent-light text-accent' :
                        'bg-bg text-text2'
                      }`}>{s.financement}</span>
                    </td>
                    <td className="px-4 py-3 text-center"><StatusBadge status={s.statut} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => setSelectedSession(s)} className="w-8 h-8 rounded-xl hover:bg-primary-light flex items-center justify-center text-text3 hover:text-primary transition-colors">
                          <Eye size={14} />
                        </button>
                        <button className="w-8 h-8 rounded-xl hover:bg-bg flex items-center justify-center text-text3 hover:text-text1 transition-colors">
                          <Edit2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <span className="text-sm text-text3">{filtered.length} session(s)</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-primary text-white' : 'text-text2 hover:bg-bg'}`}>{p}</button>
              ))}
            </div>
          </div>
        </div>
        </>
      )}

      <Modal open={!!selectedSession} onClose={() => setSelectedSession(null)} title="Détail Session" size="lg">
        {selectedSession && <SessionDetail session={selectedSession} />}
      </Modal>

      <SlidePanel open={showAdd} onClose={() => setShowAdd(false)} title="Nouvelle Session">
        <SessionForm onClose={() => setShowAdd(false)} />
      </SlidePanel>
    </div>
  )
}

function SessionDetail({ session: s }) {
  const mockAttendance = [
    { nom: 'Amine Sebti', j1: true, j2: true, j3: false, j4: true },
    { nom: 'Houda Mansouri', j1: true, j2: true, j3: true, j4: true },
    { nom: 'Zineb Ouali', j1: false, j2: true, j3: true, j4: true },
    { nom: 'Sara Benkirane', j1: true, j2: false, j3: true, j4: false },
  ]
  return (
    <div className="space-y-5">
      <div className="p-4 bg-bg rounded-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-text1 leading-tight">{s.intitule}</h2>
            <p className="text-sm text-text3 mt-1">{s.formateur} · {s.salle}</p>
          </div>
          <StatusBadge status={s.statut} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Inscrits', value: `${s.inscrits}/${s.places}`, icon: <Users size={16} /> },
          { label: 'Durée', value: s.duree, icon: <Clock size={16} /> },
          { label: 'HS générées', value: `${s.hsGenerees}h`, icon: <Clock size={16} /> },
        ].map(item => (
          <div key={item.label} className="bg-bg rounded-xl p-3 text-center">
            <div className="flex justify-center mb-1 text-primary">{item.icon}</div>
            <p className="text-lg font-extrabold text-text1">{item.value}</p>
            <p className="text-xs text-text3">{item.label}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div className="bg-bg rounded-xl p-3">
          <p className="label mb-1">Date de début</p>
          <p className="font-semibold text-text1">{s.dateDebut}</p>
        </div>
        <div className="bg-bg rounded-xl p-3">
          <p className="label mb-1">Date de fin</p>
          <p className="font-semibold text-text1">{s.dateFin}</p>
        </div>
        <div className="bg-bg rounded-xl p-3">
          <p className="label mb-1">Financement</p>
          <p className="font-semibold text-text1">{s.financement}</p>
        </div>
        <div className="bg-bg rounded-xl p-3">
          <p className="label mb-1">Salle</p>
          <p className="font-semibold text-text1">{s.salle}</p>
        </div>
      </div>
      <div>
        <p className="text-sm font-bold text-text2 mb-3">Suivi des présences</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left pb-2 label">Apprenant</th>
                {['J1', 'J2', 'J3', 'J4'].map(j => <th key={j} className="text-center pb-2 label">{j}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockAttendance.map((a, i) => (
                <tr key={i}>
                  <td className="py-2 font-medium text-text1">{a.nom}</td>
                  {['j1','j2','j3','j4'].map(j => (
                    <td key={j} className="py-2 text-center">
                      <input type="checkbox" defaultChecked={a[j]} className="rounded accent-primary" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function SessionForm({ onClose }) {
  const [form, setForm] = useState({ intitule: '', formateur: '', dateDebut: '', dateFin: '', salle: '', places: '', financement: '', description: '' })
  const [errors, setErrors] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.intitule.trim()) errs.intitule = 'Intitulé requis'
    if (!form.formateur) errs.formateur = 'Formateur requis'
    if (!form.dateDebut) errs.dateDebut = 'Date début requise'
    if (Object.keys(errs).length) { setErrors(errs); return }
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label block mb-1">Intitulé de la session</label>
        <input className={`input w-full ${errors.intitule ? 'border-danger' : ''}`} placeholder="Ex: Python avancé – Data Science" value={form.intitule} onChange={e => setForm(p => ({ ...p, intitule: e.target.value }))} />
        {errors.intitule && <p className="text-xs text-danger mt-1">{errors.intitule}</p>}
      </div>
      <div>
        <label className="label block mb-1">Formateur</label>
        <select className={`input w-full ${errors.formateur ? 'border-danger' : ''}`} value={form.formateur} onChange={e => setForm(p => ({ ...p, formateur: e.target.value }))}>
          <option value="">Sélectionner...</option>
          {formateurs.map(f => <option key={f.id}>{f.nom}</option>)}
        </select>
        {errors.formateur && <p className="text-xs text-danger mt-1">{errors.formateur}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="label block mb-1">Date début</label>
          <input type="date" className={`input w-full ${errors.dateDebut ? 'border-danger' : ''}`} value={form.dateDebut} onChange={e => setForm(p => ({ ...p, dateDebut: e.target.value }))} />
          {errors.dateDebut && <p className="text-xs text-danger mt-1">{errors.dateDebut}</p>}
        </div>
        <div>
          <label className="label block mb-1">Date fin</label>
          <input type="date" className="input w-full" value={form.dateFin} onChange={e => setForm(p => ({ ...p, dateFin: e.target.value }))} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="label block mb-1">Salle</label>
          <select className="input w-full" value={form.salle} onChange={e => setForm(p => ({ ...p, salle: e.target.value }))}>
            <option value="">Sélectionner...</option>
            <option>Salle A</option>
            <option>Salle B</option>
            <option>Salle C</option>
            <option>Salle Informatique</option>
          </select>
        </div>
        <div>
          <label className="label block mb-1">Nombre de places</label>
          <input type="number" className="input w-full" placeholder="15" value={form.places} onChange={e => setForm(p => ({ ...p, places: e.target.value }))} />
        </div>
      </div>
      <div>
        <label className="label block mb-1">Type de financement</label>
        <select className="input w-full" value={form.financement} onChange={e => setForm(p => ({ ...p, financement: e.target.value }))}>
          <option value="">Sélectionner...</option>
          <option>OPCO</option>
          <option>CPF</option>
          <option>Autofinancement</option>
        </select>
      </div>
      <div>
        <label className="label block mb-1">Description</label>
        <textarea className="input w-full" rows={3} placeholder="Description de la session..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
      </div>
      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onClose} className="flex-1 btn-ghost border border-border">Annuler</button>
        <button type="submit" className="flex-1 btn-primary">Créer la session</button>
      </div>
    </form>
  )
}
