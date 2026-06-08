import { useState } from 'react'
import { supabase } from '../supabase'
import { generateCode } from '../utils/generateCode'
import { CHALLENGE_CATALOG, CHALLENGE_TYPES, CHALLENGE_THUMBS, getChallenge } from '../utils/challengeTypes'
import SuggestChallenge from '../components/SuggestChallenge'

// ─── Breadcrumb ───────────────────────────────────────────────────────────────
function Breadcrumb({ step, category, subCategory, challengeType, onBack, onGoTo }) {
  const cat = CHALLENGE_CATALOG.find(c => c.key === category)
  const sub = cat?.subCategories.find(s => s.key === subCategory)
  const ch = challengeType ? getChallenge(challengeType) : null

  const crumbs = [
    { label: cat ? `${cat.icon} ${cat.label}` : 'Catégorie', active: step === 1, step: 1 },
    { label: sub ? `${sub.icon} ${sub.label}` : 'Type', active: step === 2, step: 2 },
    { label: ch ? ch.label : 'Défi', active: step === 3, step: 3 },
    { label: 'Création', active: step === 4, step: 4 },
  ].slice(0, step + 1)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', marginBottom: '1.25rem' }}>
      {crumbs.map((c, i) => (
        <span key={c.step} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {i > 0 && <span style={{ color: '#333', fontSize: 11 }}>›</span>}
          <button
            onClick={() => i < crumbs.length - 1 && onGoTo(c.step)}
            style={{ background: 'none', border: 'none', padding: 0, cursor: i < crumbs.length - 1 ? 'pointer' : 'default', color: c.active ? '#fff' : '#555', fontSize: 12, fontWeight: c.active ? 700 : 400, fontFamily: 'inherit' }}
          >
            {c.label}
          </button>
        </span>
      ))}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function CreateChallenge({ authUser, onJoined, onBack }) {
  const [step, setStep] = useState(1)
  const [category, setCategory] = useState(null)
  const [subCategory, setSubCategory] = useState(null)
  const [challengeType, setChallengeType] = useState(null)
  const [groupName, setGroupName] = useState('')
  const [duration, setDuration] = useState(30)
  const [durationInput, setDurationInput] = useState('30')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function goTo(s) {
    if (s < step) setStep(s)
  }

  function selectCategory(key) {
    setCategory(key)
    setSubCategory(null)
    setChallengeType(null)
    setStep(2)
  }

  function selectSubCategory(key) {
    setSubCategory(key)
    setChallengeType(null)
    setStep(3)
  }

  function selectChallenge(key) {
    setChallengeType(key)
    setStep(4)
  }

  async function handleCreate() {
    if (!groupName.trim()) { setError('Entre un nom de défi'); return }
    setLoading(true)
    setError('')

    const code = generateCode()
    const endsAt = new Date(Date.now() + duration * 86400000).toISOString()

    const { data: grp, error: e1 } = await supabase
      .from('groups')
      .insert({ code, name: groupName.trim(), ends_at: endsAt, challenge_type: challengeType, duration_days: duration, defi_type: getChallenge(challengeType).defiType ?? 'cumul' })
      .select().single()

    if (e1) { setError('Erreur création défi : ' + e1.message); setLoading(false); return }

    const pseudo = authUser.user_metadata?.pseudo
      || authUser.user_metadata?.full_name
      || authUser.email?.split('@')[0] || 'Joueur'

    const { data: usr, error: e2 } = await supabase
      .from('users')
      .insert({ pseudo, group_id: grp.id, auth_id: authUser.id })
      .select().single()

    if (e2) { setError('Erreur création profil : ' + e2.message); setLoading(false); return }

    onJoined({ ...usr, group: grp })
  }

  const cat = CHALLENGE_CATALOG.find(c => c.key === category)
  const sub = cat?.subCategories.find(s => s.key === subCategory)
  const selectedChallenge = challengeType ? getChallenge(challengeType) : null

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', display: 'flex', flexDirection: 'column', padding: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
        <button
          onClick={() => step === 1 ? onBack() : setStep(s => s - 1)}
          style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: '#fff', flexShrink: 0 }}
        >←</button>
        <h1 style={{ fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>Nouveau défi</h1>
      </div>

      {step > 1 && (
        <Breadcrumb step={step} category={category} subCategory={subCategory} challengeType={challengeType} onBack={() => setStep(s => s - 1)} onGoTo={goTo} />
      )}

      <div style={{ flex: 1, overflowY: 'auto' }}>

        {/* ── STEP 1: Category ── */}
        {step === 1 && (
          <div>
            <p style={{ color: '#888', fontSize: 13, marginBottom: '1.25rem' }}>Dans quelle catégorie ?</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {CHALLENGE_CATALOG.map(cat => {
                const total = cat.subCategories.reduce((s, sub) => s + sub.challenges.length, 0)
                return (
                  <button
                    key={cat.key}
                    onClick={() => selectCategory(cat.key)}
                    style={{ position: 'relative', height: 110, borderRadius: 18, overflow: 'hidden', border: '1px solid #2a2a2a', cursor: 'pointer', padding: 0, display: 'block', width: '100%' }}
                  >
                    <img src={cat.image} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(91,33,182,0.85) 0%, rgba(0,0,0,0.3) 100%)' }} />
                    <div style={{ position: 'relative', padding: '1.25rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14, height: '100%', boxSizing: 'border-box' }}>
                      <span style={{ fontSize: 36 }}>{cat.icon}</span>
                      <div>
                        <p style={{ color: '#fff', fontWeight: 900, fontSize: 22, letterSpacing: '-0.5px', lineHeight: 1 }}>{cat.label}</p>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 4 }}>{total} défis disponibles</p>
                      </div>
                      <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.4)', fontSize: 20 }}>›</span>
                    </div>
                  </button>
                )
              })}
            </div>
            <SuggestChallenge userId={null} variant="card" />
          </div>
        )}

        {/* ── STEP 2: Sub-category ── */}
        {step === 2 && cat && (
          <div>
            <p style={{ color: '#888', fontSize: 13, marginBottom: '1.25rem' }}>Quel type d'entraînement ?</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {cat.subCategories.map(sub => (
                <button
                  key={sub.key}
                  onClick={() => selectSubCategory(sub.key)}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 14, border: '1px solid #2a2a2a', background: '#1a1a1a', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}
                >
                  <span style={{ fontSize: 24, width: 32, textAlign: 'center', flexShrink: 0 }}>{sub.icon}</span>
                  <p style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>{sub.label}</p>
                  <span style={{ marginLeft: 'auto', color: '#444', fontSize: 16 }}>›</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 3: Challenge ── */}
        {step === 3 && sub && (
          <div>
            <p style={{ color: '#888', fontSize: 13, marginBottom: '1.25rem' }}>Quel défi ?</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {sub.challenges.map(key => {
                const t = getChallenge(key)
                const img = CHALLENGE_THUMBS[key]
                const isSelected = challengeType === key
                return (
                  <button
                    key={key}
                    onClick={() => selectChallenge(key)}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 14, border: isSelected ? '1.5px solid #8B5CF6' : '1px solid #2a2a2a', background: isSelected ? 'rgba(139,92,246,0.1)' : '#1a1a1a', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0, overflow: 'hidden', position: 'relative', background: '#2a2a2a' }}>
                      {img && <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(139,92,246,0.25)' }} />
                    </div>
                    <p style={{ color: isSelected ? '#fff' : '#ccc', fontWeight: 600, fontSize: 14, flex: 1 }}>{t.label}</p>
                    {isSelected && <span style={{ color: '#8B5CF6', fontSize: 18, flexShrink: 0 }}>✓</span>}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ── STEP 4: Form ── */}
        {step === 4 && selectedChallenge && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Selected challenge recap */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 12, padding: '10px 14px' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, overflow: 'hidden', position: 'relative', background: '#2a2a2a', flexShrink: 0 }}>
                {CHALLENGE_THUMBS[selectedChallenge.key] && <img src={CHALLENGE_THUMBS[selectedChallenge.key]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(139,92,246,0.3)' }} />
              </div>
              <div>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{selectedChallenge.label}</p>
                <p style={{ color: '#8B5CF6', fontSize: 11 }}>en {selectedChallenge.unit}</p>
              </div>
              <button onClick={() => setStep(3)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#555', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Changer</button>
            </div>

            {/* Group name */}
            <div>
              <label style={{ color: '#888', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: 8 }}>Nom du défi</label>
              <input
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                placeholder="ex: Les Warriors du Bureau"
                maxLength={40}
                autoFocus
                style={{ width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 12, padding: '13px 16px', fontSize: 15, color: '#fff', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>

            {/* Duration */}
            <div>
              <label style={{ color: '#888', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: 8 }}>Durée du défi</label>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1a1a1a', borderRadius: 16, border: '1px solid #2a2a2a', padding: '12px 16px' }}>
                <button onClick={() => { setDuration(d => d - 1); setDurationInput(v => String(parseInt(v || 30) - 1)) }} style={{ width: 44, height: 44, borderRadius: '50%', background: '#8B5CF6', border: 'none', color: '#fff', fontSize: 24, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, lineHeight: 1 }}>−</button>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <input
                    type="number"
                    value={durationInput}
                    onChange={e => { const v = e.target.value.replace(/[^0-9]/g, ''); setDurationInput(v); if (v !== '') setDuration(parseInt(v)) }}
                    onFocus={e => e.target.select()}
                    onBlur={() => { if (durationInput === '' || parseInt(durationInput) === 0) { setDuration(30); setDurationInput('30') } }}
                    style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: 52, fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: '-2px', textAlign: 'center', fontFamily: 'inherit' }}
                  />
                  <p style={{ color: '#555', fontSize: 13, fontWeight: 500, marginTop: 2 }}>jours</p>
                </div>
                <button onClick={() => { setDuration(d => d + 1); setDurationInput(v => String(parseInt(v || 30) + 1)) }} style={{ width: 44, height: 44, borderRadius: '50%', background: '#8B5CF6', border: 'none', color: '#fff', fontSize: 24, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, lineHeight: 1 }}>+</button>
              </div>
            </div>

            {error && <p style={{ color: '#8B5CF6', fontSize: 13, background: 'rgba(139,92,246,0.1)', padding: '10px 12px', borderRadius: 10 }}>{error}</p>}

            <button
              onClick={handleCreate}
              disabled={loading}
              style={{ width: '100%', background: '#8B5CF6', color: '#fff', border: 'none', borderRadius: 14, padding: '15px', fontSize: 15, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.3px', opacity: loading ? 0.6 : 1, fontFamily: 'inherit', boxShadow: '0 4px 20px rgba(139,92,246,0.4)' }}
            >
              {loading ? 'Création...' : 'CRÉER LE DÉFI'}
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
