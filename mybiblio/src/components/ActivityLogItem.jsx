// src/components/ActivityLogItem.jsx
export default function ActivityLogItem({ time, message, type = "info" }) {
  const colors = {
    nudge: "bg-yellow-500",
    activation: "bg-green-500",
    alert: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <div className="flex items-start gap-4 py-3 border-b border-slate-100 last:border-0">
      <div className={`w-3 h-3 rounded-full mt-1.5 ${colors[type]}`} />
      <div>
        <span className="text-sm text-slate-500">{time}</span>
        <p className="text-slate-800 font-medium">{message}</p>
      </div>
    </div>
  );
}