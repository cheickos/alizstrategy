import { NextRequest, NextResponse } from 'next/server'

interface Realisation {
  id: string
  title: string
  description: string
  imageUrl: string
  client: string
  sector: string
  impact: string
  period: string
  pole: 'Stratégie & Croissance' | 'Finance & Investissement' | 'Transformation & Innovation'
}

interface NewsItem {
  id: string
  title: string
  excerpt: string
  content: string
  imageUrl: string
  category: string
  author: string
  date: string
  readTime: string
  featured?: boolean
}

// Temporary storage
let realisations: Realisation[] = [
  // Stratégie & Croissance
  {
    id: '1',
    title: 'Stratégie de croissance pour un leader de l\'agro-industrie',
    description: 'Développement d\'une stratégie de croissance sur 5 ans pour un acteur majeur de l\'agro-industrie en Afrique de l\'Ouest.',
    imageUrl: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?q=80&w=2000',
    client: 'AgroTech Industries',
    sector: 'Agro-industrie',
    impact: 'Identification de 3 nouveaux marchés, augmentation projetée du CA de 150% sur 5 ans, création de 500 emplois directs.',
    period: '2023',
    pole: 'Stratégie & Croissance'
  },
  {
    id: '2',
    title: 'Expansion internationale d\'une entreprise télécom',
    description: 'Accompagnement stratégique pour l\'expansion dans 5 nouveaux pays africains, avec étude de marché approfondie et plan de déploiement.',
    imageUrl: 'https://images.unsplash.com/photo-1520333789090-1afc82db536a?q=80&w=2000',
    client: 'TelecomPlus Africa',
    sector: 'Télécommunications',
    impact: 'Présence établie dans 5 nouveaux marchés, acquisition de 2M de nouveaux clients en 18 mois, ROI de 250%.',
    period: '2022 - 2023',
    pole: 'Stratégie & Croissance'
  },
  {
    id: '3',
    title: 'Refonte stratégique d\'un groupe industriel',
    description: 'Réorganisation complète et définition d\'une nouvelle vision stratégique pour un conglomérat industriel diversifié.',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000',
    client: 'Industrial Group SA',
    sector: 'Industrie',
    impact: 'Restructuration en 4 divisions autonomes, amélioration de la rentabilité de 45%, clarification de la gouvernance.',
    period: '2023',
    pole: 'Stratégie & Croissance'
  },

  // Finance & Investissement
  {
    id: '4',
    title: 'Transformation digitale d\'une institution financière',
    description: 'Accompagnement d\'une banque leader dans sa transformation numérique complète, incluant la modernisation de ses systèmes et la digitalisation de ses services.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000',
    client: 'Banque Centrale d\'Afrique',
    sector: 'Services Financiers',
    impact: 'Augmentation de 40% de l\'efficacité opérationnelle, réduction de 60% des délais de traitement, et amélioration significative de la satisfaction client.',
    period: '2023 - 2024',
    pole: 'Finance & Investissement'
  },
  {
    id: '5',
    title: 'Structuration d\'un fonds d\'investissement',
    description: 'Création et structuration d\'un fonds d\'investissement de 100M$ dédié aux PME africaines innovantes.',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=2000',
    client: 'Africa Growth Fund',
    sector: 'Private Equity',
    impact: 'Levée de fonds réussie, 15 investissements réalisés la première année, création de plus de 2000 emplois indirects.',
    period: '2022 - 2023',
    pole: 'Finance & Investissement'
  },
  {
    id: '6',
    title: 'Optimisation fiscale d\'un groupe multinational',
    description: 'Restructuration fiscale complète pour optimiser la charge fiscale tout en respectant les réglementations locales et internationales.',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2000',
    client: 'MultiCorp Africa',
    sector: 'Conglomérat',
    impact: 'Économies fiscales de 25% réalisées, mise en conformité avec les standards OCDE, amélioration de la trésorerie.',
    period: '2023',
    pole: 'Finance & Investissement'
  },

  // Transformation & Innovation
  {
    id: '7',
    title: 'Innovation technologique pour la distribution',
    description: 'Mise en place d\'une plateforme de distribution innovante utilisant l\'IA et l\'IoT pour optimiser la chaîne logistique.',
    imageUrl: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=2000',
    client: 'DistribuTech',
    sector: 'Distribution & Logistique',
    impact: 'Réduction de 35% des coûts logistiques, amélioration de 50% des délais de livraison, couverture étendue à 15 nouvelles villes.',
    period: '2022 - 2023',
    pole: 'Transformation & Innovation'
  },
  {
    id: '8',
    title: 'Digitalisation des processus d\'une administration publique',
    description: 'Transformation digitale complète des services publics avec dématérialisation des procédures et création d\'un guichet unique numérique.',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2000',
    client: 'Ministère de l\'Économie Numérique',
    sector: 'Secteur Public',
    impact: 'Réduction de 80% des délais de traitement, économies de 40M$ en coûts administratifs, satisfaction citoyenne à 85%.',
    period: '2022 - 2024',
    pole: 'Transformation & Innovation'
  },
  {
    id: '9',
    title: 'Plateforme e-commerce B2B innovante',
    description: 'Développement d\'une marketplace B2B révolutionnaire connectant producteurs locaux et acheteurs internationaux.',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2000',
    client: 'AfriTrade Connect',
    sector: 'E-commerce',
    impact: '5000 vendeurs onboardés, 50M$ de transactions facilitées la première année, présence dans 20 pays.',
    period: '2023',
    pole: 'Transformation & Innovation'
  },
  {
    id: '10',
    title: 'Centre d\'innovation et incubateur tech',
    description: 'Création d\'un hub d\'innovation technologique avec programmes d\'incubation et d\'accélération pour startups.',
    imageUrl: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?q=80&w=2000',
    client: 'Tech Hub Africa',
    sector: 'Innovation & Tech',
    impact: '50 startups incubées, 10M$ levés collectivement, 500 emplois tech créés, 3 licornes en développement.',
    period: '2021 - 2023',
    pole: 'Transformation & Innovation'
  }
]

