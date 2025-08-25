export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
        <p className="text-gray-600">Chargement...</p>
      </div>
    </div>
  )
}