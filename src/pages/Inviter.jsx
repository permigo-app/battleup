import { useState } from 'react'
import { useGroup } from '../hooks/useGroup'

const steps = [
  'Copie le code ou le lien ci-dessus',
  'Envoie-le à tes amis via WhatsApp, SMS…',
  "Ils entrent le code à l'inscription",
  'Le classement se met à jour en temps réel 🏆',
]

export default function Inviter({ user }) {
  if (!user) return null
  const { group } = useGroup(user.group_id)
  const code = group?.code || '------'
  const link = `${window.location.origin}?code=${code}`
  const [copied, setCopied] = useState(null) // 'code' | 'link'

  function copy(text, type) {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div style={{ padding: '1.25rem' }}>
      {/* Header */}
      <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.3px', marginBottom: '1.5rem' }}>
        Invite tes amis 👥
      </h2>

      {/* Code card */}
      <div style={{ background: '#fff', borderRadius: 20, padding: '1.5rem', marginBottom: '1rem', textAlign: 'center' }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>Code du groupe</p>
        <p style={{ fontSize: 48, fontWeight: 900, color: '#0f0f0f', letterSpacing: 8, fontFamily: 'monospace', marginBottom: 12 }}>
          {code}
        </p>
        {group?.name && (
          <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>{group.name}</p>
        )}
        <button
          onClick={() => copy(code, 'code')}
          style={{ background: '#f5f5f5', color: '#333', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          {copied === 'code' ? '✓ Copié !' : '📋 Copier le code'}
        </button>
      </div>

      {/* Copy link button */}
      <button
        onClick={() => copy(link, 'link')}
        style={{ width: '100%', background: copied === 'link' ? '#22c55e' : '#E8192C', color: '#fff', border: 'none', borderRadius: 14, padding: '15px', fontSize: 15, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.3px', marginBottom: '1.5rem', transition: 'background 0.2s', fontFamily: 'inherit' }}
      >
        {copied === 'link' ? '✓ LIEN COPIÉ !' : '🔗 COPIER LE LIEN'}
      </button>

      {/* How it works */}
      <div style={{ background: '#1a1a1a', borderRadius: 20, padding: '1.25rem', border: '1px solid #222' }}>
        <p style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: '1rem' }}>Comment ça marche ?</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ background: '#E8192C', color: '#fff', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0 }}>
                {i + 1}
              </div>
              <p style={{ fontSize: 13, color: '#888', lineHeight: 1.5, paddingTop: 2 }}>{s}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
