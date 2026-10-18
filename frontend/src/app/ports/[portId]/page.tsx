"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { DEMO_PORTS, DEMO_ROUTES, DEMO_SHIPMENTS } from "@/lib/demoData";

export default function PortDetailPage() {
  const params = useParams();
  const portId = typeof params?.portId === "string" ? params.portId : "CNSHA";
  const [metricTab, setMetricTab] = useState<"WAITING" | "INDEX">("WAITING");

  const port = DEMO_PORTS.find(
    (p) => p.code.toLowerCase() === portId.toLowerCase() || (p.id ? p.id.toLowerCase() === portId.toLowerCase() : false) || p.name.toLowerCase().includes(portId.toLowerCase())
  ) || DEMO_PORTS[0];

  const affectedShipments = DEMO_SHIPMENTS.filter((s) => s.origin === port.name || s.destination === port.name);

  return (
    <AppShell
      title={port.name}
      subtitle="Monitor port conditions, congestion patterns, and potential shipment impacts."
      actions={
        <div className="flex items-center gap-2">
          <Link
            href={`/research?port=${port.code}&q=${encodeURIComponent(`${port.name} port congestion gale notices and berth delays`)}`}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary-accent text-on-primary font-button-input text-button-input hover:bg-primary transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-[18px]">radar</span>
            <span>Research Port</span>
          </Link>
          <Link
            href="/ports-routes"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary-surface border border-strong-border hover:bg-subtle-surface text-primary-text font-button-input text-button-input transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">alt_route</span>
            <span>View Routes</span>
          </Link>
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary-surface border border-strong-border hover:bg-subtle-surface text-primary-text font-button-input text-button-input transition-colors">
            <span className="material-symbols-outlined text-[18px]">notification_add</span>
            <span>Create Alert</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header Metadata Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-secondary-text font-metadata text-metadata">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-muted-text">location_on</span>
              <span>Location: <strong className="font-medium text-primary-text">{port.name}, {port.country}</strong></span>
            </div>
            <span className="text-border">|</span>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-muted-text">directions_boat</span>
              <span>Port type: <strong className="font-medium text-primary-text">Container port ({port.code})</strong></span>
            </div>
            <span className="text-border">|</span>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-muted-text">database</span>
              <span>Monitoring status: <strong className="font-medium text-primary-text">Demo data</strong></span>
            </div>
            <span className="text-border">|</span>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-muted-text">schedule</span>
              <span>Synced 4m ago</span>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-md font-metadata text-metadata font-medium bg-high-risk-bg text-high-risk border border-high-risk/20">
            {port.status}
          </span>
        </div>

        {/* 4 KPI CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-primary-surface p-4 rounded-xl border border-border flex flex-col justify-between">
            <div className="flex items-center justify-between text-secondary-text">
              <span className="font-metadata text-metadata font-medium">Congestion Level</span>
              <span className="material-symbols-outlined text-[18px] text-high-risk">warning</span>
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="font-kpi-value text-kpi-value text-high-risk font-semibold">High</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-high-risk-bg text-high-risk">Elevated</span>
            </div>
            <span className="font-metadata text-metadata text-muted-text">Elevated dwell &amp; queue index</span>
          </div>

          <div className="bg-primary-surface p-4 rounded-xl border border-border flex flex-col justify-between">
            <div className="flex items-center justify-between text-secondary-text">
              <span className="font-metadata text-metadata font-medium">Estimated Waiting Time</span>
              <span className="material-symbols-outlined text-[18px] text-muted-text">schedule</span>
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="font-kpi-value text-kpi-value text-primary-text font-semibold">{port.waitingTime}</span>
              <span className="font-metadata text-metadata text-high-risk">+6 hrs vs avg</span>
            </div>
            <span className="font-metadata text-metadata text-muted-text">Illustrative estimate</span>
          </div>

          <div className="bg-primary-surface p-4 rounded-xl border border-border flex flex-col justify-between">
            <div className="flex items-center justify-between text-secondary-text">
              <span className="font-metadata text-metadata font-medium">Affected Shipments</span>
              <span className="material-symbols-outlined text-[18px] text-muted-text">inventory_2</span>
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="font-kpi-value text-kpi-value text-primary-text font-semibold">{port.affectedShipmentsCount}</span>
              <span className="font-metadata text-metadata text-secondary-text">Consignments</span>
            </div>
            <span className="font-metadata text-metadata text-muted-text">Illustrative shipment count</span>
          </div>

          <div className="bg-primary-surface p-4 rounded-xl border border-border flex flex-col justify-between">
            <div className="flex items-center justify-between text-secondary-text">
              <span className="font-metadata text-metadata font-medium">Routes Affected</span>
              <span className="material-symbols-outlined text-[18px] text-muted-text">fork_right</span>
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="font-kpi-value text-kpi-value text-primary-text font-semibold">6</span>
              <span className="font-metadata text-metadata text-medium-risk">Corridors flagged</span>
            </div>
            <span className="font-metadata text-metadata text-muted-text">Illustrative route count</span>
          </div>
        </section>

        {/* MAIN PORT OVERVIEW: MAP + CURRENT CONDITIONS */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Schematic Map (7 cols) */}
          <div className="lg:col-span-7 bg-primary-surface rounded-xl border border-border p-5 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h2 className="font-section-heading text-section-heading text-primary-text">Port Overview</h2>
                <p className="font-metadata text-metadata text-secondary-text">Geographic transit corridors and destination nodes</p>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-metadata text-secondary-text">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-accent ring-2 ring-soft-accent"></span> Hub
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-1 bg-high-risk rounded"></span> High Congestion
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-1 bg-primary-accent rounded"></span> Active Transit
                </span>
              </div>
            </div>

            <div className="relative w-full h-[280px] my-3 rounded-lg bg-[#F5F7FA] overflow-hidden border border-border select-none">
              <svg className="absolute inset-0 w-full h-full text-slate-200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern height="30" id="port-grid" patternUnits="userSpaceOnUse" width="30">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#E6EAF0" strokeWidth="0.8" />
                  </pattern>
                </defs>
                <rect fill="url(#port-grid)" height="100%" width="100%" />
                <path d="M 0,0 L 140,0 Q 180,60 160,110 T 210,180 Q 230,220 180,280 L 0,280 Z" fill="#EAEFF5" opacity="0.8" />
                <path d="M 400,20 Q 420,70 390,130 T 430,200 L 520,280 L 600,280 L 600,0 Z" fill="#EAEFF5" opacity="0.4" />
                <path d="M 195 140 C 130 90, 80 40, 50 30" fill="none" stroke="#D94F4F" strokeDasharray="4 3" strokeWidth="2.5" />
                <path d="M 195 140 C 170 190, 150 220, 110 250" fill="none" stroke="#4263EB" strokeWidth="2" />
                <path d="M 195 140 C 300 110, 420 100, 560 120" fill="none" stroke="#B7791F" strokeDasharray="3 3" strokeWidth="2" />
                <path d="M 195 140 C 120 70, 70 30, 20 20" fill="none" stroke="#B7791F" strokeWidth="1.8" />
                <circle cx="50" cy="30" fill="#FFFFFF" r="4" stroke="#667085" strokeWidth="2" />
                <circle cx="20" cy="20" fill="#FFFFFF" r="3.5" stroke="#667085" strokeWidth="2" />
                <circle cx="110" cy="250" fill="#FFFFFF" r="4" stroke="#4263EB" strokeWidth="2" />
                <circle cx="560" cy="120" fill="#FFFFFF" r="4" stroke="#B7791F" strokeWidth="2" />
                <circle cx="195" cy="140" fill="#EEF2FF" opacity="0.6" r="16" />
                <circle cx="195" cy="140" fill="#4263EB" r="8" />
                <circle cx="195" cy="140" fill="#FFFFFF" r="3" />
              </svg>

              <div className="absolute top-[18px] left-[60px] bg-primary-surface/90 px-1.5 py-0.5 rounded border border-border text-[10px] font-medium text-secondary-text shadow-xs">
                Rotterdam
              </div>
              <div className="absolute bottom-[24px] left-[122px] bg-primary-surface/90 px-1.5 py-0.5 rounded border border-border text-[10px] font-medium text-secondary-text shadow-xs">
                Singapore
              </div>
              <div className="absolute top-[106px] right-[40px] bg-primary-surface/90 px-1.5 py-0.5 rounded border border-border text-[10px] font-medium text-secondary-text shadow-xs">
                Los Angeles
              </div>
              <div className="absolute top-[154px] left-[145px] bg-primary-text text-on-primary px-2 py-0.5 rounded shadow-sm text-[11px] font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-amber-300">anchor</span>
                {port.name} (Hub)
              </div>
            </div>

            <div className="pt-3 border-t border-border grid grid-cols-1 md:grid-cols-3 gap-2 font-metadata text-metadata text-secondary-text">
              <div>
                <span className="block text-muted-text">Connected corridors:</span>
                <strong className="text-primary-text font-medium">Asia–Europe, Intra-Asia, Transpacific</strong>
              </div>
              <div>
                <span className="block text-muted-text">Monitoring focus:</span>
                <strong className="text-primary-text font-medium">Congestion &amp; schedule disruption</strong>
              </div>
              <div>
                <span className="block text-muted-text">Related assessments:</span>
                <strong className="text-primary-text font-medium">Illustrative demo records</strong>
              </div>
            </div>
          </div>

          {/* Right: Current Conditions Summary (5 cols) */}
          <div className="lg:col-span-5 bg-primary-surface rounded-xl border border-border p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h2 className="font-section-heading text-section-heading text-primary-text">Current Conditions</h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-high-risk-bg text-high-risk">Requires Action</span>
              </div>
              <div className="space-y-3 mt-3">
                <div className="p-3 rounded-lg bg-subtle-surface border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-metadata text-metadata text-secondary-text font-medium">Congestion Metric</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-high-risk text-on-primary">Level: High</span>
                  </div>
                  <div className="flex items-center justify-between text-body">
                    <span className="text-secondary-text">Estimated waiting time</span>
                    <span className="font-button-input text-button-input text-primary-text font-semibold">{port.waitingTime}</span>
                  </div>
                  <div className="flex items-center justify-between text-body">
                    <span className="text-secondary-text">Operational status</span>
                    <span className="font-metadata text-metadata text-high-risk font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-high-risk"></span> Requires review
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-primary-surface border border-border space-y-1.5">
                  <span className="font-metadata text-metadata uppercase tracking-wider text-muted-text font-medium">Operational Context</span>
                  <div>
                    <span className="block font-metadata text-metadata text-secondary-text">Potential issue</span>
                    <p className="font-body text-[13px] text-primary-text">Increased congestion may affect cargo handling and departure schedules.</p>
                  </div>
                  <div className="pt-1 border-t border-border/60">
                    <span className="block font-metadata text-metadata text-secondary-text">Potential consequence</span>
                    <p className="font-body text-[13px] text-primary-text">Downstream arrival uncertainty for connected routes.</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-primary-surface border border-border space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-metadata text-metadata uppercase tracking-wider text-muted-text font-medium">Risk Assessment</span>
                    <span className="font-metadata text-metadata text-secondary-text">Assessment: Illustrative</span>
                  </div>
                  <p className="font-body text-[13px] text-secondary-text">
                    Port congestion may contribute to delays across selected shipping corridors, notably the Rotterdam and Northern Europe links.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border mt-3">
              <Link className="inline-flex items-center gap-1 font-button-input text-button-input text-primary-accent hover:underline" href="/risk-intelligence">
                <span>Explore Risk Intelligence</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>

        {/* CONGESTION TRENDS 14-DAY CHART */}
        <section className="bg-primary-surface rounded-xl border border-border p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
            <div>
              <h2 className="font-section-heading text-section-heading text-primary-text">Congestion Trends</h2>
              <p className="font-metadata text-metadata text-secondary-text">Illustrative historical congestion and waiting-time observations.</p>
            </div>
            <div className="flex items-center p-0.5 bg-subtle-surface border border-border rounded-lg self-start sm:self-center">
              <button
                onClick={() => setMetricTab("WAITING")}
                className={`px-3 py-1.5 rounded-md font-button-input text-[12px] font-medium transition-colors ${
                  metricTab === "WAITING" ? "bg-primary-surface text-primary-accent shadow-xs" : "text-secondary-text hover:text-primary-text"
                }`}
              >
                Estimated Waiting Time
              </button>
              <button
                onClick={() => setMetricTab("INDEX")}
                className={`px-3 py-1.5 rounded-md font-button-input text-[12px] font-medium transition-colors ${
                  metricTab === "INDEX" ? "bg-primary-surface text-primary-accent shadow-xs" : "text-secondary-text hover:text-primary-text"
                }`}
              >
                Congestion Index
              </button>
            </div>
          </div>

          <div className="pt-4">
            <div className="relative w-full h-[220px]">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 900 180">
                <defs>
                  <linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#4263EB" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#4263EB" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <line stroke="#E6EAF0" strokeDasharray="3 3" strokeWidth="1" x1="40" x2="890" y1="20" y2="20" />
                <line stroke="#E6EAF0" strokeDasharray="3 3" strokeWidth="1" x1="40" x2="890" y1="60" y2="60" />
                <line stroke="#E6EAF0" strokeDasharray="3 3" strokeWidth="1" x1="40" x2="890" y1="100" y2="100" />
                <line stroke="#E6EAF0" strokeDasharray="3 3" strokeWidth="1" x1="40" x2="890" y1="140" y2="140" />

                <text className="text-[10px] fill-muted-text font-metadata" textAnchor="end" x="30" y="24">24h</text>
                <text className="text-[10px] fill-muted-text font-metadata" textAnchor="end" x="30" y="64">18h</text>
                <text className="text-[10px] fill-muted-text font-metadata" textAnchor="end" x="30" y="104">12h</text>
                <text className="text-[10px] fill-muted-text font-metadata" textAnchor="end" x="30" y="144">6h</text>

                <polygon fill="url(#chart-fill)" points="50,120 115,115 180,110 245,100 310,95 375,80 440,75 505,65 570,70 635,55 700,50 765,45 830,48 890,60 890,160 50,160" />
                <polyline fill="none" points="50,120 115,115 180,110 245,100 310,95 375,80 440,75 505,65 570,70 635,55 700,50 765,45 830,48 890,60" stroke="#4263EB" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />

                <circle cx="50" cy="120" fill="#FFFFFF" r="3" stroke="#4263EB" strokeWidth="2" />
                <circle cx="245" cy="100" fill="#FFFFFF" r="3" stroke="#4263EB" strokeWidth="2" />
                <circle cx="440" cy="75" fill="#FFFFFF" r="3" stroke="#4263EB" strokeWidth="2" />
                <circle cx="635" cy="55" fill="#FFFFFF" r="3" stroke="#4263EB" strokeWidth="2" />
                <circle cx="765" cy="45" fill="#FFFFFF" r="3" stroke="#4263EB" strokeWidth="2" />

                <line stroke="#D94F4F" strokeDasharray="2 2" strokeWidth="1.5" x1="890" x2="890" y1="20" y2="160" />
                <circle cx="890" cy="60" fill="#D94F4F" r="5" stroke="#FFFFFF" strokeWidth="2" />
              </svg>

              <div className="absolute top-[20px] right-[4px] sm:right-[15px] bg-primary-text text-on-primary p-2 rounded-lg shadow-lg text-[11px] font-metadata pointer-events-none z-10">
                <div className="font-medium">Today</div>
                <div className="text-soft-accent font-semibold mt-0.5">{port.waitingTime} wait time <span className="text-high-risk">(High)</span></div>
              </div>
            </div>

            <div className="flex justify-between pl-10 pr-2 pt-2 text-[11px] font-metadata text-muted-text border-t border-border">
              <span>Oct 05</span>
              <span>Oct 07</span>
              <span>Oct 09</span>
              <span>Oct 11</span>
              <span>Oct 13</span>
              <span>Oct 15</span>
              <span>Oct 17</span>
              <span className="text-primary-text font-medium">Today (Live)</span>
            </div>
          </div>
        </section>

        {/* AFFECTED SHIPPING ROUTES TABLE */}
        <section className="bg-primary-surface rounded-xl border border-border p-5">
          <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
            <div>
              <h2 className="font-section-heading text-section-heading text-primary-text">Affected Routes</h2>
              <p className="font-metadata text-metadata text-secondary-text">Illustrative corridors associated with this port.</p>
            </div>
            <span className="font-metadata text-metadata text-secondary-text">Showing {DEMO_ROUTES.length} active corridors</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-secondary-text font-metadata text-metadata">
                  <th className="py-2.5 px-3 font-medium">Route</th>
                  <th className="py-2.5 px-3 font-medium">Destination</th>
                  <th className="py-2.5 px-3 font-medium">Estimated Waiting Time</th>
                  <th className="py-2.5 px-3 font-medium">Affected Shipments</th>
                  <th className="py-2.5 px-3 font-medium">Risk</th>
                  <th className="py-2.5 px-3 font-medium">Status</th>
                  <th className="py-2.5 px-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-table-text text-table-text">
                {DEMO_ROUTES.map((route) => (
                  <tr key={route.id} className="hover:bg-subtle-surface transition-colors">
                    <td className="py-3 px-3 font-table-text-medium text-primary-text font-medium">{route.name}</td>
                    <td className="py-3 px-3 text-secondary-text">{route.destination}</td>
                    <td className="py-3 px-3 font-medium text-primary-text">{route.transitEstimate}</td>
                    <td className="py-3 px-3 text-secondary-text">{route.affectedShipments}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                        route.riskLevel === "HIGH" ? "bg-high-risk-bg text-high-risk" : "bg-medium-risk-bg text-medium-risk"
                      }`}>
                        {route.riskLevel}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-secondary-text">
                      <span className="inline-flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${route.riskLevel === "HIGH" ? "bg-high-risk" : "bg-medium-risk"}`} />
                        {route.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        className="font-button-input text-button-input text-primary-accent hover:underline inline-flex items-center gap-0.5"
                        href={`/routes/${route.id}`}
                      >
                        Inspect route <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SHIPMENTS POTENTIALLY AFFECTED TABLE */}
        <section className="bg-primary-surface rounded-xl border border-border p-5">
          <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
            <div>
              <h2 className="font-section-heading text-section-heading text-primary-text">Shipments Potentially Affected</h2>
              <p className="font-metadata text-metadata text-secondary-text">Sample shipment records with scheduled departure or arrival at {port.name}.</p>
            </div>
            <Link className="font-button-input text-button-input text-primary-accent hover:underline inline-flex items-center gap-1" href="/shipments">
              <span>View All Shipments</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-secondary-text font-metadata text-metadata">
                  <th className="py-2.5 px-3 font-medium">Shipment ID</th>
                  <th className="py-2.5 px-3 font-medium">Origin</th>
                  <th className="py-2.5 px-3 font-medium">Destination</th>
                  <th className="py-2.5 px-3 font-medium">Estimated Arrival</th>
                  <th className="py-2.5 px-3 font-medium">Risk</th>
                  <th className="py-2.5 px-3 font-medium">Status</th>
                  <th className="py-2.5 px-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-table-text text-table-text">
                {(affectedShipments.length > 0 ? affectedShipments : DEMO_SHIPMENTS.slice(0, 4)).map((s) => (
                  <tr key={s.id} className="hover:bg-subtle-surface transition-colors">
                    <td className="py-3 px-3 font-mono font-medium text-primary-accent">
                      <Link href={`/shipments/${s.id}`}>{s.id}</Link>
                    </td>
                    <td className="py-3 px-3 text-secondary-text">{s.origin}</td>
                    <td className="py-3 px-3 text-secondary-text">{s.destination}</td>
                    <td className="py-3 px-3 text-secondary-text font-mono">{s.eta}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                        s.riskLevel === "HIGH" ? "bg-high-risk-bg text-high-risk" : s.riskLevel === "MEDIUM" ? "bg-medium-risk-bg text-medium-risk" : "bg-success-bg text-success"
                      }`}>
                        {s.riskLevel}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-secondary-text">{s.status}</td>
                    <td className="py-3 px-3 text-right">
                      <Link href={`/shipments/${s.id}`} className="text-secondary-text hover:text-primary-accent text-[13px] font-medium">
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
