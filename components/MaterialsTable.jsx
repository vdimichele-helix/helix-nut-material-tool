import React, { useMemo, useState } from "react";

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
  const hi =
    high === null || high === undefined || high === "" ? "" : String(high);
  if (!lo && !hi) return "";
  if (lo && hi) return `${lo}° to ${hi}°`;
  if (lo) return `${lo}°`;
  return `${hi}°`;
}

const MAX_COMPARE = 3;

// This drives the "Material Comparison" view.
// Keys match your current data shape in materials JSON.
const COMPARISON_ROWS = [
  { label: "Low Friction", key: "low_friction", type: "badge" },
  { label: "Wear Resistance", key: "wear_resistance", type: "badge" },
  { label: "Tensile Strength D638", key: "tensile_strength", type: "number" },
  { label: "Limiting PV", key: "limiting_pv", type: "number" },
  { label: "Water Absorption D570", key: "water_absorption", type: "raw" },
  { label: "Grease Compatibility", key: "grease_compatibility", type: "badge" },
  { label: "Chemical Resistance", key: "chemical_resistance", type: "badge" },
  { label: "Low Temperature °F", key: "low_temperature", type: "raw" },
  { label: "High Temperature °F", key: "high_temperature", type: "raw" },
];

function safeString(val) {
  if (val === null || val === undefined) return "";
  return String(val);
}

function toCsvCell(val) {
  const s = safeString(val).replaceAll('"', '""');
  return `"${s}"`;
}

