import insights from '../../assets/data/insights.json';
import { Lightbulb } from 'lucide-react';

export default function InsightsBox() {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-200 p-8 mt-10">
      <div className="flex items-center gap-3 mb-6">
        <Lightbulb className="w-8 h-8 text-purple-600" />
        <h2 className="text-2xl font-bold text-slate-900">Insights & Recommandations</h2>
      </div>
      <ul className="space-y-4">
        {insights.map((insight, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="mt-1.5 w-2 h-2 bg-purple-600 rounded-full flex-shrink-0" />
            <p className="text-slate-700 leading-relaxed">{insight}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}