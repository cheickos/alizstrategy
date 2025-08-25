'use client'

import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  status: 'active' | 'inactive'
  createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Administrateur', email: 'admin@alizstrategy.com', role: 'admin', status: 'active', createdAt: '2024-01-01' },
    { id: '2', name: 'Test User', email: 'test@example.com', role: 'user', status: 'active', createdAt: '2024-01-15' },
    { id: '3', name: 'Jean Dupont', email: 'jean.dupont@example.com', role: 'user', status: 'active', createdAt: '2024-01-18' },
    { id: '4', name: 'Marie Martin', email: 'marie.martin@example.com', role: 'user', status: 'inactive', createdAt: '2024-01-10' }
  ])

  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<Partial<User>>({})

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setShowModal(true)
  }

  const handleToggleStatus = (id: string) => {
    setUsers(users.map(user => 
      user.id === id 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ))
  }

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?')) {
      setUsers(users.filter(u => u.id !== id))
    }
  }

  const handleSave = () => {
    if (editingUser.id) {
      // Update existing user
      setUsers(users.map(u => 
        u.id === editingUser.id ? { ...u, ...editingUser } as User : u
      ))
    } else {
      // Add new user
      const newUser: User = {
        id: Date.now().toString(),
        name: editingUser.name || '',
        email: editingUser.email || '',
        role: editingUser.role || 'user',
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0]
      }
      setUsers([...users, newUser])
    }
    setShowModal(false)
    setEditingUser({})
  }

  return (
    <AdminLayout activeSection="users">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Gestion des Utilisateurs</h3>
              <p className="text-sm text-gray-600 mt-1">Total: {users.length} utilisateurs</p>
            </div>
            <button
              onClick={() => {
                setEditingUser({})
                setShowModal(true)
              }}
              className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-lg hover:shadow-lg transition-shadow"
            >
              <i className="fas fa-user-plus mr-2"></i>
              Nouvel utilisateur
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-600 text-sm border-b border-gray-200">
                  <th className="pb-3">Nom</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Rôle</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Date d'inscription</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {users.map(user => (
                  <tr key={user.id} className="border-b border-gray-200">
                    <td className="py-4">{user.name}</td>
                    <td className="py-4">{user.email}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-600' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                      </span>
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className={`px-2 py-1 rounded text-sm ${
                          user.status === 'active' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {user.status === 'active' ? 'Actif' : 'Inactif'}
                      </button>
                    </td>
                    <td className="py-4">{user.createdAt}</td>
                    <td className="py-4">
                      <button 
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      {user.role !== 'admin' && (
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingUser.id ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                <input
                  type="text"
                  value={editingUser.name || ''}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={editingUser.email || ''}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
                <select
                  value={editingUser.role || 'user'}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value as 'admin' | 'user'})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="user">Utilisateur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
              {!editingUser.id && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Entrez le mot de passe"
                  />
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}