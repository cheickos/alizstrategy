'use client'

import React, { useState, useRef, useEffect } from 'react'

interface HomePageContent {
  title: string
  subtitle: string
  buttonText: string
  backgroundImage: string
  backgroundColor?: string
}

interface HomePageEditorProps {
  onSave: (content: HomePageContent) => void
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

export default function HomePageEditor({ onSave }: HomePageEditorProps) {
  const [content, setContent] = useState<HomePageContent>({
    title: 'Votre Allié Stratégique pour une Croissance Durable',
    subtitle: 'Nous transformons les défis en opportunités grâce à des solutions innovantes, digitales et sur mesure.',
    buttonText: 'Explorer nos expertises',
    backgroundImage: 'https://images.unsplash.com/photo-1543092587-d8b8feaf362b?q=80&w=2000&auto=format&fit=crop',
    backgroundColor: 'white'
  })
  const [loading, setLoading] = useState(true)
  const [previewImage, setPreviewImage] = useState(content.backgroundImage)

  // Charger le contenu actuel
  useEffect(() => {
    fetch('/api/admin/homepage')
      .then(res => res.json())
      .then(data => {
        if (data.content) {
          setContent(data.content)
          setPreviewImage(data.content.backgroundImage)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])
  
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setPreviewImage(result)
        setContent({ ...content, backgroundImage: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(content)
      alert('Page d\'accueil mise à jour avec succès!')
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
          <h3 className="text-lg font-semibold text-gray-800">Aperçu de la page d'accueil</h3>
        </div>
        <div 
          className="h-64 flex items-center justify-center text-white relative"
          style={{
            backgroundImage: `linear-gradient(rgba(26, 54, 93, 0.7), rgba(26, 54, 93, 0.7)), url('${previewImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="text-center px-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{content.title || 'Titre de la page'}</h2>
            <p className="text-sm md:text-base mb-4 opacity-90">{content.subtitle || 'Sous-titre'}</p>
            <button className="bg-white text-blue-600 px-6 py-2 rounded-full text-sm font-semibold">
              {content.buttonText || 'Texte du bouton'}
            </button>
          </div>
        </div>
      </div>

      {/* Editor Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Modifier le contenu de la page d'accueil</h3>
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
          {/* Title Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre principal
            </label>
            <input
              type="text"
              value={content.title}
              onChange={(e) => setContent({ ...content, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Entrez le titre principal..."
            />
            <p className="text-sm text-gray-500 mt-1">
              Ce titre apparaît en grand sur la page d'accueil
            </p>
          </div>

          {/* Subtitle Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sous-titre / Description
            </label>
            <textarea
              value={content.subtitle}
              onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={3}
              placeholder="Entrez le sous-titre..."
            />
            <p className="text-sm text-gray-500 mt-1">
              Description qui apparaît sous le titre principal
            </p>
          </div>

          {/* Button Text Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Texte du bouton d'action
            </label>
            <input
              type="text"
              value={content.buttonText}
              onChange={(e) => setContent({ ...content, buttonText: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Entrez le texte du bouton..."
            />
            <p className="text-sm text-gray-500 mt-1">
              Le bouton redirige vers la page des expertises
            </p>
          </div>

          {/* Background Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image de fond
            </label>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <i className="fas fa-upload mr-2"></i>
                  Changer l'image
                </button>
                <span className="text-sm text-gray-500">
                  Recommandé: 2000x1000px minimum
                </span>
              </div>
              
              {/* Image URL Field */}
              <div>
                <input
                  type="url"
                  value={content.backgroundImage}
                  onChange={(e) => {
                    setContent({ ...content, backgroundImage: e.target.value })
                    setPreviewImage(e.target.value)
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ou entrez l'URL de l'image..."
                />
              </div>
            </div>
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
            <p className="text-sm text-gray-500 mt-1">
              Couleur de fond de la section sous le hero banner
            </p>
          </div>

          {/* SEO Preview */}
          <div className="pt-6 border-t border-gray-200">
            <h4 className="text-md font-semibold text-gray-800 mb-3">Aperçu SEO</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-blue-600 text-lg">{content.title}</div>
              <div className="text-green-700 text-sm">www.alizstrategy.com</div>
              <div className="text-gray-600 text-sm mt-1">{content.subtitle}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}