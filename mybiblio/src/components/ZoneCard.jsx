export default function ZoneCard({ zone }) {
  const percent = Math.round((zone.occupation / zone.capacity) * 100)
  const barColor = percent > 90 ? "bg-red-500" : percent > 70 ? "bg-orange-500" : "bg-green-500"

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg text-gray-900">{zone.name}</h3>
          <p className="text-sm text-gray-500">{zone.floor}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          zone.color === "green" ? "bg-green-100 text-green-700" :
          zone.color === "yellow" ? "bg-yellow-100 text-yellow-700" :
          "bg-gray-100 text-gray-700"
        }`}>
          {zone.status}
        </span>
      </div>

      <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
        <span>{zone.noise}</span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Occupation</span>
          <span className="font-semibold">{zone.occupation}/{zone.capacity}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div className={`${barColor} h-3 rounded-full transition-all duration-1000`} style={{width: `${percent}%`}}></div>
        </div>
      </div>
    </div>
  )
}