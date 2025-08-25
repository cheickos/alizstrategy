'use client'

import { useState, useEffect, useRef } from 'react'
import { Chart } from 'chart.js/auto'
import SectionVideo from '../SectionVideo'

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

const backgroundColors: Record<string, string> = {
  'blue-50': 'bg-blue-50',
  'green-50': 'bg-green-50',
  'purple-50': 'bg-purple-50',
  'gray-50': 'bg-gray-50',
  'yellow-50': 'bg-yellow-50'
}

export default function AboutPage() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const [content, setContent] = useState<AboutPageContent | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch content from API
  const fetchAboutData = () => {
    fetch('/api/admin/about')
      .then(res => res.json())
      .then(data => {
        if (data.content) {
          setContent(data.content)
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
        // Fallback content
        setContent({
          mainTitle: 'À Propos d\'Aliz Strategy',
          description1: 'Implanté à Abidjan, Aliz Strategy se positionne comme un partenaire essentiel pour les entreprises et institutions. Notre mission est de catalyser votre succès par l\'innovation, la transformation numérique et le développement stratégique.',
          description2: 'Notre expertise s\'étend au-delà des frontières ivoiriennes. Nous combinons une fine connaissance des marchés locaux à une perspective internationale pour fournir des solutions sur mesure qui génèrent des résultats tangibles et un avantage compétitif durable sur l\'ensemble du continent.',
          digitalTitle: 'La transformation digitale : un levier de croissance majeur',
          digitalDescription: 'Selon les données gouvernementales, la digitalisation est perçue comme un atout clé pour la rentabilité. C\'est au cœur de notre approche pour rendre votre organisation plus agile et connectée.',
          chartPercentage: 79,
          chartLabel: 'Atout pour la croissance'
        })
      })
  }

  useEffect(() => {
    fetchAboutData()
    
    // Rafraîchir les données toutes les 5 secondes
    const interval = setInterval(fetchAboutData, 5000)
    
    // Nettoyer l'intervalle au démontage
    return () => clearInterval(interval)
  }, [])

  // Chart setup
  useEffect(() => {
    if (!chartRef.current || !content) return

    const config: any = {
      type: 'doughnut',
      data: {
        labels: [content.chartLabel, 'Autres'],
        datasets: [{
          data: [content.chartPercentage, 100 - content.chartPercentage],
          backgroundColor: ['#2563EB', '#E5E7EB'],
          borderColor: '#fff',
          borderWidth: 4,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            backgroundColor: '#111827',
            titleFont: { size: 14, weight: 'bold' },
            bodyFont: { size: 12 },
            padding: 10,
            cornerRadius: 4,
            callbacks: {
              label: (context: any) => `${context.label}: ${context.raw}%`
            }
          }
        },
        animation: {
          duration: 2000
        }
      }
    }

    const chart = new Chart(chartRef.current, config)

    return () => {
      chart.destroy()
    }
  }, [content])

  if (loading || !content) {
    return (
      <section id="about">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="container mx-auto px-6 flex justify-center items-center min-h-[400px]">
            <i className="fas fa-spinner fa-spin text-4xl text-gray-400"></i>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="about">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div data-aos="fade-right">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6 section-title">
              {content.mainTitle}
            </h2>
            <p className="text-gray-600 mb-4">
              {content.description1}
            </p>
            <p className="text-gray-600">
              {content.description2}
            </p>
            <SectionVideo section="about" className="mt-8" />
          </div>
          <div className={`${backgroundColors[content.backgroundColor || 'blue-50'] || 'bg-blue-50'} p-8 rounded-lg`} data-aos="fade-left">
            <h3 className="text-xl font-semibold text-blue-600 mb-4">
              {content.digitalTitle}
            </h3>
            <p className="text-gray-600 mb-6">
              {content.digitalDescription}
            </p>
            <div className="relative mx-auto h-[300px] w-full max-w-[300px]">
              <canvas ref={chartRef} id="digital-transformation-chart"></canvas>
            </div>
          </div>
        </div>
        
        {/* Section Vision, Mission et Valeurs */}
        {(content.vision || content.mission || content.values) && (
          <div className="mt-16 pt-16 border-t border-gray-200">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-12 text-center">
              Notre ADN
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {content.vision && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow" data-aos="fade-up" data-aos-delay="100">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <i className="fas fa-eye text-white text-xl"></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 ml-4">Notre Vision</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {content.vision}
                  </p>
                </div>
              )}
              
              {content.mission && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow" data-aos="fade-up" data-aos-delay="200">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                      <i className="fas fa-rocket text-white text-xl"></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 ml-4">Notre Mission</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {content.mission}
                  </p>
                </div>
              )}
              
              {content.values && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow" data-aos="fade-up" data-aos-delay="300">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                      <i className="fas fa-heart text-white text-xl"></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 ml-4">Nos Valeurs</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {content.values}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}