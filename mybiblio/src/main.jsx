import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'
import { ZonesProvider } from './context/ZonesContext';
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <ZonesProvider>
      <StrictMode>
        <App />
        <Toaster            // ← Ajoute ce composant ici
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#333',
              color: '#fff',
              borderRadius: '12px',
              padding: '16px',
            },
          }}
        />
      </StrictMode>,
    </ZonesProvider>
  </AuthProvider>
)
