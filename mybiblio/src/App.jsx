import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Dashboard from './pages/Dashboard'
import Navbar from './components/Navbar'
import Reservation from './pages/Reservation'
import Statistiques from './pages/Statistiques'
import Admin from './pages/Admin'
import Auth from './pages/Auth'

export default function App() {
  const { user } = useAuth() // récupère l'utilisateur connecté

  return (
    <BrowserRouter>
      {/* Navbar seulement si connecté */}
      {user && <Navbar />}

      <div className="pt-20">
        <Routes>
          {/* Page login */}
          <Route
            path="/auth"
            element={!user ? <Auth /> : <Navigate to="/" />}
          />

          {/* Dashboard accessible seulement si connecté */}
          <Route
            path="/"
            element={user ? <Dashboard /> : <Navigate to="/auth" />}
          />

          {/* Réservation accessible seulement si connecté */}
          <Route
            path="/reservation"
            element={user ? <Reservation /> : <Navigate to="/auth" />}
          />

          {/* Statistiques accessible seulement si connecté */}
          <Route
            path="/statistiques"
            element={user ? <Statistiques /> : <Navigate to="/auth" />}
          />

          {/* Admin accessible seulement si admin */}
          <Route
            path="/admin"
            element={user?.role === "admin" ? <Admin /> : <Navigate to="/auth" />}
          />

          {/* Redirection par défaut */}
          <Route
            path="*"
            element={<Navigate to={user ? "/" : "/auth"} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
