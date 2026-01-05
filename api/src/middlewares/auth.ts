import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não enviado' })
  }

  const [, token] = authHeader.split(' ')

  try {
    const decoded = jwt.verify(token, 'secret-key')
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({ error: 'Token inválido' })
  }
}