export default function MaterialsTable({
  materials = [],
  selectedIds = [],
  onToggleSelect,
  onClearSelect,
  onExportComparison, // optional (if you already have a PDF export, wire it here)
  onExportTable, // optional (if you already have table export, wire it here)
  maxCompare = MAX_COMPARE, // optional override
}) {
  const [view, setView] = useState("list"); // "list" | "compare"
  const [selectionError, setSelectionError] = useState("");

  const selectedCount = selectedIds.length;

  const selectedMaterials = useMemo(() => {
    const set = new Set(selectedIds);
    return materials.filter((m, idx) => {
      const id = m.id ?? m.material ?? String(idx);
      return set.has(id);
    });
  }, [materials, selectedIds]);

  const handleToggle = (id) => {
    setSelectionError("");

    const isSelected = selectedIds.includes(id);
    const nextCount = isSelected ? selectedIds.length - 1 : selectedIds.length + 1;

    // Block selecting more than maxCompare (only when trying to add)
    if (!isSelected && nextCount > maxCompare) {
      setSelectionError(`You can compare up to ${maxCompare} materials.`);
      return;
    }

    onToggleSelect?.(id);
  };

  const clearSelection = () => {
    setSelectionError("");
    if (onClearSelect) onClearSelect();
    else {
      // Fallback: if parent doesn't provide onClearSelect, uncheck all via toggles
      selectedIds.forEach((id) => onToggleSelect?.(id));
    }
  };

  const openCompare = () => {
    if (selectedIds.length < 2) return;
    setView("compare");
  };

  const exportComparisonCsv = () => {
    // If parent supplied a custom export (PDF, etc.), prefer it.
    if (onExportComparison) return onExportComparison(selectedMaterials);

    // Default: CSV export for the comparison view
    const headers = ["Property", ...selectedMaterials.map((m) => m.material || "Material")];

    const lines = [
      headers.map(toCsvCell).join(","),
      ...COMPARISON_ROWS.map((row) => {
        const cells = [
          toCsvCell(row.label),
          ...selectedMaterials.map((m) => {
            if (row.type === "number") return toCsvCell(formatNumber(m[row.key]));
            return toCsvCell(m[row.key] ?? "");
          }),
        ];
        return cells.join(",");
      }),
    ].join("\n");

    const blob = new Blob([lines], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "material-comparison.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportTableCsv = () => {
    if (onExportTable) return onExportTable(materials);

    // Default: CSV export for full list (exports columns shown in list)
    const headers = [
      "Material",
      "Low Friction",
      "Wear Resistance",
      "Tensile Strength",
      "Limiting PV",
      "Water Absorption",
      "Grease Compatibility",
      "Chemical Resistance",
      "Low Temperature",
      "High Temperature",
    ];

    const lines = [
      headers.map(toCsvCell).join(","),
      ...materials.map((m) =>
        [
          toCsvCell(m.material ?? ""),
          toCsvCell(m.low_friction ?? ""),
          toCsvCell(m.wear_resistance ?? ""),
          toCsvCell(m.tensile_strength ?? ""),
          toCsvCell(m.limiting_pv ?? ""),
          toCsvCell(m.water_absorption ?? ""),
          toCsvCell(m.grease_compatibility ?? ""),
          toCsvCell(m.chemical_resistance ?? ""),
          toCsvCell(m.low_temperature ?? ""),
          toCsvCell(m.high_temperature ?? ""),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([lines], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "material-table.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // =========================
  // Compare View
  // =========================
  if (view === "compare") {
    return (
      <div className="w-full">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => setView("list")}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            ← Back to List
          </button>

          <div className="min-w-[240px] flex-1">
            <div className="text-3xl font-bold text-slate-900">Material Comparison</div>
            <div className="mt-1 text-sm text-slate-500">
              Comparing {selectedMaterials.length} materials side-by-side
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportComparisonCsv}
              className="rounded-lg border border-slate-900 bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Export Comparison
            </button>

            <button
              onClick={exportTableCsv}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              Export Table
            </button>

            <button
              onClick={() => {
                clearSelection();
                setView("list");
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              aria-label="Clear"
            >
              ✕ Clear
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr className="border-b border-slate-200">
                  <th className="w-[260px] px-4 py-3 font-semibold">Property</th>
                  {selectedMaterials.map((m, idx) => {
                    const id = m.id ?? m.material ?? String(idx);
                    return (
                      <th key={id} className="min-w-[220px] px-4 py-3 font-semibold">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{m.material || ""}</span>
                          <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-600">
                            #{idx + 1}
                          </span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody>
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.key} className="border-b border-slate-100">
                    <td className="px-4 py-3 font-medium text-slate-900">{row.label}</td>

                    {selectedMaterials.map((m, idx) => {
                      const id = m.id ?? m.material ?? String(idx);
                      const val = m[row.key];

                      return (
                        <td key={`${row.key}-${id}`} className="px-4 py-3">
                          {row.type === "badge" ? (
                            <Badge value={val} />
                          ) : row.type === "number" ? (
                            <span className="text-slate-900">{formatNumber(val)}</span>
                          ) : (
                            <span className="text-slate-900">{val ?? ""}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // List View
  // =========================
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
        <div className="flex items-baseline gap-3">
          <div className="text-sm font-semibold text-slate-900">
            Results{" "}
            <span className="text-slate-500 font-normal">
              ({materials.length} material{materials.length === 1 ? "" : "s"})
            </span>
          </div>

          <div className="text-sm text-slate-500">{selectedCount} selected</div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openCompare}
            disabled={selectedCount < 2}
            className={`rounded-lg px-3 py-2 text-sm font-semibold whitespace-nowrap ${
              selectedCount < 2
                ? "cursor-not-allowed border border-slate-200 bg-slate-200 text-slate-600"
                : "border border-slate-900 bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            Compare ({selectedCount})
          </button>

          <button
            onClick={clearSelection}
            disabled={selectedCount === 0}
            className={`rounded-lg border px-3 py-2 text-sm font-semibold whitespace-nowrap ${
              selectedCount === 0
                ? "cursor-not-allowed border-slate-200 bg-white text-slate-400"
                : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
            }`}
          >
            Clear
          </button>
        </div>
      </div>

      {selectionError ? (
        <div className="mx-4 mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {selectionError}
        </div>
      ) : null}

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
                  <tr key={id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-2 py-2 align-middle">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleToggle(id)}
                        className="h-4 w-4"
                        aria-label={`Select ${m.material || "material"} for comparison`}
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

      {/* Optional helper note (remove if you don't want it) */}
      <div className="px-4 py-3 text-xs text-slate-500">
        Select 2–{maxCompare} materials to enable Compare.
      </div>
    </div>
  );
}
