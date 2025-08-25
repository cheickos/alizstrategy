'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import ValuesPageEditor from '@/components/admin/ValuesPageEditor'

export default function AdminValuesPage() {
  const handleSave = async (content: any) => {
    try {
      const response = await fetch('/api/admin/values', {
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
    <AdminLayout activeSection="values">
      <ValuesPageEditor onSave={handleSave} />
    </AdminLayout>
  )
}