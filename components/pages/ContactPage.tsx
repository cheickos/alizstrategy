'use client'

import { useState } from 'react'
import SectionVideo from '../SectionVideo'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [feedback, setFeedback] = useState({ message: '', type: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setFeedback({
          message: 'Merci ! Votre message a été envoyé avec succès.',
          type: 'success'
        })
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        throw new Error('Erreur lors de l\'envoi')
      }
    } catch (error) {
      setFeedback({
        message: 'Une erreur s\'est produite. Veuillez réessayer.',
        type: 'error'
      })
    } finally {
      setLoading(false)
      setTimeout(() => setFeedback({ message: '', type: '' }), 5000)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <>
      <section id="contact" className="bg-white p-8 rounded-lg shadow-md">
        <div className="container mx-auto px-6">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl lg:text-4xl font-bold section-title">
            Prêt à Redéfinir Votre Avenir ?
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Discutons de vos défis. Contactez-nous pour une consultation et découvrons ensemble comment concrétiser vos ambitions.
          </p>
          <SectionVideo section="contact" className="mt-8" />
        </div>
        
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 bg-gray-50 p-8 rounded-lg" data-aos="fade-up" data-aos-delay="100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nom complet
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse e-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                Sujet
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                value={formData.message}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full font-semibold px-6 py-3 rounded-md transition-colors ${
                  loading 
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {loading ? 'Envoi en cours...' : 'Planifier un échange'}
              </button>
            </div>
            
            {feedback.message && (
              <div className={`text-center text-sm ${
                feedback.type === 'success' ? 'text-green-600' : 'text-red-600'
              }`}>
                {feedback.message}
              </div>
            )}
          </form>
          
          <div className="flex flex-col justify-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Nos Coordonnées</h3>
            <div className="space-y-3 text-gray-600">
              <p><i className="fas fa-map-marker-alt w-6 text-blue-600"></i> Abidjan, Côte d'Ivoire</p>
              <p><i className="fas fa-envelope w-6 text-blue-600"></i> contact@aliz-strategy.com</p>
              <p><i className="fas fa-phone w-6 text-blue-600"></i> +225 05 06 88 82 89</p>
              <p><i className="fas fa-phone w-6 text-blue-600"></i> +225 07 07 08 73 79</p>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-semibold mb-3">Suivez-nous</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                  <i className="fab fa-linkedin fa-2x"></i>
                </a>
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                  <i className="fab fa-twitter fa-2x"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}