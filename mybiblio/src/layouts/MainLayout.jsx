// src/layouts/MainLayout.jsx
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function MainLayout({ children, title, subtitle, showBack = false }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header commun à toutes les pages */}
          <div className="flex items-center gap-5 mb-12">
            {showBack && (
              <button
                onClick={() => window.history.back()}
                className="p-3.5 rounded-xl bg-white shadow-md hover:shadow-xl transition-all hover:scale-105 transition"
              >
                <ArrowLeft className="w-7 h-7 text-slate-700" />
              </button>
            )}
            <div>
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900">
                {title}
              </h1>
              {subtitle && (
                <p className="text-lg text-slate-600 mt-2">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Contenu de la page */}
          {children}

        </div>
      </main>
    </>
  );
}