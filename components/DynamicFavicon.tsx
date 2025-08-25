'use client'

import { useEffect } from 'react'

export default function DynamicFavicon() {
  useEffect(() => {
    const fetchSettings = () => {
      fetch('/api/admin/settings')
        .then(res => res.json())
        .then(data => {
          if (data.settings?.faviconUrl) {
            // Update favicon
            const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link')
            link.type = 'image/x-icon'
            link.rel = 'shortcut icon'
            link.href = data.settings.faviconUrl
            document.getElementsByTagName('head')[0].appendChild(link)
          }
          
          // Update page title if available
          if (data.settings?.siteName) {
            document.title = `${data.settings.siteName} - Plateforme Interactive`
          }
        })
        .catch(console.error)
    }

    fetchSettings()
    // Refresh settings every 5 seconds
    const interval = setInterval(fetchSettings, 5000)
    return () => clearInterval(interval)
  }, [])

  return null
}