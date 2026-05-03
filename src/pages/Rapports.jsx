import { useState } from 'react'
import { Download, FileText, Calendar, RefreshCw } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import {
  rapports, heuresSup, apprenants, sessions, formateurs, financesMensuellesData,
} from '../data/mockData'

// ── PDF helpers ───────────────────────────────────────────────────────────────
async function buildPDF(title, period, columns, rows, landscape = false) {
  const { jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')
  const doc = new jsPDF({ orientation: landscape ? 'landscape' : 'portrait', unit: 'mm', format: 'a4' })

  // Header
  doc.setFillColor(0, 131, 159)
  doc.rect(0, 0, doc.internal.pageSize.width, 24, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Centre SELA', 14, 10)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(title, 14, 17)
  doc.setFontSize(8)
  doc.text(`Période : ${period}`, doc.internal.pageSize.width - 14, 17, { align: 'right' })

  doc.setTextColor(0, 0, 0)

  autoTable(doc, {
    startY: 30,
    head: [columns],
    body: rows,
    headStyles: { fillColor: [0, 131, 159], textColor: 255, fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [244, 246, 248] },
    styles: { cellPadding: 3, overflow: 'linebreak' },
    margin: { left: 14, right: 14 },
  })

  // Footer
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(7)
    doc.setTextColor(150)
    doc.text(
      `Généré le ${new Date().toLocaleDateString('fr-MA')} · Page ${i}/${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 8,
      { align: 'center' }
    )
  }

  return doc
}

// ── Excel helper ──────────────────────────────────────────────────────────────
async function saveExcel(filename, sheetName, header, rows) {
  const XLSX = await import('xlsx')
  const { saveAs } = await import('file-saver')
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.aoa_to_sheet([header, ...rows])
  const colWidths = header.map((h, i) => ({
    wch: Math.max(h.length, ...rows.map(r => String(r[i] ?? '').length)) + 2,
  }))
  ws['!cols'] = colWidths
  XLSX.utils.book_append_sheet(wb, ws, sheetName)
  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  saveAs(new Blob([buf], { type: 'application/octet-stream' }), filename)
}

// ── Per-report export handlers ─────────────────────────────────────────────────
const EXPORT_HANDLERS = {
  // Rapport mensuel des HS
  1: {
    PDF: async (period) => {
      const cols = ['Formateur', 'Date', 'Session', 'Type', 'Heures', 'Montant (MAD)', 'Statut']
      const rows = heuresSup.map(h => [h.formateur, h.date, h.session, h.type, h.heures, `${h.montantFinal.toLocaleString('fr-MA')} MAD`, h.statut])
      const doc = await buildPDF('Rapport mensuel des Heures Supplémentaires', period, cols, rows, true)
      doc.save(`rapport-hs-${Date.now()}.pdf`)
    },
    Excel: async (period) => {
      const header = ['Formateur', 'Date', 'Session', 'Type', 'Heures', 'Taux/H (MAD)', 'Montant Brut', 'Majoration %', 'Montant Final', 'Statut', 'Validé par']
      const rows = heuresSup.map(h => [h.formateur, h.date, h.session, h.type, h.heures, h.tauxHoraire, h.montantBrut, `${h.majoration}%`, h.montantFinal, h.statut, h.validepar || '-'])
      await saveExcel(`rapport-hs-${Date.now()}.xlsx`, 'Heures Sup', header, rows)
    },
  },

  // BPF Qualiopi (PDF only)
  2: {
    PDF: async (period) => {
      const cols = ['Session', 'Formateur', 'Date début', 'Date fin', 'Durée', 'Inscrits', 'Financement', 'Statut']
      const rows = sessions.map(s => [s.intitule, s.formateur, s.dateDebut, s.dateFin, s.duree, `${s.inscrits}/${s.places}`, s.financement, s.statut])
      const doc = await buildPDF('Bilan Pédagogique et Financier — Qualiopi', period, cols, rows, true)
      doc.save(`bpf-qualiopi-${Date.now()}.pdf`)
    },
  },

  // Bilan des apprenants
  3: {
    PDF: async (period) => {
      const cols = ['Nom', 'Âge', 'Filière', 'Session', 'Financement', 'Statut', "Date d'inscription"]
      const rows = apprenants.map(a => [a.nom, a.age, a.filiere, a.session, a.financement, a.statut, a.dateInscription])
      const doc = await buildPDF('Bilan des Apprenants', period, cols, rows, true)
      doc.save(`bilan-apprenants-${Date.now()}.pdf`)
    },
    Excel: async (period) => {
      const header = ['Nom', 'Âge', 'Filière', 'Session', 'Financement', 'Statut', "Date d'inscription"]
      const rows = apprenants.map(a => [a.nom, a.age, a.filiere, a.session, a.financement, a.statut, a.dateInscription])
      await saveExcel(`bilan-apprenants-${Date.now()}.xlsx`, 'Apprenants', header, rows)
    },
  },

  // Rapport financier mensuel
  4: {
    PDF: async (period) => {
      const cols = ['Mois', 'Recettes (MAD)', 'Dépenses (MAD)', 'Solde (MAD)']
      const rows = financesMensuellesData.map(f => [
        f.mois,
        f.recettes.toLocaleString('fr-MA'),
        f.depenses.toLocaleString('fr-MA'),
        (f.recettes - f.depenses).toLocaleString('fr-MA'),
      ])
      const doc = await buildPDF('Rapport Financier Mensuel', period, cols, rows)
      doc.save(`rapport-financier-${Date.now()}.pdf`)
    },
    Excel: async (period) => {
      const header = ['Mois', 'Recettes (MAD)', 'Dépenses (MAD)', 'Solde (MAD)']
      const rows = financesMensuellesData.map(f => [f.mois, f.recettes, f.depenses, f.recettes - f.depenses])
      await saveExcel(`rapport-financier-${Date.now()}.xlsx`, 'Finances', header, rows)
    },
  },

  // Planning des sessions
  5: {
    PDF: async (period) => {
      const cols = ['Intitulé', 'Formateur', 'Début', 'Fin', 'Durée', 'Inscrits', 'Salle', 'Statut']
      const rows = sessions.map(s => [s.intitule, s.formateur, s.dateDebut, s.dateFin, s.duree, `${s.inscrits}/${s.places}`, s.salle, s.statut])
      const doc = await buildPDF('Planning des Sessions', period, cols, rows, true)
      doc.save(`planning-sessions-${Date.now()}.pdf`)
    },
    Excel: async (period) => {
      const header = ['Intitulé', 'Formateur', 'Début', 'Fin', 'Durée', 'Inscrits', 'Places', 'Salle', 'Financement', 'Statut']
      const rows = sessions.map(s => [s.intitule, s.formateur, s.dateDebut, s.dateFin, s.duree, s.inscrits, s.places, s.salle, s.financement, s.statut])
      await saveExcel(`planning-sessions-${Date.now()}.xlsx`, 'Sessions', header, rows)
    },
  },

  // Performance des formateurs
  6: {
    PDF: async (period) => {
      const cols = ['Nom', 'Spécialité', 'Grade', 'Sessions/mois', 'HSA', 'HSE', 'Total HS', 'Quota', 'Taux/h (MAD)']
      const rows = formateurs.map(f => [f.nom, f.specialite, f.grade, f.sessionsParMois, f.hsaMois, f.hseMois, f.totalHS, f.quotaMensuel, f.tauxHoraire])
      const doc = await buildPDF('Performance des Formateurs', period, cols, rows, true)
      doc.save(`performance-formateurs-${Date.now()}.pdf`)
    },
  },
}

// ─────────────────────────────────────────────────────────────────────────────

export default function Rapports() {
  const [generating, setGenerating] = useState(null)
  const [dateDebut, setDateDebut]   = useState('2025-05-01')
  const [dateFin, setDateFin]       = useState('2025-05-31')

  const period = `${dateDebut} → ${dateFin}`

  const handleGenerate = async (id, fmt) => {
    setGenerating({ id, fmt })
    try {
      const handler = EXPORT_HANDLERS[id]?.[fmt]
      if (handler) await handler(period)
    } catch (err) {
      console.error('Export error:', err)
    } finally {
      setGenerating(null)
    }
  }

  return (
    <div>
      <PageHeader title="Rapports" subtitle="Génération et export des rapports de gestion" />

      {/* Date range global */}
      <div className="card p-4 mb-5 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-text2 font-medium">
          <Calendar size={15} className="text-primary" />
          Période de référence pour tous les rapports :
        </div>
        <div className="flex items-center gap-3">
          <div>
            <label className="label block mb-0.5">Du</label>
            <input type="date" className="input" value={dateDebut} onChange={e => setDateDebut(e.target.value)} />
          </div>
          <div>
            <label className="label block mb-0.5">Au</label>
            <input type="date" className="input" value={dateFin} onChange={e => setDateFin(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Report cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {rapports.map((r) => {
          const isGen = generating?.id === r.id
          return (
            <div key={r.id} className="card p-5 hover:shadow-card-hover transition-all duration-150">
              {/* Preview thumbnail */}
              <div className="h-28 bg-bg rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden">
                <div className="text-5xl opacity-20">{r.icone}</div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary-light/50 to-transparent" />
                <div className="absolute bottom-2 right-2 text-[10px] text-text3 font-medium bg-white/80 px-2 py-0.5 rounded-full">
                  Aperçu
                </div>
              </div>

              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl flex-shrink-0">{r.icone}</span>
                <div>
                  <p className="font-bold text-text1 leading-tight">{r.titre}</p>
                  <p className="text-xs text-text3 mt-1">{r.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-text3 mb-4">
                <RefreshCw size={11} />
                <span>Dernière génération : {r.dernierGenere}</span>
              </div>

              <div className="flex gap-2">
                {r.format.map(fmt => {
                  const busy = isGen && generating?.fmt === fmt
                  return (
                    <button
                      key={fmt}
                      onClick={() => handleGenerate(r.id, fmt)}
                      disabled={isGen}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 ${
                        fmt === 'PDF'
                          ? 'bg-primary-light text-primary border-primary/20 hover:bg-primary hover:text-white'
                          : 'bg-success/10 text-success border-success/20 hover:bg-success hover:text-white'
                      } ${isGen ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {busy
                        ? <RefreshCw size={11} className="animate-spin" />
                        : <Download size={11} />
                      }
                      {fmt === 'PDF' ? 'Générer PDF' : 'Exporter Excel'}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent activity */}
      <div className="card p-5 mt-5">
        <p className="font-bold text-text1 mb-4">Rapports récemment générés</p>
        <div className="space-y-3">
          {[
            { titre: 'Rapport mensuel HS – Avril 2025', date: '2025-05-01 09:14', par: 'Admin SELA', format: 'PDF', taille: '2.4 MB' },
            { titre: 'BPF Qualiopi – Q1 2025', date: '2025-04-30 16:32', par: 'Admin SELA', format: 'PDF', taille: '3.8 MB' },
            { titre: 'Bilan apprenants – Avril 2025', date: '2025-05-02 10:05', par: 'Admin SELA', format: 'Excel', taille: '1.1 MB' },
            { titre: 'Rapport financier – Avril 2025', date: '2025-05-01 14:22', par: 'Admin SELA', format: 'PDF', taille: '1.8 MB' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-bg rounded-xl hover:bg-border/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <FileText size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text1">{item.titre}</p>
                  <p className="text-xs text-text3">{item.date} · par {item.par}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.format === 'PDF' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                  {item.format}
                </span>
                <span className="text-xs text-text3 hidden sm:block">{item.taille}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
