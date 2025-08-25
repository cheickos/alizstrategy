'use client'

import React, { useState, useEffect, useRef } from 'react'

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

interface PublicationsEditorProps {
  onSave?: () => void
}

export default function PublicationsEditor({ onSave }: PublicationsEditorProps) {
  const [publications, setPublications] = useState<Publication[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all')
  const [uploadingFile, setUploadingFile] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  
  const [isVideoLocal, setIsVideoLocal] = useState(false)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  
  const podcastInputRef = useRef<HTMLInputElement>(null)
  const [uploadingPodcast, setUploadingPodcast] = useState(false)
  
  const [formData, setFormData] = useState<Partial<Publication>>({
    title: '',
    description: '',
    type: 'multi',
    fileUrl: '',
    thumbnailUrl: '',
    videoUrl: '',
    documentUrl: '',
    imageUrl: '',
    localVideoUrl: '',
    podcastUrl: '',
    category: 'Stratégie & Croissance',
    subCategory: 'Rapports'
  })

  const categories = ['Stratégie & Croissance', 'Finance & Investissement', 'Transformation & Innovation']
  const subCategories = ['Rapports', 'Webinaires', 'Formations']
  const types = [
    { value: 'multi', label: 'Multi-média', icon: 'fa-layer-group' },
    { value: 'document', label: 'Document seul', icon: 'fa-file-pdf' },
    { value: 'video', label: 'Vidéo seule', icon: 'fa-video' },
    { value: 'image', label: 'Image seule', icon: 'fa-image' }
  ]
  
  // Filtrer les publications
  const filteredPublications = publications.filter(p => {
    const categoryMatch = selectedCategory === 'all' || p.category === selectedCategory
    const subCategoryMatch = selectedSubCategory === 'all' || p.subCategory === selectedSubCategory
    return categoryMatch && subCategoryMatch
  })
  
  // Grouper par catégorie
  const groupedPublications: Record<string, Publication[]> = {}
  categories.forEach(category => {
    const catPubs = filteredPublications.filter(p => p.category === category)
    if (catPubs.length > 0 || selectedCategory === category) {
      groupedPublications[category] = catPubs
    }
  })

  // Charger les publications
  useEffect(() => {
    fetchPublications()
  }, [])

  const fetchPublications = async () => {
    try {
      const response = await fetch('/api/admin/publications')
      const data = await response.json()
      setPublications(data.publications || [])
      setLoading(false)
    } catch (error) {
      console.error('Erreur:', error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingId ? '/api/admin/publications' : '/api/admin/publications'
      const method = editingId ? 'PUT' : 'POST'
      
      // Préparer les données selon le type
      let body: any = { ...formData }
      
      if (formData.type === 'multi') {
        // Pour le type multi, conserver toutes les URLs
        body.fileUrl = formData.documentUrl || formData.imageUrl || formData.localVideoUrl || formData.videoUrl || ''
        body.documentUrl = formData.documentUrl
        body.imageUrl = formData.imageUrl
        body.localVideoUrl = formData.localVideoUrl
        body.thumbnailUrl = formData.imageUrl || formData.thumbnailUrl
        // Si c'est une vidéo locale, la mettre aussi dans videoUrl pour compatibilité
        if (formData.localVideoUrl) {
          body.videoUrl = formData.localVideoUrl
        } else {
          body.videoUrl = formData.videoUrl
        }
      }
      
      if (editingId) {
        body.id = editingId
      }
      
      console.log('Submitting publication:', body)
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      
      const responseData = await response.json()
      console.log('Response:', response.status, responseData)
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Erreur lors de la sauvegarde')
      }
      
      // Recharger les publications
      await fetchPublications()
      
      // Réinitialiser le formulaire
      setFormData({
        title: '',
        description: '',
        type: 'document',
        fileUrl: '',
        thumbnailUrl: '',
        videoUrl: '',
        podcastUrl: '',
        category: 'Stratégie & Croissance',
        subCategory: 'Rapports'
      })
      setIsVideoLocal(false)
      setEditingId(null)
      setShowAddForm(false)
      
      alert(editingId ? 'Publication mise à jour!' : 'Publication ajoutée!')
      
      if (onSave) onSave()
    } catch (error) {
      console.error('Error saving publication:', error)
      alert(`Erreur lors de la sauvegarde: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    }
  }

  const handleEdit = (publication: Publication) => {
    setFormData({
      title: publication.title,
      description: publication.description,
      type: publication.type,
      fileUrl: publication.fileUrl,
      thumbnailUrl: publication.thumbnailUrl,
      videoUrl: publication.videoUrl,
      documentUrl: publication.documentUrl,
      imageUrl: publication.imageUrl,
      localVideoUrl: publication.localVideoUrl,
      podcastUrl: publication.podcastUrl,
      category: publication.category,
      subCategory: publication.subCategory
    })
    // Déterminer si c'est une vidéo locale ou YouTube
    if (publication.type === 'video' && publication.fileUrl) {
      setIsVideoLocal(publication.fileUrl.startsWith('/videos/'))
    } else if (publication.type === 'multi' && publication.localVideoUrl) {
      setIsVideoLocal(true)
    } else {
      setIsVideoLocal(false)
    }
    setEditingId(publication.id)
    setShowAddForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette publication?')) {
      return
    }
    
    try {
      const response = await fetch(`/api/admin/publications?id=${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression')
      }
      
      await fetchPublications()
      alert('Publication supprimée!')
      
      if (onSave) onSave()
    } catch (error) {
      alert('Erreur lors de la suppression')
    }
  }

  // Nouvelles fonctions pour le mode multi-média
  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        setUploadingFile(true)
        const formDataUpload = new FormData()
        formDataUpload.append('file', file)
        formDataUpload.append('type', 'document')
        
        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formDataUpload
        })
        
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || 'Erreur lors du téléchargement du document')
        }
        
        setFormData({ ...formData, documentUrl: data.fileUrl })
      } catch (error) {
        alert(`Erreur lors du téléchargement du document: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
      } finally {
        setUploadingFile(false)
      }
    }
  }

  const handleMultiVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        setUploadingVideo(true)
        const formDataUpload = new FormData()
        formDataUpload.append('file', file)
        formDataUpload.append('type', 'video')
        
        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formDataUpload
        })
        
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || 'Erreur lors du téléchargement de la vidéo')
        }
        
        setFormData({ ...formData, localVideoUrl: data.fileUrl })
      } catch (error) {
        alert(`Erreur lors du téléchargement de la vidéo: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
      } finally {
        setUploadingVideo(false)
      }
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        setUploadingImage(true)
        const formDataUpload = new FormData()
        formDataUpload.append('file', file)
        formDataUpload.append('type', 'logo')
        
        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formDataUpload
        })
        
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || 'Erreur lors du téléchargement de l\'image')
        }
        
        setFormData({ ...formData, imageUrl: data.fileUrl })
      } catch (error) {
        alert(`Erreur lors du téléchargement de l'image: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
      } finally {
        setUploadingImage(false)
      }
    }
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      console.log(`Uploading video:`, file.name, file.type, file.size)
      
      try {
        setUploadingVideo(true)
        
        const formDataUpload = new FormData()
        formDataUpload.append('file', file)
        formDataUpload.append('type', 'video')
        
        console.log('Sending video upload request...')
        
        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formDataUpload
        })
        
        const data = await response.json()
        console.log('Video upload response:', response.status, data)
        
        if (!response.ok) {
          throw new Error(data.error || 'Erreur lors du téléchargement de la vidéo')
        }
        
        setFormData({ ...formData, fileUrl: data.fileUrl })
        console.log('Video URL set:', data.fileUrl)
      } catch (error) {
        console.error('Video upload error:', error)
        alert(`Erreur lors du téléchargement de la vidéo: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
      } finally {
        setUploadingVideo(false)
      }
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'file' | 'image') => {
    const file = e.target.files?.[0]
    if (file) {
      console.log(`Uploading ${type}:`, file.name, file.type, file.size)
      
      try {
        // Définir l'état de chargement
        if (type === 'file') {
          setUploadingFile(true)
        } else {
          setUploadingImage(true)
        }
        
        const formDataUpload = new FormData()
        formDataUpload.append('file', file)
        formDataUpload.append('type', type === 'image' ? 'logo' : 'document')
        
        console.log('Sending upload request...')
        
        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formDataUpload
        })
        
        const data = await response.json()
        console.log('Upload response:', response.status, data)
        
        if (!response.ok) {
          throw new Error(data.error || 'Erreur lors du téléchargement')
        }
        
        if (type === 'file') {
          setFormData({ ...formData, fileUrl: data.fileUrl })
          console.log('File URL set:', data.fileUrl)
        } else {
          setFormData({ ...formData, thumbnailUrl: data.fileUrl })
          console.log('Thumbnail URL set:', data.fileUrl)
        }
      } catch (error) {
        console.error('Upload error:', error)
        alert(`Erreur lors du téléchargement du fichier: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
      } finally {
        // Réinitialiser l'état de chargement
        if (type === 'file') {
          setUploadingFile(false)
        } else {
          setUploadingImage(false)
        }
      }
    }
  }

  const handlePodcastUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      console.log(`Uploading podcast:`, file.name, file.type, file.size)
      
      try {
        setUploadingPodcast(true)
        
        const formDataUpload = new FormData()
        formDataUpload.append('file', file)
        formDataUpload.append('type', 'audio')
        
        console.log('Sending podcast upload request...')
        
        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formDataUpload
        })
        
        const data = await response.json()
        console.log('Podcast upload response:', response.status, data)
        
        if (!response.ok) {
          throw new Error(data.error || 'Erreur lors du téléchargement du podcast')
        }
        
        setFormData({ ...formData, podcastUrl: data.fileUrl })
        console.log('Podcast URL set:', data.fileUrl)
      } catch (error) {
        console.error('Podcast upload error:', error)
        alert(`Erreur lors du téléchargement du podcast: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
      } finally {
        setUploadingPodcast(false)
      }
    }
  }

  const getTypeIcon = (type: string) => {
    return types.find(t => t.value === type)?.icon || 'fa-file'
  }
  
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Stratégie & Croissance': 'blue',
      'Finance & Investissement': 'green',
      'Transformation & Innovation': 'purple'
    }
    return colors[category] || 'gray'
  }
  
  const getSubCategoryIcon = (subCategory: string) => {
    const icons: Record<string, string> = {
      'Rapports': 'fa-file-alt',
      'Webinaires': 'fa-video',
      'Formations': 'fa-graduation-cap'
    }
    return icons[subCategory] || 'fa-folder'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <i className="fas fa-spinner fa-spin text-4xl text-gray-400"></i>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header avec bouton d'ajout */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">
            Gérer les Publications ({publications.length})
          </h3>
          <button
            onClick={() => {
              setShowAddForm(true)
              setEditingId(null)
              setFormData({
                title: '',
                description: '',
                type: 'multi',
                fileUrl: '',
                thumbnailUrl: '',
                videoUrl: '',
                documentUrl: '',
                imageUrl: '',
                localVideoUrl: '',
                podcastUrl: '',
                category: 'Stratégie & Croissance',
                subCategory: 'Rapports'
              })
              setIsVideoLocal(false)
            }}
            className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg hover:shadow-lg transition-shadow flex items-center"
          >
            <i className="fas fa-plus mr-2"></i>
            Ajouter une publication
          </button>
        </div>
      </div>

      {/* Formulaire d'ajout/édition */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-gray-800">
              {editingId ? 'Modifier la publication' : 'Nouvelle publication'}
            </h4>
            <button
              onClick={() => {
                setShowAddForm(false)
                setEditingId(null)
                setIsVideoLocal(false)
                setFormData({
                  title: '',
                  description: '',
                  type: 'document',
                  fileUrl: '',
                  thumbnailUrl: '',
                  videoUrl: '',
                  podcastUrl: '',
                  category: 'Stratégie & Croissance',
                  subCategory: 'Rapports'
                })
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie principale
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sous-catégorie
                </label>
                <select
                  value={formData.subCategory}
                  onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {subCategories.map(subCat => (
                    <option key={subCat} value={subCat}>{subCat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de publication *
              </label>
              <div className="grid grid-cols-3 gap-4">
                {types.map(type => (
                  <label
                    key={type.value}
                    className={`border rounded-lg p-4 cursor-pointer text-center transition-colors ${
                      formData.type === type.value
                        ? 'border-primary bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={type.value}
                      checked={formData.type === type.value}
                      onChange={(e) => {
                        setFormData({ ...formData, type: e.target.value as Publication['type'] })
                        // Réinitialiser l'état vidéo local quand on change de type
                        if (e.target.value !== 'video') {
                          setIsVideoLocal(false)
                        }
                      }}
                      className="sr-only"
                    />
                    <i className={`fas ${type.icon} text-2xl mb-2 ${
                      formData.type === type.value ? 'text-primary' : 'text-gray-400'
                    }`}></i>
                    <div className={`text-sm font-medium ${
                      formData.type === type.value ? 'text-primary' : 'text-gray-700'
                    }`}>
                      {type.label}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Section Multi-média */}
            {formData.type === 'multi' ? (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">
                    <i className="fas fa-info-circle mr-2"></i>
                    Mode Multi-média : Vous pouvez ajouter un document, une vidéo et une image pour cette publication.
                  </p>
                </div>
                
                {/* Document */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="fas fa-file-pdf mr-1 text-red-500"></i>
                    Document (PDF, Word, Excel)
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
                    onChange={(e) => handleDocumentUpload(e)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingFile}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadingFile ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Téléchargement en cours...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-upload mr-2"></i>
                        Choisir un document
                      </>
                    )}
                  </button>
                  {formData.documentUrl && (
                    <div className="mt-2 text-sm text-gray-600">
                      <i className="fas fa-check-circle text-green-500 mr-1"></i>
                      Document: {formData.documentUrl.split('/').pop()}
                    </div>
                  )}
                </div>

                {/* Vidéo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="fas fa-video mr-1 text-blue-500"></i>
                    Vidéo
                  </label>
                  <div className="flex items-center space-x-4 mb-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={!isVideoLocal}
                        onChange={() => setIsVideoLocal(false)}
                        className="mr-2"
                      />
                      <span className="text-sm">URL YouTube</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={isVideoLocal}
                        onChange={() => setIsVideoLocal(true)}
                        className="mr-2"
                      />
                      <span className="text-sm">Fichier vidéo local</span>
                    </label>
                  </div>
                  {!isVideoLocal ? (
                    <input
                      type="url"
                      value={formData.videoUrl || ''}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="https://youtube.com/... ou https://youtu.be/..."
                    />
                  ) : (
                    <>
                      <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleMultiVideoUpload(e)}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => videoInputRef.current?.click()}
                        disabled={uploadingVideo}
                        className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {uploadingVideo ? (
                          <>
                            <i className="fas fa-spinner fa-spin mr-2"></i>
                            Téléchargement en cours...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-video mr-2"></i>
                            Choisir une vidéo
                          </>
                        )}
                      </button>
                      {formData.localVideoUrl && (
                        <div className="mt-2 text-sm text-gray-600">
                          <i className="fas fa-check-circle text-green-500 mr-1"></i>
                          Vidéo: {formData.localVideoUrl.split('/').pop()}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="fas fa-image mr-1 text-green-500"></i>
                    Image d'aperçu
                  </label>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadingImage ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Téléchargement en cours...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-image mr-2"></i>
                        Choisir une image
                      </>
                    )}
                  </button>
                  {formData.imageUrl && (
                    <div className="mt-2 text-sm text-gray-600">
                      <i className="fas fa-check-circle text-green-500 mr-1"></i>
                      Image: {formData.imageUrl.split('/').pop()}
                    </div>
                  )}
                </div>

                {/* Podcast Audio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="fas fa-podcast mr-1 text-purple-500"></i>
                    Podcast Audio (Optionnel)
                  </label>
                  <input
                    ref={podcastInputRef}
                    type="file"
                    accept="audio/*,.mp3,.wav,.m4a,.ogg"
                    onChange={(e) => handlePodcastUpload(e)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => podcastInputRef.current?.click()}
                    disabled={uploadingPodcast}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadingPodcast ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Téléchargement en cours...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-podcast mr-2"></i>
                        Choisir un podcast audio
                      </>
                    )}
                  </button>
                  {formData.podcastUrl && (
                    <div className="mt-2 text-sm text-gray-600">
                      <i className="fas fa-check-circle text-green-500 mr-1"></i>
                      Podcast: {formData.podcastUrl.split('/').pop()}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Section normale pour les autres types */
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.type === 'video' ? 'Vidéo' : 'Fichier'} *
                  </label>
                  {formData.type === 'video' ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4 mb-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={!isVideoLocal}
                          onChange={() => setIsVideoLocal(false)}
                          className="mr-2"
                        />
                        <span className="text-sm">URL YouTube</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={isVideoLocal}
                          onChange={() => setIsVideoLocal(true)}
                          className="mr-2"
                        />
                        <span className="text-sm">Fichier vidéo local</span>
                      </label>
                    </div>
                    {!isVideoLocal ? (
                      <input
                        type="url"
                        value={formData.fileUrl}
                        onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="https://youtube.com/... ou https://youtu.be/..."
                        required
                      />
                    ) : (
                      <>
                        <input
                          ref={videoInputRef}
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleVideoUpload(e)}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => videoInputRef.current?.click()}
                          disabled={uploadingVideo}
                          className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {uploadingVideo ? (
                            <>
                              <i className="fas fa-spinner fa-spin mr-2"></i>
                              Téléchargement en cours...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-video mr-2"></i>
                              Choisir une vidéo
                            </>
                          )}
                        </button>
                        {formData.fileUrl && (
                          <div className="text-sm text-gray-600">
                            <i className="fas fa-check-circle text-green-500 mr-1"></i>
                            Vidéo téléchargée: {formData.fileUrl.split('/').pop()}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={formData.type === 'image' ? 'image/*' : '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv'}
                      onChange={(e) => handleFileUpload(e, 'file')}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingFile}
                      className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploadingFile ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Téléchargement en cours...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-upload mr-2"></i>
                          Choisir un fichier
                        </>
                      )}
                    </button>
                    {formData.fileUrl && (
                      <input
                        type="text"
                        value={formData.fileUrl}
                        onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="URL du fichier"
                      />
                    )}
                  </div>
                )}
              </div>

              {formData.type !== 'multi' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image de couverture {formData.type === 'video' ? '(optionnel)' : formData.type === 'document' ? '(recommandé pour aperçu)' : ''}
                  </label>
                <div className="space-y-2">
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'image')}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadingImage ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Téléchargement en cours...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-image mr-2"></i>
                        Choisir une image
                      </>
                    )}
                  </button>
                  {formData.thumbnailUrl && (
                    <input
                      type="text"
                      value={formData.thumbnailUrl}
                      onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="URL de l'image"
                    />
                  )}
                </div>
              </div>
              )}
            </div>
            )}

            {formData.type !== 'video' && formData.type !== 'multi' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vidéo YouTube explicative (optionnel)
                </label>
              <input
                type="url"
                value={formData.videoUrl || ''}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="https://www.youtube.com/watch?v=... ou https://youtu.be/..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Ajoutez un lien YouTube pour une vidéo qui explique ou présente ce document
              </p>
            </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false)
                  setEditingId(null)
                  setIsVideoLocal(false)
                  setFormData({
                    title: '',
                    description: '',
                    type: 'multi',
                    fileUrl: '',
                    thumbnailUrl: '',
                    videoUrl: '',
                    documentUrl: '',
                    imageUrl: '',
                    localVideoUrl: '',
                    podcastUrl: '',
                    category: 'Stratégie & Croissance',
                    subCategory: 'Rapports'
                  })
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-shadow"
              >
                {editingId ? 'Mettre à jour' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Filtrer les publications</h4>
        
        {/* Filtres des catégories */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Catégories</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setSelectedCategory('all')
                setSelectedSubCategory('all')
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Toutes
            </button>
            {categories.map(cat => {
              const color = getCategoryColor(cat)
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat)
                    setSelectedSubCategory('all')
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? `bg-${color}-600 text-white`
                      : `bg-${color}-50 text-${color}-700 hover:bg-${color}-100`
                  }`}
                >
                  <i className={`fas ${
                    cat.includes('Stratégie') ? 'fa-chart-line' :
                    cat.includes('Finance') ? 'fa-coins' : 'fa-lightbulb'
                  } mr-2`}></i>
                  {cat}
                </button>
              )
            })}
          </div>
        </div>
        
        {/* Filtres des sous-catégories */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Types</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSubCategory('all')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                selectedSubCategory === 'all'
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Tous
            </button>
            {subCategories.map(subCat => (
              <button
                key={subCat}
                onClick={() => setSelectedSubCategory(subCat)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  selectedSubCategory === subCat
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <i className={`fas ${getSubCategoryIcon(subCat)} mr-1`}></i>
                {subCat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Liste des publications par catégorie */}
      <div className="space-y-6">
        {Object.entries(groupedPublications).map(([category, categoryPubs]) => {
          const color = getCategoryColor(category)
          return (
            <div key={category} className="bg-white rounded-lg shadow-sm">
              <div className={`p-6 border-b border-gray-200 bg-${color}-50`}>
                <h4 className={`text-lg font-semibold text-${color}-800`}>
                  <i className={`fas ${
                    category.includes('Stratégie') ? 'fa-chart-line' :
                    category.includes('Finance') ? 'fa-coins' : 'fa-lightbulb'
                  } mr-2`}></i>
                  {category} ({categoryPubs.length})
                </h4>
              </div>
              <div className="p-6">
                {categoryPubs.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    Aucune publication dans cette catégorie
                  </p>
                ) : (
                  <div className="space-y-4">
                    {categoryPubs.map((publication) => (
                      <div
                        key={publication.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              publication.type === 'document' ? 'bg-red-100' :
                              publication.type === 'video' ? 'bg-blue-100' : 'bg-green-100'
                            }`}>
                              <i className={`fas ${getTypeIcon(publication.type)} ${
                                publication.type === 'document' ? 'text-red-600' :
                                publication.type === 'video' ? 'text-blue-600' : 'text-green-600'
                              } text-xl`}></i>
                            </div>
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-800 mb-1">
                                {publication.title}
                              </h5>
                              <p className="text-sm text-gray-600 mb-2">
                                {publication.description}
                              </p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>
                                  <i className="fas fa-folder mr-1"></i>
                                  {publication.category}
                                </span>
                                <span>
                                  <i className={`fas ${
                                    publication.subCategory === 'Rapports' ? 'fa-file-alt' :
                                    publication.subCategory === 'Webinaires' ? 'fa-video' : 'fa-graduation-cap'
                                  } mr-1`}></i>
                                  {publication.subCategory}
                                </span>
                                <span>
                                  <i className="fas fa-calendar mr-1"></i>
                                  {new Date(publication.date).toLocaleDateString('fr-FR')}
                                </span>
                                {publication.downloadCount !== undefined && (
                                  <span>
                                    <i className="fas fa-download mr-1"></i>
                                    {publication.downloadCount}
                                  </span>
                                )}
                                {publication.videoUrl && (
                                  <span className="text-red-600">
                                    <i className="fab fa-youtube mr-1"></i>
                                    Vidéo disponible
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(publication)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              onClick={() => handleDelete(publication.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
        
        {/* Message si aucune publication */}
        {Object.keys(groupedPublications).length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <i className="fas fa-folder-open text-6xl text-gray-300 mb-4"></i>
            <p className="text-gray-500 text-lg">
              {selectedCategory !== 'all' || selectedSubCategory !== 'all' 
                ? 'Aucune publication trouvée pour ces critères' 
                : 'Aucune publication pour le moment'}
            </p>
            <p className="text-gray-400 mt-2">
              {selectedCategory !== 'all' || selectedSubCategory !== 'all'
                ? 'Essayez de modifier vos filtres ou ajoutez une nouvelle publication'
                : 'Cliquez sur "Ajouter une publication" pour commencer'}
            </p>
          </div>
        )}
      </div>
      
      {/* Statistiques */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Statistiques</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {publications.filter(p => p.category === 'Stratégie & Croissance').length}
            </div>
            <p className="text-sm text-gray-600">Stratégie & Croissance</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {publications.filter(p => p.category === 'Finance & Investissement').length}
            </div>
            <p className="text-sm text-gray-600">Finance & Investissement</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {publications.filter(p => p.category === 'Transformation & Innovation').length}
            </div>
            <p className="text-sm text-gray-600">Transformation & Innovation</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {publications.length}
            </div>
            <p className="text-sm text-gray-600">Total Publications</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="text-xl font-semibold text-gray-700">
              <i className="fas fa-file-alt text-orange-500 mr-2"></i>
              {publications.filter(p => p.subCategory === 'Rapports').length}
            </div>
            <p className="text-sm text-gray-600">Rapports</p>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-gray-700">
              <i className="fas fa-video text-red-500 mr-2"></i>
              {publications.filter(p => p.subCategory === 'Webinaires').length}
            </div>
            <p className="text-sm text-gray-600">Webinaires</p>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-gray-700">
              <i className="fas fa-graduation-cap text-blue-500 mr-2"></i>
              {publications.filter(p => p.subCategory === 'Formations').length}
            </div>
            <p className="text-sm text-gray-600">Formations</p>
          </div>
        </div>
      </div>
    </div>
  )
}