export default function Welcome({ authUser, onCreate, onJoin, logout }) {
  const pseudo = authUser?.user_metadata?.pseudo
    || authUser?.user_metadata?.full_name
    || authUser?.email?.split('@')[0]
    || 'toi'

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ background: '#8B5CF6', borderRadius: 8, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>💪</div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>BattleUP</span>
        </div>
        <button onClick={logout} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: 8, color: '#555', fontSize: 12, padding: '5px 12px', cursor: 'pointer', fontFamily: 'inherit' }}>
          Déconnexion
        </button>
      </div>

      {/* Greeting */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', marginBottom: 6 }}>
            Bonjour {pseudo} 👋
          </h1>
          <p style={{ color: '#555', fontSize: 15, lineHeight: 1.5 }}>
            Crée un défi ou rejoins celui d'un ami pour commencer.
          </p>
        </div>

        {/* Create card */}
        <button onClick={onCreate} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 20, padding: '1.5rem', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', width: '100%' }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>🏆</div>
          <p style={{ color: '#fff', fontWeight: 700, fontSize: 17, marginBottom: 4 }}>Créer un défi</p>
          <p style={{ color: '#555', fontSize: 13, lineHeight: 1.5 }}>
            Lance un nouveau challenge, choisis la durée et le type d'activité.
          </p>
          <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', background: '#8B5CF6', borderRadius: 10, padding: '10px 18px', gap: 6 }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>CRÉER UN DÉFI</span>
            <span style={{ color: '#fff', fontSize: 14 }}>→</span>
          </div>
        </button>

        {/* Separator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: '#2a2a2a' }} />
          <span style={{ color: '#444', fontSize: 13, fontWeight: 600 }}>OU</span>
          <div style={{ flex: 1, height: 1, background: '#2a2a2a' }} />
        </div>

        {/* Join button */}
        <button onClick={onJoin} style={{ background: 'transparent', color: '#fff', border: '1.5px solid #2a2a2a', borderRadius: 14, padding: '15px', fontSize: 15, fontWeight: 600, cursor: 'pointer', letterSpacing: '0.2px', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <span>👥</span>
          Rejoindre un défi avec un code
        </button>
      </div>
    </div>
  )
}
