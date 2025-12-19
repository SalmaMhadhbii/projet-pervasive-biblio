//import { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import StatCard from '../components/StatCard';
import ZoneCard from '../components/ZoneCard';
import AlertItem from '../components/AlertItem';
//import zonesData from '../assets/data/Zones.json';
import { useState } from 'react';
import { useZones } from '../context/ZonesContext';



export default function Dashboard() {
  //const [occupiedSeats, setOccupiedSeats] = useState(73);

  //const [zones, setZones] = useState(zonesData);

  const { zones, alerts } = useZones();


  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setZones(prevZones =>
  //       prevZones.map(zone => {
  //         const change = Math.floor(Math.random() * 5) - 2;
  //         const newOccupation = Math.max(0, Math.min(zone.capacity, zone.occupation + change));
  //         const newSeats = [...zone.seats];
  //         const diff = newOccupation - zone.occupation;

  //         if (diff > 0) {
  //           let added = 0;
  //           while (added < diff) {
  //             const idx = Math.floor(Math.random() * zone.capacity);
  //             if (!newSeats[idx]) {
  //               newSeats[idx] = true;
  //               added++;
  //             }
  //           }
  //         } else if (diff < 0) {
  //           let removed = 0;
  //           while (removed < -diff) {
  //             const idx = Math.floor(Math.random() * zone.capacity);
  //             if (newSeats[idx]) {
  //               newSeats[idx] = false;
  //               removed++;
  //             }
  //           }
  //         }

  //         const noiseLevel = Math.round(20 + (newOccupation / zone.capacity) * 40 + Math.random() * 10);
  //         const noise = noiseLevel < 32 ? "Silencieux" : noiseLevel < 48 ? "Modéré" : "Bruyant";

  //         return { ...zone, seats: newSeats, occupation: newOccupation, noiseLevel, noise };
  //       })
  //     );
  //   }, 2000); // toutes les 10 secondes (tu peux mettre 15000 comme dans Réservation)

  //   return () => clearInterval(interval);
  // }, []);

  // Calculs en temps réel
  const totalCapacity = zones.reduce((sum, z) => sum + z.capacity, 0);
  const totalOccupied = zones.reduce((sum, z) => sum + z.occupation, 0);
  const silentZones = zones.filter(z => z.noise === "Silencieux").length;
  const totalZones = zones.length;
  const noisyZones = zones.filter(z => z.noise === "Bruyant");
  const activeAlerts = noisyZones.length;

  const occupationRate = Math.round((totalOccupied / totalCapacity) * 100);

  return (
    <MainLayout
      title="Dashboard"
      subtitle="Vue d'ensemble de l'occupation et du niveau sonore de la bibliothèque"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard 
          title="Places Occupées" 
          value={`${totalOccupied}/${totalCapacity}`}
          icon="Users" 
          color="bg-purple-100 text-purple-600" 
          badge={occupationRate > 70 ? "Pleine" : occupationRate > 50 ? "Moyenne" : "Calme"} 
        />
        <StatCard 
          title="Zones Silencieuses" 
          value={`${silentZones}/${totalZones}`} 
          icon="VolumeX" 
          color="bg-emerald-100 text-emerald-600" 
        />
        <StatCard 
          title="Zones Actives" 
          value={totalZones} 
          icon="MapPin" 
          color="bg-indigo-100 text-indigo-600" 
        />
        <StatCard 
          title="Alertes Actives" 
          value={activeAlerts}
          icon="AlertTriangle" 
          color="bg-orange-100 text-orange-600" 
        />
      </div>

      {/* Zones */}
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Zones de la Bibliothèque</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {zones.map((zone) => (
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
          <div className="space-y-4">
            {alerts.length === 0 ? (
              <p className="text-slate-500">Aucune alerte récente</p>
            ) : (
              alerts.slice(0, 5).map((alert, index) => (
                <AlertItem
                  key={index}
                  zone={alert.message}
                  type={alert.type}
                  time={alert.time}
                />
              ))
            )}
          </div>

        </div>
      </div>
    </MainLayout>
  );
}