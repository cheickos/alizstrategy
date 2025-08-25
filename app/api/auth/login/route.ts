import { NextRequest, NextResponse } from 'next/server'
import { users } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }
    
    // Find user
    const user = users.get(email)
    
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }
    
    // Create session token (simplified for demo)
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64')
    
    // Return success response with token
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token
    })
    
    // Set cookies for session
    response.cookies.set('userToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    })
    
    // Set admin cookie if user is admin
    if (email === 'admin@alizstrategy.com') {
      response.cookies.set('isAdmin', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      })
    }
    
    return response
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    )
  }
}