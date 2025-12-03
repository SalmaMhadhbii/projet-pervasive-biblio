import { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { Filter, Volume2, Users, BookOpen} from 'lucide-react';
import zonesData from '../assets/data/Zones.json';

export default function Reservation() {
  const [selectedZone, setSelectedZone] = useState(zonesData[0]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [search, setSearch] = useState('');
  const [noiseFilter, setNoiseFilter] = useState('all');

  const filteredZones = zonesData.filter(zone => {
    const matchesSearch = zone.name.toLowerCase().includes(search.toLowerCase());
    const matchesNoise = noiseFilter === 'all' || zone.noise === noiseFilter;
    return matchesSearch && matchesNoise;
  });

  const currentZone = selectedZone;

  const confirmReservation = () => {
    if (selectedSeat === null) return;
    currentZone.seats[selectedSeat] = true;
    currentZone.occupation += 1;
    setSelectedSeat(null);
    alert(`Place #${selectedSeat + 1} réservée dans ${currentZone.name} !`);
  };

  const renderSeat = (index, position = "normal") => {
  //   Elle vérifie si la place index est occupée (true) ou libre (false) directement depuis le JSON
  const taken = currentZone.seats[index];
  const isSelected = selectedSeat === index;

  return (
    <button
      key={index}
      onClick={() => !taken && setSelectedSeat(index)}
      disabled={taken}
      className={`
        relative w-14 h-14 rounded-lg font-bold text-white transition-all duration-300 shadow-xl
        ${position === "top" ? "rotate-180" : ""}
        ${position === "solo" ? "w-20 h-20 rounded-full" : ""}
        ${isSelected
         ? 'bg-gradient-to-br from-fuchsia-300 to-violet-300 scale-130 ring-2 ring-violet-400/70 shadow-2xl z-50'
          : taken
           
          ? 'bg-gradient-to-b from-red-100 to-red-300 border-2 border-red-400 opacity-70 cursor-not-allowed'
          : 'bg-gradient-to-b from-emerald-200 to-teal-300 border-2 border-teal-400 hover:from-emerald-300 hover:to-teal-500 hover:scale-110 hover:shadow-2xl'
        }
      `}
    >
      {isSelected ? (
        // <Check className="w-10 h-10 ml-2 stroke-[2]" />
        <span className="drop-shadow-lg">{index + 1}</span>
      ) : taken ? (
        <span className="text-2xl"> </span>
      ) : (
        <span className="drop-shadow-lg">{index + 1}</span>
      )}
      {/* Effet lampe de lecture */}
      {/* {!taken && !isSelected && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-8 h-8 bg-yellow-300 rounded-full blur-xl opacity-40"></div>
      )} */}
    </button>
  );
};

  return (
    <MainLayout
      title="Réservation de place"
      subtitle="Choisissez votre zone et votre siège idéal"
      showBack={true}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* === GAUCHE === */}
        <div className="space-y-6">
          {/* Filtres */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
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
          </div>

          {/* Zones */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-b from-indigo-400 to-violet-500 text-white p-4">
              <h3 className="text-xl font-bold text-center">Zones disponibles</h3>
            </div>
            <div className="p-4 space-y-3">
              {filteredZones.map((zone) => {
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
            <div className="bg-amber-50 rounded-3xl p-8 md:p-12  border border-slate-200 overflow-hidden">
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

         {selectedSeat !== null && (
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200">
              <h3 className="text-3xl font-bold text-center mb-10 text-slate-800">
                Récapitulatif de réservation
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
                {/* Zone */}
                <div>
                  <p className="text-slate-500 text-sm uppercase tracking-wider">Zone</p>
                  <p className="text-2xl font-black text-slate-900 mt-3">{currentZone.name}</p>
                </div>

                {/* Place */}
                <div>
                  <p className="text-slate-500 text-sm uppercase tracking-wider">Place</p>
                  <p className="text-5xl font-black text-indigo-600 mt-3">#{selectedSeat + 1}</p>
                </div>

                {/* Ambiance – même style que dans la liste des zones */}
                <div>
                  <p className="text-slate-500 text-sm uppercase tracking-wider mb-3">Ambiance</p>
                  <span className={`inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold shadow-sm ${
                    currentZone.noise === 'Silencieux' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : currentZone.noise === 'Modéré' 
                      ? 'bg-amber-100 text-amber-700' 
                      : 'bg-rose-100 text-rose-700'
                  }`}>
                    <Volume2 className="w-5 h-5" />
                    {currentZone.noise}
                  </span>
                </div>
              </div>

              <button
                onClick={confirmReservation}
                className="mt-12 w-full bg-gradient-to-b from-indigo-400 to-violet-500 text-white font-bold text-xl py-6 rounded-xl hover:bg-indigo-700 transition transform hover:scale-105 shadow-lg"
              >
                Confirmer la réservation
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}