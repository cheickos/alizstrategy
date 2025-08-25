import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // For now, we'll just log the contact form submission
    // In production, you would send this to your backend API
    console.log('Contact form submission:', { name, email, subject, message })

    // Here you would typically:
    // 1. Send to your backend API
    // 2. Send email notification
    // 3. Store in database

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({ success: true, message: 'Message reçu' })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur lors de l\'envoi' },
      { status: 500 }
    )
  }
}