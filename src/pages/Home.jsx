import React, { useState, useRef } from 'react'
import PasswordTable from './PasswordTable'

const Home = () => {
  const API_BASE = 'https://passman-app.onrender.com/api/passwords'

  const [addForm, setAddForm] = useState({ service: '', username: '', password: '' })
  const [getService, setGetService] = useState('')
  const [addMsg, setAddMsg] = useState('')
  const [getResult, setGetResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [allPasswords, setAllPasswords] = useState([])
  const [showAll, setShowAll] = useState(false)
  const [allLoading, setAllLoading] = useState(false)
  const [allError, setAllError] = useState('')
  const [visibleIdx, setVisibleIdx] = useState(null)
  const [originalPw, setOriginalPw] = useState({})
  const [pwLoading, setPwLoading] = useState(false)
  const [pwError, setPwError] = useState('')
  const [storagePath, setStoragePath] = useState('')
  const [storageMsg, setStorageMsg] = useState('')
  const [loadPath, setLoadPath] = useState('')
  const [loadMsg, setLoadMsg] = useState('')
  const fileInputRef = useRef(null)
  const [fileDialogOpen, setFileDialogOpen] = useState(false)

  const handleAddChange = e => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value })
  }

  // Update all API calls to use API_BASE
  const handleAddSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setAddMsg('')
    try {
      const res = await fetch(`${API_BASE}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm)
      })
      const text = await res.text()
      setAddMsg(text)
      setAddForm({ service: '', username: '', password: '' })
    } catch (err) {
      setAddMsg('Error adding password')
    }
    setLoading(false)
  }

  const handleGetSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setGetResult('')
    try {
      const res = await fetch(`${API_BASE}/get?service=${encodeURIComponent(getService)}`)
      const text = await res.text()
      setGetResult(text)
    } catch (err) {
      setGetResult('Error fetching password')
    }
    setLoading(false)
  }

  const fetchAllPasswords = async () => {
    setAllLoading(true)
    setAllError('')
    try {
      const res = await fetch(`${API_BASE}/all`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setAllPasswords(data)
    } catch (err) {
      setAllError('Error fetching all passwords')
    }
    setAllLoading(false)
  }

  const handleShowOriginal = async (service, username, idx) => {
    setPwLoading(true)
    setPwError('')
    setVisibleIdx(idx)
    try {
      const res = await fetch(`${API_BASE}/get-original?service=${encodeURIComponent(service)}&username=${encodeURIComponent(username)}`)
      if (!res.ok) throw new Error('Failed to fetch original password')
      const text = await res.text()
      setOriginalPw(prev => ({ ...prev, [idx]: text }))
    } catch (err) {
      setPwError('Error fetching original password')
    }
    setPwLoading(false)
  }

  // Set storage file location
  const handleSetStorage = async e => {
    e.preventDefault()
    setStorageMsg('')
    try {
      const res = await fetch(`${API_BASE}/set-storage-file?path=${encodeURIComponent(storagePath)}`, { method: 'POST' })
      const text = await res.text()
      setStorageMsg(text)
    } catch (err) {
      setStorageMsg('Error setting storage file')
    }
  }

  // Load passwords from file
  const handleLoadPasswords = async e => {
    e.preventDefault()
    setLoadMsg('')
    try {
      const res = await fetch(`${API_BASE}/load-passwords?path=${encodeURIComponent(loadPath)}`, { method: 'POST' })
      if (!res.ok) throw new Error('Failed to load passwords')
      const data = await res.json()
      setAllPasswords(data)
      setLoadMsg('Passwords loaded successfully!')
    } catch (err) {
      setLoadMsg('Error loading passwords')
    }
  }

  // Handle file selection for storage file
  const handleFileSelect = e => {
    if (e.target.files && e.target.files[0]) {
      setStoragePath(e.target.files[0].path || e.target.files[0].name)
      setFileDialogOpen(false)
    }
  }

  // Open file dialog
  const openFileDialog = () => {
    setFileDialogOpen(true)
    fileInputRef.current && fileInputRef.current.click()
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-4'>
      <div className='bg-white shadow-lg rounded-lg p-8 w-full max-w-md mb-8'>
        <h2 className='text-2xl font-bold mb-4 text-center text-blue-700'>Add a Password</h2>
        <form onSubmit={handleAddSubmit} className='flex flex-col gap-4'>
          <input
            name='service'
            value={addForm.service}
            onChange={handleAddChange}
            type='text'
            placeholder='Service (e.g. example.com)'
            className='p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300'
            required
          />
          <input
            name='username'
            value={addForm.username}
            onChange={handleAddChange}
            type='text'
            placeholder='Username'
            className='p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300'
            required
          />
          <input
            name='password'
            value={addForm.password}
            onChange={handleAddChange}
            type='password'
            placeholder='Password'
            className='p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300'
            required
          />
          <button
            type='submit'
            className='bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50'
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Password'}
          </button>
        </form>
        {addMsg && <div className='mt-4 text-center text-sm text-green-600'>{addMsg}</div>}
      </div>

      <div className='bg-white shadow-lg rounded-lg p-8 w-full max-w-md mb-8'>
        <h2 className='text-2xl font-bold mb-4 text-center text-purple-700'>Get Encrypted Password</h2>
        <form onSubmit={handleGetSubmit} className='flex flex-col gap-4'>
          <input
            value={getService}
            onChange={e => setGetService(e.target.value)}
            type='text'
            placeholder='Service (e.g. example.com)'
            className='p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-300'
            required
          />
          <button
            type='submit'
            className='bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition disabled:opacity-50'
            disabled={loading}
          >
            {loading ? 'Fetching...' : 'Get Password'}
          </button>
        </form>
        {getResult && (
          <div className='mt-4 text-center text-sm break-all'>
            <span className='font-semibold text-gray-700'>Result:</span> {getResult}
          </div>
        )}
      </div>

      {/* Set Storage File Location */}
      <div className='bg-white shadow-lg rounded-lg p-8 w-full max-w-md mb-8'>
        <h2 className='text-xl font-bold mb-4 text-center text-gray-700'>Set Storage File Location</h2>
        <form onSubmit={handleSetStorage} className='flex flex-col gap-4'>
          <div className='flex gap-2'>
            <input
              value={storagePath}
              onChange={e => setStoragePath(e.target.value)}
              type='text'
              placeholder='Path to passwords.json'
              className='p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-300 flex-1'
              required
            />
            <button
              type='button'
              className='bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition'
              onClick={openFileDialog}
            >
              Browse
            </button>
            <input
              ref={fileInputRef}
              type='file'
              accept='.json'
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
          </div>
          <button
            type='submit'
            className='bg-gray-700 text-white py-2 rounded hover:bg-gray-800 transition'
          >
            Set Storage File
          </button>
        </form>
        {storageMsg && <div className='mt-2 text-center text-sm text-blue-600'>{storageMsg}</div>}
      </div>

      {/* Load Passwords from File */}
      <div className='bg-white shadow-lg rounded-lg p-8 w-full max-w-md mb-8'>
        <h2 className='text-xl font-bold mb-4 text-center text-gray-700'>Load Passwords from File</h2>
        <form onSubmit={handleLoadPasswords} className='flex flex-col gap-4'>
          <input
            value={loadPath}
            onChange={e => setLoadPath(e.target.value)}
            type='text'
            placeholder='Path to passwords.json'
            className='p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-300'
            required
          />
          <button
            type='submit'
            className='bg-gray-700 text-white py-2 rounded hover:bg-gray-800 transition'
          >
            Load Passwords
          </button>
        </form>
        {loadMsg && <div className='mt-2 text-center text-sm text-blue-600'>{loadMsg}</div>}
      </div>

      <div className='bg-white shadow-lg rounded-lg p-8 w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-4 text-center text-green-700'>All Stored Passwords</h2>
        <button
          onClick={() => {
            setShowAll(!showAll)
            if (!showAll && allPasswords.length === 0) fetchAllPasswords()
          }}
          className='bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition mb-4 w-full'
        >
          {showAll ? 'Hide All' : 'Show All Passwords'}
        </button>
        {showAll && (
          <div>
            {allLoading && <div className='text-center text-gray-500'>Loading...</div>}
            {allError && <div className='text-center text-red-500'>{allError}</div>}
            {!allLoading && !allError && (
              <PasswordTable
                allPasswords={allPasswords}
                handleShowOriginal={handleShowOriginal}
                visibleIdx={visibleIdx}
                originalPw={originalPw}
                pwLoading={pwLoading}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
