import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await register(name, email, password)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center scanline" style={{ background: 'var(--bg-dark)' }}>
      <div className="w-full max-w-sm px-4">
        <div className="text-center mb-8">
          <h1 className="text-lg neon-text-magenta mb-2">SCHOLARHUB</h1>
          <div className="text-xs" style={{ color: 'var(--text-dim)' }}>REGISTRATION TERMINAL</div>
        </div>
        <form onSubmit={handleSubmit} className="card-retro p-6 space-y-5" style={{ borderColor: '#333' }}>
          <h2 className="text-sm font-pixel" style={{ color: 'var(--neon-magenta)' }}>▸ CREATE ACCOUNT</h2>
          {error && (
            <div className="text-sm p-3 border-2 border-red-800 bg-red-950/30" style={{ color: '#ff6b6b' }}>
              ! {error}
            </div>
          )}
          <div>
            <label className="block text-sm mb-1" style={{ color: 'var(--text-dim)' }}>NAME</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
              className="input-retro w-full" />
          </div>
          <div>
            <label className="block text-sm mb-1" style={{ color: 'var(--text-dim)' }}>EMAIL</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="input-retro w-full" />
          </div>
          <div>
            <label className="block text-sm mb-1" style={{ color: 'var(--text-dim)' }}>PASSWORD</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="input-retro w-full" />
          </div>
          <button type="submit"
            className="btn-retro w-full text-center"
            style={{ background: 'var(--neon-magenta)', color: '#fff', borderColor: 'var(--neon-magenta)' }}>
            REGISTER
          </button>
          <p className="text-xs text-center" style={{ color: 'var(--text-dim)' }}>
            ALREADY IN? <Link to="/login" className="hover:underline" style={{ color: 'var(--neon-cyan)' }}>SIGN IN</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
