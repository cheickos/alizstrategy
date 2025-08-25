'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import SectionVideo from '../SectionVideo'

interface Service {
  id: string
  title: string
  description: string
  icon: string
  detailedContent?: string
  imageUrl?: string
}


interface ExpertiseCategory {
  id: string
  title: string
  subtitle: string
  icon: string
  color: string
  services: Service[]
}

interface ExpertisePageContent {
  mainTitle: string
  mainDescription: string
  categories: ExpertiseCategory[]
  backgroundColor?: string
}

const backgroundColors: Record<string, string> = {
  'white': 'bg-white',
  'gray-50': 'bg-gray-50',
  'blue-50': 'bg-blue-50',
  'green-50': 'bg-green-50',
  'purple-50': 'bg-purple-50',
  'yellow-50': 'bg-yellow-50',
  'indigo-50': 'bg-indigo-50'
}

const categoryColors: Record<string, string> = {
  'blue': 'text-blue-600',
  'teal': 'text-teal-600',
  'indigo': 'text-indigo-600'
}

const serviceData: Record<string, Service> = {
  '1': { 
    id: '1',
    title: 'Conseil en Stratégie',
    description: 'Accompagnement stratégique pour définir et atteindre vos objectifs d\'entreprise',
    icon: 'fa-chess-queen',
    detailedContent: `<p>Nous commençons chaque mission par une analyse exhaustive de votre environnement concurrentiel, de vos forces internes et des opportunités de marché. Notre objectif est de co-construire avec vous une vision claire et une feuille de route actionnable pour atteindre vos ambitions.</p><ul class="list-disc list-inside space-y-2 mt-4"><li><b>Positionnement Stratégique :</b> Définir un positionnement clair et distinctif sur votre marché pour maximiser votre pertinence et votre attractivité.</li><li><b>Stratégies de Croissance :</b> Conseiller sur les trajectoires de croissance les plus prometteuses, qu'il s'agisse de diversification, d'expansion géographique, de pénétration de marché ou de développement de nouveaux produits.</li><li><b>Analyse Concurrentielle :</b> Fournir une intelligence de marché pointue pour anticiper les mouvements de vos concurrents et identifier les opportunités de différenciation.</li></ul>`
  },
  '2': { 
    id: '2',
    title: 'Transformation Digitale & Innovation',
    description: 'Accélérez votre transformation numérique et innovez dans vos processus',
    icon: 'fa-rocket',
    detailedContent: `<p>Face à la révolution numérique, la transformation digitale est devenue un impératif de compétitivité. Nous vous aidons à intégrer les technologies et les nouvelles méthodes de travail pour rendre votre organisation plus agile, plus efficace et plus orientée client.</p><ul class="list-disc list-inside space-y-2 mt-4"><li><b>Diagnostic Numérique :</b> Évaluation de votre maturité digitale et identification des chantiers prioritaires pour aligner votre technologie sur vos objectifs stratégiques.</li><li><b>Feuille de Route Digitale :</b> Conception d'un plan d'action détaillé pour la mise en œuvre de solutions digitales (CRM, ERP, plateformes collaboratives, etc.).</li><li><b>Culture de l'Innovation :</b> Accompagnement dans la mise en place d'une culture d'innovation continue pour favoriser l'émergence de nouvelles idées et l'adaptation rapide aux changements du marché.</li></ul>`
  },
  '3': { 
    id: '3',
    title: 'Mise en Relation d\'Affaires',
    description: 'Développez votre réseau et créez des opportunités d\'affaires',
    icon: 'fa-handshake',
    detailedContent: `<p>Disposer d'un réseau professionnel solide est un facteur de succès déterminant. Forts de notre carnet d'adresses étendu en Côte d'Ivoire et à l'international, nous agissons comme un facilitateur pour créer des synergies et des opportunités de croissance pour votre entreprise.</p><ul class="list-disc list-inside space-y-2 mt-4"><li><b>Développement du Réseau :</b> Mises en relation ciblées avec des partenaires potentiels, des investisseurs, des clients clés et des experts sectoriels.</li><li><b>Facilitation des Partenariats :</b> Organisation de rencontres B2B, de tables rondes et d'événements de networking pour catalyser des collaborations fructueuses.</li><li><b>Accès aux Marchés :</b> Soutien dans vos démarches d'expansion en vous connectant aux bons interlocuteurs dans de nouvelles zones géographiques.</li></ul>`
  },
  '4': { 
    id: '4',
    title: 'Recherche de Financement',
    description: 'Trouvez les financements adaptés à votre projet de croissance',
    icon: 'fa-coins',
    detailedContent: `<p>Nous vous accompagnons dans la recherche de financements adaptés à chaque étape de votre développement, de l'amorçage à l'expansion. Notre expertise vous permet de structurer votre demande et de vous adresser aux bonnes sources de capitaux.</p><ul class="list-disc list-inside space-y-2 mt-4"><li><b>Identification des Sources :</b> Accès à un réseau de capital-investisseurs (Venture Capital), de Business Angels, de fonds de dette et d'institutions de financement.</li><li><b>Préparation des Dossiers :</b> Aide à la réalisation de business plans convaincants, de pitch decks percutants et de prévisionnels financiers robustes.</li><li><b>Négociation :</b> Assistance lors des négociations des termes de l'investissement pour défendre au mieux vos intérêts.</li></ul>`
  },
  '5': { 
    id: '5',
    title: 'Investissements & Ingénierie Financière',
    description: 'Optimisez votre structure financière et vos investissements',
    icon: 'fa-chart-line',
    detailedContent: `<p>Un service complet pour optimiser votre structure financière, gérer les risques et prendre les meilleures décisions d'investissement. Nous apportons une expertise technique pour sécuriser et valoriser votre patrimoine financier.</p><ul class="list-disc list-inside space-y-2 mt-4"><li><b>Planification Financière :</b> Élaboration de plans financiers à long terme, modélisation de scénarios et optimisation de la structure du capital.</li><li><b>Gestion des Risques Financiers :</b> Identifier, évaluer et couvrir les risques de marché, de crédit et de liquidité.</li><li><b>Conseil en Fusions-Acquisitions (M&A) :</b> Accompagnement dans les opérations de rachat, de cession ou de fusion d'entreprises.</li></ul>`
  },
  '6': { 
    id: '6',
    title: 'Prise de Participation dans le Capital',
    description: 'Bénéficiez d\'un partenaire investisseur engagé dans votre succès',
    icon: 'fa-handshake',
    detailedContent: `<p>Au-delà du conseil, nous proposons un véritable partenariat stratégique en investissant directement dans les entreprises à fort potentiel. Nous devenons un actionnaire engagé, apportant non seulement des capitaux mais aussi notre expertise et notre réseau.</p><ul class="list-disc list-inside space-y-2 mt-4"><li><b>Investissement Direct :</b> Injection de fonds propres pour financer la croissance, l'innovation ou des projets d'expansion.</li><li><b>Partenariat Actif :</b> Implication dans la gouvernance de l'entreprise pour apporter un soutien stratégique et opérationnel continu.</li><li><b>Vision à Long Terme :</b> Alignement de nos intérêts avec ceux des fondateurs pour construire une croissance durable et créatrice de valeur.</li></ul>`
  },
  '7': { 
    id: '7',
    title: 'Élaboration et Gestion de Projets',
    description: 'Pilotez vos projets avec méthode et efficacité',
    icon: 'fa-project-diagram',
    detailedContent: `<p>Un service complet de Project Management pour assurer la réussite de vos projets stratégiques, de l'idée à la clôture. Nous appliquons des méthodologies rigoureuses (Agile, PMP) pour garantir le respect des délais, des budgets et des objectifs de qualité.</p><ul class="list-disc list-inside space-y-2 mt-4"><li><b>Planification Détaillée :</b> Définition des objectifs, du périmètre, des livrables et des ressources pour créer une feuille de route commune.</li><li><b>Suivi et Pilotage :</b> Mise en place d'indicateurs de performance (KPIs) et de tableaux de bord pour un suivi en temps réel de l'avancement.</li><li><b>Gestion des Risques :</b> Analyse proactive des risques potentiels et élaboration de plans de mitigation pour éviter les dérapages.</li></ul>`
  },
  '8': { 
    id: '8',
    title: 'Formation et Développement des Compétences',
    description: 'Renforcez les compétences de vos équipes',
    icon: 'fa-graduation-cap',
    detailedContent: `<p>Le développement du capital humain est un vecteur majeur de performance durable. Nous concevons et animons des programmes de formation sur mesure pour renforcer les compétences de vos équipes et accompagner le changement.</p><ul class="list-disc list-inside space-y-2 mt-4"><li><b>Analyse des Besoins :</b> Audit des compétences existantes et identification des besoins futurs en lien avec votre stratégie.</li><li><b>Formations sur Mesure :</b> Création de parcours de formation adaptés à votre contexte sur des thèmes comme le leadership, la gestion de projet, la vente, le marketing digital, etc.</li><li><b>Coaching Individuel et d'Équipe :</b> Accompagnement personnalisé des managers et de leurs équipes pour améliorer la performance collective et individuelle.</li></ul>`
  },
  '9': { 
    id: '9',
    title: 'Conseil en Gestion d\'Entreprise',
    description: 'Améliorez votre performance opérationnelle',
    icon: 'fa-briefcase',
    detailedContent: `<p>Notre approche holistique et personnalisée couvre l'ensemble des dimensions opérationnelles de votre entreprise pour en améliorer l'efficacité et la rentabilité. Nous agissons comme un partenaire de confiance pour vos décisions managériales.</p><ul class="list-disc list-inside space-y-2 mt-4"><li><b>Optimisation des Processus :</b> Analyse et refonte de vos processus métiers pour gagner en efficacité et réduire les coûts.</li><li><b>Gestion et Leadership :</b> Coaching de dirigeants, amélioration des pratiques managériales et aide à la structuration organisationnelle.</li><li><b>Stratégie de Communication et Marketing :</b> Définition de votre image de marque, de vos messages clés et de vos plans d'action marketing pour accroître votre visibilité.</li></ul>`
  },
  '10':{ 
    id: '10',
    title: 'Trading et Investissements Boursiers',
    description: 'Naviguez avec succès sur les marchés financiers',
    icon: 'fa-chart-area',
    detailedContent: `<p>Nous accompagnons entreprises et investisseurs particuliers pour naviguer avec succès sur les marchés financiers. Notre expertise couvre les marchés d'actions, d'obligations et de matières premières, avec un focus sur la gestion des risques et la performance à long terme.</p><ul class="list-disc list-inside space-y-2 mt-4"><li><b>Conseil en Investissements :</b> Recommandations personnalisées basées sur votre profil de risque et vos objectifs financiers.</li><li><b>Gestion de Portefeuille :</b> Structuration et suivi de portefeuilles d'investissement diversifiés pour optimiser le couple rendement/risque.</li><li><b>Formation au Trading :</b> Programmes d'initiation et de perfectionnement aux techniques de trading et d'analyse des marchés financiers.</li></ul>`
  },
}

