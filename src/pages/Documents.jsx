import { useState } from 'react'
import { Search, Upload, Download, Eye, FileText, BookOpen, Award, Send, BarChart2, CheckSquare, RefreshCw } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import StatusBadge from '../components/common/StatusBadge'
import Modal from '../components/common/Modal'
import { documents, apprenants, sessions, heuresSup, financesMensuellesData } from '../data/mockData'

const CATEGORIES = ['Toutes', 'Conventions', 'Contrats', 'Attestations', 'Convocations', 'Bulletins HS', 'Rapports Qualiopi']

const categoryIcons = {
  'Conventions': BookOpen,
  'Contrats': FileText,
  'Attestations': Award,
  'Convocations': Send,
  'Bulletins HS': BarChart2,
  'Rapports Qualiopi': CheckSquare,
}

const typeColors = {
  pdf:  'bg-red-50 text-red-600 border-red-200',
  xlsx: 'bg-green-50 text-green-600 border-green-200',
  docx: 'bg-blue-50 text-blue-600 border-blue-200',
}

// ── PDF helpers ───────────────────────────────────────────────────────────────
function selaHeader(doc, subtitle) {
  doc.setFillColor(0, 131, 159)
  doc.rect(0, 0, doc.internal.pageSize.width, 28, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('Centre SELA', 14, 12)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text('Centre de Formation Professionnelle · Casablanca, Maroc', 14, 19)
  doc.text(subtitle, doc.internal.pageSize.width - 14, 19, { align: 'right' })
  doc.setTextColor(0, 0, 0)
}

function selaFooter(doc) {
  const pages = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i)
    doc.setFontSize(7)
    doc.setTextColor(150)
    const w = doc.internal.pageSize.width
    const h = doc.internal.pageSize.height
    doc.line(14, h - 14, w - 14, h - 14)
    doc.text('Centre SELA · contact@centresela.ma · +212 5 22 XX XX XX', 14, h - 8)
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-MA')} · Page ${i}/${pages}`, w - 14, h - 8, { align: 'right' })
  }
  doc.setTextColor(0, 0, 0)
}

function sectionTitle(doc, text, y) {
  doc.setFillColor(244, 246, 248)
  doc.rect(14, y - 4, doc.internal.pageSize.width - 28, 8, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(0, 131, 159)
  doc.text(text.toUpperCase(), 16, y + 1)
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'normal')
  return y + 10
}

