import { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import StatCard from '../components/StatCard';
import ZoneCard from '../components/ZoneCard';
import AlertItem from '../components/AlertItem';
import zonesData from '../assets/data/Zones.json';


export default function Dashboard() {
  const [occupiedSeats, setOccupiedSeats] = useState(73);

  useEffect(() => {
    const interval = setInterval(() => {
      setOccupiedSeats(prev => {
        const change = Math.floor(Math.random() * 10) - 5;
        return Math.max(50, Math.min(110, prev + change));
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <MainLayout
      title="Dashboard"
      subtitle="Vue d'ensemble de l'occupation et du niveau sonore de la bibliothèque"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard 
          title="Places Occupées" 
          value={`${occupiedSeats}/110`} 
          icon="Users" 
          color="bg-purple-100 text-purple-600" 
          badge="+12%" 
        />
        <StatCard 
          title="Zones Silencieuses" 
          value="6/10" 
          icon="VolumeX" 
          color="bg-emerald-100 text-emerald-600" 
        />
        <StatCard 
          title="Zones Actives" 
          value="10" 
          icon="MapPin" 
          color="bg-indigo-100 text-indigo-600" 
        />
        <StatCard 
          title="Alertes Actives" 
          value="2" 
          icon="AlertTriangle" 
          color="bg-orange-100 text-orange-600" 
        />
      </div>

      {/* Zones */}
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Zones de la Bibliothèque</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {zonesData.map((zone) => (
          <ZoneCard key={zone.id} zone={zone} />
        ))}
      </div>

      {/* Alertes */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">Warning</span>
          <h2 className="text-2xl font-bold text-slate-900">Alertes Récentes</h2>
        </div>
        <div className="space-y-4">
          <AlertItem zone="Zone C" type="Niveau sonore élevé détecté" time="Il y a 5 min" />
          <AlertItem zone="Zone B" type="Nudge envoyé aux utilisateurs" time="Il y a 12 min" />
        </div>
      </div>
    </MainLayout>
  );
}