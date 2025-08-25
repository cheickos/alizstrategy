'use client'

import React, { useState, useEffect } from 'react'

interface Value {
  id: string
  icon: string
  color: string
  bgColor: string
  title: string
  description: string
  imageUrl?: string
}

interface Statistic {
  id: string
  value: string
  label: string
  color: string
}

interface ValueApplication {
  id: string
  title: string
  icon: string
  iconColor: string
  items: string[]
}

interface ValuesPageContent {
  mainTitle: string
  mainDescription: string
  values: Value[]
  philosophyTitle: string
  philosophyText: string
  statistics: Statistic[]
  howWeApplyTitle: string
  applications: ValueApplication[]
  backgroundColor?: string
}

interface ValuesPageEditorProps {
  onSave: (content: ValuesPageContent) => void
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

const valueBackgrounds: Record<string, string> = {
  'bg-blue-100': 'bg-blue-100',
  'bg-teal-100': 'bg-teal-100',
  'bg-indigo-100': 'bg-indigo-100'
}

const textColors: Record<string, string> = {
  'text-blue-600': 'text-blue-600',
  'text-teal-600': 'text-teal-600',
  'text-indigo-600': 'text-indigo-600',
  'text-green-500': 'text-green-500'
}

export default function ValuesPageEditor({ onSave }: ValuesPageEditorProps) {
  const [content, setContent] = useState<ValuesPageContent>({
    mainTitle: 'Le Socle de Notre Engagement',
    mainDescription: 'Cinq valeurs fondamentales qui guident chacune de nos actions et collaborations.',
    values: [
      {
        id: '1',
        icon: 'fa-hands-helping',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        title: 'Engagement',
        description: 'Un dévouement total à la réussite et à la satisfaction de nos clients.'
      },
      {
        id: '2',
        icon: 'fa-rocket',
        color: 'text-teal-600',
        bgColor: 'bg-teal-100',
        title: 'Innovation',
        description: 'Une approche proactive pour intégrer les dernières technologies et tendances.'
      },
      {
        id: '3',
        icon: 'fa-users',
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-100',
        title: 'Collaboration',
        description: 'Un travail en étroite coopération, fondé sur l\'écoute et la co-création.'
      },
      {
        id: '4',
        icon: 'fa-shield-alt',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        title: 'Intégrité',
        description: 'Le maintien des normes éthiques les plus élevées dans toutes nos interactions.'
      },
      {
        id: '5',
        icon: 'fa-medal',
        color: 'text-teal-600',
        bgColor: 'bg-teal-100',
        title: 'Excellence',
        description: 'Une quête constante de dépassement pour fournir une valeur ajoutée mesurable.'
      }
    ],
    philosophyTitle: 'Notre Philosophie',
    philosophyText: 'Ces valeurs ne sont pas de simples mots sur une page. Elles représentent notre ADN, notre façon de penser et d\'agir au quotidien. Chaque membre de l\'équipe Aliz Strategy s\'engage à incarner ces principes dans chaque projet, chaque interaction et chaque décision.',
    statistics: [
      { id: '1', value: '100%', label: 'Satisfaction client visée', color: 'text-blue-600' },
      { id: '2', value: '24/7', label: 'Disponibilité et réactivité', color: 'text-teal-600' },
      { id: '3', value: '360°', label: 'Vision globale de vos enjeux', color: 'text-indigo-600' }
    ],
    howWeApplyTitle: 'Comment Nous Vivons Nos Valeurs',
    applications: [
      {
        id: '1',
        title: 'Dans Nos Relations Clients',
        icon: 'fa-check-circle',
        iconColor: 'text-green-500',
        items: [
          'Écoute active et compréhension approfondie de vos besoins',
          'Transparence totale dans nos communications et nos actions',
          'Engagement sur des résultats mesurables et tangibles'
        ]
      },
      {
        id: '2',
        title: 'Dans Notre Équipe',
        icon: 'fa-check-circle',
        iconColor: 'text-green-500',
        items: [
          'Culture du partage de connaissances et d\'expertise',
          'Formation continue pour rester à la pointe',
          'Esprit d\'équipe et entraide permanente'
        ]
      }
    ],
    backgroundColor: 'white'
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingValue, setEditingValue] = useState<string | null>(null)
  const [editingStat, setEditingStat] = useState<string | null>(null)
  const [editingApp, setEditingApp] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState<string | null>(null)

  // Charger le contenu actuel
  useEffect(() => {
    fetch('/api/admin/values')
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
      alert('Page Nos valeurs mise à jour avec succès!')
      // Forcer le rechargement de la page après un court délai
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (error) {
      alert('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const updateValue = (valueId: string, field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      values: prev.values.map(val => 
        val.id === valueId ? { ...val, [field]: value } : val
      )
    }))
  }

  const updateStatistic = (statId: string, field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      statistics: prev.statistics.map(stat => 
        stat.id === statId ? { ...stat, [field]: value } : stat
      )
    }))
  }

  const updateApplication = (appId: string, index: number, value: string) => {
    setContent(prev => ({
      ...prev,
      applications: prev.applications.map(app => 
        app.id === appId 
          ? {
              ...app,
              items: app.items.map((item, i) => i === index ? value : item)
            }
          : app
      )
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, valueId: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    console.log('Starting upload for value:', valueId)
    console.log('File:', file.name, file.type, file.size)

    setUploadingImage(valueId)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'value')

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })

      console.log('Upload response status:', response.status)
      const data = await response.json()
      console.log('Upload response data:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      updateValue(valueId, 'imageUrl', data.fileUrl)
      console.log('Image URL updated for value:', valueId, data.fileUrl)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Erreur lors du téléchargement de l\'image: ' + (error instanceof Error ? error.message : 'Erreur inconnue'))
    } finally {
      setUploadingImage(null)
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
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Modifier la page Nos valeurs</h3>
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
                Titre principal
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

      {/* Values */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800">Les 5 Valeurs</h4>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {content.values.map((value) => (
              <div key={value.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className={`w-12 h-12 rounded-full ${valueBackgrounds[value.bgColor] || value.bgColor} flex items-center justify-center`}>
                    <i className={`fas ${value.icon} ${textColors[value.color] || value.color} text-xl`}></i>
                  </div>
                  <button
                    onClick={() => setEditingValue(editingValue === value.id ? null : value.id)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    <i className={`fas fa-${editingValue === value.id ? 'minus' : 'edit'}`}></i>
                  </button>
                </div>
                <h5 className="font-semibold text-gray-800 mb-2">{value.title}</h5>
                <p className="text-sm text-gray-600">{value.description}</p>

                {editingValue === value.id && (
                  <div className="mt-4 space-y-3 pt-4 border-t border-gray-200">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Titre</label>
                      <input
                        type="text"
                        value={value.title}
                        onChange={(e) => updateValue(value.id, 'title', e.target.value)}
                        className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={value.description}
                        onChange={(e) => updateValue(value.id, 'description', e.target.value)}
                        className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Icône</label>
                      <input
                        type="text"
                        value={value.icon}
                        onChange={(e) => updateValue(value.id, 'icon', e.target.value)}
                        className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="fa-hands-helping"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Image</label>
                      {value.imageUrl ? (
                        <div className="space-y-2">
                          <img src={value.imageUrl} alt={value.title} className="w-full h-32 object-cover rounded" />
                          <button
                            onClick={() => updateValue(value.id, 'imageUrl', '')}
                            className="text-xs text-red-600 hover:text-red-700"
                          >
                            <i className="fas fa-trash mr-1"></i>Supprimer l'image
                          </button>
                        </div>
                      ) : (
                        <div className="relative">
                          <input
                            type="file"
                            id={`value-image-${value.id}`}
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, value.id)}
                            className="hidden"
                          />
                          <label
                            htmlFor={`value-image-${value.id}`}
                            className="block w-full p-2 text-center text-xs border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-primary transition-colors"
                          >
                            {uploadingImage === value.id ? (
                              <><i className="fas fa-spinner fa-spin mr-1"></i>Téléchargement...</>
                            ) : (
                              <><i className="fas fa-upload mr-1"></i>Télécharger une image</>
                            )}
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800">Section Philosophie</h4>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre de la philosophie
            </label>
            <input
              type="text"
              value={content.philosophyTitle}
              onChange={(e) => setContent({ ...content, philosophyTitle: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Texte de la philosophie
            </label>
            <textarea
              value={content.philosophyText}
              onChange={(e) => setContent({ ...content, philosophyText: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={4}
            />
          </div>

          {/* Statistics */}
          <div className="mt-6">
            <h5 className="font-medium text-gray-800 mb-3">Statistiques</h5>
            <div className="grid md:grid-cols-3 gap-4">
              {content.statistics.map((stat) => (
                <div key={stat.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className={`text-2xl font-bold ${textColors[stat.color] || stat.color} mb-1`}>{stat.value}</div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  {editingStat === stat.id && (
                    <div className="mt-3 space-y-2">
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => updateStatistic(stat.id, 'value', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        placeholder="100%"
                      />
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => updateStatistic(stat.id, 'label', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      />
                    </div>
                  )}
                  <button
                    onClick={() => setEditingStat(editingStat === stat.id ? null : stat.id)}
                    className="mt-2 text-xs text-gray-500 hover:text-gray-700"
                  >
                    <i className={`fas fa-${editingStat === stat.id ? 'check' : 'edit'}`}></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How We Apply Values */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800">Comment nous vivons nos valeurs</h4>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre de la section
            </label>
            <input
              type="text"
              value={content.howWeApplyTitle}
              onChange={(e) => setContent({ ...content, howWeApplyTitle: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {content.applications.map((app) => (
            <div key={app.id} className="bg-gray-50 p-6 rounded-lg">
              <h5 className="font-semibold text-gray-800 mb-4 flex items-center">
                <i className={`fas ${app.icon} ${app.iconColor} mr-2`}></i>
                {app.title}
              </h5>
              <div className="space-y-2">
                {app.items.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <i className="fas fa-angle-right text-blue-600 mt-1 mr-2"></i>
                    {editingApp === app.id ? (
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateApplication(app.id, index, e.target.value)}
                        className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    ) : (
                      <span className="text-gray-600 text-sm">{item}</span>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setEditingApp(editingApp === app.id ? null : app.id)}
                className="mt-3 text-sm text-gray-500 hover:text-gray-700"
              >
                <i className={`fas fa-${editingApp === app.id ? 'check' : 'edit'} mr-1`}></i>
                {editingApp === app.id ? 'Valider' : 'Modifier'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}