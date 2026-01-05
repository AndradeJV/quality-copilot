import { Pool } from 'pg'

export const pool = new Pool({
  user: 'joaoandrade',
  host: 'localhost',
  database: 'quality_copilot',
  password: '', // se não tiver senha, deixa vazio
  port: 5432
})