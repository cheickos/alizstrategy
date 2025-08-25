'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Video, Save, RefreshCw, Upload, Link } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface SectionVideo {
  id: string
  section: string
  videoUrl: string
  videoType?: 'url' | 'local'
  localVideoPath?: string
  thumbnailPath?: string
  title?: string
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

const SECTION_LABELS: Record<string, string> = {
  'home': 'Accueil',
  'about': 'À propos',
  'expertise': 'Pôles d\'expertise',
  'publications': 'Publications',
  'kit-entreprise': 'Kit Entreprise',
  'news': 'Nos réalisations',
  'actualites-recentes': 'Actualités récentes',
  'contact': 'Contact'
}

export default function SectionVideosEditor() {
  const [videos, setVideos] = useState<SectionVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [uploading, setUploading] = useState<string | null>(null)
  const [videoTypes, setVideoTypes] = useState<Record<string, 'url' | 'local'>>({})
  const [localVideoPaths, setLocalVideoPaths] = useState<Record<string, string>>({})
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/section-videos')
      if (response.ok) {
        const data = await response.json()
        setVideos(data)
        // Initialiser les types de vidéo et les chemins locaux
        const types: Record<string, 'url' | 'local'> = {}
        const paths: Record<string, string> = {}
        data.forEach((video: SectionVideo) => {
          types[video.section] = video.videoType || 'url'
          if (video.localVideoPath) {
            paths[video.section] = video.localVideoPath
          }
        })
        setVideoTypes(types)
        setLocalVideoPaths(paths)
      } else {
        toast.error('Erreur lors du chargement des vidéos')
      }
    } catch (error) {
      console.error('Error fetching videos:', error)
      toast.error('Erreur lors du chargement des vidéos')
    } finally {
      setLoading(false)
    }
  }


  // Générer une miniature à partir de la vidéo
  const generateVideoThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      video.preload = 'metadata'
      video.muted = true
      
      const url = URL.createObjectURL(file)
      
      video.onloadedmetadata = () => {
        // Aller à 1 seconde dans la vidéo pour avoir une meilleure frame
        video.currentTime = Math.min(1, video.duration / 2)
      }
      
      video.onseeked = () => {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(URL.createObjectURL(blob))
            } else {
              reject(new Error('Failed to generate thumbnail'))
            }
            URL.revokeObjectURL(url)
          }, 'image/jpeg', 0.8)
        } else {
          reject(new Error('Canvas context not available'))
          URL.revokeObjectURL(url)
        }
      }
      
      video.onerror = () => {
        reject(new Error('Failed to load video'))
        URL.revokeObjectURL(url)
      }
      
      video.src = url
    })
  }

  const handleVideoUpload = async (section: string, file: File) => {
    setUploading(section)
    try {
      // Vérifier la taille du fichier (100MB max)
      const maxSize = 100 * 1024 * 1024
      if (file.size > maxSize) {
        toast.error('Fichier trop volumineux. Taille maximale: 100MB')
        setUploading(null)
        return
      }

      // Générer la miniature
      let thumbnailBlob: Blob | null = null
      try {
        const thumbnailUrl = await generateVideoThumbnail(file)
        const thumbnailResponse = await fetch(thumbnailUrl)
        thumbnailBlob = await thumbnailResponse.blob()
        URL.revokeObjectURL(thumbnailUrl)
      } catch (error) {
        console.error('Error generating thumbnail:', error)
      }

      const formData = new FormData()
      formData.append('video', file)
      formData.append('section', section)
      if (thumbnailBlob) {
        formData.append('thumbnail', thumbnailBlob, `${section}_thumbnail.jpg`)
      }

      console.log('Uploading video:', file.name, 'Size:', file.size, 'Type:', file.type)

      const response = await fetch('/api/admin/upload-video', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        const titleInput = document.getElementById(`title-${section}`) as HTMLInputElement
        const descInput = document.getElementById(`desc-${section}`) as HTMLTextAreaElement
        
        // Mettre à jour l'état local
        setLocalVideoPaths({ ...localVideoPaths, [section]: data.path })
        
        // Mettre à jour avec le chemin de la vidéo locale et la miniature
        await handleVideoUpdate(section, data.path, titleInput?.value, descInput?.value, 'local', data.thumbnailPath)
        toast.success('Vidéo téléchargée avec succès')
        
        // Rafraîchir les vidéos
        await fetchVideos()
      } else {
        console.error('Upload error:', data)
        toast.error(data.error || 'Erreur lors du téléchargement de la vidéo')
      }
    } catch (error) {
      console.error('Error uploading video:', error)
      toast.error('Erreur de connexion lors du téléchargement')
    } finally {
      setUploading(null)
    }
  }

  const handleVideoUpdate = async (section: string, videoUrl: string, title?: string, description?: string, videoType?: 'url' | 'local', thumbnailPath?: string) => {
    setSaving(section)
    try {
      const response = await fetch(`/api/section-videos/${section}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          videoUrl, 
          title, 
          description,
          videoType: videoType || videoTypes[section] || 'url',
          localVideoPath: videoType === 'local' ? videoUrl : undefined,
          thumbnailPath: thumbnailPath
        }),
      })

      if (response.ok) {
        const updatedVideo = await response.json()
        setVideos(videos.map(v => v.section === section ? updatedVideo : v))
        toast.success('Vidéo mise à jour avec succès')
      } else {
        toast.error('Erreur lors de la mise à jour de la vidéo')
      }
    } catch (error) {
      console.error('Error updating video:', error)
      toast.error('Erreur lors de la mise à jour de la vidéo')
    } finally {
      setSaving(null)
    }
  }

  const handleToggleStatus = async (section: string) => {
    try {
      const response = await fetch(`/api/section-videos/${section}/toggle`, {
        method: 'PATCH',
      })

      if (response.ok) {
        const updatedVideo = await response.json()
        setVideos(videos.map(v => v.section === section ? updatedVideo : v))
        toast.success('Statut de la vidéo mis à jour')
      } else {
        toast.error('Erreur lors de la mise à jour du statut')
      }
    } catch (error) {
      console.error('Error toggling status:', error)
      toast.error('Erreur lors de la mise à jour du statut')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Video className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Gestion des vidéos de présentation</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {SECTION_LABELS[video.section] || video.section}
                </CardTitle>
                <Switch
                  checked={video.isActive}
                  onCheckedChange={() => handleToggleStatus(video.section)}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {/* Choix du type de vidéo */}
              <div className="flex gap-4 mb-4">
                <Button
                  type="button"
                  variant={videoTypes[video.section] === 'url' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setVideoTypes({ ...videoTypes, [video.section]: 'url' })}
                >
                  <Link className="w-4 h-4 mr-2" />
                  URL YouTube
                </Button>
                <Button
                  type="button"
                  variant={videoTypes[video.section] === 'local' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setVideoTypes({ ...videoTypes, [video.section]: 'local' })}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Fichier Local
                </Button>
              </div>

              {/* Input pour URL */}
              {videoTypes[video.section] === 'url' ? (
                <div>
                  <Label htmlFor={`url-${video.section}`}>URL de la vidéo YouTube</Label>
                  <Input
                    id={`url-${video.section}`}
                    type="url"
                    placeholder="https://www.youtube.com/embed/..."
                    defaultValue={video.videoType !== 'local' ? video.videoUrl : ''}
                  />
                </div>
              ) : (
                /* Input pour fichier local */
                <div>
                  <Label htmlFor={`file-${video.section}`}>Télécharger une vidéo</Label>
                  <div className="flex gap-2">
                    <Input
                      ref={(el) => { fileInputRefs.current[video.section] = el }}
                      id={`file-${video.section}`}
                      type="file"
                      accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*,.mp4,.webm,.ogg,.mov,.avi,.mkv"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          console.log('Selected file:', file.name, 'Type:', file.type, 'Size:', file.size)
                          handleVideoUpload(video.section, file)
                        }
                      }}
                      disabled={uploading === video.section}
                    />
                  </div>
                  {(localVideoPaths[video.section] || video.localVideoPath) && (
                    <p className="text-sm text-gray-500 mt-1">
                      Vidéo actuelle : {(localVideoPaths[video.section] || video.localVideoPath)?.split('/').pop()}
                    </p>
                  )}
                </div>
              )}

              <div>
                <Label htmlFor={`title-${video.section}`}>Titre (optionnel)</Label>
                <Input
                  id={`title-${video.section}`}
                  type="text"
                  placeholder="Titre de la vidéo"
                  defaultValue={video.title}
                />
              </div>

              <div>
                <Label htmlFor={`desc-${video.section}`}>Description (optionnel)</Label>
                <Textarea
                  id={`desc-${video.section}`}
                  placeholder="Description de la vidéo"
                  defaultValue={video.description}
                  rows={3}
                />
              </div>

              <Button
                onClick={() => {
                  const titleInput = document.getElementById(`title-${video.section}`) as HTMLInputElement
                  const descInput = document.getElementById(`desc-${video.section}`) as HTMLTextAreaElement
                  
                  if (videoTypes[video.section] === 'url') {
                    const urlInput = document.getElementById(`url-${video.section}`) as HTMLInputElement
                    handleVideoUpdate(
                      video.section,
                      urlInput.value,
                      titleInput.value,
                      descInput.value,
                      'url'
                    )
                  } else {
                    // Pour les vidéos locales, on sauvegarde juste les métadonnées
                    const currentPath = localVideoPaths[video.section] || video.localVideoPath
                    if (currentPath) {
                      handleVideoUpdate(
                        video.section,
                        currentPath,
                        titleInput.value,
                        descInput.value,
                        'local'
                      )
                    } else {
                      toast.error('Veuillez d\'abord télécharger une vidéo')
                    }
                  }
                }}
                disabled={saving === video.section || uploading === video.section}
                className="w-full"
              >
                {saving === video.section || uploading === video.section ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    {uploading === video.section ? 'Téléchargement...' : 'Enregistrement...'}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Enregistrer
                  </>
                )}
              </Button>

              {/* Aperçu de la vidéo */}
              {((videoTypes[video.section] === 'url' && video.videoUrl && video.videoUrl !== '') || 
                (videoTypes[video.section] === 'local' && (localVideoPaths[video.section] || video.localVideoPath))) && (
                <div className="mt-4">
                  <Label>Aperçu</Label>
                  <div className="aspect-video w-full mt-2 bg-gray-100 rounded-lg overflow-hidden">
                    {videoTypes[video.section] === 'url' ? (
                      <iframe
                        src={video.videoUrl}
                        className="w-full h-full"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    ) : (
                      <video
                        src={localVideoPaths[video.section] || video.localVideoPath}
                        className="w-full h-full"
                        controls
                        preload="metadata"
                      />
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}