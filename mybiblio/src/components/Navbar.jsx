import { useLocation } from 'react-router-dom' // à supprimer si tu choisis la version 2

export default function Navbar() {
  // Version 1 : avec react-router-dom (recommandé)
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-white font-black text-2xl">
            SB
          </div>
          <span className="text-2xl font-bold text-gray-900">Smart Bibliothèque</span>
        </a>

        {/* Menu */}
        <nav className="flex gap-10 text-lg font-medium">
          <a
            href="/"
            className={`transition ${
              location.pathname === '/' || location.pathname === ''
                ? 'text-indigo-600 font-bold border-b-4 border-indigo-600 pb-1'
                : 'text-gray-600 hover:text-indigo-600'
            }`}
          >
            Dashboard
          </a>

          <a
            href="/reservation"
            className={`transition ${
              location.pathname === '/reservation'
                ? 'text-indigo-600 font-bold border-b-4 border-indigo-600 pb-1'
                : 'text-gray-600 hover:text-indigo-600'
            }`}
          >
            Carte & Réservation
          </a>

          <a
            href="/statistiques"
            className={`transition ${
              location.pathname === '/statistiques'
                ? 'text-indigo-600 font-bold border-b-4 border-indigo-600 pb-1'
                : 'text-gray-600 hover:text-indigo-600'
            }`}
          >
            Statistiques
          </a>
        </nav>
      </div>
    </header>
  )
}