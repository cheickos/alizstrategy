import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import DynamicFavicon from '@/components/DynamicFavicon'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Aliz Strategy - Plateforme Interactive',
  description: 'Votre Allié Stratégique pour une Croissance Durable en Côte d\'Ivoire et en Afrique',
  keywords: 'conseil stratégie, transformation digitale, financement, investissement, Côte d\'Ivoire, Abidjan',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <DynamicFavicon />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#4ade80',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  )
}