export default function AlertItem({ zone, type, time }) {
  return (
    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex justify-between items-center">
      <div>
        <p className="font-semibold text-gray-900">{zone}</p>
        <p className="text-sm text-gray-600">{type}</p>
      </div>
      <p className="text-sm text-gray-500">{time}</p>
    </div>
  )
}