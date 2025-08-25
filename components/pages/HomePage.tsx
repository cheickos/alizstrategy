'use client'

import { useState, useEffect } from 'react'
import SectionVideo from '../SectionVideo'

interface HomePageProps {
  onPageChange: (page: string) => void
}

interface HomePageContent {
  title: string
  subtitle: string
  buttonText: string
  backgroundImage: string
  backgroundColor?: string
}

export default function HomePage({ onPageChange }: HomePageProps) {
  const [content, setContent] = useState<HomePageContent | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchHomeData = () => {
    fetch('/api/admin/homepage')
      .then(res => res.json())
      .then(data => {
        if (data.content) {
          setContent(data.content)
        }
        setLoading(false)
      })
      .catch(() => {
        // Fallback content if API fails
        setContent({
          title: 'Votre Allié Stratégique pour une Croissance Durable',
          subtitle: 'Nous transformons les défis en opportunités grâce à des solutions innovantes, digitales et sur mesure.',
          buttonText: 'Explorer nos expertises',
          backgroundImage: 'https://images.unsplash.com/photo-1543092587-d8b8feaf362b?q=80&w=2000&auto=format&fit=crop'
        })
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchHomeData()
    
    // Rafraîchir les données toutes les 5 secondes
    const interval = setInterval(fetchHomeData, 5000)
    
    // Nettoyer l'intervalle au démontage
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <section className="text-white min-h-[60vh] flex items-center justify-center rounded-lg overflow-hidden relative bg-gray-800">
        <div className="container mx-auto px-6 text-center relative z-10">
          <i className="fas fa-spinner fa-spin text-4xl text-gray-400"></i>
        </div>
      </section>
    )
  }
  
  // Use default content if no content loaded
  const displayContent = content || {
    title: 'Votre Allié Stratégique pour une Croissance Durable',
    subtitle: 'Nous transformons les défis en opportunités grâce à des solutions innovantes, digitales et sur mesure.',
    buttonText: 'Explorer nos expertises',
    backgroundImage: 'https://images.unsplash.com/photo-1543092587-d8b8feaf362b?q=80&w=2000&auto=format&fit=crop'
  }

  return (
    <>
      <section 
        className="text-white min-h-[60vh] flex items-center justify-center rounded-lg overflow-hidden relative"
        style={{
          backgroundColor: '#1a365d',
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${displayContent.backgroundImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
      <div className="container mx-auto px-6 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white drop-shadow-lg">
          {displayContent.title}
        </h1>
        <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-3xl mx-auto drop-shadow-md">
          {displayContent.subtitle}
        </p>
        <button
          onClick={() => onPageChange('expertise')}
          className="bg-gradient-to-r from-primary to-secondary text-white font-semibold px-8 py-4 rounded-full hover:shadow-lg transition-all hover:scale-105 inline-flex items-center"
        >
          {displayContent.buttonText}
          <i className="fas fa-arrow-right ml-2"></i>
        </button>
      </div>
      <div className="absolute bottom-4 left-4 z-20">
        <SectionVideo section="home" isAbsolute={true} />
      </div>
    </section>
    </>
  )
}