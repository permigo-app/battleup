import { useState } from 'react'
import { supabase } from '../supabase'
import { generateCode } from '../utils/generateCode'
import { CHALLENGE_TYPES } from '../utils/challengeTypes'
import SuggestChallenge from '../components/SuggestChallenge'


export default function CreateChallenge({ authUser, onJoined, onBack }) {
  const [groupName, setGroupName] = useState('')
  const [duration, setDuration] = useState(30)
  const [durationInput, setDurationInput] = useState('30')
  const [challengeType, setChallengeType] = useState('pompes')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCreate() {
    if (!groupName.trim()) { setError('Entre un nom de défi'); return }
    setLoading(true)
    setError('')

    const code = generateCode()
    const endsAt = new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString()

    const { data: grp, error: e1 } = await supabase
      .from('groups')
      .insert({ code, name: groupName.trim(), ends_at: endsAt, challenge_type: challengeType, duration_days: duration })
      .select()
      .single()

    if (e1) { setError('Erreur création défi: ' + e1.message); setLoading(false); return }

    const pseudo = authUser.user_metadata?.pseudo
      || authUser.user_metadata?.full_name
      || authUser.email?.split('@')[0]
      || 'Joueur'

    const { data: usr, error: e2 } = await supabase
      .from('users')
      .insert({ pseudo, group_id: grp.id, auth_id: authUser.id })
      .select()
      .single()

    if (e2) { setError('Erreur création profil: ' + e2.message); setLoading(false); return }

    onJoined({ ...usr, group: grp })  // App.jsx redirects to MesDefis
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', display: 'flex', flexDirection: 'column', padding: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
        <button onClick={onBack} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: '#fff', flexShrink: 0 }}>←</button>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>Nouveau défi 🏆</h1>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24, overflowY: 'auto', paddingBottom: '1rem' }}>
        {/* Group name */}
        <div>
          <label style={{ color: '#888', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: 8 }}>Nom du défi</label>
          <input
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
            placeholder="ex: Les Warriors du Bureau"
            maxLength={40}
            style={{ width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 12, padding: '13px 16px', fontSize: 15, color: '#fff', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
          />
        </div>

        {/* Duration */}
        <div>
          <label style={{ color: '#888', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: 12 }}>Durée du défi</label>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1a1a1a', borderRadius: 16, border: '1px solid #2a2a2a', padding: '12px 16px' }}>
            <button
              onClick={() => { setDuration(d => d - 1); setDurationInput(v => String(parseInt(v || 30) - 1)) }}
              style={{ width: 44, height: 44, borderRadius: '50%', background: '#8B5CF6', border: 'none', color: '#fff', fontSize: 24, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, lineHeight: 1 }}
            >−</button>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <input
                type="number"
                value={durationInput}
                onChange={e => {
                  const raw = e.target.value.replace(/[^0-9]/g, '')
                  setDurationInput(raw)
                  if (raw !== '') setDuration(parseInt(raw))
                }}
                onFocus={e => e.target.select()}
                onBlur={() => {
                  if (durationInput === '' || parseInt(durationInput) === 0) {
                    setDuration(30)
                    setDurationInput('30')
                  }
                }}
                style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: 56, fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: '-2px', textAlign: 'center', fontFamily: 'inherit' }}
              />
              <p style={{ color: '#555', fontSize: 13, fontWeight: 500, marginTop: 2 }}>jours</p>
            </div>
            <button
              onClick={() => { setDuration(d => d + 1); setDurationInput(v => String(parseInt(v || 30) + 1)) }}
              style={{ width: 44, height: 44, borderRadius: '50%', background: '#8B5CF6', border: 'none', color: '#fff', fontSize: 24, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, lineHeight: 1 }}
            >+</button>
          </div>
        </div>

        {/* Challenge type */}
        <div>
          <label style={{ color: '#888', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: 8 }}>Type de challenge</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {CHALLENGE_TYPES.map(t => (
              <button
                key={t.key}
                onClick={() => setChallengeType(t.key)}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 14, border: challengeType === t.key ? '1.5px solid #8B5CF6' : '1px solid #2a2a2a', background: challengeType === t.key ? 'rgba(139,92,246,0.1)' : '#1a1a1a', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}
              >
                <span style={{ fontSize: 26, flexShrink: 0 }}>{t.icon}</span>
                <div>
                  <p style={{ color: challengeType === t.key ? '#fff' : '#888', fontWeight: 600, fontSize: 14 }}>{t.label}</p>
                  <p style={{ color: '#555', fontSize: 11, marginTop: 1 }}>en {t.unit}</p>
                </div>
                {challengeType === t.key && (
                  <span style={{ marginLeft: 'auto', color: '#8B5CF6', fontSize: 18 }}>✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {error && <p style={{ color: '#8B5CF6', fontSize: 13, background: 'rgba(139,92,246,0.1)', padding: '10px 12px', borderRadius: 10 }}>{error}</p>}

        <button
          onClick={handleCreate}
          disabled={loading}
          style={{ width: '100%', background: '#8B5CF6', color: '#fff', border: 'none', borderRadius: 14, padding: '15px', fontSize: 15, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.3px', opacity: loading ? 0.6 : 1, fontFamily: 'inherit' }}
        >
          {loading ? 'Création...' : 'CRÉER LE DÉFI'}
        </button>

        <SuggestChallenge userId={null} />
      </div>
    </div>
  )
}
