'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

const FOOTER_HEIGHT = 150

export default function Home() {
  const router = useRouter()

  const [checkingAuth, setCheckingAuth] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [input, setInput] = useState('')
  const [persona, setPersona] = useState('qa')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [darkMode, setDarkMode] = useState(true)

  const bottomRef = useRef<HTMLDivElement | null>(null)

  // 🔐 AUTH GUARD
  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      router.push('/login')
      return
    }

    setIsAuthenticated(true)
    setCheckingAuth(false)
  }, [router])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage() {
    if (!input.trim()) return

    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    const userMessage: Message = {
      role: 'user',
      content: input,
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        requirement: userMessage.content,
        persona,
      }),
    })

    const data = await res.json()

    const assistantMessage: Message = {
      role: 'assistant',
      content: data.output,
    }

    setMessages(prev => [...prev, assistantMessage])
    setLoading(false)
  }

  // ⛔ BLOQUEIA RENDER
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-400">
        Carregando...
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <main
      className={`
        min-h-screen transition-colors
        ${darkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}
      `}
    >
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-10 p-4 border-b border-indigo-500/20 bg-inherit">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-indigo-500">Quality Copilot</h1>
            <p className="text-xs text-gray-400">Requisitos → Hipóteses → Qualidade</p>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="
              text-xs px-3 py-1 rounded-md
              border border-indigo-500
              text-indigo-500
              hover:bg-indigo-500 hover:text-white
              transition
            "
          >
            {darkMode ? 'Modo claro' : 'Modo escuro'}
          </button>
        </div>
      </header>

      {/* CHAT */}
      <section className="pt-20 overflow-y-auto" style={{ paddingBottom: FOOTER_HEIGHT }}>
        <div className="max-w-3xl mx-auto p-6 space-y-6">
          {messages.length === 0 && (
            <p className="text-sm text-gray-400">Envie um requisito para começar a conversa 👇</p>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-[85%] rounded-lg p-4 text-sm whitespace-pre-wrap leading-relaxed
                  ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : darkMode
                        ? 'bg-gray-900 border border-indigo-500/30'
                        : 'bg-white border border-indigo-500/40'
                  }
                `}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="text-sm text-gray-400 animate-pulse">Gerando cenários...</div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </section>

      {/* INPUT */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-indigo-500/20 bg-inherit p-4">
        <div className="max-w-3xl mx-auto flex gap-3 items-end">
          <div className="flex-1 space-y-2">
            <select
              className={`
                text-xs rounded-md p-1 w-32 border
                ${
                  darkMode
                    ? 'bg-gray-900 border-gray-700 text-gray-100'
                    : 'bg-white border-gray-300 text-gray-900'
                }
              `}
              value={persona}
              onChange={e => setPersona(e.target.value)}
            >
              <option value="qa">QA</option>
              <option value="dev">Dev</option>
              <option value="po">PO</option>
              <option value="designer">Designer</option>
            </select>

            <textarea
              rows={3}
              placeholder="Descreva o requisito..."
              className={`
                w-full resize-none rounded-lg p-3 text-sm border
                ${
                  darkMode
                    ? 'bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                }
                focus:outline-none focus:ring-2 focus:ring-indigo-500
              `}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  sendMessage()
                }
              }}
            />
          </div>

          <button
            onClick={sendMessage}
            disabled={loading || !input}
            className="
              bg-gradient-to-r from-indigo-600 to-purple-600
              text-white px-4 py-3 rounded-lg font-medium
              hover:opacity-90 disabled:opacity-50 transition
            "
          >
            Enviar
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-2">Ctrl/⌘ + Enter para enviar</p>
      </footer>
    </main>
  )
}
