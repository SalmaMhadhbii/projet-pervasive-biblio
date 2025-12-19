import { useState, useEffect } from 'react';
import { Bell, Menu, X, Trash2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { useZones } from '../context/ZonesContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const { zones, addAlert, alerts, removeAlert  } = useZones();
  
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  // Filtrage notifications selon rôle
  const filteredAlerts =
    user?.role === "admin"
      ? alerts
      : alerts.filter(a => a.target === "student");

  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'Carte & Réservation', path: '/reservation' },
    ...(user?.role === "admin"
      ? [{ name: 'Administration', path: '/admin' },
        { name: 'Statistiques', path: '/statistiques' }
      ]
      : []),
  ];

  
   


  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-white font-black text-2xl">
            SB
          </div>
          <span className="hidden sm:block text-2xl font-bold text-gray-900">
            Smart Bibliothèque
          </span>
        </Link>

        {/* Menu Desktop */}
        <nav className="hidden md:flex gap-10 text-lg font-medium items-center">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`transition pb-1 ${
                pathname === link.path
                  ? 'text-indigo-600 font-bold border-b-4 border-indigo-600'
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 font-medium hover:bg-indigo-100 transition"
          >
            Déconnexion
          </button>

        </nav>

        {/* Notifications + Hamburger */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2.5 rounded-xl hover:bg-gray-100 transition"
            >
              <Bell className="w-7 h-7 text-gray-700" />
              {filteredAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {filteredAlerts.length}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                <div className="p-5 border-b flex justify-between items-center">
                  <h3 className="text-lg font-bold">Notifications</h3>
                  <span className="text-sm text-slate-500">
                    {filteredAlerts.length} nouvelles
                  </span>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {filteredAlerts.length > 0 ? (
                    filteredAlerts.slice(0, 5).map(alert => (
                      <div
                        key={alert.id}
                        className="p-4 border-b last:border-0 hover:bg-slate-50 flex items-start justify-between gap-3"
                      >
                        {/* Texte notification */}
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">
                            {alert.type === "alert"
                              ? "Niveau sonore élevé"
                              : "Notification"}
                          </p>
                          <p className="text-sm text-slate-600 mt-1">
                            {alert.message} • {alert.time}
                          </p>
                        </div>

                        {/* Bouton supprimer */}
                        <button
                          onClick={() => removeAlert(alert.id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="p-6 text-center text-slate-500">
                      Aucune notification
                    </p>
                  )}
                </div>

              </div>
            )}
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2.5 rounded-xl hover:bg-gray-100"
          >
            <Menu className="w-7 h-7 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Overlay mobile */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Menu Mobile */}
      <nav
        className={`md:hidden fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 border-b flex justify-between items-center">
          <span className="text-2xl font-bold">Menu</span>
          <button onClick={() => setMobileMenuOpen(false)}>
            <X className="w-8 h-8 text-gray-600" />
          </button>
        </div>

        <div className="bg-white p-6 space-y-6">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-xl font-medium ${
                pathname === link.path
                  ? 'text-indigo-600 font-bold'
                  : 'text-gray-700 hover:text-indigo-600'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <button
            onClick={logout}
            className="w-full py-3 rounded-xl bg-indigo-100 text-indigo-700 font-semibold hover:bg-indigo-200 transition"
          >
            Déconnexion
          </button>

        </div>
      </nav>
    </header>
  );
}
