'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface HeaderProps {
  currentPage: string
  onPageChange: (page: string) => void
}

interface Settings {
  logoUrl: string
  faviconUrl: string
  siteName: string
  siteDescription: string
}

const navItems = [
  { id: 'accueil', label: 'Accueil', icon: 'fa-home' },
  { id: 'about', label: 'À Propos', icon: 'fa-info-circle' },
  { id: 'expertise', label: 'Pôles d\'Expertise', icon: 'fa-cogs' },
  { id: 'publications', label: 'Publications', icon: 'fa-book-open' },
  { id: 'kit-entreprise', label: 'Kit Entreprise', icon: 'fa-toolbox' },
  { id: 'news', label: 'Actualités', icon: 'fa-newspaper' },
  { id: 'contact', label: 'Contact', icon: 'fa-envelope' },
  { id: 'login', label: 'Se connecter/S\'inscrire', icon: 'fa-user' },
]

export default function Header({ currentPage, onPageChange }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [settings, setSettings] = useState<Settings | null>(null)

  useEffect(() => {
    // Fetch settings for logo
    const fetchSettings = () => {
      fetch('/api/admin/settings')
        .then(res => res.json())
        .then(data => {
          if (data.settings) {
            setSettings(data.settings)
          }
        })
        .catch(console.error)
    }

    fetchSettings()
    // Refresh settings every 5 seconds
    const interval = setInterval(fetchSettings, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <header className="bg-gradient-to-r from-primary to-secondary text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {settings?.logoUrl && (
              <Image
                src={settings.logoUrl}
                alt={settings.siteName || 'Aliz Strategy'}
                width={50}
                height={50}
                className="h-12 md:h-14 w-auto"
                priority
              />
            )}
            <h1 className="text-3xl md:text-4xl font-bold" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}>
              {settings?.siteName || 'ALIZ STRATEGY'}
            </h1>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-white/20"
          >
            <i className="fas fa-bars fa-lg"></i>
          </button>
        </div>
      </header>

      <nav className="main-nav sticky top-0 z-40">
        <div className="container mx-auto px-6">
          <div className="desktop-nav hidden md:flex items-center justify-center space-x-2 lg:space-x-4">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`nav-button ${currentPage === item.id ? 'active' : ''}`}
              >
                <i className={`fas ${item.icon} mr-2`}></i>
                {item.label}
              </button>
            ))}
          </div>
          
          <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id)
                  setMobileMenuOpen(false)
                }}
                className="block w-full text-left py-3 px-6 text-gray-600 hover:bg-gray-100"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </>
  )
}