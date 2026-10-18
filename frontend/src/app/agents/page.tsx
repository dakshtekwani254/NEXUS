"use client";

import React from "react";
import { AppShell } from "@/components/AppShell";
import { AgentCenterView } from "@/views/AgentCenterView";

export default function AgentsPage() {
  return (
    <AppShell
      title="Agent Center"
      subtitle="Autonomous browser agents, TinyFish crawler tasks, and active DOM monitors."
    >
      <AgentCenterView />
    </AppShell>
  );
}
