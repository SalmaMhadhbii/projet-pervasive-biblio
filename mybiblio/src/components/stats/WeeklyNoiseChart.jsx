// src/components/stats/WeeklyNoiseChart.jsx
import weeklyNoise from '../../assets/data/weeklyNoise.json';

const getNoiseColor = (value) => {
  if (value < 40) return 'bg-gradient-to-r from-emerald-500 to-emerald-600';
  if (value < 60) return 'bg-gradient-to-r from-orange-500 to-orange-600';
  return 'bg-gradient-to-r from-red-500 to-red-600';
};

export default function WeeklyNoiseChart() {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        Niveau Sonore Moyen
      </h2>

      <div className="space-y-6">
        {weeklyNoise.map((d) => (
          <div key={d.day} className="flex items-center gap-6">
            <span className="w-12 text-sm font-semibold text-slate-700 text-right">
              {d.day}
            </span>

            <div className="flex-1 flex items-center gap-4">
              <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${getNoiseColor(d.value)} transition-all duration-1000 ease-out`}
                  style={{ width: `${d.value}%` }}
                />
              </div>

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