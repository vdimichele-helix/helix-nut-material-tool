import React from "react";

export function Input({ className = "", ...props }) {
  const base =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200";
  return <input className={`${base} ${className}`} {...props} />;
}
