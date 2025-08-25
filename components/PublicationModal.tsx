'use client'

import { useEffect } from 'react'
import Image from 'next/image'

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

interface PublicationModalProps {
  publication: Publication | null
  isOpen: boolean
  onClose: () => void
}

export default function PublicationModal({ publication, isOpen, onClose }: PublicationModalProps) {
  // Fermer avec la touche Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Empêcher le scroll du body
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen || !publication) return null

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Stratégie & Croissance': 'bg-blue-100 text-blue-800',
      'Finance & Investissement': 'bg-green-100 text-green-800',
      'Transformation & Innovation': 'bg-purple-100 text-purple-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Stratégie & Croissance': 'fa-chart-line',
      'Finance & Investissement': 'fa-coins',
      'Transformation & Innovation': 'fa-lightbulb'
    }
    return icons[category] || 'fa-folder'
  }

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      'document': 'fa-file-pdf',
      'video': 'fa-play-circle',
      'image': 'fa-image'
    }
    return icons[type] || 'fa-file'
  }

  const handleDownload = () => {
    if (publication.type === 'video') {
      // Si c'est une vidéo locale, créer un lien de téléchargement
      if (publication.fileUrl.startsWith('/videos/')) {
        const link = document.createElement('a')
        link.href = publication.fileUrl
        link.download = publication.title + '.mp4'
        link.click()
      } else {
        // Si c'est une URL YouTube, l'ouvrir dans un nouvel onglet
        window.open(publication.fileUrl, '_blank')
      }
    } else if (publication.type === 'image') {
      // Pour les images, ouvrir dans un nouvel onglet
      window.open(publication.fileUrl, '_blank')
    } else {
      // Pour les documents, télécharger
      const link = document.createElement('a')
      link.href = publication.fileUrl
      link.download = publication.title
      link.click()
    }
  }

  const handleWatchVideo = () => {
    if (publication.videoUrl) {
      window.open(publication.videoUrl, '_blank')
    }
  }

  // Déterminer l'image à afficher
  const displayImage = publication.imageUrl || publication.thumbnailUrl || 
    (publication.type === 'image' ? publication.fileUrl : null)
  
  // Déterminer la vidéo à afficher
  const displayVideo = publication.localVideoUrl || 
    (publication.type === 'video' ? publication.fileUrl : null) ||
    publication.videoUrl
    
  // Déterminer le document à afficher
  const displayDocument = publication.documentUrl || 
    (publication.type === 'document' ? publication.fileUrl : null)

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 modal-backdrop"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative">
          {/* Image de couverture ou vidéo */}
          <div className="relative h-64 md:h-96 bg-gray-900">
            {/* Si c'est un type multi-média avec vidéo locale */}
            {publication.type === 'multi' && displayVideo && displayVideo.startsWith('/videos/') ? (
              <div className="w-full h-full flex items-center justify-center">
                <video
                  className="w-full h-full object-contain"
                  controls
                  autoPlay={false}
                  poster={displayImage ?? undefined}
                >
                  <source src={displayVideo} type="video/mp4" />
                  <source src={displayVideo} type="video/webm" />
                  <source src={displayVideo} type="video/ogg" />
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
              </div>
            ) : publication.type === 'multi' && displayVideo && (displayVideo.includes('youtube.com') || displayVideo.includes('youtu.be')) ? (
              <iframe
                className="w-full h-full"
                src={displayVideo.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                title={publication.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : publication.type === 'multi' && displayImage ? (
              <div className="relative w-full h-full">
                <Image
                  src={displayImage}
                  alt={publication.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = 'https://placehold.co/800x400/cccccc/ffffff?text=Image'
                  }}
                />
              </div>
            ) : publication.type === 'video' && publication.fileUrl && publication.fileUrl.startsWith('/videos/') ? (
              <div className="w-full h-full flex items-center justify-center bg-black">
                <video
                  className="w-full h-full object-contain"
                  controls
                  autoPlay={false}
                  poster={publication.thumbnailUrl}
                >
                  <source src={publication.fileUrl} type="video/mp4" />
                  <source src={publication.fileUrl} type="video/webm" />
                  <source src={publication.fileUrl} type="video/ogg" />
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
              </div>
            ) : publication.type === 'video' && publication.fileUrl && (publication.fileUrl.includes('youtube.com') || publication.fileUrl.includes('youtu.be')) ? (
              // Si c'est une vidéo YouTube, afficher l'iframe
              <iframe
                className="w-full h-full"
                src={publication.fileUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                title={publication.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : displayImage ? (
              // Afficher l'image de couverture
              <div className="relative w-full h-full bg-gray-100">
                <Image
                  src={displayImage}
                  alt={publication.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = 'https://placehold.co/800x400/cccccc/ffffff?text=Image'
                  }}
                />
              </div>
            ) : publication.type === 'document' ? (
              <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <i className="fas fa-file-pdf text-gray-300 text-8xl"></i>
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <i className="fas fa-image text-gray-400 text-8xl"></i>
              </div>
            )}
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          </div>
          
          {/* Bouton fermer */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
          >
            <i className="fas fa-times text-gray-600"></i>
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6 md:p-8 overflow-y-auto max-h-[50vh]">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(publication.category)}`}>
              <i className={`fas ${getCategoryIcon(publication.category)} mr-2`}></i>
              {publication.category}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-700">
              <i className={`fas ${
                publication.subCategory === 'Rapports' ? 'fa-file-alt' :
                publication.subCategory === 'Webinaires' ? 'fa-video' : 'fa-graduation-cap'
              } mr-2`}></i>
              {publication.subCategory}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-700">
              <i className={`fas ${getTypeIcon(publication.type)} mr-2`}></i>
              {publication.type === 'document' ? 'Document' : 
               publication.type === 'video' ? 'Vidéo' : 'Image'}
            </span>
          </div>

          {/* Titre */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            {publication.title}
          </h2>

          {/* Description */}
          <div className="prose max-w-none">
            <p className="text-gray-600 text-lg leading-relaxed">
              {publication.description || 'Aucune description disponible.'}
            </p>
          </div>

          {/* Métadonnées */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Date de publication</p>
                <p className="font-semibold text-gray-700">
                  <i className="fas fa-calendar mr-2"></i>
                  {new Date(publication.date).toLocaleDateString('fr-FR', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
              {publication.downloadCount !== undefined && (
                <div>
                  <p className="text-gray-500">Téléchargements</p>
                  <p className="font-semibold text-gray-700">
                    <i className="fas fa-download mr-2"></i>
                    {publication.downloadCount}
                  </p>
                </div>
              )}
              <div>
                <p className="text-gray-500">Format</p>
                <p className="font-semibold text-gray-700">
                  <i className={`fas ${getTypeIcon(publication.type)} mr-2`}></i>
                  {publication.type === 'document' ? 'PDF' : 
                   publication.type === 'video' ? 'Vidéo' : 
                   publication.fileUrl.split('.').pop()?.toUpperCase() || 'Image'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer avec boutons d'action */}
        <div className="p-6 md:p-8 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Si type multi, afficher le bouton pour le document */}
            {publication.type === 'multi' && displayDocument && (
              <button
                onClick={() => {
                  const link = document.createElement('a')
                  link.href = displayDocument
                  link.download = publication.title
                  link.click()
                }}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-semibold flex items-center justify-center"
              >
                <i className="fas fa-file-download mr-2"></i>
                Télécharger le document
              </button>
            )}
            
            {/* Si type multi et vidéo disponible, afficher le bouton vidéo */}
            {publication.type === 'multi' && displayVideo && (
              <button
                onClick={() => {
                  if (displayVideo.startsWith('/videos/')) {
                    // Télécharger la vidéo locale
                    const link = document.createElement('a')
                    link.href = displayVideo
                    link.download = publication.title + '.mp4'
                    link.click()
                  } else {
                    // Ouvrir YouTube
                    window.open(displayVideo, '_blank')
                  }
                }}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-semibold flex items-center justify-center"
              >
                <i className={`fas ${displayVideo.startsWith('/videos/') ? 'fa-video' : 'fa-play'} mr-2`}></i>
                {displayVideo.startsWith('/videos/') ? 'Voir la vidéo' : 'Regarder sur YouTube'}
              </button>
            )}
            
            {/* Si type multi et image disponible, afficher le bouton image */}
            {publication.type === 'multi' && displayImage && (
              <button
                onClick={() => window.open(displayImage, '_blank')}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-semibold flex items-center justify-center"
              >
                <i className="fas fa-image mr-2"></i>
                Voir l'image
              </button>
            )}
            
            {/* Si podcast disponible, afficher le lecteur audio */}
            {publication.podcastUrl && (
              <div className="w-full p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <i className="fas fa-podcast text-purple-600 mr-2"></i>
                  <span className="text-sm font-semibold text-purple-800">Podcast Audio</span>
                </div>
                <audio
                  controls
                  className="w-full"
                >
                  <source src={publication.podcastUrl} type="audio/mpeg" />
                  <source src={publication.podcastUrl} type="audio/mp3" />
                  <source src={publication.podcastUrl} type="audio/wav" />
                  <source src={publication.podcastUrl} type="audio/ogg" />
                  Votre navigateur ne supporte pas l'élément audio.
                </audio>
              </div>
            )}
            
            {/* Bouton par défaut pour les types simples */}
            {publication.type !== 'multi' && (
              <button
                onClick={handleDownload}
                className="flex-1 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-semibold flex items-center justify-center"
              >
                <i className={`fas ${
                  publication.type === 'document' ? 'fa-download' :
                  publication.type === 'video' ? (publication.fileUrl.startsWith('/videos/') ? 'fa-download' : 'fa-play') : 'fa-eye'
                } mr-2`}></i>
                {publication.type === 'document' ? 'Télécharger le document' :
                 publication.type === 'video' ? (publication.fileUrl.startsWith('/videos/') ? 'Télécharger la vidéo' : 'Regarder sur YouTube') : 'Voir l\'image'}
              </button>
            )}
            {publication.videoUrl && (
              <button
                onClick={handleWatchVideo}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-semibold flex items-center justify-center"
              >
                <i className="fab fa-youtube mr-2"></i>
                Voir la vidéo explicative
              </button>
            )}
            <button
              onClick={onClose}
              className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}