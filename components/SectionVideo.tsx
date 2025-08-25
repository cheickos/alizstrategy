'use client'

import React, { useState, useEffect } from 'react'

interface SectionVideoProps {
  section: string
  className?: string
  isAbsolute?: boolean
}

export default function SectionVideo({ section, className = '', isAbsolute = false }: SectionVideoProps) {
  const [videoUrl, setVideoUrl] = useState<string>('')
  const [videoType, setVideoType] = useState<'url' | 'local'>('url')
  const [thumbnailPath, setThumbnailPath] = useState<string>('')
  const [isActive, setIsActive] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    fetchSectionVideo()
  }, [section])

  const fetchSectionVideo = async () => {
    try {
      const response = await fetch(`/api/section-videos/${section}`)
      if (response.ok) {
        const data = await response.json()
        if (data.isActive) {
          // Gérer les deux types de vidéo
          if (data.videoType === 'local' && data.localVideoPath) {
            setVideoUrl(data.localVideoPath)
            setVideoType('local')
            if (data.thumbnailPath) {
              setThumbnailPath(data.thumbnailPath)
            }
          } else if (data.videoUrl) {
            setVideoUrl(data.videoUrl)
            setVideoType('url')
          }
          setIsActive(true)
        }
      }
    } catch (error) {
      console.error('Error fetching section video:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !isActive || !videoUrl) {
    return null
  }

  // Si c'est une position absolue (pour la page d'accueil)
  if (isAbsolute) {
    return (
      <div className={`${className}`}>
        {videoType === 'local' ? (
          <video
            src={videoUrl}
            poster={thumbnailPath || "/images/video-placeholder.svg"}
            className="rounded-lg shadow-lg bg-black"
            style={{ width: '320px', height: '180px' }}
            controls
            preload="metadata"
          />
        ) : (
          <iframe
            src={videoUrl}
            className="rounded-lg shadow-lg"
            style={{ width: '320px', height: '180px' }}
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            title={`Vidéo de présentation - ${section}`}
          />
        )}
      </div>
    )
  }

  return (
    <div className={`section-video-container ${className}`}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-sm">
          {videoType === 'local' ? (
            <video
              src={videoUrl}
              poster={thumbnailPath || "/images/video-placeholder.svg"}
              className="w-full h-full bg-black"
              style={{ minHeight: '200px', maxHeight: '280px' }}
              controls
              preload="metadata"
            />
          ) : (
            <iframe
              src={videoUrl}
              className="w-full h-full"
              style={{ minHeight: '200px', maxHeight: '280px' }}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              title={`Vidéo de présentation - ${section}`}
            />
          )}
        </div>
      </div>
    </div>
  )
}