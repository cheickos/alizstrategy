import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'

interface Document {
  id: string
  title: string
  fileUrl: string
  type: string
  status?: 'gratuit' | 'payant'
  description?: string
  videoUrl?: string
  imageUrl?: string
}

interface KitItem {
  id: string
  title: string
  description: string
  longDescription?: string
  icon: string
  color: string
  type: 'files' | 'platforms' | 'formations'
  documents: Document[]
  videoUrl?: string
  imageUrl?: string
}

interface KitCategory {
  id: string
  name: string
  color: string
  icon: string
  items: KitItem[]
}

// Path to the kit entreprise data file
const dataFilePath = path.join(process.cwd(), 'data', 'kit-entreprise.json')

// Default kit content
const defaultKitContent = {
  mainTitle: 'Kit de l\'Entrepreneur',
  mainDescription: 'Des outils et ressources essentiels pour vous accompagner dans votre parcours entrepreneurial. Accédez à nos plateformes et téléchargez nos modèles pratiques.',
  categories: [
    {
      id: '1',
      name: 'Stratégie & Croissance',
      color: 'blue',
      icon: 'fa-chess-queen',
      items: [
        {
          id: '1-1',
          title: 'Business Plan & Stratégie',
          description: 'Outils pour structurer votre vision stratégique',
          longDescription: 'Découvrez notre collection complète d\'outils stratégiques conçus pour vous aider à élaborer un business plan solide et une stratégie d\'entreprise gagnante. Ces ressources ont été développées par nos experts et sont régulièrement mises à jour pour refléter les meilleures pratiques du marché.',
          icon: 'fa-chart-line',
          color: 'blue',
          type: 'files' as const,
          videoUrl: 'https://www.youtube.com/watch?v=example1',
          imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
          documents: [
            {
              id: '1',
              title: 'Modèle Business Plan Excel',
              fileUrl: '/documents/business-plan-template.xlsx',
              type: 'excel',
              status: 'gratuit' as const,
              description: 'Template Excel complet avec projections financières automatisées',
              videoUrl: 'https://www.youtube.com/watch?v=bp-excel'
            },
            {
              id: '2',
              title: 'Guide de rédaction Business Plan',
              fileUrl: '/documents/guide-business-plan.pdf',
              type: 'pdf',
              status: 'gratuit' as const
            },
            {
              id: '3',
              title: 'Canvas Stratégique Premium',
              fileUrl: '/documents/canvas-strategique.pdf',
              type: 'pdf',
              status: 'payant' as const
            }
          ]
        },
        {
          id: '1-2',
          title: 'Outils d\'Analyse de Marché',
          description: 'Plateformes pour analyser votre marché',
          longDescription: 'Accédez aux meilleures plateformes d\'analyse de marché pour comprendre votre environnement concurrentiel, identifier les opportunités et prendre des décisions éclairées basées sur des données fiables.',
          icon: 'fa-search-dollar',
          color: 'blue',
          type: 'platforms' as const,
          imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
          documents: [
            {
              id: '1',
              title: 'Google Trends',
              fileUrl: 'https://trends.google.com',
              type: 'link',
              status: 'gratuit' as const
            },
            {
              id: '2',
              title: 'SEMrush',
              fileUrl: 'https://www.semrush.com',
              type: 'link',
              status: 'payant' as const
            },
            {
              id: '3',
              title: 'Statista',
              fileUrl: 'https://www.statista.com',
              type: 'link',
              status: 'payant' as const
            }
          ]
        },
        {
          id: '1-3',
          title: 'Formations Stratégiques',
          description: 'Formations pour développer vos compétences stratégiques',
          icon: 'fa-graduation-cap',
          color: 'blue',
          type: 'formations' as const,
          documents: [
            {
              id: '1',
              title: 'Leadership Stratégique',
              fileUrl: 'https://formation-leadership.com',
              type: 'link',
              status: 'payant' as const
            },
            {
              id: '2',
              title: 'Guide Formation Business Plan',
              fileUrl: '/documents/guide-formation-business-plan.pdf',
              type: 'pdf',
              status: 'gratuit' as const
            },
            {
              id: '3',
              title: 'Masterclass Croissance',
              fileUrl: 'https://masterclass-croissance.com',
              type: 'link',
              status: 'payant' as const
            }
          ]
        }
      ]
    },
    {
      id: '2',
      name: 'Finance & Investissement',
      color: 'green',
      icon: 'fa-coins',
      items: [
        {
          id: '2-1',
          title: 'Prévisionnel Financier',
          description: 'Modèles pour vos projections financières',
          icon: 'fa-calculator',
          color: 'green',
          type: 'files' as const,
          documents: [
            {
              id: '1',
              title: 'Modèle Prévisionnel Excel Complet',
              fileUrl: '/documents/previsionnel-financier.xlsx',
              type: 'excel',
              status: 'gratuit' as const
            },
            {
              id: '2',
              title: 'Tableau de bord financier Premium',
              fileUrl: '/documents/dashboard-financier.xlsx',
              type: 'excel',
              status: 'payant' as const
            },
            {
              id: '3',
              title: 'Calcul du seuil de rentabilité',
              fileUrl: '/documents/seuil-rentabilite.xlsx',
              type: 'excel',
              status: 'gratuit' as const
            }
          ]
        },
        {
          id: '2-2',
          title: 'Plateformes de Financement',
          description: 'Accès aux plateformes de financement',
          icon: 'fa-hand-holding-usd',
          color: 'green',
          type: 'platforms' as const,
          documents: [
            {
              id: '1',
              title: 'Bpifrance',
              fileUrl: 'https://www.bpifrance.fr',
              type: 'link',
              status: 'gratuit' as const
            },
            {
              id: '2',
              title: 'France Invest',
              fileUrl: 'https://www.franceinvest.eu',
              type: 'link',
              status: 'gratuit' as const
            },
            {
              id: '3',
              title: 'KissKissBankBank',
              fileUrl: 'https://www.kisskissbankbank.com',
              type: 'link',
              status: 'gratuit' as const
            }
          ]
        },
        {
          id: '2-3',
          title: 'Gestion & Comptabilité',
          description: 'Outils de gestion financière',
          icon: 'fa-file-invoice-dollar',
          color: 'green',
          type: 'files' as const,
          documents: [
            {
              id: '1',
              title: 'Modèle de facture',
              fileUrl: '/documents/modele-facture.xlsx',
              type: 'excel',
              status: 'gratuit' as const
            },
            {
              id: '2',
              title: 'Suivi de trésorerie Pro',
              fileUrl: '/documents/suivi-tresorerie.xlsx',
              type: 'excel',
              status: 'payant' as const
            }
          ]
        },
        {
          id: '2-4',
          title: 'Formations Financières',
          description: 'Formations pour maîtriser la finance d\'entreprise',
          icon: 'fa-graduation-cap',
          color: 'green',
          type: 'formations' as const,
          documents: [
            {
              id: '1',
              title: 'Formation Analyse Financière',
              fileUrl: 'https://formation-finance.com',
              type: 'link',
              status: 'payant' as const
            },
            {
              id: '2',
              title: 'Guide Levée de Fonds',
              fileUrl: '/documents/guide-levee-fonds.pdf',
              type: 'pdf',
              status: 'gratuit' as const
            },
            {
              id: '3',
              title: 'Webinaire Trading & Bourse',
              fileUrl: 'https://webinar-trading.com',
              type: 'link',
              status: 'payant' as const
            }
          ]
        }
      ]
    },
    {
      id: '3',
      name: 'Transformation & Innovation',
      color: 'purple',
      icon: 'fa-lightbulb',
      items: [
        {
          id: '3-1',
          title: 'Marketing Digital',
          description: 'Ressources pour votre présence en ligne',
          icon: 'fa-bullhorn',
          color: 'purple',
          type: 'files' as const,
          documents: [
            {
              id: '1',
              title: 'Stratégie Marketing Digital',
              fileUrl: '/documents/strategie-marketing.pdf',
              type: 'pdf',
              status: 'gratuit' as const
            },
            {
              id: '2',
              title: 'Calendrier éditorial Pro',
              fileUrl: '/documents/calendrier-editorial.xlsx',
              type: 'excel',
              status: 'payant' as const
            },
            {
              id: '3',
              title: 'Guide Réseaux Sociaux',
              fileUrl: '/documents/guide-reseaux-sociaux.pdf',
              type: 'pdf',
              status: 'gratuit' as const
            }
          ]
        },
        {
          id: '3-2',
          title: 'Outils Digitaux',
          description: 'Plateformes pour votre transformation digitale',
          icon: 'fa-digital-tachograph',
          color: 'purple',
          type: 'platforms' as const,
          documents: [
            {
              id: '1',
              title: 'Canva',
              fileUrl: 'https://www.canva.com',
              type: 'link',
              status: 'gratuit' as const
            },
            {
              id: '2',
              title: 'Mailchimp',
              fileUrl: 'https://mailchimp.com',
              type: 'link',
              status: 'gratuit' as const
            },
            {
              id: '3',
              title: 'Hootsuite',
              fileUrl: 'https://hootsuite.com',
              type: 'link',
              status: 'payant' as const
            },
            {
              id: '4',
              title: 'Google Analytics',
              fileUrl: 'https://analytics.google.com',
              type: 'link',
              status: 'gratuit' as const
            }
          ]
        },
        {
          id: '3-3',
          title: 'Gestion de Projet',
          description: 'Outils pour piloter vos projets',
          icon: 'fa-tasks',
          color: 'purple',
          type: 'platforms' as const,
          documents: [
            {
              id: '1',
              title: 'Trello',
              fileUrl: 'https://trello.com',
              type: 'link',
              status: 'gratuit' as const
            },
            {
              id: '2',
              title: 'Asana',
              fileUrl: 'https://asana.com',
              type: 'link',
              status: 'gratuit' as const
            },
            {
              id: '3',
              title: 'Monday.com',
              fileUrl: 'https://monday.com',
              type: 'link',
              status: 'payant' as const
            }
          ]
        },
        {
          id: '3-4',
          title: 'Formations Innovation',
          description: 'Formations pour maîtriser l\'innovation',
          icon: 'fa-graduation-cap',
          color: 'purple',
          type: 'formations' as const,
          documents: [
            {
              id: '1',
              title: 'Formation Transformation Digitale',
              fileUrl: 'https://formation-digitale.com',
              type: 'link',
              status: 'payant' as const
            },
            {
              id: '2',
              title: 'Module Innovation Management',
              fileUrl: '/documents/module-innovation.pdf',
              type: 'pdf',
              status: 'gratuit' as const
            },
            {
              id: '3',
              title: 'Webinaire Design Thinking',
              fileUrl: 'https://webinar-design-thinking.com',
              type: 'link',
              status: 'payant' as const
            }
          ]
        }
      ]
    }
  ]
}

