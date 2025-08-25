'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import HomePageEditor from '@/components/admin/HomePageEditor'

export default function AdminHomePage() {
  const handleSave = async (content: any) => {
    try {
      const response = await fetch('/api/admin/homepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      })
      
      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Erreur:', error)
      throw error
    }
  }

  return (
    <AdminLayout activeSection="home">
      <HomePageEditor onSave={handleSave} />
    </AdminLayout>
  )
}