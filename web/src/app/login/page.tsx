'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // 🔁 REDIRECT SE JÁ LOGADO
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      router.push('/')
    }
  }, [router])

  async function handleLogin() {
    setLoading(true)
    setError('')

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Erro ao fazer login')
      setLoading(false)
      return
    }

    localStorage.setItem('token', data.token)
    router.push('/')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="w-full max-w-sm bg-gray-900 p-6 rounded-xl space-y-4">
        <h1 className="text-xl font-bold text-white text-center">Quality Copilot</h1>

        <input
          className="w-full p-2 rounded bg-gray-800 text-white"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-2 rounded bg-gray-800 text-white"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="
            w-full py-2 rounded-lg
            bg-gradient-to-r from-indigo-600 to-purple-600
            text-white font-medium
            hover:opacity-90 transition
            disabled:opacity-50
          "
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </div>
    </main>
  )
}
