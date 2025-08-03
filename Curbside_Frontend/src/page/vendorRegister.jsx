import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../component/navbar.jsx'

const API_BASE =
  `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5034'}/api`

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
  if (!res.ok) throw new Error(payload?.message || res.statusText)
  return payload
}

function registerVendor({ name, email, password }) {
  // always register as Owner
  return apiFetch('/auth/register', {
    method: 'POST',
    body: { name, email, password, userType: 'Owner' }
  })
}

export default function VendorRegister() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    try {
      await registerVendor({ name, email, password })
      alert('Vendor registration successful! Please log in.')
      navigate('/login', { replace: true })
    } catch (ex) {
      const msg = ex.message || 'Registration failed. Please try again.'
      setError(msg)
      alert(`Registration failed: ${msg}`)
    }
  }

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('../Images/57664.jpg')" }}
    >
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded shadow-lg"
        >
          <h2 className="text-2xl font-semibold text-sky-500 mb-6">
            Vendor Sign Up
          </h2>

          {error && (
            <p className="mb-4 text-sm text-red-600">{error}</p>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded focus:border-sky-500 focus:ring focus:ring-sky-200"
            />
          </div>

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
              minLength={6}
              className="w-full border border-gray-300 p-2 rounded focus:border-sky-500 focus:ring focus:ring-sky-200"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 rounded"
          >
            Register Vendor
          </button>

          <p className="mt-6 text-sm">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-sky-500 hover:underline"
            >
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}