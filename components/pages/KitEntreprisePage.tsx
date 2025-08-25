'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import KitItemModal from '../KitItemModal'
import SectionVideo from '../SectionVideo'

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

interface KitContent {
  mainTitle: string
  mainDescription: string
  categories: KitCategory[]
}

interface KitEntreprisePageProps {
  onPageChange: (page: string) => void
}

export default function KitEntreprisePage({ onPageChange }: KitEntreprisePageProps) {
  const [content, setContent] = useState<KitContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedItem, setSelectedItem] = useState<KitItem | null>(null)

  const fetchKitData = () => {
    fetch('/api/admin/kit-entreprise')
      .then(res => res.json())
      .then(data => {
        if (data.content) {
          setContent(data.content)
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchKitData()
    
    // Rafraîchir les données toutes les 5 secondes
    const interval = setInterval(fetchKitData, 5000)
    
    // Nettoyer l'intervalle au démontage
    return () => clearInterval(interval)
  }, [])

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      'blue': { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-300' },
      'green': { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-300' },
      'purple': { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-300' }
    }
    return colors[color] || { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300' }
  }

  const handleAction = (document: Document) => {
    if (document.type === 'link') {
      window.open(document.fileUrl, '_blank')
    } else {
      // Pour les documents, simuler un téléchargement
      const link = window.document.createElement('a')
      link.href = document.fileUrl
      link.download = document.title
      link.click()
    }
  }

  if (loading || !content) {
    return (
      <section id="kit-entreprise" className="bg-white p-8 rounded-lg shadow-md">
        <div className="container mx-auto px-6 flex justify-center items-center min-h-[400px]">
          <i className="fas fa-spinner fa-spin text-4xl text-gray-400"></i>
        </div>
      </section>
    )
  }

  // Types disponibles
  const types = [
    { value: 'all', label: 'Tous les types', icon: 'fa-th' },
    { value: 'files', label: 'Outils téléchargeables', icon: 'fa-download' },
    { value: 'platforms', label: 'Plateformes en ligne', icon: 'fa-external-link-alt' },
    { value: 'formations', label: 'Formations', icon: 'fa-graduation-cap' }
  ]

  // Filtrer les catégories et items
  const displayCategories = selectedCategory === 'all' 
    ? content.categories 
    : content.categories.filter(cat => cat.id === selectedCategory)
  
  // Fonction pour filtrer les items par type
  const filterItemsByType = (items: KitItem[]) => {
    if (selectedType === 'all') return items
    return items.filter(item => item.type === selectedType)
  }

  const getDefaultImage = (item: KitItem) => {
    const typeImages: Record<string, string> = {
      'files': 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=400&fit=crop',
      'platforms': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
      'formations': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop'
    }
    return typeImages[item.type] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=400&fit=crop'
  }

  const getCategoryGradient = (color: string) => {
    const gradients: Record<string, string> = {
      'blue': 'from-blue-400 via-blue-500 to-blue-600',
      'green': 'from-green-400 via-green-500 to-green-600',
      'purple': 'from-purple-400 via-purple-500 to-purple-600'
    }
    return gradients[color] || 'from-gray-400 via-gray-500 to-gray-600'
  }

  return (
    <>
      <section id="kit-entreprise" className="bg-gradient-to-br from-gray-50 via-white to-gray-50 p-8 rounded-lg shadow-md">
        <div className="container mx-auto px-6">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl lg:text-4xl font-bold section-title">
            {content.mainTitle}
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            {content.mainDescription}
          </p>
          <SectionVideo section="kit-entreprise" className="mt-8" />
        </div>

        {/* Filtres par catégorie */}
        <div className="mb-8" data-aos="fade-up">
          <p className="text-center text-sm font-medium text-gray-700 mb-4">Pôles d'expertise</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                setSelectedCategory('all')
                setSelectedType('all')
              }}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-gray-800 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400'
              }`}
            >
              <i className="fas fa-th-large mr-2"></i>
              Tous les pôles
            </button>
            {content.categories.map((category, index) => {
              const colorClasses = getColorClasses(category.color)
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id)
                    setSelectedType('all')
                  }}
                  className={`px-6 py-3 rounded-full font-medium transition-all transform hover:scale-105 ${
                    selectedCategory === category.id
                      ? `bg-gradient-to-r ${getCategoryGradient(category.color)} text-white shadow-xl`
                      : `bg-white ${colorClasses.text} border-2 ${colorClasses.border} hover:${colorClasses.bg} hover:shadow-lg`
                  }`}
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                >
                  <i className={`fas ${category.icon} mr-2 ${selectedCategory === category.id ? 'animate-pulse' : ''}`}></i>
                  {category.name}
                </button>
              )
            })}
          </div>
        </div>
        
        {/* Filtres par type */}
        <div className="mb-12" data-aos="fade-up">
          <p className="text-center text-sm font-medium text-gray-700 mb-4">Types de ressources</p>
          <div className="flex flex-wrap justify-center gap-3">
            {types.map((type, index) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all transform hover:scale-105 ${
                  selectedType === type.value
                    ? 'bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300 hover:border-gray-400'
                }`}
                data-aos="fade-up"
                data-aos-delay={index * 50}
              >
                <i className={`fas ${type.icon} mr-2`}></i>
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Catégories et items */}
        <div className="space-y-16">
          {displayCategories.map(category => {
            const categoryColors = getColorClasses(category.color)
            return (
              <div key={category.id} data-aos="fade-up">
                <div className={`mb-8 text-center`} data-aos="fade-down">
                  <h3 className={`text-2xl font-bold ${categoryColors.text} mb-4 relative inline-block`}>
                    <i className={`fas ${category.icon} mr-3`}></i>
                    {category.name}
                    <div className={`absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r ${getCategoryGradient(category.color)} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
                  </h3>
                  <div className={`w-32 h-1.5 bg-gradient-to-r ${getCategoryGradient(category.color)} mx-auto rounded-full mt-4`}></div>
                </div>

                {/* Grille d'items avec design card moderne */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterItemsByType(category.items).map((item, index) => {
                    const itemColors = getColorClasses(item.color)
                    return (
                      <div 
                        key={item.id} 
                        className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group cursor-pointer transform hover:-translate-y-2"
                        onClick={() => setSelectedItem(item)}
                        data-aos="zoom-in-up"
                        data-aos-delay={index * 100}
                      >
                        {/* Image de couverture avec fallback */}
                        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = getDefaultImage(item)
                              }}
                            />
                          ) : (
                            <div className="w-full h-full relative">
                              <Image
                                src={getDefaultImage(item)}
                                alt={item.title}
                                fill
                                className="object-cover opacity-70 group-hover:scale-110 transition-transform duration-700 ease-out"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className={`w-24 h-24 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform duration-500`}>
                                  <i className={`fas ${item.icon} ${itemColors.text} text-4xl`}></i>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Overlay avec infos */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <div className="absolute bottom-4 left-4 right-4 text-white">
                              <p className="text-sm font-medium">
                                <i className="fas fa-mouse-pointer mr-2"></i>
                                Cliquez pour explorer
                              </p>
                            </div>
                          </div>

                          {/* Badges avec animations */}
                          <div className="absolute top-4 right-4 flex flex-col gap-2">
                            {item.videoUrl && (
                              <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center shadow-lg transform translate-x-20 group-hover:translate-x-0 transition-transform duration-500 delay-100">
                                <i className="fab fa-youtube mr-1 animate-pulse"></i>
                                Vidéo
                              </div>
                            )}
                            <div className={`${
                              item.type === 'files' ? 'bg-blue-600' :
                              item.type === 'platforms' ? 'bg-green-600' : 'bg-purple-600'
                            } text-white px-3 py-1 rounded-full text-xs font-medium flex items-center shadow-lg transform translate-x-20 group-hover:translate-x-0 transition-transform duration-500`}>
                              <i className={`fas ${
                                item.type === 'files' ? 'fa-download' :
                                item.type === 'platforms' ? 'fa-globe' : 'fa-graduation-cap'
                              } mr-1`}></i>
                              {item.documents.length}
                            </div>
                          </div>
                        </div>

                        {/* Contenu de la carte */}
                        <div className="p-6 relative">
                          <div className="flex items-start gap-4 mb-4">
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${getCategoryGradient(item.color)} p-0.5 flex-shrink-0 shadow-lg`}>
                              <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                                <i className={`fas ${item.icon} ${itemColors.text} text-xl`}></i>
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg font-bold text-gray-800 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                                {item.title}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {item.description}
                              </p>
                            </div>
                          </div>

                          {/* Statistiques */}
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                            <span>
                              <i className="fas fa-folder-open mr-1"></i>
                              {item.documents.length} ressource{item.documents.length > 1 ? 's' : ''}
                            </span>
                            <span>
                              <i className="fas fa-check-circle mr-1 text-green-500"></i>
                              {item.documents.filter(d => d.status === 'gratuit').length} gratuite{item.documents.filter(d => d.status === 'gratuit').length > 1 ? 's' : ''}
                            </span>
                          </div>

                          {/* Bouton d'action avec gradient */}
                          <button 
                            className={`w-full py-3 rounded-lg font-semibold transition-all bg-gradient-to-r ${getCategoryGradient(item.color)} text-white hover:shadow-lg transform hover:scale-105 duration-300`}
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedItem(item)
                            }}
                          >
                            <i className="fas fa-eye mr-2"></i>
                            Explorer les ressources
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
                
                {/* Message si aucun item */}
                {filterItemsByType(category.items).length === 0 && (
                  <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-inner" data-aos="fade-up">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <i className="fas fa-folder-open text-4xl text-gray-400"></i>
                    </div>
                    <p className="text-gray-600 text-lg font-medium mb-2">
                      Aucune ressource disponible
                    </p>
                    <p className="text-gray-500 text-sm">
                      Type recherché : "{types.find(t => t.value === selectedType)?.label}"
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Section CTA */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-8 rounded-2xl shadow-lg" data-aos="fade-up">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Besoin d'un Accompagnement Personnalisé ?
            </h3>
            <p className="text-gray-600 mb-6">
              Ces outils sont un excellent point de départ. Pour aller plus loin et bénéficier 
              de conseils adaptés à votre situation spécifique, nos experts sont à votre disposition.
            </p>
            <button 
              onClick={() => onPageChange('contact')}
              className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-full hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Demander un Conseil
            </button>
          </div>
        </div>

        {/* Section avantages */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center group" data-aos="zoom-in" data-aos-delay="0">
            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <i className="fas fa-check-circle text-green-600 text-2xl"></i>
            </div>
            <h4 className="font-semibold text-lg mb-2">Ressources Complètes</h4>
            <p className="text-sm text-gray-600">
              Accédez à des outils professionnels et des plateformes reconnues
            </p>
          </div>
          <div className="text-center group" data-aos="zoom-in" data-aos-delay="100">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <i className="fas fa-sync-alt text-blue-600 text-2xl animate-spin-slow"></i>
            </div>
            <h4 className="font-semibold text-lg mb-2">Mises à Jour Régulières</h4>
            <p className="text-sm text-gray-600">
              Nos ressources évoluent avec les meilleures pratiques du marché
            </p>
          </div>
          <div className="text-center group" data-aos="zoom-in" data-aos-delay="200">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <i className="fas fa-hands-helping text-purple-600 text-2xl"></i>
            </div>
            <h4 className="font-semibold text-lg mb-2">Support Expert</h4>
            <p className="text-sm text-gray-600">
              Notre équipe vous guide dans l'utilisation optimale de ces outils
            </p>
          </div>
        </div>
      </div>
      
      {/* Modal */}
      <KitItemModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </section>
    </>
  )
}