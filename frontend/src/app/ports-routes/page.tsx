"use client";

import React from "react";
import { AppShell } from "@/components/AppShell";
import { PortsRoutesView } from "@/views/PortsRoutesView";

export default function PortsRoutesPage() {
  return (
    <AppShell
      title="Ports & Routes"
      subtitle="Operational capacity, berth waiting variance, and maritime corridor status."
    >
      <PortsRoutesView />
    </AppShell>
  );
}
