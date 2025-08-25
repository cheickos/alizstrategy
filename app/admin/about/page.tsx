'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import AboutPageEditor from '@/components/admin/AboutPageEditor'

export default function AdminAboutPage() {
  const handleSave = async (content: any) => {
    try {
      const response = await fetch('/api/admin/about', {
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
    <AdminLayout activeSection="about">
      <AboutPageEditor onSave={handleSave} />
    </AdminLayout>
  )
}