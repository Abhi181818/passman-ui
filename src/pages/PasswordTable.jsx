// src/pages/PasswordTable.jsx
import React from 'react'

const PasswordTable = ({ allPasswords, handleShowOriginal, visibleIdx, originalPw, pwLoading }) => (
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
              <td className='py-2 px-3 border'>{entry.service || entry.serviceName || <span className='text-gray-400'>N/A</span>}</td>
              <td className='py-2 px-3 border'>{entry.username || <span className='text-gray-400'>N/A</span>}</td>
              <td className='py-2 px-3 border break-all'>
                {entry.password || entry.encryptedPassword || <span className='text-gray-400'>N/A</span>}
                <button
                  type='button'
                  className='ml-2 text-gray-500 hover:text-blue-600 focus:outline-none'
                  title='Show original password'
                  onClick={() => handleShowOriginal(entry.service || entry.serviceName, entry.username, idx)}
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
)

export default PasswordTable
