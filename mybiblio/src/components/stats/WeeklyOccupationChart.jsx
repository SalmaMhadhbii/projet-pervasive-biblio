// src/components/stats/WeeklyOccupationChart.jsx
import weeklyOccupation from '../../assets/data/weeklyOccupation.json';

export default function WeeklyOccupationChart() {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        Occupation Hebdomadaire
      </h2>

      <div className="space-y-6">
        {weeklyOccupation.map((d) => (
          <div key={d.day} className="flex items-center gap-6">
            {/* Jour */}
            <span className="w-12 text-sm font-semibold text-slate-700 text-right">
              {d.day}
            </span>

            {/* Barre fine + pourcentage à droite */}
            <div className="flex-1 flex items-center gap-4">
              <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-1000 ease-out"
                  style={{ width: `${d.value}%` }}
                />
              </div>

              {/* Pourcentage à droite */}
              <span className="w-16 text-right text-sm font-bold text-slate-800">
                {d.value}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}