import { Users, VolumeX, MapPin, AlertTriangle, Volume2, BookOpen, Headphones, Coffee } from 'lucide-react';

export default function StatCard({ title, value, icon, color, badge }) {
  // Mapping des noms → vraies icônes Lucide
  const iconMap = {
    Users: Users,
    VolumeX: VolumeX,
    MapPin: MapPin,
    AlertTriangle: AlertTriangle,
    Volume2: Volume2,
    BookOpen: BookOpen,
    Headphones: Headphones,
    Coffee: Coffee,
  };

  const IconComponent = iconMap[icon] || Users; // fallback si icône inconnue

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-600 font-medium">{title}</p>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <IconComponent className="w-7 h-7" />
        </div>
      </div>

      <div className="flex items-end justify-between">
        <p className="text-4xl font-bold text-gray-900">{value}</p>
        {badge && (
          <span className="ml-4 px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-bold rounded-full">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}