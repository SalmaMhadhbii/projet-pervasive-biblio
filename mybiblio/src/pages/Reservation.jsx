import MainLayout from '../layouts/MainLayout';
import { Filter, Volume2, Users, BookOpen, X} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useZones } from '../context/ZonesContext';
import { toast } from 'react-hot-toast';
import { Bell } from 'lucide-react';

export default function Reservation() {
  const {
    zones,
    setZones,
    reservedZoneId,
    setReservedZoneId,
    addAlert
  } = useZones();

const [selectedZone, setSelectedZone] = useState(zones[0]);

  const [selectedSeat, setSelectedSeat] = useState(null);
  const [reservedSeat, setReservedSeat] = useState(null);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [pendingSeat, setPendingSeat] = useState(null);
  //const [search, setSearch] = useState('');
  //const [noiseFilter, setNoiseFilter] = useState('all');



   

 // filtrage
  // const filteredZones = zones.filter(zone => {
  //   const matchesSearch = zone.name.toLowerCase().includes(search.toLowerCase());
  //   const matchesNoise = noiseFilter === 'all' || zone.noise === noiseFilter;
  //   return matchesSearch && matchesNoise;
  // });

  // Met à jour la zone sélectionnée quand les données changent
  const currentZone = zones.find(z => z.id === selectedZone.id) || selectedZone;

  // Ajoute cette ligne APRÈS const currentZone = ...
useEffect(() => {
  // Quand les zones changent, on garde la bonne zone sélectionnée
  const updatedZone = zones.find(z => z.id === selectedZone.id);
  if (updatedZone && updatedZone !== selectedZone) {
    setSelectedZone(updatedZone);
  }
}, [zones]);
  
  
  
  
  // NOUVELLE FONCTION : quand on clique sur une place
  // Gestion du clic sur une place
  const handleSeatClick = (index) => {
    const isTakenByOthers = currentZone.seats[index] && index !== reservedSeat;

    if (isTakenByOthers) return;

    if (reservedSeat !== null && index !== reservedSeat) {
      // Tu as déjà réservé → on ouvre la modale stylée
      setPendingSeat(index);
      setShowChangeModal(true);
      return;
    }

    // Première réservation ou clic sur sa propre place réservée
    setSelectedSeat(index);
  };

  // Confirmation du changement de place
  const confirmChangeSeat = () => {
    if (pendingSeat === null) return;

    setZones(prev => prev.map(zone =>
      zone.id === currentZone.id
        ? {
            ...zone,
            seats: zone.seats.map((s, i) =>
              i === reservedSeat ? false :
              i === pendingSeat ? true : s
            ),
            // occupation reste identique
          }
        : zone
    ));
    setReservedZoneId(currentZone.id);

    setReservedSeat(pendingSeat);
    setPendingSeat(null);
    setShowChangeModal(false);
    setSelectedSeat(null);
    alert(`Réservation changée → Place #${pendingSeat + 1}`);
  };

  // Confirmation finale de réservation
  const confirmReservation = () => {
    if (selectedSeat === null) return;

    setZones(prev => prev.map(zone =>
      zone.id === currentZone.id
        ? {
            ...zone,
            seats: zone.seats.map((s, i) => i === selectedSeat ? true : s),
            occupation: zone.occupation + 1
          }
        : zone
    ));

    setReservedSeat(selectedSeat);
    setReservedZoneId(currentZone.id); // 🔔 LIEN AVEC LE CONTEXTE
    setSelectedSeat(null);

  };

  // Rendu des sièges (violet = sélectionné OU réservé par toi)
  const renderSeat = (index, position = "normal") => {
    const taken = currentZone.seats[index];
    const isSelected = selectedSeat === index;
    const isReservedByUser = reservedSeat === index;

    return (
      <button
        key={index}
        onClick={() => handleSeatClick(index)}
        disabled={taken && !isReservedByUser}
        className={`
          relative w-14 h-14 rounded-lg font-bold text-white transition-all duration-500 shadow-2xl
          ${position === "top" ? "rotate-180" : ""}
          ${position === "solo" ? "w-20 h-20 rounded-full" : ""}
          ${isReservedByUser || isSelected
            ? 'bg-gradient-to-br from-fuchsia-300 via-purple-300 to-violet-300  ring-2 ring-purple-400/70'
            : taken
              ? 'bg-gradient-to-b from-red-100 to-red-300 border-2 border-red-400 opacity-70 cursor-not-allowed'
              : 'bg-gradient-to-b from-emerald-200 to-teal-300 border-2 border-teal-400 hover:from-emerald-300 hover:to-teal-500 hover:scale-110 hover:shadow-2xl'
          }
        `}
      >
        <span className="drop-shadow-2xl text-lg">{index + 1}</span>
      </button>
    );
  };

  const noisePriority = {
    "Silencieux": 1,
    "Modéré": 2,
    "Bruyant": 3,
  };

  const sortedZones = [...zones].sort(
    (a, b) => noisePriority[a.noise] - noisePriority[b.noise]
  );


  const zoneBgClass =
    currentZone.noise === 'Silencieux' ? 'bg-green-50' :
    currentZone.noise === 'Modéré' ? 'bg-yellow-50' :
    'bg-red-50';


  // Trouve la meilleure zone : silencieuse > modérée > bruyante
  const getRecommendedZone = () => {
    const sorted = [...zones].sort((a, b) => {
      const noiseRank = { 'Silencieux': 0, 'Modéré': 1, 'Bruyant': 2 };
      return noiseRank[a.noise] - noiseRank[b.noise];
    });
    return sorted[0]; // première zone "idéale"
  };


  const notifyRecommendedZone = () => {
  const zone = getRecommendedZone();
  const now = Date.now();
  const lastTime = lastNotifiedZones[zone.id] || 0;

  // cooldown = 2 minutes = 120000 ms
  if (now - lastTime < 120000) return; // ignore si moins de 2min depuis dernière notif

  toast.custom((t) => (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full bg-indigo-100 border-l-4 border-indigo-500 shadow-lg rounded-lg pointer-events-auto flex`}
    >
      <div className="flex-1 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Bell className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-indigo-700">
              Zone recommandée : {zone.name}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="inline-flex text-indigo-500 hover:text-indigo-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  ));


  // 🔔 Ajouter dans notifications
  addAlert({
    type: 'recommendation',
    message: `Zone recommandée : ${zone.name}`,
    time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    target: 'student',
    zoneId: zone.id
  });

  // met à jour le timestamp pour cette zone
  setLastNotifiedZones(prev => ({ ...prev, [zone.id]: now }));
};



  useEffect(() => {
    notifyRecommendedZone();
  }, [zones]);

  const [lastNotifiedZones, setLastNotifiedZones] = useState({});





  return (
    <MainLayout
      title="Carte de la bibliothéque"
      subtitle="Choisissez votre zone et votre siège idéal"
      showBack={true}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* === GAUCHE === */}
        <div className="space-y-6">
          {/* Filtres */}
          {/* <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Filter className="w-6 h-6 text-indigo-600" />
              <h3 className="text-xl font-semibold">Filtres</h3>
            </div>
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition"
            />
            <select
              value={noiseFilter}
              onChange={(e) => setNoiseFilter(e.target.value)}
              className="w-full mt-4 px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition"
            >
              <option value="all">Tous les niveaux</option>
              <option value="Silencieux">Silencieux uniquement</option>
              <option value="Modéré">Modéré uniquement</option>
              <option value="Bruyant">Bruyant uniquement</option>
            </select>
          </div> */}

          {/* Zones */}
          <div className="bg-indigo-50 text-indigo-700 text-sm font-medium text-center py-2">
            Zones classées automatiquement par niveau sonore
          </div>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-b from-indigo-400 to-violet-500 text-white p-4">
              <h3 className="text-xl font-bold text-center">Zones disponibles</h3>
            </div>
            <div className="p-4 space-y-3">
              {sortedZones.map((zone) => {
                const free = zone.capacity - zone.occupation;
                return (
                  <button
                    key={zone.id}
                    onClick={() => { setSelectedZone(zone); setSelectedSeat(null); }}
                    className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
                      selectedZone?.id === zone.id
                        ? 'border-indigo-600 bg-indigo-50 shadow-md'
                        : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-lg">{zone.name}</h4>
                        <p className="text-sm text-slate-600 mt-1 flex items-center gap-2">
                          <Users className="w-4 h-4" />{free} / {zone.capacity} places
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                        zone.noise === 'Silencieux' ? 'bg-emerald-100 text-emerald-700' :
                        zone.noise === 'Modéré' ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        <Volume2 className="w-3 h-3" />{zone.noise}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* === DROITE === */}
        <div className="lg:col-span-3 space-y-8">
          {/* Grille + tout le reste identique à avant */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
             {/* En-tête de la zone */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-purple-100 px-5 py-2 rounded-full mb-4">
                  <BookOpen className="w-5 h-5 text-purple-700" />
                  <span className="text-purple-800 font-semibold">Zone sélectionnée</span>
                </div>
                <h2 className="text-5xl font-black text-gray-800 mb-3">{currentZone.name}</h2>
                <div className="flex justify-center gap-8">
                  <div className="bg-green-100 px-6 py-3 rounded-full flex items-center gap-3">
                    <Users className="w-5 h-5 text-green-700" />
                    <span className="font-bold text-green-800">
                      {currentZone.capacity - currentZone.occupation} places libres
                    </span>
                  </div>
                  <div className="bg-orange-100 px-6 py-3 rounded-full flex items-center gap-3">
                    <Volume2 className="w-5 h-5 text-orange-700" />
                    <span className="font-bold text-orange-800">{currentZone.noiseLevel} dB</span>
                  </div>
                </div>
              </div>


            

           {/* SALLE DE BIBLIOTHÈQUE — VERSION DESIGN COHÉRENT AVEC TON SITE */}
            <div className={`${zoneBgClass} rounded-3xl p-8 md:p-12 border border-slate-200 overflow-hidden`}>
              <div className="space-y-16 max-w-6xl mx-auto">

              {/* === RANGÉE 1 : 2 tables de 6 places (1 à 12) === */}
                    <div className="flex justify-center gap-24">
                      {[0, 6].map(start => (
                        <div key={start} className="flex flex-col items-center">
                          
                          {/* Chaises en HAUT (anciennement "bas") */}
                          <div className="flex justify-center gap-10 mb-2">
                            {[start+3, start+4, start+5].map(i => renderSeat(i))}
                          </div>

                          {/* Table */}
                          <div className="w-80 h-28 bg-gradient-to-b from-orange-100 to-orange-200 rounded-3xl shadow-2xl border-2 border-orange-300"></div>
                          
                          {/* Chaises en BAS (anciennement "haut") */}
                          <div className="flex justify-center gap-10 mt-2">
                            {[start, start+1, start+2].map(i => renderSeat(i))}
                          </div>
                        </div>
                      ))}
                    </div>

                {/* Allée centrale */}
                <div className="text-center">
                  <span className="inline-block px-12 py-4 bg-orange-100 text-orange-700 rounded-full font-bold text-lg">
                      Allée centrale
                    </span>
                </div>

                {/* === RANGÉE 2 : Table centrale + coins étude === */}
                <div className="flex justify-center items-start gap-16">
                  {/* Coin gauche */}
                  <div className="text-center">
                    <div className="w-32 h-20 bg-gradient-to-b from-orange-100 to-orange-200 rounded-xl shadow-xl border-2 border-orange-300"></div>
                    <div className="mt-6 space-y-6">
                      {renderSeat(12)}                    
                    </div>
                  </div>

                  {/* Grande table centrale */}
                  <div className="flex flex-col items-center">
                    <div className="w-90 h-30 bg-gradient-to-b from-orange-100 to-orange-200 rounded-3xl shadow-2xl border-2 border-orange-300"></div>
                  
                    <div className="flex gap-10 mt-10">
                      {[13,14,15,16].map(i => renderSeat(i))}
                    </div>
                  </div>

                  {/* Coin droit */}
                  <div className="text-center">
                    <div className="w-32 h-20 bg-gradient-to-b from-orange-100 to-orange-200 rounded-xl shadow-xl border-2 border-orange-300"></div>
                    <div className="mt-6 space-y-6">
                      {renderSeat(17)}
                    </div>
                  </div>
                </div>

                {/* === Dernière rangée : 2 coins lecture ronds === */}
                <div className="flex justify-between px-32 mt-16">
                  <div className="text-center">
                    {renderSeat(18)}
                    <div className="w-28 h-28 mb-2 mt-2 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 shadow-2xl border-2 border-orange-300"></div>
                    {renderSeat(19)}
                    {/* <p className="text-slate-600 text-sm mt-3 font-medium">Coin lecture</p> */}
                  </div>
                  <div className="text-center">
                    {renderSeat(20)}
                    <div className="w-28 h-28 mb-2 mt-2 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 shadow-2xl border-2 border-orange-300"></div>
                    {renderSeat(21)}
                    {/* <p className="text-slate-600 text-sm mt-3 font-medium">Silence absolu</p> */}
                  </div>
                </div>
              </div>
            </div>


        

            <div className="flex justify-center gap-8 mt-8">
              <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-gradient-to-b from-emerald-200 to-teal-300"></div><span className="font-medium">Disponible</span></div>
              <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-gradient-to-b from-red-100 to-red-300 "></div><span className="font-medium">Occupée</span></div>
              <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-gradient-to-b from-fuchsia-300 to-violet-300"></div><span className="font-medium">Sélectionnée</span></div>
            </div>
          </div>

          {/* MODALE STYLÉE */}
          {showChangeModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate__animated animate__zoomIn">
                <div className="flex justify-between items-center mb-6">
                  {/* <div span=" "></div> */}
                  <h3 className="text-3xl text-center font-black bg-gray-700 bg-clip-text text-transparent">
                    Changer de place ?
                  </h3>
                  <button
                    onClick={() => setShowChangeModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="text-center space-y-6">
                  <div className="text-6xl font-black text-indigo-600">
                    #{reservedSeat + 1}
                  </div>
                  <p className="text-gray-600 text-lg">
                    Tu as déjà réservé la <span className="font-bold text-indigo-600">place #{reservedSeat + 1}</span>
                  </p>
                  <div className="text-5xl">↓</div>
                  <div className="text-6xl font-black text-indigo-600">
                    #{pendingSeat + 1}
                  </div>
                  <p className="text-gray-700 text-xl font-medium">
                    Tu veux maintenant la place #{pendingSeat + 1} ?
                  </p>
                </div>

                <div className="flex gap-4 mt-10">
                  <button
                    onClick={() => setShowChangeModal(false)}
                    className="flex-1 py-4 bg-gray-200 text-gray-800 rounded-2xl font-bold hover:bg-gray-300 transition"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={confirmChangeSeat}
                    className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-2xl font-bold hover:shadow-xl transform hover:scale-105 transition"
                  >
                    Oui, changer !
                  </button>
                </div>
              </div>
            </div>
          )}

                   {/* MODALE DE CONFIRMATION DE RÉSERVATION — REMPLACE LE RÉCAPITULATIF */}
          {selectedSeat !== null && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-10 relative overflow-hidden">
                <div className="relative z-10 text-center space-y-8">
                  {/* Titre */}
                  <div>
                    <h2 className="text-4xl font-black bg-gray-600 bg-clip-text text-transparent">
                      Confirmer ta place ?
                    </h2>
                    <p className="text-gray-600 mt-4 text-lg">Cette place sera réservée rien que pour toi !</p>
                  </div>

                  {/* Carte récap */}
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 ">
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-gray-500 uppercase tracking-wider">Zone</p>
                        <p className="text-2xl font-bold text-gray-600 mt-2">{currentZone.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 uppercase tracking-wider">Place</p>
                        <p className="text-5xl font-black text-gray-700 mt-2">#{selectedSeat + 1}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 uppercase tracking-wider mb-3">Ambiance</p>
                        <span className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-lg font-bold shadow-lg ${
                          currentZone.noise === 'Silencieux' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : currentZone.noise === 'Modéré' 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          <Volume2 className="w-5 h-5" />
                          {currentZone.noise}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Boutons */}
                  <div className="flex gap-6 pt-6">
                    <button
                      onClick={() => setSelectedSeat(null)}
                      className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-2xl font-bold text-xl hover:bg-gray-200 transition transform hover:scale-105"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={confirmReservation}
                      className="flex-1 py-2 bg-gradient-to-b from-indigo-400 to-purple-400 text-white rounded-2xl font-bold text-xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition"
                    >
                      Confirmer la réservation !
                    </button>
                  </div>
                </div>

                {/* Croix en haut à droite */}
                <button
                  onClick={() => setSelectedSeat(null)}
                  className="absolute top-6 right-6 p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}