import { useState } from 'react'
import { supabase } from '../supabase'

const CATEGORIES = ['Sport', 'Étude', 'Discipline', 'Autre']

const inputStyle = {
  width: '100%', background: '#222', border: '1px solid #2f2f2f',
  borderRadius: 10, padding: '11px 14px', fontSize: 14, color: '#fff',
  outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
}

function Modal({ userId, onClose }) {
  const [nom, setNom] = useState('')
  const [unite, setUnite] = useState('')
  const [description, setDescription] = useState('')
  const [categorie, setCategorie] = useState('Sport')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!nom.trim() || !unite.trim()) { setError('Remplis au moins le nom et l\'unité.'); return }
    setLoading(true); setError('')

    const { error: e1 } = await supabase.from('suggestions').insert({
      user_id: userId || null,
      nom: nom.trim(),
      unite: unite.trim(),
      description: [categorie, description.trim()].filter(Boolean).join(' · ') || null,
    })

    if (e1) { setError('Erreur lors de l\'envoi.'); setLoading(false); return }
    setSuccess(true); setLoading(false)
  }

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 600, display: 'flex', alignItems: 'flex-end', padding: '0' }}
    >
      <div style={{ width: '100%', maxWidth: 430, margin: '0 auto', background: '#111', borderRadius: '20px 20px 0 0', maxHeight: '88vh', overflowY: 'auto' }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
          <div style={{ width: 36, height: 4, background: '#333', borderRadius: 2 }} />
        </div>

        <div style={{ padding: '1rem 1.25rem 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <p style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>💡 Propose un défi</p>
            <button onClick={onClose} style={{ background: '#222', border: 'none', borderRadius: 8, color: '#888', fontSize: 18, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
          </div>

          {success ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <p style={{ fontSize: 40, marginBottom: 12 }}>🔥</p>
              <p style={{ color: '#fff', fontWeight: 800, fontSize: 17, marginBottom: 8 }}>Reçu 🔥</p>
              <p style={{ color: '#888', fontSize: 14, lineHeight: 1.5 }}>Si c'est une bonne idée on l'ajoute vite !</p>
              <button onClick={onClose} style={{ marginTop: 20, background: '#8B5CF6', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Fermer</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Catégorie */}
              <div>
                <label style={{ color: '#666', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.7px', display: 'block', marginBottom: 8 }}>Catégorie</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {CATEGORIES.map(c => (
                    <button
                      key={c} type="button"
                      onClick={() => setCategorie(c)}
                      style={{ padding: '7px 14px', borderRadius: 20, border: categorie === c ? '1.5px solid #8B5CF6' : '1px solid #2a2a2a', background: categorie === c ? 'rgba(139,92,246,0.15)' : '#1a1a1a', color: categorie === c ? '#8B5CF6' : '#888', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ color: '#666', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.7px', display: 'block', marginBottom: 6 }}>Nom du défi *</label>
                <input value={nom} onChange={e => setNom(e.target.value)} placeholder="ex: Dips, Méditation, Gainage..." maxLength={60} style={inputStyle} />
              </div>

              <div>
                <label style={{ color: '#666', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.7px', display: 'block', marginBottom: 6 }}>Unité de mesure *</label>
                <input value={unite} onChange={e => setUnite(e.target.value)} placeholder="ex: répétitions, minutes, km..." maxLength={30} style={inputStyle} />
              </div>

              <div>
                <label style={{ color: '#666', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.7px', display: 'block', marginBottom: 6 }}>Description <span style={{ color: '#444', fontWeight: 400, textTransform: 'none' }}>(optionnel)</span></label>
                <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Décris le défi en une phrase..." maxLength={120} style={inputStyle} />
              </div>

              {error && <p style={{ color: '#ef4444', fontSize: 12 }}>{error}</p>}

              <button type="submit" disabled={loading} style={{ background: '#8B5CF6', color: '#fff', border: 'none', borderRadius: 12, padding: '14px', fontSize: 15, fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.6 : 1, fontFamily: 'inherit', marginTop: 4, boxShadow: '0 4px 16px rgba(139,92,246,0.35)' }}>
                {loading ? 'Envoi...' : 'ENVOYER MA PROPOSITION'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Card variant (CreateChallenge step 1) ────────────────────────────────────
function CardVariant({ userId }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{ position: 'relative', height: 110, borderRadius: 18, overflow: 'hidden', border: '1px solid #2a2a2a', cursor: 'pointer', padding: 0, display: 'block', width: '100%', marginTop: 14 }}
      >
        <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(15,15,15,0.9) 0%, rgba(30,30,30,0.6) 100%)' }} />
        <div style={{ position: 'relative', padding: '1.25rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14, height: '100%', boxSizing: 'border-box' }}>
          <span style={{ fontSize: 36 }}>💡</span>
          <div>
            <p style={{ color: '#fff', fontWeight: 900, fontSize: 20, letterSpacing: '-0.5px', lineHeight: 1 }}>PROPOSER UN DÉFI</p>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, marginTop: 4 }}>Tu as une idée ? On l'ajoute !</p>
          </div>
          <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.3)', fontSize: 20 }}>›</span>
        </div>
      </button>
      {open && <Modal userId={userId} onClose={() => setOpen(false)} />}
    </>
  )
}

// ─── Link variant (MesDefis bottom) ──────────────────────────────────────────
function LinkVariant({ userId }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)} style={{ background: 'none', border: 'none', color: '#555', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6, padding: 0 }}>
        <span>💡</span>
        <span style={{ textDecoration: 'underline', textDecorationColor: '#333' }}>Proposer un type de défi</span>
      </button>
      {open && <Modal userId={userId} onClose={() => setOpen(false)} />}
    </>
  )
}

// ─── Main export ─────────────────────────────────────────────────────────────
export default function SuggestChallenge({ userId, variant = 'link' }) {
  if (variant === 'card') return <CardVariant userId={userId} />
  return (
    <div style={{ marginTop: '1.5rem', borderTop: '1px solid #1f1f1f', paddingTop: '1.25rem' }}>
      <LinkVariant userId={userId} />
    </div>
  )
}
