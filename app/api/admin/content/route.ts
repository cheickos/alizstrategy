import { NextRequest, NextResponse } from 'next/server'

// Temporary in-memory storage (replace with database)
let contentStore: Record<string, any> = {}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const section = searchParams.get('section')
  
  if (!section) {
    return NextResponse.json({ error: 'Section parameter required' }, { status: 400 })
  }
  
  return NextResponse.json({ content: contentStore[section] || {} })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { section, content } = body
    
    if (!section || !content) {
      return NextResponse.json({ error: 'Section and content required' }, { status: 400 })
    }
    
    contentStore[section] = {
      ...content,
      updatedAt: new Date().toISOString()
    }
    
    return NextResponse.json({ success: true, content: contentStore[section] })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { section, itemId, updates } = body
    
    if (!section || !itemId || !updates) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    if (contentStore[section] && contentStore[section].items) {
      const itemIndex = contentStore[section].items.findIndex((item: any) => item.id === itemId)
      if (itemIndex !== -1) {
        contentStore[section].items[itemIndex] = {
          ...contentStore[section].items[itemIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        }
        return NextResponse.json({ success: true })
      }
    }
    
    return NextResponse.json({ error: 'Item not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const section = searchParams.get('section')
  const itemId = searchParams.get('itemId')
  
  if (!section || !itemId) {
    return NextResponse.json({ error: 'Section and itemId required' }, { status: 400 })
  }
  
  if (contentStore[section] && contentStore[section].items) {
    contentStore[section].items = contentStore[section].items.filter(
      (item: any) => item.id !== itemId
    )
    return NextResponse.json({ success: true })
  }
  
  return NextResponse.json({ error: 'Item not found' }, { status: 404 })
}