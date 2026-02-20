import React from "react";

function Badge({ value }) {
  if (!value) return null;

  const v = String(value).trim();

  // Simple, readable "pill" styling
  const base =
    "inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-semibold whitespace-nowrap";

  // Light categorization by common values (safe defaults)
  const map = {
    Best: "bg-amber-100 text-amber-900",
    Excellent: "bg-emerald-100 text-emerald-900",
    "Very Good": "bg-indigo-100 text-indigo-900",
    Good: "bg-blue-100 text-blue-900",
    High: "bg-slate-100 text-slate-900",
    Fair: "bg-orange-100 text-orange-900",
    Low: "bg-slate-100 text-slate-900",
    "Very Low": "bg-slate-100 text-slate-900",
    Poor: "bg-rose-100 text-rose-900",
  };

  const cls = map[v] || "bg-slate-100 text-slate-900";
  return <span className={`${base} ${cls}`}>{v}</span>;
}

function formatNumber(val) {
  if (val === null || val === undefined || val === "") return "";
  const n = Number(String(val).replace(/,/g, "").trim());
  if (!Number.isFinite(n)) return String(val);
  return n.toLocaleString();
}

function formatTempRange(low, high) {
  const lo = low === null || low === undefined || low === "" ? "" : String(low);
  const hi = high === null || high === undefined || high === "" ? "" : String(high);
  if (!lo && !hi) return "";
  if (lo && hi) return `${lo}° to ${hi}°`;
  if (lo) return `${lo}°`;
  return `${hi}°`;
}

export default function MaterialsTable({ materials = [], selectedIds = [], onToggleSelect }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="text-sm font-semibold text-slate-900">
          Results{" "}
          <span className="text-slate-500 font-normal">
            ({materials.length} material{materials.length === 1 ? "" : "s"})
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-700">
            <tr className="border-b border-slate-200">
              <th className="w-[44px] px-2 py-2 font-semibold uppercase tracking-wide">
                Select
              </th>
              <th className="w-[220px] px-2 py-2 font-semibold uppercase tracking-wide">
                Material
              </th>
              <th className="w-[110px] px-2 py-2 font-semibold uppercase tracking-wide whitespace-nowrap">
                Low Friction
              </th>
              <th className="w-[130px] px-2 py-2 font-semibold uppercase tracking-wide whitespace-nowrap">
                Wear Resistance
              </th>
              <th className="w-[120px] px-2 py-2 font-semibold uppercase tracking-wide whitespace-nowrap">
                Tensile
              </th>
              <th className="w-[110px] px-2 py-2 font-semibold uppercase tracking-wide whitespace-nowrap">
                Limiting PV
              </th>
              <th className="w-[120px] px-2 py-2 font-semibold uppercase tracking-wide whitespace-nowrap">
                Water Abs.
              </th>
              <th className="w-[130px] px-2 py-2 font-semibold uppercase tracking-wide whitespace-nowrap">
                Grease Compat.
              </th>
              <th className="w-[130px] px-2 py-2 font-semibold uppercase tracking-wide whitespace-nowrap">
                Chemical Resist.
              </th>
              <th className="w-[150px] px-2 py-2 font-semibold uppercase tracking-wide whitespace-nowrap">
                Temp Range (°F)
              </th>
            </tr>
          </thead>

          <tbody>
            {materials.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-6 text-sm text-slate-500">
                  No materials match filters.
                </td>
              </tr>
            ) : (
              materials.map((m, idx) => {
                const id = m.id ?? m.material ?? String(idx);
                const checked = selectedIds.includes(id);

                return (
                  <tr
                    key={id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-2 py-2 align-middle">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggleSelect?.(id)}
                        className="h-4 w-4"
                      />
                    </td>

                    <td className="px-2 py-2 align-middle font-semibold text-slate-900">
                      {m.material || ""}
                    </td>

                    <td className="px-2 py-2 align-middle whitespace-nowrap">
                      <Badge value={m.low_friction} />
                    </td>

                    <td className="px-2 py-2 align-middle whitespace-nowrap">
                      <Badge value={m.wear_resistance} />
                    </td>

                    <td className="px-2 py-2 align-middle whitespace-nowrap text-slate-900">
                      {formatNumber(m.tensile_strength)}
                    </td>

                    <td className="px-2 py-2 align-middle whitespace-nowrap text-slate-900">
                      {formatNumber(m.limiting_pv)}
                    </td>

                    <td className="px-2 py-2 align-middle whitespace-nowrap text-slate-900">
                      {m.water_absorption ?? ""}
                    </td>

                    <td className="px-2 py-2 align-middle whitespace-nowrap">
                      <Badge value={m.grease_compatibility} />
                    </td>

                    <td className="px-2 py-2 align-middle whitespace-nowrap">
                      <Badge value={m.chemical_resistance} />
                    </td>

                    <td className="px-2 py-2 align-middle whitespace-nowrap text-slate-900">
                      {formatTempRange(m.low_temperature, m.high_temperature)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
