import React from "react";
import { Button } from "./ui/button";

export default function MaterialFilters({ filters, onFilterChange, onClearAll }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 text-sm font-semibold text-slate-900">Filters</div>

      <div className="space-y-4 text-sm text-slate-700">
        {/* Low Friction */}
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
            <option value="Very Good">Very Good</option>
            <option value="Good">Good</option>
            <option value="Low">Low</option>
            <option value="Fair">Fair</option>
          </select>
        </div>

        {/* Wear Resistance */}
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

        {/* Grease Compatibility */}
        <div>
          <label className="block mb-1">Grease Compatibility</label>
          <select
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
            value={filters.grease_compatibility ?? ""}
            onChange={(e) =>
              onFilterChange("grease_compatibility", e.target.value || null)
            }
          >
            <option value="">Any</option>
            <option value="Best">Best</option>
            <option value="Excellent">Excellent</option>
            <option value="Very Good">Very Good</option>
            <option value="Good">Good</option>
            <option value="Poor">Poor</option>
          </select>
        </div>

        {/* Chemical Resistance */}
        <div>
          <label className="block mb-1">Chemical Resistance</label>
          <select
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
            value={filters.chemical_resistance ?? ""}
            onChange={(e) =>
              onFilterChange("chemical_resistance", e.target.value || null)
            }
          >
            <option value="">Any</option>
            <option value="Excellent">Excellent</option>
            <option value="Very Good">Very Good</option>
            <option value="Good">Good</option>
          </select>
        </div>

        {/* Min Limiting PV */}
        <div>
          <label className="block mb-1">Min Limiting PV</label>
          <input
            type="number"
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
            placeholder="e.g., 10000"
            value={filters.min_limiting_pv ?? ""}
            onChange={(e) =>
              onFilterChange("min_limiting_pv", e.target.value || "")
            }
          />
        </div>

        {/* Max Water Absorption */}
        <div>
          <label className="block mb-1">Max Water Absorption</label>
          <input
            type="number"
            step="0.01"
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
            placeholder="e.g., 0.10"
            value={filters.max_water_absorption ?? ""}
            onChange={(e) =>
              onFilterChange("max_water_absorption", e.target.value || "")
            }
          />
        </div>

        <div className="pt-2">
          <Button variant="outline" className="w-full" onClick={onClearAll}>
            Clear All
          </Button>
        </div>
      </div>
    </div>
  );
}
