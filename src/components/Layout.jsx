import { useState, useEffect, useRef } from 'react'
import BottomNav from './BottomNav'
import LogoIcon from './LogoIcon'

export default function Layout({ children, user, logout, onMesDefis, onLeaveDefi }) {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef()

  useEffect(() => {
    if (!showMenu) return
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showMenu])

  return (
    <div style={{ maxWidth: 430, margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0f0f0f' }}>
      <header style={{ padding: '0.875rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1f1f1f' }}>
        {/* Logo */}
        <button onClick={onMesDefis} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <LogoIcon size={28} />
          <p style={{ color: '#fff', fontWeight: 700, fontSize: 14, letterSpacing: '-0.3px' }}>LevelUP</p>
        </button>

        {/* Right actions */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={onMesDefis}
            style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, color: '#888', fontSize: 11, padding: '5px 10px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}
          >
            Mes défis
          </button>

          {/* Gear menu */}
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowMenu(v => !v)}
              style={{ background: showMenu ? '#2a2a2a' : '#1a1a1a', border: `1px solid ${showMenu ? '#3a3a3a' : '#2a2a2a'}`, borderRadius: 8, color: '#888', fontSize: 16, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', lineHeight: 1 }}
            >
              ⚙️
            </button>

            {showMenu && (
              <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 12, overflow: 'hidden', minWidth: 180, boxShadow: '0 8px 24px rgba(0,0,0,0.5)', zIndex: 200 }}>
                <button
                  onClick={() => { setShowMenu(false); onLeaveDefi?.() }}
                  style={{ width: '100%', background: 'none', border: 'none', borderBottom: '1px solid #222', color: '#8B5CF6', fontSize: 13, fontWeight: 600, padding: '13px 16px', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <span>🚪</span> Quitter le défi
                </button>
                <button
                  onClick={() => { setShowMenu(false); logout?.() }}
                  style={{ width: '100%', background: 'none', border: 'none', color: '#888', fontSize: 13, fontWeight: 500, padding: '13px 16px', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <span>↩️</span> Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 72 }}>
        {children}
      </div>
      <BottomNav />
    </div>
  )
}
