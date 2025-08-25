'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import Dashboard from '@/components/admin/Dashboard'

export default function DashboardPage() {
  return (
    <AdminLayout activeSection="dashboard">
      <Dashboard />
    </AdminLayout>
  )
}