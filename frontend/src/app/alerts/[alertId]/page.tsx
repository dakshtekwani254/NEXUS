"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { DEMO_DISRUPTIONS, DEMO_SHIPMENTS } from "@/lib/demoData";

export default function AlertDetailPage() {
  const params = useParams();
  const alertId = typeof params?.alertId === "string" ? params.alertId : "ALT-0024";
  const [acknowledged, setAcknowledged] = useState(false);

  const alert = DEMO_DISRUPTIONS.find(
    (d) => d.id.toLowerCase() === alertId.toLowerCase() || (d.title || d.headline || "").toLowerCase().includes(alertId.toLowerCase())
  ) || DEMO_DISRUPTIONS[0];

  return (
    <AppShell
      title={alert.title || alert.headline || "Disruption Alert"}
      subtitle="Comprehensive threat assessment, affected assets, and active operational telemetry."
      actions={
        <div className="flex items-center gap-2">
          <Link
            href={`/research?q=${encodeURIComponent(`${alert.title || alert.headline || alert.id} port advisory delays`)}&category=disruption`}
            className="px-3.5 py-2 rounded-xl font-button-input text-button-input transition-colors flex items-center gap-1.5 bg-primary-accent hover:bg-primary text-on-primary shadow-2xs"
          >
            <span className="material-symbols-outlined text-[18px]">travel_explore</span>
            <span>Research via Web</span>
          </Link>
          <button
            onClick={() => setAcknowledged(true)}
            className={`px-3.5 py-2 rounded-xl font-button-input text-button-input transition-colors flex items-center gap-1.5 ${
              acknowledged
                ? "bg-success text-on-primary"
                : "bg-subtle-surface hover:bg-hover-surface text-primary-text border border-border"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {acknowledged ? "done" : "check_circle"}
            </span>
            <span>{acknowledged ? "Acknowledged" : "Acknowledge Alert"}</span>
          </button>
          <button className="px-3.5 py-2 bg-primary-surface hover:bg-subtle-surface text-primary-text font-button-input text-button-input rounded-xl border border-border transition-colors flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>Assign</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Incident Detail Header Strip */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex flex-wrap items-center gap-2.5 text-secondary-text font-table-text text-table-text">
            <span className="inline-flex items-center gap-1 font-table-text-medium text-primary-text">
              <span className="text-muted-text">Alert ID:</span> {alert.id}
            </span>
            <span className="text-muted-text">|</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[12px] font-semibold bg-high-risk-bg text-high-risk">
              <span className="w-1.5 h-1.5 rounded-full bg-high-risk"></span>
              {alert.severity}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[12px] font-medium bg-soft-accent text-primary-accent border border-border">
              {acknowledged ? "Acknowledged" : "Open"}
            </span>
            <span className="text-muted-text">|</span>
            <span className="text-secondary-text">Created: 18 Oct 2026, 10:42</span>
            <span className="text-muted-text">|</span>
            <span className="text-muted-text italic">Source: Illustrative demo alert</span>
          </div>
        </section>

        {/* Why this alert matters & Key Impact Metrics Bento Grid */}
        <section className="bg-primary-surface border border-border rounded-xl p-5 flex flex-col lg:flex-row gap-6 items-stretch">
          <div className="lg:w-1/2 flex flex-col justify-between pr-0 lg:pr-6 border-b lg:border-b-0 lg:border-r border-border pb-4 lg:pb-0">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary-accent text-[20px]">info</span>
                <h2 className="font-section-heading text-section-heading text-primary-text">Why this alert matters</h2>
              </div>
              <p className="font-body text-body text-secondary-text leading-relaxed">
                {alert.description} Berth queue times have exceeded standard baseline buffers by 33%, introducing elevated transit deviation risk for outbound European and North American freight.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center gap-2 text-muted-text font-metadata text-metadata">
              <span className="material-symbols-outlined text-[15px]">verified_user</span>
              <span>Verify the latest operational data before making shipment or routing decisions.</span>
            </div>
          </div>

          <div className="lg:w-1/2 grid grid-cols-3 gap-4 items-center">
            <div className="flex flex-col p-4 rounded-xl bg-subtle-surface border border-border">
              <span className="font-metadata text-metadata text-secondary-text mb-1">Affected Shipments</span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-kpi-value text-kpi-value text-primary-text">{alert.affectedShipmentsCount}</span>
                <span className="font-metadata text-[11px] text-high-risk font-semibold">Consignments</span>
              </div>
              <span className="font-metadata text-[11px] text-muted-text mt-1">Directly flagged</span>
            </div>

            <div className="flex flex-col p-4 rounded-xl bg-subtle-surface border border-border">
              <span className="font-metadata text-metadata text-secondary-text mb-1">Related Routes</span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-kpi-value text-kpi-value text-primary-text">6</span>
                <span className="font-metadata text-[11px] text-medium-risk font-semibold">Corridors</span>
              </div>
              <span className="font-metadata text-[11px] text-muted-text mt-1">Exposed to delay</span>
            </div>

            <div className="flex flex-col p-4 rounded-xl bg-subtle-surface border border-border">
              <span className="font-metadata text-metadata text-secondary-text mb-1">Est. Waiting Time</span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-kpi-value text-kpi-value text-primary-text">18<span className="text-body font-normal text-secondary-text">h</span></span>
                <span className="font-metadata text-[11px] text-high-risk font-semibold">+6h</span>
              </div>
              <span className="font-metadata text-[11px] text-muted-text mt-1">vs typical dwell</span>
            </div>
          </div>
        </section>

        {/* Horizontal Severity and Status Overview Panel */}
        <section className="bg-primary-surface border border-border rounded-xl px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-border">
          <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:pr-4">
            <div className="w-10 h-10 rounded-xl bg-high-risk-bg text-high-risk flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">report</span>
            </div>
            <div>
              <span className="font-metadata text-metadata text-secondary-text block">Severity</span>
              <div className="flex items-center gap-2">
                <span className="font-table-text-medium text-table-text-medium text-primary-text">{alert.severity}</span>
                <span className="text-high-risk font-metadata text-[11px] font-semibold">(Level 4/5)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:px-4">
            <div className="w-10 h-10 rounded-xl bg-soft-accent text-primary-accent flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">pending</span>
            </div>
            <div>
              <span className="font-metadata text-metadata text-secondary-text block">Alert Status</span>
              <span className="font-table-text-medium text-table-text-medium text-primary-text">{acknowledged ? "Acknowledged" : "Open"}</span>
              <span className="text-muted-text font-metadata text-[11px] block">{acknowledged ? "Reviewed by operator" : "Awaiting review"}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:px-4">
            <div className="w-10 h-10 rounded-xl bg-subtle-surface text-secondary-text flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">person_outline</span>
            </div>
            <div>
              <span className="font-metadata text-metadata text-secondary-text block">Assigned To</span>
              <div className="flex items-center gap-1.5">
                <span className="font-table-text-medium text-table-text-medium text-primary-text">Sarah Chen</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:pl-4">
            <div className="w-10 h-10 rounded-xl bg-subtle-surface text-secondary-text flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">history</span>
            </div>
            <div>
              <span className="font-metadata text-metadata text-secondary-text block">Last Reviewed</span>
              <span className="font-table-text-medium text-table-text-medium text-muted-text">Just now</span>
              <span className="text-muted-text font-metadata text-[11px] block">Live monitor</span>
            </div>
          </div>
        </section>

        {/* Impacted Network & Potential Impact (60/40 Split) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 bg-primary-surface border border-border rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary-text text-[20px]">hub</span>
                  <h3 className="font-section-heading text-section-heading text-primary-text">Impacted Network</h3>
                </div>
                <span className="font-metadata text-metadata text-muted-text">Live corridor topological model</span>
              </div>

              <div className="relative w-full h-[280px] bg-subtle-surface border border-border rounded-xl overflow-hidden flex items-center justify-center select-none">
                <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,#E6EAF0_1px,transparent_1px),linear-gradient(to_bottom,#E6EAF0_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <path className="opacity-90" d="M 380 140 Q 250 80 120 70" fill="none" stroke="#D94F4F" strokeDasharray="6,4" strokeWidth="2.5" />
                  <path className="opacity-80" d="M 380 140 Q 280 60 170 40" fill="none" stroke="#D94F4F" strokeDasharray="4,4" strokeWidth="2" />
                  <path className="opacity-70" d="M 380 140 Q 320 200 240 230" fill="none" stroke="#4263EB" strokeWidth="2" />
                  <path className="opacity-75" d="M 380 140 Q 480 130 580 160" fill="none" stroke="#B7791F" strokeDasharray="5,3" strokeWidth="2" />
                  <circle cx="380" cy="140" fill="#D94F4F" fillOpacity="0.12" r="32" stroke="#D94F4F" strokeOpacity="0.3" strokeWidth="1.5" />
                  <circle cx="380" cy="140" fill="#D94F4F" fillOpacity="0.25" r="16" />
                </svg>

                <div className="absolute left-[380px] top-[140px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                  <div className="w-6 h-6 rounded-full bg-high-risk text-on-primary flex items-center justify-center border-2 border-primary-surface shadow-xs">
                    <span className="material-symbols-outlined text-[14px]">anchor</span>
                  </div>
                  <div className="mt-1 px-2 py-0.5 rounded bg-primary-text text-on-primary text-[11px] font-semibold whitespace-nowrap shadow-xs">
                    {alert.location} (Origin)
                  </div>
                </div>

                <div className="absolute left-[120px] top-[70px] -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 z-10">
                  <div className="w-3.5 h-3.5 rounded-full bg-primary-surface border-2 border-primary-accent"></div>
                  <span className="text-[11px] font-medium text-primary-text bg-primary-surface/90 px-1.5 py-0.5 rounded border border-border">Rotterdam</span>
                </div>

                <div className="absolute left-[240px] top-[230px] -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 z-10">
                  <div className="w-3.5 h-3.5 rounded-full bg-primary-surface border-2 border-primary-accent"></div>
                  <span className="text-[11px] font-medium text-primary-text bg-primary-surface/90 px-1.5 py-0.5 rounded border border-border">Singapore</span>
                </div>

                <div className="absolute left-[580px] top-[160px] -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 z-10">
                  <div className="w-3.5 h-3.5 rounded-full bg-primary-surface border-2 border-medium-risk"></div>
                  <span className="text-[11px] font-medium text-primary-text bg-primary-surface/90 px-1.5 py-0.5 rounded border border-border">Los Angeles</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border flex flex-wrap items-center justify-between text-[12px] text-secondary-text">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-high-risk"></span>
                  <span>Alert Origin ({alert.location})</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-0.5 bg-high-risk"></span>
                  <span>High Delay Corridor</span>
                </span>
              </div>
              <span className="font-metadata text-muted-text">Map datum: WGS-84 Maritime standard</span>
            </div>
          </div>

          <div className="lg:col-span-5 bg-primary-surface border border-border rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-accent text-[20px]">insights</span>
                  <h3 className="font-section-heading text-section-heading text-primary-text">Potential Impact</h3>
                </div>
                <span className="font-metadata text-metadata text-muted-text">Analysis</span>
              </div>

              <dl className="flex flex-col gap-3 text-body font-body">
                <div className="flex items-start justify-between py-1.5 border-b border-subtle-surface">
                  <dt className="text-secondary-text font-metadata text-metadata">Primary Location</dt>
                  <dd className="font-table-text-medium text-table-text-medium text-primary-text text-right flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-high-risk"></span>
                    {alert.location}
                  </dd>
                </div>
                <div className="flex items-start justify-between py-1.5 border-b border-subtle-surface">
                  <dt className="text-secondary-text font-metadata text-metadata">Incident Classification</dt>
                  <dd className="font-table-text-medium text-table-text-medium text-primary-text text-right">
                    Port Bottleneck &amp; Congestion
                  </dd>
                </div>
                <div className="flex items-start justify-between py-1.5 border-b border-subtle-surface">
                  <dt className="text-secondary-text font-metadata text-metadata">Recommended Action</dt>
                  <dd className="font-table-text-medium text-table-text-medium text-high-risk text-right">
                    Reroute via Cape / Expedite Transshipment
                  </dd>
                </div>
                <div className="flex items-start justify-between py-1.5">
                  <dt className="text-secondary-text font-metadata text-metadata">Est. Delay Variance</dt>
                  <dd className="font-table-text-medium text-table-text-medium text-primary-text text-right">
                    +48 to +96 hrs
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-4 pt-3 border-t border-border">
              <Link
                href="/ai-analyst"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-soft-accent text-primary-accent font-button-input text-button-input hover:bg-primary-accent hover:text-on-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                <span>Open in AI Analyst Workspace</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Potentially Affected Shipments table */}
        <section className="bg-primary-surface rounded-xl border border-border p-5">
          <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
            <div>
              <h2 className="font-section-heading text-section-heading text-primary-text">Potentially Affected Shipments</h2>
              <p className="font-metadata text-metadata text-secondary-text">Shipments passing through {alert.location} flagged by predictive intelligence.</p>
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
                  <th className="py-2.5 px-3 font-medium">ETA</th>
                  <th className="py-2.5 px-3 font-medium">Risk Score</th>
                  <th className="py-2.5 px-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-table-text text-table-text">
                {DEMO_SHIPMENTS.slice(0, 4).map((s) => (
                  <tr key={s.id} className="hover:bg-subtle-surface transition-colors">
                    <td className="py-3 px-3 font-mono font-medium text-primary-accent">
                      <Link href={`/shipments/${s.id}`}>{s.id}</Link>
                    </td>
                    <td className="py-3 px-3 text-secondary-text">{s.origin}</td>
                    <td className="py-3 px-3 text-secondary-text">{s.destination}</td>
                    <td className="py-3 px-3 text-secondary-text font-mono">{s.eta}</td>
                    <td className="py-3 px-3 font-mono font-semibold text-high-risk">{s.riskScore}/100</td>
                    <td className="py-3 px-3 text-right">
                      <Link href={`/shipments/${s.id}`} className="text-secondary-text hover:text-primary-accent text-[13px] font-medium">
                        Inspect →
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
