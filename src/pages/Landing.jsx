import LogoIcon from '../components/LogoIcon'

const RACERS = [
  { name: 'Lucas',   initials: 'LU', color: '#FFD700', pct: 89, emoji: '🥇', delay: 200 },
  { name: 'Camille', initials: 'CA', color: '#8B5CF6', pct: 64, emoji: '🥈', delay: 420 },
  { name: 'Toi ?',   initials: '?',  color: '#555',    pct: 41, emoji: '🥉', delay: 640 },
]

const FEATURES = [
  { icon: '🏆', text: 'Crée ton défi en 30 secondes' },
  { icon: '👥', text: 'Invite tes amis par lien' },
  { icon: '📊', text: 'Classement en temps réel' },
]

export default function Landing({ onStart, onLogin }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', display: 'flex', flexDirection: 'column', maxWidth: 430, margin: '0 auto', padding: '0 0 env(safe-area-inset-bottom)' }}>
      <style>{`
        @keyframes barGrow {
          from { width: 0% }
          to   { width: var(--pct) }
        }
        .battle-bar {
          width: 0%;
          height: 100%;
          border-radius: 4px;
          animation: barGrow 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          animation-delay: var(--delay);
        }
      `}</style>

      {/* Logo */}
      <div style={{ padding: '2.5rem 1.5rem 0', display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <LogoIcon size={38} style={{ boxShadow: '0 0 24px rgba(139,92,246,0.45)', borderRadius: 11 }} />
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 22, letterSpacing: '-0.5px' }}>LevelUP</span>
        </div>
      </div>

      {/* Illustration — live leaderboard */}
      <div style={{ padding: '2rem 1.5rem 0' }}>
        <div style={{ background: '#1a1a1a', borderRadius: 20, padding: '1.25rem', border: '1px solid #252525' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '1.1rem' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
            <span style={{ color: '#22c55e', fontSize: 11, fontWeight: 600, letterSpacing: '0.3px' }}>LIVE · Classement</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            {RACERS.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 17, width: 22, textAlign: 'center', flexShrink: 0 }}>{r.emoji}</span>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: r.color + '1a', border: `1.5px solid ${r.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: r.color, flexShrink: 0 }}>
                  {r.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ color: r.name === 'Toi ?' ? '#555' : '#fff', fontSize: 12, fontWeight: 600 }}>{r.name}</span>
                    <span style={{ color: r.color, fontSize: 11, fontWeight: 700 }}>{r.pct}%</span>
                  </div>
                  <div style={{ height: 6, background: '#2a2a2a', borderRadius: 4, overflow: 'hidden' }}>
                    <div
                      className="battle-bar"
                      style={{ '--pct': r.pct + '%', '--delay': r.delay + 'ms', background: r.color }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Title */}
      <div style={{ padding: '2rem 1.5rem 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: '#fff', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: 12 }}>
          Qui lâche<br />en premier ?
        </h1>
        <p style={{ color: '#666', fontSize: 15, lineHeight: 1.55 }}>
          Lance un défi. Invite tes amis. Gagne.
        </p>
      </div>

      {/* Feature bullets */}
      <div style={{ padding: '1.75rem 1.75rem 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {FEATURES.map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 20, width: 28, textAlign: 'center', flexShrink: 0 }}>{f.icon}</span>
            <span style={{ color: '#bbb', fontSize: 14, fontWeight: 500 }}>{f.text}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ padding: '2rem 1.5rem 3rem', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button
          onClick={onStart}
          style={{ width: '100%', background: '#8B5CF6', color: '#fff', border: 'none', borderRadius: 14, padding: '16px', fontSize: 16, fontWeight: 800, cursor: 'pointer', letterSpacing: '0.5px', boxShadow: '0 4px 24px rgba(139,92,246,0.4)', fontFamily: 'inherit' }}
        >
          COMMENCER
        </button>
        <button
          onClick={onLogin}
          style={{ width: '100%', background: 'none', border: 'none', color: '#555', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', padding: '6px' }}
        >
          Se connecter →
        </button>
      </div>
    </div>
  )
}
