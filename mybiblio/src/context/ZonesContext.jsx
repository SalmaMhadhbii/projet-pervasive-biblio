import { createContext, useContext, useState, useEffect } from 'react';
import zonesData from '../assets/data/Zones.json';
import toast from 'react-hot-toast';
import { Volume2 } from 'lucide-react';

const ZonesContext = createContext();

export function ZonesProvider({ children }) {
  const [zones, setZones] = useState(zonesData);
  const [alerts, setAlerts] = useState([]);

  // NOUVEAU : état pour stocker la zone réservée par l'utilisateur
  const [reservedZoneId, setReservedZoneId] = useState(null); // null = pas de réservation


  const removeAlert = (index) => {
    setAlerts(prev => prev.filter((_, i) => i !== index));
  };


  const sendNudgeToStudents = (zoneId, message) => {
    const time = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    const zone = zones.find(z => z.id === zoneId);
    if (!zone) return;

    setAlerts(prev => [
      { time, message: message || `Nudge envoyé à la zone ${zone.name}`, type: "nudge", target: "student", zoneId },
      ...prev
    ].slice(0, 20));
  };


  // Simulation (useEffect)
  useEffect(() => {
    const interval = setInterval(() => {
      setZones(prevZones => {
        return prevZones.map(zone => {
  
          const change = Math.floor(Math.random() * 5) - 2;
          const newOccupation = Math.max(0, Math.min(zone.capacity, zone.occupation + change));
          const newSeats = [...zone.seats];
          const diff = newOccupation - zone.occupation;

          if (diff > 0) {
            let added = 0;
            while (added < diff) {
              const idx = Math.floor(Math.random() * zone.capacity);
              if (!newSeats[idx]) {
                newSeats[idx] = true;
                added++;
              }
            }
          } else if (diff < 0) {
            let removed = 0;
            while (removed < -diff) {
              const idx = Math.floor(Math.random() * zone.capacity);
              if (newSeats[idx]) {
                newSeats[idx] = false;
                removed++;
              }
            }
          }

          // Calcul du bruit
          let noiseLevel = Math.round(20 + (newOccupation / zone.capacity) * 40 + Math.random() * 10);

          // Ajout d'une variation pour faire redescendre le bruit plus facilement
          if (zone.noise === "Bruyant" && noiseLevel > 35) {
            // On simule une baisse plus rapide si c'était bruyant
            noiseLevel -= Math.floor(Math.random() * 15); // baisse aléatoire
          }

          // Déterminer le niveau sonore
          const noise = noiseLevel < 32 ? "Silencieux" : noiseLevel < 48 ? "Modéré" : "Bruyant";


          // Détection du passage à "Bruyant"
          const wasNoisy = zone.noise === "Bruyant";
          const isNoisy = noise === "Bruyant";

          if (!wasNoisy && isNoisy) {
            const time = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
            const alertMsg = `Zone ${zone.name} est devenue bruyante (${noiseLevel} dB)`;

            // Toujours ajouter dans les alertes générales
            setAlerts(prev => [
            {
                time,
                message: alertMsg,
                type: "alert",
                target: "admin", // pour la navbar admin
                zoneId: zone.id
            },
            ...prev
            ].slice(0, 20));


            // NOTIFICATION SEULEMENT SI C'EST LA ZONE RÉSERVÉE
            if (reservedZoneId === zone.id) {
              const alertMsg = `Un peu de bruit dans ${zone.name}, merci de rester calme.`;

              setAlerts(prev => [
                { time, message: alertMsg, type: "alert", target: "student", zoneId: zone.id },
                ...prev
              ].slice(0, 20));

              toast(alertMsg, {
                icon: <Volume2 className="w-6 h-6" />,
                style: { borderRadius: '12px', background: '#fef3c6', color: '#bb4d00' },
                duration: 8000,
                position: 'top-center',
              });
            }


          }

          return { ...zone, seats: newSeats, occupation: newOccupation, noiseLevel, noise };
        });
      });
    }, 5000); // ou 15000 en production

    return () => clearInterval(interval);
  }, [reservedZoneId]); // ← Important : on ajoute reservedZoneId comme dépendance

  
  // Sauvegarde des zones dans localStorage
  useEffect(() => {
    localStorage.setItem("zones", JSON.stringify(zones));
  }, [zones]);

  const addZone = (newZoneData) => {
  const newZone = {
    id: Date.now(),
    name: newZoneData.name,
    type: newZoneData.type,
    floor: newZoneData.floor || "Étage 1",
    capacity: newZoneData.capacity || 22,

    occupation: 0,
    seats: Array(newZoneData.capacity || 22).fill(false),

    noise: "Silencieux",
    noiseLevel: 25,
    color: "green",
    status: "Disponible",
  };

  setZones(prev => [...prev, newZone]);
};

const deleteZone = (zoneId) => {
  setZones(prev => prev.filter(z => z.id !== zoneId));
};

const addAlert = ({ message, type = "alert", target = "student", zoneId = null }) => {
  const time = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  setAlerts(prev => [
    { time, message, type, target, zoneId },
    ...prev
  ].slice(0, 20));
};




  
  
  // Provider : on expose aussi reservedZoneId et son setter
   return (
    <ZonesContext.Provider value={{
      zones,
      setZones,
      alerts,
      reservedZoneId,
      setReservedZoneId,
      sendNudgeToStudents,  
      addZone,        
      deleteZone,
      removeAlert,
      addAlert
    }}>
      {children}
    </ZonesContext.Provider>
  );
}

export function useZones() {
  return useContext(ZonesContext);
}