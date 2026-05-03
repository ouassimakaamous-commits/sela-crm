import { useState } from 'react'
import { Search, CheckCircle, XCircle, Clock, AlertTriangle, Upload, Info } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import StatusBadge from '../components/common/StatusBadge'
import QuotaBar from '../components/common/QuotaBar'
import SlidePanel from '../components/common/SlidePanel'
import { heuresSup, formateurs, sessions } from '../data/mockData'

const MAJORATION_RULES = [
  { label: 'Lun–Ven  06h–21h', pct: 25 },
  { label: 'Lun–Ven  21h–06h', pct: 50 },
  { label: 'Sam–Dim  06h–21h', pct: 50 },
  { label: 'Sam–Dim  21h–06h', pct: 100 },
]

function KPICard({ label, value, sub, color, icon: Icon, bgColor }) {
  return (
    <div className={`card p-5 flex items-center gap-4`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${bgColor}`}>
        <Icon size={22} className={color} />
      </div>
      <div>
        <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
        <p className="text-sm font-semibold text-text1">{label}</p>
        {sub && <p className="text-xs text-text3">{sub}</p>}
      </div>
    </div>
  )
}

export default function HeuresSup() {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('Tous')
  const [filterStatut, setFilterStatut] = useState('Tous')
  const [filterFormateur, setFilterFormateur] = useState('Tous')
  const [showForm, setShowForm] = useState(false)
  const [bulkSelected, setBulkSelected] = useState([])
  const [data, setData] = useState(heuresSup)

  const filtered = data.filter(h => {
    const ms = h.formateur.toLowerCase().includes(search.toLowerCase()) || h.session.toLowerCase().includes(search.toLowerCase())
    const mt = filterType === 'Tous' || h.type === filterType
    const mst = filterStatut === 'Tous' || h.statut === filterStatut
    const mf = filterFormateur === 'Tous' || h.formateur === filterFormateur
    return ms && mt && mst && mf
  })

  const totalHSA = data.filter(h => h.type === 'HSA' && h.statut !== 'Refusé').reduce((a, h) => a + h.heures, 0)
  const totalHSE = data.filter(h => h.type === 'HSE' && h.statut !== 'Refusé').reduce((a, h) => a + h.heures, 0)
  const montantTotal = data.filter(h => h.statut === 'Validé').reduce((a, h) => a + h.montantFinal, 0)
  const nbDepassement = formateurs.filter(f => f.statut === 'Quota dépassé').length

  const toggleBulk = (id) => setBulkSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
  const bulkValidate = () => {
    setData(d => d.map(h => bulkSelected.includes(h.id) && h.statut === 'En attente' ? { ...h, statut: 'Validé', validepar: 'Admin SELA' } : h))
    setBulkSelected([])
  }

  const validateOne = (id) => {
    setData(d => d.map(h => h.id === id ? { ...h, statut: 'Validé', validepar: 'Admin SELA' } : h))
  }

  const refuseOne = (id) => {
    setData(d => d.map(h => h.id === id ? { ...h, statut: 'Refusé', validepar: 'Admin SELA' } : h))
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Heures Supplémentaires"
        subtitle="Gestion et validation des heures supplémentaires"
        onAdd={() => setShowForm(true)}
        addLabel="Saisir Heures Sup"
      />

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Total HSA ce mois" value={`${totalHSA}h`} sub="Heures supplémentaires A" color="text-primary" bgColor="bg-primary-light" icon={Clock} />
        <KPICard label="Total HSE ce mois" value={`${totalHSE}h`} sub="Heures supplémentaires E" color="text-accent" bgColor="bg-accent-light" icon={Clock} />
        <KPICard label="Montant total brut" value={`${(montantTotal / 1000).toFixed(1)}k MAD`} sub="Heures validées" color="text-success" bgColor="bg-success/10" icon={CheckCircle} />
        <KPICard label="En dépassement quota" value={nbDepassement} sub="Formateurs concernés" color="text-danger" bgColor="bg-danger/10" icon={AlertTriangle} />
      </div>

      {/* Main content + quota sidebar */}
      <div className="flex flex-col lg:flex-row gap-5">
        <div className="flex-1 min-w-0">
          {/* Filters */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text3" />
              <input className="input pl-9 w-56" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="input" value={filterFormateur} onChange={e => setFilterFormateur(e.target.value)}>
              <option value="Tous">Tous formateurs</option>
              {formateurs.map(f => <option key={f.id}>{f.nom}</option>)}
            </select>
            <select className="input" value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="Tous">Type: Tous</option>
              <option value="HSA">HSA</option>
              <option value="HSE">HSE</option>
            </select>
            <select className="input" value={filterStatut} onChange={e => setFilterStatut(e.target.value)}>
              <option value="Tous">Statut: Tous</option>
              <option value="En attente">En attente</option>
              <option value="Validé">Validé</option>
              <option value="Refusé">Refusé</option>
            </select>
            {bulkSelected.length > 0 && (
              <button onClick={bulkValidate} className="flex items-center gap-2 bg-success text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors">
                <CheckCircle size={14} /> Valider {bulkSelected.length} sélection(s)
              </button>
            )}
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden flex flex-col gap-3 mb-4">
            {filtered.map((h) => {
              const f = formateurs.find(x => x.id === h.formateurId)
              const exceeded = f && f.totalHS > f.quotaMensuel
              const nearQuota = f && (f.totalHS / f.quotaMensuel) >= 0.8 && !exceeded
              return (
                <div key={h.id} className={`card p-4 ${exceeded ? 'border-l-4 border-danger' : nearQuota ? 'border-l-4 border-warning' : ''}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: h.couleur }}>{h.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-text1">{h.formateur}</p>
                      <p className="text-xs text-text3 truncate">{h.session}</p>
                    </div>
                    <StatusBadge status={h.statut} />
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-bg rounded-xl p-2 text-center">
                      <p className="text-sm font-bold text-text1">{h.heures}h</p>
                      <p className="text-[10px] text-text3">Heures</p>
                    </div>
                    <div className="bg-bg rounded-xl p-2 text-center">
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${h.type === 'HSA' ? 'bg-primary-light text-primary' : 'bg-accent-light text-accent'}`}>{h.type}</span>
                      <p className="text-[10px] text-text3 mt-1">Type</p>
                    </div>
                    <div className="bg-bg rounded-xl p-2 text-center">
                      <p className="text-sm font-bold text-primary">{(h.montantFinal / 1000).toFixed(1)}k</p>
                      <p className="text-[10px] text-text3">MAD</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text3">{h.date} · +{h.majoration}%</span>
                    {h.statut === 'En attente' && (
                      <div className="flex gap-1">
                        <button onClick={() => validateOne(h.id)} className="w-8 h-8 rounded-xl bg-success/10 hover:bg-success flex items-center justify-center text-success hover:text-white transition-all"><CheckCircle size={14} /></button>
                        <button onClick={() => refuseOne(h.id)} className="w-8 h-8 rounded-xl bg-danger/10 hover:bg-danger flex items-center justify-center text-danger hover:text-white transition-all"><XCircle size={14} /></button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
            {filtered.length === 0 && <p className="text-center text-text3 py-8">Aucune heure supplémentaire trouvée</p>}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-bg">
                    <th className="px-3 py-3 w-8">
                      <input type="checkbox" className="rounded" onChange={e => {
                        if (e.target.checked) setBulkSelected(filtered.filter(h => h.statut === 'En attente').map(h => h.id))
                        else setBulkSelected([])
                      }} />
                    </th>
                    <th className="text-left px-3 py-3 label">Formateur</th>
                    <th className="text-center px-3 py-3 label">Date</th>
                    <th className="text-left px-3 py-3 label">Session</th>
                    <th className="text-center px-3 py-3 label">Type</th>
                    <th className="text-center px-3 py-3 label">Heures</th>
                    <th className="text-center px-3 py-3 label">Taux</th>
                    <th className="text-center px-3 py-3 label">Brut</th>
                    <th className="text-center px-3 py-3 label">Majoration</th>
                    <th className="text-center px-3 py-3 label">Final</th>
                    <th className="text-center px-3 py-3 label">Statut</th>
                    <th className="text-center px-3 py-3 label">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((h) => {
                    const f = formateurs.find(x => x.id === h.formateurId)
                    const nearQuota = f && (f.totalHS / f.quotaMensuel) >= 0.8 && f.totalHS <= f.quotaMensuel
                    const exceeded = f && f.totalHS > f.quotaMensuel
                    return (
                      <tr
                        key={h.id}
                        className={`hover:bg-bg transition-colors ${exceeded ? 'bg-danger/5 border-l-4 border-danger' : nearQuota ? 'bg-warning/5 border-l-4 border-warning' : ''}`}
                      >
                        <td className="px-3 py-3">
                          <input
                            type="checkbox"
                            className="rounded"
                            checked={bulkSelected.includes(h.id)}
                            onChange={() => h.statut === 'En attente' && toggleBulk(h.id)}
                            disabled={h.statut !== 'En attente'}
                          />
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: h.couleur }}>
                              {h.avatar}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-text1">{h.formateur}</p>
                              {h.validepar && <p className="text-xs text-text3">Par: {h.validepar}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center text-sm text-text2">{h.date}</td>
                        <td className="px-3 py-3 text-sm text-text2 max-w-[140px] truncate">{h.session}</td>
                        <td className="px-3 py-3 text-center">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${h.type === 'HSA' ? 'bg-primary-light text-primary' : 'bg-accent-light text-accent'}`}>{h.type}</span>
                        </td>
                        <td className="px-3 py-3 text-center font-bold text-text1 text-sm">{h.heures}h</td>
                        <td className="px-3 py-3 text-center text-sm text-text2">{h.tauxHoraire} MAD</td>
                        <td className="px-3 py-3 text-center text-sm text-text1">{h.montantBrut.toLocaleString('fr-MA')}</td>
                        <td className="px-3 py-3 text-center">
                          <span className="text-xs font-bold text-warning bg-warning/10 px-2 py-0.5 rounded-full">+{h.majoration}%</span>
                        </td>
                        <td className="px-3 py-3 text-center font-bold text-primary">{h.montantFinal.toLocaleString('fr-MA')} MAD</td>
                        <td className="px-3 py-3 text-center"><StatusBadge status={h.statut} /></td>
                        <td className="px-3 py-3">
                          {h.statut === 'En attente' ? (
                            <div className="flex items-center justify-center gap-1">
                              <button onClick={() => validateOne(h.id)} className="w-7 h-7 rounded-lg bg-success/10 hover:bg-success flex items-center justify-center text-success hover:text-white transition-all" title="Valider">
                                <CheckCircle size={13} />
                              </button>
                              <button onClick={() => refuseOne(h.id)} className="w-7 h-7 rounded-lg bg-danger/10 hover:bg-danger flex items-center justify-center text-danger hover:text-white transition-all" title="Refuser">
                                <XCircle size={13} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-text3">{h.validepar || '—'}</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-text3">
                <Clock size={32} className="mx-auto mb-2 opacity-30" />
                <p className="font-medium">Aucune heure supplémentaire trouvée</p>
              </div>
            )}
            <div className="px-4 py-3 border-t border-border flex justify-between items-center">
              <span className="text-sm text-text3">{filtered.length} entrée(s)</span>
              <span className="text-sm font-semibold text-text2">
                Total validé: <span className="text-primary font-bold">{filtered.filter(h => h.statut === 'Validé').reduce((a, h) => a + h.montantFinal, 0).toLocaleString('fr-MA')} MAD</span>
              </span>
            </div>
          </div>
        </div>

        {/* Quota Sidebar */}
        <div className="w-full lg:w-72 lg:flex-shrink-0">
          <div className="card p-4">
            <p className="font-bold text-text1 mb-4">Quota par formateur</p>
            <div className="space-y-4">
              {formateurs.map(f => (
                <div key={f.id} className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0" style={{ backgroundColor: f.couleur }}>
                      {f.avatar}
                    </div>
                    <span className="text-sm font-semibold text-text1 truncate flex-1">{f.nom.split(' ')[0]}</span>
                    <StatusBadge status={f.statut} size="xs" />
                  </div>
                  <QuotaBar used={f.totalHS} total={f.quotaMensuel} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Form Panel */}
      <SlidePanel open={showForm} onClose={() => setShowForm(false)} title="Saisie Heures Supplémentaires">
        <HSForm onClose={() => setShowForm(false)} />
      </SlidePanel>
    </div>
  )
}

function HSForm({ onClose }) {
  const [form, setForm] = useState({
    formateur: '', session: '', date: '', type: 'HSA', heures: '',
    description: '', jourSemaine: 'semaine', plageHoraire: 'jour'
  })
  const [errors, setErrors] = useState({})

  const getMajoration = () => {
    if (form.jourSemaine === 'weekend' && form.plageHoraire === 'nuit') return 100
    if (form.jourSemaine === 'weekend' && form.plageHoraire === 'jour') return 50
    if (form.jourSemaine === 'semaine' && form.plageHoraire === 'nuit') return 50
    return 25
  }

  const tauxHoraire = form.formateur ? (formateurs.find(f => f.nom === form.formateur)?.tauxHoraire || 100) : 100
  const majoration = getMajoration()
  const montantBrut = (parseFloat(form.heures) || 0) * tauxHoraire
  const montantFinal = montantBrut * (1 + majoration / 100)

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.formateur) errs.formateur = 'Formateur requis'
    if (!form.date) errs.date = 'Date requise'
    if (!form.heures || isNaN(parseFloat(form.heures)) || parseFloat(form.heures) <= 0) errs.heures = 'Nombre d\'heures invalide'
    if (Object.keys(errs).length) { setErrors(errs); return }
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Formateur */}
      <div>
        <label className="label block mb-1">Formateur</label>
        <select className={`input w-full ${errors.formateur ? 'border-danger' : ''}`} value={form.formateur} onChange={e => setForm(p => ({ ...p, formateur: e.target.value }))}>
          <option value="">Sélectionner...</option>
          {formateurs.map(f => <option key={f.id}>{f.nom}</option>)}
        </select>
        {errors.formateur && <p className="text-xs text-danger mt-1">{errors.formateur}</p>}
      </div>

      {/* Session liée */}
      <div>
        <label className="label block mb-1">Session liée <span className="text-text3">(optionnel)</span></label>
        <select className="input w-full" value={form.session} onChange={e => setForm(p => ({ ...p, session: e.target.value }))}>
          <option value="">Aucune session</option>
          {sessions.map(s => <option key={s.id}>{s.intitule.split('–')[0].trim()}</option>)}
        </select>
      </div>

      {/* Date */}
      <div>
        <label className="label block mb-1">Date</label>
        <input type="date" className={`input w-full ${errors.date ? 'border-danger' : ''}`} value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
        {errors.date && <p className="text-xs text-danger mt-1">{errors.date}</p>}
      </div>

      {/* Type toggle */}
      <div>
        <label className="label block mb-1">Type d'heures</label>
        <div className="flex gap-2">
          {['HSA', 'HSE'].map(t => (
            <button type="button" key={t} onClick={() => setForm(p => ({ ...p, type: t }))}
              className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all ${form.type === t ? t === 'HSA' ? 'bg-primary text-white border-primary' : 'bg-accent text-white border-accent' : 'bg-bg text-text2 border-border'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Heures */}
      <div>
        <label className="label block mb-1">Nombre d'heures</label>
        <input type="number" step="0.5" min="0.5" className={`input w-full ${errors.heures ? 'border-danger' : ''}`} placeholder="Ex: 4" value={form.heures} onChange={e => setForm(p => ({ ...p, heures: e.target.value }))} />
        {errors.heures && <p className="text-xs text-danger mt-1">{errors.heures}</p>}
      </div>

      {/* Majoration calculator */}
      <div className="bg-bg rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-text1">
          <Info size={14} className="text-primary" /> Calcul de majoration
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="label block mb-1">Jour</label>
            <select className="input w-full text-sm" value={form.jourSemaine} onChange={e => setForm(p => ({ ...p, jourSemaine: e.target.value }))}>
              <option value="semaine">Lun–Ven</option>
              <option value="weekend">Sam–Dim</option>
            </select>
          </div>
          <div>
            <label className="label block mb-1">Plage horaire</label>
            <select className="input w-full text-sm" value={form.plageHoraire} onChange={e => setForm(p => ({ ...p, plageHoraire: e.target.value }))}>
              <option value="jour">06h–21h</option>
              <option value="nuit">21h–06h</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 text-xs border-t border-border pt-3">
          {MAJORATION_RULES.map(r => (
            <div key={r.label} className={`flex justify-between items-center px-2 py-1 rounded-lg ${r.pct === majoration && ((r.label.includes('Sam') ? form.jourSemaine === 'weekend' : form.jourSemaine === 'semaine') && (r.label.includes('21h-06h') || r.label.includes('21h–06h') ? form.plageHoraire === 'nuit' : form.plageHoraire === 'jour')) ? 'bg-accent-light' : ''}`}>
              <span className="text-text2">{r.label}</span>
              <span className="font-bold text-accent">+{r.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Amount preview */}
      {form.heures && (
        <div className="bg-primary-light rounded-2xl p-4 space-y-2">
          <p className="text-xs font-bold text-primary mb-1">Aperçu du montant</p>
          <div className="flex justify-between text-sm">
            <span className="text-text2">Taux horaire</span>
            <span className="font-semibold text-text1">{tauxHoraire} MAD/h</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text2">Montant brut</span>
            <span className="font-semibold text-text1">{montantBrut.toLocaleString('fr-MA')} MAD</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text2">Majoration (+{majoration}%)</span>
            <span className="font-semibold text-warning">+{(montantFinal - montantBrut).toLocaleString('fr-MA', { maximumFractionDigits: 0 })} MAD</span>
          </div>
          <div className="flex justify-between text-sm border-t border-primary/20 pt-2">
            <span className="font-bold text-primary">Montant final</span>
            <span className="font-extrabold text-primary text-base">{montantFinal.toLocaleString('fr-MA', { maximumFractionDigits: 0 })} MAD</span>
          </div>
        </div>
      )}

      {/* Description */}
      <div>
        <label className="label block mb-1">Description / Motif</label>
        <textarea className="input w-full" rows={3} placeholder="Décrivez le motif des heures supplémentaires..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
      </div>

      {/* File upload */}
      <div>
        <label className="label block mb-1">Pièce justificative</label>
        <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center hover:border-primary transition-colors cursor-pointer">
          <Upload size={20} className="mx-auto text-text3 mb-2" />
          <p className="text-sm text-text3">Glisser-déposer un fichier ou <span className="text-primary font-semibold">parcourir</span></p>
          <p className="text-xs text-text3 mt-1">PDF, JPG, PNG jusqu'à 10 MB</p>
        </div>
      </div>

      <div className="bg-warning/10 border border-warning/30 rounded-xl p-3 text-xs text-warning font-medium">
        ⚠️ Cette saisie sera soumise en statut "En attente" et devra être validée par l'administration.
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="flex-1 btn-ghost border border-border">Annuler</button>
        <button type="submit" className="flex-1 btn-primary">Soumettre pour validation</button>
      </div>
    </form>
  )
}
