'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import SectionVideo from '../SectionVideo'

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

export default function ValuesPage() {
  const [content, setContent] = useState<ValuesPageContent | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchValuesData = () => {
    fetch('/api/admin/values', {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache'
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.content) {
          setContent(data.content)
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
        // Fallback content if API fails
        setContent({
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
          ]
        })
      })
  }

  useEffect(() => {
    fetchValuesData()
    
    // Rafraîchir les données toutes les 5 secondes
    const interval = setInterval(fetchValuesData, 5000)
    
    // Nettoyer l'intervalle au démontage
    return () => clearInterval(interval)
  }, [])

  if (loading || !content) {
    return (
      <section id="values" className="bg-white p-8 rounded-lg shadow-md">
        <div className="container mx-auto px-6 flex justify-center items-center min-h-[400px]">
          <i className="fas fa-spinner fa-spin text-4xl text-gray-400"></i>
        </div>
      </section>
    )
  }

  return (
    <>
      <section id="values" className={`${backgroundColors[content.backgroundColor || 'white'] || 'bg-white'} p-8 rounded-lg shadow-md`}>
        <div className="container mx-auto px-6">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl lg:text-4xl font-bold section-title">
            {content.mainTitle}
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            {content.mainDescription}
          </p>
          <SectionVideo section="values" className="mt-8" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.values.map((value, index) => (
            <div 
              key={value.id}
              className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              data-aos="fade-up" 
              data-aos-delay={index * 100}
            >
              {value.imageUrl ? (
                <div className="relative h-48 overflow-hidden">
                  <Image 
                    src={value.imageUrl} 
                    alt={value.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className={`w-12 h-12 mb-2 rounded-full ${valueBackgrounds[value.bgColor] || value.bgColor} flex items-center justify-center`}>
                      <i className={`fas ${value.icon} ${textColors[value.color] || value.color} text-xl`}></i>
                    </div>
                    <h3 className="font-semibold text-white text-lg">{value.title}</h3>
                  </div>
                </div>
              ) : (
                <div className={`h-48 ${valueBackgrounds[value.bgColor] || value.bgColor} flex flex-col items-center justify-center p-6`}>
                  <div className="w-20 h-20 mb-4 rounded-full bg-white flex items-center justify-center">
                    <i className={`fas ${value.icon} ${textColors[value.color] || value.color} text-3xl`}></i>
                  </div>
                  <h3 className="font-semibold text-gray-800 text-lg">{value.title}</h3>
                </div>
              )}
              <div className="p-6">
                <p className="text-gray-600">{value.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-50 to-teal-50 p-8 rounded-lg" data-aos="fade-up">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              {content.philosophyTitle}
            </h3>
            <p className="text-gray-600 mb-6">
              {content.philosophyText}
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              {content.statistics.map((stat) => (
                <div key={stat.id} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className={`text-3xl font-bold ${textColors[stat.color] || stat.color} mb-2`}>{stat.value}</div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16" data-aos="fade-up">
          <h3 className="text-2xl font-semibold text-center text-gray-800 mb-8">
            {content.howWeApplyTitle}
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {content.applications.map((app) => (
              <div key={app.id} className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-lg text-gray-800 mb-3 flex items-center">
                  <i className={`fas ${app.icon} ${textColors[app.iconColor] || app.iconColor} mr-2`}></i>
                  {app.title}
                </h4>
                <ul className="space-y-2 text-gray-600">
                  {app.items.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <i className={`fas fa-angle-right ${app.id === '1' ? textColors['text-blue-600'] : textColors['text-teal-600']} mt-1 mr-2`}></i>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
    </>
  )
}