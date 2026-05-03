import { useState } from 'react'
import { Download, TrendingUp, TrendingDown, DollarSign, PieChart as PieIcon, BarChart2, RefreshCw } from 'lucide-react'
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend, CartesianGrid
} from 'recharts'
import PageHeader from '../components/common/PageHeader'
import { financesMensuellesData, repartitionDepensesData, transactions } from '../data/mockData'

async function exportComptable() {
  const XLSX = await import('xlsx')
  const { saveAs } = await import('file-saver')

  const wb = XLSX.utils.book_new()

  // ── Sheet 1 : Transactions ───────────────────────────────────────────────
  const txHeader = ['Date', 'Libellé', 'Catégorie', 'Type', 'Montant (MAD)']
  const txRows   = transactions.map(t => [
    t.date, t.libelle, t.categorie, t.type,
    t.type === 'Recette' ? t.montant : -Math.abs(t.montant),
  ])
  const totalRec  = transactions.filter(t => t.type === 'Recette').reduce((s, t) => s + t.montant, 0)
  const totalDep  = transactions.filter(t => t.type === 'Dépense').reduce((s, t) => s + Math.abs(t.montant), 0)
  txRows.push(['', '', '', 'TOTAL Recettes', totalRec])
  txRows.push(['', '', '', 'TOTAL Dépenses', -totalDep])
  txRows.push(['', '', '', 'SOLDE', totalRec - totalDep])

  const wsTx = XLSX.utils.aoa_to_sheet([txHeader, ...txRows])
  wsTx['!cols'] = [{ wch: 12 }, { wch: 42 }, { wch: 20 }, { wch: 14 }, { wch: 16 }]
  XLSX.utils.book_append_sheet(wb, wsTx, 'Transactions')

  // ── Sheet 2 : Récapitulatif mensuel ──────────────────────────────────────
  const recapHeader = ['Mois', 'Recettes (MAD)', 'Dépenses (MAD)', 'Solde (MAD)']
  const recapRows   = financesMensuellesData.map(f => [
    f.mois, f.recettes, f.depenses, f.recettes - f.depenses,
  ])
  const totRec2 = financesMensuellesData.reduce((s, f) => s + f.recettes, 0)
  const totDep2 = financesMensuellesData.reduce((s, f) => s + f.depenses, 0)
  recapRows.push(['TOTAL', totRec2, totDep2, totRec2 - totDep2])

  const wsRecap = XLSX.utils.aoa_to_sheet([recapHeader, ...recapRows])
  wsRecap['!cols'] = [{ wch: 8 }, { wch: 18 }, { wch: 18 }, { wch: 14 }]
  XLSX.utils.book_append_sheet(wb, wsRecap, 'Récapitulatif Mensuel')

  // ── Sheet 3 : Répartition des dépenses ───────────────────────────────────
  const repHeader = ['Catégorie', 'Part (%)']
  const repRows   = repartitionDepensesData.map(d => [d.name, d.value])
  const wsRep = XLSX.utils.aoa_to_sheet([repHeader, ...repRows])
  wsRep['!cols'] = [{ wch: 26 }, { wch: 10 }]
  XLSX.utils.book_append_sheet(wb, wsRep, 'Répartition Dépenses')

  // ── Save ─────────────────────────────────────────────────────────────────
  const date = new Date().toISOString().slice(0, 10)
  const buf  = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  saveAs(new Blob([buf], { type: 'application/octet-stream' }), `export-comptable-sela-${date}.xlsx`)
}

