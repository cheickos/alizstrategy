'use client'

import React, { useState, useEffect } from 'react'

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

interface ExpertisePageEditorProps {
  onSave: (content: ExpertisePageContent) => void
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

const categoryColors: Record<string, { bg: string; text: string }> = {
  'blue': { bg: 'bg-blue-50', text: 'text-blue-600' },
  'teal': { bg: 'bg-teal-50', text: 'text-teal-600' },
  'indigo': { bg: 'bg-indigo-50', text: 'text-indigo-600' }
}

export default function ExpertisePageEditor({ onSave }: ExpertisePageEditorProps) {
  const [content, setContent] = useState<ExpertisePageContent>({
    mainTitle: 'Nos Pôles d\'Expertise',
    mainDescription: 'Une offre de services complète pour adresser chaque facette de votre développement.',
    categories: [
      {
        id: '1',
        title: 'Stratégie & Croissance',
        subtitle: 'Définir et atteindre vos objectifs stratégiques',
        icon: 'fa-chess-queen',
        color: 'blue',
        services: [
          {
            id: '1',
            title: 'Conseil en Stratégie',
            description: 'Définition de votre vision et de votre positionnement pour un avantage compétitif durable.',
            icon: 'fa-lightbulb'
          },
          {
            id: '3',
            title: 'Mise en Relation d\'Affaires',
            description: 'Développement de votre réseau et facilitation de partenariats stratégiques.',
            icon: 'fa-handshake'
          },
          {
            id: '9',
            title: 'Conseil en Gestion d\'Entreprise',
            description: 'Optimisation de votre management, de vos opérations et de votre performance globale.',
            icon: 'fa-briefcase'
          }
        ]
      },
      {
        id: '2',
        title: 'Finance & Investissement',
        subtitle: 'Sécuriser et optimiser vos ressources financières',
        icon: 'fa-coins',
        color: 'teal',
        services: [
          {
            id: '4',
            title: 'Recherche de Financement',
            description: 'Accompagnement pour sécuriser les capitaux nécessaires à votre croissance.',
            icon: 'fa-search-dollar'
          },
          {
            id: '5',
            title: 'Ingénierie Financière',
            description: 'Optimisation de votre structure financière et gestion des risques.',
            icon: 'fa-chart-line'
          },
          {
            id: '6',
            title: 'Prise de Participation',
            description: 'Partenariat capitalistique pour accélérer votre développement.',
            icon: 'fa-piggy-bank'
          },
          {
            id: '10',
            title: 'Trading & Bourse',
            description: 'Conseil et formation pour naviguer sur les marchés financiers.',
            icon: 'fa-chart-pie'
          }
        ]
      },
      {
        id: '3',
        title: 'Transformation & Opérations',
        subtitle: 'Moderniser et optimiser votre organisation',
        icon: 'fa-cogs',
        color: 'indigo',
        services: [
          {
            id: '2',
            title: 'Transformation Digitale',
            description: 'Intégration des technologies pour une entreprise agile et connectée.',
            icon: 'fa-digital-tachograph'
          },
          {
            id: '7',
            title: 'Gestion de Projets',
            description: 'Pilotage rigoureux de vos projets stratégiques, de la conception à la clôture.',
            icon: 'fa-tasks'
          },
          {
            id: '8',
            title: 'Formation & Compétences',
            description: 'Développement du capital humain, votre atout le plus précieux.',
            icon: 'fa-users-cog'
          }
        ]
      }
    ],
    backgroundColor: 'white'
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingService, setEditingService] = useState<{categoryId: string, serviceId: string} | null>(null)
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState<{categoryId: string, serviceId: string} | null>(null)

  // Charger le contenu actuel
  useEffect(() => {
    fetch('/api/admin/expertise')
      .then(res => res.json())
      .then(data => {
        if (data.content) {
          setContent(data.content)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(content)
      alert('Page Pôles d\'expertise mise à jour avec succès!')
    } catch (error) {
      alert('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const updateService = (categoryId: string, serviceId: string, field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      categories: prev.categories.map(cat => 
        cat.id === categoryId
          ? {
              ...cat,
              services: cat.services.map(service =>
                service.id === serviceId
                  ? { ...service, [field]: value }
                  : service
              )
            }
          : cat
      )
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, categoryId: string, serviceId: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage({ categoryId, serviceId })
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'service')

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      updateService(categoryId, serviceId, 'imageUrl', data.url)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Erreur lors du téléchargement de l\'image')
    } finally {
      setUploadingImage(null)
    }
  }

  const updateCategory = (categoryId: string, field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      categories: prev.categories.map(cat => 
        cat.id === categoryId
          ? { ...cat, [field]: value }
          : cat
      )
    }))
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
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Modifier la page Pôles d'Expertise</h3>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50"
            >
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Page Title and Description */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre de la page
              </label>
              <input
                type="text"
                value={content.mainTitle}
                onChange={(e) => setContent({ ...content, mainTitle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description principale
              </label>
              <textarea
                value={content.mainDescription}
                onChange={(e) => setContent({ ...content, mainDescription: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={2}
              />
            </div>
            
            {/* Background Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Couleur de fond de la section
              </label>
              <select
                value={content.backgroundColor || 'white'}
                onChange={(e) => setContent({ ...content, backgroundColor: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="white">Blanc (défaut)</option>
                <option value="gray-50">Gris clair</option>
                <option value="blue-50">Bleu clair</option>
                <option value="green-50">Vert clair</option>
                <option value="purple-50">Violet clair</option>
                <option value="yellow-50">Jaune clair</option>
                <option value="indigo-50">Indigo clair</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      {content.categories.map((category) => (
        <div key={category.id} className="bg-white rounded-lg shadow-sm">
          <div className={`p-6 border-b border-gray-200 ${categoryColors[category.color]?.bg || 'bg-gray-50'}`}>
            <div className="flex justify-between items-center">
              <h4 className={`text-lg font-semibold ${categoryColors[category.color]?.text || 'text-gray-600'} flex items-center`}>
                <i className={`fas ${category.icon} mr-2`}></i>
                {category.title}
              </h4>
              <button
                onClick={() => setEditingCategory(editingCategory === category.id ? null : category.id)}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                <i className={`fas fa-${editingCategory === category.id ? 'minus' : 'edit'}`}></i>
              </button>
            </div>
          </div>

          {/* Edit Category */}
          {editingCategory === category.id && (
            <div className="p-4 bg-gray-50 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Titre de la catégorie
                  </label>
                  <input
                    type="text"
                    value={category.title}
                    onChange={(e) => updateCategory(category.id, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icône (FontAwesome)
                  </label>
                  <input
                    type="text"
                    value={category.icon}
                    onChange={(e) => updateCategory(category.id, 'icon', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="fa-chess-queen"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sous-titre
                </label>
                <input
                  type="text"
                  value={category.subtitle}
                  onChange={(e) => updateCategory(category.id, 'subtitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Services */}
          <div className="p-6">
            <div className="space-y-4">
              {category.services.map((service) => (
                <div key={service.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <i className={`fas ${service.icon} ${categoryColors[category.color]?.text || 'text-gray-600'} mr-3`}></i>
                        <h5 className="font-semibold text-gray-800">{service.title}</h5>
                      </div>
                      <p className="text-sm text-gray-600">{service.description}</p>
                    </div>
                    <button
                      onClick={() => setEditingService(
                        editingService?.categoryId === category.id && editingService?.serviceId === service.id
                          ? null
                          : { categoryId: category.id, serviceId: service.id }
                      )}
                      className="ml-4 text-sm text-gray-500 hover:text-gray-700"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                  </div>

                  {/* Edit Service */}
                  {editingService?.categoryId === category.id && editingService?.serviceId === service.id && (
                    <div className="mt-4 space-y-3 pt-4 border-t border-gray-200">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Titre du service
                        </label>
                        <input
                          type="text"
                          value={service.title}
                          onChange={(e) => updateService(category.id, service.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description courte
                        </label>
                        <textarea
                          value={service.description}
                          onChange={(e) => updateService(category.id, service.id, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Icône (FontAwesome)
                        </label>
                        <input
                          type="text"
                          value={service.icon}
                          onChange={(e) => updateService(category.id, service.id, 'icon', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="fa-lightbulb"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Image du service
                        </label>
                        <div className="space-y-2">
                          {service.imageUrl && (
                            <div className="relative inline-block">
                              <img 
                                src={service.imageUrl} 
                                alt={service.title}
                                className="h-32 w-48 object-cover rounded-lg"
                              />
                              <button
                                onClick={() => updateService(category.id, service.id, 'imageUrl', '')}
                                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full text-xs hover:bg-red-700"
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </div>
                          )}
                          <div>
                            <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors">
                              <i className="fas fa-upload mr-2"></i>
                              {uploadingImage?.categoryId === category.id && uploadingImage?.serviceId === service.id ? 'Téléchargement...' : 'Télécharger une image'}
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, category.id, service.id)}
                                disabled={uploadingImage !== null}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}