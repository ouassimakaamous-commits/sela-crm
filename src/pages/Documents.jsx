import { useState } from 'react'
import { Search, Upload, Download, Eye, Filter, FileText, BookOpen, Award, Send, BarChart2, CheckSquare } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import StatusBadge from '../components/common/StatusBadge'
import { documents } from '../data/mockData'

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
  pdf: 'bg-red-50 text-red-600 border-red-200',
  xlsx: 'bg-green-50 text-green-600 border-green-200',
  docx: 'bg-blue-50 text-blue-600 border-blue-200',
}

export default function Documents() {
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('Toutes')
  const [isDragOver, setIsDragOver] = useState(false)

  const filtered = documents.filter(d => {
    const ms = d.nom.toLowerCase().includes(search.toLowerCase())
    const mc = filterCat === 'Toutes' || d.categorie === filterCat
    return ms && mc
  })

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
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Générer une attestation', icon: Award, color: 'text-primary bg-primary-light hover:bg-primary hover:text-white' },
          { label: 'Générer une convention', icon: BookOpen, color: 'text-accent bg-accent-light hover:bg-accent hover:text-white' },
          { label: 'Exporter BPF Qualiopi', icon: CheckSquare, color: 'text-success bg-success/10 hover:bg-success hover:text-white' },
        ].map(({ label, icon: Icon, color }) => (
          <button key={label} className={`flex items-center gap-3 p-4 rounded-2xl border border-border font-semibold text-sm transition-all duration-150 ${color}`}>
            <Icon size={18} /> {label}
          </button>
        ))}
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
      <div className="grid grid-cols-3 gap-4">
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
                  <button className="w-7 h-7 rounded-lg hover:bg-primary-light flex items-center justify-center text-text3 hover:text-primary transition-colors" title="Voir">
                    <Eye size={13} />
                  </button>
                  <button className="w-7 h-7 rounded-lg hover:bg-bg flex items-center justify-center text-text3 hover:text-text1 transition-colors" title="Télécharger">
                    <Download size={13} />
                  </button>
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
          <p className="text-text3 text-sm mt-1">Essayez une autre recherche ou catégorie</p>
        </div>
      )}
    </div>
  )
}
