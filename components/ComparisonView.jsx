import React from "react";
import { Button } from "./ui/button";

export default function ComparisonView({ materials = [], onBack, onClearSelection, onExportPDF }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Comparison</h1>
            <p className="text-slate-600">{materials.length} materials selected</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onBack}>Back</Button>
            <Button variant="outline" onClick={onClearSelection}>Clear</Button>
            <Button onClick={() => onExportPDF?.("selected", true)}>Export PDF</Button>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <pre className="text-xs overflow-auto">{JSON.stringify(materials, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
