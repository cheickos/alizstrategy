'use client'

import KitEntrepriseEditor from '@/components/admin/KitEntrepriseEditor'
import AdminLayout from '@/components/admin/AdminLayout'

export default function KitEntrepriseAdminPage() {
  return (
    <AdminLayout activeSection="kit-entreprise">
      <KitEntrepriseEditor />
    </AdminLayout>
  )
}