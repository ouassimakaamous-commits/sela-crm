import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import logoUrl from '../assets/logo.svg'

/* ─── Injected keyframe animations ─────────────────────────────────────── */
const KEYFRAMES = `
  @keyframes morph {
    0%   { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
    100% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  }
  @keyframes morphB {
    0%   { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
    100% { border-radius: 70% 30% 40% 60% / 50% 60% 30% 70%; }
  }
`

/* ─── White logo (for dark left panel) ─────────────────────────────────── */
function SelaLogoWhite({ width = 60, opacity = 1 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 841.89 715.68"
      width={width}
      style={{ display: 'block', opacity }}
    >
      <g>
        <path
          fill="white"
          d="M451.65,428.7h55.57l.96-168.28c.53-7.46,4.56-10.67,11.62-11.62,30.59-4.11,151.4-2.87,180.23,3.76,57.32,13.19,84.52,64.76,88.12,120.02,1.67,25.7,3.08,80.75,0,105.16-.7,5.51-4.09,13.6-10.65,13.6h-208.65v49.51h-32.84c-13.02,0-27.79-17.11-27.79-29.81v-19.7H64.16c-6.79,0-10.04,-10.15-10.64-15.63-2.71-24.63-1.47-71.5,0-97.06,9.62-168.29,150.13-123.97,270.34-129.82,4.29-.53,10.59,7.36,10.59,10.63v139.94h-61.63v-89.93h-105.59c-29.81,0-52.04,31.48-52.04,59.11v61.13l275.84-1.01v-230.88c0-14.58,23.64-34.86,37.89,-34.86h21.22l1.52,1.52v264.22ZM726.48,428.7c2.87-38.31,5.49-119.23-51.03-119.23h-105.59v120.24l1.52-1.01h155.1Z"
        />
      </g>
      <rect fill="#dca35a" x="608.06" y="515.44" width="179.59" height="49.87" rx="24.93" ry="24.93" />
      <circle fill="#dca35a" cx="153.12" cy="195.65" r="34.01" />
      <circle fill="#dca35a" cx="230.45" cy="195.65" r="34.01" />
      <g>
        <path fill="white" d="M150.56,544.15c0,3.15-.81,5.98-2.43,8.49s-4,4.48-7.12,5.9c-3.13,1.42-6.83,2.13-11.12,2.13-5.14,0-9.38-.97-12.72-2.91-2.37-1.4-4.29-3.26-5.77-5.6-1.48-2.33,-2.22-4.6-2.22-6.8,0-1.28.44-2.37,1.33-3.29.89-.91,2.02-1.37,3.39-1.37,1.11,0,2.05.35,2.82,1.07.77.71,1.43,1.76,1.97,3.16.66,1.66,1.38,3.04,2.15,4.16.77,1.11,1.85,2.03,3.25,2.75,1.4.72,3.23,1.08,5.51,1.08,3.13,0,5.67-.73,7.62-2.19,1.95-1.46,2.93-3.27,2.93-5.45,0-1.73-.53-3.13-1.58-4.21-1.05-1.08-2.42,-1.9-4.08-2.47s-3.9-1.17-6.7-1.81c-3.74-.88-6.87-1.9-9.4-3.07s-4.52-2.77-6-4.8c-1.48-2.02-2.22-4.54-2.22-7.55s.78-5.41,2.34-7.64c1.56-2.23,3.82-3.94,6.78-5.13,2.96-1.2,6.44-1.79,10.44-1.79,3.2,0,5.96.4,8.29,1.19,2.33.79,4.27,1.85,5.81,3.16,1.54,1.31,2.66,2.69,3.37,4.14.71,1.44,1.07,2.85,1.07,4.23,0,1.26-.44,2.39-1.33,3.39-.89,1.01-2,1.51-3.32,1.51-1.21,0-2.13-.3-2.75-.91-.63-.6-1.31-1.59-2.04-2.97-.95-1.97-2.08,-3.5-3.41-4.6-1.33-1.1-3.46-1.65-6.39-1.65-2.72,0-4.92.6,-6.59,1.79s-2.5,2.63-2.5,4.32c0,1.04.28,1.94.85,2.7.57.76,1.35,1.41,2.34,1.95s2,.97,3.02,1.28,2.7.76,5.04,1.35c2.94.69,5.59,1.44,7.97,2.27,2.38.83,4.4,1.84,6.07,3.02s2.97,2.68,3.91,4.49,1.4,4.03,1.4,6.66Z" />
        <path fill="white" d="M193.82,515.84h-23.76v12.79h21.88c1.61,0,2.81.36,3.61,1.08.79.72,1.19,1.68,1.19,2.86s-.39,2.15-1.17,2.9c-.78.75-1.99,1.12-3.62,1.12h-21.88v14.81h24.58c1.66,0,2.91.39,3.75,1.15.84.77,1.26,1.79,1.26,3.07s-.42,2.23-1.26,3c-.84.77-2.09,1.15-3.75,1.15h-28.67c-2.3,0-3.95-.51-4.96-1.53-1.01-1.02,-1.51-2.66-1.51-4.94v-39.15c0-1.52.22-2.75.67-3.71.45-.96,1.15-1.66,2.11-2.1.96-.44,2.18-.66,3.68-.66h27.85c1.68,0,2.93.37,3.75,1.12s1.23,1.72,1.23,2.93-.41,2.22-1.23,2.97c-.82.75-2.07,1.12-3.75,1.12Z" />
        <path fill="white" d="M218.37,513.21v37.9h21.38c1.71,0,3.01.41,3.93,1.24.91.83,1.37,1.87,1.37,3.13s-.45,2.31-1.35,3.11c-.9.79,-2.21,1.19-3.94,1.19h-25.47c-2.3,0-3.95-.51-4.96-1.53-1.01-1.02,-1.51-2.66-1.51-4.94v-40.1c0-2.13.48-3.73,1.44-4.8.96-1.07,2.22-1.6,3.78-1.6s2.87.53,3.85,1.58c.98,1.05,1.47,2.66,1.47,4.81Z" />
        <path fill="white" d="M284.33,553.88l-2.49-6.54h-21.17l-2.49,6.68c-.97,2.6-1.8,4.36-2.49,5.27-.69.91-1.81,1.37-3.38,1.37-1.33,0-2.5-.49-3.52-1.46s-1.53-2.07-1.53-3.3c0-.71.12-1.44,.36-2.2.24-.76.63-1.81,1.17-3.16l13.32-33.82c.38-.97.83-2.14,1.37-3.5.53-1.36,1.1-2.49,1.71-3.39.6-.9,1.4-1.63,2.38-2.18.98-.56,2.2-.83,3.64-.83s2.69.28,3.68.83c.98.56,1.78,1.27,2.38,2.15.6.88,1.11,1.82,1.53,2.82.41,1.01.94,2.35,1.58,4.03l13.6,33.6c1.07,2.56,1.6,4.42,1.6,5.58s-.5,2.31-1.51,3.32-2.22,1.51-3.64,1.51c-.83,0-1.54-.15-2.13-.44-.59-.3-1.09-.7,-1.49-1.21-.4-.51-.83-1.29-1.3-2.34-.46-1.05-.86-1.98-1.19,-2.79ZM263.45,539.43h15.56l-7.85-21.49-7.71,21.49Z" />
      </g>
    </svg>
  )
}

