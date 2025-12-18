// src/components/admin/AdminStatCard.jsx
import { Bell, Shield, Radio } from "lucide-react";

const icons = {
  bell: Bell,
  shield: Shield,
  radio: Radio,
};

export default function AdminStatCard({ title, value, icon, color }) {
  const Icon = icons[icon];

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 flex items-center justify-between">
      <div>
        <p className="text-slate-600 text-sm font-medium">{title}</p>
        <p className="text-4xl font-bold text-slate-900 mt-2">{value}</p>
      </div>
      <div className={`p-4 rounded-2xl ${color}`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
    </div>
  );
}