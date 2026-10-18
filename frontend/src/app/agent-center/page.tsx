"use client";

import React from "react";
import { AppShell } from "@/components/AppShell";
import { AgentCenterView } from "@/views/AgentCenterView";

export default function AgentCenterPage() {
  return (
    <AppShell
      title="Agent Center"
      subtitle="Autonomous browser agents, TinyFish crawler tasks, and active DOM monitors."
      actions={
        <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-accent hover:bg-primary text-on-primary font-button-input text-button-input rounded-xl transition-colors shadow-none">
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>+ Create Agent</span>
        </button>
      }
    >
      <AgentCenterView />
    </AppShell>
  );
}
