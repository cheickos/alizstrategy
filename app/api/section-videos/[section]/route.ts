import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ section: string }> }
) {
  const { section } = await context.params
  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5001'
    const response = await fetch(`${backendUrl}/api/section-videos/${section}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch section video' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching section video:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ section: string }> }
) {
  const { section } = await context.params
  try {
    const body = await request.json()
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5001'
    
    const response = await fetch(`${backendUrl}/api/section-videos/${section}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to update section video' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating section video:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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