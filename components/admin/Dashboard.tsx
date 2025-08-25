'use client'

import React, { useState, useEffect } from 'react'

interface StatCard {
  title: string
  value: string | number
  icon: string
  color: string
  change?: string
}

export default function Dashboard() {
  const [stats, setStats] = useState<StatCard[]>([
    { title: 'Pages vues', value: '12,543', icon: 'fa-eye', color: 'bg-blue-500', change: '+12%' },
    { title: 'Utilisateurs', value: '458', icon: 'fa-users', color: 'bg-green-500', change: '+5%' },
    { title: 'Publications', value: '24', icon: 'fa-book-open', color: 'bg-purple-500' },
    { title: 'Messages', value: '15', icon: 'fa-envelope', color: 'bg-yellow-500' },
  ])

  const recentActivities = [
    { id: 1, action: 'Nouvelle publication ajoutée', user: 'Admin', time: 'Il y a 2 heures', icon: 'fa-plus' },
    { id: 2, action: 'Message de contact reçu', user: 'Client', time: 'Il y a 4 heures', icon: 'fa-envelope' },
    { id: 3, action: 'Page "À Propos" modifiée', user: 'Admin', time: 'Hier', icon: 'fa-edit' },
    { id: 4, action: 'Nouvel utilisateur inscrit', user: 'Système', time: 'Hier', icon: 'fa-user-plus' },
  ]

  return (
    <div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                {stat.change && (
                  <p className="text-green-500 text-sm mt-1">
                    <i className="fas fa-arrow-up mr-1"></i>
                    {stat.change}
                  </p>
                )}
              </div>
              <div className={`${stat.color} p-4 rounded-lg text-white`}>
                <i className={`fas ${stat.icon} text-2xl`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Activités récentes</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map(activity => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <i className={`fas ${activity.icon} text-gray-600`}></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Actions rapides</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => window.location.href = '/admin/publications'}
                className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <i className="fas fa-plus text-blue-600 text-xl mb-2"></i>
                <p className="text-sm text-gray-700">Nouvelle publication</p>
              </button>
              <button 
                onClick={() => window.location.href = '/admin/users'}
                className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <i className="fas fa-user-plus text-green-600 text-xl mb-2"></i>
                <p className="text-sm text-gray-700">Ajouter utilisateur</p>
              </button>
              <button 
                onClick={() => window.location.href = '/admin/home'}
                className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <i className="fas fa-edit text-purple-600 text-xl mb-2"></i>
                <p className="text-sm text-gray-700">Modifier pages</p>
              </button>
              <button 
                onClick={() => window.location.href = '/admin/settings'}
                className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
              >
                <i className="fas fa-cog text-yellow-600 text-xl mb-2"></i>
                <p className="text-sm text-gray-700">Paramètres</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Overview */}
      <div className="mt-8 bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Aperçu du contenu</h3>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-600 text-sm">
                  <th className="pb-3">Page</th>
                  <th className="pb-3">Dernière modification</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                <tr className="border-t border-gray-200">
                  <td className="py-3">Page d'accueil</td>
                  <td className="py-3">Il y a 2 jours</td>
                  <td className="py-3">
                    <span className="px-2 py-1 bg-green-100 text-green-600 rounded text-sm">Publié</span>
                  </td>
                  <td className="py-3">
                    <button 
                      onClick={() => window.location.href = '/admin/home'}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      onClick={() => window.open('/', '_blank')}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="py-3">À Propos</td>
                  <td className="py-3">Il y a 1 semaine</td>
                  <td className="py-3">
                    <span className="px-2 py-1 bg-green-100 text-green-600 rounded text-sm">Publié</span>
                  </td>
                  <td className="py-3">
                    <button 
                      onClick={() => window.location.href = '/admin/about'}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      onClick={() => window.open('/', '_blank')}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="py-3">Nouvelle publication</td>
                  <td className="py-3">Aujourd'hui</td>
                  <td className="py-3">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded text-sm">Brouillon</span>
                  </td>
                  <td className="py-3">
                    <button 
                      onClick={() => window.location.href = '/admin/publications'}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      onClick={() => alert('Publication supprimée')}
                      className="text-red-600 hover:text-red-800"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}