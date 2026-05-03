import { useState } from 'react'
import { Search, Download, Eye, Edit2, Clock, TrendingUp } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts'
import PageHeader from '../components/common/PageHeader'
import StatusBadge from '../components/common/StatusBadge'
import QuotaBar from '../components/common/QuotaBar'
import Modal from '../components/common/Modal'
import SlidePanel from '../components/common/SlidePanel'
import { formateurs, hsHistoriqueAnnuel, heuresSup } from '../data/mockData'

export default function Formateurs() {
  const [search, setSearch] = useState('')
  const [filterStatut, setFilterStatut] = useState('Tous')
  const [selectedFormateur, setSelectedFormateur] = useState(null)
  const [showAddPanel, setShowAddPanel] = useState(false)
  const [page, setPage] = useState(1)
  const perPage = 8

  const filtered = formateurs.filter(f => {
    const matchSearch = f.nom.toLowerCase().includes(search.toLowerCase()) || f.specialite.toLowerCase().includes(search.toLowerCase())
    const matchStatut = filterStatut === 'Tous' || f.statut === filterStatut
    return matchSearch && matchStatut
  })

  const paginated = filtered.slice((page - 1) * perPage, page * perPage)
  const totalPages = Math.ceil(filtered.length / perPage)

  return (
    <div>
      <PageHeader
        title="Formateurs"
        subtitle={`${formateurs.length} formateurs enregistrés`}
        onAdd={() => setShowAddPanel(true)}
        addLabel="Nouveau Formateur"
        extra={
          <button className="flex items-center gap-2 bg-bg border border-border text-text2 px-3 py-2 rounded-xl text-sm font-medium hover:bg-border transition-colors">
            <Download size={14} /> Export Excel
          </button>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text3" />
          <input
            className="input w-full pl-9"
            placeholder="Rechercher un formateur..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <select className="input" value={filterStatut} onChange={e => { setFilterStatut(e.target.value); setPage(1) }}>
          <option>Tous</option>
          <option>Actif</option>
          <option>En congé</option>
          <option>Quota dépassé</option>
        </select>
        <select className="input">
          <option>Toutes spécialités</option>
          <option>Développement Web</option>
          <option>Comptabilité & Finance</option>
          <option>Ressources Humaines</option>
          <option>Marketing Digital</option>
          <option>Informatique & Réseaux</option>
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-bg">
                <th className="text-left px-4 py-3 label">Formateur</th>
                <th className="text-left px-4 py-3 label">Spécialité</th>
                <th className="text-center px-4 py-3 label">Sessions</th>
                <th className="text-center px-4 py-3 label">HSA mois</th>
                <th className="text-center px-4 py-3 label">HSE mois</th>
                <th className="text-center px-4 py-3 label">Total HS</th>
                <th className="text-left px-4 py-3 label min-w-[140px]">Quota restant</th>
                <th className="text-center px-4 py-3 label">Statut</th>
                <th className="text-center px-4 py-3 label">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.map((f) => {
                const exceeded = f.statut === 'Quota dépassé'
                return (
                  <tr
                    key={f.id}
                    className={`hover:bg-bg transition-colors ${exceeded ? 'border-l-4 border-danger' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ backgroundColor: f.couleur }}>
                          {f.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-text1 text-sm">{f.nom}</p>
                          <p className="text-xs text-text3">{f.grade}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-text2">{f.specialite}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-semibold text-text1">{f.sessionsParMois}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-semibold text-primary">{f.hsaMois}h</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-semibold text-accent">{f.hseMois}h</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-sm font-bold ${exceeded ? 'text-danger' : 'text-text1'}`}>{f.totalHS}h</span>
                    </td>
                    <td className="px-4 py-3 min-w-[140px]">
                      <QuotaBar used={f.totalHS} total={f.quotaMensuel} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={f.statut} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setSelectedFormateur(f)}
                          className="w-8 h-8 rounded-xl hover:bg-primary-light flex items-center justify-center text-text3 hover:text-primary transition-colors"
                          title="Voir profil"
                        >
                          <Eye size={14} />
                        </button>
                        <button className="w-8 h-8 rounded-xl hover:bg-bg flex items-center justify-center text-text3 hover:text-text1 transition-colors" title="Modifier">
                          <Edit2 size={14} />
                        </button>
                        <button className="w-8 h-8 rounded-xl hover:bg-accent-light flex items-center justify-center text-text3 hover:text-accent transition-colors" title="Saisir HS">
                          <Clock size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <span className="text-sm text-text3">{filtered.length} formateur(s) trouvé(s)</span>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  p === page ? 'bg-primary text-white' : 'text-text2 hover:bg-bg'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal open={!!selectedFormateur} onClose={() => setSelectedFormateur(null)} title="Profil Formateur" size="lg">
        {selectedFormateur && <FormateurDetail formateur={selectedFormateur} />}
      </Modal>

      {/* Add Panel */}
      <SlidePanel open={showAddPanel} onClose={() => setShowAddPanel(false)} title="Nouveau Formateur">
        <FormateurForm onClose={() => setShowAddPanel(false)} />
      </SlidePanel>
    </div>
  )
}

function FormateurDetail({ formateur: f }) {
  const hsData = hsHistoriqueAnnuel
  const fHistory = heuresSup.filter(h => h.formateurId === f.id)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 bg-bg rounded-2xl">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0" style={{ backgroundColor: f.couleur }}>
          {f.avatar}
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-extrabold text-text1">{f.nom}</h2>
            <StatusBadge status={f.statut} />
          </div>
          <p className="text-sm text-text3 mt-0.5">{f.specialite} · {f.grade}</p>
          <p className="text-xs text-text3">{f.email} · {f.telephone}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Sessions/mois', value: f.sessionsParMois, color: 'text-text1' },
          { label: 'HS ce mois', value: `${f.totalHS}h`, color: 'text-primary' },
          { label: 'Quota utilisé', value: `${Math.round((f.totalHS / f.quotaMensuel) * 100)}%`, color: f.totalHS > f.quotaMensuel ? 'text-danger' : 'text-success' },
          { label: 'Taux horaire', value: `${f.tauxHoraire} MAD`, color: 'text-accent' },
        ].map(s => (
          <div key={s.label} className="bg-bg rounded-2xl p-3 text-center">
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-text3 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quota bar */}
      <div>
        <p className="text-sm font-semibold text-text2 mb-2">Quota mensuel</p>
        <QuotaBar used={f.totalHS} total={f.quotaMensuel} />
      </div>

      {/* Chart */}
      <div>
        <p className="text-sm font-semibold text-text2 mb-3">Évolution des HS (12 mois)</p>
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={hsData}>
            <XAxis dataKey="mois" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey="hsa" stroke="#00839F" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="hse" stroke="#DCA35A" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* History table */}
      {fHistory.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-text2 mb-3">Historique des heures</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left pb-2 label">Date</th>
                  <th className="text-left pb-2 label">Session</th>
                  <th className="text-center pb-2 label">Type</th>
                  <th className="text-center pb-2 label">Heures</th>
                  <th className="text-right pb-2 label">Montant</th>
                  <th className="text-center pb-2 label">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {fHistory.map(h => (
                  <tr key={h.id}>
                    <td className="py-2 text-text2">{h.date}</td>
                    <td className="py-2 text-text2">{h.session}</td>
                    <td className="py-2 text-center">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${h.type === 'HSA' ? 'bg-primary-light text-primary' : 'bg-accent-light text-accent'}`}>{h.type}</span>
                    </td>
                    <td className="py-2 text-center font-semibold text-text1">{h.heures}h</td>
                    <td className="py-2 text-right font-semibold text-text1">{h.montantFinal.toLocaleString('fr-MA')} MAD</td>
                    <td className="py-2 text-center"><StatusBadge status={h.statut} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function FormateurForm({ onClose }) {
  const [form, setForm] = useState({ nom: '', email: '', telephone: '', specialite: '', grade: '', tauxHoraire: '' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.nom.trim()) e.nom = 'Nom requis'
    if (!form.email.trim()) e.email = 'Email requis'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email invalide'
    if (!form.specialite.trim()) e.specialite = 'Spécialité requise'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {[
        { key: 'nom', label: 'Nom complet', placeholder: 'Ex: Karim Benali' },
        { key: 'email', label: 'Email', placeholder: 'k.benali@centresela.ma', type: 'email' },
        { key: 'telephone', label: 'Téléphone', placeholder: '+212 6 61 23 45 67' },
      ].map(({ key, label, placeholder, type = 'text' }) => (
        <div key={key}>
          <label className="label block mb-1">{label}</label>
          <input
            type={type}
            className={`input w-full ${errors[key] ? 'border-danger' : ''}`}
            placeholder={placeholder}
            value={form[key]}
            onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
          />
          {errors[key] && <p className="text-xs text-danger mt-1">{errors[key]}</p>}
        </div>
      ))}
      <div>
        <label className="label block mb-1">Spécialité</label>
        <select
          className={`input w-full ${errors.specialite ? 'border-danger' : ''}`}
          value={form.specialite}
          onChange={e => setForm(p => ({ ...p, specialite: e.target.value }))}
        >
          <option value="">Sélectionner...</option>
          <option>Développement Web</option>
          <option>Comptabilité & Finance</option>
          <option>Ressources Humaines</option>
          <option>Marketing Digital</option>
          <option>Informatique & Réseaux</option>
          <option>Langues</option>
          <option>Gestion de Projet</option>
          <option>Management & Leadership</option>
          <option>Droit du Travail</option>
          <option>Qualité & ISO</option>
        </select>
        {errors.specialite && <p className="text-xs text-danger mt-1">{errors.specialite}</p>}
      </div>
      <div>
        <label className="label block mb-1">Grade</label>
        <select className="input w-full" value={form.grade} onChange={e => setForm(p => ({ ...p, grade: e.target.value }))}>
          <option value="">Sélectionner...</option>
          <option>Formateur</option>
          <option>Formateur confirmé</option>
          <option>Formateur principal</option>
          <option>Formateur senior</option>
          <option>Formateur expert</option>
        </select>
      </div>
      <div>
        <label className="label block mb-1">Taux horaire (MAD)</label>
        <input
          type="number"
          className="input w-full"
          placeholder="120"
          value={form.tauxHoraire}
          onChange={e => setForm(p => ({ ...p, tauxHoraire: e.target.value }))}
        />
      </div>
      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onClose} className="flex-1 btn-ghost border border-border">Annuler</button>
        <button type="submit" className="flex-1 btn-primary">Enregistrer</button>
      </div>
    </form>
  )
}
