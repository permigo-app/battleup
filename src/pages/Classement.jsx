import { useState, useEffect, useRef } from 'react'
import { useGroup } from '../hooks/useGroup'
import { getChallenge, formatVal } from '../utils/challengeTypes'
import { supabase } from '../supabase'

const MEDALS = ['🥇', '🥈', '🥉']

const FAKE_PARTICIPANTS = [
  { id: 'f1', pseudo: 'Lucas',  total: 1250, today: 0 },
  { id: 'f2', pseudo: 'Thomas', total: 980,  today: 0 },
  { id: 'f3', pseudo: 'Marie',  total: 870,  today: 0 },
  { id: 'f4', pseudo: 'Alex',   total: 760,  today: 0 },
  { id: 'f5', pseudo: 'Julien', total: 650,  today: 0 },
  { id: 'f6', pseudo: 'Sarah',  total: 540,  today: 0 },
  { id: 'f7', pseudo: 'Marc',   total: 430,  today: 0 },
  { id: 'f8', pseudo: 'Emma',   total: 320,  today: 0 },
  { id: 'f9', pseudo: 'Kevin',  total: 210,  today: 0 },
]

const RANK_STYLES = [
  { border: '1px solid rgba(255,215,0,0.45)',   bg: 'rgba(255,215,0,0.05)',  avatarColor: '#FFD700' },
  { border: '1px solid rgba(192,192,192,0.35)', bg: 'rgba(192,192,192,0.04)', avatarColor: '#C0C0C0' },
  { border: '1px solid rgba(205,127,50,0.35)',  bg: 'rgba(205,127,50,0.04)', avatarColor: '#CD7F32' },
]

function timeAgo(dt) {
  const diff = Math.floor((Date.now() - new Date(dt)) / 1000)
  if (diff < 60) return 'À l\'instant'
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)}min`
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)}h`
  return `il y a ${Math.floor(diff / 86400)}j`
}

