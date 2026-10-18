"use client";

import React from "react";
import { AppShell } from "@/components/AppShell";
import { AIAnalystView } from "@/views/AIAnalystView";

export default function AIAnalystPage() {
  return (
    <AppShell
      title="AI Analyst"
      subtitle="Ask questions, investigate disruptions, and uncover actionable supply chain insights."
    >
      <AIAnalystView />
    </AppShell>
  );
}
