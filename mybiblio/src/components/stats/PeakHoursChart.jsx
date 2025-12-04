// src/components/stats/PeakHoursChart.jsx
import peakHoursData from '../../assets/data/peakHours.json';

export default function PeakHoursChart() {
  if (!peakHoursData || peakHoursData.length === 0) {
    return <div className="text-center text-slate-500">Aucune donnée</div>;
  }

  const maxValue = Math.max(...peakHoursData.map((h) => h.value));

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-10">
        Distribution des Heures de Pointe
      </h2>

      {/* Graphique – hauteur augmentée pour des barres plus imposantes */}
      <div className="relative h-80 flex items-end justify-between gap-6 px-8">
        {peakHoursData.map((slot) => {
          const heightPercent = maxValue === 0 ? 0 : (slot.value / maxValue) * 100;

          return (
            <div key={slot.time} className="flex flex-col items-center flex-1">
              {/* Pourcentage en haut */}
              <span className="mb-4 text-base font-bold text-purple-700">
                {slot.value}%
              </span>

              {/* Barre verticale – plus large et plus haute */}
              <div className="relative w-30">
                {slot.value > 0 ? (
                  <div
                    className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-purple-600 to-indigo-500 rounded-t-3xl transition-all duration-1200 ease-out shadow-xl"
                    style={{
                      height: `${heightPercent}%`,
                    }}
                  />
                ) : null}

                {/* Base grise plus visible */}
                <div className="w-30 h-60 bg-slate-200 rounded-t-3xl shadow-sm" />
              </div>

              {/* Label horaire en bas */}
              <span className="mt-6 text-sm text-slate-600 font-medium">
                {slot.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}