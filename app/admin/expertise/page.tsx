'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import ExpertisePageEditor from '@/components/admin/ExpertisePageEditor'

export default function AdminExpertisePage() {
  const handleSave = async (content: any) => {
    try {
      const response = await fetch('/api/admin/expertise', {
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
    <AdminLayout activeSection="expertise">
      <ExpertisePageEditor onSave={handleSave} />
    </AdminLayout>
  )
}