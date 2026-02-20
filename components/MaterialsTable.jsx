import React from "react";

function Badge({ value }) {
  if (!value) return null;

  let color =
    value === "Excellent"
      ? "bg-green-100 text-green-800"
      : value === "Very Good"
      ? "bg-blue-100 text-blue-800"
      : value === "Good"
      ? "bg-indigo-100 text-indigo-800"
      : value === "Best"
      ? "bg-amber-100 text-amber-800"
      : "bg-slate-100 text-slate-700";

  return (
    <span
      className={`inline-flex px-2 py-1 rounded-md text-xs font-semibold ${color}`}
    >
      {value}
    </span>
  );
}

function formatNumber(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return "";
  return num.toLocaleString();
}

function formatTempRange(low, high) {
  if (!low && !high) return "";
  return `${low ?? ""}° to ${high ?? ""}°`;
}

export default function MaterialsTable({
  materials = [],
  selectedIds = [],
  onToggleSelect,
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-[1200px] w-full text-sm">
        <thead className="bg-slate-50 text-slate-700">
          <tr className="border-b border-slate-200 text-xs uppercase tracking-wide">
            <th className="px-4 py-3 text-left">Select</th>
            <th className="px-4 py-3 text-left">Material</th>
            <th className="px-4 py-3 text-left">Low Friction</th>
            <th className="px-4 py-3 text-left">Wear Resistance</th>
            <th className="px-4 py-3 text-left">Tensile Strength</th>
            <th className="px-4 py-3 text-left">Limiting PV</th>
            <th className="px-4 py-3 text-left">Water Absorption</th>
            <th className="px-4 py-3 text-left">Grease Compat.</th>
            <th className="px-4 py-3 text-left">Chemical Resist.</th>
            <th className="px-4 py-3 text-left">Temp Range (°F)</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {materials.length === 0 && (
            <tr>
              <td colSpan={10} className="px-4 py-6 text-slate-500">
                No materials match filters.
              </td>
            </tr>
          )}

          {materials.map((m) => {
            const id = m.material;
            const checked = selectedIds.includes(id);

            return (
              <tr key={id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleSelect?.(id)}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                </td>

                <td className="px-4 py-3 font-medium text-slate-900">
                  {m.material}
                </td>

                <td className="px-4 py-3">
                  <Badge value={m.low_friction} />
                </td>

                <td className="px-4 py-3">
                  <Badge value={m.wear_resistance} />
                </td>

                <td className="px-4 py-3">
                  {formatNumber(m.tensile_strength)}
                </td>

                <td className="px-4 py-3">
                  {formatNumber(m.limiting_pv)}
                </td>

                <td className="px-4 py-3">
                  {m.water_absorption}
                </td>

                <td className="px-4 py-3">
                  <Badge value={m.grease_compatibility} />
                </td>

                <td className="px-4 py-3">
                  <Badge value={m.chemical_resistance} />
                </td>

                <td className="px-4 py-3">
                  {formatTempRange(m.low_temperature, m.high_temperature)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
