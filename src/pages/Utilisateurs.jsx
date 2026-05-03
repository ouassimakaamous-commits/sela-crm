import { useState } from 'react'
import { Shield, UserCheck, GraduationCap, Plus, Trash2, Eye, EyeOff, AlertTriangle, Search, Users } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import Modal from '../components/common/Modal'
import SlidePanel from '../components/common/SlidePanel'
import StatusBadge from '../components/common/StatusBadge'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const STORAGE_KEY = 'sela_users'

const ROLE_CONFIG = {
  admin:     { label: 'Administrateur', icon: Shield,        bg: 'bg-primary/10',   text: 'text-primary',      border: 'border-primary/20' },
  formateur: { label: 'Formateur',      icon: UserCheck,     bg: 'bg-accent/10',    text: 'text-accent',       border: 'border-accent/20'  },
  apprenant: { label: 'Apprenant',      icon: GraduationCap, bg: 'bg-purple-100',   text: 'text-purple-600',   border: 'border-purple-200' },
}

const DEFAULT_USERS = [
  { id: 0, name: 'Administrateur', email: 'admin@centresela.ma', password: 'SelaAdmin2026!', role: 'admin', statut: 'Actif', createdAt: '2025-01-01' },
]

function loadUsers() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : DEFAULT_USERS
  } catch { return DEFAULT_USERS }
}

function saveUsers(users) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(users)) } catch {}
}

function initials(name) {
  return name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'XX'
}

const AVATAR_COLORS = ['#00839F', '#DCA35A', '#10B981', '#7C3AED', '#EF4444', '#F59E0B']
const avatarColor = (id) => AVATAR_COLORS[id % AVATAR_COLORS.length]

// ─────────────────────────────────────────────────────────────────────────────

