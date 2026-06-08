import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { useGroup } from '../hooks/useGroup'
import { getChallenge, formatVal } from '../utils/challengeTypes'

function calcStreak(entries) {
  const dateSet = new Set(entries.filter(e => e.count > 0).map(e => e.date))
  let streak = 0
  const d = new Date()
  while (true) {
    const ds = d.toISOString().slice(0, 10)
    if (dateSet.has(ds)) { streak++; d.setDate(d.getDate() - 1) } else break
  }
  return streak
}

export default function Home({ user }) {
  if (!user) return null
  const { getUserEntries, refetch } = useGroup(user.group_id)
  const [todayCount, setTodayCount] = useState(0)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editVal, setEditVal] = useState('')
  const [msg, setMsg] = useState('')
  const today = new Date().toISOString().slice(0, 10)

  const challenge = getChallenge(user.group?.challenge_type)
  const myEntries = getUserEntries(user.id)
  const total = myEntries.reduce((s, e) => s + e.count, 0)
  const maxCount = Math.max(...myEntries.map(e => e.count), 1)
  const todayEntry = myEntries.find(e => e.date === today)
  const streak = calcStreak(myEntries)

  const dayStart = new Date(user.group?.created_at || Date.now())
  const dayNum = Math.max(1, Math.floor((Date.now() - dayStart.getTime()) / 86400000) + 1)
  const duration = user.group?.duration_days || 30
  const avg = dayNum > 0 ? (total / Math.min(dayNum, duration)) : 0

  useEffect(() => {
    if (todayEntry) setTodayCount(todayEntry.count)
  }, [myEntries.length])

  function parseInput(val) {
    return challenge.isDecimal ? parseFloat(val) : parseInt(val)
  }

  async function handleAdd() {
    const val = parseInput(input)
    if (!val || val <= 0) return
    setLoading(true)
    const newCount = todayCount + val
    if (todayEntry) {
      await supabase.from('entries').update({ count: newCount }).eq('id', todayEntry.id)
    } else {
      await supabase.from('entries').insert({ user_id: user.id, date: today, count: newCount })
    }
    setTodayCount(newCount)
    setInput('')
    setMsg(`+${formatVal(val, challenge.key)} ${challenge.unit} ajoutés ! ${challenge.icon}`)
    setTimeout(() => setMsg(''), 2500)
    refetch()
    setLoading(false)
  }

  async function handleEdit() {
    const val = parseInput(editVal)
    if (isNaN(val) || val < 0) return
    setLoading(true)
    if (todayEntry) {
      await supabase.from('entries').update({ count: val }).eq('id', todayEntry.id)
    } else {
      await supabase.from('entries').insert({ user_id: user.id, date: today, count: val })
    }
    setTodayCount(val)
    setEditing(false)
    setEditVal('')
    refetch()
    setLoading(false)
  }

  return (
    <div style={{ padding: '1.25rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>
          Bonjour {user.pseudo} 👋
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
          <span style={{ fontSize: 16 }}>🔥</span>
          <span style={{ color: streak > 0 ? '#8B5CF6' : '#555', fontSize: 13, fontWeight: 600 }}>
            {streak > 0 ? `${streak} jour${streak > 1 ? 's' : ''} de série` : 'Commence ta série aujourd\'hui !'}
          </span>
          <span style={{ marginLeft: 'auto', fontSize: 11, color: '#555', fontWeight: 600 }}>
            {challenge.icon} {challenge.label}
          </span>
        </div>
      </div>

      {/* Big today card */}
      <div style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #5B21B6 100%)', borderRadius: 20, padding: '1.5rem', marginBottom: '0.875rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 4 }}>
          Aujourd'hui — Jour {Math.min(dayNum, duration)}/{duration}
        </p>
        {editing ? (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="number"
              value={editVal}
              onChange={e => setEditVal(e.target.value)}
              autoFocus
              placeholder={String(todayCount)}
              step={challenge.step}
              style={{ flex: 1, background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 10, padding: '8px 12px', fontSize: 30, fontWeight: 800, color: '#fff', outline: 'none', fontFamily: 'inherit', minWidth: 0 }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button onClick={handleEdit} style={{ background: '#fff', color: '#8B5CF6', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>OK</button>
              <button onClick={() => setEditing(false)} style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>✕</button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: 68, fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: '-2px' }}>
                {formatVal(todayCount, challenge.key)}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, fontWeight: 500, marginLeft: 6 }}>{challenge.unit}</span>
            </div>
            <button
              onClick={() => { setEditing(true); setEditVal(String(todayCount)) }}
              style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', borderRadius: 10, padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', alignSelf: 'center' }}
            >
              Modifier
            </button>
          </div>
        )}
      </div>

      {/* Add card */}
      <div style={{ background: '#1a1a1a', borderRadius: 20, padding: '1.25rem', marginBottom: '0.875rem', border: '1px solid #222' }}>
        <div style={{ display: 'flex', gap: 10, width: '100%' }}>
          <input
            type="number"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="0"
            min="0"
            step={challenge.step}
            style={{ flex: 1, minWidth: 0, background: '#222', border: '1px solid #2f2f2f', borderRadius: 12, padding: '12px 14px', fontSize: 24, fontWeight: 700, color: '#fff', outline: 'none', textAlign: 'center', fontFamily: 'inherit' }}
          />
          <button
            onClick={handleAdd}
            disabled={loading || !input}
            style={{ background: '#8B5CF6', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 16px', fontSize: 14, fontWeight: 700, cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap', opacity: loading || !input ? 0.5 : 1, fontFamily: 'inherit' }}
          >
            AJOUTER
          </button>
        </div>
        {msg && <p style={{ color: '#8B5CF6', fontSize: 13, marginTop: 10, fontWeight: 500 }}>{msg}</p>}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: '1.25rem' }}>
        {[
          { label: "Aujourd'hui", val: formatVal(todayCount, challenge.key), icon: '⚡' },
          { label: 'Total', val: formatVal(total, challenge.key), icon: '📊' },
          { label: 'Moy/jour', val: formatVal(avg, challenge.key), icon: '📈' },
        ].map(s => (
          <div key={s.label} style={{ background: '#1a1a1a', borderRadius: 14, padding: '0.875rem 0.75rem', textAlign: 'center', border: '1px solid #222' }}>
            <div style={{ fontSize: 16, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: s.label === "Aujourd'hui" ? '#8B5CF6' : '#fff' }}>{s.val}</div>
            <div style={{ fontSize: 10, color: '#555', marginTop: 2, fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* History */}
      {myEntries.length > 0 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <p style={{ fontSize: 11, color: '#555', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Historique
            </p>
            <span style={{ fontSize: 11, color: '#444' }}>{myEntries.length} jour{myEntries.length > 1 ? 's' : ''}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[...myEntries].sort((a, b) => b.date.localeCompare(a.date)).map(e => {
              const pct = Math.round((e.count / maxCount) * 100)
              const isToday = e.date === today
              return (
                <div key={e.id} style={{ background: '#1a1a1a', border: isToday ? '1px solid rgba(139,92,246,0.3)' : '1px solid #222', borderRadius: 12, padding: '10px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ color: isToday ? '#8B5CF6' : '#888', fontSize: 12, fontWeight: isToday ? 700 : 400 }}>
                      {isToday ? "Aujourd'hui" : new Date(e.date + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </span>
                    <span style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>
                      {formatVal(e.count, challenge.key)}{' '}
                      <span style={{ color: '#555', fontWeight: 400, fontSize: 11 }}>{challenge.unit}</span>
                    </span>
                  </div>
                  <div style={{ height: 3, background: '#222', borderRadius: 2 }}>
                    <div style={{ height: 3, background: isToday ? '#8B5CF6' : '#3a3a3a', borderRadius: 2, width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
