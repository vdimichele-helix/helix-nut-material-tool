import React, { useMemo, useState } from "react";
import Head from "next/head";
import { useQuery } from "@tanstack/react-query";

import MaterialFilters from "../components/MaterialFilters";
import MaterialsTable from "../components/MaterialsTable";

const defaultFilters = {
  low_friction: null,
  wear_resistance: null,
  grease_compatibility: null,
  chemical_resistance: null,
  self_lubricating: null, // "Yes" | "No" | null

  // Numeric filters (kept as strings for inputs)
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
      if (!res.ok) throw new Error("Failed to load /data/nutMaterials.json");
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
    setSelectedIds([]);
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const filteredData = useMemo(() => {
    const q = norm(searchQuery);

    const minTensile = toNumber(filters.min_tensile_strength);
    const minTemp = toNumber(filters.min_temp);
    const maxTemp = toNumber(filters.max_temp);
    const minPV = toNumber(filters.min_limiting_pv);
    const maxWater = toNumber(filters.max_water_absorption);

    return (materials || []).filter((m) => {
      // Search (material name)
      if (q && !norm(m.material).includes(q)) return false;

      // Categorical filters
      if (filters.low_friction && norm(m.low_friction) !== norm(filters.low_friction))
        return false;

      if (
        filters.wear_resistance &&
        norm(m.wear_resistance) !== norm(filters.wear_resistance)
      )
        return false;

      if (
        filters.grease_compatibility &&
        norm(m.grease_compatibility) !== norm(filters.grease_compatibility)
      )
        return false;

      if (
        filters.chemical_resistance &&
        norm(m.chemical_resistance) !== norm(filters.chemical_resistance)
      )
        return false;

      // Self-lubricating (boolean in JSON)
      if (filters.self_lubricating) {
        const want = filters.self_lubricating === "Yes";
        if (Boolean(m.self_lubricating) !== want) return false;
      }

      // Numeric filters
      if (minTensile !== null) {
        const tensile = toNumber(m.tensile_strength);
        if (tensile === null || tensile < minTensile) return false;
      }

      // Temp range: material must support requested min/max
      if (minTemp !== null) {
        const lowTemp = toNumber(m.low_temperature);
        // material low temp must be <= requested min temp
        if (lowTemp === null || lowTemp > minTemp) return false;
      }

      if (maxTemp !== null) {
        const highTemp = toNumber(m.high_temperature);
        // material high temp must be >= requested max temp
        if (highTemp === null || highTemp < maxTemp) return false;
      }

      if (minPV !== null) {
        const pv = toNumber(m.limiting_pv);
        if (pv === null || pv < minPV) return false;
      }

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
        <title>Lead Screw Nut Material Selector | Helix Linear Technologies</title>
        <meta
          name="description"
          content="Filter and compare engineering-grade lead screw nut materials by friction, wear, PV, water absorption, grease compatibility, chemical resistance, tensile strength, and temperature range."
        />
      </Head>

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">
              Lead Screw Nut Material Selector
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Filter and compare engineering-grade nut materials by friction, wear, PV,
              water absorption, grease compatibility, chemical resistance, tensile strength,
              and temperature range.
            </p>
          </div>

          {/* ✅ Key layout fix: fixed sidebar + flexible table that can shrink */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
            {/* LEFT: Search + Filters */}
            <div className="lg:sticky lg:top-6 h-fit space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <label className="block text-sm font-semibold text-slate-900">
                  Search Material
                </label>
                <input
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g., PEEK, PTFE, Bronze..."
                />
                <div className="mt-3 text-xs text-slate-500">
                  Total Materials:{" "}
                  <span className="font-semibold">{materials.length}</span>
                  {" • "}
                  Showing:{" "}
                  <span className="font-semibold">{filteredData.length}</span>
                </div>
              </div>

              <MaterialFilters
                filters={filters}
                onFilterChange={onFilterChange}
                onClearAll={onClearAll}
              />
            </div>

            {/* RIGHT: Table */}
            <div className="min-w-0">
              {isError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                  Error loading materials: {String(error?.message || error)}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <MaterialsTable
                    materials={isLoading ? [] : filteredData}
                    selectedIds={selectedIds}
                    onToggleSelect={toggleSelect}
                  />
                </div>
              )}

              {isLoading && (
                <div className="mt-3 text-sm text-slate-500">Loading materials…</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
