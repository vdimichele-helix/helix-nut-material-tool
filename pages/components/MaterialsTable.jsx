import React from "react";

export default function MaterialsTable({ data = [], isLoading = false }) {
  if (isLoading) return <div className="p-6">Loading…</div>;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-sm text-slate-600 mb-3">Materials</div>
      {data.length === 0 ? (
        <div className="text-slate-500 text-sm">No materials yet.</div>
      ) : (
        <ul className="list-disc pl-5 text-sm">
          {data.map((m) => (
            <li key={m.id}>{m.material}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
