'use client'

import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

interface Contact {
  id: string
  name: string
  email: string
  subject: string
  message: string
  date: string
  status: 'new' | 'read' | 'replied'
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'Jean Dupont', email: 'jean@example.com', subject: 'Demande de devis', message: 'Je souhaiterais avoir un devis pour...', date: '2024-01-20', status: 'new' },
    { id: '2', name: 'Marie Martin', email: 'marie@example.com', subject: 'Question sur vos services', message: 'Bonjour, je voudrais savoir...', date: '2024-01-19', status: 'read' },
    { id: '3', name: 'Pierre Bernard', email: 'pierre@example.com', subject: 'Collaboration', message: 'Nous aimerions discuter d\'une collaboration...', date: '2024-01-18', status: 'replied' }
  ])

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [replyMessage, setReplyMessage] = useState('')

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact)
    if (contact.status === 'new') {
      setContacts(contacts.map(c => 
        c.id === contact.id ? { ...c, status: 'read' } : c
      ))
    }
  }

  const handleReply = () => {
    if (selectedContact) {
      setContacts(contacts.map(c => 
        c.id === selectedContact.id ? { ...c, status: 'replied' } : c
      ))
      setShowReplyModal(false)
      setReplyMessage('')
      alert('Réponse envoyée!')
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce message?')) {
      setContacts(contacts.filter(c => c.id !== id))
      if (selectedContact?.id === id) {
        setSelectedContact(null)
      }
    }
  }

  return (
    <AdminLayout activeSection="contacts">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">Messages reçus</h3>
            <div className="mt-2 flex space-x-2 text-sm">
              <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded">
                Nouveaux: {contacts.filter(c => c.status === 'new').length}
              </span>
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded">
                Total: {contacts.length}
              </span>
            </div>
          </div>
          <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
            {contacts.map(contact => (
              <div
                key={contact.id}
                onClick={() => handleViewContact(contact)}
                className={`p-4 cursor-pointer hover:bg-gray-50 ${
                  selectedContact?.id === contact.id ? 'bg-blue-50' : ''
                } ${contact.status === 'new' ? 'font-semibold' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm text-gray-800">{contact.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded ${
                    contact.status === 'new' ? 'bg-blue-100 text-blue-600' :
                    contact.status === 'read' ? 'bg-gray-100 text-gray-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {contact.status === 'new' ? 'Nouveau' :
                     contact.status === 'read' ? 'Lu' : 'Répondu'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">{contact.subject}</p>
                <p className="text-xs text-gray-500 mt-1">{contact.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Details */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
          {selectedContact ? (
            <>
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{selectedContact.subject}</h3>
                    <p className="text-sm text-gray-600 mt-1">De: {selectedContact.name} ({selectedContact.email})</p>
                    <p className="text-sm text-gray-500">Reçu le: {selectedContact.date}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowReplyModal(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <i className="fas fa-reply mr-2"></i>
                      Répondre
                    </button>
                    <button
                      onClick={() => handleDelete(selectedContact.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 whitespace-pre-wrap">{selectedContact.message}</p>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <i className="fas fa-envelope text-4xl mb-4"></i>
              <p>Sélectionnez un message pour voir les détails</p>
            </div>
          )}
        </div>
      </div>

      {/* Reply Modal */}
      {showReplyModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Répondre à {selectedContact.name}
              </h3>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600">À: {selectedContact.email}</p>
                <p className="text-sm text-gray-600">Objet: Re: {selectedContact.subject}</p>
              </div>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Entrez votre réponse..."
              />
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowReplyModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleReply}
                className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg"
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}