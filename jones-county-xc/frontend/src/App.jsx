import { useState, useEffect } from 'react'

function App() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/hello')
      .then(res => res.json())
      .then(data => {
        setMessage(data.message)
        setLoading(false)
      })
      .catch(() => {
        setMessage('Backend not connected')
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Jones County XC
        </h1>
        <p className="text-gray-600 mb-4">
          {loading ? 'Loading...' : message}
        </p>
        <div className="flex gap-4 justify-center">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            React + Vite
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            Tailwind CSS
          </span>
          <span className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm">
            Go Backend
          </span>
        </div>
      </div>
    </div>
  )
}

export default App
