'use client'

import React, { useState, useEffect } from 'react'

interface AboutPageContent {
  mainTitle: string
  description1: string
  description2: string
  digitalTitle: string
  digitalDescription: string
  chartPercentage: number
  chartLabel: string
  backgroundColor?: string
  vision?: string
  mission?: string
  values?: string
}

interface AboutPageEditorProps {
  onSave: (content: AboutPageContent) => void
}

const backgroundColors: Record<string, string> = {
  'blue-50': 'bg-blue-50',
  'green-50': 'bg-green-50',
  'purple-50': 'bg-purple-50',
  'gray-50': 'bg-gray-50',
  'yellow-50': 'bg-yellow-50'
}

export default function AboutPageEditor({ onSave }: AboutPageEditorProps) {
  const [content, setContent] = useState<AboutPageContent>({
    mainTitle: 'À Propos d\'Aliz Strategy',
    description1: 'Implanté à Abidjan, Aliz Strategy se positionne comme un partenaire essentiel pour les entreprises et institutions. Notre mission est de catalyser votre succès par l\'innovation, la transformation numérique et le développement stratégique.',
    description2: 'Notre expertise s\'étend au-delà des frontières ivoiriennes. Nous combinons une fine connaissance des marchés locaux à une perspective internationale pour fournir des solutions sur mesure qui génèrent des résultats tangibles et un avantage compétitif durable sur l\'ensemble du continent.',
    digitalTitle: 'La transformation digitale : un levier de croissance majeur',
    digitalDescription: 'Selon les données gouvernementales, la digitalisation est perçue comme un atout clé pour la rentabilité. C\'est au cœur de notre approche pour rendre votre organisation plus agile et connectée.',
    chartPercentage: 79,
    chartLabel: 'Atout pour la croissance',
    backgroundColor: 'blue-50',
    vision: 'Démocratiser l\'accès au conseil de haut niveau grâce aux technologies, afin de catalyser la réussite des organisations de toutes tailles.',
    mission: 'Accompagner de manière personnalisée les entreprises – du grand groupe à la startup innovante, en passant par les PME et les institutions publiques – pour les aider à atteindre leurs objectifs. En fournissant des conseils stratégiques sur mesure et à fort impact, via une approche flexible s\'appuyant sur une plateforme digitale de pointe.',
    values: 'Guidée par des valeurs d\'excellence, d\'intégrité, d\'innovation et d\'impact, ALIZ STRATEGY combine expertise locale et standards internationaux pour offrir des solutions innovantes parfaitement adaptées au contexte de chacun.'
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Charger le contenu actuel
  useEffect(() => {
    fetch('/api/admin/about')
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
      alert('Page À Propos mise à jour avec succès!')
    } catch (error) {
      alert('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
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
      {/* Preview Section */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Aperçu de la page À Propos</h3>
        </div>
        <div className="p-6">
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{content.mainTitle}</h2>
              <p className="text-gray-600 mb-3 text-sm">{content.description1}</p>
              <p className="text-gray-600 text-sm">{content.description2}</p>
            </div>
            <div className={`${backgroundColors[content.backgroundColor || 'blue-50'] || 'bg-blue-50'} p-6 rounded-lg`}>
              <h3 className="text-lg font-semibold text-blue-600 mb-3">{content.digitalTitle}</h3>
              <p className="text-gray-600 text-sm mb-4">{content.digitalDescription}</p>
              <div className="relative h-32 w-32 mx-auto">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{content.chartPercentage}%</div>
                    <div className="text-xs text-gray-600">{content.chartLabel}</div>
                  </div>
                </div>
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#E5E7EB"
                    strokeWidth="16"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#2563EB"
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - content.chartPercentage / 100)}`}
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Modifier le contenu de la page À Propos</h3>
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
          {/* Section principale */}
          <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 flex items-center">
              <i className="fas fa-info-circle mr-2 text-blue-600"></i>
              Section principale
            </h4>
            
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
                Premier paragraphe
              </label>
              <textarea
                value={content.description1}
                onChange={(e) => setContent({ ...content, description1: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deuxième paragraphe
              </label>
              <textarea
                value={content.description2}
                onChange={(e) => setContent({ ...content, description2: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={4}
              />
            </div>
          </div>

          {/* Section transformation digitale */}
          <div className="space-y-4 p-6 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 flex items-center">
              <i className="fas fa-chart-pie mr-2 text-blue-600"></i>
              Section transformation digitale
            </h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre de la section
              </label>
              <input
                type="text"
                value={content.digitalTitle}
                onChange={(e) => setContent({ ...content, digitalTitle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={content.digitalDescription}
                onChange={(e) => setContent({ ...content, digitalDescription: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pourcentage du graphique
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={content.chartPercentage}
                  onChange={(e) => setContent({ ...content, chartPercentage: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Libellé du graphique
                </label>
                <input
                  type="text"
                  value={content.chartLabel}
                  onChange={(e) => setContent({ ...content, chartLabel: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Section Vision, Mission et Valeurs */}
          <div className="space-y-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 flex items-center">
              <i className="fas fa-bullseye mr-2 text-blue-600"></i>
              Vision, Mission et Valeurs
            </h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-eye mr-1 text-blue-500"></i>
                Vision
              </label>
              <textarea
                value={content.vision || ''}
                onChange={(e) => setContent({ ...content, vision: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
                placeholder="La vision de l'entreprise..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-rocket mr-1 text-green-500"></i>
                Mission
              </label>
              <textarea
                value={content.mission || ''}
                onChange={(e) => setContent({ ...content, mission: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={4}
                placeholder="La mission de l'entreprise..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-heart mr-1 text-red-500"></i>
                Valeurs
              </label>
              <textarea
                value={content.values || ''}
                onChange={(e) => setContent({ ...content, values: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
                placeholder="Les valeurs de l'entreprise..."
              />
            </div>
          </div>

          {/* Options avancées */}
          <div className="space-y-4 p-6 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-800 flex items-center">
              <i className="fas fa-cog mr-2 text-gray-600"></i>
              Options avancées
            </h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Couleur de fond de la section digitale
              </label>
              <select
                value={content.backgroundColor || 'blue-50'}
                onChange={(e) => setContent({ ...content, backgroundColor: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="blue-50">Bleu clair (défaut)</option>
                <option value="green-50">Vert clair</option>
                <option value="purple-50">Violet clair</option>
                <option value="gray-50">Gris clair</option>
                <option value="yellow-50">Jaune clair</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}