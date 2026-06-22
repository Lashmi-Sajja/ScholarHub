import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: '❖' },
  { to: '/planner', label: 'Planner', icon: '⚔' },
  { to: '/assistant', label: 'Assistant', icon: '◈' },
  { to: '/opportunities', label: 'Quests', icon: '⚑' },
  { to: '/profile', label: 'Profile', icon: '♛' },
]

export function Layout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-dark)' }}>
      <aside className="w-64 flex flex-col relative" style={{ background: 'var(--bg-surface)', borderRight: '2px solid #1a1a4a' }}>
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, var(--neon-cyan) 2px, var(--neon-cyan) 3px)' }} />
          <div className="p-5 border-b-2 relative" style={{ borderColor: '#1a1a4a' }}>
            <h1 className="text-xs font-pixel" style={{ color: 'var(--neon-cyan)', textShadow: '0 0 10px var(--neon-cyan), 0 0 20px var(--neon-cyan)' }}>
              SCHOLARHUB
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shadow-sm shadow-green-400" />
              <span className="text-xs" style={{ color: 'var(--text-dim)' }}>system online</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item, i) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 rounded-sm ${
                  isActive ? 'font-bold' : 'hover:bg-white/[0.03]'
                }`
              }
              style={({ isActive }) => ({
                background: isActive ? 'rgba(0, 255, 242, 0.08)' : 'transparent',
                border: '1px solid',
                borderColor: isActive ? 'rgba(0, 255, 242, 0.3)' : 'transparent',
                color: isActive ? 'var(--neon-cyan)' : 'var(--text-dim)',
                animation: mounted ? `slideIn 0.3s ease ${i * 0.06}s both` : 'none',
              })}
            >
              <span className="text-base w-6 text-center" style={{
                color: location.pathname === item.to || (item.to === '/' && location.pathname === '/') ? 'var(--neon-cyan)' : 'var(--text-dim)',
                filter: location.pathname === item.to || (item.to === '/' && location.pathname === '/') ? 'brightness(1.2)' : 'none',
              }}>
                {item.icon}
              </span>
              <span className="font-pixel-body tracking-wide text-base">{item.label}</span>
              {(location.pathname === item.to || (item.to === '/' && location.pathname === '/')) && (
                <span className="ml-auto text-xs animate-terminal" style={{ color: 'var(--neon-cyan)' }}>▌</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t-2 space-y-3" style={{ borderColor: '#1a1a4a' }}>
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 flex items-center justify-center text-sm font-bold shrink-0"
              style={{
                background: 'rgba(0, 255, 242, 0.1)',
                border: '1px solid var(--neon-cyan)',
                color: 'var(--neon-cyan)',
              }}>
              {user?.name?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="min-w-0">
              <div className="text-xs truncate" style={{ color: 'var(--text-main)' }}>{user?.name}</div>
              <div className="text-xs truncate" style={{ color: 'var(--text-dim)' }}>{user?.email}</div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm border transition-all duration-200 font-pixel-body"
            style={{
              borderColor: 'rgba(255, 51, 85, 0.3)',
              color: 'var(--neon-red)',
              background: 'rgba(255, 51, 85, 0.05)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 51, 85, 0.12)'
              e.currentTarget.style.borderColor = 'var(--neon-red)'
              e.currentTarget.style.boxShadow = '0 0 8px rgba(255, 51, 85, 0.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 51, 85, 0.05)'
              e.currentTarget.style.borderColor = 'rgba(255, 51, 85, 0.3)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <span>✕</span>
            <span>SIGN OUT</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-6 lg:p-8 animate-fade-in">
        <Outlet />
      </main>
    </div>
  )
}
