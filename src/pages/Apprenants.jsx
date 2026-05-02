import { useState } from 'react'
import { Search, Download, Eye, Edit2, LayoutGrid, List, CheckSquare } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import StatusBadge from '../components/common/StatusBadge'
import Modal from '../components/common/Modal'
import SlidePanel from '../components/common/SlidePanel'
import { apprenants } from '../data/mockData'

const KANBAN_COLUMNS = [
  { id: 'Prospect', label: 'Prospect', color: 'border-text3 bg-text3/5' },
  { id: 'Inscrit', label: 'Inscrit', color: 'border-accent bg-accent-light' },
  { id: 'En formation', label: 'En formation', color: 'border-primary bg-primary-light' },
  { id: 'Certifié', label: 'Certifié', color: 'border-success bg-success/5' },
  { id: 'Diplômé', label: 'Diplômé', color: 'border-purple-400 bg-purple-50' },
]

export default function Apprenants() {
  const [search, setSearch] = useState('')
  const [filterStatut, setFilterStatut] = useState('Tous')
  const [filterFinancement, setFilterFinancement] = useState('Tous')
  const [view, setView] = useState('table')
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [page, setPage] = useState(1)
  const [bulk, setBulk] = useState([])
  const perPage = 8

  const filtered = apprenants.filter(a => {
    const ms = a.nom.toLowerCase().includes(search.toLowerCase()) || a.filiere.toLowerCase().includes(search.toLowerCase())
    const mSt = filterStatut === 'Tous' || a.statut === filterStatut
    const mFi = filterFinancement === 'Tous' || a.financement === filterFinancement
    return ms && mSt && mFi
  })

  const paginated = filtered.slice((page - 1) * perPage, page * perPage)
  const totalPages = Math.ceil(filtered.length / perPage)

  const toggleBulk = (id) => setBulk(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])

  return (
    <div>
      <PageHeader
        title="Apprenants"
        subtitle={`${apprenants.length} apprenants inscrits`}
        onAdd={() => setShowAdd(true)}
        addLabel="Nouvel Apprenant"
        extra={
          <div className="flex items-center gap-2">
            {bulk.length > 0 && (
              <span className="text-xs font-semibold bg-primary-light text-primary px-3 py-1.5 rounded-xl">
                {bulk.length} sélectionné(s)
              </span>
            )}
            <button className="flex items-center gap-2 bg-bg border border-border text-text2 px-3 py-2 rounded-xl text-sm font-medium hover:bg-border transition-colors">
              <Download size={14} /> Exporter
            </button>
            <div className="flex items-center bg-bg border border-border rounded-xl p-1 gap-1">
              <button onClick={() => setView('table')} className={`p-1.5 rounded-lg transition-colors ${view === 'table' ? 'bg-primary text-white' : 'text-text3'}`}><List size={14} /></button>
              <button onClick={() => setView('kanban')} className={`p-1.5 rounded-lg transition-colors ${view === 'kanban' ? 'bg-primary text-white' : 'text-text3'}`}><LayoutGrid size={14} /></button>
            </div>
          </div>
        }
      />

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text3" />
          <input className="input w-full pl-9" placeholder="Rechercher un apprenant..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
        </div>
        <select className="input" value={filterStatut} onChange={e => { setFilterStatut(e.target.value); setPage(1) }}>
          <option>Tous</option>
          <option>Inscrit</option>
          <option>En formation</option>
          <option>Certifié</option>
          <option>Diplômé</option>
        </select>
        <select className="input" value={filterFinancement} onChange={e => { setFilterFinancement(e.target.value); setPage(1) }}>
          <option>Tous</option>
          <option>OPCO</option>
          <option>CPF</option>
          <option>Autofinancement</option>
        </select>
        <select className="input">
          <option>Toutes filières</option>
          <option>Développement Web</option>
          <option>Comptabilité</option>
          <option>Marketing Digital</option>
          <option>Informatique & Réseaux</option>
        </select>
      </div>

      {view === 'table' ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-bg">
                  <th className="px-4 py-3 w-8">
                    <input type="checkbox" className="rounded" onChange={e => e.target.checked ? setBulk(paginated.map(a => a.id)) : setBulk([])} />
                  </th>
                  <th className="text-left px-4 py-3 label">Apprenant</th>
                  <th className="text-left px-4 py-3 label">Âge</th>
                  <th className="text-left px-4 py-3 label">Filière</th>
                  <th className="text-left px-4 py-3 label">Session actuelle</th>
                  <th className="text-center px-4 py-3 label">Financement</th>
                  <th className="text-center px-4 py-3 label">Statut</th>
                  <th className="text-left px-4 py-3 label">Inscription</th>
                  <th className="text-center px-4 py-3 label">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginated.map((a) => (
                  <tr key={a.id} className={`hover:bg-bg transition-colors ${bulk.includes(a.id) ? 'bg-primary-light' : ''}`}>
                    <td className="px-4 py-3">
                      <input type="checkbox" className="rounded" checked={bulk.includes(a.id)} onChange={() => toggleBulk(a.id)} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: a.couleur }}>
                          {a.avatar}
                        </div>
                        <span className="font-semibold text-sm text-text1">{a.nom}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-text2">{a.age} ans</td>
                    <td className="px-4 py-3 text-sm text-text2">{a.filiere}</td>
                    <td className="px-4 py-3 text-sm text-text2 max-w-[180px] truncate">{a.session}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        a.financement === 'OPCO' ? 'bg-primary-light text-primary' :
                        a.financement === 'CPF' ? 'bg-accent-light text-accent' :
                        'bg-bg text-text2'
                      }`}>{a.financement}</span>
                    </td>
                    <td className="px-4 py-3 text-center"><StatusBadge status={a.statut} /></td>
                    <td className="px-4 py-3 text-sm text-text3">{a.dateInscription}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => setSelected(a)} className="w-8 h-8 rounded-xl hover:bg-primary-light flex items-center justify-center text-text3 hover:text-primary transition-colors" title="Voir">
                          <Eye size={14} />
                        </button>
                        <button className="w-8 h-8 rounded-xl hover:bg-bg flex items-center justify-center text-text3 hover:text-text1 transition-colors" title="Modifier">
                          <Edit2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <span className="text-sm text-text3">{filtered.length} apprenant(s)</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-primary text-white' : 'text-text2 hover:bg-bg'}`}>{p}</button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <KanbanView apprenants={filtered} onSelect={setSelected} />
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Profil Apprenant">
        {selected && <ApprenantDetail apprenant={selected} />}
      </Modal>

      <SlidePanel open={showAdd} onClose={() => setShowAdd(false)} title="Nouvel Apprenant">
        <ApprenantForm onClose={() => setShowAdd(false)} />
      </SlidePanel>
    </div>
  )
}

