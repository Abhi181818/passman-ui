import React, { useState, useEffect } from 'react'
// Add Lucide icons
import { User, Mail, Lock, Eye, EyeOff, LogIn, UserPlus, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const API_BASE = 'http://localhost:8080/api/user'

    // const API_BASE = 'https://passman-app.onrender.com/api/user'

  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState({ email: '', password: '', displayName: '', masterPassword: '' })
  const [authMsg, setAuthMsg] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [user, setUser] = useState(null) 
  const navigate = useNavigate();

  const handleAuthChange = e => {
    setAuthForm({ ...authForm, [e.target.name]: e.target.value })
  }

  const handleAuthSubmit = async e => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthMsg('')
    try {
      if (authMode === 'register') {
        const res = await fetch(`${API_BASE}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: authForm.email,
            displayName: authForm.displayName,
            masterPassword: authForm.masterPassword 
          })
        })
        const text = await res.text()
        setAuthMsg(text)
        const profileRes = await fetch(`${API_BASE}/profile?email=${encodeURIComponent(authForm.email)}`)
        if (profileRes.ok) {
          const profile = await profileRes.json()
          setUser(profile)
        }
      } else {
        // Login: fetch user profile from backend
        const res = await fetch(`${API_BASE}/profile?email=${encodeURIComponent(authForm.email)}`)
        if (!res.ok) throw new Error('User not found')
        const profile = await res.json()
        setAuthMsg('Login successful!')
        setUser(profile)
      }
    } catch (err) {
      setAuthMsg('Authentication failed: ' + err.message)
    }
    setAuthLoading(false)
  }

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { state: { user } });
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100/80 to-purple-200/80 p-4 backdrop-blur-sm">
        <div className="bg-white/60 shadow-2xl rounded-3xl p-10 w-full max-w-md border border-white/30 backdrop-blur-lg">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-blue-100/60 rounded-full p-4 mb-2 shadow-lg">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-extrabold mb-1 text-center text-blue-700 drop-shadow-lg">
              {authMode === 'register' ? 'Create Account' : 'Sign In'}
            </h2>
            <p className="text-gray-500 text-sm mb-2">
              {authMode === 'register' ? 'Register to manage your passwords securely.' : 'Login to your account.'}
            </p>
          </div>
          <form onSubmit={handleAuthSubmit} className="flex flex-col gap-5">
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-blue-400" />
              <input
                name="email"
                value={authForm.email}
                onChange={handleAuthChange}
                type="email"
                placeholder="Email"
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white/70 backdrop-blur"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-blue-400" />
              <input
                name="password"
                value={authForm.password}
                onChange={handleAuthChange}
                type="password"
                placeholder="Password"
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white/70 backdrop-blur"
                required
              />
            </div>
            {authMode === 'register' && (
              <>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-3 w-5 h-5 text-blue-400" />
                  <input
                    name="displayName"
                    value={authForm.displayName}
                    onChange={handleAuthChange}
                    type="text"
                    placeholder="Display Name"
                    className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white/70 backdrop-blur"
                    required
                  />
                </div>
                <div className="relative">
                  <Eye className="absolute left-3 top-3 w-5 h-5 text-blue-400" />
                  <input
                    name="masterPassword"
                    value={authForm.masterPassword}
                    onChange={handleAuthChange}
                    type="password"
                    placeholder="Master Password (will be hashed)"
                    className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white/70 backdrop-blur"
                    required
                  />
                </div>
              </>
            )}
            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 shadow-lg"
              disabled={authLoading}
            >
              {authLoading ? (
                <span className="flex items-center gap-2">
                  {authMode === 'register' ? <UserPlus className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5 animate-spin" />}
                  {authMode === 'register' ? 'Registering...' : 'Logging in...'}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {authMode === 'register' ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                  {authMode === 'register' ? 'Register' : 'Login'}
                </span>
              )}
            </button>
          </form>
          <div className="mt-6 text-center text-sm">
            {authMode === 'register' ? (
              <>
                Already have an account?{' '}
                <button className="text-blue-600 underline font-semibold" onClick={() => setAuthMode('login')}>Login</button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{' '}
                <button className="text-blue-600 underline font-semibold" onClick={() => setAuthMode('register')}>Register</button>
              </>
            )}
          </div>
          {authMsg && <div className="mt-4 text-center text-sm text-green-600 font-semibold drop-shadow-lg">{authMsg}</div>}
        </div>
      </div>
    )
  }

  // After login/register, just show a welcome and logout
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100/80 to-purple-200/80 p-4 backdrop-blur-sm">
      <div className="bg-white/60 shadow-2xl rounded-3xl p-10 w-full max-w-md mb-8 border border-white/30 backdrop-blur-lg flex flex-col items-center">
        <div className="bg-blue-100/60 rounded-full p-4 mb-2 shadow-lg">
          <User className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700 drop-shadow-lg">Welcome, {user.displayName || user.email}!</h2>
        <div className="text-center text-gray-600 mb-4">UID: {user.uid}</div>
        <button className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition shadow-lg" onClick={() => setUser(null)}>
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </div>
  )
}

export default Home
