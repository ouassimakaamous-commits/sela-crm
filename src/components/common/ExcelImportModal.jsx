import { useState, useRef, useCallback } from 'react'
import { Upload, FileSpreadsheet, ArrowRight, CheckCircle, XCircle, AlertTriangle, RotateCcw, Download } from 'lucide-react'
import Modal from './Modal'
import toast from 'react-hot-toast'

// ── Step indicator ─────────────────────────────────────────────────────────────
function Steps({ current }) {
  const steps = ['Fichier', 'Colonnes', 'Validation', 'Importation']
  return (
    <div className="flex items-center gap-1 mb-6">
      {steps.map((s, i) => {
        const done    = i < current
        const active  = i === current
        return (
          <div key={s} className="flex items-center gap-1 flex-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${done ? 'bg-success text-white' : active ? 'bg-primary text-white' : 'bg-bg text-text3'}`}>
              {done ? <CheckCircle size={12} /> : i + 1}
            </div>
            <span className={`text-xs font-medium flex-1 ${active ? 'text-primary' : done ? 'text-success' : 'text-text3'}`}>{s}</span>
            {i < steps.length - 1 && <div className={`h-px w-4 ${done ? 'bg-success' : 'bg-border'}`} />}
          </div>
        )
      })}
    </div>
  )
}

