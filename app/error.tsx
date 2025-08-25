'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Une erreur s'est produite!</h2>
        <p className="text-gray-600 mb-6">Désolé, quelque chose s'est mal passé.</p>
        <button
          onClick={reset}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>
  )
}