function ProfileModal({ member, entries, challenge, onClose }) {
  const [photos, setPhotos] = useState([])
  const sheetRef = useRef()

  useEffect(() => {
    supabase.from('photos').select('*').eq('user_id', member.id)
      .order('created_at', { ascending: false }).limit(6)
      .then(({ data, error }) => { if (!error) setPhotos(data || []) })
      .catch(() => {})
  }, [member.id])

  const memberEntries = entries.filter(e => e.user_id === member.id)
  const total = memberEntries.reduce((s, e) => s + e.count, 0)
  const avg = memberEntries.length > 0 ? total / memberEntries.length : 0
  const best = memberEntries.reduce((m, e) => Math.max(m, e.count), 0)
  const bestDay = memberEntries.find(e => e.count === best)

  const today = new Date().toISOString().slice(0, 10)
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i))
    const ds = d.toISOString().slice(0, 10)
    return { date: ds, count: memberEntries.find(e => e.date === ds)?.count || 0, label: d.toLocaleDateString('fr-FR', { weekday: 'narrow' }) }
  })
  const maxBar = Math.max(...last7.map(d => d.count), 1)

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 500, display: 'flex', alignItems: 'flex-end' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div ref={sheetRef} style={{ width: '100%', maxWidth: 430, margin: '0 auto', background: '#111', borderRadius: '20px 20px 0 0', maxHeight: '82vh', overflowY: 'auto', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: 36, height: 4, background: '#333', borderRadius: 2 }} />
        </div>

        <div style={{ padding: '0.75rem 1.25rem 1.5rem' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.25rem' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(232,25,44,0.15)', border: '2px solid #E8192C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, color: '#E8192C', flexShrink: 0 }}>
              {member.pseudo.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>{member.pseudo}</p>
              <p style={{ color: '#555', fontSize: 12, marginTop: 2 }}>{challenge.icon} {challenge.label}</p>
            </div>
            <button onClick={onClose} style={{ marginLeft: 'auto', background: '#222', border: 'none', borderRadius: 8, color: '#888', fontSize: 18, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>×</button>
          </div>

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: '1.25rem' }}>
            {[
              { label: 'Total', val: formatVal(total, challenge.key), icon: '📊' },
              { label: 'Moy/jour', val: formatVal(avg, challenge.key), icon: '📈' },
              { label: 'Record', val: formatVal(best, challenge.key), icon: '🏆' },
            ].map(s => (
              <div key={s.label} style={{ background: '#1a1a1a', borderRadius: 12, padding: '10px 8px', textAlign: 'center', border: '1px solid #222' }}>
                <div style={{ fontSize: 14, marginBottom: 3 }}>{s.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>{s.val}</div>
                <div style={{ fontSize: 9, color: '#555', marginTop: 2, fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
          {bestDay && (
            <p style={{ color: '#555', fontSize: 11, textAlign: 'center', marginTop: -8, marginBottom: '1.25rem' }}>
              Record le {new Date(bestDay.date + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
            </p>
          )}

          {/* Bar chart */}
          <p style={{ color: '#555', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10 }}>7 derniers jours</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 72, background: '#1a1a1a', borderRadius: 12, padding: '10px 12px 6px', border: '1px solid #222' }}>
            {last7.map((d, i) => {
              const barH = maxBar > 0 ? Math.max(3, Math.round((d.count / maxBar) * 46)) : 3
              const isT = d.date === today
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ width: '100%', height: barH, background: isT ? '#E8192C' : d.count > 0 ? '#444' : '#222', borderRadius: '3px 3px 0 0' }} />
                  <span style={{ fontSize: 9, color: isT ? '#E8192C' : '#555' }}>{d.label}</span>
                </div>
              )
            })}
          </div>

          {/* Photos */}
          {photos.length > 0 && (
            <>
              <p style={{ color: '#555', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', margin: '1.25rem 0 10px' }}>Photos</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                {photos.map(p => (
                  <img key={p.id} src={p.url} alt="" loading="lazy" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 10, border: '1px solid #222' }} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Classement({ user }) {
  if (!user) return null
  const { getRanking, group, entries } = useGroup(user.group_id)
  const [selected, setSelected] = useState(null)

  const realRanking = getRanking()
  const ranking = [...realRanking, ...FAKE_PARTICIPANTS].sort((a, b) => b.total - a.total)
  const challenge = getChallenge(group?.challenge_type || user.group?.challenge_type)

  return (
    <div style={{ padding: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>Classement</h2>
          {group?.name && <p style={{ color: '#555', fontSize: 12, marginTop: 2 }}>{group.name} · {challenge.icon} {challenge.label}</p>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 5px #22c55e' }} />
          <span style={{ color: '#22c55e', fontSize: 11, fontWeight: 600 }}>Temps réel</span>
        </div>
      </div>

      {/* Ranking list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {ranking.map((m, i) => {
          const isTop3 = i < 3
          const isMe = m.id === user.id
          const rs = isTop3 ? RANK_STYLES[i] : null
          const border = isMe ? '1.5px solid #E8192C' : rs?.border || '1px solid #222'
          const bg = isMe && !isTop3 ? 'rgba(232,25,44,0.07)' : rs?.bg || '#1a1a1a'
          const avatarColor = isTop3 ? rs.avatarColor : isMe ? '#E8192C' : '#444'

          return (
            <div
              key={m.id}
              onClick={() => setSelected(m)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, border, background: bg, cursor: 'pointer' }}
            >
              <div style={{ width: 28, textAlign: 'center', flexShrink: 0 }}>
                {isTop3
                  ? <span style={{ fontSize: 18, lineHeight: 1 }}>{MEDALS[i]}</span>
                  : <span style={{ color: '#555', fontSize: 13, fontWeight: 700 }}>{i + 1}</span>
                }
              </div>
              <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: avatarColor + '22', border: `1.5px solid ${avatarColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: avatarColor }}>
                {m.pseudo.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: '#fff', fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {m.pseudo}
                  {isMe && <span style={{ color: '#E8192C', fontSize: 10, fontWeight: 700, marginLeft: 5 }}>toi</span>}
                </p>
                {m.today > 0 && <p style={{ color: '#555', fontSize: 10, marginTop: 1 }}>+{formatVal(m.today, challenge.key)} {challenge.unit} aujourd'hui</p>}
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ color: isTop3 ? RANK_STYLES[i].avatarColor : '#fff', fontWeight: 800, fontSize: 15 }}>{formatVal(m.total, challenge.key)}</p>
                <p style={{ color: '#444', fontSize: 10 }}>{challenge.unit}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Profile modal */}
      {selected && (
        <ProfileModal
          member={selected}
          entries={entries}
          challenge={challenge}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
