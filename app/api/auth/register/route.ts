import { NextRequest, NextResponse } from 'next/server'
import { users } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = body
    
    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }
    
    // Check if user already exists
    if (users.has(email)) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà' },
        { status: 400 }
      )
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password, // In production, hash the password!
      name,
      createdAt: new Date().toISOString()
    }
    
    users.set(email, newUser)
    
    // Return success response
    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription' },
      { status: 500 }
    )
  }
}