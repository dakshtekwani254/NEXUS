"use client";

import React from "react";
import { AppShell } from "@/components/AppShell";
import { AnalyticsView } from "@/views/AnalyticsView";

export default function AnalyticsPage() {
  return (
    <AppShell
      title="Analytics"
      subtitle="Multi-modal supply chain telemetry trends and predictive KPIs."
    >
      <AnalyticsView />
    </AppShell>
  );
}