// Helper functions to read and write kit content
async function readKitContent(): Promise<any> {
  try {
    const data = await readFile(dataFilePath, 'utf-8')
    const parsed = JSON.parse(data)
    // If the file is empty or doesn't have categories, return default content
    if (!parsed.categories || parsed.categories.length === 0) {
      await writeKitContent(defaultKitContent)
      return defaultKitContent
    }
    return parsed
  } catch (error) {
    console.error('Error reading kit entreprise file:', error)
    // Create the file with default content if it doesn't exist
    await writeKitContent(defaultKitContent)
    return defaultKitContent
  }
}

async function writeKitContent(content: any): Promise<void> {
  try {
    await writeFile(dataFilePath, JSON.stringify(content, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error writing kit entreprise file:', error)
    throw error
  }
}

export async function GET() {
  try {
    const kitContent = await readKitContent()
    return NextResponse.json({ content: kitContent })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la lecture des données' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Update kit content
    const newContent = body.content || await readKitContent()
    await writeKitContent(newContent)
    
    return NextResponse.json({ 
      success: true, 
      content: newContent 
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Update kit content
    const newContent = body.content || await readKitContent()
    await writeKitContent(newContent)
    
    return NextResponse.json({ 
      success: true, 
      content: newContent 
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    )
  }
}