import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET!

export interface DecodedToken {
  id: number
  role: string
  satuanKerjaId?: number
}

// ✅ Versi yang menerima langsung string token
export function verifyToken(token: string): DecodedToken | null {
  try {
    return jwt.verify(token, JWT_SECRET) as DecodedToken
  } catch (err) {
    return null
  }
}
