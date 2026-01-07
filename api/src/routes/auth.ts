import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { pool } from '../db'

const router = Router()

router.post('/register', async (req, res) => {
  const { email, password } = req.body

  try {
    const hash = await bcrypt.hash(password, 10)

    await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2)', [email, hash])

    return res.status(201).json({ message: 'Usuário criado com sucesso' })
  } catch (err: any) {
    console.error('ERRO AO CRIAR USUÁRIO:', err)

    return res.status(500).json({
      error: err.message,
      code: err.code,
    })
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])

  if (result.rowCount === 0) {
    return res.status(401).json({ error: 'Credenciais inválidas' })
  }

  const user = result.rows[0]
  const valid = await bcrypt.compare(password, user.password_hash)

  if (!valid) {
    return res.status(401).json({ error: 'Credenciais inválidas' })
  }

  const token = jwt.sign({ userId: user.id }, 'secret-key', { expiresIn: '1h' })

  return res.json({ token })
})

router.get('/users-active', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users')
    const count = parseInt(result.rows[0].count, 10)
    return res.json({ activeUsers: count })
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar usuários ativos' })
  }
})

router.get('/health', (_, res) => {
  res.json({ ok: true })
})

router.get('/db-check', async (_, res) => {
  const result = await pool.query('SELECT 1 as ok')
  res.json(result.rows[0])
})

export default router
