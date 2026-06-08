import React, { Component, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './supabase'
import Auth from './pages/Auth'
import Landing from './pages/Landing'
import MesDefis from './pages/MesDefis'
import CreateChallenge from './pages/CreateChallenge'
import Home from './pages/Home'
import Classement from './pages/Classement'
import Technique from './pages/Technique'
import Inviter from './pages/Inviter'
import Feed from './pages/Feed'
import Layout from './components/Layout'

// ─── Error Boundary ───────────────────────────────────────────────────────────
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('🔴 App crash:', error.message)
    console.error(info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', background: '#0f0f0f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', gap: 16, textAlign: 'center' }}>
          <span style={{ fontSize: 48 }}>⚠️</span>
          <p style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>Oups, une erreur s'est produite</p>
          <p style={{ color: '#555', fontSize: 13, maxWidth: 300 }}>
            {this.state.error?.message || 'Erreur inconnue — consulte la console (F12)'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{ background: '#8B5CF6', color: '#fff', border: 'none', borderRadius: 12, padding: '13px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 8 }}
          >
            Recharger l'app
          </button>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{ background: 'none', border: '1px solid #333', borderRadius: 12, padding: '10px 20px', fontSize: 13, color: '#666', cursor: 'pointer' }}
          >
            Réessayer sans recharger
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// ─── Loading screen ────────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: '#8B5CF6', borderRadius: 14, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>💪</div>
      <p style={{ color: '#444', fontSize: 13 }}>Chargement...</p>
    </div>
  )
}

// ─── App ───────────────────────────────────────────────────────────────────────
function AppInner() {
  const [authUser, setAuthUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('mesdefis')
  const [authStep, setAuthStep] = useState('landing') // 'landing' | 'register' | 'login'

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthUser(session?.user ?? null)
      setLoading(false)
    }).catch(err => {
      console.error('getSession error:', err)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setAuthUser(u)
      if (!u) { setProfile(null); setView('mesdefis') }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    try { await supabase.auth.signOut() } catch (e) { console.error(e) }
    setProfile(null)
    setAuthUser(null)
    setView('mesdefis')
  }

  async function handleLeaveDefi() {
    if (!profile?.id) return
    try { await supabase.from('users').delete().eq('id', profile.id) } catch (e) { console.error(e) }
    setProfile(null)
    setView('mesdefis')
  }

  if (loading) return <LoadingScreen />

  if (!authUser) {
    if (authStep === 'landing') {
      return (
        <Landing
          onStart={() => setAuthStep('register')}
          onLogin={() => setAuthStep('login')}
        />
      )
    }
    return <Auth defaultMode={authStep === 'login' ? 'login' : 'register'} />
  }

  if (view === 'create') {
    return (
      <CreateChallenge
        authUser={authUser}
        onJoined={() => setView('mesdefis')}
        onBack={() => setView('mesdefis')}
      />
    )
  }

  if (view === 'mesdefis' || !profile) {
    return (
      <MesDefis
        authUser={authUser}
        onEnter={(defi) => { setProfile(defi); setView('app') }}
        onCreate={() => setView('create')}
        logout={handleLogout}
      />
    )
  }

  return (
    <BrowserRouter>
      <Layout
        user={profile}
        logout={handleLogout}
        onMesDefis={() => { setProfile(null); setView('mesdefis') }}
        onLeaveDefi={handleLeaveDefi}
      >
        <Routes>
          <Route path="/" element={<Home user={profile} />} />
          <Route path="/classement" element={<Classement user={profile} />} />
          <Route path="/feed" element={<Feed user={profile} />} />
          <Route path="/technique" element={<Technique user={profile} />} />
          <Route path="/inviter" element={<Inviter user={profile} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppInner />
    </ErrorBoundary>
  )
}