export default function ExpertisePage() {
  const [content, setContent] = useState<ExpertisePageContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  const fetchExpertiseData = () => {
    fetch('/api/admin/expertise')
      .then(res => res.json())
      .then(data => {
        if (data.content) {
          setContent(data.content)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchExpertiseData()
    
    // Rafraîchir les données toutes les 5 secondes
    const interval = setInterval(fetchExpertiseData, 5000)
    
    // Nettoyer l'intervalle au démontage
    return () => clearInterval(interval)
  }, [])

  const openModal = (service: Service) => {
    // Essayer d'abord d'obtenir le contenu détaillé du serviceData
    const detailedService = serviceData[service.id]
    if (detailedService) {
      setSelectedService({ ...service, detailedContent: detailedService.detailedContent })
    } else {
      setSelectedService(service)
    }
  }

  const closeModal = () => {
    setSelectedService(null)
  }

  if (loading || !content) {
    return (
      <section id="expertise" className="bg-white p-8 rounded-lg shadow-md">
        <div className="container mx-auto px-6 flex justify-center items-center min-h-[400px]">
          <i className="fas fa-spinner fa-spin text-4xl text-gray-400"></i>
        </div>
      </section>
    )
  }

  return (
    <>
      <section id="expertise" className={`${backgroundColors[content.backgroundColor || 'white'] || 'bg-white'} p-8 rounded-lg shadow-md`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl lg:text-4xl font-bold section-title">{content.mainTitle}</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              {content.mainDescription}
            </p>
            <SectionVideo section="expertise" className="mt-8" />
          </div>
          
          <div className="space-y-16">
            {content.categories.map((category) => (
              <div key={category.id} data-aos="fade-up">
                <h3 className={`text-2xl font-semibold ${categoryColors[category.color] || 'text-gray-600'} mb-8 text-center`}>
                  <i className={`fas ${category.icon} mr-3`}></i>{category.title}
                </h3>
                <div className={`grid md:grid-cols-2 ${category.services.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-8`}>
                  {category.services.map((service) => (
                    <div 
                      key={service.id}
                      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group" 
                      onClick={() => openModal(service)}
                    >
                      {service.imageUrl ? (
                        <div className="relative h-48 overflow-hidden">
                          <Image 
                            src={service.imageUrl} 
                            alt={service.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <i className={`fas ${service.icon} text-2xl mb-2`}></i>
                            <p className="text-sm font-medium">En savoir plus</p>
                          </div>
                        </div>
                      ) : (
                        <div className={`h-48 ${categoryColors[category.color] ? categoryColors[category.color].replace('text-', 'bg-').replace('600', '100') : 'bg-gray-100'} flex items-center justify-center`}>
                          <i className={`fas ${service.icon} ${categoryColors[category.color] || 'text-gray-600'} text-5xl opacity-50`}></i>
                        </div>
                      )}
                      <div className="p-6">
                        <h4 className="font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{service.title}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedService && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedService.imageUrl && (
              <div className="relative h-64 overflow-hidden">
                <Image 
                  src={selectedService.imageUrl} 
                  alt={selectedService.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-8 right-8">
                  <h3 className="text-3xl font-bold text-white mb-2">{selectedService.title}</h3>
                  <p className="text-white/90 text-lg">{selectedService.description}</p>
                </div>
              </div>
            )}
            <div className="p-8">
              {!selectedService.imageUrl && (
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">{selectedService.title}</h3>
                  <button 
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-800 text-2xl"
                  >
                    &times;
                  </button>
                </div>
              )}
              {selectedService.imageUrl && (
                <button 
                  onClick={closeModal}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 text-gray-700 hover:text-gray-900 shadow-lg transition-all"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              )}
              <div 
                className="text-gray-600 space-y-4"
                dangerouslySetInnerHTML={{ __html: selectedService.detailedContent || '' }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}