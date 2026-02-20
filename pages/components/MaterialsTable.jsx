import React from "react";

export default function MaterialsTable({
  data = [],
  isLoading = false,
  selectedMaterials = [],
  onToggleSelection,
}) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        Loading…
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-700">
          <tr>
            <th className="p-3 text-left">Select</th>
            <th className="p-3 text-left">Material</th>
            <th className="p-3 text-left">Low Friction</th>
            <th className="p-3 text-left">Wear Resistance</th>
            <th className="p-3 text-left">Temp Range</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td className="p-4 text-slate-500" colSpan={5}>
                No materials yet (we’ll connect data next).
              </td>
            </tr>
          ) : (
            data.map((m) => {
              const checked = selectedMaterials.includes(m.id);
              return (
                <tr key={m.id} className="border-t border-slate-100">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggleSelection?.(m.id)}
                    />
                  </td>
                  <td className="p-3 font-medium text-slate-900">{m.material}</td>
                  <td className="p-3">{m.low_friction ?? "-"}</td>
                  <td className="p-3">{m.wear_resistance ?? "-"}</td>
                  <td className="p-3">
                    {m.low_temperature != null && m.high_temperature != null
                      ? `${m.low_temperature}° to ${m.high_temperature}°`
                      : "-"}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
