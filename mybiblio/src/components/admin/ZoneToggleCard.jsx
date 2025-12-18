// src/components/admin/ZoneToggleCard.jsx
export default function ZoneToggleCard({ zone, onToggle, onSendNudge }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 flex items-center justify-between">
      <div className="flex items-center gap-5">
        {/* Toggle */}
        <button
          onClick={() => onToggle(zone.id)}
          className={`relative inline-flex h-11 w-20 items-center rounded-full transition-colors ${
            zone.active ? "bg-violet-400" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-9 w-9 transform rounded-full bg-white shadow-md transition-transform ${
              zone.active ? "translate-x-10" : "translate-x-1"
            }`}
          />
        </button>

        {/* Infos zone */}
        <div>
          <h3 className="font-semibold text-lg text-slate-900">{zone.name}</h3>
          <div className="flex items-center gap-3 mt-2">
            {zone.alerts > 0 && (
              <span className="px-3 py-1 text-xs font-bold text-white bg-red-400 rounded-full">
                {zone.alerts} alerte{zone.alerts > 1 ? "s" : ""}
              </span>
            )}
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                zone.active
                  ? "bg-purple-100 text-purple-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {zone.active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>

      {/* Bouton Nudge */}
      <button
        onClick={() => onSendNudge(zone.id)}
        disabled={!zone.active}
        className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${
          zone.active
            ? "bg-violet-400 text-white hover:bg-purple-700 shadow-lg"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        Envoyer Nudge
      </button>
    </div>
  );
}