// ── Step 0 : File drop ─────────────────────────────────────────────────────────
function StepFile({ onFile }) {
  const [dragOver, setDragOver] = useState(false)
  const [error, setError]       = useState('')
  const inputRef                = useRef(null)

  const process = useCallback(async (file) => {
    setError('')
    const allowed = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv']
    const ext     = file.name.split('.').pop().toLowerCase()
    if (!['xlsx', 'xls', 'csv'].includes(ext)) { setError('Format non accepté. Utilisez .xlsx, .xls ou .csv'); return }
    if (file.size > 20 * 1024 * 1024) { setError('Fichier trop volumineux (max 20 MB)'); return }
    const XLSX     = await import('xlsx')
    const buf      = await file.arrayBuffer()
    const wb       = XLSX.read(buf, { type: 'array' })
    const ws       = wb.Sheets[wb.SheetNames[0]]
    const rows     = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })
    if (rows.length < 2) { setError('Le fichier est vide ou ne contient qu\'une ligne d\'en-tête'); return }
    const headers  = rows[0].map(h => String(h).trim())
    const data     = rows.slice(1).filter(r => r.some(c => String(c).trim()))
    onFile({ headers, data, name: file.name, count: data.length })
  }, [onFile])

  const onDrop = (e) => {
    e.preventDefault(); setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) process(f)
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-150 ${dragOver ? 'border-primary bg-primary-light scale-[1.01]' : 'border-border hover:border-primary/50 hover:bg-bg'}`}
      >
        <FileSpreadsheet size={36} className={`mx-auto mb-3 ${dragOver ? 'text-primary' : 'text-text3'}`} />
        <p className={`font-semibold text-sm ${dragOver ? 'text-primary' : 'text-text1'}`}>
          {dragOver ? 'Déposer ici...' : 'Glisser-déposer votre fichier Excel'}
        </p>
        <p className="text-xs text-text3 mt-1">ou <span className="text-primary font-semibold">parcourir</span> — .xlsx, .xls, .csv</p>
        <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) process(f) }} />
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-danger/5 border border-danger/20 rounded-xl text-sm text-danger">
          <AlertTriangle size={14} />  {error}
        </div>
      )}

      <div className="flex items-center gap-2 p-3 bg-bg rounded-xl text-xs text-text3">
        <Download size={12} className="flex-shrink-0" />
        Conseil : première ligne = en-têtes (Nom, Âge, Filière, Financement, Statut…)
      </div>
    </div>
  )
}

// ── Step 1 : Column mapping ────────────────────────────────────────────────────
function StepMapping({ headers, fields, mapping, setMapping, onNext, onBack }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-text2">Associez chaque colonne de votre fichier à un champ de l'application.</p>

      <div className="space-y-2">
        {fields.map(f => (
          <div key={f.key} className="flex items-center gap-3">
            <div className="w-36 flex-shrink-0">
              <p className="text-xs font-semibold text-text1">{f.label}</p>
              {f.required && <span className="text-[10px] text-danger">Requis</span>}
            </div>
            <ArrowRight size={14} className="text-text3 flex-shrink-0" />
            <select
              className="input flex-1 text-sm"
              value={mapping[f.key] ?? ''}
              onChange={e => setMapping(m => ({ ...m, [f.key]: e.target.value }))}
            >
              <option value="">— Ignorer —</option>
              {headers.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={onBack} className="flex-1 btn-ghost border border-border">Retour</button>
        <button onClick={onNext} className="flex-1 btn-primary">Voir la prévisualisation</button>
      </div>
    </div>
  )
}

// ── Step 2 : Validation preview ────────────────────────────────────────────────
function StepPreview({ rows, fields, onImport, onBack }) {
  const valid   = rows.filter(r => r._valid)
  const invalid = rows.filter(r => !r._valid)

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="flex-1 flex items-center gap-2 p-3 bg-success/10 border border-success/20 rounded-xl">
          <CheckCircle size={16} className="text-success" />
          <div>
            <p className="text-sm font-bold text-success">{valid.length}</p>
            <p className="text-xs text-text3">Lignes valides</p>
          </div>
        </div>
        <div className="flex-1 flex items-center gap-2 p-3 bg-danger/5 border border-danger/20 rounded-xl">
          <XCircle size={16} className="text-danger" />
          <div>
            <p className="text-sm font-bold text-danger">{invalid.length}</p>
            <p className="text-xs text-text3">Lignes ignorées</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border overflow-hidden max-h-64 overflow-y-auto">
        <table className="w-full text-xs">
          <thead className="bg-bg sticky top-0">
            <tr>
              <th className="px-3 py-2 text-left label w-8">#</th>
              {fields.filter(f => f.key !== '_valid' && f.key !== '_errors').map(f => (
                <th key={f.key} className="px-3 py-2 text-left label">{f.label}</th>
              ))}
              <th className="px-3 py-2 text-left label">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row, i) => (
              <tr key={i} className={row._valid ? 'bg-success/3' : 'bg-danger/3'}>
                <td className="px-3 py-2 text-text3">{i + 1}</td>
                {fields.map(f => (
                  <td key={f.key} className={`px-3 py-2 font-medium ${!row[f.key] && f.required ? 'text-danger' : 'text-text1'}`}>
                    {String(row[f.key] ?? '—')}
                  </td>
                ))}
                <td className="px-3 py-2">
                  {row._valid
                    ? <span className="text-success font-bold flex items-center gap-1"><CheckCircle size={11} /> OK</span>
                    : <span className="text-danger font-bold flex items-center gap-1"><XCircle size={11} /> {row._errors}</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={onBack} className="flex-1 btn-ghost border border-border flex items-center justify-center gap-2">
          <RotateCcw size={13} /> Remapper
        </button>
        <button
          onClick={() => onImport(valid)}
          disabled={valid.length === 0}
          className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Upload size={13} /> Importer {valid.length} ligne{valid.length > 1 ? 's' : ''}
        </button>
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function ExcelImportModal({ open, onClose, fields, onImport, entityName = 'entrées' }) {
  const [step, setStep]       = useState(0)
  const [fileData, setFileData] = useState(null)
  const [mapping, setMapping] = useState({})
  const [preview, setPreview] = useState([])

  const reset = () => { setStep(0); setFileData(null); setMapping({}); setPreview([]) }

  const handleClose = () => { reset(); onClose() }

  const handleFile = (data) => {
    setFileData(data)
    // Auto-map: if header matches field label/key exactly, pre-fill
    const autoMap = {}
    fields.forEach(f => {
      const match = data.headers.find(h =>
        h.toLowerCase() === f.label.toLowerCase() ||
        h.toLowerCase() === f.key.toLowerCase() ||
        h.toLowerCase().replace(/[éèê]/g, 'e').replace(/[àâ]/g, 'a') === f.label.toLowerCase().replace(/[éèê]/g, 'e').replace(/[àâ]/g, 'a')
      )
      if (match) autoMap[f.key] = match
    })
    setMapping(autoMap)
    setStep(1)
  }

  const buildPreview = () => {
    const rows = fileData.data.map((row) => {
      const entry = {}
      fields.forEach(f => {
        const col = mapping[f.key]
        const idx = col ? fileData.headers.indexOf(col) : -1
        entry[f.key] = idx >= 0 ? String(row[idx] ?? '').trim() : ''
      })
      const errors = fields.filter(f => f.required && !entry[f.key]).map(f => `${f.label} manquant`)
      entry._valid  = errors.length === 0
      entry._errors = errors.join(', ')
      return entry
    })
    setPreview(rows)
    setStep(2)
  }

  const handleImport = (validRows) => {
    validRows.forEach(row => {
      const clean = { ...row }
      delete clean._valid; delete clean._errors
      onImport(clean)
    })
    toast.success(`${validRows.length} ${entityName} importé${validRows.length > 1 ? 's' : ''} avec succès`)
    handleClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title={`Importer ${entityName} depuis Excel`} size="md">
      <Steps current={step} />

      {step === 0 && <StepFile onFile={handleFile} />}

      {step === 1 && fileData && (
        <StepMapping
          headers={fileData.headers}
          fields={fields}
          mapping={mapping}
          setMapping={setMapping}
          onNext={buildPreview}
          onBack={() => setStep(0)}
        />
      )}

      {step === 2 && (
        <StepPreview
          rows={preview}
          fields={fields.filter(f => !f.hidden)}
          onImport={handleImport}
          onBack={() => setStep(1)}
        />
      )}
    </Modal>
  )
}
