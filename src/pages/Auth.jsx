import { useState } from 'react'
import { supabase } from '../supabase'
import LogoIcon from '../components/LogoIcon'

const inputStyle = {
  width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a',
  borderRadius: 12, padding: '13px 16px 13px 44px', fontSize: 15,
  color: '#fff', outline: 'none', fontFamily: 'inherit',
}

function Icon({ children, style }) {
  return (
    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 17, pointerEvents: 'none', ...style }}>
      {children}
    </span>
  )
}

export default function Auth({ defaultMode = 'login' }) {
  const [mode, setMode] = useState(defaultMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pseudo, setPseudo] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading('email')

    if (mode === 'register') {
      const { error: e } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { pseudo: pseudo.trim() || email.split('@')[0] } },
      })
      if (e) { setError(e.message); setLoading(null); return }
      setInfo('Compte créé ! Vérifie ta boîte mail pour confirmer.')
      setLoading(null)
    } else {
      const { error: e } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (e) { setError('Email ou mot de passe incorrect.'); setLoading(null); return }
      // onAuthStateChange in App.jsx handles the rest
    }
  }

  async function handleGoogle() {
    setLoading('google')
    const { error: e } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (e) { setError(e.message); setLoading(null) }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <LogoIcon size={80} style={{ margin: '0 auto 1rem', boxShadow: '0 0 40px rgba(139,92,246,0.35)', borderRadius: 22 }} />
        <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>LevelUP</h1>
        <p style={{ color: '#555', fontSize: 13, marginTop: 4 }}>Qui lâche en premier ?</p>
      </div>

      {/* Toggle */}
      <div style={{ display: 'flex', background: '#1a1a1a', borderRadius: 12, padding: 4, marginBottom: '1.5rem', width: '100%', maxWidth: 360 }}>
        {['login', 'register'].map(m => (
          <button key={m} onClick={() => { setMode(m); setError(''); setInfo('') }}
            style={{ flex: 1, padding: '9px', borderRadius: 9, border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s', background: mode === m ? '#8B5CF6' : 'transparent', color: mode === m ? '#fff' : '#555' }}>
            {m === 'login' ? 'Connexion' : 'Inscription'}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {mode === 'register' && (
          <div style={{ position: 'relative' }}>
            <Icon>👤</Icon>
            <input value={pseudo} onChange={e => setPseudo(e.target.value)} placeholder="Ton pseudo" maxLength={20} style={inputStyle} />
          </div>
        )}
        <div style={{ position: 'relative' }}>
          <Icon>✉️</Icon>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required style={inputStyle} />
        </div>
        <div style={{ position: 'relative' }}>
          <Icon>🔒</Icon>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" required minLength={6} style={inputStyle} />
        </div>

        {error && <p style={{ color: '#8B5CF6', fontSize: 13, background: 'rgba(139,92,246,0.1)', padding: '10px 12px', borderRadius: 10 }}>{error}</p>}
        {info && <p style={{ color: '#22c55e', fontSize: 13, background: 'rgba(34,197,94,0.1)', padding: '10px 12px', borderRadius: 10 }}>{info}</p>}

        <button type="submit" disabled={!!loading} style={{ background: '#8B5CF6', color: '#fff', border: 'none', borderRadius: 12, padding: '14px', fontSize: 15, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.3px', opacity: loading ? 0.6 : 1, fontFamily: 'inherit', marginTop: 4 }}>
          {loading === 'email' ? '...' : mode === 'login' ? 'SE CONNECTER' : 'CRÉER UN COMPTE'}
        </button>
      </form>

      {/* Separator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', maxWidth: 360, margin: '1.25rem 0' }}>
        <div style={{ flex: 1, height: 1, background: '#2a2a2a' }} />
        <span style={{ color: '#444', fontSize: 13, fontWeight: 600 }}>OU</span>
        <div style={{ flex: 1, height: 1, background: '#2a2a2a' }} />
      </div>

      {/* Google */}
      <button onClick={handleGoogle} disabled={!!loading} style={{ width: '100%', maxWidth: 360, background: '#fff', color: '#222', border: 'none', borderRadius: 12, padding: '13px', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: loading === 'google' ? 0.6 : 1, fontFamily: 'inherit' }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z" fill="#4285F4"/>
          <path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z" fill="#34A853"/>
          <path d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z" fill="#FBBC05"/>
          <path d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z" fill="#EA4335"/>
        </svg>
        {loading === 'google' ? 'Redirection...' : 'Continuer avec Google'}
      </button>
    </div>
  )
}