let newsItems: NewsItem[] = [
  {
    id: '1',
    title: 'Aliz Strategy lance un nouveau programme d\'accélération',
    excerpt: 'Un programme innovant pour accompagner les startups africaines dans leur croissance et leur expansion internationale.',
    content: 'Aliz Strategy est fière d\'annoncer le lancement de son nouveau programme d\'accélération destiné aux startups africaines les plus prometteuses. Ce programme de 6 mois offre un accompagnement personnalisé, un accès à un réseau d\'investisseurs internationaux, et des ressources pour faciliter l\'expansion sur de nouveaux marchés.\n\nLe programme comprend:\n- Mentorat par des experts sectoriels\n- Ateliers de formation intensifs\n- Mise en relation avec des investisseurs\n- Support juridique et réglementaire\n- Accès à des espaces de travail dans 5 pays africains\n\nLes candidatures sont ouvertes jusqu\'au 31 mars 2024.',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000',
    category: 'Innovation',
    author: 'Aliz Strategy',
    date: '2024-01-25',
    readTime: '5 min',
    featured: true
  },
  {
    id: '2',
    title: 'Partenariat stratégique avec la Banque Africaine de Développement',
    excerpt: 'Aliz Strategy devient partenaire officiel de la BAD pour le programme de transformation des PME africaines.',
    content: 'Nous sommes honorés d\'annoncer notre partenariat avec la Banque Africaine de Développement pour co-piloter le programme de transformation des PME africaines. Cette collaboration vise à accompagner 1000 PME sur les 3 prochaines années dans leur parcours de croissance et de digitalisation.\n\nLe programme offre:\n- Diagnostic gratuit de maturité digitale\n- Plan de transformation personnalisé\n- Accès à des financements adaptés\n- Formation des équipes dirigeantes\n- Suivi sur 12 mois\n\nCette initiative s\'inscrit dans notre vision de contribuer activement au développement économique du continent.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2000',
    category: 'Partenariat',
    author: 'Aliz Strategy',
    date: '2024-01-20',
    readTime: '4 min'
  },
  {
    id: '3',
    title: 'Étude exclusive : L\'impact de l\'IA sur les entreprises africaines',
    excerpt: 'Notre dernière étude révèle que 65% des entreprises africaines prévoient d\'investir massivement dans l\'IA d\'ici 2025.',
    content: 'Aliz Strategy publie aujourd\'hui une étude approfondie sur l\'adoption de l\'intelligence artificielle par les entreprises africaines. Basée sur une enquête menée auprès de 500 dirigeants d\'entreprises dans 15 pays africains, l\'étude révèle des tendances encourageantes.\n\nPrincipaux enseignements:\n- 65% prévoient des investissements significatifs en IA\n- Les secteurs bancaire et télécom sont en tête\n- Le manque de compétences reste le principal frein\n- ROI moyen attendu: 35% sur 2 ans\n\nL\'étude complète est disponible en téléchargement gratuit sur notre site.',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2000',
    category: 'Étude',
    author: 'Aliz Strategy Research',
    date: '2024-01-15',
    readTime: '6 min'
  }
]

