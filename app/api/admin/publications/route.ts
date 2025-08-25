import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'

interface Publication {
  id: string
  title: string
  description: string
  type: 'document' | 'video' | 'image'
  fileUrl: string
  thumbnailUrl?: string
  videoUrl?: string  // URL de la vidéo YouTube explicative
  category: string
  subCategory: string
  date: string
  downloadCount?: number
}

// Chemin vers le fichier JSON
const dataFilePath = path.join(process.cwd(), 'data', 'publications.json')

// Fonction pour lire les publications depuis le fichier
async function readPublications(): Promise<Publication[]> {
  try {
    const data = await readFile(dataFilePath, 'utf-8')
    const parsed = JSON.parse(data)
    return parsed.publications || []
  } catch (error) {
    console.error('Error reading publications file:', error)
    // Si le fichier n'existe pas, retourner un tableau vide
    return []
  }
}

// Fonction pour écrire les publications dans le fichier
async function writePublications(publications: Publication[]): Promise<void> {
  try {
    const data = JSON.stringify({ publications }, null, 2)
    await writeFile(dataFilePath, data, 'utf-8')
    console.log('Publications saved to file')
  } catch (error) {
    console.error('Error writing publications file:', error)
    throw error
  }
}

export async function GET() {
  try {
    const publications = await readPublications()
    return NextResponse.json({ publications })
  } catch (error) {
    console.error('Error in GET /api/admin/publications:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la lecture des publications' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('POST /api/admin/publications - Body received:', body)
    
    if (!body.title || !body.type || !body.fileUrl) {
      console.error('Missing required fields:', { 
        title: !!body.title, 
        type: !!body.type, 
        fileUrl: !!body.fileUrl 
      })
      return NextResponse.json(
        { error: 'Les champs titre, type et fichier sont requis' },
        { status: 400 }
      )
    }
    
    // Lire les publications existantes
    const publications = await readPublications()
    
    const newPublication: Publication = {
      id: Date.now().toString(),
      title: body.title,
      description: body.description || '',
      type: body.type,
      fileUrl: body.fileUrl,
      thumbnailUrl: body.thumbnailUrl,
      videoUrl: body.videoUrl,
      category: body.category || 'Stratégie & Croissance',
      subCategory: body.subCategory || 'Rapports',
      date: new Date().toISOString().split('T')[0],
      downloadCount: 0
    }
    
    console.log('New publication created:', newPublication)
    publications.push(newPublication)
    
    // Sauvegarder dans le fichier
    await writePublications(publications)
    console.log('Total publications after adding:', publications.length)
    
    return NextResponse.json({ 
      success: true, 
      publication: newPublication 
    })
  } catch (error) {
    console.error('Error in POST /api/admin/publications:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout de la publication' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('PUT /api/admin/publications - Body received:', body)
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'L\'ID de la publication est requis' },
        { status: 400 }
      )
    }
    
    // Lire les publications existantes
    const publications = await readPublications()
    
    const index = publications.findIndex(pub => pub.id === body.id)
    
    if (index === -1) {
      console.error('Publication not found with ID:', body.id)
      console.log('Available IDs:', publications.map(p => p.id))
      return NextResponse.json(
        { error: 'Publication non trouvée' },
        { status: 404 }
      )
    }
    
    publications[index] = {
      ...publications[index],
      ...body,
      id: body.id // Ensure ID doesn't change
    }
    
    // Sauvegarder dans le fichier
    await writePublications(publications)
    console.log('Publication updated:', publications[index])
    
    return NextResponse.json({ 
      success: true, 
      publication: publications[index] 
    })
  } catch (error) {
    console.error('Error in PUT /api/admin/publications:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'L\'ID de la publication est requis' },
        { status: 400 }
      )
    }
    
    // Lire les publications existantes
    const publications = await readPublications()
    
    const index = publications.findIndex(pub => pub.id === id)
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Publication non trouvée' },
        { status: 404 }
      )
    }
    
    publications.splice(index, 1)
    
    // Sauvegarder dans le fichier
    await writePublications(publications)
    console.log('Publication deleted, remaining:', publications.length)
    
    return NextResponse.json({ 
      success: true 
    })
  } catch (error) {
    console.error('Error in DELETE /api/admin/publications:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
}