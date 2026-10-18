"use client";

import React from "react";
import { AppShell } from "@/components/AppShell";
import { RiskIntelligenceView } from "@/views/RiskIntelligenceView";

export default function RiskIntelligencePage() {
  return (
    <AppShell
      title="Risk Intelligence"
      subtitle="Chokepoint friction models, weather corridors, and predictive disruption indexes."
    >
      <RiskIntelligenceView />
    </AppShell>
  );
}
