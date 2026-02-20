import React, { useMemo, useState } from "react";
import Head from "next/head";
import { useQuery } from "@tanstack/react-query";

import MaterialFilters from "../components/MaterialFilters";
import MaterialsTable from "../components/MaterialsTable";

const defaultFilters = {
  low_friction: null,
  wear_resistance: null,

  // New filters
  grease_compatibility: null,
  chemical_resistance: null,
  self_lubricating: null, // "Yes" | "No" | null

  // Numeric filters (strings for inputs)
  min_tensile_strength: "",
  min_temp: "",
  max_temp: "",
  min_limiting_pv: "",
  max_water_absorption: "",
};

const norm = (v) => String(v ?? "").trim().toLowerCase();

const toNumber = (v) => {
  if (v === null || v === undefined || v === "") return null;
  const cleaned = String(v).replace(/,/g, "").trim();
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
};

export default function NutMaterialPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState(defaultFilters);
  const [selectedIds, setSelectedIds] = useState([]);

  const { data: materials = [], isLoading, isError, error } = useQuery({
    queryKey: ["nutMaterials"],
    queryFn: async () => {
      const res = await fetch("/data/nutMaterials.json");
      if (!res.ok) throw new Error("Failed to load materials JSON");
      return res.json();
    },
  });

  const onFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const onClearAll = () => {
    setFilters(defaultFilters);
    setSearchQuery("");
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      return [...prev, id];
    });
  };

  const filteredData = useMemo(() => {
    const q = norm(searchQuery);

    const minTensile = toNumber(filters.min_tensile_strength);
    const minTemp = toNumber(filters.min_temp);
    const maxTemp = toNumber(filters.max_temp);
    const minPV = toNumber(filters.min_limiting_pv);
    const maxWater = toNumber(filters.max_water_absorption);

    return (materials || []).filter((m) => {
      // Search by material name
      if (q && !norm(m.material).includes(q)) return false;

      // Low friction
      if (filters.low_friction && norm(m.low_friction) !== norm(filters.low_friction)) return false;

      // Wear resistance
      if (filters.wear_resistance && norm(m.wear_resistance) !== norm(filters.wear_resistance)) return false;

      // Grease compatibility
      if (
        filters.grease_compatibility &&
        norm(m.grease_compatibility) !== norm(filters.grease_compatibility)
      )
        return false;

      // Chemical resistance
      if (
        filters.chemical_resistance &&
        norm(m.chemical_resistance) !== norm(filters.chemical_resistance)
      )
        return false;

      // Self-lubricating (stored as boolean in JSON)
      if (filters.self_lubricating) {
        const want = filters.self_lubricating === "Yes";
        if (Boolean(m.self_lubricating) !== want) return false;
      }

      // Min tensile strength
      if (minTensile !== null) {
        const tensile = toNumber(m.tensile_strength);
        if (tensile === null || tensile < minTensile) return false;
      }

      // Temperature window:
      // material must support the requested range
      if (minTemp !== null) {
        const lowTemp = toNumber(m.low_temperature);
        // If material’s min temp is higher than requested min, it cannot meet it
        if (lowTemp === null || lowTemp > minTemp) return false;
      }

      if (maxTemp !== null) {
        const highTemp = toNumber(m.high_temperature);
        // If material’s max temp is lower than requested max, it cannot meet it
        if (highTemp === null || highTemp < maxTemp) return false;
      }

      // Min limiting PV
      if (minPV !== null) {
        const pv = toNumber(m.limiting_pv);
        if (pv === null || pv < minPV) return false;
      }

      // Max water absorption
      if (maxWater !== null) {
        const water = toNumber(m.water_absorption);
        if (water === null || water > maxWater) return false;
      }

      return true;
    });
  }, [materials, searchQuery, filters]);

  return (
    <>
      <Head>
        <title>Nut Material Selector | Helix Linear Technologies</title>
        <meta
          name="description"
          content="Compare engineering-grade lead screw nut materials and identify options based on friction, wear, PV, water absorption, temperature range, and environmental compatibility."
        />
      </Head>

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">
              Lead Screw Nut Material Selector
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Filter and compare engineering-grade nut materials by friction, wear, PV, water absorption,
              grease compatibility, chemical resistance, and temperature range.
            </p>
          </div>

         <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
  {/* LEFT: Filters */}
  <div className="lg:sticky lg:top-6 h-fit">
    {/* your search card + <MaterialFilters ... /> */}
  </div>

  {/* RIGHT: Table */}
  <div className="min-w-0">
    <div className="overflow-x-auto">
      {/* your <MaterialsTable ... /> */}
      <MaterialsTable
        materials={isLoading ? [] : filteredData}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
      />
    </div>
  </div>
</div>

              <MaterialFilters
                filters={filters}
                onFilterChange={onFilterChange}
                onClearAll={onClearAll}
              />
            </div>

            {/* RIGHT: Table */}
            <div className="lg:col-span-8">
              {isError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                  Error loading materials: {String(error?.message || error)}
                </div>
              ) : (
                <MaterialsTable
                  materials={isLoading ? [] : filteredData}
                  selectedIds={selectedIds}
                  onToggleSelect={toggleSelect}
                />
              )}

              {isLoading && (
                <div className="mt-3 text-sm text-slate-500">Loading materials…</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
}
