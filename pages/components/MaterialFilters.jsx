import React from "react";
import { Button } from "../../components/ui/button";
export default function MaterialFilters({ filters, onFilterChange, onClearAll }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 text-sm font-semibold text-slate-900">Filters</div>

      <div className="space-y-3 text-sm text-slate-700">
        <div>
          <label className="block mb-1">Low Friction</label>
          <select
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
            value={filters.low_friction ?? ""}
            onChange={(e) => onFilterChange("low_friction", e.target.value || null)}
          >
            <option value="">Any</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Wear Resistance</label>
          <select
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
            value={filters.wear_resistance ?? ""}
            onChange={(e) => onFilterChange("wear_resistance", e.target.value || null)}
          >
            <option value="">Any</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <Button variant="outline" onClick={onClearAll} className="w-full">
          Clear All
        </Button>
      </div>
    </div>
  );
}
