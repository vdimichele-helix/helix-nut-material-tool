import React from "react";
import { Button } from "./ui/button";

export default function ComparisonView({ onBack }) {
  return (
    <div className="min-h-screen p-8">
      <Button variant="outline" onClick={onBack}>Back</Button>
      <div className="mt-4">Comparison view placeholder (we’ll enhance next).</div>
    </div>
  );
}
