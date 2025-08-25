import { NextRequest, NextResponse } from 'next/server'

// Temporary storage for about page content
let aboutContent = {
  mainTitle: 'À Propos d\'Aliz Strategy',
  description1: 'Implanté à Abidjan, Aliz Strategy se positionne comme un partenaire essentiel pour les entreprises et institutions. Notre mission est de catalyser votre succès par l\'innovation, la transformation numérique et le développement stratégique.',
  description2: 'Notre expertise s\'étend au-delà des frontières ivoiriennes. Nous combinons une fine connaissance des marchés locaux à une perspective internationale pour fournir des solutions sur mesure qui génèrent des résultats tangibles et un avantage compétitif durable sur l\'ensemble du continent.',
  digitalTitle: 'La transformation digitale : un levier de croissance majeur',
  digitalDescription: 'Selon les données gouvernementales, la digitalisation est perçue comme un atout clé pour la rentabilité. C\'est au cœur de notre approche pour rendre votre organisation plus agile et connectée.',
  chartPercentage: 79,
  chartLabel: 'Atout pour la croissance',
  backgroundColor: 'blue-50',
  vision: 'Démocratiser l\'accès au conseil de haut niveau grâce aux technologies, afin de catalyser la réussite des organisations de toutes tailles.',
  mission: 'Accompagner de manière personnalisée les entreprises – du grand groupe à la startup innovante, en passant par les PME et les institutions publiques – pour les aider à atteindre leurs objectifs. En fournissant des conseils stratégiques sur mesure et à fort impact, via une approche flexible s\'appuyant sur une plateforme digitale de pointe.',
  values: 'Guidée par des valeurs d\'excellence, d\'intégrité, d\'innovation et d\'impact, ALIZ STRATEGY combine expertise locale et standards internationaux pour offrir des solutions innovantes parfaitement adaptées au contexte de chacun.'
}

export async function GET() {
  return NextResponse.json({ content: aboutContent })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.mainTitle || !body.description1 || !body.description2) {
      return NextResponse.json(
        { error: 'Les champs principaux sont requis' },
        { status: 400 }
      )
    }
    
    // Update about content
    aboutContent = {
      mainTitle: body.mainTitle,
      description1: body.description1,
      description2: body.description2,
      digitalTitle: body.digitalTitle || aboutContent.digitalTitle,
      digitalDescription: body.digitalDescription || aboutContent.digitalDescription,
      chartPercentage: body.chartPercentage ?? aboutContent.chartPercentage,
      chartLabel: body.chartLabel || aboutContent.chartLabel,
      backgroundColor: body.backgroundColor || aboutContent.backgroundColor,
      vision: body.vision || aboutContent.vision,
      mission: body.mission || aboutContent.mission,
      values: body.values || aboutContent.values
    }
    
    return NextResponse.json({ 
      success: true, 
      content: aboutContent 
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde' },
      { status: 500 }
    )
  }
}