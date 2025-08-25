import { NextRequest, NextResponse } from 'next/server'

// Temporary storage for homepage content
let homepageContent = {
  title: 'Votre Allié Stratégique pour une Croissance Durable',
  subtitle: 'Nous transformons les défis en opportunités grâce à des solutions innovantes, digitales et sur mesure.',
  buttonText: 'Explorer nos expertises',
  backgroundImage: 'https://images.unsplash.com/photo-1543092587-d8b8feaf362b?q=80&w=2000&auto=format&fit=crop',
  backgroundColor: 'white'
}

export async function GET() {
  return NextResponse.json({ content: homepageContent })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.title || !body.subtitle || !body.buttonText) {
      return NextResponse.json(
        { error: 'Tous les champs texte sont requis' },
        { status: 400 }
      )
    }
    
    // Update homepage content
    homepageContent = {
      title: body.title,
      subtitle: body.subtitle,
      buttonText: body.buttonText,
      backgroundImage: body.backgroundImage || homepageContent.backgroundImage,
      backgroundColor: body.backgroundColor || homepageContent.backgroundColor
    }
    
    return NextResponse.json({ 
      success: true, 
      content: homepageContent 
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde' },
      { status: 500 }
    )
  }
}