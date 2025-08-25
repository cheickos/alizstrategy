'use client'

import React, { useState } from 'react'

interface ContentEditorProps {
  sectionName: string
  initialContent?: any
  onSave: (content: any) => void
}

export default function ContentEditor({ sectionName, initialContent = {}, onSave }: ContentEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [files, setFiles] = useState<File[]>([])
  const [saving, setSaving] = useState(false)

  const handleTextChange = (field: string, value: string) => {
    setContent({ ...content, [field]: value })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave({ ...content, files })
      alert('Contenu sauvegardé avec succès!')
    } catch (error) {
      alert('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = (itemId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet élément?')) {
      // TODO: Implement delete
      console.log('Delete item:', itemId)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">
            Gestion de la section: {sectionName}
          </h3>
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
            Titre de la section
          </label>
          <input
            type="text"
            value={content.title || ''}
            onChange={(e) => handleTextChange('title', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Entrez le titre..."
          />
        </div>

        {/* Description Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={content.description || ''}
            onChange={(e) => handleTextChange('description', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            rows={4}
            placeholder="Entrez la description..."
          />
        </div>

        {/* Content Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contenu principal
          </label>
          <div className="border border-gray-300 rounded-lg">
            <div className="bg-gray-50 p-2 border-b border-gray-300">
              <button 
                type="button"
                onClick={(e) => e.preventDefault()}
                className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 rounded mr-2"
              >
                <i className="fas fa-bold"></i>
              </button>
              <button 
                type="button"
                onClick={(e) => e.preventDefault()}
                className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 rounded mr-2"
              >
                <i className="fas fa-italic"></i>
              </button>
              <button 
                type="button"
                onClick={(e) => e.preventDefault()}
                className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 rounded mr-2"
              >
                <i className="fas fa-underline"></i>
              </button>
              <button 
                type="button"
                onClick={(e) => e.preventDefault()}
                className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 rounded mr-2"
              >
                <i className="fas fa-list-ul"></i>
              </button>
              <button 
                type="button"
                onClick={(e) => e.preventDefault()}
                className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 rounded mr-2"
              >
                <i className="fas fa-link"></i>
              </button>
              <button 
                type="button"
                onClick={(e) => e.preventDefault()}
                className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 rounded"
              >
                <i className="fas fa-image"></i>
              </button>
            </div>
            <textarea
              value={content.mainContent || ''}
              onChange={(e) => handleTextChange('mainContent', e.target.value)}
              className="w-full px-4 py-3 focus:outline-none"
              rows={10}
              placeholder="Entrez le contenu principal..."
            />
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Télécharger des fichiers
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <i className="fas fa-cloud-upload-alt mr-2"></i>
              Choisir des fichiers
            </label>
            <p className="text-sm text-gray-500 mt-2">
              PDF, DOC, DOCX, JPG, PNG (Max 10MB)
            </p>
            {files.length > 0 && (
              <div className="mt-4 text-left">
                <p className="font-medium text-gray-700 mb-2">Fichiers sélectionnés:</p>
                <ul className="space-y-1">
                  {files.map((file, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      <i className="fas fa-file mr-2"></i>
                      {file.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Existing Items */}
        {content.items && content.items.length > 0 && (
          <div>
            <h4 className="text-md font-semibold text-gray-800 mb-4">Éléments existants</h4>
            <div className="space-y-3">
              {content.items.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h5 className="font-medium text-gray-800">{item.title}</h5>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        alert('Fonctionnalité d\'édition à venir')
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        handleDelete(item.id)
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Item Button */}
        <div className="pt-4">
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault()
              alert('Fonctionnalité d\'ajout à venir')
            }}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors"
          >
            <i className="fas fa-plus mr-2"></i>
            Ajouter un nouvel élément
          </button>
        </div>
      </div>
    </div>
  )
}