import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { getChallenge } from '../utils/challengeTypes'
import SuggestChallenge from '../components/SuggestChallenge'
import LogoIcon from '../components/LogoIcon'

function daysLeft(group) {
  if (!group) return null
  const end = group.ends_at
    ? new Date(group.ends_at)
    : new Date(new Date(group.created_at).getTime() + (group.duration_days || 30) * 86400000)
  return Math.max(0, Math.ceil((end - Date.now()) / 86400000))
}

export default function MesDefis({ authUser, onEnter, onCreate, logout }) {
  const [defis, setDefis] = useState([])
  const [loading, setLoading] = useState(true)
  const [showJoin, setShowJoin] = useState(false)
  const [joinCode, setJoinCode] = useState('')
  const [joinLoading, setJoinLoading] = useState(false)
  const [joinError, setJoinError] = useState('')

  const pseudo = authUser?.user_metadata?.pseudo
    || authUser?.user_metadata?.full_name
    || authUser?.email?.split('@')[0]
    || 'Joueur'

  useEffect(() => { loadDefis() }, [authUser.id])

  async function loadDefis() {
    setLoading(true)
    const { data } = await supabase
      .from('users')
      .select('*, group:groups(*)')
      .eq('auth_id', authUser.id)
      .order('created_at', { ascending: false })
    setDefis(data || [])
    setLoading(false)
  }

  async function handleJoin() {
    if (!joinCode.trim()) return
    setJoinLoading(true)
    setJoinError('')

    const { data: grp } = await supabase
      .from('groups')
      .select('*')
      .eq('code', joinCode.trim().toUpperCase())
      .single()

    if (!grp) { setJoinError('Code invalide, vérifie et réessaie.'); setJoinLoading(false); return }

    if (defis.some(d => d.group_id === grp.id)) {
      setJoinError('Tu participes déjà à ce défi.')
      setJoinLoading(false)
      return
    }

    const { data: usr, error: e } = await supabase
      .from('users')
      .insert({ pseudo, group_id: grp.id, auth_id: authUser.id })
      .select()
      .single()

    if (!usr) { setJoinError(e?.message || 'Erreur'); setJoinLoading(false); return }

    setJoinCode('')
    setShowJoin(false)
    loadDefis()
    setJoinLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', display: 'flex', flexDirection: 'column', padding: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <LogoIcon size={28} />
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>LevelUP</span>
        </div>
        <button onClick={logout} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: 8, color: '#555', fontSize: 12, padding: '5px 12px', cursor: 'pointer', fontFamily: 'inherit' }}>
          Déconnexion
        </button>
      </div>

      {/* Title */}
      <h1 style={{ fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: '-0.4px', marginBottom: 4 }}>Mes défis</h1>
      <p style={{ color: '#555', fontSize: 13, marginBottom: '1.5rem' }}>
        Bonjour {pseudo} 👋 — rejoins ou crée un défi.
      </p>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 10, marginBottom: '1.5rem' }}>
        <button
          onClick={onCreate}
          style={{ flex: 1, background: '#8B5CF6', color: '#fff', border: 'none', borderRadius: 14, padding: '16px 10px', fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.3px', boxShadow: '0 4px 20px rgba(139,92,246,0.35)' }}
        >
          ➕ Créer un défi
        </button>
        <button
          onClick={() => { setShowJoin(v => !v); setJoinError('') }}
          style={{ flex: 1, background: 'transparent', color: showJoin ? '#8B5CF6' : '#fff', border: `1.5px solid ${showJoin ? '#8B5CF6' : '#333'}`, borderRadius: 14, padding: '16px 10px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          🔗 Rejoindre
        </button>
      </div>

      {/* Inline join */}
      {showJoin && (
        <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 14, padding: '1rem', marginBottom: '1rem' }}>
          <p style={{ color: '#888', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10 }}>Code du défi</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={joinCode}
              onChange={e => setJoinCode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && handleJoin()}
              placeholder="ABC123"
              maxLength={6}
              autoFocus
              style={{ flex: 1, minWidth: 0, background: '#222', border: '1px solid #2f2f2f', borderRadius: 10, padding: '11px 14px', fontSize: 20, fontWeight: 800, color: '#fff', outline: 'none', fontFamily: 'monospace', letterSpacing: 4, textTransform: 'uppercase', textAlign: 'center' }}
            />
            <button
              onClick={handleJoin}
              disabled={joinLoading}
              style={{ background: '#8B5CF6', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 16px', fontSize: 14, fontWeight: 700, cursor: 'pointer', flexShrink: 0, opacity: joinLoading ? 0.6 : 1, fontFamily: 'inherit' }}
            >
              {joinLoading ? '...' : 'OK'}
            </button>
          </div>
          {joinError && <p style={{ color: '#8B5CF6', fontSize: 12, marginTop: 8 }}>{joinError}</p>}
        </div>
      )}

      {/* Défis list */}
      <div style={{ flex: 1 }}>
        {loading ? (
          <p style={{ color: '#444', fontSize: 14, textAlign: 'center', paddingTop: '2rem' }}>Chargement...</p>
        ) : defis.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: '1.5rem' }}>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: '#fff', letterSpacing: '-0.3px', marginBottom: 10, lineHeight: 1.3 }}>
              Personne ne t'attend.<br />Lance le premier défi.
            </h2>
            <p style={{ color: '#555', fontSize: 14, lineHeight: 1.6 }}>
              Invite tes amis.<br />
              <span style={{ color: '#8B5CF6', fontWeight: 600 }}>Qui lâche en premier ?</span>
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ color: '#555', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 2 }}>
              {defis.length} défi{defis.length > 1 ? 's' : ''} actif{defis.length > 1 ? 's' : ''}
            </p>
            {defis.map(defi => {
              const group = defi.group
              if (!group) return null
              const challenge = getChallenge(group.challenge_type)
              const left = daysLeft(group)
              const ended = left === 0

              return (
                <div
                  key={defi.id}
                  style={{ background: '#1a1a1a', border: '1px solid #222', borderRadius: 16, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: 12 }}
                >
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: ended ? '#222' : 'rgba(139,92,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0, border: ended ? '1px solid #2a2a2a' : '1px solid rgba(139,92,246,0.2)' }}>
                    {challenge.icon}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: ended ? '#555' : '#fff', fontWeight: 700, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {group.name}
                    </p>
                    <p style={{ color: '#555', fontSize: 11, marginTop: 2 }}>
                      {challenge.label}
                      {left !== null && (
                        <span style={{ marginLeft: 8, color: ended ? '#444' : left <= 3 ? '#8B5CF6' : '#666' }}>
                          · {ended ? 'Terminé' : `${left}j restants`}
                        </span>
                      )}
                    </p>
                  </div>

                  <button
                    onClick={() => onEnter(defi)}
                    style={{ background: ended ? '#1f1f1f' : '#8B5CF6', color: ended ? '#555' : '#fff', border: ended ? '1px solid #2a2a2a' : 'none', borderRadius: 10, padding: '9px 14px', fontSize: 13, fontWeight: 700, cursor: ended ? 'default' : 'pointer', flexShrink: 0, fontFamily: 'inherit' }}
                  >
                    {ended ? 'Voir' : 'Entrer →'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <SuggestChallenge userId={defis[0]?.id} />
    </div>
  )
}
