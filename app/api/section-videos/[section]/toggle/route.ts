import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ section: string }> }
) {
  const { section } = await context.params
  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5001'
    
    const response = await fetch(`${backendUrl}/api/section-videos/${section}/toggle`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to toggle section video status' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error toggling section video status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}