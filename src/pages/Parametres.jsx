import { useState, useRef } from 'react'
import { Save, Upload, Trash2, User, Bell, Link2, Shield, Clock, DollarSign } from 'lucide-react'
import { useLogo } from '../context/LogoContext'

const TABS = [
  { id: 'centre', label: 'Centre', icon: User },
  { id: 'quotas', label: 'Quotas HS', icon: Clock },
  { id: 'tarifs', label: 'Tarifs horaires', icon: DollarSign },
  { id: 'utilisateurs', label: 'Utilisateurs', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'integrations', label: 'Intégrations', icon: Link2 },
]

const UTILISATEURS = [
  { id: 1, nom: 'Sélim Akarous', email: 'admin@centresela.ma', role: 'Admin', statut: 'Actif', avatar: 'SA', couleur: '#00839F' },
  { id: 2, nom: 'Rachida Mellouk', email: 'r.mellouk@centresela.ma', role: 'Gestionnaire', statut: 'Actif', avatar: 'RM', couleur: '#DCA35A' },
  { id: 3, nom: 'Omar Fassi', email: 'o.fassi@centresela.ma', role: 'Formateur', statut: 'Actif', avatar: 'OF', couleur: '#7C3AED' },
  { id: 4, nom: 'Amina Cherkaoui', email: 'a.cherkaoui@centresela.ma', role: 'Viewer', statut: 'Inactif', avatar: 'AC', couleur: '#94A3B8' },
]

const GRADES = [
  { grade: 'Formateur', taux: 95 },
  { grade: 'Formateur confirmé', taux: 105 },
  { grade: 'Formateur principal', taux: 120 },
  { grade: 'Formateur senior', taux: 130 },
  { grade: 'Formateur expert', taux: 145 },
]

const ROLE_COLORS = {
  Admin: 'bg-primary-light text-primary',
  Gestionnaire: 'bg-accent-light text-accent',
  Formateur: 'bg-purple-50 text-purple-700',
  Viewer: 'bg-bg text-text2',
}

export default function Parametres() {
  const [activeTab, setActiveTab] = useState('centre')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-text1">Paramètres</h1>
          <p className="text-sm text-text3 mt-1">Configuration du Centre SELA</p>
        </div>
        <button onClick={handleSave} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${saved ? 'bg-success text-white' : 'bg-primary text-white hover:bg-primary-dark'}`}>
          <Save size={14} />
          {saved ? 'Enregistré !' : 'Enregistrer'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Tab nav */}
        <div className="w-full md:w-52 flex-shrink-0">
          <div className="card p-2 flex flex-row md:flex-col gap-1 overflow-x-auto">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 whitespace-nowrap ${activeTab === id ? 'bg-primary text-white' : 'text-text2 hover:bg-bg'}`}>
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 min-w-0">
          {activeTab === 'centre' && <TabCentre />}
          {activeTab === 'quotas' && <TabQuotas />}
          {activeTab === 'tarifs' && <TabTarifs />}
          {activeTab === 'utilisateurs' && <TabUtilisateurs />}
          {activeTab === 'notifications' && <TabNotifications />}
          {activeTab === 'integrations' && <TabIntegrations />}
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="card p-6 mb-5">
      <h2 className="text-base font-bold text-text1 mb-4 pb-3 border-b border-border">{title}</h2>
      {children}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5 mb-4">
      <label className="label">{label}</label>
      {children}
    </div>
  )
}

