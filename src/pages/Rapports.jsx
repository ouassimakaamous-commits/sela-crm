import { useState } from 'react'
import { Download, FileText, Calendar, RefreshCw } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import { rapports } from '../data/mockData'

export default function Rapports() {
  const [generating, setGenerating] = useState(null)
  const [dateDebut, setDateDebut] = useState('2025-05-01')
  const [dateFin, setDateFin] = useState('2025-05-31')

  const handleGenerate = (id, format) => {
    setGenerating({ id, format })
    setTimeout(() => setGenerating(null), 2000)
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
              <div className="h-32 bg-bg rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden">
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
                <span>Dernière génération: {r.dernierGenere}</span>
              </div>

              <div className="flex gap-2">
                {r.format.map(fmt => (
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
                    {isGen && generating?.format === fmt ? (
                      <RefreshCw size={11} className="animate-spin" />
                    ) : (
                      <Download size={11} />
                    )}
                    {fmt === 'PDF' ? 'Générer PDF' : 'Exporter Excel'}
                  </button>
                ))}
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
                <span className="text-xs text-text3">{item.taille}</span>
                <button className="w-7 h-7 rounded-lg hover:bg-white flex items-center justify-center text-text3 hover:text-primary transition-colors">
                  <Download size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
