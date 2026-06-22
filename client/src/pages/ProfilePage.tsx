import { useAuth } from '../context/AuthContext'

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <div>
      <h1 className="text-sm neon-text-green mb-6 font-pixel">▸ PLAYER PROFILE</h1>
      <div className="card-retro p-5 max-w-md space-y-4" style={{ borderColor: 'var(--neon-green)', boxShadow: '0 0 8px rgba(57,255,20,0.1)' }}>
        <div className="flex items-center gap-4 pb-4 border-b border-white/10">
          <div className="w-14 h-14 flex items-center justify-center text-xl font-bold"
            style={{ background: 'rgba(57,255,20,0.1)', border: '2px solid var(--neon-green)', color: 'var(--neon-green)' }}>
            {user?.name?.charAt(0).toUpperCase() || '?'}
          </div>
          <div>
            <div className="text-sm font-pixel" style={{ color: 'var(--neon-green)' }}>{user?.name}</div>
            <div className="text-xs" style={{ color: 'var(--text-dim)' }}>LEVEL 1 SCHOLAR</div>
          </div>
        </div>
        <div>
          <div className="text-xs font-pixel mb-1" style={{ color: 'var(--text-dim)' }}>E-MAIL</div>
          <div className="text-sm" style={{ color: 'var(--text-main)' }}>{user?.email}</div>
        </div>
        <div>
          <div className="text-xs font-pixel mb-1" style={{ color: 'var(--text-dim)' }}>STATUS</div>
          <div className="text-sm" style={{ color: 'var(--neon-green)' }}>ONLINE</div>
        </div>
      </div>
    </div>
  )
}
