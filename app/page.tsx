'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HomePage from '@/components/pages/HomePage'
import AboutPage from '@/components/pages/AboutPage'
import ContactPage from '@/components/pages/ContactPage'
import ExpertisePage from '@/components/pages/ExpertisePage'
import PublicationsPage from '@/components/pages/PublicationsPage'
import KitEntreprisePage from '@/components/pages/KitEntreprisePage'
import NewsPage from '@/components/pages/NewsPage'
import LoginPage from '@/components/pages/LoginPage'
import 'aos/dist/aos.css'

export default function Home() {
  const [currentPage, setCurrentPage] = useState('accueil')

  useEffect(() => {
    // Initialize AOS animations
    const loadAOS = async () => {
      const AOS = (await import('aos')).default
      AOS.init({ duration: 700, once: true, offset: 50 })
    }
    loadAOS()
  }, [])

  const renderPage = () => {
    switch (currentPage) {
      case 'accueil':
        return <HomePage onPageChange={setCurrentPage} />
      case 'about':
        return <AboutPage />
      case 'contact':
        return <ContactPage />
      case 'expertise':
        return <ExpertisePage />
      case 'publications':
        return <PublicationsPage />
      case 'kit-entreprise':
        return <KitEntreprisePage onPageChange={setCurrentPage} />
      case 'news':
        return <NewsPage />
      case 'login':
        return <LoginPage />
      default:
        return <HomePage onPageChange={setCurrentPage} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="container mx-auto p-4 md:p-8 flex-grow">
        {renderPage()}
      </main>
      <Footer />
    </div>
  )
}