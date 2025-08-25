import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile, mkdir } from 'fs/promises'
import path from 'path'

const dataFilePath = path.join(process.cwd(), 'data', 'expertise.json')

// Default expertise content
const defaultExpertiseContent = {
  mainTitle: 'Nos Pôles d\'Expertise',
  mainDescription: 'Une offre de services complète pour adresser chaque facette de votre développement.',
  backgroundColor: 'white',
  categories: []
}

async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await mkdir(dataDir, { recursive: true })
  } catch (error) {
    // Directory might already exist
  }
}

async function readExpertiseContent() {
  try {
    const data = await readFile(dataFilePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    // If file doesn't exist, return default content
    await ensureDataDirectory()
    await writeFile(dataFilePath, JSON.stringify(defaultExpertiseContent, null, 2))
    return defaultExpertiseContent
  }
}

async function writeExpertiseContent(content: any) {
  await ensureDataDirectory()
  await writeFile(dataFilePath, JSON.stringify(content, null, 2))
}

export async function GET() {
  try {
    const content = await readExpertiseContent()
    
    // Add CORS headers
    const response = NextResponse.json({ content })
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
    
    return response
  } catch (error) {
    console.error('Error reading expertise content:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la lecture du contenu' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 })
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
  return response
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.mainTitle || !body.mainDescription || !body.categories) {
      return NextResponse.json(
        { error: 'Les champs principaux sont requis' },
        { status: 400 }
      )
    }
    
    // Update expertise content
    const expertiseContent = {
      mainTitle: body.mainTitle,
      mainDescription: body.mainDescription,
      backgroundColor: body.backgroundColor || 'white',
      categories: body.categories
    }
    
    await writeExpertiseContent(expertiseContent)
    
    const response = NextResponse.json({ 
      success: true, 
      content: expertiseContent 
    })
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
    
    return response
  } catch (error) {
    console.error('Error saving expertise content:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde' },
      { status: 500 }
    )
  }
}