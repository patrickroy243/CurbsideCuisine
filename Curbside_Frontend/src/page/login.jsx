// src/pages/Login.jsx

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

/*
  Make sure you have in your project root:
    .env
    └── REACT_APP_API_BASE_URL=http://localhost:5034
  Then restart your dev server so `process.env.REACT_APP_API_BASE_URL` is available.
*/

const API_BASE = `'http://localhost:5034'}/api`

// 1. Generic fetch wrapper that handles JSON, errors, and optional auth
async function apiFetch(path, { method = 'GET', body, requireAuth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (requireAuth) {
    const token = localStorage.getItem('token')
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  })

  const payload = await res.json().catch(() => null)
  if (!res.ok) {
    const msg = payload?.message || payload || res.statusText
    throw new Error(msg)
  }
  return payload
}

// 2. Auth service functions
function login({ email, password }) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: { email, password }
  })
}

// 3. Single-file Login component
export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')

    try {
      // call your AuthController /api/auth/login
      const { token, user } = await login({ email, password })

      // persist for later API calls
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      // show success popup
      alert('Login successful!')

      // redirect based on role
      if (user.userType === 'Owner') {
        navigate('/vendor-dashboard')
      } else {
        navigate('/customer-home')
      }
    } catch (ex) {
      const msg = ex.message || 'Login failed. Please try again.'
      setError(msg)
      alert(`Login failed: ${msg}`)
    }
  }

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('../Images/57664.jpg')" }}
    >
      {/* Navbar would go here */}
      <div className="flex-1 flex items-center justify-center px-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded shadow-lg"
        >
          <h2 className="text-2xl font-semibold text-sky-500 mb-6">Login</h2>

          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

          <p className="mb-6 text-sm">
            Not a member yet?{' '}
            <Link
              to="/signup"
              className="font-bold text-sky-500 hover:underline"
            >
              Create an Account
            </Link>
          </p>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded focus:border-sky-500 focus:ring focus:ring-sky-200"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded focus:border-sky-500 focus:ring focus:ring-sky-200"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 rounded"
          >
            Login
          </button>

          <p className="mt-6 text-sm">
            Are you a food truck owner?
            <br />
            Create a{' '}
            <Link
              to="/vendor-signup"
              className="font-bold text-sky-500 hover:underline"
            >
              Curbside Cuisine Vendor
            </Link>{' '}
            account to get started.
          </p>
        </form>
      </div>
    </div>
  )
}