// ── Attestation PDF ───────────────────────────────────────────────────────────
async function generateAttestation({ apprenant, session, type, dateEmission }) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })

  selaHeader(doc, `N° ATT-${Date.now().toString().slice(-6)}`)

  // Title
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.setTextColor(0, 131, 159)
  doc.text('ATTESTATION DE FORMATION', doc.internal.pageSize.width / 2, 48, { align: 'center' })
  doc.setFontSize(11)
  doc.setTextColor(100)
  doc.text(type, doc.internal.pageSize.width / 2, 56, { align: 'center' })
  doc.setTextColor(0, 0, 0)

  // Separator
  doc.setDrawColor(220, 163, 90)
  doc.setLineWidth(0.8)
  doc.line(40, 60, doc.internal.pageSize.width - 40, 60)

  // Body
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  let y = 74

  const body = [
    'Le Centre de Formation Professionnelle SELA, agréé par l\'État marocain,',
    'certifie que :',
  ]
  body.forEach(line => { doc.text(line, doc.internal.pageSize.width / 2, y, { align: 'center' }); y += 7 })

  // Apprenant box
  y += 4
  doc.setFillColor(244, 246, 248)
  doc.roundedRect(30, y, doc.internal.pageSize.width - 60, 20, 3, 3, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(0, 131, 159)
  doc.text(`M. / Mme  ${apprenant.nom}`, doc.internal.pageSize.width / 2, y + 9, { align: 'center' })
  doc.setFontSize(9)
  doc.setTextColor(100)
  doc.text(`${apprenant.filiere}`, doc.internal.pageSize.width / 2, y + 15, { align: 'center' })
  doc.setTextColor(0, 0, 0)
  y += 28

  const lines2 = [
    `a suivi avec assiduité et sérieux la formation intitulée :`,
  ]
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  lines2.forEach(l => { doc.text(l, doc.internal.pageSize.width / 2, y, { align: 'center' }); y += 7 })

  // Session box
  y += 2
  doc.setFillColor(0, 131, 159)
  doc.roundedRect(30, y, doc.internal.pageSize.width - 60, 18, 3, 3, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(255, 255, 255)
  doc.text(`« ${session.intitule} »`, doc.internal.pageSize.width / 2, y + 8, { align: 'center' })
  doc.setFontSize(9)
  doc.text(`Durée : ${session.duree} · ${session.dateDebut} → ${session.dateFin}`, doc.internal.pageSize.width / 2, y + 14, { align: 'center' })
  doc.setTextColor(0, 0, 0)
  y += 26

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.text(`dispensée au sein du Centre SELA — ${session.salle}.`, doc.internal.pageSize.width / 2, y, { align: 'center' })
  y += 12
  doc.text(`Cette attestation est délivrée pour servir et valoir ce que de droit.`, doc.internal.pageSize.width / 2, y, { align: 'center' })

  // Date & signature
  y += 20
  doc.setFontSize(10)
  doc.text(`Fait à Casablanca, le ${dateEmission || new Date().toLocaleDateString('fr-MA')}`, 14, y)
  y += 14
  doc.setFont('helvetica', 'bold')
  doc.text('Le Directeur du Centre SELA', doc.internal.pageSize.width - 14, y, { align: 'right' })
  y += 6
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(150)
  doc.text('Signature et cachet', doc.internal.pageSize.width - 14, y, { align: 'right' })
  // Stamp box
  doc.setDrawColor(200)
  doc.setLineWidth(0.4)
  doc.roundedRect(doc.internal.pageSize.width - 60, y + 4, 46, 24, 3, 3)
  doc.setTextColor(0, 0, 0)

  selaFooter(doc)
  doc.save(`attestation-${apprenant.nom.replace(/\s/g, '-')}-${Date.now()}.pdf`)
}

// ── Convention PDF ────────────────────────────────────────────────────────────
async function generateConvention({ entreprise, representant, apprenant, session, cout, dateSign }) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const w = doc.internal.pageSize.width

  selaHeader(doc, `CONV-${Date.now().toString().slice(-6)}`)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(0, 131, 159)
  doc.text('CONVENTION DE FORMATION PROFESSIONNELLE', w / 2, 46, { align: 'center' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(100)
  doc.text('Conformément à la loi n° 13-00 portant statut de la formation professionnelle privée au Maroc', w / 2, 53, { align: 'center' })
  doc.setTextColor(0, 0, 0)
  doc.setDrawColor(220, 163, 90)
  doc.setLineWidth(0.8)
  doc.line(14, 57, w - 14, 57)

  let y = 66
  y = sectionTitle(doc, 'Entre les soussignés', y)

  const party = (label, lines) => {
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10)
    doc.text(label, 14, y); y += 6
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9)
    lines.forEach(l => { doc.text(l, 20, y); y += 5 })
    y += 3
  }

  party('Centre SELA (Prestataire) :', [
    'Dénomination sociale : Centre de Formation Professionnelle SELA',
    'Siège social : Casablanca, Maroc',
    'Représenté par : M. le Directeur du Centre SELA',
  ])

  doc.text('ET', w / 2, y, { align: 'center' }); y += 6

  party(`${entreprise} (Bénéficiaire) :`, [
    `Entreprise / Particulier : ${entreprise}`,
    `Représenté par : ${representant}`,
    `Stagiaire désigné : ${apprenant?.nom || '—'}`,
  ])

  y = sectionTitle(doc, 'Objet de la convention', y)
  doc.setFontSize(9)
  const objet = doc.splitTextToSize(
    `Le Centre SELA s'engage à dispenser au bénéficiaire la formation « ${session?.intitule || '—'} » d'une durée de ${session?.duree || '—'}, du ${session?.dateDebut || '—'} au ${session?.dateFin || '—'}, dans la salle ${session?.salle || '—'}.`,
    w - 28
  )
  doc.text(objet, 14, y); y += objet.length * 5 + 6

  y = sectionTitle(doc, 'Conditions financières', y)
  doc.setFontSize(9)
  doc.text(`Coût total de la formation : ${Number(cout || 0).toLocaleString('fr-MA')} MAD (TTC)`, 14, y); y += 6
  doc.text('Modalités de paiement : selon accord entre les parties.', 14, y); y += 10

  y = sectionTitle(doc, 'Signatures', y)
  doc.setFontSize(9)
  const sigY = y + 4
  doc.text('Pour le Centre SELA', 30, sigY, { align: 'center' })
  doc.text(`Pour ${entreprise}`, w - 30, sigY, { align: 'center' })
  doc.setTextColor(150)
  doc.text('Signature et cachet', 30, sigY + 5, { align: 'center' })
  doc.text('Signature et cachet', w - 30, sigY + 5, { align: 'center' })
  doc.setDrawColor(200); doc.setLineWidth(0.4)
  doc.roundedRect(14, sigY + 8, 55, 22, 2, 2)
  doc.roundedRect(w - 70, sigY + 8, 55, 22, 2, 2)
  doc.setTextColor(150)
  doc.setFontSize(7)
  doc.text(`Fait à Casablanca, le ${dateSign || new Date().toLocaleDateString('fr-MA')}`, w / 2, sigY + 36, { align: 'center' })

  doc.setTextColor(0, 0, 0)
  selaFooter(doc)
  doc.save(`convention-${(entreprise || 'entreprise').replace(/\s/g, '-')}-${Date.now()}.pdf`)
}

