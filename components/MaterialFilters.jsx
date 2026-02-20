import React from "react";
import { Button } from "./ui/button";

export default function MaterialFilters({ filters, onFilterChange, onClearAll }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 text-sm font-semibold text-slate-900">Filters</div>

      <div className="space-y-4 text-sm text-slate-700">

        {/* LOW FRICTION */}
        <div>
          <label className="block mb-1">Low Friction</label>
          <select
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
            value={filters.low_friction ?? ""}
            onChange={(e) => onFilterChange("low_friction", e.target.value || null)}
          >
            <option value="">Any</option>
            <option value="Excellent">Excellent</option>
            <option value="Very Low">Very Low</option>
            <option value="Low">Low</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
          </select>
        </div>

        {/* WEAR RESISTANCE */}
        <div>
          <label className="block mb-1">Wear Resistance</label>
          <select
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
            value={filters.wear_resistance ?? ""}
            onChange={(e) => onFilterChange("wear_resistance", e.target.value || null)}
          >
            <option value="">Any</option>
            <option value="Excellent">Excellent</option>
            <option value="High">High</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
          </select>
        </div>

        {/* SELF LUBRICATING */}
        <div>
          <label className="block mb-1">Self-Lubricating</label>
          <select
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
            value={filters.self_lubricating ?? ""}
            onChange={(e) => onFilterChange("self_lubricating", e.target.value || null)}
          >
            <option value="">Any</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* TENSILE STRENGTH */}
        <div>
          <label className="block mb-1">Min Tensile Strength (psi)</label>
          <input
            type="number"
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
            value={filters.min_tensile_strength || ""}
            onChange={(e) => onFilterChange("min_tensile_strength", e.target.value)}
            placeholder="e.g. 12000"
          />
        </div>

        {/* TEMPERATURE RANGE */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block mb-1">Min Temp (°F)</label>
            <input
              type="number"
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
              value={filters.min_temp || ""}
              onChange={(e) => onFilterChange("min_temp", e.target.value)}
              placeholder="-40"
            />
          </div>

          <div>
            <label className="block mb-1">Max Temp (°F)</label>
            <input
              type="number"
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
              value={filters.max_temp || ""}
              onChange={(e) => onFilterChange("max_temp", e.target.value)}
              placeholder="500"
            />
          </div>
        </div>

        {/* CLEAR */}
        <div className="pt-2">
          <Button variant="outline" onClick={onClearAll} className="w-full">
            Clear All
          </Button>
        </div>

      </div>
    </div>
  );
}
