'use client'

import React, { useState, useEffect, useRef } from 'react'

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

interface KitEntrepriseEditorProps {
  onSave?: (content: KitContent) => void
}

const iconOptions = [
  { value: 'fa-chart-line', label: 'Graphique' },
  { value: 'fa-calculator', label: 'Calculatrice' },
  { value: 'fa-gavel', label: 'Justice' },
  { value: 'fa-bullhorn', label: 'Marketing' },
  { value: 'fa-file-alt', label: 'Document' },
  { value: 'fa-briefcase', label: 'Business' },
  { value: 'fa-cogs', label: 'Paramètres' },
  { value: 'fa-users', label: 'Équipe' },
  { value: 'fa-search-dollar', label: 'Recherche' },
  { value: 'fa-hand-holding-usd', label: 'Financement' },
  { value: 'fa-file-invoice-dollar', label: 'Facture' },
  { value: 'fa-digital-tachograph', label: 'Digital' },
  { value: 'fa-tasks', label: 'Tâches' },
  { value: 'fa-graduation-cap', label: 'Formation' }
]

const colorOptions = [
  { value: 'blue', label: 'Bleu' },
  { value: 'green', label: 'Vert' },
  { value: 'purple', label: 'Violet' }
]

const typeOptions = [
  { value: 'files', label: 'Outils téléchargeables', icon: 'fa-download' },
  { value: 'platforms', label: 'Plateformes en ligne', icon: 'fa-external-link-alt' },
  { value: 'formations', label: 'Formations', icon: 'fa-graduation-cap' }
]

