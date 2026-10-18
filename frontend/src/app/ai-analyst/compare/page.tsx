"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { DEMO_INVESTIGATIONS } from "@/lib/demoData";

export default function InvestigationComparisonPage() {
  const [invAId, setInvAId] = useState("INV-0018");
  const [invBId, setInvBId] = useState("INV-0016");

  const invA = DEMO_INVESTIGATIONS.find((i) => i.id === invAId) || DEMO_INVESTIGATIONS[0];
  const invB = DEMO_INVESTIGATIONS.find((i) => i.id === invBId) || DEMO_INVESTIGATIONS[1] || DEMO_INVESTIGATIONS[0];

  const handleSwap = () => {
    setInvAId(invBId);
    setInvBId(invAId);
  };

  return (
    <AppShell
      title="Compare Investigations"
      subtitle="Identify what changed between analyses and understand how supply chain risks differ."
      actions={
        <div className="flex items-center gap-2.5">
          <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-strong-border bg-primary-surface text-primary-text font-button-input text-button-input hover:bg-subtle-surface transition-colors shadow-xs">
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export Comparison</span>
          </button>
          <Link
            href="/ai-analyst/investigations"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-accent text-on-primary font-button-input text-button-input hover:bg-primary transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">saved_search</span>
            <span>View All History</span>
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Navigation tabs within AI Analyst suite */}
        <div className="flex items-center gap-2 border-b border-border pb-3 text-body font-medium">
          <Link href="/ai-analyst" className="px-3 py-1.5 rounded-lg text-secondary-text hover:text-primary-text hover:bg-subtle-surface transition-colors">
            Workspace
          </Link>
          <Link href="/ai-analyst/investigations" className="px-3 py-1.5 rounded-lg text-secondary-text hover:text-primary-text hover:bg-subtle-surface transition-colors">
            History
          </Link>
          <Link href="/ai-analyst/compare" className="px-3 py-1.5 rounded-lg bg-soft-accent text-primary-accent font-semibold transition-colors">
            Compare
          </Link>
          <Link href="/ai-analyst/templates" className="px-3 py-1.5 rounded-lg text-secondary-text hover:text-primary-text hover:bg-subtle-surface transition-colors">
            Prompts &amp; Templates
          </Link>
          <Link href="/ai-analyst/knowledge-base" className="px-3 py-1.5 rounded-lg text-secondary-text hover:text-primary-text hover:bg-subtle-surface transition-colors">
            Knowledge Base
          </Link>
        </div>

        {/* ACTIVE COMPARISON PAIR */}
        <section className="bg-primary-surface border border-border rounded-xl p-5">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-accent">compare_arrows</span>
              <span className="font-section-heading text-section-heading text-primary-text">Active Comparison Pair</span>
            </div>
            <span className="font-metadata text-metadata text-muted-text">Snapshot comparison engine</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-center">
            {/* Left: Baseline Investigation (A) */}
            <div className="bg-subtle-surface/70 border border-border rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="font-metadata text-metadata font-semibold text-secondary-text uppercase tracking-wider">Baseline Investigation (A)</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-metadata font-medium bg-high-risk-bg text-high-risk border border-high-risk/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-high-risk"></span>
                  {invA.riskLevel} Risk
                </span>
              </div>
              <div className="mb-3">
                <div className="font-section-heading text-section-heading text-primary-text font-semibold">{invA.id} — {invA.title}</div>
                <div className="flex items-center gap-3 text-secondary-text font-table-text text-table-text mt-1">
                  <span>Type: <strong className="text-primary-text font-medium">{invA.type}</strong></span>
                  <span>•</span>
                  <span>Date: <strong className="text-primary-text font-medium">{invA.createdAt}</strong></span>
                  <span>•</span>
                  <span>Status: <strong className="text-success font-medium">{invA.status}</strong></span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <span className="font-metadata text-metadata text-muted-text">Scope: {invA.scope}</span>
                <select
                  value={invAId}
                  onChange={(e) => setInvAId(e.target.value)}
                  className="text-xs bg-primary-surface border border-border rounded-lg px-2 py-1 text-primary-accent font-medium cursor-pointer"
                >
                  {DEMO_INVESTIGATIONS.map((i) => (
                    <option key={i.id} value={i.id}>{i.id} - {i.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Middle: Swap Button */}
            <div className="flex justify-center -my-2 md:my-0">
              <button
                onClick={handleSwap}
                className="w-10 h-10 rounded-full border border-strong-border bg-primary-surface text-secondary-text hover:text-primary-accent hover:border-primary-accent flex items-center justify-center transition-colors shadow-xs"
                title="Swap baseline and comparison"
              >
                <span className="material-symbols-outlined">swap_horiz</span>
              </button>
            </div>

            {/* Right: Comparison Investigation (B) */}
            <div className="bg-subtle-surface/70 border border-border rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="font-metadata text-metadata font-semibold text-secondary-text uppercase tracking-wider">Comparison Investigation (B)</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-metadata font-medium bg-medium-risk-bg text-medium-risk border border-medium-risk/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-medium-risk"></span>
                  {invB.riskLevel} Risk
                </span>
              </div>
              <div className="mb-3">
                <div className="font-section-heading text-section-heading text-primary-text font-semibold">{invB.id} — {invB.title}</div>
                <div className="flex items-center gap-3 text-secondary-text font-table-text text-table-text mt-1">
                  <span>Type: <strong className="text-primary-text font-medium">{invB.type}</strong></span>
                  <span>•</span>
                  <span>Date: <strong className="text-primary-text font-medium">{invB.createdAt}</strong></span>
                  <span>•</span>
                  <span>Status: <strong className="text-success font-medium">{invB.status}</strong></span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <span className="font-metadata text-metadata text-muted-text">Scope: {invB.scope}</span>
                <select
                  value={invBId}
                  onChange={(e) => setInvBId(e.target.value)}
                  className="text-xs bg-primary-surface border border-border rounded-lg px-2 py-1 text-primary-accent font-medium cursor-pointer"
                >
                  {DEMO_INVESTIGATIONS.map((i) => (
                    <option key={i.id} value={i.id}>{i.id} - {i.title}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* COMPARISON SUMMARY (4 KPI CARDS) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-primary-surface border border-border rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-secondary-text font-metadata text-metadata">
              <span>Risk Delta</span>
              <span className="material-symbols-outlined text-[18px]">emergency</span>
            </div>
            <div className="my-2">
              <div className="flex items-baseline gap-2">
                <span className="font-kpi-value text-kpi-value text-high-risk">{invA.riskLevel}</span>
                <span className="text-muted-text text-body">vs</span>
                <span className="font-kpi-value text-kpi-value text-medium-risk">{invB.riskLevel}</span>
              </div>
              <div className="text-secondary-text font-metadata text-metadata mt-1">Inv A: {invA.riskLevel} | Inv B: {invB.riskLevel}</div>
            </div>
            <div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-high-risk-bg text-high-risk border border-high-risk/20">
                <span className="material-symbols-outlined text-[13px]">arrow_upward</span>
                Elevated risk in A
              </span>
            </div>
          </div>

          <div className="bg-primary-surface border border-border rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-secondary-text font-metadata text-metadata">
              <span>Related Shipments</span>
              <span className="material-symbols-outlined text-[18px]">inventory_2</span>
            </div>
            <div className="my-2">
              <div className="flex items-baseline gap-2">
                <span className="font-kpi-value text-kpi-value text-primary-text">{invA.affectedShipmentsCount}</span>
                <span className="text-muted-text text-body">vs</span>
                <span className="font-kpi-value text-kpi-value text-secondary-text">{invB.affectedShipmentsCount}</span>
              </div>
              <div className="text-secondary-text font-metadata text-metadata mt-1">
                Inv A: {invA.affectedShipmentsCount} | Inv B: {invB.affectedShipmentsCount} tracked
              </div>
            </div>
            <div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-soft-accent text-primary-accent border border-primary-accent/20">
                <span className="material-symbols-outlined text-[13px]">add</span>
                +{Math.abs((invA.affectedShipmentsCount ?? 0) - (invB.affectedShipmentsCount ?? 0))} difference
              </span>
            </div>
          </div>

          <div className="bg-primary-surface border border-border rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-secondary-text font-metadata text-metadata">
              <span>Primary Entities</span>
              <span className="material-symbols-outlined text-[18px]">hub</span>
            </div>
            <div className="my-2">
              <div className="font-table-text-medium text-table-text-medium text-primary-text truncate">
                {invA.primaryEntity} vs {invB.primaryEntity}
              </div>
              <div className="text-secondary-text font-metadata text-metadata truncate mt-1">
                {invA.primaryEntity} | {invB.primaryEntity}
              </div>
            </div>
            <div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-subtle-surface text-secondary-text border border-border">
                Cross-corridor analysis
              </span>
            </div>
          </div>

          <div className="bg-primary-surface border border-border rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-secondary-text font-metadata text-metadata">
              <span>Investigation Status</span>
              <span className="material-symbols-outlined text-[18px]">task_alt</span>
            </div>
            <div className="my-2">
              <div className="flex items-baseline gap-2">
                <span className="font-kpi-value text-kpi-value text-success">{invA.status}</span>
              </div>
              <div className="text-secondary-text font-metadata text-metadata mt-1">Both snapshots finalized</div>
            </div>
            <div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-success-bg text-success border border-success/20">
                Ready for operational action
              </span>
            </div>
          </div>
        </section>

        {/* DETAILED SIDE-BY-SIDE COMPARISON TABLE */}
        <section className="bg-primary-surface border border-border rounded-xl overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-section-heading text-section-heading text-primary-text">Detailed Attributes Comparison</h3>
            <span className="text-xs font-metadata text-muted-text">Showing side-by-side breakdown</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-subtle-surface text-secondary-text font-metadata text-metadata border-b border-border">
                  <th className="py-3 px-4 w-1/4">Comparison Factor</th>
                  <th className="py-3 px-4 w-[37.5%]">{invA.id}: {invA.title}</th>
                  <th className="py-3 px-4 w-[37.5%]">{invB.id}: {invB.title}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-table-text text-table-text">
                <tr className="hover:bg-subtle-surface/50">
                  <td className="py-3.5 px-4 font-semibold text-primary-text">Summary Narrative</td>
                  <td className="py-3.5 px-4 text-secondary-text leading-relaxed">{invA.summary}</td>
                  <td className="py-3.5 px-4 text-secondary-text leading-relaxed">{invB.summary}</td>
                </tr>
                <tr className="hover:bg-subtle-surface/50">
                  <td className="py-3.5 px-4 font-semibold text-primary-text">Risk Classification</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-high-risk-bg text-high-risk">
                      {invA.riskLevel}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-medium-risk-bg text-medium-risk">
                      {invB.riskLevel}
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-subtle-surface/50">
                  <td className="py-3.5 px-4 font-semibold text-primary-text">Focus Geographic Node</td>
                  <td className="py-3.5 px-4 text-primary-text font-medium">{invA.primaryEntity}</td>
                  <td className="py-3.5 px-4 text-primary-text font-medium">{invB.primaryEntity}</td>
                </tr>
                <tr className="hover:bg-subtle-surface/50">
                  <td className="py-3.5 px-4 font-semibold text-primary-text">Associated Delay Impact</td>
                  <td className="py-3.5 px-4 font-mono text-high-risk font-semibold">+18 to +36 hours queue dwell</td>
                  <td className="py-3.5 px-4 font-mono text-medium-risk font-semibold">+8 to +14 hours route variance</td>
                </tr>
                <tr className="hover:bg-subtle-surface/50">
                  <td className="py-3.5 px-4 font-semibold text-primary-text">Recommended Next Step</td>
                  <td className="py-3.5 px-4 text-primary-accent font-medium">Expedite cargo rerouting via Singapore feeder</td>
                  <td className="py-3.5 px-4 text-primary-accent font-medium">Adjust booking allocations for Transpacific carriers</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