function TabCentre() {
  const [form, setForm] = useState({ nom: 'Centre SELA', adresse: '12 Rue Al Massira, Casablanca 20000', telephone: '+212 5 22 12 34 56', email: 'contact@centresela.ma', web: 'www.centresela.ma', siret: 'MA-123456789' })
  const { logo, setLogo } = useLogo()
  const fileInputRef = useRef(null)
  const [logoError, setLogoError] = useState('')

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoError('')
    if (file.size > 2 * 1024 * 1024) {
      setLogoError('Fichier trop lourd — max 2 MB.')
      e.target.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => setLogo(ev.target.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <>
      <Section title="Informations du centre">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { key: 'nom', label: 'Nom du centre' },
            { key: 'email', label: 'Email principal' },
            { key: 'telephone', label: 'Téléphone' },
            { key: 'web', label: 'Site web' },
            { key: 'siret', label: 'Numéro SIRET / RC' },
          ].map(({ key, label }) => (
            <Field key={key} label={label}>
              <input className="input" value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
            </Field>
          ))}
        </div>
        <Field label="Adresse complète">
          <input className="input" value={form.adresse} onChange={e => setForm(p => ({ ...p, adresse: e.target.value }))} />
        </Field>
      </Section>

      <Section title="Logo du centre">
        <div className="flex items-center gap-6">
          {/* Preview */}
          <div className="w-24 h-24 rounded-2xl bg-bg border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
            {logo
              ? <img src={logo} alt="Logo centre" className="w-full h-full object-contain p-2" />
              : (
                <div className="text-center">
                  <div className="flex items-end gap-1 justify-center">
                    <div className="w-2 h-10 bg-primary rounded" />
                    <div className="w-2 h-7 bg-accent rounded" />
                  </div>
                  <span className="text-xs font-extrabold text-text1 mt-1 block">SELA</span>
                </div>
              )
            }
          </div>

          {/* Actions */}
          <div>
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.svg,.webp"
              ref={fileInputRef}
              onChange={handleLogoUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 btn-ghost border border-border mb-2"
            >
              <Upload size={14} /> Importer un logo
            </button>
            {logo && (
              <button
                onClick={() => setLogo(null)}
                className="flex items-center gap-2 text-xs text-red-500 hover:text-red-600 font-medium mb-2 transition-colors"
              >
                <Trash2 size={13} /> Supprimer le logo
              </button>
            )}
            <p className="text-xs text-text3">PNG, JPG, SVG, WebP — max 2 MB</p>
            {logoError && <p className="text-xs text-red-500 mt-1">{logoError}</p>}
          </div>
        </div>
      </Section>
    </>
  )
}

