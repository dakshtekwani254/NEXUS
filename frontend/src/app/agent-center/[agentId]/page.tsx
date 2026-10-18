"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { DEMO_AGENTS } from "@/lib/demoData";

export default function AgentDetailPage() {
  const params = useParams();
  const agentId = typeof params?.agentId === "string" ? params.agentId : "disruption-monitor";
  const [isPaused, setIsPaused] = useState(false);

  const agent = DEMO_AGENTS.find(
    (a) => a.id.toLowerCase() === agentId.toLowerCase() || a.name.toLowerCase().includes(agentId.toLowerCase())
  ) || DEMO_AGENTS[0];

  return (
    <AppShell
      title={agent.name}
      subtitle="Monitor supply chain risk signals and surface potential disruptions for review."
      actions={
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="inline-flex items-center gap-2 px-3.5 py-2 border border-border bg-primary-surface hover:bg-subtle-surface text-primary-text font-button-input text-button-input rounded-xl transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isPaused ? "play_arrow" : "pause_circle"}
            </span>
            <span>{isPaused ? "Resume Agent" : "Pause Agent"}</span>
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary-accent hover:bg-primary text-on-primary font-button-input text-button-input rounded-xl shadow-none transition-colors">
            <span className="material-symbols-outlined text-[18px]">edit</span>
            <span>Edit Configuration</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* AGENT HEADER & ACTIONS */}
        <section className="bg-primary-surface border border-border rounded-xl p-5 flex flex-col gap-4">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-subtle-surface border border-border flex items-center justify-center text-primary-accent shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[28px]">radar</span>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="font-page-title text-section-heading font-semibold text-primary-text tracking-tight">{agent.name}</h1>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isPaused ? "bg-subtle-surface text-muted-text" : "bg-success-bg text-success border border-success/20"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isPaused ? "bg-muted-text" : "bg-success"}`} />
                    {isPaused ? "Paused" : "Active"}
                  </span>
                </div>
                <p className="font-body text-body text-secondary-text mt-1 max-w-2xl">
                  {agent.description}
                </p>
              </div>
            </div>
          </div>

          {/* Metadata Chip Bar */}
          <div className="pt-4 border-t border-border flex flex-wrap items-center gap-y-2 gap-x-8 text-secondary-text font-metadata text-metadata">
            <div className="flex items-center gap-2">
              <span className="text-muted-text">Agent Type:</span>
              <span className="font-medium text-primary-text">Monitoring &amp; Telemetry Crawler</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-text">Environment:</span>
              <span className="font-medium text-primary-text">Demo</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-text">Created:</span>
              <span className="font-medium text-primary-text">12 Sep 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-text">Last Activity:</span>
              <span className="font-medium text-primary-text">18 Oct 2026, 10:42</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-text">Model:</span>
              <span className="font-medium text-primary-text">LogisticsLLM-4.2 (Fine-tuned)</span>
            </div>
          </div>
        </section>

        {/* 4 KPI CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-primary-surface border border-border rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-secondary-text">
              <span className="font-metadata text-metadata">Tasks Completed</span>
              <span className="material-symbols-outlined text-[18px] text-muted-text">task_alt</span>
            </div>
            <div className="mt-2">
              <div className="font-kpi-value text-kpi-value text-primary-text">{agent.completedTasksCount}</div>
              <p className="font-metadata text-metadata text-muted-text mt-0.5">Illustrative activity count</p>
            </div>
          </div>

          <div className="bg-primary-surface border border-border rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-secondary-text">
              <span className="font-metadata text-metadata">Tasks Running</span>
              <span className="material-symbols-outlined text-[18px] text-primary-accent animate-spin">sync</span>
            </div>
            <div className="mt-2">
              <div className="font-kpi-value text-kpi-value text-primary-text">3</div>
              <p className="font-metadata text-metadata text-muted-text mt-0.5">Illustrative current activity</p>
            </div>
          </div>

          <div className="bg-primary-surface border border-border rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-secondary-text">
              <span className="font-metadata text-metadata">Items Flagged</span>
              <span className="material-symbols-outlined text-[18px] text-medium-risk">flag</span>
            </div>
            <div className="mt-2">
              <div className="font-kpi-value text-kpi-value text-primary-text">24</div>
              <p className="font-metadata text-metadata text-muted-text mt-0.5">Illustrative review queue</p>
            </div>
          </div>

          <div className="bg-primary-surface border border-border rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-secondary-text">
              <span className="font-metadata text-metadata">Pending Approval</span>
              <span className="material-symbols-outlined text-[18px] text-high-risk">pending_actions</span>
            </div>
            <div className="mt-2">
              <div className="font-kpi-value text-kpi-value text-primary-text">4</div>
              <p className="font-metadata text-metadata text-muted-text mt-0.5">Illustrative approval queue</p>
            </div>
          </div>
        </section>

        {/* AGENT OVERVIEW (2-COLUMN 60/40) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-primary-surface border border-border rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h2 className="font-section-heading text-section-heading text-primary-text">About This Agent</h2>
                <span className="font-metadata text-metadata text-muted-text">Version 1.4.0</span>
              </div>
              <p className="font-body text-body text-secondary-text mt-3">
                {agent.name} reviews configured supply chain risk indicators and highlights potential issues for human investigation.
              </p>
              <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                <div className="border-b border-subtle-surface pb-2">
                  <dt className="font-metadata text-metadata text-muted-text">Primary responsibility</dt>
                  <dd className="font-table-text-medium text-table-text-medium text-primary-text mt-0.5">Disruption monitoring</dd>
                </div>
                <div className="border-b border-subtle-surface pb-2">
                  <dt className="font-metadata text-metadata text-muted-text">Monitoring scope</dt>
                  <dd className="font-table-text-medium text-table-text-medium text-primary-text mt-0.5">{agent.scope}</dd>
                </div>
                <div className="border-b border-subtle-surface pb-2">
                  <dt className="font-metadata text-metadata text-muted-text">Output type</dt>
                  <dd className="font-table-text-medium text-table-text-medium text-primary-text mt-0.5">Risk summaries &amp; notifications</dd>
                </div>
                <div className="border-b border-subtle-surface pb-2">
                  <dt className="font-metadata text-metadata text-muted-text">Execution mode</dt>
                  <dd className="font-table-text-medium text-table-text-medium text-primary-text mt-0.5">{agent.mode}</dd>
                </div>
                <div className="border-b border-subtle-surface pb-2">
                  <dt className="font-metadata text-metadata text-muted-text">Human review</dt>
                  <dd className="font-table-text-medium text-table-text-medium text-primary-text mt-0.5">Required for operational actions</dd>
                </div>
                <div className="border-b border-subtle-surface pb-2">
                  <dt className="font-metadata text-metadata text-muted-text">Data environment</dt>
                  <dd className="font-table-text-medium text-table-text-medium text-primary-text mt-0.5">Demo dataset</dd>
                </div>
              </dl>
            </div>
            <div className="mt-5 p-3 rounded-lg bg-subtle-surface border border-border flex items-start gap-2.5">
              <span className="material-symbols-outlined text-muted-text text-[18px] shrink-0 mt-0.5">info</span>
              <p className="font-metadata text-metadata text-secondary-text leading-relaxed">
                This configuration describes the intended agent behavior. Actual monitoring depends on connected data sources and implemented workflows.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 bg-primary-surface border border-border rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h2 className="font-section-heading text-section-heading text-primary-text">Current Status</h2>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  isPaused ? "bg-subtle-surface text-muted-text" : "bg-success-bg text-success border border-success/20"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isPaused ? "bg-muted-text" : "bg-success"}`} />
                  {isPaused ? "Paused" : "Active"}
                </span>
              </div>
              <div className="mt-4 space-y-3">
                <div className="p-3 bg-subtle-surface rounded-xl border border-border">
                  <span className="font-metadata text-metadata text-muted-text block">Current task</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-primary-accent animate-pulse"></span>
                    <p className="font-table-text-medium text-table-text-medium text-primary-text">{agent.currentTask}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-subtle-surface rounded-xl border border-border">
                    <span className="font-metadata text-metadata text-muted-text block">Pending reviews</span>
                    <span className="font-button-input text-base text-primary-text font-semibold mt-1 block">4 items</span>
                  </div>
                  <div className="p-3 bg-subtle-surface rounded-xl border border-border">
                    <span className="font-metadata text-metadata text-muted-text block">Next scheduled check</span>
                    <span className="font-table-text text-secondary-text mt-1 block">In 14 minutes</span>
                  </div>
                </div>
                <div className="p-3 bg-subtle-surface rounded-xl border border-border">
                  <span className="font-metadata text-metadata text-muted-text block">Last completed task</span>
                  <p className="font-table-text-medium text-table-text-medium text-primary-text mt-1">Risk summary prepared (10:42)</p>
                  <span className="font-metadata text-metadata text-muted-text">Processed 34 signals in 12s</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-secondary-text text-xs">
              <span>Auto-recovery: Enabled</span>
              <span>Heartbeat: 4s ago</span>
            </div>
          </div>
        </section>

        {/* PENDING REVIEW QUEUE */}
        <section className="bg-primary-surface border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-high-risk"></span>
              <h2 className="font-section-heading text-section-heading text-primary-text">Pending Review Queue</h2>
            </div>
            <span className="font-metadata text-metadata text-secondary-text">4 recommendations waiting for authorization</span>
          </div>

          <div className="space-y-3">
            {[
              {
                title: "Reroute recommendation for SHP-10482",
                desc: "Autonomous recommendation to divert around Cape of Good Hope due to Red Sea chokepoint friction.",
                time: "14m ago",
                risk: "HIGH",
              },
              {
                title: "Port Congestion alert escalation for Shanghai",
                desc: "Berth waiting time increased beyond +18 hours threshold. Recommend notifying operations director.",
                time: "32m ago",
                risk: "HIGH",
              },
              {
                title: "Blank sailing contingency notification",
                desc: "OceanBridge carrier schedule cancelation on Asia–Europe corridor. Recommend booking buffer slots.",
                time: "1h ago",
                risk: "MEDIUM",
              },
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-subtle-surface border border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-table-text-medium text-table-text-medium text-primary-text font-semibold">{item.title}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      item.risk === "HIGH" ? "bg-high-risk-bg text-high-risk" : "bg-medium-risk-bg text-medium-risk"
                    }`}>
                      {item.risk}
                    </span>
                  </div>
                  <p className="text-[13px] text-secondary-text">{item.desc}</p>
                  <span className="text-[11px] text-muted-text mt-1 block">Prepared {item.time}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button className="px-3 py-1.5 rounded-lg bg-primary-accent text-on-primary text-xs font-semibold hover:bg-primary transition-colors">
                    Approve
                  </button>
                  <button className="px-3 py-1.5 rounded-lg bg-primary-surface border border-border text-secondary-text hover:text-primary-text text-xs font-semibold transition-colors">
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
