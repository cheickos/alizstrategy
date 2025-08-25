'use client'

import { useEffect } from 'react'
import Image from 'next/image'

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

interface KitItemModalProps {
  item: KitItem | null
  isOpen: boolean
  onClose: () => void
}

export default function KitItemModal({ item, isOpen, onClose }: KitItemModalProps) {
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

  if (!isOpen || !item) return null

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      'blue': { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-300' },
      'green': { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-300' },
      'purple': { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-300' }
    }
    return colors[color] || { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300' }
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'files': 'Outils téléchargeables',
      'platforms': 'Plateformes en ligne',
      'formations': 'Formations'
    }
    return labels[type] || type
  }

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      'files': 'fa-download',
      'platforms': 'fa-external-link-alt',
      'formations': 'fa-graduation-cap'
    }
    return icons[type] || 'fa-folder'
  }

  const getDocumentTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      'pdf': 'fa-file-pdf',
      'excel': 'fa-file-excel',
      'word': 'fa-file-word',
      'link': 'fa-external-link-alt'
    }
    return icons[type] || 'fa-file'
  }

  const getDocumentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'pdf': 'text-red-600 bg-red-100',
      'excel': 'text-green-600 bg-green-100',
      'word': 'text-blue-600 bg-blue-100',
      'link': 'text-purple-600 bg-purple-100'
    }
    return colors[type] || 'text-gray-600 bg-gray-100'
  }

  const handleDocumentAction = (doc: Document) => {
    if (doc.type === 'link') {
      window.open(doc.fileUrl, '_blank')
    } else {
      const link = document.createElement('a')
      link.href = doc.fileUrl
      link.download = doc.title
      link.click()
    }
  }

  const handleWatchVideo = () => {
    if (item.videoUrl) {
      window.open(item.videoUrl, '_blank')
    }
  }

  const colorClasses = getColorClasses(item.color)

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 modal-backdrop"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header avec image ou couleur */}
        <div className="relative">
          <div className={`relative h-64 md:h-80 ${colorClasses.bg}`}>
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = 'https://placehold.co/800x400/cccccc/ffffff?text=Image'
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <i className={`fas ${item.icon} ${colorClasses.text} text-8xl opacity-20`}></i>
              </div>
            )}
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            
            {/* Titre sur l'image */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="flex items-center gap-4 mb-3">
                <div className={`w-16 h-16 rounded-lg bg-white flex items-center justify-center shadow-lg`}>
                  <i className={`fas ${item.icon} ${colorClasses.text} text-2xl`}></i>
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    {item.title}
                  </h2>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/90 ${colorClasses.text} mt-2`}>
                    <i className={`fas ${getTypeIcon(item.type)} mr-2`}></i>
                    {getTypeLabel(item.type)}
                  </span>
                </div>
              </div>
            </div>
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
          {/* Description */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {item.longDescription || item.description}
            </p>
          </div>

          {/* Documents / Ressources */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              <i className={`fas ${getTypeIcon(item.type)} mr-2`}></i>
              Ressources disponibles
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {item.documents.map(doc => (
                <div
                  key={doc.id}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => handleDocumentAction(doc)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getDocumentTypeColor(doc.type)}`}>
                      <i className={`fas ${getDocumentTypeIcon(doc.type)} text-xl`}></i>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {doc.title}
                      </h4>
                      {doc.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {doc.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {doc.type === 'link' ? 'Accéder' : 'Télécharger'}
                          <i className={`fas ${doc.type === 'link' ? 'fa-external-link-alt' : 'fa-download'} ml-2`}></i>
                        </span>
                        {doc.status && (
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            doc.status === 'gratuit' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {doc.status === 'gratuit' ? 'Gratuit' : 'Payant'}
                          </span>
                        )}
                      </div>
                      {doc.videoUrl && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(doc.videoUrl, '_blank')
                          }}
                          className="mt-2 text-xs text-red-600 hover:text-red-700 font-medium"
                        >
                          <i className="fab fa-youtube mr-1"></i>
                          Voir la vidéo explicative
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center bg-gray-50 rounded-lg p-4">
            <div>
              <p className="text-2xl font-bold text-gray-800">{item.documents.length}</p>
              <p className="text-sm text-gray-600">Ressources</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {item.documents.filter(d => d.status === 'gratuit').length}
              </p>
              <p className="text-sm text-gray-600">Gratuites</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">
                {item.documents.filter(d => d.status === 'payant').length}
              </p>
              <p className="text-sm text-gray-600">Payantes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {item.documents.filter(d => d.videoUrl).length}
              </p>
              <p className="text-sm text-gray-600">Avec vidéo</p>
            </div>
          </div>
        </div>

        {/* Footer avec actions */}
        <div className="p-6 md:p-8 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            {item.videoUrl && (
              <button
                onClick={handleWatchVideo}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-semibold flex items-center justify-center"
              >
                <i className="fab fa-youtube mr-2"></i>
                Voir la présentation vidéo
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