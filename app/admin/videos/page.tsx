'use client'

import React from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import SectionVideosEditor from '@/components/admin/SectionVideosEditor'

export default function VideosAdminPage() {
  return (
    <AdminLayout activeSection="videos">
      <SectionVideosEditor />
    </AdminLayout>
  )
}