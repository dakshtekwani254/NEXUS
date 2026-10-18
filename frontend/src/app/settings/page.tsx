"use client";

import React from "react";
import { AppShell } from "@/components/AppShell";
import { SettingsView } from "@/views/SettingsView";

export default function SettingsPage() {
  return (
    <AppShell
      title="Platform Settings"
      subtitle="API integrations, crawler schedule intervals, and risk threshold weights."
    >
      <SettingsView />
    </AppShell>
  );
}
