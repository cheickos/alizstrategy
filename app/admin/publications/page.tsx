'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import PublicationsEditor from '@/components/admin/PublicationsEditor'

export default function AdminPublicationsPage() {
  return (
    <AdminLayout activeSection="publications">
      <PublicationsEditor />
    </AdminLayout>
  )
}