export default function Utilisateurs() {
  const { user: currentUser } = useAuth()
  const [users, setUsers]     = useState(loadUsers)
  const [search, setSearch]   = useState('')
  const [filterRole, setFilterRole] = useState('Tous')
  const [showAdd, setShowAdd] = useState(false)
  const [toDelete, setToDelete] = useState(null)

  const persist = (next) => { setUsers(next); saveUsers(next) }

  const filtered = users.filter(u => {
    const ms = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const mr = filterRole === 'Tous' || u.role === filterRole
    return ms && mr
  })

  const handleAdd = (data) => {
    const id   = Date.now()
    const entry = {
      id, name: data.name, email: data.email.toLowerCase().trim(),
      password: data.password,
      role: data.role, statut: 'Actif',
      createdAt: new Date().toISOString().slice(0, 10),
    }
    const next = [entry, ...users]
    persist(next)
    toast.success(`Utilisateur « ${data.name} » créé avec succès`)
    setShowAdd(false)
  }

  const handleDelete = (u) => {
    if (u.email === currentUser?.email) {
      toast.error('Vous ne pouvez pas supprimer votre propre compte')
      return
    }
    setToDelete(u)
  }

  const confirmDelete = () => {
    const next = users.filter(u => u.id !== toDelete.id)
    persist(next)
    toast.success(`Utilisateur « ${toDelete.name} » supprimé`)
    setToDelete(null)
  }

  const toggleStatut = (id) => {
    const next = users.map(u => u.id === id ? { ...u, statut: u.statut === 'Actif' ? 'Inactif' : 'Actif' } : u)
    persist(next)
    const target = next.find(u => u.id === id)
    toast.success(`Compte ${target.statut === 'Actif' ? 'activé' : 'désactivé'}`)
  }

  const counts = {
    admin:     users.filter(u => u.role === 'admin').length,
    formateur: users.filter(u => u.role === 'formateur').length,
    apprenant: users.filter(u => u.role === 'apprenant').length,
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Utilisateurs"
        subtitle={`${users.length} compte${users.length > 1 ? 's' : ''} enregistré${users.length > 1 ? 's' : ''}`}
        onAdd={() => setShowAdd(true)}
        addLabel="Nouvel Utilisateur"
      />

      {/* Role KPIs */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(ROLE_CONFIG).map(([key, cfg]) => {
          const Icon = cfg.icon
          return (
            <div key={key} className="card p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                <Icon size={18} className={cfg.text} />
              </div>
              <div>
                <p className={`text-2xl font-extrabold ${cfg.text}`}>{counts[key]}</p>
                <p className="text-xs text-text3">{cfg.label}{counts[key] > 1 ? 's' : ''}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text3" />
          <input className="input w-full pl-9" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1">
          {['Tous', 'admin', 'formateur', 'apprenant'].map(r => (
            <button key={r} onClick={() => setFilterRole(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${filterRole === r ? 'bg-primary text-white' : 'bg-bg text-text2 hover:bg-border'}`}>
              {r === 'Tous' ? 'Tous' : ROLE_CONFIG[r]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden flex flex-col gap-3">
        {filtered.map(u => {
          const cfg  = ROLE_CONFIG[u.role] || ROLE_CONFIG.admin
          const Icon = cfg.icon
          const self = u.email === currentUser?.email
          return (
            <div key={u.id} className="card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ backgroundColor: avatarColor(u.id) }}>
                  {initials(u.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-text1 truncate">{u.name} {self && <span className="text-xs text-text3">(vous)</span>}</p>
                  <p className="text-xs text-text3 truncate">{u.email}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                  <Icon size={9} /> {cfg.label}
                </span>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <StatusBadge status={u.statut} />
                <div className="flex gap-1">
                  <button onClick={() => toggleStatut(u.id)}
                    className="px-2 py-1 rounded-lg text-xs font-medium bg-bg hover:bg-border text-text2 transition-colors">
                    {u.statut === 'Actif' ? 'Désactiver' : 'Activer'}
                  </button>
                  {!self && (
                    <button onClick={() => handleDelete(u)}
                      className="w-7 h-7 rounded-lg bg-danger/10 hover:bg-danger flex items-center justify-center text-danger hover:text-white transition-all">
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-bg">
              <th className="text-left px-5 py-3 label">Utilisateur</th>
              <th className="text-left px-5 py-3 label">Email</th>
              <th className="text-center px-5 py-3 label">Rôle</th>
              <th className="text-center px-5 py-3 label">Statut</th>
              <th className="text-center px-5 py-3 label">Créé le</th>
              <th className="text-center px-5 py-3 label">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map(u => {
              const cfg  = ROLE_CONFIG[u.role] || ROLE_CONFIG.admin
              const Icon = cfg.icon
              const self = u.email === currentUser?.email
              return (
                <tr key={u.id} className={`hover:bg-bg transition-colors ${self ? 'bg-primary/3' : ''}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: avatarColor(u.id) }}>
                        {initials(u.name)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text1">{u.name}</p>
                        {self && <p className="text-[10px] text-primary font-semibold">Compte actuel</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-text2">{u.email}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                      <Icon size={10} /> {cfg.label}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <button onClick={() => toggleStatut(u.id)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-full transition-all cursor-pointer hover:opacity-80 ${u.statut === 'Actif' ? 'bg-success/10 text-success' : 'bg-text3/10 text-text3'}`}>
                      {u.statut}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-center text-sm text-text3">{u.createdAt}</td>
                  <td className="px-5 py-3 text-center">
                    {self ? (
                      <span className="text-xs text-text3 italic">—</span>
                    ) : (
                      <button
                        onClick={() => handleDelete(u)}
                        className="w-8 h-8 rounded-xl bg-danger/10 hover:bg-danger flex items-center justify-center text-danger hover:text-white transition-all mx-auto"
                        title="Supprimer"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <Users size={36} className="mx-auto text-text3 opacity-30 mb-3" />
            <p className="text-text2 font-medium">Aucun utilisateur trouvé</p>
          </div>
        )}

        <div className="px-5 py-3 border-t border-border bg-bg">
          <span className="text-sm text-text3">{filtered.length} utilisateur{filtered.length > 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Add panel */}
      <SlidePanel open={showAdd} onClose={() => setShowAdd(false)} title="Nouvel Utilisateur">
        <UserForm onClose={() => setShowAdd(false)} onAdd={handleAdd} existingEmails={users.map(u => u.email)} />
      </SlidePanel>

      {/* Delete confirmation modal */}
      <Modal open={!!toDelete} onClose={() => setToDelete(null)} title="Confirmer la suppression" size="sm">
        {toDelete && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-danger/5 border border-danger/20 rounded-2xl">
              <AlertTriangle size={20} className="text-danger flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-text1">Supprimer « {toDelete.name} » ?</p>
                <p className="text-xs text-text3 mt-0.5">Cette action est irréversible. L'utilisateur perdra tout accès.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setToDelete(null)} className="flex-1 btn-ghost border border-border">Annuler</button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 rounded-xl text-sm font-semibold bg-danger text-white hover:bg-red-700 transition-colors"
              >
                Supprimer définitivement
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

// ── User form ─────────────────────────────────────────────────────────────────
function UserForm({ onClose, onAdd, existingEmails }) {
  const [form, setForm]     = useState({ name: '', email: '', password: '', role: 'formateur' })
  const [errors, setErrors] = useState({})
  const [showPwd, setShowPwd] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.name.trim())    errs.name  = 'Nom requis'
    if (!form.email.trim())   errs.email = 'Email requis'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Email invalide'
    else if (existingEmails.includes(form.email.toLowerCase().trim())) errs.email = 'Email déjà utilisé'
    if (!form.password || form.password.length < 6) errs.password = 'Mot de passe min. 6 caractères'
    if (Object.keys(errs).length) { setErrors(errs); return }
    onAdd(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label block mb-1">Nom complet</label>
        <input className={`input w-full ${errors.name ? 'border-danger' : ''}`} placeholder="Ex: Karim Benali" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
        {errors.name && <p className="text-xs text-danger mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="label block mb-1">Email</label>
        <input type="email" className={`input w-full ${errors.email ? 'border-danger' : ''}`} placeholder="email@centresela.ma" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
        {errors.email && <p className="text-xs text-danger mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="label block mb-1">Mot de passe</label>
        <div className="relative">
          <input
            type={showPwd ? 'text' : 'password'}
            className={`input w-full pr-10 ${errors.password ? 'border-danger' : ''}`}
            placeholder="Min. 6 caractères"
            value={form.password}
            onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
          />
          <button type="button" onClick={() => setShowPwd(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text3 hover:text-text1 transition-colors">
            {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-danger mt-1">{errors.password}</p>}
      </div>

      <div>
        <label className="label block mb-1">Rôle</label>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(ROLE_CONFIG).map(([key, cfg]) => {
            const Icon = cfg.icon
            return (
              <button
                type="button"
                key={key}
                onClick={() => setForm(p => ({ ...p, role: key }))}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs font-semibold transition-all ${form.role === key ? `${cfg.bg} ${cfg.text} ${cfg.border} border-opacity-100` : 'bg-bg text-text2 border-transparent hover:border-border'}`}
              >
                <Icon size={18} className={form.role === key ? cfg.text : 'text-text3'} />
                {cfg.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="p-3 bg-bg rounded-xl text-xs text-text3 flex items-start gap-2">
        <AlertTriangle size={12} className="mt-0.5 flex-shrink-0 text-warning" />
        Le mot de passe est stocké localement. En production, utilisez un système d'authentification sécurisé.
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="flex-1 btn-ghost border border-border">Annuler</button>
        <button type="submit" className="flex-1 btn-primary flex items-center justify-center gap-2">
          <Plus size={14} /> Créer le compte
        </button>
      </div>
    </form>
  )
}
