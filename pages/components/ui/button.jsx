import React from "react";

export function Button({ className = "", variant, ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition border";

  const styles =
    variant === "outline"
      ? "bg-white text-slate-900 border-slate-200 hover:bg-slate-50"
      : "bg-slate-900 text-white border-slate-900 hover:bg-slate-800";

  return <button className={`${base} ${styles} ${className}`} {...props} />;
}
