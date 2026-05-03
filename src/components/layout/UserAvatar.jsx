import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { Camera, Settings, LogOut, Shield, GraduationCap, UserCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const ROLE_CONFIG = {
  admin:     { label: 'Administrateur', icon: Shield,        badgeBg: '#DCA35A',              badgeColor: '#fff' },
  formateur: { label: 'Formateur',      icon: UserCheck,     badgeBg: 'rgba(255,255,255,0.2)', badgeColor: '#fff' },
  apprenant: { label: 'Apprenant',      icon: GraduationCap, badgeBg: 'rgba(255,255,255,0.15)', badgeColor: '#fff' },
}

function useUserPhoto() {
  const [photo, setPhotoState] = useState(() => {
    try { return localStorage.getItem('sela_user_photo') || null } catch { return null }
  })
  const setPhoto = useCallback((dataUrl) => {
    if (dataUrl) localStorage.setItem('sela_user_photo', dataUrl)
    else         localStorage.removeItem('sela_user_photo')
    setPhotoState(dataUrl)
  }, [])
  return [photo, setPhoto]
}

export default function UserAvatar({ size = 'md', showPopover = true }) {
  const { user, logout }          = useAuth()
  const navigate                  = useNavigate()
  const [open, setOpen]           = useState(false)
  const [photo, setPhoto]         = useUserPhoto()
  const [uploading, setUploading] = useState(false)
  const [popoverPos, setPopoverPos] = useState({ bottom: 80, left: 16 })
  const triggerRef                = useRef(null)
  const popoverRef                = useRef(null)
  const fileRef                   = useRef(null)

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : 'SA'

  const roleCfg = ROLE_CONFIG[user?.role] || ROLE_CONFIG.admin
  const RoleIcon = roleCfg.icon

  // Compute fixed position from trigger element bounding rect
  const handleToggle = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPopoverPos({
        bottom: window.innerHeight - rect.top + 10,
        left:   rect.left,
      })
    }
    setOpen(o => !o)
  }

  // Close when clicking outside both the trigger and the popover
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      const inTrigger  = triggerRef.current?.contains(e.target)
      const inPopover  = popoverRef.current?.contains(e.target)
      if (!inTrigger && !inPopover) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      alert('Image trop volumineuse (max 2 MB)')
      return
    }
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

  // ── Portal popover ────────────────────────────────────────────────────────────
  const popoverEl = open ? createPortal(
    <div
      ref={popoverRef}
      style={{
        position:     'fixed',
        bottom:       popoverPos.bottom,
        left:         popoverPos.left,
        width:        280,
        zIndex:       9999,
        borderRadius: 20,
        boxShadow:    '0 8px 40px rgba(0,0,0,0.18)',
        border:       '1px solid #e2e8f0',
        background:   '#fff',
        overflow:     'hidden',
        animation:    'avatarPopIn 0.18s ease',
      }}
    >
      <style>{`
        @keyframes avatarPopIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
      `}</style>

      {/* ── Top gradient header ─────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg, #00839F, #007493)', padding: '24px 20px', textAlign: 'center' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          border: '3px solid rgba(255,255,255,0.4)',
          overflow: 'hidden', margin: '0 auto 12px',
          background: photo ? 'transparent' : 'rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {photo
            ? <img src={photo} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span style={{ color: '#fff', fontSize: 24, fontWeight: 700 }}>{initials}</span>
          }
        </div>

        <p style={{ color: '#fff', fontSize: 16, fontWeight: 700, margin: 0 }}>
          {user?.name || 'Utilisateur'}
        </p>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 4 }}>
          {user?.email || ''}
        </p>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          marginTop: 8, padding: '3px 12px', borderRadius: 999,
          fontSize: 12, fontWeight: 600,
          background: roleCfg.badgeBg, color: roleCfg.badgeColor,
        }}>
          <RoleIcon size={11} />
          {roleCfg.label}
        </span>
      </div>

      {/* ── Photo section ───────────────────────────────────────────────────── */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9' }}>
        <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Photo de profil
        </p>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          style={{
            width: '100%', height: 40,
            border: '1.5px dashed #00839F', borderRadius: 10,
            background: uploading ? '#f0f9fb' : '#f0f9fb',
            color: '#00839F', fontSize: 13, fontWeight: 500,
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 8, opacity: uploading ? 0.6 : 1,
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#e0f4f8'}
          onMouseLeave={e => e.currentTarget.style.background = '#f0f9fb'}
        >
          <Camera size={14} />
          {uploading ? 'Chargement...' : 'Changer la photo'}
        </button>
        {photo && (
          <button
            onClick={() => setPhoto(null)}
            style={{
              marginTop: 8, width: '100%', padding: '6px 0',
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#ef4444', fontSize: 13, textAlign: 'center',
            }}
          >
            Supprimer la photo
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
      </div>

      {/* ── Menu items ──────────────────────────────────────────────────────── */}
      <div style={{ padding: 8 }}>
        {[
          { icon: Settings, label: 'Paramètres du compte', path: '/parametres', color: '#374151' },
          { icon: LogOut,   label: 'Se déconnecter',       path: null,          color: '#ef4444', action: handleLogout },
        ].map(({ icon: Icon, label, path, color, action }) => (
          <button
            key={label}
            onClick={action || (() => handleNav(path))}
            style={{
              width: '100%', padding: '10px 12px',
              borderRadius: 10, display: 'flex', alignItems: 'center',
              gap: 10, fontSize: 14, cursor: 'pointer',
              background: 'transparent', border: 'none', textAlign: 'left',
              color, transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>
    </div>,
    document.body
  ) : null

  // ── Trigger (the avatar circle in the sidebar) ────────────────────────────
  if (!showPopover) {
    return (
      <div
        ref={triggerRef}
        className={`${dim} rounded-xl flex-shrink-0 overflow-hidden ${photo ? '' : 'bg-primary flex items-center justify-center text-white font-bold'}`}
      >
        {photo ? <img src={photo} alt="avatar" className="w-full h-full object-cover" /> : initials}
      </div>
    )
  }

  return (
    <>
      <button
        ref={triggerRef}
        onClick={handleToggle}
        className={`${dim} rounded-xl flex-shrink-0 overflow-hidden ring-2 ring-transparent hover:ring-primary/40 transition-all duration-150 cursor-pointer ${photo ? '' : 'bg-primary flex items-center justify-center text-white font-bold'}`}
      >
        {photo
          ? <img src={photo} alt="avatar" className="w-full h-full object-cover" />
          : initials
        }
      </button>
      {popoverEl}
    </>
  )
}
