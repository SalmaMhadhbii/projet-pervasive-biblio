import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Map from './pages/Reservation'
import Navbar from './components/Navbar'
import Reservation from './pages/Reservation'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/reservation" element={<Reservation />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}