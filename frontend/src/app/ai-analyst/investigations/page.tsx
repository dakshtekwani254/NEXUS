"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { DEMO_INVESTIGATIONS } from "@/lib/demoData";

export default function AIAnalystInvestigationsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [riskFilter, setRiskFilter] = useState("ALL");
  const [selectedIds, setSelectedIds] = useState<string[]>(["INV-0018"]);

  const filtered = DEMO_INVESTIGATIONS.filter((inv) => {
    const matchSearch =
      inv.title.toLowerCase().includes(search.toLowerCase()) ||
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      (inv.primaryEntity || inv.entity || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || inv.status.toUpperCase().replace(" ", "_") === statusFilter;
    const matchRisk = riskFilter === "ALL" || inv.riskLevel === riskFilter;
    return matchSearch && matchStatus && matchRisk;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <AppShell
      title="Investigation History"
      subtitle="Review previous analyses, revisit findings, and continue investigating supply chain risks."
      actions={
        <div className="flex items-center gap-3">
          <Link
            href="/ai-analyst/compare"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-primary-surface border border-border hover:bg-subtle-surface text-primary-text font-button-input text-button-input transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">compare_arrows</span>
            <span>Compare ({selectedIds.length})</span>
          </Link>
          <Link
            href="/ai-analyst"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-accent hover:bg-primary text-on-primary font-button-input text-button-input shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>New Investigation</span>
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
          <Link href="/ai-analyst/investigations" className="px-3 py-1.5 rounded-lg bg-soft-accent text-primary-accent font-semibold transition-colors">
            History
          </Link>
          <Link href="/ai-analyst/compare" className="px-3 py-1.5 rounded-lg text-secondary-text hover:text-primary-text hover:bg-subtle-surface transition-colors">
            Compare
          </Link>
          <Link href="/ai-analyst/templates" className="px-3 py-1.5 rounded-lg text-secondary-text hover:text-primary-text hover:bg-subtle-surface transition-colors">
            Prompts &amp; Templates
          </Link>
          <Link href="/ai-analyst/knowledge-base" className="px-3 py-1.5 rounded-lg text-secondary-text hover:text-primary-text hover:bg-subtle-surface transition-colors">
            Knowledge Base
          </Link>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-primary-surface p-5 rounded-xl border border-border flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="font-metadata text-metadata text-secondary-text font-medium uppercase tracking-wider">Total Investigations</span>
              <div className="w-8 h-8 rounded-lg bg-subtle-surface flex items-center justify-center text-secondary-text">
                <span className="material-symbols-outlined text-[19px]">saved_search</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-kpi-value text-kpi-value text-primary-text font-semibold">48</span>
              <span className="font-metadata text-metadata text-muted-text">Across workspace</span>
            </div>
            <div className="mt-3 pt-3 border-t border-border flex items-center gap-1.5 text-secondary-text font-metadata text-metadata">
              <span className="material-symbols-outlined text-[14px] text-success">north_east</span>
              <span>+6 completed this week</span>
            </div>
          </div>

          <div className="bg-primary-surface p-5 rounded-xl border border-border flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="font-metadata text-metadata text-secondary-text font-medium uppercase tracking-wider">Completed</span>
              <div className="w-8 h-8 rounded-lg bg-success-bg flex items-center justify-center text-success">
                <span className="material-symbols-outlined text-[19px]">check_circle</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-kpi-value text-kpi-value text-primary-text font-semibold">36</span>
              <span className="font-metadata text-metadata text-success font-medium">75% total rate</span>
            </div>
            <div className="mt-3 pt-3 border-t border-border flex items-center gap-1.5 text-secondary-text font-metadata text-metadata">
              <span className="text-success font-medium">Analysis finished</span>
              <span className="text-muted-text">• Ready for review</span>
            </div>
          </div>

          <div className="bg-primary-surface p-5 rounded-xl border border-border flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="font-metadata text-metadata text-secondary-text font-medium uppercase tracking-wider">In Progress</span>
              <div className="w-8 h-8 rounded-lg bg-soft-accent flex items-center justify-center text-primary-accent">
                <span className="material-symbols-outlined text-[19px]">sync</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-kpi-value text-kpi-value text-primary-text font-semibold">5</span>
              <span className="font-metadata text-metadata text-primary-accent font-medium">Active sessions</span>
            </div>
            <div className="mt-3 pt-3 border-t border-border flex items-center gap-1.5 text-secondary-text font-metadata text-metadata">
              <span className="text-primary-accent font-medium">Analysis underway</span>
              <span className="text-muted-text">• 2 updated today</span>
            </div>
          </div>

          <div className="bg-primary-surface p-5 rounded-xl border border-border flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="font-metadata text-metadata text-secondary-text font-medium uppercase tracking-wider">Requires Review</span>
              <div className="w-8 h-8 rounded-lg bg-medium-risk-bg flex items-center justify-center text-medium-risk">
                <span className="material-symbols-outlined text-[19px]">priority_high</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-kpi-value text-kpi-value text-primary-text font-semibold">7</span>
              <span className="font-metadata text-metadata text-medium-risk font-medium">High priority</span>
            </div>
            <div className="mt-3 pt-3 border-t border-border flex items-center gap-1.5 text-secondary-text font-metadata text-metadata">
              <span className="text-medium-risk font-medium">Awaiting validation</span>
              <span className="text-muted-text">• Action required</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-primary-surface p-4 rounded-xl border border-border flex flex-col gap-3">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[280px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-text">search</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search investigations, entities, or IDs..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-primary-surface border border-border text-primary-text font-body text-body placeholder:text-muted-text focus:outline-none focus:border-primary-accent transition-colors"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-3 pr-8 py-2 rounded-xl bg-subtle-surface border border-border text-primary-text font-body text-xs cursor-pointer focus:outline-none focus:border-primary-accent"
              >
                <option value="ALL">All Statuses</option>
                <option value="COMPLETED">Completed</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="REQUIRES_REVIEW">Requires Review</option>
              </select>

              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="pl-3 pr-8 py-2 rounded-xl bg-subtle-surface border border-border text-primary-text font-body text-xs cursor-pointer focus:outline-none focus:border-primary-accent"
              >
                <option value="ALL">All Risks</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>

              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("ALL");
                  setRiskFilter("ALL");
                }}
                className="px-2 py-1 text-secondary-text hover:text-primary-accent font-table-text text-table-text transition-colors"
              >
                Reset filters
              </button>
            </div>
          </div>

          {/* Bulk Selection Bar */}
          {selectedIds.length > 0 && (
            <div className="flex items-center justify-between px-3 py-2 bg-soft-accent/60 border border-primary-accent/20 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-5 h-5 rounded bg-primary-accent text-on-primary text-[12px] font-semibold">
                  {selectedIds.length}
                </span>
                <span className="font-table-text-medium text-table-text-medium text-primary-text font-medium">
                  {selectedIds.length} investigation{selectedIds.length > 1 ? "s" : ""} selected
                </span>
                <span className="text-border">|</span>
                <button
                  onClick={() => setSelectedIds([])}
                  className="font-metadata text-metadata text-primary-accent hover:underline"
                >
                  Clear selection
                </button>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/ai-analyst/compare"
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary-accent text-on-primary text-xs font-medium hover:bg-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">compare_arrows</span>
                  <span>Compare Selected</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Data Table */}
        <div className="bg-primary-surface border border-border rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-subtle-surface/70 border-b border-border text-secondary-text font-metadata text-metadata">
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filtered.length && filtered.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedIds(filtered.map((i) => i.id));
                        else setSelectedIds([]);
                      }}
                      className="rounded border-border text-primary-accent focus:ring-0"
                    />
                  </th>
                  <th className="py-3 px-4 font-medium">Investigation</th>
                  <th className="py-3 px-4 font-medium">Primary Entity</th>
                  <th className="py-3 px-4 font-medium">Risk Level</th>
                  <th className="py-3 px-4 font-medium">Affected Shipments</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">Last Updated</th>
                  <th className="py-3 px-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-table-text text-table-text">
                {filtered.map((inv) => (
                  <tr key={inv.id} className="hover:bg-subtle-surface transition-colors">
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(inv.id)}
                        onChange={() => toggleSelect(inv.id)}
                        className="rounded border-border text-primary-accent focus:ring-0"
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      <Link href={`/ai-analyst/investigations/${inv.id}`} className="font-table-text-medium text-primary-text font-semibold hover:text-primary-accent block">
                        {inv.title}
                      </Link>
                      <span className="font-mono text-[11px] text-muted-text">{inv.id} • {inv.type}</span>
                    </td>
                    <td className="py-3.5 px-4 text-secondary-text">
                      <span className="inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-muted-text">location_on</span>
                        {inv.primaryEntity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                        inv.riskLevel === "HIGH" ? "bg-high-risk-bg text-high-risk" : inv.riskLevel === "MEDIUM" ? "bg-medium-risk-bg text-medium-risk" : "bg-success-bg text-success"
                      }`}>
                        {inv.riskLevel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-primary-text">
                      {inv.affectedShipmentsCount}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 text-secondary-text text-[12px]">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          inv.status === "Completed" ? "bg-success" : "bg-primary-accent"
                        }`} />
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-muted-text text-[12px]">
                      {inv.updatedAt}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/ai-analyst/investigations/${inv.id}`}
                        className="font-button-input text-button-input text-primary-accent hover:underline inline-flex items-center gap-0.5"
                      >
                        Inspect <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
