import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Settings, LogOut, Shield, GraduationCap, UserCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const ROLE_CONFIG = {
  admin:      { label: 'Administrateur', icon: Shield,       bg: 'bg-primary/10',  text: 'text-primary' },
  formateur:  { label: 'Formateur',      icon: UserCheck,    bg: 'bg-accent/10',   text: 'text-accent'  },
  apprenant:  { label: 'Apprenant',      icon: GraduationCap, bg: 'bg-purple-100', text: 'text-purple-600' },
}

function useUserPhoto() {
  const [photo, setPhotoState] = useState(() => {
    try { return localStorage.getItem('sela_user_photo') || null } catch { return null }
  })

  const setPhoto = (dataUrl) => {
    if (dataUrl) localStorage.setItem('sela_user_photo', dataUrl)
    else         localStorage.removeItem('sela_user_photo')
    setPhotoState(dataUrl)
  }

  return [photo, setPhoto]
}

export default function UserAvatar({ size = 'md', showPopover = true, expanded = true }) {
  const { user, logout }        = useAuth()
  const navigate                = useNavigate()
  const [open, setOpen]         = useState(false)
  const [photo, setPhoto]       = useUserPhoto()
  const [uploading, setUploading] = useState(false)
  const wrapRef                 = useRef(null)
  const fileRef                 = useRef(null)

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : 'SA'

  const roleCfg = ROLE_CONFIG[user?.role] || ROLE_CONFIG.admin

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) return
    setUploading(true)
    const reader = new FileReader()
    reader.onload = (ev) => { setPhoto(ev.target.result); setUploading(false) }
    reader.readAsDataURL(file)
  }

  const handleLogout = () => {
    setOpen(false)
    logout()
    navigate('/login', { replace: true })
  }

  const handleNav = (path) => { setOpen(false); navigate(path) }

  const dim = size === 'sm' ? 'w-7 h-7 text-[10px]' : size === 'lg' ? 'w-10 h-10 text-sm' : 'w-8 h-8 text-xs'

  const AvatarCircle = (
    <button
      onClick={() => showPopover && setOpen(o => !o)}
      className={`${dim} rounded-xl flex-shrink-0 overflow-hidden ring-2 ring-transparent hover:ring-primary/40 transition-all duration-150 ${photo ? '' : 'bg-primary flex items-center justify-center text-white font-bold'} ${showPopover ? 'cursor-pointer' : 'cursor-default'}`}
    >
      {photo
        ? <img src={photo} alt="avatar" className="w-full h-full object-cover" />
        : initials
      }
    </button>
  )

  if (!showPopover) return AvatarCircle

  return (
    <div ref={wrapRef} className="relative">
      {AvatarCircle}

      {open && (
        <div className="absolute right-0 bottom-full mb-2 w-64 bg-white rounded-2xl shadow-2xl border border-border z-[60] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-primary to-primary-dark p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-white/40 flex-shrink-0">
              {photo
                ? <img src={photo} alt="avatar" className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">{initials}</div>
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm truncate">{user?.name || 'Utilisateur'}</p>
              <p className="text-white/70 text-xs truncate">{user?.email || ''}</p>
              <span className={`inline-flex items-center gap-1 mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${roleCfg.bg} ${roleCfg.text}`}>
                <roleCfg.icon size={9} />
                {roleCfg.label}
              </span>
            </div>
          </div>

          {/* Photo upload */}
          <div className="px-3 py-2 border-b border-border">
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-text2 hover:bg-bg hover:text-primary transition-colors"
            >
              <Camera size={14} className="flex-shrink-0" />
              {uploading ? 'Chargement...' : 'Changer la photo'}
            </button>
            {photo && (
              <button
                onClick={() => setPhoto(null)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-text3 hover:bg-bg transition-colors"
              >
                <span className="text-xs">✕</span> Supprimer la photo
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          </div>

          {/* Nav links */}
          <div className="px-3 py-2">
            <button
              onClick={() => handleNav('/parametres')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-text2 hover:bg-bg hover:text-primary transition-colors"
            >
              <Settings size={14} className="flex-shrink-0" /> Paramètres
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut size={14} className="flex-shrink-0" /> Se déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
