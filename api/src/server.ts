import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)

app.listen(3333, () => {
  console.log('🚀 Backend rodando em http://localhost:3333')
})