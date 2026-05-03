import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { TrendingUp, Users, AlertTriangle, Info, CheckCircle2, ArrowRight, Plus, FileText, DollarSign, User, Calendar } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import {
  weeklyActivityData, hsTrendData, budgetComparisonData,
  depensesHebdoData, sessions, formateurs, alertes,
  apprenantsPieData, statutApprenantsPie
} from '../data/mockData'

// ─── CUSTOM TOOLTIP ────────────────────────────────────────────────────────
const GoldTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-accent text-white text-xs font-bold px-2 py-1 rounded-lg shadow">
        {payload[0].value}{typeof payload[0].value === 'number' && payload[0].name === 'heures' ? 'h' : ''}
      </div>
    )
  }
  return null
}

// ─── KPI CARD: ACTIVITÉ HEBDO ──────────────────────────────────────────────
function CardActiviteHebdo() {
  const maxVal = Math.max(...weeklyActivityData.map(d => d.heures))
  return (
    <div className="card p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="label">Activité Hebdomadaire</p>
          <p className="text-5xl font-extrabold text-primary mt-1">247h</p>
          <p className="text-sm text-text3 mt-1">Heures enseignées cette semaine</p>
        </div>
        <span className="flex items-center gap-1 text-success text-xs font-bold bg-success/10 px-2 py-1 rounded-full">
          <TrendingUp size={12} /> +6%
        </span>
      </div>
      <ResponsiveContainer width="100%" height={100}>
        <BarChart data={weeklyActivityData} barSize={18} margin={{ top: 4, bottom: 0 }}>
          <XAxis dataKey="jour" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
          <Tooltip content={<GoldTooltip />} cursor={false} />
          <Bar dataKey="heures" radius={[4, 4, 0, 0]}>
            {weeklyActivityData.map((entry, i) => (
              <Cell key={i} fill={entry.heures === maxVal ? '#00839F' : '#E0F4F8'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-success font-semibold flex items-center gap-1">
        <TrendingUp size={12} /> +6% vs semaine passée
      </p>
    </div>
  )
}

// ─── KPI CARD: HEURES SUP ─────────────────────────────────────────────────
function CardHeuresSup() {
  return (
    <div className="card p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="label">Heures Supplémentaires</p>
          <p className="text-5xl font-extrabold mt-1" style={{ color: '#DCA35A' }}>84h</p>
          <div className="flex gap-2 mt-2">
            <span className="text-xs font-bold bg-primary-light text-primary px-2 py-0.5 rounded-full">HSA: 56h</span>
            <span className="text-xs font-bold bg-accent-light text-accent px-2 py-0.5 rounded-full">HSE: 28h</span>
          </div>
        </div>
        <span className="flex items-center gap-1 text-danger text-xs font-bold bg-danger/10 px-2 py-1 rounded-full">
          <AlertTriangle size={12} /> 3 dépass.
        </span>
      </div>
      <ResponsiveContainer width="100%" height={100}>
        <LineChart data={hsTrendData} margin={{ top: 4, bottom: 0 }}>
          <XAxis dataKey="jour" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
          <Tooltip content={<GoldTooltip />} />
          <Line type="monotone" dataKey="hsa" stroke="#00839F" strokeWidth={2.5} dot={false} />
          <Line type="monotone" dataKey="hse" stroke="#DCA35A" strokeWidth={2} strokeDasharray="4 2" dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-2">
        <div className="flex -space-x-1.5">
          {['KB', 'MT', 'HQ', 'YA'].map((i, idx) => (
            <div key={idx} className="w-6 h-6 rounded-full border-2 border-white bg-primary flex items-center justify-center text-[9px] font-bold text-white">
              {i}
            </div>
          ))}
        </div>
        <span className="text-xs text-text3">12 formateurs concernés</span>
      </div>
    </div>
  )
}

// ─── KPI CARD: BUDGET ─────────────────────────────────────────────────────
function CardBudget() {
  return (
    <div className="card p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="label">Budget & Financement</p>
          <p className="text-4xl font-extrabold text-text1 mt-1">142 500 <span className="text-2xl text-text3 font-semibold">MAD</span></p>
          <p className="text-sm text-text3 mt-1">Pour la période sélectionnée</p>
        </div>
        <span className="flex items-center gap-1 text-white text-xs font-bold bg-accent px-2 py-1 rounded-full">
          +9%
        </span>
      </div>
      <ResponsiveContainer width="100%" height={100}>
        <AreaChart data={budgetComparisonData.slice(0, 6)} margin={{ top: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="budget24" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00839F" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#00839F" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="budget23" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#DCA35A" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#DCA35A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="mois" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
          <Tooltip formatter={(v) => [`${(v / 1000).toFixed(0)}k MAD`]} />
          <Area type="monotone" dataKey="budget2024" stroke="#00839F" fill="url(#budget24)" strokeWidth={2.5} dot={false} />
          <Area type="monotone" dataKey="budget2023" stroke="#DCA35A" fill="url(#budget23)" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex gap-4 text-xs text-text3">
        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-primary inline-block rounded" /> 2024</span>
        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-accent inline-block rounded border-dashed" /> 2023</span>
      </div>
    </div>
  )
}

// ─── SESSIONS ACTIVES ─────────────────────────────────────────────────────
function CardSessionsActives() {
  const navigate = useNavigate()
  const activeSessions = sessions.slice(0, 4)
  return (
    <div className="card p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="font-bold text-text1">Sessions Actives</p>
        <span className="text-xs font-bold bg-primary-light text-primary px-2 py-1 rounded-full">{sessions.length} total</span>
      </div>
      <div className="flex flex-col gap-3">
        {activeSessions.map((s) => (
          <div key={s.id} className="flex items-center gap-3 p-3 rounded-2xl bg-bg hover:bg-primary-light transition-colors cursor-pointer" onClick={() => navigate('/sessions')}>
            <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center text-primary font-bold text-sm">
              {s.intitule.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text1 truncate">{s.intitule.split('–')[0].trim()}</p>
              <p className="text-xs text-text3">{s.formateur} · {s.inscrits} apprenants</p>
            </div>
            <StatutSession statut={s.statut} />
          </div>
        ))}
      </div>
      <button onClick={() => navigate('/sessions')} className="text-sm text-primary font-semibold hover:text-primary-dark flex items-center gap-1 transition-colors">
        + Nouvelle session <ArrowRight size={14} />
      </button>
    </div>
  )
}

function StatutSession({ statut }) {
  const cfg = {
    'En cours': 'bg-primary-light text-primary',
    'Planifiée': 'bg-bg text-text2',
    'Terminée': 'bg-success/10 text-success',
  }[statut] || 'bg-bg text-text2'
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg}`}>{statut}</span>
}

// ─── TOP FORMATEURS HS ─────────────────────────────────────────────────────
function CardTopFormateurs() {
  const navigate = useNavigate()
  const top5 = [...formateurs].sort((a, b) => b.totalHS - a.totalHS).slice(0, 5)
  const max = top5[0]?.totalHS || 1
  return (
    <div className="card p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="font-bold text-text1">Top Formateurs – Heures Sup</p>
      </div>
      <div className="flex flex-col gap-3">
        {top5.map((f, i) => (
          <div key={f.id} className="flex items-center gap-3 cursor-pointer hover:bg-bg p-2 rounded-xl transition-colors" onClick={() => navigate('/formateurs')}>
            <span className="text-sm font-bold text-text3 w-4">{i + 1}</span>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: f.couleur }}>
              {f.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-text1 truncate">{f.nom}</span>
                <span className="text-sm font-bold text-primary ml-2">{f.totalHS}h</span>
              </div>
              <div className="h-1.5 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${(f.totalHS / max) * 100}%` }} />
              </div>
            </div>
            {i === 0 && <span className="text-base">👑</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── DÉPENSES HEBDO ───────────────────────────────────────────────────────
function CardDepenses() {
  return (
    <div className="card p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="label">Dépenses Hebdomadaires</p>
          <p className="text-4xl font-extrabold text-text1 mt-1">27 850 <span className="text-xl text-text3 font-semibold">MAD</span></p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={90}>
        <AreaChart data={depensesHebdoData} margin={{ top: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="depGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00839F" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#00839F" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="jour" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
          <Tooltip formatter={(v) => [`${v.toLocaleString('fr-MA')} MAD`]} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }} />
          <Area type="monotone" dataKey="montant" stroke="#00839F" fill="url(#depGrad)" strokeWidth={2.5} dot={{ fill: '#DCA35A', r: 3, strokeWidth: 0 }} />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-text2"><span className="text-base">💼</span> Rémunération HS</span>
          <span className="font-bold text-text1">18 200 MAD</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-text2"><span className="text-base">🏦</span> Financement OPCO</span>
          <span className="font-bold text-accent">9 650 MAD</span>
        </div>
      </div>
    </div>
  )
}

// ─── RÉPARTITION APPRENANTS ───────────────────────────────────────────────
function CardApprenants() {
  const RADIAN = Math.PI / 180
  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Decorative blob */}
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #00839F, #DCA35A)' }} />

      <p className="font-bold text-text1 mb-4">Répartition Apprenants</p>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-xs text-text3 font-semibold mb-2 text-center">Par tranche d'âge</p>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={apprenantsPieData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value">
                {apprenantsPieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-1 mt-2">
            {apprenantsPieData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.fill }} />
                  <span className="text-text2">{d.name}</span>
                </span>
                <span className="font-bold text-text1">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-text3 font-semibold mb-2 text-center">Statut</p>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={statutApprenantsPie} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value">
                {statutApprenantsPie.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-1 mt-2">
            {statutApprenantsPie.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.fill }} />
                  <span className="text-text2">{d.name}</span>
                </span>
                <span className="font-bold text-text1">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-sm font-bold text-text1 text-center">
          <span className="text-2xl text-primary">284</span> apprenants inscrits
        </p>
      </div>
    </div>
  )
}

// ─── FINANCEMENT RAPIDE ───────────────────────────────────────────────────
function CardFinancement() {
  const items = [
    { label: 'OPCO financement', pct: 72, color: 'bg-primary' },
    { label: 'CPF / Autofinancement', pct: 28, color: 'bg-accent' },
    { label: 'Budget HS utilisé', pct: 61, color: 'bg-primary' },
    { label: 'Quota HS restant', pct: 39, color: 'bg-success' },
  ]
  return (
    <div className="card p-6 flex flex-col gap-5">
      <p className="font-bold text-text1">Financement Rapide</p>
      <div className="text-center">
        <p className="text-3xl font-extrabold text-text1">142 500 <span className="text-lg text-text3 font-semibold">MAD</span></p>
        <p className="text-xs text-text3 mt-1">Solde total disponible</p>
      </div>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col gap-1">
            <div className="flex justify-between text-xs">
              <span className="text-text2">{item.label}</span>
              <span className="font-bold text-text1">{item.pct}%</span>
            </div>
            <div className="h-2 bg-border rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${item.color} transition-all`} style={{ width: `${item.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 pt-2 border-t border-border">
        <div className="flex justify-between text-sm">
          <span className="text-text2">OPCO — Financé</span>
          <span className="font-bold text-primary">102 600 MAD</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text2">Autofinancement</span>
          <span className="font-bold text-accent">39 900 MAD</span>
        </div>
      </div>
    </div>
  )
}

// ─── ALERTES ──────────────────────────────────────────────────────────────
function CardAlertes() {
  const typeConfig = {
    warning: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/30' },
    info:    { bg: 'bg-primary-light', text: 'text-primary', border: 'border-primary/30' },
    success: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/30' },
  }
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="font-bold text-text1">Alertes Récentes</p>
        <button className="text-xs text-primary font-semibold hover:text-primary-dark flex items-center gap-1 transition-colors">
          Voir toutes <ArrowRight size={12} />
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {alertes.slice(0, 3).map((a) => {
          const cfg = typeConfig[a.type] || typeConfig.info
          return (
            <div key={a.id} className={`flex items-start gap-3 p-3 rounded-2xl border ${cfg.bg} ${cfg.border}`}>
              <span className="text-lg flex-shrink-0">{a.icone}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${cfg.text}`}>{a.message}</p>
              </div>
              <span className="text-xs text-text3 flex-shrink-0">{a.temps}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── QUICK ACTIONS ─────────────────────────────────────────────────────────
function QuickActions() {
  const navigate = useNavigate()
  const actions = [
    { label: '+ Nouvelle Session', icon: Calendar, path: '/sessions', color: 'text-primary' },
    { label: '+ Saisir Heures Sup', icon: Plus, path: '/heures-sup', color: 'text-accent' },
    { label: '+ Nouveau Formateur', icon: User, path: '/formateurs', color: 'text-success' },
    { label: '📄 Générer Rapport', icon: FileText, path: '/rapports', color: 'text-purple-600' },
    { label: '💰 Saisir Dépense', icon: DollarSign, path: '/finances', color: 'text-primary' },
  ]
  return (
    <div className="mt-4">
      <p className="text-sm font-bold text-text2 mb-3">Actions Rapides</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {actions.map((a) => {
          const Icon = a.icon
          return (
            <button
              key={a.label}
              onClick={() => navigate(a.path)}
              className="card p-4 flex flex-col items-center gap-2 hover:shadow-card-hover hover:border-primary border border-transparent transition-all duration-150 cursor-pointer"
            >
              <Icon size={20} className={a.color} />
              <span className="text-xs font-semibold text-text2 text-center leading-tight">{a.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── DASHBOARD ─────────────────────────────────────────────────────────────
export default function Dashboard() {
  return (
    <div className="space-y-5">
      <PageHeader title="Tableau de Bord" subtitle="Vue d'ensemble — Centre de formation SELA" />

      {/* ROW 1: 3 big KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <CardActiviteHebdo />
        <CardHeuresSup />
        <CardBudget />
      </div>

      {/* ROW 2: 3 medium cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <CardSessionsActives />
        <CardTopFormateurs />
        <CardDepenses />
      </div>

      {/* ROW 3: 2 wide cards */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3"><CardApprenants /></div>
        <div className="lg:col-span-2"><CardFinancement /></div>
      </div>

      {/* ROW 4: Alerts + Quick Actions */}
      <CardAlertes />
      <QuickActions />
    </div>
  )
}
