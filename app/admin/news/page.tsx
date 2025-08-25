'use client'

import NewsEditor from '@/components/admin/NewsEditor'
import AdminLayout from '@/components/admin/AdminLayout'

export default function NewsAdminPage() {
  return (
    <AdminLayout activeSection="news">
      <NewsEditor />
    </AdminLayout>
  )
}