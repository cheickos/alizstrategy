'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import PublicationModal from '../PublicationModal'
import SectionVideo from '../SectionVideo'

interface Publication {
  id: string
  title: string
  description: string
  type: 'document' | 'video' | 'image' | 'multi'
  fileUrl: string
  thumbnailUrl?: string
  videoUrl?: string
  documentUrl?: string
  imageUrl?: string
  localVideoUrl?: string
  podcastUrl?: string
  category: string
  subCategory: string
  date: string
  downloadCount?: number
}

export default function PublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all')
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)
  const [playingPodcast, setPlayingPodcast] = useState<string | null>(null)

  const fetchPublicationsData = () => {
    fetch('/api/admin/publications')
      .then(res => res.json())
      .then(data => {
        setPublications(data.publications || [])
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchPublicationsData()
    
    // Rafraîchir les données toutes les 5 secondes
    const interval = setInterval(fetchPublicationsData, 5000)
    
    // Nettoyer l'intervalle au démontage
    return () => clearInterval(interval)
  }, [])

  // Définir les catégories principales
  const mainCategories = ['Stratégie & Croissance', 'Finance & Investissement', 'Transformation & Innovation']
  const subCategories = ['Rapports', 'Webinaires', 'Formations']
  
  // Filtrer les publications
  const filteredPublications = publications.filter(p => {
    const categoryMatch = selectedCategory === 'all' || p.category === selectedCategory
    const subCategoryMatch = selectedSubCategory === 'all' || p.subCategory === selectedSubCategory
    return categoryMatch && subCategoryMatch
  })
  
  // Regrouper les publications filtrées par catégorie
  const groupedPublications: Record<string, Publication[]> = {}
  if (selectedCategory === 'all') {
    mainCategories.forEach(category => {
      const catPubs = filteredPublications.filter(p => p.category === category)
      if (catPubs.length > 0) {
        groupedPublications[category] = catPubs
      }
    })
  } else {
    if (filteredPublications.length > 0) {
      groupedPublications[selectedCategory] = filteredPublications
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Stratégie & Croissance': 'bg-blue-200 text-blue-800',
      'Finance & Investissement': 'bg-green-200 text-green-800',
      'Transformation & Innovation': 'bg-purple-200 text-purple-800'
    }
    return colors[category] || 'bg-gray-200 text-gray-800'
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Stratégie & Croissance': 'fa-chart-line',
      'Finance & Investissement': 'fa-coins',
      'Transformation & Innovation': 'fa-lightbulb'
    }
    return icons[category] || 'fa-folder'
  }

  const handleAction = (publication: Publication) => {
    if (publication.type === 'video' || publication.type === 'image') {
      window.open(publication.fileUrl, '_blank')
    } else {
      // Pour les documents, on pourrait implémenter un vrai téléchargement
      const link = document.createElement('a')
      link.href = publication.fileUrl
      link.download = publication.title
      link.click()
    }
  }

  const openModal = (publication: Publication) => {
    setSelectedPublication(publication)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedPublication(null)
    setIsModalOpen(false)
  }

  if (loading) {
    return (
      <section id="publications" className="bg-white p-8 rounded-lg shadow-md">
        <div className="container mx-auto px-6 flex justify-center items-center min-h-[400px]">
          <i className="fas fa-spinner fa-spin text-4xl text-gray-400"></i>
        </div>
      </section>
    )
  }

  return (
    <>
      <section id="publications" className="bg-white p-8 rounded-lg shadow-md">
        <div className="container mx-auto px-6">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl lg:text-4xl font-bold section-title">
            Nos Publications
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Découvrez nos analyses et perspectives sur les tendances qui façonnent l'économie.
          </p>
          <SectionVideo section="publications" className="mt-8" />
        </div>
        
        {/* Filtres des catégories principales */}
        <div className="mb-12" data-aos="fade-up">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => {
                setSelectedCategory('all')
                setSelectedSubCategory('all')
              }}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-gray-800 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400'
              }`}
            >
              <i className="fas fa-th-large mr-2"></i>
              Toutes les catégories
            </button>
            <button
              onClick={() => {
                setSelectedCategory('Stratégie & Croissance')
                setSelectedSubCategory('all')
              }}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                selectedCategory === 'Stratégie & Croissance'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-blue-600 border-2 border-blue-300 hover:border-blue-400'
              }`}
            >
              <i className="fas fa-chart-line mr-2"></i>
              Stratégie & Croissance
            </button>
            <button
              onClick={() => {
                setSelectedCategory('Finance & Investissement')
                setSelectedSubCategory('all')
              }}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                selectedCategory === 'Finance & Investissement'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-green-600 border-2 border-green-300 hover:border-green-400'
              }`}
            >
              <i className="fas fa-coins mr-2"></i>
              Finance & Investissement
            </button>
            <button
              onClick={() => {
                setSelectedCategory('Transformation & Innovation')
                setSelectedSubCategory('all')
              }}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                selectedCategory === 'Transformation & Innovation'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-purple-600 border-2 border-purple-300 hover:border-purple-400'
              }`}
            >
              <i className="fas fa-lightbulb mr-2"></i>
              Transformation & Innovation
            </button>
          </div>
        </div>
        
        {/* Filtres des sous-catégories */}
        <div className="mb-12" data-aos="fade-up">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedSubCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedSubCategory === 'all'
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Tous les types
            </button>
            {subCategories.map(subCat => (
              <button
                key={subCat}
                onClick={() => setSelectedSubCategory(subCat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedSubCategory === subCat
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <i className={`fas ${
                  subCat === 'Rapports' ? 'fa-file-alt' :
                  subCat === 'Webinaires' ? 'fa-video' : 'fa-graduation-cap'
                } mr-2`}></i>
                {subCat}
              </button>
            ))}
          </div>
        </div>

        {/* Publications groupées par catégorie */}
        <div className="space-y-16">
          {Object.entries(groupedPublications).map(([category, categoryPublications]) => (
            <div key={category} data-aos="fade-up">
              <h3 className={`text-2xl font-semibold mb-8 text-center ${
                category === 'Stratégie & Croissance' ? 'text-blue-600' :
                category === 'Finance & Investissement' ? 'text-green-600' :
                'text-purple-600'
              }`}>
                <i className={`fas ${getCategoryIcon(category)} mr-3`}></i>
                {category}
              </h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categoryPublications.map((publication) => (
                  <div 
                    key={publication.id} 
                    className="publication-card group cursor-pointer"
                    onClick={() => openModal(publication)}
                  >
                    <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                      {/* Si une vidéo est en cours de lecture pour cette publication */}
                      {playingVideo === publication.id && (publication.localVideoUrl || (publication.type === 'video' && publication.fileUrl && publication.fileUrl.startsWith('/videos/'))) ? (
                        <div className="relative w-full h-full bg-black">
                          <video
                            className="w-full h-full object-contain"
                            controls
                            autoPlay
                            onClick={(e) => e.stopPropagation()}
                            poster={publication.imageUrl || publication.thumbnailUrl}
                          >
                            <source src={publication.localVideoUrl || publication.fileUrl} type="video/mp4" />
                            <source src={publication.localVideoUrl || publication.fileUrl} type="video/webm" />
                            Votre navigateur ne supporte pas la lecture vidéo.
                          </video>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setPlayingVideo(null)
                            }}
                            className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ) : playingVideo === publication.id && publication.videoUrl && !publication.localVideoUrl ? (
                        // YouTube iframe pour les vidéos YouTube
                        <div className="relative w-full h-full bg-black">
                          <iframe
                            className="w-full h-full"
                            src={`${publication.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}?autoplay=1`}
                            title={publication.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            onClick={(e) => e.stopPropagation()}
                          ></iframe>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setPlayingVideo(null)
                            }}
                            className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ) : (publication.imageUrl || publication.thumbnailUrl || (publication.type === 'image' && publication.fileUrl)) ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={publication.imageUrl || publication.thumbnailUrl || publication.fileUrl}
                            alt={publication.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={true}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = 'https://placehold.co/600x400/cccccc/ffffff?text=Image'
                            }}
                          />
                        </div>
                      ) : publication.type === 'multi' && !publication.imageUrl ? (
                        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                          <div className="text-center">
                            <i className="fas fa-layer-group text-6xl text-purple-400 mb-2"></i>
                            <p className="text-xs text-gray-600 font-medium">Multi-média</p>
                          </div>
                        </div>
                      ) : publication.type === 'document' || publication.documentUrl ? (
                        <div className="w-full h-full bg-white relative overflow-hidden">
                          {/* Simulation d'une page de document */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 p-4">
                            <div className="w-full h-full border border-gray-200 rounded-sm bg-white p-4 shadow-sm">
                              <div className="space-y-2">
                                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                                <div className="h-2 bg-gray-200 rounded w-full"></div>
                                <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                                <div className="h-2 bg-gray-200 rounded w-4/6 mb-4"></div>
                                <div className="h-2 bg-gray-200 rounded w-full"></div>
                                <div className="h-2 bg-gray-200 rounded w-full"></div>
                                <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                              </div>
                            </div>
                          </div>
                          {/* Icône PDF en overlay */}
                          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                            PDF
                          </div>
                          {/* Icône de document au centre semi-transparent */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <i className="fas fa-file-pdf text-red-400 text-6xl opacity-20"></i>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <i className={`fas ${
                            publication.type === 'video' ? 'fa-play-circle text-blue-400' : 
                            'fa-image text-green-400'
                          } text-6xl`}></i>
                        </div>
                      )}
                      {/* Bouton play pour les vidéos */}
                      {(publication.type === 'video' || publication.localVideoUrl || (publication.videoUrl && !publication.documentUrl)) && playingVideo !== publication.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setPlayingVideo(publication.id)
                          }}
                          className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
                        >
                          <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                            <i className="fas fa-play text-blue-600 text-xl ml-1"></i>
                          </div>
                        </button>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(category)}`}>
                          {category}
                        </span>
                        <span className="text-xs text-gray-500">
                          <i className={`fas ${
                            publication.subCategory === 'Rapports' ? 'fa-file-alt' :
                            publication.subCategory === 'Webinaires' ? 'fa-video' : 'fa-graduation-cap'
                          } mr-1`}></i>
                          {publication.subCategory}
                        </span>
                      </div>
                      <h4 className="font-bold text-lg my-3 text-gray-800 group-hover:text-blue-600 transition-colors">
                        {publication.title}
                      </h4>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {publication.description}
                      </p>
                      
                      {/* Boutons de téléchargement direct */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {/* Bouton document - toujours affiché */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (publication.documentUrl || (publication.type === 'document' && publication.fileUrl)) {
                              const link = document.createElement('a')
                              link.href = publication.documentUrl || publication.fileUrl
                              link.download = publication.title + '.pdf'
                              link.click()
                            } else {
                              openModal(publication)
                            }
                          }}
                          className={`flex-1 min-w-[100px] px-3 py-2 rounded-md transition-colors text-xs font-semibold flex items-center justify-center ${
                            (publication.documentUrl || (publication.type === 'document' && publication.fileUrl))
                              ? 'bg-red-50 text-red-600 hover:bg-red-100'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                          disabled={!(publication.documentUrl || (publication.type === 'document' && publication.fileUrl))}
                        >
                          <i className="fas fa-file-pdf mr-1"></i>
                          Document
                        </button>
                        
                        {/* Bouton vidéo - toujours affiché */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (publication.localVideoUrl || (publication.type === 'video' && publication.fileUrl && publication.fileUrl.startsWith('/videos/'))) {
                              const link = document.createElement('a')
                              link.href = publication.localVideoUrl || publication.fileUrl
                              link.download = publication.title + '.mp4'
                              link.click()
                            } else if (publication.videoUrl || (publication.type === 'video' && publication.fileUrl && (publication.fileUrl.includes('youtube') || publication.fileUrl.includes('youtu.be')))) {
                              window.open(publication.videoUrl || publication.fileUrl, '_blank')
                            } else {
                              openModal(publication)
                            }
                          }}
                          className={`flex-1 min-w-[100px] px-3 py-2 rounded-md transition-colors text-xs font-semibold flex items-center justify-center ${
                            (publication.localVideoUrl || publication.videoUrl || (publication.type === 'video' && publication.fileUrl))
                              ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                          disabled={!(publication.localVideoUrl || publication.videoUrl || (publication.type === 'video' && publication.fileUrl))}
                        >
                          <i className={`${
                            publication.videoUrl && !publication.localVideoUrl ? 'fab fa-youtube' : 'fas fa-video'
                          } mr-1`}></i>
                          Vidéo
                        </button>
                        
                        {/* Bouton podcast - toujours affiché */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (publication.podcastUrl) {
                              if (playingPodcast === publication.id) {
                                setPlayingPodcast(null)
                              } else {
                                setPlayingPodcast(publication.id)
                              }
                            } else {
                              openModal(publication)
                            }
                          }}
                          className={`flex-1 min-w-[100px] px-3 py-2 rounded-md transition-colors text-xs font-semibold flex items-center justify-center ${
                            publication.podcastUrl
                              ? playingPodcast === publication.id
                                ? 'bg-purple-600 text-white hover:bg-purple-700'
                                : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                          disabled={!publication.podcastUrl}
                        >
                          <i className={`fas ${playingPodcast === publication.id ? 'fa-pause' : 'fa-podcast'} mr-1`}></i>
                          {playingPodcast === publication.id ? 'Pause' : 'Podcast'}
                        </button>
                        
                        {/* Bouton détails - toujours affiché */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            openModal(publication)
                          }}
                          className="flex-1 min-w-[100px] px-3 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors text-xs font-semibold flex items-center justify-center"
                        >
                          <i className="fas fa-eye mr-1"></i>
                          Détails
                        </button>
                      </div>
                      
                      {/* Lecteur audio pour le podcast */}
                      {playingPodcast === publication.id && publication.podcastUrl && (
                        <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                          <audio
                            controls
                            autoPlay
                            className="w-full h-10"
                            onEnded={() => setPlayingPodcast(null)}
                          >
                            <source src={publication.podcastUrl} type="audio/mpeg" />
                            <source src={publication.podcastUrl} type="audio/mp3" />
                            <source src={publication.podcastUrl} type="audio/wav" />
                            <source src={publication.podcastUrl} type="audio/ogg" />
                            Votre navigateur ne supporte pas l'élément audio.
                          </audio>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          <i className="fas fa-calendar mr-1"></i>
                          {new Date(publication.date).toLocaleDateString('fr-FR', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Message si aucune publication */}
          {Object.keys(groupedPublications).length === 0 && (
            <div className="text-center py-16" data-aos="fade-up">
              <i className="fas fa-folder-open text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-500 text-lg">
                {selectedCategory !== 'all' || selectedSubCategory !== 'all' 
                  ? 'Aucune publication trouvée pour ces critères' 
                  : 'Aucune publication disponible pour le moment'}
              </p>
              <p className="text-gray-400 mt-2">
                {selectedCategory !== 'all' || selectedSubCategory !== 'all'
                  ? 'Essayez de modifier vos filtres'
                  : 'Revenez bientôt pour découvrir nos nouvelles analyses'}
              </p>
            </div>
          )}
        </div>

        {/* Section Newsletter */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-teal-50 p-8 rounded-lg" data-aos="fade-up">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Restez Informé
            </h3>
            <p className="text-gray-600 mb-6">
              Nos publications sont le fruit de recherches approfondies et d'analyses rigoureuses. 
              Inscrivez-vous à notre newsletter pour recevoir nos dernières publications et insights 
              directement dans votre boîte mail.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                S'inscrire
              </button>
            </div>
          </div>
        </div>

        {/* Section des valeurs */}
        <div className="mt-16 grid md:grid-cols-3 gap-8" data-aos="fade-up">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-book-open text-blue-600 text-2xl"></i>
            </div>
            <h4 className="font-semibold text-lg mb-2">Recherche Approfondie</h4>
            <p className="text-sm text-gray-600">
              Chaque publication est basée sur des données vérifiées et des analyses rigoureuses
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-chart-line text-teal-600 text-2xl"></i>
            </div>
            <h4 className="font-semibold text-lg mb-2">Insights Actionnables</h4>
            <p className="text-sm text-gray-600">
              Des recommandations pratiques pour transformer les idées en actions concrètes
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-globe-africa text-indigo-600 text-2xl"></i>
            </div>
            <h4 className="font-semibold text-lg mb-2">Perspective Africaine</h4>
            <p className="text-sm text-gray-600">
              Un regard unique sur les enjeux économiques du continent africain
            </p>
          </div>
        </div>

        {/* Statistiques de téléchargement si disponibles */}
        {publications.some(p => p.downloadCount !== undefined) && (
          <div className="mt-16 bg-gray-50 p-8 rounded-lg" data-aos="fade-up">
            <h3 className="text-xl font-semibold text-center text-gray-800 mb-6">
              Impact de nos Publications
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600">
                  {publications.length}
                </div>
                <p className="text-sm text-gray-600 mt-1">Publications</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-teal-600">
                  {publications.reduce((acc, p) => acc + (p.downloadCount || 0), 0)}
                </div>
                <p className="text-sm text-gray-600 mt-1">Téléchargements</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-indigo-600">
                  {mainCategories.length}
                </div>
                <p className="text-sm text-gray-600 mt-1">Catégories</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">
                  {publications.filter(p => p.type === 'video').length}
                </div>
                <p className="text-sm text-gray-600 mt-1">Vidéos</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Modal pour afficher les détails de la publication */}
      <PublicationModal
        publication={selectedPublication}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </section>
    </>
  )
}