function TabQuotas() {
  const [quotaMensuel, setQuotaMensuel] = useState(30)
  const [quotaAnnuel, setQuotaAnnuel] = useState(300)
  const [alerteSeuil, setAlerteSeuil] = useState(80)

  return (
    <Section title="Configuration des quotas d'heures supplémentaires">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Quota mensuel par formateur (heures)">
          <input type="number" className="input" value={quotaMensuel} onChange={e => setQuotaMensuel(Number(e.target.value))} />
          <p className="text-xs text-text3 mt-1">Au-delà de ce seuil, une alerte est déclenchée</p>
        </Field>
        <Field label="Quota annuel par formateur (heures)">
          <input type="number" className="input" value={quotaAnnuel} onChange={e => setQuotaAnnuel(Number(e.target.value))} />
        </Field>
        <Field label="Seuil d'alerte (% du quota)">
          <input type="number" min="50" max="99" className="input" value={alerteSeuil} onChange={e => setAlerteSeuil(Number(e.target.value))} />
          <p className="text-xs text-text3 mt-1">Alerte orange quand {alerteSeuil}% du quota est atteint</p>
        </Field>
        <Field label="Validation requise">
          <select className="input">
            <option>Toutes les HS nécessitent une validation</option>
            <option>Validation automatique jusqu'à 2h</option>
            <option>Validation manuelle uniquement pour HSE</option>
          </select>
        </Field>
      </div>

      <div className="mt-4 p-4 bg-primary-light rounded-2xl text-sm">
        <p className="font-bold text-primary mb-2">Barème de majoration en vigueur</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Lun–Ven 06h–21h (HSA)', pct: 25 },
            { label: 'Lun–Ven 21h–06h (HSA nuit)', pct: 50 },
            { label: 'Sam–Dim 06h–21h (HSE jour)', pct: 50 },
            { label: 'Sam–Dim 21h–06h (HSE nuit)', pct: 100 },
          ].map(r => (
            <div key={r.label} className="flex justify-between bg-white/70 rounded-xl px-3 py-2">
              <span className="text-text2 text-xs">{r.label}</span>
              <span className="font-bold text-accent text-xs">+{r.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

function TabTarifs() {
  const [grades, setGrades] = useState(GRADES)

  return (
    <Section title="Taux horaires par grade">
      <div className="space-y-3">
        {grades.map((g, i) => (
          <div key={g.grade} className="flex items-center gap-4 p-3 bg-bg rounded-xl">
            <div className="flex-1">
              <p className="text-sm font-semibold text-text1">{g.grade}</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="input w-28 text-right"
                value={g.taux}
                onChange={e => {
                  const updated = [...grades]
                  updated[i] = { ...g, taux: Number(e.target.value) }
                  setGrades(updated)
                }}
              />
              <span className="text-sm text-text3 font-medium">MAD/h</span>
            </div>
            <div className="w-24">
              <span className="text-xs text-text3">
                HSA (+25%): <strong className="text-text1">{Math.round(g.taux * 1.25)} MAD</strong>
              </span>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

function TabUtilisateurs() {
  const [users, setUsers] = useState(UTILISATEURS)

  return (
    <Section title="Gestion des utilisateurs & rôles">
      <div className="space-y-3">
        {users.map(u => (
          <div key={u.id} className="flex items-center gap-4 p-3 bg-bg rounded-xl">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ backgroundColor: u.couleur }}>{u.avatar}</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-text1">{u.nom}</p>
              <p className="text-xs text-text3">{u.email}</p>
            </div>
            <select
              className="input text-sm py-1.5"
              value={u.role}
              onChange={e => setUsers(p => p.map(x => x.id === u.id ? { ...x, role: e.target.value } : x))}
            >
              <option>Admin</option>
              <option>Gestionnaire</option>
              <option>Formateur</option>
              <option>Viewer</option>
            </select>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ROLE_COLORS[u.role]}`}>{u.role}</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${u.statut === 'Actif' ? 'bg-success/10 text-success' : 'bg-text3/10 text-text3'}`}>
              {u.statut}
            </span>
          </div>
        ))}
      </div>
      <button className="mt-4 btn-primary flex items-center gap-2">
        <User size={14} /> Inviter un utilisateur
      </button>
    </Section>
  )
}

function TabNotifications() {
  const [prefs, setPrefs] = useState({
    depassementQuota: true,
    validationHS: true,
    nouvelleSession: true,
    documentExpire: false,
    rapportMensuel: true,
    alerteFinancement: true,
  })

  const togglePref = key => setPrefs(p => ({ ...p, [key]: !p[key] }))

  const items = [
    { key: 'depassementQuota', label: 'Dépassement de quota HS', desc: 'Notifier quand un formateur dépasse son quota' },
    { key: 'validationHS', label: 'Validation des HS en attente', desc: 'Rappel quotidien pour les HS en attente de validation' },
    { key: 'nouvelleSession', label: 'Nouvelle session créée', desc: 'Notification lors de la création d\'une nouvelle session' },
    { key: 'documentExpire', label: 'Document en expiration', desc: 'Alerte 30 jours avant l\'expiration d\'un contrat' },
    { key: 'rapportMensuel', label: 'Rapport mensuel automatique', desc: 'Génération et envoi automatique du rapport mensuel' },
    { key: 'alerteFinancement', label: 'Alerte budget financement', desc: 'Notifier quand le budget OPCO est consommé à 80%' },
  ]

  return (
    <Section title="Préférences de notifications">
      <div className="space-y-3">
        {items.map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between p-4 bg-bg rounded-2xl">
            <div>
              <p className="text-sm font-semibold text-text1">{label}</p>
              <p className="text-xs text-text3 mt-0.5">{desc}</p>
            </div>
            <button onClick={() => togglePref(key)} className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${prefs[key] ? 'bg-primary' : 'bg-border'}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${prefs[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
        ))}
      </div>
    </Section>
  )
}

function TabIntegrations() {
  const integrations = [
    { name: 'OPCO', desc: 'Synchronisation automatique des financements OPCO', status: 'Connecté', color: 'bg-success/10 text-success' },
    { name: 'Logiciel comptable', desc: 'Export automatique des transactions vers votre comptabilité', status: 'Non configuré', color: 'bg-text3/10 text-text3' },
    { name: 'Email SMTP', desc: 'Envoi des convocations et notifications par email', status: 'Connecté', color: 'bg-success/10 text-success' },
    { name: 'Stockage cloud', desc: 'Archivage automatique des documents sur cloud', status: 'Non configuré', color: 'bg-text3/10 text-text3' },
  ]

  return (
    <Section title="Intégrations et connexions externes">
      <div className="space-y-3">
        {integrations.map(integ => (
          <div key={integ.name} className="flex items-center justify-between p-4 bg-bg rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                <Link2 size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-text1">{integ.name}</p>
                <p className="text-xs text-text3">{integ.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${integ.color}`}>{integ.status}</span>
              <button className="btn-ghost text-xs border border-border">
                {integ.status === 'Connecté' ? 'Configurer' : 'Connecter'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