export async function GET() {
  return NextResponse.json({ 
    realisations: realisations,
    news: newsItems 
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const type = body.type || 'news'
    
    if (type === 'realisation') {
      if (!body.title || !body.description || !body.client || !body.pole) {
        return NextResponse.json(
          { error: 'Les champs titre, description, client et pôle sont requis' },
          { status: 400 }
        )
      }
      
      const newRealisation: Realisation = {
        id: Date.now().toString(),
        title: body.title,
        description: body.description,
        imageUrl: body.imageUrl || 'https://placehold.co/800x600/cccccc/ffffff?text=Réalisation',
        client: body.client,
        sector: body.sector || '',
        impact: body.impact || '',
        period: body.period || new Date().getFullYear().toString(),
        pole: body.pole
      }
      
      realisations.unshift(newRealisation)
      
      return NextResponse.json({ 
        success: true, 
        item: newRealisation 
      })
    } else {
      if (!body.title || !body.excerpt) {
        return NextResponse.json(
          { error: 'Le titre et l\'extrait sont requis' },
          { status: 400 }
        )
      }
      
      const newItem: NewsItem = {
        id: Date.now().toString(),
        title: body.title,
        excerpt: body.excerpt,
        content: body.content || '',
        imageUrl: body.imageUrl || 'https://placehold.co/800x600/cccccc/ffffff?text=Article',
        category: body.category || 'Actualité',
        author: body.author || 'Aliz Strategy',
        date: new Date().toISOString().split('T')[0],
        readTime: body.readTime || '5 min',
        featured: body.featured || false
      }
      
      newsItems.unshift(newItem)
      
      return NextResponse.json({ 
        success: true, 
        item: newItem 
      })
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const type = body.type || 'news'
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'L\'ID est requis' },
        { status: 400 }
      )
    }
    
    if (type === 'realisation') {
      const index = realisations.findIndex(item => item.id === body.id)
      
      if (index === -1) {
        return NextResponse.json(
          { error: 'Réalisation non trouvée' },
          { status: 404 }
        )
      }
      
      realisations[index] = {
        ...realisations[index],
        ...body,
        id: body.id
      }
      
      return NextResponse.json({ 
        success: true, 
        item: realisations[index] 
      })
    } else {
      const index = newsItems.findIndex(item => item.id === body.id)
      
      if (index === -1) {
        return NextResponse.json(
          { error: 'Article non trouvé' },
          { status: 404 }
        )
      }
      
      newsItems[index] = {
        ...newsItems[index],
        ...body,
        id: body.id
      }
      
      return NextResponse.json({ 
        success: true, 
        item: newsItems[index] 
      })
    }
  } catch (error) {
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
    const type = searchParams.get('type') || 'news'
    
    if (!id) {
      return NextResponse.json(
        { error: 'L\'ID est requis' },
        { status: 400 }
      )
    }
    
    if (type === 'realisation') {
      const index = realisations.findIndex(item => item.id === id)
      
      if (index === -1) {
        return NextResponse.json(
          { error: 'Réalisation non trouvée' },
          { status: 404 }
        )
      }
      
      realisations.splice(index, 1)
    } else {
      const index = newsItems.findIndex(item => item.id === id)
      
      if (index === -1) {
        return NextResponse.json(
          { error: 'Article non trouvé' },
          { status: 404 }
        )
      }
      
      newsItems.splice(index, 1)
    }
    
    return NextResponse.json({ 
      success: true 
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
}