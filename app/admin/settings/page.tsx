'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import SettingsEditor from '@/components/admin/SettingsEditor'

export default function AdminSettingsPage() {
  return (
    <AdminLayout activeSection="settings">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Paramètres</h2>
        <p className="text-gray-600 mt-2">
          Gérez les paramètres généraux de votre site
        </p>
      </div>
      <SettingsEditor />
    </AdminLayout>
  )
}