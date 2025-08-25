'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface AdminLayoutProps {
  children: React.ReactNode
  activeSection?: string
}

const menuItems = [
  { id: 'dashboard', label: 'Tableau de bord', icon: 'fa-tachometer-alt' },
  { id: 'home', label: 'Page d\'accueil', icon: 'fa-home' },
  { id: 'about', label: 'À Propos', icon: 'fa-info-circle' },
  { id: 'expertise', label: 'Pôles d\'Expertise', icon: 'fa-cogs' },
  { id: 'publications', label: 'Publications', icon: 'fa-book-open' },
  { id: 'kit-entreprise', label: 'Kit Entreprise', icon: 'fa-toolbox' },
  { id: 'news', label: 'Actualités', icon: 'fa-newspaper' },
  { id: 'videos', label: 'Vidéos de section', icon: 'fa-video' },
  { id: 'contacts', label: 'Messages Contact', icon: 'fa-envelope' },
  { id: 'users', label: 'Utilisateurs', icon: 'fa-users' },
  { id: 'settings', label: 'Paramètres', icon: 'fa-cog' },
]

export default function AdminLayout({ children, activeSection = 'dashboard' }: AdminLayoutProps) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const isAdmin = localStorage.getItem('isAdmin')
      if (!isAdmin) {
        router.push('/admin')
      } else {
        setIsAuthenticated(true)
      }
    }
    checkAuth()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('user')
    // Clear cookies
    document.cookie = 'isAdmin=;path=/;max-age=0'
    document.cookie = 'userToken=;path=/;max-age=0'
    router.push('/')
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gray-900 text-white transition-all duration-300 relative`}>
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h1 className={`font-bold text-xl ${!sidebarOpen && 'hidden'}`}>
              Admin Panel
            </h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-white"
            >
              <i className={`fas fa-${sidebarOpen ? 'angle-left' : 'angle-right'}`}></i>
            </button>
          </div>

          <nav className="space-y-2 flex-1">
            {menuItems.map(item => (
              <Link
                key={item.id}
                href={`/admin/${item.id}`}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? 'bg-primary text-white'
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <i className={`fas ${item.icon} ${sidebarOpen ? 'mr-3' : 'mx-auto'}`}></i>
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>

          <div className="mt-4 border-t border-gray-800 pt-4">
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-800 text-gray-300 w-full transition-colors"
            >
              <i className={`fas fa-sign-out-alt ${sidebarOpen ? 'mr-3' : 'mx-auto'}`}></i>
              {sidebarOpen && <span>Déconnexion</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-8 py-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              {menuItems.find(item => item.id === activeSection)?.label || 'Administration'}
            </h2>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                <i className="fas fa-user-circle mr-2"></i>
                Administrateur
              </span>
              <button className="relative text-gray-600 hover:text-gray-800">
                <i className="fas fa-bell"></i>
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}