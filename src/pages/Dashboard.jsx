import React, { useState } from 'react'
import { Eye, EyeOff, PlusCircle, List, Lock, User, KeyRound, Trash2 } from 'lucide-react'

const Dashboard = () => {
  const [passwords, setPasswords] = useState(() => {
    try {
      const data = localStorage.getItem('passman_passwords')
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  })
  const [form, setForm] = useState({ service: '', username: '', password: '' })
  const [showPwIdx, setShowPwIdx] = useState(null)
  const [msg, setMsg] = useState('')

  const hashPassword = (pw) => {
    const salt=bcrypt.genSaltSync(10)
    return bcrypt.hashSync(pw, salt)
  }

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAdd = e => {
    e.preventDefault()
    if (!form.service || !form.username || !form.password) {
      setMsg('All fields are required.')
      return
    }
    const hashed = hashPassword(form.password)
    const entry = { service: form.service, username: form.username, password: hashed }
    const updated = [...passwords, entry]
    setPasswords(updated)
    localStorage.setItem('passman_passwords', JSON.stringify(updated))
    setForm({ service: '', username: '', password: '' })
    setMsg('Password added!')
  }

  const handleDelete = idx => {
    const updated = passwords.filter((_, i) => i !== idx)
    setPasswords(updated)
    localStorage.setItem('passman_passwords', JSON.stringify(updated))
    setMsg('Password deleted.')
  }

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(passwords, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'passwords.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setMsg('Passwords exported successfully!')
  }
  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-100/80 to-purple-200/80 p-4 backdrop-blur-sm">
        <div className=" mb-2">
            <button className='bg-green-400 p-2 rounded-xl text-black font-semibold shadow-lg hover:bg-green-500 transition'
            onClick={()=>{handleExport()}}
            >
                Export
            </button>
        </div>
      <div className="bg-white/60 shadow-2xl rounded-3xl p-8 w-full max-w-xl mb-8 border border-white/30 backdrop-blur-lg">
        <h2 className="text-2xl font-bold mb-4 text-blue-700 flex items-center gap-2">
          <PlusCircle className="w-6 h-6 text-blue-500" /> Add Password
        </h2>
        <form onSubmit={handleAdd} className="flex flex-col gap-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <KeyRound className="absolute left-3 top-3 w-5 h-5 text-blue-400" />
              <input
                name="service"
                value={form.service}
                onChange={handleChange}
                type="text"
                placeholder="Service (e.g. example.com)"
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white/70 backdrop-blur"
                required
              />
            </div>
            <div className="relative flex-1">
              <User className="absolute left-3 top-3 w-5 h-5 text-blue-400" />
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                type="text"
                placeholder="Username"
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white/70 backdrop-blur"
                required
              />
            </div>
            <div className="relative flex-1">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-blue-400" />
              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                type="password"
                placeholder="Password"
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white/70 backdrop-blur"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 shadow-lg"
          >
            <PlusCircle className="w-5 h-5" /> Add
          </button>
        </form>
        {msg && <div className="mt-2 text-center text-sm text-green-600 font-semibold drop-shadow-lg">{msg}</div>}
      </div>

      <div className="bg-white/60 shadow-2xl rounded-3xl p-8 w-full max-w-xl border border-white/30 backdrop-blur-lg">
        <h2 className="text-2xl font-bold mb-4 text-green-700 flex items-center gap-2">
          <List className="w-6 h-6 text-green-500" /> All Passwords
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-3 border">Service</th>
                <th className="py-2 px-3 border">Username</th>
                <th className="py-2 px-3 border">Password (Hashed)</th>
                <th className="py-2 px-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {passwords.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-4">No passwords stored.</td></tr>
              ) : (
                passwords.map((entry, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="py-2 px-3 border">{entry.service}</td>
                    <td className="py-2 px-3 border">{entry.username}</td>
                    <td className="py-2 px-3 border font-mono">
                      {showPwIdx === idx ? atob(entry.password) : entry.password}
                      <button
                        type="button"
                        className="ml-2 text-gray-500 hover:text-blue-600 focus:outline-none"
                        title={showPwIdx === idx ? 'Hide password' : 'Show password'}
                        onClick={() => setShowPwIdx(showPwIdx === idx ? null : idx)}
                      >
                        {showPwIdx === idx ? <EyeOff className="w-5 h-5 inline" /> : <Eye className="w-5 h-5 inline" />}
                      </button>
                    </td>
                    <td className="py-2 px-3 border">
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                        onClick={() => handleDelete(idx)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
