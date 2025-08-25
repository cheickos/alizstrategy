'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import SectionVideo from '../SectionVideo'

interface Realisation {
  id: string
  title: string
  description: string
  imageUrl: string
  client: string
  sector: string
  impact: string
  period: string
  pole: 'Stratégie & Croissance' | 'Finance & Investissement' | 'Transformation & Innovation'
}

interface NewsItem {
  id: string
  title: string
  excerpt: string
  content: string
  imageUrl: string
  category: string
  author: string
  date: string
  readTime: string
  featured?: boolean
}

interface NewsContent {
  realisations: Realisation[]
  news: NewsItem[]
}

export default function NewsPage() {
  const [content, setContent] = useState<NewsContent>({ realisations: [], news: [] })
  const [loading, setLoading] = useState(true)
  const [selectedPole, setSelectedPole] = useState<string>('all')
  const [selectedRealisation, setSelectedRealisation] = useState<Realisation | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null)
  const [email, setEmail] = useState('')

  const fetchNewsData = () => {
    fetch('/api/admin/news')
      .then(res => res.json())
      .then(data => {
        setContent({
          realisations: data.realisations || [],
          news: data.news || []
        })
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchNewsData()
    
    // Rafraîchir les données toutes les 5 secondes
    const interval = setInterval(fetchNewsData, 5000)
    
    // Nettoyer l'intervalle au démontage
    return () => clearInterval(interval)
  }, [])

  const poles = ['all', 'Stratégie & Croissance', 'Finance & Investissement', 'Transformation & Innovation']
  
  const filteredRealisations = selectedPole === 'all' 
    ? content.realisations 
    : content.realisations.filter(item => item.pole === selectedPole)

  const getPoleColor = (pole: string) => {
    const colors: Record<string, string> = {
      'Stratégie & Croissance': 'bg-blue-100 text-blue-800',
      'Finance & Investissement': 'bg-green-100 text-green-800',
      'Transformation & Innovation': 'bg-purple-100 text-purple-800'
    }
    return colors[pole] || 'bg-gray-100 text-gray-800'
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Innovation': 'bg-blue-100 text-blue-800',
      'Finance': 'bg-green-100 text-green-800',
      'Stratégie': 'bg-purple-100 text-purple-800',
      'Transformation': 'bg-yellow-100 text-yellow-800',
      'Actualité': 'bg-gray-100 text-gray-800',
      'Événement': 'bg-red-100 text-red-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      alert('Merci pour votre inscription! Vous recevrez bientôt nos actualités.')
      setEmail('')
    }
  }

  if (loading) {
    return (
      <section id="news" className="bg-white p-8 rounded-lg shadow-md">
        <div className="container mx-auto px-6 flex justify-center items-center min-h-[400px]">
          <i className="fas fa-spinner fa-spin text-4xl text-gray-400"></i>
        </div>
      </section>
    )
  }

  return (
    <>
      <section id="news" className="bg-white p-8 rounded-lg shadow-md">
        <div className="container mx-auto px-6">
        {/* Section Nos Réalisations */}
        <div className="mb-20">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl lg:text-4xl font-bold section-title mb-4">
              Nos Réalisations
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Découvrez comment nous avons accompagné nos clients dans leur transformation 
              et leur croissance à travers des projets concrets et à fort impact.
            </p>
            <SectionVideo section="news" className="mt-8" />
          </div>

          {/* Filtres par pôle */}
          <div className="mb-10" data-aos="fade-up">
            <div className="flex flex-wrap justify-center gap-3">
              {poles.map(pole => (
                <button
                  key={pole}
                  onClick={() => setSelectedPole(pole)}
                  className={`px-6 py-3 rounded-full font-medium transition-all ${
                    selectedPole === pole
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-primary'
                  }`}
                >
                  {pole === 'all' ? 'Tous les pôles' : pole}
                </button>
              ))}
            </div>
          </div>

          {/* Grille des réalisations */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-aos="fade-up">
            {filteredRealisations.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <i className="fas fa-briefcase text-6xl text-gray-300 mb-4"></i>
                <p className="text-gray-500">Aucune réalisation dans ce pôle</p>
              </div>
            ) : (
              filteredRealisations.map((realisation) => (
                <article 
                  key={realisation.id} 
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
                  onClick={() => setSelectedRealisation(realisation)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={realisation.imageUrl}
                      alt={realisation.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = 'https://placehold.co/600x400/cccccc/ffffff?text=Réalisation'
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPoleColor(realisation.pole)}`}>
                        {realisation.pole}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-primary transition-colors">
                      {realisation.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {realisation.description}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-500">
                        <i className="fas fa-building mr-2 text-primary"></i>
                        <span className="font-medium">Client:</span>
                        <span className="ml-2">{realisation.client}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <i className="fas fa-calendar mr-2 text-primary"></i>
                        <span className="font-medium">Période:</span>
                        <span className="ml-2">{realisation.period}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

        {/* Section Actualités Récentes */}
        <div className="mb-20">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl lg:text-4xl font-bold section-title mb-4">
              Actualités Récentes
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Suivez les dernières nouvelles et les événements marquants d'Aliz Strategy.
            </p>
            <SectionVideo section="actualites-recentes" className="mt-8" />
          </div>

          {/* Grille des actualités */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-aos="fade-up">
            {content.news.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <i className="fas fa-newspaper text-6xl text-gray-300 mb-4"></i>
                <p className="text-gray-500">Aucune actualité disponible</p>
              </div>
            ) : (
              content.news.slice(0, 6).map((item) => (
                <article 
                  key={item.id} 
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
                  onClick={() => setSelectedArticle(item)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = 'https://placehold.co/600x400/cccccc/ffffff?text=Actualité'
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {item.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        <i className="fas fa-calendar mr-1"></i>
                        {new Date(item.date).toLocaleDateString('fr-FR', { 
                          day: 'numeric', 
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                      <span>
                        <i className="fas fa-clock mr-1"></i>
                        {item.readTime}
                      </span>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

        {/* Modal Réalisation */}
        {selectedRealisation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative h-64 md:h-96">
                <Image
                  src={selectedRealisation.imageUrl}
                  alt={selectedRealisation.title}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => setSelectedRealisation(null)}
                  className="absolute top-4 right-4 bg-white text-gray-700 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPoleColor(selectedRealisation.pole)}`}>
                    {selectedRealisation.pole}
                  </span>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  {selectedRealisation.title}
                </h1>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8 p-6 bg-gray-50 rounded-lg">
                  <div>
                    <span className="text-sm text-gray-500 font-medium">Client</span>
                    <p className="text-gray-800 font-semibold">{selectedRealisation.client}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 font-medium">Secteur</span>
                    <p className="text-gray-800 font-semibold">{selectedRealisation.sector}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 font-medium">Période</span>
                    <p className="text-gray-800 font-semibold">{selectedRealisation.period}</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">Description du projet</h3>
                    <p className="text-gray-700">{selectedRealisation.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">Impact & Résultats</h3>
                    <p className="text-gray-700">{selectedRealisation.impact}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Article */}
        {selectedArticle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative h-64 md:h-96">
                <Image
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.title}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-4 right-4 bg-white text-gray-700 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(selectedArticle.category)}`}>
                    {selectedArticle.category}
                  </span>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  {selectedArticle.title}
                </h1>
                
                <div className="flex items-center text-sm text-gray-500 mb-6">
                  <span>
                    <i className="fas fa-user mr-1"></i>
                    {selectedArticle.author}
                  </span>
                  <span className="mx-4">•</span>
                  <span>
                    <i className="fas fa-calendar mr-1"></i>
                    {new Date(selectedArticle.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                  <span className="mx-4">•</span>
                  <span>
                    <i className="fas fa-clock mr-1"></i>
                    {selectedArticle.readTime}
                  </span>
                </div>
                
                <div className="prose max-w-none">
                  <p className="text-gray-600 mb-4 text-lg font-medium">
                    {selectedArticle.excerpt}
                  </p>
                  <div className="text-gray-700 whitespace-pre-line">
                    {selectedArticle.content}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section Newsletter */}
        <div className="mt-20 bg-gradient-to-r from-blue-50 to-indigo-50 p-12 rounded-lg" data-aos="fade-up">
          <div className="max-w-3xl mx-auto text-center">
            <i className="fas fa-envelope-open-text text-5xl text-blue-600 mb-6"></i>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Ne manquez aucune actualité
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              Recevez nos derniers articles et analyses directement dans votre boîte mail
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse email"
                className="flex-1 px-6 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                required
              />
              <button 
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:shadow-lg transition-all text-lg"
              >
                S'abonner
              </button>
            </form>
            <p className="text-sm text-gray-500 mt-4">
              En vous abonnant, vous acceptez de recevoir nos communications. 
              Vous pouvez vous désabonner à tout moment.
            </p>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}