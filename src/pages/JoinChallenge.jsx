import { useState } from 'react'
import { supabase } from '../supabase'

export default function JoinChallenge({ authUser, onJoined, onBack }) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleJoin() {
    if (code.trim().length < 3) { setError('Entre le code du groupe'); return }
    setLoading(true)
    setError('')

    const { data: grp } = await supabase
      .from('groups')
      .select('*')
      .eq('code', code.trim().toUpperCase())
      .single()

    if (!grp) { setError('Code invalide, vérifie et réessaie'); setLoading(false); return }

    const pseudo = authUser.user_metadata?.pseudo
      || authUser.user_metadata?.full_name
      || authUser.email?.split('@')[0]
      || 'Joueur'

    const { data: usr, error: e2 } = await supabase
      .from('users')
      .insert({ pseudo, group_id: grp.id, auth_id: authUser.id })
      .select()
      .single()

    if (!usr) { setError(e2?.message || 'Erreur création profil'); setLoading(false); return }

    onJoined({ ...usr, group: grp })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', display: 'flex', flexDirection: 'column', padding: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '2.5rem' }}>
        <button onClick={onBack} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: '#fff', flexShrink: 0 }}>←</button>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>Rejoindre un défi 👥</h1>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20, maxWidth: 360, margin: '0 auto', width: '100%' }}>
        <div style={{ background: '#1a1a1a', borderRadius: 20, padding: '2rem', textAlign: 'center', border: '1px solid #2a2a2a' }}>
          <p style={{ color: '#555', fontSize: 13, marginBottom: '1.5rem' }}>Entre le code partagé par ton ami</p>
          <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#8B5CF6', fontWeight: 800, fontSize: 20 }}>#</span>
            <input
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && handleJoin()}
              placeholder="ABC123"
              maxLength={6}
              style={{ width: '100%', background: '#222', border: '1px solid #2f2f2f', borderRadius: 14, padding: '16px 16px 16px 44px', fontSize: 28, fontWeight: 800, color: '#fff', outline: 'none', fontFamily: 'monospace', letterSpacing: 6, textTransform: 'uppercase', textAlign: 'center', boxSizing: 'border-box' }}
            />
          </div>
          {error && <p style={{ color: '#8B5CF6', fontSize: 13, background: 'rgba(139,92,246,0.1)', padding: '10px', borderRadius: 10, marginBottom: 12 }}>{error}</p>}
          <button
            onClick={handleJoin}
            disabled={loading}
            style={{ width: '100%', background: '#8B5CF6', color: '#fff', border: 'none', borderRadius: 12, padding: '14px', fontSize: 15, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.3px', opacity: loading ? 0.6 : 1, fontFamily: 'inherit' }}
          >
            {loading ? 'Vérification...' : 'REJOINDRE'}
          </button>
        </div>
      </div>
    </div>
  )
}
