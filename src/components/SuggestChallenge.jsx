import { useState } from 'react'
import { supabase } from '../supabase'

const inputStyle = {
  width: '100%', background: '#222', border: '1px solid #2f2f2f',
  borderRadius: 10, padding: '11px 14px', fontSize: 14, color: '#fff',
  outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
}

export default function SuggestChallenge({ userId }) {
  const [open, setOpen] = useState(false)
  const [nom, setNom] = useState('')
  const [unite, setUnite] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!nom.trim() || !unite.trim()) { setError('Remplis au moins le nom et l\'unité.'); return }
    setLoading(true)
    setError('')

    const { error: e1 } = await supabase.from('suggestions').insert({
      user_id: userId || null,
      nom: nom.trim(),
      unite: unite.trim(),
      description: description.trim() || null,
    })

    if (e1) { setError('Erreur lors de l\'envoi.'); setLoading(false); return }

    setSuccess(true)
    setLoading(false)
    setNom('')
    setUnite('')
    setDescription('')
  }

  function handleClose() {
    setOpen(false)
    setSuccess(false)
    setError('')
  }

  return (
    <div style={{ marginTop: '1.5rem', borderTop: '1px solid #1f1f1f', paddingTop: '1.25rem' }}>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          style={{ background: 'none', border: 'none', color: '#555', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6, padding: 0 }}
        >
          <span>💡</span>
          <span style={{ textDecoration: 'underline', textDecorationColor: '#333' }}>Proposer un type de défi</span>
        </button>
      ) : (
        <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 16, padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>💡 Proposer un défi</p>
            <button onClick={handleClose} style={{ background: 'none', border: 'none', color: '#555', fontSize: 18, cursor: 'pointer', lineHeight: 1, padding: 0 }}>×</button>
          </div>

          {success ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <p style={{ fontSize: 32, marginBottom: 10 }}>🔥</p>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Reçu 🔥 On regarde ça !</p>
              <p style={{ color: '#555', fontSize: 13 }}>Merci pour ta suggestion.</p>
              <button onClick={handleClose} style={{ marginTop: 16, background: 'none', border: '1px solid #2a2a2a', borderRadius: 10, color: '#888', fontSize: 13, padding: '8px 16px', cursor: 'pointer', fontFamily: 'inherit' }}>
                Fermer
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <label style={{ color: '#666', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.7px', display: 'block', marginBottom: 6 }}>
                  Nom du défi *
                </label>
                <input
                  value={nom}
                  onChange={e => setNom(e.target.value)}
                  placeholder="ex: Sauts à la corde"
                  maxLength={60}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ color: '#666', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.7px', display: 'block', marginBottom: 6 }}>
                  Unité de mesure *
                </label>
                <input
                  value={unite}
                  onChange={e => setUnite(e.target.value)}
                  placeholder="ex: sauts, km, minutes..."
                  maxLength={30}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ color: '#666', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.7px', display: 'block', marginBottom: 6 }}>
                  Description <span style={{ color: '#444', fontWeight: 400, textTransform: 'none' }}>(optionnel)</span>
                </label>
                <input
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Décris le défi en une phrase..."
                  maxLength={120}
                  style={inputStyle}
                />
              </div>

              {error && <p style={{ color: '#8B5CF6', fontSize: 12 }}>{error}</p>}

              <button
                type="submit"
                disabled={loading}
                style={{ background: '#8B5CF6', color: '#fff', border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.6 : 1, fontFamily: 'inherit', marginTop: 4 }}
              >
                {loading ? 'Envoi...' : 'Envoyer la proposition'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
