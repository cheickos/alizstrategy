'use client'

import React, { useState, useEffect, useRef } from 'react'

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

interface NewsEditorProps {
  onSave?: () => void
}

const categories = ['Innovation', 'Finance', 'Stratégie', 'Transformation', 'Actualité', 'Événement', 'Partenariat', 'Étude']
const poles = ['Stratégie & Croissance', 'Finance & Investissement', 'Transformation & Innovation']

export default function NewsEditor({ onSave }: NewsEditorProps) {
  const [activeTab, setActiveTab] = useState<'realisations' | 'news'>('realisations')
  const [realisations, setRealisations] = useState<Realisation[]>([])
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)
  
  // Form data for realisations
  const [realisationForm, setRealisationForm] = useState<Partial<Realisation>>({
    title: '',
    description: '',
    imageUrl: '',
    client: '',
    sector: '',
    impact: '',
    period: '',
    pole: 'Stratégie & Croissance'
  })

  // Form data for news
  const [newsForm, setNewsForm] = useState<Partial<NewsItem>>({
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
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin/news')
      const data = await response.json()
      setRealisations(data.realisations || [])
      setNewsItems(data.news || [])
      setLoading(false)
    } catch (error) {
      console.error('Erreur:', error)
      setLoading(false)
    }
  }

  const handleSubmitRealisation = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = '/api/admin/news'
      const method = editingId ? 'PUT' : 'POST'
      const body = {
        type: 'realisation',
        ...(editingId ? { ...realisationForm, id: editingId } : realisationForm)
      }
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      
      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde')
      }
      
      await fetchData()
      
      setRealisationForm({
        title: '',
        description: '',
        imageUrl: '',
        client: '',
        sector: '',
        impact: '',
        period: '',
        pole: 'Stratégie & Croissance'
      })
      setEditingId(null)
      setShowAddForm(false)
      
      alert(editingId ? 'Réalisation mise à jour!' : 'Réalisation ajoutée!')
      
      if (onSave) onSave()
    } catch (error) {
      alert('Erreur lors de la sauvegarde')
    }
  }

  const handleSubmitNews = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = '/api/admin/news'
      const method = editingId ? 'PUT' : 'POST'
      const body = editingId ? { ...newsForm, id: editingId } : newsForm
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      
      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde')
      }
      
      await fetchData()
      
      setNewsForm({
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

  const handleEditRealisation = (item: Realisation) => {
    setRealisationForm({
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl,
      client: item.client,
      sector: item.sector,
      impact: item.impact,
      period: item.period,
      pole: item.pole
    })
    setEditingId(item.id)
    setShowAddForm(true)
  }

  const handleEditNews = (item: NewsItem) => {
    setNewsForm({
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

  const handleDelete = async (id: string, type: 'realisation' | 'news') => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer cet${type === 'realisation' ? 'te réalisation' : ' article'}?`)) {
      return
    }
    
    try {
      const response = await fetch(`/api/admin/news?id=${id}&type=${type}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression')
      }
      
      await fetchData()
      alert(type === 'realisation' ? 'Réalisation supprimée!' : 'Article supprimé!')
      
      if (onSave) onSave()
    } catch (error) {
      alert('Erreur lors de la suppression')
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const fakeUrl = URL.createObjectURL(file)
      if (activeTab === 'realisations') {
        setRealisationForm({ ...realisationForm, imageUrl: fakeUrl })
      } else {
        setNewsForm({ ...newsForm, imageUrl: fakeUrl })
      }
    }
  }

  const getPoleColor = (pole: string) => {
    const colors: Record<string, string> = {
      'Stratégie & Croissance': 'bg-blue-100 text-blue-800',
      'Finance & Investissement': 'bg-green-100 text-green-800',
      'Transformation & Innovation': 'bg-purple-100 text-purple-800'
    }
    return colors[pole] || 'bg-gray-100 text-gray-800'
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
      {/* Header with tabs */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Gérer les Actualités
          </h3>
          <button
            onClick={() => window.open('/news', '_blank')}
            className="text-gray-600 hover:text-gray-800"
          >
            <i className="fas fa-external-link-alt mr-2"></i>
            Voir la page
          </button>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => {
                setActiveTab('realisations')
                setShowAddForm(false)
                setEditingId(null)
              }}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'realisations'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className="fas fa-briefcase mr-2"></i>
              Nos Réalisations ({realisations.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('news')
                setShowAddForm(false)
                setEditingId(null)
              }}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'news'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className="fas fa-newspaper mr-2"></i>
              Actualités Récentes ({newsItems.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'realisations' ? (
        <>
          {/* Add button */}
          <div className="flex justify-end">
            <button
              onClick={() => {
                setShowAddForm(true)
                setEditingId(null)
                setRealisationForm({
                  title: '',
                  description: '',
                  imageUrl: '',
                  client: '',
                  sector: '',
                  impact: '',
                  period: '',
                  pole: 'Stratégie & Croissance'
                })
              }}
              className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg hover:shadow-lg transition-shadow flex items-center"
            >
              <i className="fas fa-plus mr-2"></i>
              Nouvelle réalisation
            </button>
          </div>

          {/* Realisation Form */}
          {showAddForm && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-gray-800">
                  {editingId ? 'Modifier la réalisation' : 'Nouvelle réalisation'}
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

              <form onSubmit={handleSubmitRealisation} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre *
                    </label>
                    <input
                      type="text"
                      value={realisationForm.title}
                      onChange={(e) => setRealisationForm({ ...realisationForm, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pôle d'expertise *
                    </label>
                    <select
                      value={realisationForm.pole}
                      onChange={(e) => setRealisationForm({ ...realisationForm, pole: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    >
                      {poles.map(pole => (
                        <option key={pole} value={pole}>{pole}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={realisationForm.description}
                    onChange={(e) => setRealisationForm({ ...realisationForm, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Client *
                    </label>
                    <input
                      type="text"
                      value={realisationForm.client}
                      onChange={(e) => setRealisationForm({ ...realisationForm, client: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secteur
                    </label>
                    <input
                      type="text"
                      value={realisationForm.sector}
                      onChange={(e) => setRealisationForm({ ...realisationForm, sector: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Ex: Services Financiers"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Impact & Résultats
                  </label>
                  <textarea
                    value={realisationForm.impact}
                    onChange={(e) => setRealisationForm({ ...realisationForm, impact: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={3}
                    placeholder="Décrivez l'impact et les résultats obtenus..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Période
                    </label>
                    <input
                      type="text"
                      value={realisationForm.period}
                      onChange={(e) => setRealisationForm({ ...realisationForm, period: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Ex: 2023 - 2024"
                    />
                  </div>

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
                        value={realisationForm.imageUrl}
                        onChange={(e) => setRealisationForm({ ...realisationForm, imageUrl: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="URL de l'image"
                      />
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

          {/* Realisations list */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h4 className="text-lg font-semibold text-gray-800">
                Réalisations publiées
              </h4>
            </div>
            <div className="p-6">
              {realisations.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Aucune réalisation pour le moment
                </p>
              ) : (
                <div className="space-y-4">
                  {realisations.map((item) => (
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
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <div className="mb-2">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPoleColor(item.pole)}`}>
                                {item.pole}
                              </span>
                            </div>
                            <h5 className="font-semibold text-gray-800 mb-1">
                              {item.title}
                            </h5>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {item.description}
                            </p>
                            <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                              <div>
                                <i className="fas fa-building mr-1"></i>
                                <span className="font-medium">Client:</span> {item.client}
                              </div>
                              <div>
                                <i className="fas fa-industry mr-1"></i>
                                <span className="font-medium">Secteur:</span> {item.sector}
                              </div>
                              <div>
                                <i className="fas fa-calendar mr-1"></i>
                                <span className="font-medium">Période:</span> {item.period}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => handleEditRealisation(item)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, 'realisation')}
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
        </>
      ) : (
        <>
          {/* Add button */}
          <div className="flex justify-end">
            <button
              onClick={() => {
                setShowAddForm(true)
                setEditingId(null)
                setNewsForm({
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

          {/* News Form */}
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

              <form onSubmit={handleSubmitNews} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre *
                    </label>
                    <input
                      type="text"
                      value={newsForm.title}
                      onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catégorie
                    </label>
                    <select
                      value={newsForm.category}
                      onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
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
                    value={newsForm.excerpt}
                    onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })}
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
                    value={newsForm.content}
                    onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
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
                        value={newsForm.imageUrl}
                        onChange={(e) => setNewsForm({ ...newsForm, imageUrl: e.target.value })}
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
                          value={newsForm.author}
                          onChange={(e) => setNewsForm({ ...newsForm, author: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Temps de lecture
                        </label>
                        <input
                          type="text"
                          value={newsForm.readTime}
                          onChange={(e) => setNewsForm({ ...newsForm, readTime: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newsForm.featured}
                          onChange={(e) => setNewsForm({ ...newsForm, featured: e.target.checked })}
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

          {/* News list */}
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
                            onClick={() => handleEditNews(item)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, 'news')}
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
        </>
      )}
    </div>
  )
}