function KPI({ label, value, trend, trendUp, color, icon: Icon }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="label">{label}</p>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <p className="text-3xl font-extrabold text-text1">{value}</p>
      {trend && (
        <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${trendUp ? 'text-success' : 'text-danger'}`}>
          {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {trend}
        </div>
      )}
    </div>
  )
}

export default function Finances() {
  const [filterType, setFilterType] = useState('Tous')
  const [filterCat, setFilterCat]   = useState('Tous')
  const [exporting, setExporting]   = useState(false)

  const handleExport = async () => {
    setExporting(true)
    try { await exportComptable() } finally { setExporting(false) }
  }

  const filtered = transactions.filter(t => {
    const mt = filterType === 'Tous' || t.type === filterType
    const mc = filterCat === 'Tous' || t.categorie === filterCat
    return mt && mc
  })

  const totalRecettes = transactions.filter(t => t.type === 'Recette').reduce((a, t) => a + t.montant, 0)
  const totalDepenses = transactions.filter(t => t.type === 'Dépense').reduce((a, t) => a + Math.abs(t.montant), 0)

  return (
    <div className="space-y-5">
      <PageHeader
        title="Finances"
        subtitle="Suivi budgétaire et comptable"
        extra={
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 bg-bg border border-border text-text2 px-3 py-2 rounded-xl text-sm font-medium hover:bg-border transition-colors disabled:opacity-50"
          >
            {exporting
              ? <RefreshCw size={14} className="animate-spin" />
              : <Download size={14} />
            }
            Export comptable
          </button>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI label="Budget total" value="142 500 MAD" trend="+9% vs 2023" trendUp={true} color="bg-primary" icon={DollarSign} />
        <KPI label="Dépenses HS" value="27 850 MAD" trend="+4.2% vs mois dernier" trendUp={false} color="bg-warning" icon={TrendingDown} />
        <KPI label="Financement OPCO" value="102 600 MAD" trend="Reçu ce mois" trendUp={true} color="bg-success" icon={TrendingUp} />
        <KPI label="Solde disponible" value="39 900 MAD" trend="-2.1% vs mois dernier" trendUp={false} color="bg-accent" icon={DollarSign} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Bar chart */}
        <div className="lg:col-span-3 card p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-bold text-text1">Recettes vs Dépenses (2025)</p>
            <BarChart2 size={16} className="text-text3" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={financesMensuellesData} barSize={16} barGap={4} margin={{ bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="mois" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}k`} />
              <Tooltip formatter={(v) => [`${v.toLocaleString('fr-MA')} MAD`]} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', fontFamily: 'Plus Jakarta Sans' }} />
              <Legend />
              <Bar dataKey="recettes" name="Recettes" fill="#00839F" radius={[4, 4, 0, 0]} />
              <Bar dataKey="depenses" name="Dépenses" fill="#DCA35A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-bold text-text1">Répartition des dépenses</p>
            <PieIcon size={16} className="text-text3" />
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={repartitionDepensesData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {repartitionDepensesData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip formatter={v => [`${v}%`]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {repartitionDepensesData.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.fill }} />
                  <span className="text-text2">{d.name}</span>
                </span>
                <span className="font-bold text-text1">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions table */}
      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-border">
          <p className="font-bold text-text1">Transactions récentes</p>
          <div className="flex items-center gap-2 flex-wrap">
            <select className="input text-sm py-1.5" value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option>Tous</option>
              <option>Recette</option>
              <option>Dépense</option>
            </select>
            <select className="input text-sm py-1.5" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
              <option>Tous</option>
              <option>OPCO</option>
              <option>CPF</option>
              <option>Rémunération HS</option>
              <option>Autofinancement</option>
              <option>Matériel</option>
              <option>Charges générales</option>
            </select>
          </div>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden divide-y divide-border">
          {filtered.map(t => (
            <div key={t.id} className="px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text1 truncate">{t.libelle}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-text3">{t.date}</span>
                  <span className="text-xs font-semibold bg-bg text-text2 px-1.5 py-0.5 rounded-lg">{t.categorie}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={`text-sm font-bold ${t.type === 'Recette' ? 'text-success' : 'text-danger'}`}>
                  {t.type === 'Recette' ? '+' : ''}{Math.abs(t.montant).toLocaleString('fr-MA')} MAD
                </p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${t.type === 'Recette' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>{t.type}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-bg">
                <th className="text-left px-5 py-3 label">Date</th>
                <th className="text-left px-5 py-3 label">Libellé</th>
                <th className="text-left px-5 py-3 label">Catégorie</th>
                <th className="text-right px-5 py-3 label">Montant</th>
                <th className="text-center px-5 py-3 label">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-bg transition-colors">
                  <td className="px-5 py-3 text-sm text-text2">{t.date}</td>
                  <td className="px-5 py-3 text-sm font-medium text-text1">{t.libelle}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-semibold bg-bg text-text2 px-2 py-1 rounded-lg">{t.categorie}</span>
                  </td>
                  <td className="px-5 py-3 text-right font-bold">
                    <span className={t.type === 'Recette' ? 'text-success' : 'text-danger'}>
                      {t.type === 'Recette' ? '+' : ''}{Math.abs(t.montant).toLocaleString('fr-MA')} MAD
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${t.type === 'Recette' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                      {t.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-border flex flex-wrap justify-between items-center gap-3 bg-bg">
          <span className="text-sm text-text3">{filtered.length} transaction(s)</span>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="text-text2">Recettes: <span className="font-bold text-success">{totalRecettes.toLocaleString('fr-MA')} MAD</span></span>
            <span className="text-text2">Dépenses: <span className="font-bold text-danger">{totalDepenses.toLocaleString('fr-MA')} MAD</span></span>
            <span className="text-text2">Solde: <span className="font-bold text-primary">{(totalRecettes - totalDepenses).toLocaleString('fr-MA')} MAD</span></span>
          </div>
        </div>
      </div>
    </div>
  )
}
