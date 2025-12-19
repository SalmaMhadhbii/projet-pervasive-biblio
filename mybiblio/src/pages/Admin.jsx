// src/pages/Admin.jsx
import { useState, useEffect } from "react";
import { useZones } from "../context/ZonesContext";

import MainLayout from "../layouts/MainLayout";
import AdminStatCard from "../components/admin/AdminStatCard";
import ZoneToggleCard from "../components/admin/ZoneToggleCard";
import ActivityLogItem from "../components/ActivityLogItem";
//import zonesData from "../assets/data/Zones.json";
import toast from 'react-hot-toast';
import { Volume2 } from 'lucide-react';

import { Plus, Trash2, MapPin } from "lucide-react";


export default function Admin() {
  // Paramètres nudges (état réel)
  const [nudgeSettings, setNudgeSettings] = useState({
    autoNudge: true,
    adminNotifications: true,
  });


  const { zones, sendNudgeToStudents, addZone, deleteZone } = useZones();



  

  // état ADMIN uniquement
  const [adminZones, setAdminZones] = useState([]);
  useEffect(() => {
  setAdminZones(zones.map(z => ({ ...z, active: true })));
  }, [zones]);



  const [log, setLog] = useState([]);

  

  // Calculs en temps réel
  const activeZones = adminZones.filter(z => z.active).length;
  const activeAlerts = adminZones.filter(
  z => z.active && z.noise === "Bruyant"
  ).length;

  const totalSensors = adminZones.length * 6;


  // Fonctions
  const toggleZone = (zoneId) => {
  setAdminZones(prev =>
    prev.map(z =>
      z.id === zoneId ? { ...z, active: !z.active } : z
    )
  );

  const zone = adminZones.find(z => z.id === zoneId);
  const action = zone?.active ? "désactivée" : "activée";

  addToLog(`Zone ${zone.name} ${action}`, "activation");
  };


  const sendNudge = (zoneId) => {
  const zone = adminZones.find(z => z.id === zoneId);
  if (!zone || !zone.active) return;

  addToLog(`Nudge envoyé à ${zone.name}`, "nudge");

  toast.success(`Nudge envoyé à ${zone.name}`, {
    icon: <Volume2 className="w-6 h-6" />,
    style: { borderRadius: '12px', background: '#272437ff', color: '#fff' },
  });
    sendNudgeToStudents(zoneId);
};


  const addToLog = (message, type = "info") => {
    const time = new Date().toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setLog((prev) => [{ time, message, type }, ...prev].slice(0, 20));
  };


  const [newZone, setNewZone] = useState({
    name: "",
    type: "",
    floor: "Étage 1",
    capacity: 22,
  });


  const handleAddZone = () => {
    if (!newZone.name || !newZone.type) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }

    addZone(newZone);
    addToLog(`Zone ${newZone.name} ajoutée`, "zone");

    setNewZone({
      name: "",
      type: "",
      floor: "Étage 1",
      capacity: 22,
    });
  };


  const toggleSetting = (key) => {
    setNudgeSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));

    addToLog(
      `Paramètre "${key}" ${nudgeSettings[key] ? "désactivé" : "activé"}`,
      "setting"
    );
  };




  return (
    <MainLayout
      title="Administration"
      subtitle="Gestion des zones, paramètres et système de nudges"
    >
      {/* === STATISTIQUES === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <AdminStatCard
          title="Alertes Actives"
          value={activeAlerts}
          icon="bell"
          color="bg-purple-300"
        />
        <AdminStatCard
          title="Zones Actives"
          value={activeZones}
          icon="shield"
          color="bg-emerald-300"
        />
        <AdminStatCard
          title="Capteurs"
          value={totalSensors}
          icon="radio"
          color="bg-orange-300"
        />
      </div>

      {/* === GESTION DES ZONES === */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Gestion des Zones
        </h2>
        <div className="space-y-5">
          {adminZones.map((zone) => (
            <ZoneToggleCard
              key={zone.id}
              zone={{
              id: zone.id,
              name: zone.name,
              active: zone.active,
              alerts: zone.noise === "Bruyant" ? 1 : 0,
              noiseLevel: zone.noiseLevel,
              noise: zone.noise,
            }}
              onToggle={toggleZone}
              onSendNudge={sendNudge}
            />
          ))}
        </div>
      </section>

      {/* === SEUILS + PARAMÈTRES + JOURNAL === */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Seuils de détection */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <h3 className="text-xl font-bold mb-6">Seuils de Détection</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-green-600 font-medium">Silencieux</span>
                <span>≤ 40 dB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-green-500 h-4 rounded-full w-1/3" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-yellow-600 font-medium">Modéré</span>
                <span>41–60 dB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-yellow-500 h-4 rounded-full w-2/3" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-red-600 font-medium">Bruyant</span>
                <span>&gt; 60 dB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-red-500 h-4 rounded-full w-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Paramètres nudges */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <h3 className="text-xl font-bold mb-6">Paramètres des Nudges</h3>

          <div className="space-y-8">

            {/* Nudges automatiques */}
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Nudges Automatiques</p>
                <p className="text-sm text-slate-600">Envoi auto si &gt; 60 dB</p>
              </div>

              <button
                onClick={() => toggleSetting("autoNudge")}
                className={`relative inline-flex h-11 w-20 items-center rounded-full transition-colors ${
                  nudgeSettings.autoNudge ? "bg-purple-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-9 w-9 transform rounded-full bg-white shadow transition-transform ${
                    nudgeSettings.autoNudge ? "translate-x-10" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Notifications admin */}
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Notifications Admin</p>
                <p className="text-sm text-slate-600">Alertes en temps réel</p>
              </div>

              <button
                onClick={() => toggleSetting("adminNotifications")}
                className={`relative inline-flex h-11 w-20 items-center rounded-full transition-colors ${
                  nudgeSettings.adminNotifications ? "bg-purple-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-9 w-9 transform rounded-full bg-white shadow transition-transform ${
                    nudgeSettings.adminNotifications ? "translate-x-10" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

          </div>
        </div>

      </div>

      

      {/* === JOURNAL D'ACTIVITÉ === */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <h3 className="text-xl font-bold mb-6">Journal d’Activité Récente</h3>
        <div className="max-h-96 overflow-y-auto">
          {log.map((entry, i) => (
            <ActivityLogItem key={i} {...entry} />
          ))}
        </div>
      </div>

      

       {/* === AJOUT / SUPPRESSION DES ZONES === */}
      <section className="mt-20 mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Configuration des Zones
        </h2>

        {/* Formulaire */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Nom de la zone *"
              value={newZone.name}
              onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
              className="px-4 py-2 rounded-xl border"
            />
            <input
              type="text"
              placeholder="Type *"
              value={newZone.type}
              onChange={(e) => setNewZone({ ...newZone, type: e.target.value })}
              className="px-4 py-2 rounded-xl border"
            />
            <select
              value={newZone.floor}
              onChange={(e) => setNewZone({ ...newZone, floor: e.target.value })}
              className="px-4 py-2 rounded-xl border"
            >
              <option>RDC</option>
              <option>Étage 1</option>
              <option>Étage 2</option>
              <option>Étage 3</option>
            </select>
            <input
              type="number"
              min={1}
              value={newZone.capacity}
              onChange={(e) =>
                setNewZone({ ...newZone, capacity: Number(e.target.value) })
              }
              className="px-4 py-2 rounded-xl border"
            />
          </div>

          <button
            onClick={handleAddZone}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter la zone
          </button>
        </div>

        {/* Liste + suppression */}
        <div className="space-y-3">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border"
            >
              <div className="flex items-center gap-3">
                <MapPin className="text-indigo-600" />
                <div>
                  <p className="font-medium">{zone.name}</p>
                  <p className="text-sm text-gray-500">
                    {zone.floor} • {zone.capacity} places
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  deleteZone(zone.id);
                  addToLog(`Zone ${zone.name} supprimée`, "zone");
                }}
                className="text-red-500 hover:bg-red-100 p-2 rounded-lg"
              >
                <Trash2 />
              </button>
            </div>
          ))}
        </div>
      </section>



    </MainLayout>
  );
}