export default function KitEntrepriseEditor({ onSave }: KitEntrepriseEditorProps) {
  const [content, setContent] = useState<KitContent>({
    mainTitle: '',
    mainDescription: '',
    categories: []
  })
  const [loading, setLoading] = useState(true)
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showAddItem, setShowAddItem] = useState(false)
  const [uploadingFor, setUploadingFor] = useState<{categoryId: string, itemId: string, docId?: string, type: 'file' | 'image' | 'itemImage'} | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/admin/kit-entreprise')
      .then(res => res.json())
      .then(data => {
        if (data.content) {
          setContent(data.content)
          if (data.content.categories.length > 0) {
            setSelectedCategory(data.content.categories[0].id)
          }
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    try {
      const response = await fetch('/api/admin/kit-entreprise', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      })
      
      if (response.ok) {
        alert('Kit Entreprise mis à jour avec succès!')
        if (onSave) onSave(content)
      }
    } catch (error) {
      alert('Erreur lors de la sauvegarde')
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !uploadingFor) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', uploadingFor.type === 'image' || uploadingFor.type === 'itemImage' ? 'logo' : 'document')

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        
        if (uploadingFor.type === 'itemImage') {
          // Update item image
          updateItem(uploadingFor.categoryId, uploadingFor.itemId, 'imageUrl', data.fileUrl)
        } else if (uploadingFor.docId) {
          // Update document URL or image
          if (uploadingFor.type === 'image') {
            updateDocument(uploadingFor.categoryId, uploadingFor.itemId, uploadingFor.docId, 'imageUrl', data.fileUrl)
          } else {
            updateDocument(uploadingFor.categoryId, uploadingFor.itemId, uploadingFor.docId, 'fileUrl', data.fileUrl)
          }
        }
        
        alert('Fichier téléchargé avec succès!')
      } else {
        const error = await response.json()
        alert(error.error || 'Erreur lors du téléchargement')
      }
    } catch (error) {
      alert('Erreur lors du téléchargement du fichier')
    }

    setUploadingFor(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }
  }

  const updateCategory = (categoryId: string, field: keyof KitCategory, value: any) => {
    setContent({
      ...content,
      categories: content.categories.map(cat =>
        cat.id === categoryId ? { ...cat, [field]: value } : cat
      )
    })
  }

  const addItem = (categoryId: string) => {
    const newItem: KitItem = {
      id: Date.now().toString(),
      title: 'Nouveau Kit',
      description: 'Description du kit',
      icon: 'fa-file-alt',
      color: content.categories.find(c => c.id === categoryId)?.color || 'blue',
      type: 'files',
      documents: []
    }
    
    setContent({
      ...content,
      categories: content.categories.map(cat =>
        cat.id === categoryId
          ? { ...cat, items: [...cat.items, newItem] }
          : cat
      )
    })
    setEditingItem(newItem.id)
    setShowAddItem(false)
  }

  const updateItem = (categoryId: string, itemId: string, field: keyof KitItem, value: any) => {
    setContent({
      ...content,
      categories: content.categories.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              items: cat.items.map(item =>
                item.id === itemId ? { ...item, [field]: value } : item
              )
            }
          : cat
      )
    })
  }

  const deleteItem = (categoryId: string, itemId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce kit?')) {
      setContent({
        ...content,
        categories: content.categories.map(cat =>
          cat.id === categoryId
            ? { ...cat, items: cat.items.filter(item => item.id !== itemId) }
            : cat
        )
      })
    }
  }

  const addDocument = (categoryId: string, itemId: string) => {
    const item = content.categories.find(c => c.id === categoryId)?.items.find(i => i.id === itemId)
    const newDoc: Document = {
      id: Date.now().toString(),
      title: item?.type === 'platforms' ? 'Nouvelle plateforme' : 
            item?.type === 'formations' ? 'Nouvelle formation' : 
            'Nouveau document',
      fileUrl: '',
      type: item?.type === 'platforms' ? 'link' : 'pdf',
      status: 'gratuit'
    }
    
    setContent({
      ...content,
      categories: content.categories.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              items: cat.items.map(item =>
                item.id === itemId
                  ? { ...item, documents: [...item.documents, newDoc] }
                  : item
              )
            }
          : cat
      )
    })
  }

  const updateDocument = (categoryId: string, itemId: string, docId: string, field: keyof Document, value: string) => {
    setContent({
      ...content,
      categories: content.categories.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              items: cat.items.map(item =>
                item.id === itemId
                  ? {
                      ...item,
                      documents: item.documents.map(doc =>
                        doc.id === docId ? { ...doc, [field]: value } : doc
                      )
                    }
                  : item
              )
            }
          : cat
      )
    })
  }

  const deleteDocument = (categoryId: string, itemId: string, docId: string) => {
    setContent({
      ...content,
      categories: content.categories.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              items: cat.items.map(item =>
                item.id === itemId
                  ? {
                      ...item,
                      documents: item.documents.filter(doc => doc.id !== docId)
                    }
                  : item
              )
            }
          : cat
      )
    })
  }

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      'blue': { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-300' },
      'green': { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-300' },
      'purple': { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-300' }
    }
    return colors[color] || { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300' }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <i className="fas fa-spinner fa-spin text-4xl text-gray-400"></i>
      </div>
    )
  }

  const selectedCategoryData = content.categories.find(c => c.id === selectedCategory)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Gérer le Kit Entreprise
          </h3>
          <div className="flex gap-3">
            <button
              onClick={() => window.open('/kit-entreprise', '_blank')}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              type="button"
            >
              <i className="fas fa-eye mr-2"></i>
              Prévisualiser
            </button>
            <button
              onClick={handleSave}
              className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-lg hover:shadow-lg transition-shadow"
            >
              <i className="fas fa-save mr-2"></i>
              Sauvegarder
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre principal <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={content.mainTitle}
              onChange={(e) => setContent({ ...content, mainTitle: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Ex: Kit de l'Entrepreneur"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content.mainDescription}
              onChange={(e) => setContent({ ...content, mainDescription: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={3}
              placeholder="Décrivez l'objectif du kit entreprise..."
              required
            />
          </div>
        </div>
      </div>

      {/* Categories Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {content.categories.map((category) => {
              const colorClasses = getColorClasses(category.color)
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                    selectedCategory === category.id
                      ? `${colorClasses.text} ${colorClasses.border}`
                      : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className={`fas ${category.icon} mr-2`}></i>
                  {category.name}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Selected Category Content */}
        {selectedCategoryData && (
          <div className="p-6">
            {/* Category Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3">Informations de la catégorie</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={selectedCategoryData.name}
                    onChange={(e) => updateCategory(selectedCategoryData.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icône
                  </label>
                  <select
                    value={selectedCategoryData.icon}
                    onChange={(e) => updateCategory(selectedCategoryData.id, 'icon', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {iconOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Couleur
                  </label>
                  <select
                    value={selectedCategoryData.color}
                    onChange={(e) => updateCategory(selectedCategoryData.id, 'color', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {colorOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold text-gray-800">
                  Ressources ({selectedCategoryData.items.length})
                </h4>
                <button
                  onClick={() => addItem(selectedCategoryData.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Ajouter une ressource
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                {selectedCategoryData.items.map((item) => {
                  const itemColorClasses = getColorClasses(item.color)
                  return (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-start space-x-3">
                          <div className={`w-12 h-12 ${itemColorClasses.bg} rounded-lg flex items-center justify-center`}>
                            <i className={`fas ${item.icon} ${itemColorClasses.text} text-xl`}></i>
                          </div>
                          <div>
                            <h5 className="font-semibold text-gray-800">{item.title}</h5>
                            <p className="text-sm text-gray-600">{item.description}</p>
                            <div className="mt-2">
                              {item.type === 'files' && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  <i className="fas fa-download mr-1"></i>
                                  Outils téléchargeables
                                </span>
                              )}
                              {item.type === 'platforms' && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <i className="fas fa-external-link-alt mr-1"></i>
                                  Plateformes en ligne
                                </span>
                              )}
                              {item.type === 'formations' && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  <i className="fas fa-graduation-cap mr-1"></i>
                                  Formations
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingItem(editingItem === item.id ? null : item.id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => deleteItem(selectedCategoryData.id, item.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>

                      {editingItem === item.id && (
                        <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Titre
                              </label>
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => updateItem(selectedCategoryData.id, item.id, 'title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Type
                              </label>
                              <select
                                value={item.type}
                                onChange={(e) => updateItem(selectedCategoryData.id, item.id, 'type', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                              >
                                {typeOptions.map(option => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description courte
                              </label>
                              <input
                                type="text"
                                value={item.description}
                                onChange={(e) => updateItem(selectedCategoryData.id, item.id, 'description', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Icône
                              </label>
                              <select
                                value={item.icon}
                                onChange={(e) => updateItem(selectedCategoryData.id, item.id, 'icon', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                              >
                                {iconOptions.map(option => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description détaillée
                            </label>
                            <textarea
                              value={item.longDescription || ''}
                              onChange={(e) => updateItem(selectedCategoryData.id, item.id, 'longDescription', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                              rows={3}
                              placeholder="Description complète qui sera affichée dans le modal..."
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                URL de la vidéo YouTube de présentation
                              </label>
                              <input
                                type="url"
                                value={item.videoUrl || ''}
                                onChange={(e) => updateItem(selectedCategoryData.id, item.id, 'videoUrl', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="https://www.youtube.com/watch?v=..."
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Image de couverture
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="url"
                                  value={item.imageUrl || ''}
                                  onChange={(e) => updateItem(selectedCategoryData.id, item.id, 'imageUrl', e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                  placeholder="URL de l'image"
                                />
                                <button
                                  onClick={() => {
                                    setUploadingFor({categoryId: selectedCategoryData.id, itemId: item.id, type: 'itemImage'})
                                    imageInputRef.current?.click()
                                  }}
                                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                  type="button"
                                  title="Télécharger une image"
                                >
                                  <i className="fas fa-upload"></i>
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Documents */}
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  {item.type === 'files' ? 'Documents téléchargeables' : 
                                   item.type === 'platforms' ? 'Liens vers les plateformes' : 'Ressources de formation'}
                                </label>
                                <p className="text-xs text-gray-500 mt-1">
                                  {item.type === 'files' ? 'Ajoutez des fichiers PDF, Excel, Word...' : 
                                   item.type === 'platforms' ? 'Ajoutez les URLs des plateformes en ligne' : 
                                   'Ajoutez les supports de formation'}
                                </p>
                              </div>
                              <button
                                onClick={() => addDocument(selectedCategoryData.id, item.id)}
                                className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                type="button"
                              >
                                <i className="fas fa-plus mr-1"></i>
                                Ajouter
                              </button>
                            </div>
                            <div className="space-y-2">
                              {item.documents.map((doc) => (
                                <div key={doc.id} className="p-3 bg-white border border-gray-200 rounded-lg">
                                  <div className="grid grid-cols-12 gap-2 items-center mb-2">
                                    <input
                                      type="text"
                                      value={doc.title}
                                      onChange={(e) => updateDocument(selectedCategoryData.id, item.id, doc.id, 'title', e.target.value)}
                                      placeholder="Titre de la ressource"
                                      className="col-span-4 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                    />
                                    <div className="col-span-4 flex gap-1">
                                      <input
                                        type={item.type === 'platforms' ? 'url' : 'text'}
                                        value={doc.fileUrl}
                                        onChange={(e) => updateDocument(selectedCategoryData.id, item.id, doc.id, 'fileUrl', e.target.value)}
                                        placeholder={
                                          item.type === 'platforms' ? "https://exemple.com" : 
                                          item.type === 'formations' ? "URL ou chemin du support" :
                                          "/documents/fichier.pdf"
                                        }
                                        className="flex-1 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                      />
                                      {(item.type === 'files' || item.type === 'formations') && (
                                        <button
                                          onClick={() => {
                                            setUploadingFor({categoryId: selectedCategoryData.id, itemId: item.id, docId: doc.id, type: 'file'})
                                            fileInputRef.current?.click()
                                          }}
                                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                                          type="button"
                                          title="Télécharger un fichier"
                                        >
                                          <i className="fas fa-upload"></i>
                                        </button>
                                      )}
                                    </div>
                                    <select
                                      value={doc.type}
                                      onChange={(e) => updateDocument(selectedCategoryData.id, item.id, doc.id, 'type', e.target.value)}
                                      className="col-span-2 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                    >
                                      {item.type === 'platforms' ? (
                                        <option value="link">Lien</option>
                                      ) : item.type === 'formations' ? (
                                        <>
                                          <option value="pdf">PDF</option>
                                          <option value="video">Vidéo</option>
                                          <option value="link">Lien Web</option>
                                          <option value="zip">Archive ZIP</option>
                                        </>
                                      ) : (
                                        <>
                                          <option value="pdf">PDF</option>
                                          <option value="excel">Excel</option>
                                          <option value="word">Word</option>
                                          <option value="powerpoint">PowerPoint</option>
                                        </>
                                      )}
                                    </select>
                                    <select
                                      value={doc.status || 'gratuit'}
                                      onChange={(e) => updateDocument(selectedCategoryData.id, item.id, doc.id, 'status', e.target.value)}
                                      className="col-span-2 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                    >
                                      <option value="gratuit">Gratuit</option>
                                      <option value="payant">Payant</option>
                                    </select>
                                    <button
                                      onClick={() => deleteDocument(selectedCategoryData.id, item.id, doc.id)}
                                      className="col-span-1 text-red-600 hover:text-red-800 text-center"
                                      type="button"
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </div>
                                  
                                  {/* Champs supplémentaires */}
                                  <div className="grid grid-cols-2 gap-2 mt-2">
                                    <div>
                                      <input
                                        type="text"
                                        value={doc.description || ''}
                                        onChange={(e) => updateDocument(selectedCategoryData.id, item.id, doc.id, 'description', e.target.value)}
                                        placeholder="Description de la ressource (optionnel)"
                                        className="w-full px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                      />
                                    </div>
                                    <div>
                                      <input
                                        type="url"
                                        value={doc.videoUrl || ''}
                                        onChange={(e) => updateDocument(selectedCategoryData.id, item.id, doc.id, 'videoUrl', e.target.value)}
                                        placeholder="URL vidéo YouTube explicative (optionnel)"
                                        className="w-full px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                      />
                                    </div>
                                  </div>
                                  {/* Aperçu de l'URL pour les plateformes */}
                                  {item.type === 'platforms' && doc.fileUrl && (
                                    <div className="mt-2 text-xs text-gray-500">
                                      <i className="fas fa-external-link-alt mr-1"></i>
                                      <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                                        Tester le lien
                                      </a>
                                    </div>
                                  )}
                                  {/* Indicateur pour les fichiers téléchargés */}
                                  {(item.type === 'files' || item.type === 'formations') && doc.fileUrl && doc.fileUrl.startsWith('/documents/') && (
                                    <div className="mt-2 text-xs text-green-600">
                                      <i className="fas fa-check-circle mr-1"></i>
                                      Fichier téléchargé sur le serveur
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Documents count */}
                      <div className="mt-2 text-sm text-gray-500">
                        <i className="fas fa-file-alt mr-1"></i>
                        {item.documents.length} {item.type === 'platforms' ? 'lien(s)' : 'document(s)'}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Statistiques</h4>
        <div className="grid grid-cols-3 gap-4">
          {content.categories.map(category => {
            const colorClasses = getColorClasses(category.color)
            const filesCount = category.items.filter(i => i.type === 'files').length
            const platformsCount = category.items.filter(i => i.type === 'platforms').length
            const formationsCount = category.items.filter(i => i.type === 'formations').length
            
            return (
              <div key={category.id} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`text-2xl font-bold ${colorClasses.text} mb-2`}>
                  {category.items.length}
                </div>
                <h5 className="font-medium text-gray-800 mb-2">{category.name}</h5>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>{filesCount} outils téléchargeables</div>
                  <div>{platformsCount} plateformes</div>
                  <div>{formationsCount} formations</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.mp4,.webm,.ogg,.zip"
        onChange={handleFileUpload}
        className="hidden"
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  )
}