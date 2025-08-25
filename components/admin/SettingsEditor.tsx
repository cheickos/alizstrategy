'use client'

import React, { useState, useEffect, useRef } from 'react'

interface Settings {
  logoUrl: string
  faviconUrl: string
  siteName: string
  siteDescription: string
}

interface SettingsEditorProps {
  onSave?: () => void
}

export default function SettingsEditor({ onSave }: SettingsEditorProps) {
  const [settings, setSettings] = useState<Settings>({
    logoUrl: '',
    faviconUrl: '',
    siteName: '',
    siteDescription: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const faviconInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      const data = await response.json()
      if (data.settings) {
        setSettings(data.settings)
      }
      setLoading(false)
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error)
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon') => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        if (type === 'logo') {
          setSettings({ ...settings, logoUrl: data.fileUrl })
        } else {
          setSettings({ ...settings, faviconUrl: data.fileUrl })
        }
      } else {
        alert('Erreur lors du téléchargement du fichier')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors du téléchargement')
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        alert('Paramètres sauvegardés avec succès!')
        if (onSave) onSave()
      } else {
        alert('Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Erreur:', error)
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
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Paramètres du site
          </h3>
          <button
            onClick={() => window.open('/', '_blank')}
            className="text-gray-600 hover:text-gray-800"
          >
            <i className="fas fa-external-link-alt mr-2"></i>
            Voir le site
          </button>
        </div>

        <div className="space-y-6">
          {/* Logo du site */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo du site
            </label>
            <div className="flex items-center space-x-4">
              {settings.logoUrl && (
                <div className="w-32 h-32 border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                  <img
                    src={settings.logoUrl}
                    alt="Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className="flex-1">
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'logo')}
                  className="hidden"
                />
                <button
                  onClick={() => logoInputRef.current?.click()}
                  className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg hover:shadow-lg transition-shadow"
                >
                  <i className="fas fa-upload mr-2"></i>
                  Télécharger un logo
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  Formats acceptés: PNG, JPG, SVG. Taille recommandée: 200x60px
                </p>
              </div>
            </div>
          </div>

          {/* Favicon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Favicon
            </label>
            <div className="flex items-center space-x-4">
              {settings.faviconUrl && (
                <div className="w-16 h-16 border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                  <img
                    src={settings.faviconUrl}
                    alt="Favicon"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className="flex-1">
                <input
                  ref={faviconInputRef}
                  type="file"
                  accept="image/x-icon,image/png,image/jpeg"
                  onChange={(e) => handleImageUpload(e, 'favicon')}
                  className="hidden"
                />
                <button
                  onClick={() => faviconInputRef.current?.click()}
                  className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg hover:shadow-lg transition-shadow"
                >
                  <i className="fas fa-upload mr-2"></i>
                  Télécharger un favicon
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  Formats acceptés: ICO, PNG. Taille recommandée: 32x32px
                </p>
              </div>
            </div>
          </div>

          {/* Nom du site */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du site
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Aliz Strategy"
            />
          </div>

          {/* Description du site */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description du site
            </label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={3}
              placeholder="Votre Allié Stratégique pour une Croissance Durable"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50"
          >
            {saving ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Sauvegarde...
              </>
            ) : (
              <>
                <i className="fas fa-save mr-2"></i>
                Sauvegarder les paramètres
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Aperçu</h4>
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <div className="flex items-center space-x-4 mb-4">
            {settings.faviconUrl && (
              <img
                src={settings.faviconUrl}
                alt="Favicon"
                className="w-8 h-8"
              />
            )}
            <span className="text-gray-600">Onglet du navigateur</span>
          </div>
          <div className="border-t border-gray-200 pt-4">
            {settings.logoUrl && (
              <img
                src={settings.logoUrl}
                alt="Logo"
                className="h-16 mb-4"
              />
            )}
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {settings.siteName || 'Nom du site'}
            </h1>
            <p className="text-gray-600">
              {settings.siteDescription || 'Description du site'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}