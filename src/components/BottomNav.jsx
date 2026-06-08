import { Link, useLocation } from 'react-router-dom'

const tabs = [
  { to: '/',            label: 'Saisie',  end: true,  icon: (a) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? '#8B5CF6' : '#555'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { to: '/classement',  label: 'Podium',  end: false, icon: (a) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? '#8B5CF6' : '#555'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21H4a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h4"/><path d="M16 21h4a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2h-4"/><rect x="8" y="11" width="8" height="10" rx="1"/><path d="M12 3l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4z"/></svg> },
  { to: '/feed',        label: 'Feed',    end: false, icon: (a) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? '#8B5CF6' : '#555'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg> },
  { to: '/technique',   label: 'Règles',  end: false, icon: (a) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? '#8B5CF6' : '#555'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> },
  { to: '/inviter',     label: 'Inviter', end: false, icon: (a) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? '#8B5CF6' : '#555'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg> },
]

function Tab({ to, label, icon, end }) {
  const { pathname } = useLocation()
  const isActive = end ? pathname === to : pathname.startsWith(to)

  return (
    <Link
      to={to}
      style={{
        flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '9px 2px 7px', textDecoration: 'none', color: isActive ? '#8B5CF6' : '#555',
        fontSize: 9, fontWeight: 500, gap: 3, letterSpacing: '0.1px',
      }}
    >
      {icon(isActive)}
      {label}
    </Link>
  )
}

export default function BottomNav() {
  return (
    <nav style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, background: '#0f0f0f', borderTop: '1px solid #1f1f1f', display: 'flex', zIndex: 100 }}>
      {tabs.map(t => <Tab key={t.to} {...t} />)}
    </nav>
  )
}