function KanbanView({ apprenants, onSelect }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {KANBAN_COLUMNS.map(col => {
        const items = apprenants.filter(a => a.statut === col.id)
        return (
          <div key={col.id} className="flex-shrink-0 w-56">
            <div className={`rounded-2xl border-t-4 ${col.color} p-3 bg-white shadow-card`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-text1">{col.label}</span>
                <span className="text-xs font-bold bg-bg text-text2 px-2 py-0.5 rounded-full">{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.map(a => (
                  <div key={a.id} onClick={() => onSelect(a)} className="bg-bg rounded-xl p-3 cursor-pointer hover:shadow-sm transition-all">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: a.couleur }}>{a.avatar}</div>
                      <span className="text-sm font-semibold text-text1 truncate">{a.nom}</span>
                    </div>
                    <p className="text-xs text-text3 truncate">{a.filiere}</p>
                    <span className={`mt-2 inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${
                      a.financement === 'OPCO' ? 'bg-primary-light text-primary' :
                      a.financement === 'CPF' ? 'bg-accent-light text-accent' : 'bg-border text-text2'
                    }`}>{a.financement}</span>
                  </div>
                ))}
                {items.length === 0 && <p className="text-xs text-text3 text-center py-4">Aucun apprenant</p>}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ApprenantDetail({ apprenant: a }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4 p-4 bg-bg rounded-2xl">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold" style={{ backgroundColor: a.couleur }}>{a.avatar}</div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-extrabold text-text1">{a.nom}</h2>
            <StatusBadge status={a.statut} />
          </div>
          <p className="text-sm text-text3">{a.filiere} · {a.age} ans</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Session', value: a.session },
          { label: 'Financement', value: a.financement },
          { label: 'Date inscription', value: a.dateInscription },
          { label: 'Statut', value: a.statut },
        ].map(({ label, value }) => (
          <div key={label} className="bg-bg rounded-xl p-3">
            <p className="label mb-1">{label}</p>
            <p className="text-sm font-semibold text-text1">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ApprenantForm({ onClose }) {
  const [form, setForm] = useState({ nom: '', age: '', filiere: '', financement: '', statut: 'Inscrit' })
  const [errors, setErrors] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.nom.trim()) errs.nom = 'Nom requis'
    if (!form.filiere) errs.filiere = 'Filière requise'
    if (Object.keys(errs).length) { setErrors(errs); return }
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label block mb-1">Nom complet</label>
        <input className={`input w-full ${errors.nom ? 'border-danger' : ''}`} placeholder="Ex: Amine Sebti" value={form.nom} onChange={e => setForm(p => ({ ...p, nom: e.target.value }))} />
        {errors.nom && <p className="text-xs text-danger mt-1">{errors.nom}</p>}
      </div>
      <div>
        <label className="label block mb-1">Âge</label>
        <input type="number" className="input w-full" placeholder="Ex: 24" value={form.age} onChange={e => setForm(p => ({ ...p, age: e.target.value }))} />
      </div>
      <div>
        <label className="label block mb-1">Filière</label>
        <select className={`input w-full ${errors.filiere ? 'border-danger' : ''}`} value={form.filiere} onChange={e => setForm(p => ({ ...p, filiere: e.target.value }))}>
          <option value="">Sélectionner...</option>
          <option>Développement Web</option>
          <option>Comptabilité</option>
          <option>Marketing Digital</option>
          <option>Informatique & Réseaux</option>
          <option>Gestion de Projet</option>
          <option>Ressources Humaines</option>
          <option>Langues</option>
          <option>Management</option>
          <option>Qualité & ISO</option>
          <option>Droit du Travail</option>
        </select>
        {errors.filiere && <p className="text-xs text-danger mt-1">{errors.filiere}</p>}
      </div>
      <div>
        <label className="label block mb-1">Mode de financement</label>
        <select className="input w-full" value={form.financement} onChange={e => setForm(p => ({ ...p, financement: e.target.value }))}>
          <option value="">Sélectionner...</option>
          <option>OPCO</option>
          <option>CPF</option>
          <option>Autofinancement</option>
        </select>
      </div>
      <div>
        <label className="label block mb-1">Statut initial</label>
        <select className="input w-full" value={form.statut} onChange={e => setForm(p => ({ ...p, statut: e.target.value }))}>
          <option>Prospect</option>
          <option>Inscrit</option>
          <option>En formation</option>
        </select>
      </div>
      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onClose} className="flex-1 btn-ghost border border-border">Annuler</button>
        <button type="submit" className="flex-1 btn-primary">Enregistrer</button>
      </div>
    </form>
  )
}
