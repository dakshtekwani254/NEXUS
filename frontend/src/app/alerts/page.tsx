"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AlertsView } from "@/views/AlertsView";
import { DisruptionDetailModal } from "@/components/DisruptionDetailModal";
import { DisruptionEvent } from "@/lib/types";

export default function AlertsPage() {
  const [selectedDisruption, setSelectedDisruption] = useState<DisruptionEvent | null>(null);

  return (
    <AppShell
      title="Alerts Center"
      subtitle="Operational warning triggers, threshold breaches, and routing advisories."
    >
      <AlertsView onSelectDisruption={setSelectedDisruption} />
      <DisruptionDetailModal
        disruption={selectedDisruption}
        onClose={() => setSelectedDisruption(null)}
      />
    </AppShell>
  );
}
