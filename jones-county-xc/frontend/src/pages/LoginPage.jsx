import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

function LoginPage() {
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const username = e.target.username.value.trim()
    const password = e.target.password.value

    if (!username || !password) {
      setError('Username and password are required')
      return
    }

    const success = login(username, password)
    if (success) {
      navigate('/admin', { replace: true })
    } else {
      setError('Login failed')
    }
  }

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Login</h2>
      <form onSubmit={handleSubmit} noValidate className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 flex flex-col gap-5">
        {error && (
          <p role="alert" className="text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <div>
          <label htmlFor="login-username" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            id="login-username"
            name="username"
            type="text"
            autoComplete="username"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <Button type="submit" className="w-full">
          Log In
        </Button>
      </form>
    </div>
  )
}

export default LoginPage
