import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { setMounted(true) }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'var(--bg-dark)' }}>
      <div className="absolute inset-0 opacity-[0.015]" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, var(--neon-cyan) 3px, var(--neon-cyan) 4px)' }} />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(circle at 50% 40%, rgba(0,255,242,0.05) 0%, transparent 60%)',
      }} />
      <div
        className="w-full max-w-sm px-4 relative"
        style={{ animation: mounted ? 'fadeIn 0.5s ease forwards' : 'none' }}
      >
        <div className="text-center mb-8">
          <h1 className="text-xl font-pixel mb-3" style={{
            color: 'var(--neon-cyan)',
            textShadow: '0 0 10px var(--neon-cyan), 0 0 30px var(--neon-cyan), 0 0 60px var(--neon-cyan)',
          }}>
            SCHOLARHUB
          </h1>
          <div className="flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shadow-sm shadow-green-400" />
            <span className="text-xs tracking-wider" style={{ color: 'var(--text-dim)' }}>ACCESS TERMINAL</span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="card-retro p-6 space-y-5" style={{ borderColor: '#2a2a5a' }}>
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <span className="text-xs" style={{ color: 'var(--neon-yellow)' }}>▶</span>
            <h2 className="text-xs font-pixel" style={{ color: 'var(--neon-yellow)' }}>SIGN IN</h2>
          </div>
          {error && (
            <div className="text-sm p-3 flex items-center gap-2" style={{
              background: 'rgba(255, 51, 85, 0.1)',
              border: '1px solid rgba(255, 51, 85, 0.3)',
              color: '#ff6b6b',
            }}>
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}
          <div className="space-y-1.5">
            <label className="block text-xs font-pixel tracking-wider" style={{ color: 'var(--text-dim)' }}>EMAIL</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="input-retro w-full" />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-pixel tracking-wider" style={{ color: 'var(--text-dim)' }}>PASSWORD</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="input-retro w-full" />
          </div>
          <button type="submit"
            className="btn-retro w-full text-center"
            style={{ background: 'var(--neon-cyan)', color: 'var(--bg-dark)', borderColor: 'var(--neon-cyan)' }}>
            ENTER
          </button>
          <p className="text-xs text-center" style={{ color: 'var(--text-dim)' }}>
            NO ACCOUNT?{' '}
            <Link to="/register" className="hover:underline transition-all" style={{ color: 'var(--neon-magenta)' }}>
              REGISTER
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
