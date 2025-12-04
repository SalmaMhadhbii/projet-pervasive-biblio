// src/components/stats/StatsOverviewCards.jsx
import { TrendingUp, Clock, VolumeX, ArrowUp } from 'lucide-react';
import statsOverview from '../../assets/data/statsOverview.json';

const StatCard = ({ title, value, subtitle, icon: Icon, trend }) => (
  <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 rounded-lg bg-purple-100">
        <Icon className="w-6 h-6 text-purple-600" />
      </div>
      {trend && (
        <span className="flex items-center gap-1 text-sm font-medium text-green-600">
          <ArrowUp className="w-4 h-4" />
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-sm font-medium text-slate-600">{title}</h3>
    <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
    {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
  </div>
);

export default function StatsOverviewCards() {
  const { averageOccupation, peakHours, silentZones, trend } = statsOverview;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <StatCard
        title="Taux d'Occupation Moyen"
        value={averageOccupation.value}
        subtitle={averageOccupation.subtitle}
        icon={TrendingUp}
        trend={averageOccupation.trend}
      />
      <StatCard
        title="Heures de Pointe"
        value={peakHours.range}
        subtitle={peakHours.occupation}
        icon={Clock}
      />
      <StatCard
        title="Zones Silencieuses"
        value={silentZones.ratio}
        subtitle={silentZones.percentage}
        icon={VolumeX}
      />
      <StatCard
        title="Tendance"
        value={trend.value}
        subtitle={trend.subtitle}
        icon={ArrowUp}
        trend={trend.value}
      />
    </div>
  );
}