// ── BPF PDF ───────────────────────────────────────────────────────────────────
async function generateBPF() {
  const { jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const w = doc.internal.pageSize.width

  selaHeader(doc, `BPF – ${new Date().toLocaleDateString('fr-MA')}`)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.setTextColor(0, 131, 159)
  doc.text('BILAN PÉDAGOGIQUE ET FINANCIER', w / 2, 42, { align: 'center' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(100)
  doc.text('Conforme aux exigences de la certification Qualiopi', w / 2, 49, { align: 'center' })
  doc.setTextColor(0, 0, 0)

  // KPI row
  const kpis = [
    { label: 'Sessions', value: sessions.length },
    { label: 'Apprenants', value: 12 },
    { label: 'Heures dispensées', value: '580h' },
    { label: 'Budget annuel (MAD)', value: '1 662 000' },
  ]
  const kpiW = (w - 28) / kpis.length
  kpis.forEach((k, i) => {
    const x = 14 + i * kpiW
    doc.setFillColor(0, 131, 159)
    doc.roundedRect(x, 54, kpiW - 4, 20, 2, 2, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold'); doc.setFontSize(14)
    doc.text(String(k.value), x + (kpiW - 4) / 2, 63, { align: 'center' })
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8)
    doc.text(k.label, x + (kpiW - 4) / 2, 69, { align: 'center' })
  })
  doc.setTextColor(0, 0, 0)

  autoTable(doc, {
    startY: 80,
    head: [['Intitulé de la session', 'Formateur', 'Début', 'Fin', 'Durée', 'Inscrits', 'Financement', 'Statut']],
    body: sessions.map(s => [s.intitule, s.formateur, s.dateDebut, s.dateFin, s.duree, `${s.inscrits}/${s.places}`, s.financement, s.statut]),
    headStyles: { fillColor: [0, 131, 159], textColor: 255, fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [244, 246, 248] },
    styles: { cellPadding: 2.5 },
    margin: { left: 14, right: 14 },
  })

  const afterTable = doc.lastAutoTable.finalY + 8
  autoTable(doc, {
    startY: afterTable,
    head: [['Mois', 'Recettes (MAD)', 'Dépenses (MAD)', 'Solde (MAD)']],
    body: financesMensuellesData.slice(0, 6).map(f => [f.mois, f.recettes.toLocaleString('fr-MA'), f.depenses.toLocaleString('fr-MA'), (f.recettes - f.depenses).toLocaleString('fr-MA')]),
    headStyles: { fillColor: [220, 163, 90], textColor: 255, fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [255, 251, 244] },
    styles: { cellPadding: 2.5 },
    margin: { left: 14, right: 14 },
    tableWidth: 120,
  })

  selaFooter(doc)
  doc.save(`bpf-qualiopi-sela-${Date.now()}.pdf`)
}

// ─────────────────────────────────────────────────────────────────────────────

export default function Documents() {
  const [search, setSearch]       = useState('')
  const [filterCat, setFilterCat] = useState('Toutes')
  const [isDragOver, setIsDragOver] = useState(false)

  const [showAttestation, setShowAttestation] = useState(false)
  const [showConvention,  setShowConvention]  = useState(false)
  const [generatingBPF,   setGeneratingBPF]   = useState(false)

  const filtered = documents.filter(d => {
    const ms = d.nom.toLowerCase().includes(search.toLowerCase())
    const mc = filterCat === 'Toutes' || d.categorie === filterCat
    return ms && mc
  })

  const handleBPF = async () => {
    setGeneratingBPF(true)
    try { await generateBPF() } finally { setGeneratingBPF(false) }
  }

  return (
    <div>
      <PageHeader
        title="Documents"
        subtitle={`${documents.length} documents dans la bibliothèque`}
        extra={
          <button className="flex items-center gap-2 bg-bg border border-border text-text2 px-3 py-2 rounded-xl text-sm font-medium hover:bg-border transition-colors">
            <Download size={14} /> Tout exporter
          </button>
        }
      />

      {/* Quick generate buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <button
          onClick={() => setShowAttestation(true)}
          className="flex items-center gap-3 p-4 rounded-2xl border border-border font-semibold text-sm transition-all duration-150 text-primary bg-primary-light hover:bg-primary hover:text-white"
        >
          <Award size={18} /> Générer une attestation
        </button>
        <button
          onClick={() => setShowConvention(true)}
          className="flex items-center gap-3 p-4 rounded-2xl border border-border font-semibold text-sm transition-all duration-150 text-accent bg-accent-light hover:bg-accent hover:text-white"
        >
          <BookOpen size={18} /> Générer une convention
        </button>
        <button
          onClick={handleBPF}
          disabled={generatingBPF}
          className="flex items-center gap-3 p-4 rounded-2xl border border-border font-semibold text-sm transition-all duration-150 text-success bg-success/10 hover:bg-success hover:text-white disabled:opacity-50"
        >
          {generatingBPF ? <RefreshCw size={18} className="animate-spin" /> : <CheckSquare size={18} />}
          Exporter BPF Qualiopi
        </button>
      </div>

      {/* Drag & Drop Upload */}
      <div
        onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={e => { e.preventDefault(); setIsDragOver(false) }}
        className={`border-2 border-dashed rounded-2xl p-6 mb-5 text-center transition-all duration-150 cursor-pointer ${
          isDragOver ? 'border-primary bg-primary-light' : 'border-border hover:border-primary/50 hover:bg-bg'
        }`}
      >
        <Upload size={24} className={`mx-auto mb-2 ${isDragOver ? 'text-primary' : 'text-text3'}`} />
        <p className={`text-sm font-medium ${isDragOver ? 'text-primary' : 'text-text2'}`}>
          {isDragOver ? 'Déposer ici...' : 'Glisser-déposer vos documents ou cliquer pour importer'}
        </p>
        <p className="text-xs text-text3 mt-1">PDF, DOCX, XLSX — jusqu'à 20 MB par fichier</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text3" />
          <input className="input pl-9 w-60" placeholder="Rechercher un document..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                filterCat === cat ? 'bg-primary text-white' : 'bg-bg text-text2 hover:bg-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((doc) => {
          const Icon = categoryIcons[doc.categorie] || FileText
          return (
            <div key={doc.id} className="card p-4 hover:shadow-card-hover transition-all duration-150 group">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-bg flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-primary-light transition-colors">
                  {doc.icone}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text1 leading-tight truncate">{doc.nom}</p>
                  <p className="text-xs text-text3 mt-0.5">{doc.categorie}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${typeColors[doc.type] || 'bg-bg text-text2 border-border'}`}>
                  {doc.type?.toUpperCase()}
                </span>
                <span className="text-xs text-text3">{doc.taille}</span>
                <span className="text-xs text-text3 ml-auto">{doc.date}</span>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <StatusBadge status={doc.statut} />
                <div className="flex items-center gap-1">
                  <button className="w-7 h-7 rounded-lg hover:bg-primary-light flex items-center justify-center text-text3 hover:text-primary transition-colors"><Eye size={13} /></button>
                  <button className="w-7 h-7 rounded-lg hover:bg-bg flex items-center justify-center text-text3 hover:text-text1 transition-colors"><Download size={13} /></button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <FileText size={40} className="mx-auto text-text3 opacity-30 mb-3" />
          <p className="text-text2 font-medium">Aucun document trouvé</p>
        </div>
      )}

      {/* Attestation modal */}
      <Modal open={showAttestation} onClose={() => setShowAttestation(false)} title="Générer une attestation de formation" size="md">
        <AttestationForm onClose={() => setShowAttestation(false)} />
      </Modal>

      {/* Convention modal */}
      <Modal open={showConvention} onClose={() => setShowConvention(false)} title="Générer une convention de formation" size="md">
        <ConventionForm onClose={() => setShowConvention(false)} />
      </Modal>
    </div>
  )
}

// ── Attestation form ──────────────────────────────────────────────────────────
function AttestationForm({ onClose }) {
  const [form, setForm]     = useState({ apprenantId: '', sessionId: '', type: 'Attestation de présence', dateEmission: new Date().toISOString().slice(0, 10) })
  const [errors, setErrors] = useState({})
  const [busy, setBusy]     = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.apprenantId) errs.apprenantId = 'Sélectionner un apprenant'
    if (!form.sessionId)   errs.sessionId   = 'Sélectionner une session'
    if (Object.keys(errs).length) { setErrors(errs); return }

    setBusy(true)
    try {
      const apprenant = apprenants.find(a => a.id === Number(form.apprenantId))
      const session   = sessions.find(s => s.id === Number(form.sessionId))
      await generateAttestation({ apprenant, session, type: form.type, dateEmission: form.dateEmission })
      onClose()
    } finally { setBusy(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label block mb-1">Apprenant</label>
        <select className={`input w-full ${errors.apprenantId ? 'border-danger' : ''}`} value={form.apprenantId} onChange={e => setForm(p => ({ ...p, apprenantId: e.target.value }))}>
          <option value="">Sélectionner un apprenant...</option>
          {apprenants.map(a => <option key={a.id} value={a.id}>{a.nom} — {a.filiere}</option>)}
        </select>
        {errors.apprenantId && <p className="text-xs text-danger mt-1">{errors.apprenantId}</p>}
      </div>
      <div>
        <label className="label block mb-1">Session de formation</label>
        <select className={`input w-full ${errors.sessionId ? 'border-danger' : ''}`} value={form.sessionId} onChange={e => setForm(p => ({ ...p, sessionId: e.target.value }))}>
          <option value="">Sélectionner une session...</option>
          {sessions.map(s => <option key={s.id} value={s.id}>{s.intitule}</option>)}
        </select>
        {errors.sessionId && <p className="text-xs text-danger mt-1">{errors.sessionId}</p>}
      </div>
      <div>
        <label className="label block mb-1">Type d'attestation</label>
        <select className="input w-full" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
          <option>Attestation de présence</option>
          <option>Attestation de suivi</option>
          <option>Attestation de réussite</option>
          <option>Attestation de formation</option>
        </select>
      </div>
      <div>
        <label className="label block mb-1">Date d'émission</label>
        <input type="date" className="input w-full" value={form.dateEmission} onChange={e => setForm(p => ({ ...p, dateEmission: e.target.value }))} />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="flex-1 btn-ghost border border-border">Annuler</button>
        <button type="submit" disabled={busy} className="flex-1 btn-primary flex items-center justify-center gap-2">
          {busy ? <RefreshCw size={14} className="animate-spin" /> : <Award size={14} />}
          Générer le PDF
        </button>
      </div>
    </form>
  )
}

// ── Convention form ───────────────────────────────────────────────────────────
function ConventionForm({ onClose }) {
  const [form, setForm]     = useState({ entreprise: '', representant: '', apprenantId: '', sessionId: '', cout: '', dateSign: new Date().toISOString().slice(0, 10) })
  const [errors, setErrors] = useState({})
  const [busy, setBusy]     = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.entreprise.trim()) errs.entreprise = 'Raison sociale requise'
    if (!form.sessionId)         errs.sessionId  = 'Sélectionner une session'
    if (Object.keys(errs).length) { setErrors(errs); return }

    setBusy(true)
    try {
      const apprenant = apprenants.find(a => a.id === Number(form.apprenantId))
      const session   = sessions.find(s => s.id === Number(form.sessionId))
      await generateConvention({ ...form, apprenant, session })
      onClose()
    } finally { setBusy(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="label block mb-1">Raison sociale entreprise</label>
          <input className={`input w-full ${errors.entreprise ? 'border-danger' : ''}`} placeholder="Ex: TechMaroc SARL" value={form.entreprise} onChange={e => setForm(p => ({ ...p, entreprise: e.target.value }))} />
          {errors.entreprise && <p className="text-xs text-danger mt-1">{errors.entreprise}</p>}
        </div>
        <div>
          <label className="label block mb-1">Représentant légal</label>
          <input className="input w-full" placeholder="Nom et prénom" value={form.representant} onChange={e => setForm(p => ({ ...p, representant: e.target.value }))} />
        </div>
      </div>
      <div>
        <label className="label block mb-1">Stagiaire / Apprenant</label>
        <select className="input w-full" value={form.apprenantId} onChange={e => setForm(p => ({ ...p, apprenantId: e.target.value }))}>
          <option value="">Sélectionner (optionnel)...</option>
          {apprenants.map(a => <option key={a.id} value={a.id}>{a.nom}</option>)}
        </select>
      </div>
      <div>
        <label className="label block mb-1">Formation concernée</label>
        <select className={`input w-full ${errors.sessionId ? 'border-danger' : ''}`} value={form.sessionId} onChange={e => setForm(p => ({ ...p, sessionId: e.target.value }))}>
          <option value="">Sélectionner une session...</option>
          {sessions.map(s => <option key={s.id} value={s.id}>{s.intitule}</option>)}
        </select>
        {errors.sessionId && <p className="text-xs text-danger mt-1">{errors.sessionId}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="label block mb-1">Coût total (MAD)</label>
          <input type="number" className="input w-full" placeholder="Ex: 15000" value={form.cout} onChange={e => setForm(p => ({ ...p, cout: e.target.value }))} />
        </div>
        <div>
          <label className="label block mb-1">Date de signature</label>
          <input type="date" className="input w-full" value={form.dateSign} onChange={e => setForm(p => ({ ...p, dateSign: e.target.value }))} />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="flex-1 btn-ghost border border-border">Annuler</button>
        <button type="submit" disabled={busy} className="flex-1 btn-primary flex items-center justify-center gap-2" style={{ backgroundColor: '#DCA35A' }}>
          {busy ? <RefreshCw size={14} className="animate-spin" /> : <BookOpen size={14} />}
          Générer la convention
        </button>
      </div>
    </form>
  )
}
