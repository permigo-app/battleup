import { getChallenge, getRules } from '../utils/challengeTypes'

export default function Technique({ user }) {
  const challengeKey = user?.group?.challenge_type ?? 'pompes'
  const challenge = getChallenge(challengeKey)
  const rules = getRules(challengeKey)

  return (
    <div style={{ padding: '1.25rem' }}>
      {/* Title */}
      <h2 style={{ fontSize: 22, fontWeight: 800, color: '#E8192C', letterSpacing: '-0.3px', marginBottom: 4 }}>
        Règles
      </h2>
      <p style={{ color: '#555', fontSize: 13, marginBottom: '1.5rem' }}>
        {challenge.icon} {challenge.label}
      </p>

      {/* Rules */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '1.25rem' }}>
        {rules.map((rule, i) => (
          <div
            key={i}
            style={{ background: '#1a1a1a', border: '1px solid #222', borderRadius: 14, padding: '14px 16px', display: 'flex', gap: 14, alignItems: 'flex-start' }}
          >
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(232,25,44,0.15)', border: '1px solid rgba(232,25,44,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 800, color: '#E8192C', marginTop: 1 }}>
              {i + 1}
            </div>
            <p style={{ color: '#ccc', fontSize: 14, lineHeight: 1.55 }}>{rule}</p>
          </div>
        ))}
      </div>

      {/* Fair-play card */}
      <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 14, padding: '14px 16px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 22, flexShrink: 0 }}>🤝</span>
        <div>
          <p style={{ color: '#fff', fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Fair-play</p>
          <p style={{ color: '#666', fontSize: 13, lineHeight: 1.55 }}>
            Ce défi est basé sur l'honnêteté de chaque participant. Joue le jeu !
          </p>
        </div>
      </div>
    </div>
  )
}
