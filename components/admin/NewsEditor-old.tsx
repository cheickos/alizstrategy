'use client'

import { useState, useEffect, useRef } from 'react'

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

interface NewsEditorProps {
  onSave?: () => void
}

const categories = ['Innovation', 'Finance', 'Stratégie', 'Transformation', 'Actualité', 'Événement']

export default function NewsEditor({ onSave }: NewsEditorProps) {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState<Partial<NewsItem>>({
    title: '',
    excerpt: '',
    content: '',
    imageUrl: '',
    category: 'Actualité',
    author: 'Aliz Strategy',
    readTime: '5 min',
    featured: false
  })

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/admin/news')
      const data = await response.json()
      setNewsItems(data.news || [])
      setLoading(false)
    } catch (error) {
      console.error('Erreur:', error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = '/api/admin/news'
      const method = editingId ? 'PUT' : 'POST'
      const body = editingId ? { ...formData, id: editingId } : formData
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      
      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde')
      }
      
      await fetchNews()
      
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        imageUrl: '',
        category: 'Actualité',
        author: 'Aliz Strategy',
        readTime: '5 min',
        featured: false
      })
      setEditingId(null)
      setShowAddForm(false)
      
      alert(editingId ? 'Article mis à jour!' : 'Article ajouté!')
      
      if (onSave) onSave()
    } catch (error) {
      alert('Erreur lors de la sauvegarde')
    }
  }

  const handleEdit = (item: NewsItem) => {
    setFormData({
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
      imageUrl: item.imageUrl,
      category: item.category,
      author: item.author,
      readTime: item.readTime,
      featured: item.featured
    })
    setEditingId(item.id)
    setShowAddForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article?')) {
      return
    }
    
    try {
      const response = await fetch(`/api/admin/news?id=${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression')
      }
      
      await fetchNews()
      alert('Article supprimé!')
      
      if (onSave) onSave()
    } catch (error) {
      alert('Erreur lors de la suppression')
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const fakeUrl = URL.createObjectURL(file)
      setFormData({ ...formData, imageUrl: fakeUrl })
    }
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
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">
            Gérer les Actualités ({newsItems.length})
          </h3>
          <button
            onClick={() => {
              setShowAddForm(true)
              setEditingId(null)
              setFormData({
                title: '',
                excerpt: '',
                content: '',
                imageUrl: '',
                category: 'Actualité',
                author: 'Aliz Strategy',
                readTime: '5 min',
                featured: false
              })
            }}
            className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg hover:shadow-lg transition-shadow flex items-center"
          >
            <i className="fas fa-plus mr-2"></i>
            Nouvel article
          </button>
        </div>
      </div>

      {/* Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-gray-800">
              {editingId ? 'Modifier l\'article' : 'Nouvel article'}
            </h4>
            <button
              onClick={() => {
                setShowAddForm(false)
                setEditingId(null)
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Extrait *
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={2}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenu complet
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={6}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image
                </label>
                <div className="space-y-2">
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <i className="fas fa-image mr-2"></i>
                    Choisir une image
                  </button>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="URL de l'image"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Auteur
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Temps de lecture
                    </label>
                    <input
                      type="text"
                      value={formData.readTime}
                      onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Article mis en avant
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false)
                  setEditingId(null)
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-shadow"
              >
                {editingId ? 'Mettre à jour' : 'Publier'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Articles list */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800">
            Articles publiés
          </h4>
        </div>
        <div className="p-6">
          {newsItems.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Aucun article pour le moment
            </p>
          ) : (
            <div className="space-y-4">
              {newsItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h5 className="font-semibold text-gray-800 mb-1">
                              {item.title}
                              {item.featured && (
                                <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                  <i className="fas fa-star mr-1"></i>
                                  En vedette
                                </span>
                              )}
                            </h5>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {item.excerpt}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>
                                <i className="fas fa-tag mr-1"></i>
                                {item.category}
                              </span>
                              <span>
                                <i className="fas fa-user mr-1"></i>
                                {item.author}
                              </span>
                              <span>
                                <i className="fas fa-calendar mr-1"></i>
                                {new Date(item.date).toLocaleDateString('fr-FR')}
                              </span>
                              <span>
                                <i className="fas fa-clock mr-1"></i>
                                {item.readTime}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
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
    </div>
  )
}