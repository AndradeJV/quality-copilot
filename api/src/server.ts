import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth'
const PORT = process.env.PORT || 3333

const app = express()

app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`)
})