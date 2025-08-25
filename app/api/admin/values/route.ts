import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile, mkdir } from 'fs/promises'
import path from 'path'

const dataFilePath = path.join(process.cwd(), 'data', 'values.json')

// Default values content
const defaultValuesContent = {
  mainTitle: 'Le Socle de Notre Engagement',
  mainDescription: 'Cinq valeurs fondamentales qui guident chacune de nos actions et collaborations.',
  values: [
    {
      id: '1',
      icon: 'fa-hands-helping',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      title: 'Engagement',
      description: 'Un dévouement total à la réussite et à la satisfaction de nos clients.'
    },
    {
      id: '2',
      icon: 'fa-rocket',
      color: 'text-teal-600',
      bgColor: 'bg-teal-100',
      title: 'Innovation',
      description: 'Une approche proactive pour intégrer les dernières technologies et tendances.'
    },
    {
      id: '3',
      icon: 'fa-users',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      title: 'Collaboration',
      description: 'Un travail en étroite coopération, fondé sur l\'écoute et la co-création.'
    },
    {
      id: '4',
      icon: 'fa-shield-alt',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      title: 'Intégrité',
      description: 'Le maintien des normes éthiques les plus élevées dans toutes nos interactions.'
    },
    {
      id: '5',
      icon: 'fa-medal',
      color: 'text-teal-600',
      bgColor: 'bg-teal-100',
      title: 'Excellence',
      description: 'Une quête constante de dépassement pour fournir une valeur ajoutée mesurable.'
    }
  ],
  philosophyTitle: 'Notre Philosophie',
  philosophyText: 'Ces valeurs ne sont pas de simples mots sur une page. Elles représentent notre ADN, notre façon de penser et d\'agir au quotidien. Chaque membre de l\'équipe Aliz Strategy s\'engage à incarner ces principes dans chaque projet, chaque interaction et chaque décision.',
  statistics: [
    { id: '1', value: '100%', label: 'Satisfaction client visée', color: 'text-blue-600' },
    { id: '2', value: '24/7', label: 'Disponibilité et réactivité', color: 'text-teal-600' },
    { id: '3', value: '360°', label: 'Vision globale de vos enjeux', color: 'text-indigo-600' }
  ],
  howWeApplyTitle: 'Comment Nous Vivons Nos Valeurs',
  backgroundColor: 'white',
  applications: [
    {
      id: '1',
      title: 'Dans Nos Relations Clients',
      icon: 'fa-check-circle',
      iconColor: 'text-green-500',
      items: [
        'Écoute active et compréhension approfondie de vos besoins',
        'Transparence totale dans nos communications et nos actions',
        'Engagement sur des résultats mesurables et tangibles'
      ]
    },
    {
      id: '2',
      title: 'Dans Notre Équipe',
      icon: 'fa-check-circle',
      iconColor: 'text-green-500',
      items: [
        'Culture du partage de connaissances et d\'expertise',
        'Formation continue pour rester à la pointe',
        'Esprit d\'équipe et entraide permanente'
      ]
    }
  ]
}

async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await mkdir(dataDir, { recursive: true })
  } catch (error) {
    // Directory might already exist
  }
}

async function readValuesContent() {
  try {
    const data = await readFile(dataFilePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    // If file doesn't exist, return default content
    await ensureDataDirectory()
    await writeFile(dataFilePath, JSON.stringify(defaultValuesContent, null, 2))
    return defaultValuesContent
  }
}

async function writeValuesContent(content: any) {
  await ensureDataDirectory()
  await writeFile(dataFilePath, JSON.stringify(content, null, 2))
}

export async function GET() {
  try {
    const content = await readValuesContent()
    return NextResponse.json(
      { content },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    )
  } catch (error) {
    console.error('Error reading values content:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la lecture du contenu' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.mainTitle || !body.mainDescription || !body.values) {
      return NextResponse.json(
        { error: 'Les champs principaux sont requis' },
        { status: 400 }
      )
    }
    
    // Update values content
    const valuesContent = {
      mainTitle: body.mainTitle,
      mainDescription: body.mainDescription,
      values: body.values,
      philosophyTitle: body.philosophyTitle,
      philosophyText: body.philosophyText,
      statistics: body.statistics,
      howWeApplyTitle: body.howWeApplyTitle,
      applications: body.applications,
      backgroundColor: body.backgroundColor || 'white'
    }
    
    await writeValuesContent(valuesContent)
    
    return NextResponse.json(
      { 
        success: true, 
        content: valuesContent,
        timestamp: Date.now() // Ajouter un timestamp pour forcer le rafraîchissement
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    )
  } catch (error) {
    console.error('Error saving values content:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde' },
      { status: 500 }
    )
  }
}