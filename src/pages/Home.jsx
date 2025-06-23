import React, { useState } from 'react'

const Home = () => {
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

  const handleAddChange = e => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value })
  }

  const handleAddSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setAddMsg('')
    try {
      const res = await fetch('http://localhost:8080/api/passwords/add', {
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
      const res = await fetch(`http://localhost:8080/api/passwords/get?service=${encodeURIComponent(getService)}`)
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
      const res = await fetch('http://localhost:8080/api/passwords/all')
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
      const res = await fetch(`http://localhost:8080/api/passwords/get-original?service=${encodeURIComponent(service)}&username=${encodeURIComponent(username)}`)
      if (!res.ok) throw new Error('Failed to fetch original password')
      const text = await res.text()
      setOriginalPw(prev => ({ ...prev, [idx]: text }))
    } catch (err) {
      setPwError('Error fetching original password')
    }
    setPwLoading(false)
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
              <div className='overflow-x-auto'>
                <table className='min-w-full text-sm text-left border'>
                  <thead>
                    <tr className='bg-gray-100'>
                      <th className='py-2 px-3 border'>Service</th>
                      <th className='py-2 px-3 border'>Username</th>
                      <th className='py-2 px-3 border'>Encrypted Password</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allPasswords.length === 0 ? (
                      <tr><td colSpan={4} className='text-center py-4'>No passwords found.</td></tr>
                    ) : (
                      allPasswords.map((entry, idx) => (
                        <tr key={idx} className='hover:bg-gray-50'>
                          <td className='py-2 px-3 border'>{entry.service}</td>
                          <td className='py-2 px-3 border'>{entry.username}</td>
                          <td className='py-2 px-3 border break-all'>
                            {entry.password}
                            <button
                              type='button'
                              className='ml-2 text-gray-500 hover:text-blue-600 focus:outline-none'
                              title='Show original password'
                              onClick={() => handleShowOriginal(entry.service, entry.username, idx)}
                            >
                              <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-5 h-5 inline'>
                                <path strokeLinecap='round' strokeLinejoin='round' d='M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z' />
                                <path strokeLinecap='round' strokeLinejoin='round' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                              </svg>
                            </button>
                            {visibleIdx === idx && (
                              <span className='ml-2 text-red-600 font-mono'>
                                {pwLoading ? 'Loading...' : originalPw[idx]}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
