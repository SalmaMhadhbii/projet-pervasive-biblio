import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
 
import Navbar from './components/Navbar'
import Reservation from './pages/Reservation'
import Statistiques from './pages/Statistiques'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/statistiques" element={<Statistiques />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}