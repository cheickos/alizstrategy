import { NextRequest, NextResponse } from 'next/server'

// Temporary hardcoded admin credentials (replace with database and hashing)
const ADMIN_CREDENTIALS = {
  email: 'admin@alizstrategy.com',
  password: 'admin123' // This should be hashed in production
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }
    
    // Check credentials
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      // In production, generate a proper JWT token
      const token = Buffer.from(`${email}:${Date.now()}`).toString('base64')
      
      return NextResponse.json({ 
        success: true,
        token,
        user: {
          email,
          role: 'admin'
        }
      })
    }
    
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const token = authHeader.substring(7)
  
  try {
    // Validate token (simplified for demo)
    const decoded = Buffer.from(token, 'base64').toString()
    const [email] = decoded.split(':')
    
    if (email === ADMIN_CREDENTIALS.email) {
      return NextResponse.json({ 
        authenticated: true,
        user: {
          email,
          role: 'admin'
        }
      })
    }
  } catch (error) {
    // Invalid token
  }
  
  return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
}