/* ─── Google G icon ─────────────────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" style={{ display: 'block', flexShrink: 0 }}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

/* ─── Spinner ────────────────────────────────────────────────────────────── */
function Spinner() {
  return (
    <svg
      width="18" height="18" viewBox="0 0 24 24" fill="none"
      style={{ animation: 'spin 0.7s linear infinite', display: 'block', flexShrink: 0 }}
    >
      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

/* ─── Main component ────────────────────────────────────────────────────── */
export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('admin@centresela.ma')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passFocused, setPassFocused] = useState(false)

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true })
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    const result = login(email, password)
    if (result.success) {
      navigate('/dashboard', { replace: true })
    } else {
      setError('Email ou mot de passe incorrect')
      setLoading(false)
    }
  }

  const inputStyle = (focused) => ({
    display: 'block',
    width: '100%',
    height: '52px',
    border: `1.5px solid ${focused ? '#00839f' : '#e2e8f0'}`,
    borderRadius: '10px',
    padding: '0 16px',
    fontSize: '15px',
    color: '#0d1b2a',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxShadow: focused ? '0 0 0 3px rgba(0,131,159,0.1)' : 'none',
    backgroundColor: 'white',
    fontFamily: 'inherit',
  })

  return (
    <>
      {/* Injected keyframes */}
      <style>{KEYFRAMES + `@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

        {/* ══════════════════════════════════════════════
            LEFT PANEL — dark card on gray background
        ══════════════════════════════════════════════ */}
        <div
          className="hidden md:flex"
          style={{
            width: '45%',
            flexShrink: 0,
            backgroundColor: '#F0F0F0',
            padding: '24px',
          }}
        >
          {/* The dark card */}
          <div style={{
            flex: 1,
            borderRadius: '24px',
            overflow: 'hidden',
            position: 'relative',
            background: [
              'radial-gradient(ellipse at 80% 80%, rgba(220,163,90,0.08) 0%, transparent 50%)',
              'radial-gradient(ellipse at 30% 20%, rgba(0,131,159,0.15) 0%, transparent 60%)',
              'linear-gradient(160deg, #0a0a0f 0%, #0d1a1f 25%, #071318 50%, #0a0805 75%, #0d0a02 100%)',
            ].join(', '),
          }}>

            {/* Dot grid pattern */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
              zIndex: 1,
            }} />

            {/* Blob — top center */}
            <div style={{
              position: 'absolute',
              width: '280px',
              height: '260px',
              top: '-40px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg, rgba(0,131,159,0.13), rgba(220,163,90,0.07))',
              border: '1px solid rgba(0,131,159,0.2)',
              animation: 'morph 8s ease-in-out infinite alternate',
              zIndex: 2,
            }} />

            {/* Blob — bottom right */}
            <div style={{
              position: 'absolute',
              width: '160px',
              height: '140px',
              bottom: '120px',
              right: '-20px',
              background: 'linear-gradient(135deg, rgba(220,163,90,0.08), rgba(0,131,159,0.06))',
              animation: 'morphB 6s ease-in-out infinite alternate',
              zIndex: 2,
            }} />

            {/* TOP NAV — logo + portal buttons */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              right: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 10,
            }}>
              <SelaLogoWhite width={60} />
              <div style={{ display: 'flex', gap: '8px' }}>
                {['Portail Apprenants', 'Portail Formateurs'].map(label => (
                  <button
                    key={label}
                    title="Bientôt disponible"
                    style={{
                      border: '1px solid rgba(255,255,255,0.3)',
                      color: 'rgba(255,255,255,0.5)',
                      background: 'transparent',
                      borderRadius: '999px',
                      padding: '6px 14px',
                      fontSize: '12px',
                      cursor: 'not-allowed',
                      fontFamily: 'inherit',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* CENTER WATERMARK */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 3,
              pointerEvents: 'none',
            }}>
              <SelaLogoWhite width={200} opacity={0.15} />
            </div>

            {/* BOTTOM FROSTED GLASS CARD */}
            <div style={{
              position: 'absolute',
              bottom: '24px',
              left: '24px',
              right: '24px',
              background: 'rgba(255,255,255,0.07)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '16px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              zIndex: 10,
            }}>
              {/* Avatar */}
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00839f, #dca35a)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px',
                fontWeight: '700',
                flexShrink: 0,
              }}>
                AD
              </div>

              {/* User info */}
              <div>
                <div style={{ color: 'white', fontSize: '14px', fontWeight: '600', lineHeight: 1.3 }}>
                  Administrateur
                </div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '2px' }}>
                  Centre SELA
                </div>
              </div>

              {/* Arrow buttons */}
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                {['←', '→'].map(arrow => (
                  <button
                    key={arrow}
                    title="Navigation future"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      border: '1px solid rgba(255,255,255,0.2)',
                      background: 'rgba(255,255,255,0.05)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'not-allowed',
                      fontSize: '16px',
                      fontFamily: 'inherit',
                    }}
                  >
                    {arrow}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ══════════════════════════════════════════════
            RIGHT PANEL — white form
        ══════════════════════════════════════════════ */}
        <div style={{
          flex: 1,
          backgroundColor: '#ffffff',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px',
          overflowY: 'auto',
        }}>

          {/* Top row — logo + language pill (absolute) */}
          <div style={{
            position: 'absolute',
            top: '48px',
            left: '48px',
            right: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <img src={logoUrl} alt="SELA" style={{ width: '80px', display: 'block' }} />
            <button style={{
              border: '1px solid #e2e8f0',
              borderRadius: '999px',
              padding: '6px 14px',
              fontSize: '13px',
              color: '#4a5568',
              background: 'white',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}>
              🇲🇦 FR ▾
            </button>
          </div>

          {/* Mobile-only logo centered above form */}
          <div className="md:hidden" style={{
            position: 'absolute',
            top: '32px',
            left: '50%',
            transform: 'translateX(-50%)',
          }}>
            <img src={logoUrl} alt="SELA" style={{ width: '80px', display: 'block' }} />
          </div>

          {/* ── FORM ─────────────────────────────────── */}
          <form
            onSubmit={handleSubmit}
            style={{ width: '100%', maxWidth: '360px' }}
          >

            {/* Heading */}
            <h1 style={{
              fontSize: '38px',
              fontWeight: '800',
              color: '#0D1B2A',
              margin: '0 0 8px 0',
              lineHeight: 1.15,
              fontFamily: 'Plus Jakarta Sans, sans-serif',
            }}>
              Bonjour Admin 👋
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize: '15px',
              color: '#94a3b8',
              margin: '0 0 32px 0',
            }}>
              Connectez-vous au portail SELA
            </p>

            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                placeholder="Adresse email"
                required
                style={inputStyle(emailFocused)}
              />
            </div>

            {/* Password */}
            <div style={{ position: 'relative', marginBottom: '8px' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setPassFocused(true)}
                onBlur={() => setPassFocused(false)}
                placeholder="Mot de passe"
                required
                style={{ ...inputStyle(passFocused), paddingRight: '48px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0,
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Forgot password */}
            <div style={{ textAlign: 'right', marginBottom: '24px' }}>
              <a
                href="#"
                onClick={e => e.preventDefault()}
                style={{
                  color: '#00839f',
                  fontSize: '13px',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => (e.target.style.textDecoration = 'underline')}
                onMouseLeave={e => (e.target.style.textDecoration = 'none')}
              >
                Mot de passe oublié ?
              </a>
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
              <span style={{ color: '#94a3b8', fontSize: '13px' }}>ou</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
            </div>

            {/* Google button */}
            <GoogleButton />

            {/* Login button */}
            <LoginButton loading={loading} />

            {/* Error */}
            {error && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#ef4444',
                fontSize: '13px',
                marginTop: '-12px',
                marginBottom: '12px',
              }}>
                <span>⚠</span>
                {error}
              </div>
            )}

            {/* Signup row */}
            <p style={{ textAlign: 'center', fontSize: '13px', color: '#94a3b8', margin: 0 }}>
              Accès réservé — Contactez l'administrateur
            </p>

          </form>
        </div>

      </div>
    </>
  )
}

/* ─── Sub-components (keep Login lean) ─────────────────────────────────── */

function GoogleButton() {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        height: '52px',
        background: hovered ? '#f8fafc' : 'white',
        border: `1.5px solid ${hovered ? '#cbd5e1' : '#e2e8f0'}`,
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        fontSize: '15px',
        color: '#0d1b2a',
        fontWeight: '500',
        cursor: 'pointer',
        marginBottom: '16px',
        transition: 'all 0.2s',
        fontFamily: 'inherit',
      }}
    >
      <GoogleIcon />
      Continuer avec Google
    </button>
  )
}

function LoginButton({ loading }) {
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)
  return (
    <button
      type="submit"
      disabled={loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setActive(false) }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        width: '100%',
        height: '52px',
        background: loading ? '#00839f99' : hovered ? '#007493' : '#00839f',
        border: 'none',
        borderRadius: '10px',
        color: 'white',
        fontSize: '16px',
        fontWeight: '700',
        cursor: loading ? 'not-allowed' : 'pointer',
        letterSpacing: '0.3px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'all 0.15s',
        transform: active && !loading ? 'scale(0.99)' : 'scale(1)',
        fontFamily: 'inherit',
      }}
    >
      {loading ? <><Spinner /> Connexion en cours…</> : 'Se connecter'}
    </button>
  )
}
