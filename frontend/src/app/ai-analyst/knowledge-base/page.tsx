"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { DEMO_DATA_SOURCES } from "@/lib/demoData";

export default function KnowledgeBaseDataSourcesPage() {
  const [tab, setTab] = useState<"SOURCES" | "DOCUMENTS" | "TRUST">("SOURCES");
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [newSourceName, setNewSourceName] = useState("");
  const [newSourceType, setNewSourceType] = useState("AIS Satellite Stream");

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceName.trim()) return;
    DEMO_DATA_SOURCES.push({
      id: `SRC-${Date.now().toString().slice(-4)}`,
      name: newSourceName,
      type: newSourceType,
      status: "Connected",
      syncFrequency: "Real-time",
      lastSync: "Just now",
      recordsCount: "0 records (Initializing)",
      description: "Custom enterprise telemetry feed",
      confidenceScore: 95,
      latency: "120ms",
    });
    setIsConnectModalOpen(false);
    setNewSourceName("");
  };

  return (
    <AppShell
      title="Knowledge Base &amp; Data Sources"
      subtitle="Connect enterprise telemetry, carrier EDI pipelines, and maritime reference documentation."
      actions={
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsConnectModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-accent hover:bg-primary text-on-primary font-button-input text-button-input shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>+ Connect Source</span>
          </button>
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
          <Link href="/ai-analyst/compare" className="px-3 py-1.5 rounded-lg text-secondary-text hover:text-primary-text hover:bg-subtle-surface transition-colors">
            Compare
          </Link>
          <Link href="/ai-analyst/templates" className="px-3 py-1.5 rounded-lg text-secondary-text hover:text-primary-text hover:bg-subtle-surface transition-colors">
            Prompts &amp; Templates
          </Link>
          <Link href="/ai-analyst/knowledge-base" className="px-3 py-1.5 rounded-lg bg-soft-accent text-primary-accent font-semibold transition-colors">
            Knowledge Base
          </Link>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-primary-surface p-4 rounded-xl border border-border flex flex-col justify-between">
            <div className="flex items-center justify-between text-secondary-text font-metadata text-metadata">
              <span>Active Feeds</span>
              <span className="material-symbols-outlined text-[18px] text-primary-accent">sensors</span>
            </div>
            <div className="my-2">
              <span className="font-kpi-value text-kpi-value text-primary-text">5 / 6</span>
            </div>
            <span className="text-[11px] text-success font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
              99.8% streaming uptime
            </span>
          </div>

          <div className="bg-primary-surface p-4 rounded-xl border border-border flex flex-col justify-between">
            <div className="flex items-center justify-between text-secondary-text font-metadata text-metadata">
              <span>Vessel Pings Ingested</span>
              <span className="material-symbols-outlined text-[18px] text-muted-text">directions_boat</span>
            </div>
            <div className="my-2">
              <span className="font-kpi-value text-kpi-value text-primary-text">1.4M</span>
            </div>
            <span className="text-[11px] text-secondary-text">Updated every 30s</span>
          </div>

          <div className="bg-primary-surface p-4 rounded-xl border border-border flex flex-col justify-between">
            <div className="flex items-center justify-between text-secondary-text font-metadata text-metadata">
              <span>Reference Documents</span>
              <span className="material-symbols-outlined text-[18px] text-muted-text">folder_open</span>
            </div>
            <div className="my-2">
              <span className="font-kpi-value text-kpi-value text-primary-text">18</span>
            </div>
            <span className="text-[11px] text-secondary-text">Port circulars &amp; tariffs</span>
          </div>

          <div className="bg-primary-surface p-4 rounded-xl border border-border flex flex-col justify-between">
            <div className="flex items-center justify-between text-secondary-text font-metadata text-metadata">
              <span>Pipeline Health</span>
              <span className="material-symbols-outlined text-[18px] text-success">verified</span>
            </div>
            <div className="my-2">
              <span className="font-kpi-value text-kpi-value text-success">Optimal</span>
            </div>
            <span className="text-[11px] text-muted-text">SOC2 Type II certified</span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center p-1 bg-subtle-surface border border-border rounded-xl w-fit">
          <button
            onClick={() => setTab("SOURCES")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              tab === "SOURCES"
                ? "bg-primary-surface text-primary-accent shadow-xs"
                : "text-secondary-text hover:text-primary-text"
            }`}
          >
            Telemetry &amp; Data Sources
          </button>
          <button
            onClick={() => setTab("DOCUMENTS")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              tab === "DOCUMENTS"
                ? "bg-primary-surface text-primary-accent shadow-xs"
                : "text-secondary-text hover:text-primary-text"
            }`}
          >
            Reference Library
          </button>
          <button
            onClick={() => setTab("TRUST")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              tab === "TRUST"
                ? "bg-primary-surface text-primary-accent shadow-xs"
                : "text-secondary-text hover:text-primary-text"
            }`}
          >
            Data Usage &amp; Trust
          </button>
        </div>

        {/* Tab 1: Data Sources Table */}
        {tab === "SOURCES" && (
          <div className="bg-primary-surface border border-border rounded-xl overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-section-heading text-section-heading text-primary-text">Configured Data Streams</h3>
              <span className="text-xs font-metadata text-muted-text">6 registered data sources</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-subtle-surface/70 border-b border-border text-secondary-text font-metadata text-metadata">
                    <th className="py-3 px-4 font-medium">Provider &amp; Stream</th>
                    <th className="py-3 px-4 font-medium">Data Type</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium">Records Ingested</th>
                    <th className="py-3 px-4 font-medium">Latency</th>
                    <th className="py-3 px-4 font-medium">Last Ping</th>
                    <th className="py-3 px-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-table-text text-table-text">
                  {DEMO_DATA_SOURCES.map((src) => (
                    <tr key={src.id} className="hover:bg-subtle-surface transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-table-text-medium text-primary-text font-semibold block">{src.name}</span>
                        <span className="font-mono text-[11px] text-muted-text">{src.id}</span>
                      </td>
                      <td className="py-3.5 px-4 text-secondary-text">{src.type}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          src.status === "Connected"
                            ? "bg-success-bg text-success"
                            : src.status === "Degraded"
                            ? "bg-medium-risk-bg text-medium-risk"
                            : "bg-subtle-surface text-muted-text"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            src.status === "Connected" ? "bg-success" : src.status === "Degraded" ? "bg-medium-risk" : "bg-muted-text"
                          }`} />
                          {src.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-primary-text">{src.recordsCount}</td>
                      <td className="py-3.5 px-4 font-mono text-muted-text">{src.latency}</td>
                      <td className="py-3.5 px-4 text-secondary-text text-[12px]">{src.lastSync}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button className="text-primary-accent hover:underline text-[13px] font-medium">
                          Configure
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Reference Library */}
        {tab === "DOCUMENTS" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Suez Canal Transit Authority Rules 2026",
                category: "Regulatory Standards",
                date: "Oct 12, 2026",
                size: "4.2 MB PDF",
              },
              {
                title: "Port of Rotterdam Terminal Tariff Schedule",
                category: "Port Operating Rules",
                date: "Sep 28, 2026",
                size: "1.8 MB PDF",
              },
              {
                title: "Yangshan Typhoon Evacuation Protocol v4",
                category: "Contingency Playbook",
                date: "Aug 15, 2026",
                size: "820 KB PDF",
              },
            ].map((doc, idx) => (
              <div key={idx} className="bg-primary-surface border border-border rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-primary-accent bg-soft-accent px-2 py-0.5 rounded">
                      {doc.category}
                    </span>
                    <span className="material-symbols-outlined text-[18px] text-muted-text">picture_as_pdf</span>
                  </div>
                  <h4 className="font-table-text-medium text-primary-text font-semibold mb-1">{doc.title}</h4>
                  <span className="text-[12px] text-muted-text">{doc.size} • Uploaded {doc.date}</span>
                </div>
                <div className="pt-3 border-t border-border mt-4 flex items-center justify-between">
                  <span className="text-[11px] text-success font-medium">Vector Indexed</span>
                  <button className="text-xs text-primary-accent hover:underline font-semibold">View PDF</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Data Usage & Trust */}
        {tab === "TRUST" && (
          <div className="bg-primary-surface border border-border rounded-xl p-6 space-y-4">
            <h3 className="font-section-heading text-section-heading text-primary-text">Enterprise Data Governance &amp; Security</h3>
            <p className="text-secondary-text text-body leading-relaxed">
              NEXUS is designed with an enterprise isolation architecture. Real-time telemetry, AIS positional coordinates, and proprietary carrier booking data are processed within your private tenant space and are never shared across organizations or used to train foundational AI models.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="p-4 rounded-xl bg-subtle-surface border border-border">
                <span className="material-symbols-outlined text-primary-accent text-[24px] mb-1">lock</span>
                <h4 className="font-semibold text-primary-text text-sm">Tenant Isolation</h4>
                <p className="text-xs text-secondary-text mt-1">Row-level security encryption guarantees isolated shipment records.</p>
              </div>
              <div className="p-4 rounded-xl bg-subtle-surface border border-border">
                <span className="material-symbols-outlined text-primary-accent text-[24px] mb-1">timer</span>
                <h4 className="font-semibold text-primary-text text-sm">Ephemeral Ingestion</h4>
                <p className="text-xs text-secondary-text mt-1">High-frequency AIS position feeds roll off with 90-day retention.</p>
              </div>
              <div className="p-4 rounded-xl bg-subtle-surface border border-border">
                <span className="material-symbols-outlined text-primary-accent text-[24px] mb-1">verified_user</span>
                <h4 className="font-semibold text-primary-text text-sm">Audit Compliance</h4>
                <p className="text-xs text-secondary-text mt-1">SOC2 Type II, ISO 27001, and GDPR compliant operational standards.</p>
              </div>
            </div>
          </div>
        )}

        {/* Modal for + Connect Source */}
        {isConnectModalOpen && (
          <div className="fixed inset-0 z-50 bg-primary-text/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-primary-surface border border-border rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-section-heading text-section-heading text-primary-text">Connect Telemetry Stream</h3>
                <button
                  onClick={() => setIsConnectModalOpen(false)}
                  className="p-1 text-secondary-text hover:text-primary-text rounded-lg"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleAddSource} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-secondary-text mb-1">Feed / Provider Name</label>
                  <input
                    type="text"
                    required
                    value={newSourceName}
                    onChange={(e) => setNewSourceName(e.target.value)}
                    placeholder="e.g., Spire Global Maritime AIS"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-subtle-surface text-primary-text focus:outline-none focus:border-primary-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary-text mb-1">Telemetry Protocol</label>
                  <select
                    value={newSourceType}
                    onChange={(e) => setNewSourceType(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-subtle-surface text-primary-text focus:outline-none focus:border-primary-accent"
                  >
                    <option value="AIS Satellite Stream">AIS Satellite Stream</option>
                    <option value="Meteorological Forecast (GRIB2)">Meteorological Forecast (GRIB2)</option>
                    <option value="Port Authority API">Port Authority API</option>
                    <option value="Carrier EDI 315 / 214">Carrier EDI 315 / 214</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsConnectModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-secondary-text hover:text-primary-text"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-primary-accent text-on-primary text-xs font-semibold hover:bg-primary transition-colors"
                  >
                    Test &amp; Connect
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
