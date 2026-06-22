import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/', label: 'Dashboard', icon: '>' },
  { to: '/planner', label: 'Planner', icon: '@' },
  { to: '/assistant', label: 'Assistant', icon: '?' },
  { to: '/opportunities', label: 'Quests', icon: '!' },
  { to: '/profile', label: 'Profile', icon: '#' },
]

export function Layout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen flex scanline" style={{ background: 'var(--bg-dark)' }}>
      <aside className="w-64 flex flex-col" style={{ background: 'var(--bg-surface)', borderRight: '2px solid #2a2a4a' }}>
        <div className="p-5 border-b-2" style={{ borderColor: '#2a2a4a' }}>
          <h1 className="text-xs neon-text-cyan">SCHOLARHUB</h1>
          <div className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>ver 1.0</div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm transition-all ${
                  isActive
                    ? 'text-black font-bold'
                    : 'hover:bg-white/5'
                }`
              }
              style={({ isActive }) => ({
                background: isActive ? 'var(--neon-cyan)' : 'transparent',
                border: '2px solid',
                borderColor: isActive ? 'var(--neon-cyan)' : 'transparent',
                color: isActive ? 'var(--bg-dark)' : 'var(--text-main)',
                boxShadow: isActive ? '0 0 10px rgba(0,255,242,0.3)' : 'none',
              })}
            >
              <span className="font-bold w-5 text-center">{item.icon}</span>
              <span className="font-pixel-body tracking-wide">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t-2" style={{ borderColor: '#2a2a4a' }}>
          <div className="text-xs truncate mb-3" style={{ color: 'var(--text-dim)' }}>
            {user?.email}
          </div>
          <button
            onClick={logout}
            className="w-full text-left px-4 py-2 text-sm border-2 border-red-900/50 text-red-400 hover:bg-red-950/30 transition-colors font-pixel-body"
          >
            &gt; SIGN OUT
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
