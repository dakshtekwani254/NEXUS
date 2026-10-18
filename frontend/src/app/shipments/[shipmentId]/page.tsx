"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { DEMO_SHIPMENTS, DEMO_DISRUPTIONS } from "@/lib/demoData";
import { Shipment, DisruptionEvent } from "@/lib/types";

export default function ShipmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const shipmentId = (params?.shipmentId as string) || "SHP-10482";

  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [disruptions, setDisruptions] = useState<DisruptionEvent[]>([]);
  const [rerouting, setRerouting] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "timeline" | "risk">("overview");

  useEffect(() => {
    const found = DEMO_SHIPMENTS.find((s) => s.id === shipmentId) || DEMO_SHIPMENTS[0];
    setShipment(found);
    setDisruptions(DEMO_DISRUPTIONS);
  }, [shipmentId]);

  if (!shipment) {
    return (
      <AppShell title="Shipment Detail" subtitle="Loading shipment telemetry...">
        <div className="p-8 text-center text-muted-text">Loading shipment {shipmentId}...</div>
      </AppShell>
    );
  }

  const handleSimulateReroute = () => {
    setRerouting(true);
    setTimeout(() => {
      setRerouting(false);
      alert("Alternative routing via Cape of Good Hope simulated: +10 days transit, avoids Bab el-Mandeb chokepoint risks.");
    }, 800);
  };

  const relatedShipments = DEMO_SHIPMENTS.filter((s) => s.id !== shipment.id).slice(0, 3);

  return (
    <AppShell
      title={`Shipment ${shipment.id}`}
      subtitle={`${shipment.origin_name} (${shipment.origin}) → ${shipment.dest_name} (${shipment.destination})`}
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/shipments"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-primary-surface hover:bg-subtle-surface text-secondary-text hover:text-primary-text text-[13px] font-medium transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>All Shipments</span>
          </Link>
          <button
            onClick={handleSimulateReroute}
            disabled={rerouting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-accent hover:bg-primary text-white text-[13px] font-medium transition-colors shadow-2xs disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px]">{rerouting ? "sync" : "alt_route"}</span>
            <span>{rerouting ? "Simulating..." : "Simulate Reroute"}</span>
          </button>
          <Link
            href={`/ai-analyst?inquiry=Analyze+shipment+${shipment.id}+delay+impact`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-primary-surface hover:bg-subtle-surface text-primary-text text-[13px] font-medium transition-colors"
          >
            <span className="material-symbols-outlined text-[16px] text-primary-accent">psychology</span>
            <span>Investigate with AI</span>
          </Link>
        </div>
      }
    >
      {/* 1. Shipment Detail Header & Meta Row */}
      <section className="bg-primary-surface border border-border rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[16px] font-bold text-primary-text">{shipment.id}</span>
              <span className="text-[12px] font-mono text-muted-text border-l border-border pl-2.5">
                Ref: {shipment.tracking_ref}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                  shipment.status === "AT_RISK"
                    ? "bg-high-risk-bg text-high-risk"
                    : shipment.status === "ON_TIME"
                    ? "bg-success-bg text-success"
                    : "bg-medium-risk-bg text-medium-risk"
                }`}
              >
                {shipment.status.replace("_", " ")}
              </span>
            </div>
            <p className="text-[14px] text-secondary-text mt-1">
              Carrier: <span className="font-medium text-primary-text">{shipment.carrier}</span> • Vessel:{" "}
              <span className="font-medium text-primary-text">{shipment.vessel || "Assigned Carrier Vessel"}</span> • Container:{" "}
              <span className="font-mono text-primary-text">{shipment.container_id}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 text-right">
            <div>
              <span className="text-[11px] text-muted-text uppercase block">Declared Cargo Value</span>
              <span className="text-[18px] font-bold text-primary-text">
                ${(shipment.value_usd / 1000000).toFixed(2)}M USD
              </span>
            </div>
          </div>
        </div>

        {/* 4 Summary KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-border">
          <div className="p-3 bg-subtle-surface rounded-lg border border-border">
            <span className="text-[11px] text-muted-text block">Expected Arrival</span>
            <span className="text-[15px] font-semibold text-primary-text">{shipment.expected_arrival}</span>
            <span className="text-[11px] text-muted-text mt-0.5 block">Deadline: {shipment.delivery_deadline}</span>
          </div>

          <div className="p-3 bg-subtle-surface rounded-lg border border-border">
            <span className="text-[11px] text-muted-text block">Estimated Delay</span>
            <span
              className={`text-[15px] font-semibold ${
                shipment.predicted_delay_hours > 24 ? "text-high-risk" : "text-medium-risk"
              }`}
            >
              +{shipment.predicted_delay_hours} Hours
            </span>
            <span className="text-[11px] text-high-risk mt-0.5 block">SLA At Risk</span>
          </div>

          <div className="p-3 bg-subtle-surface rounded-lg border border-border">
            <span className="text-[11px] text-muted-text block">Composite Risk Score</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[18px] font-bold text-high-risk">{shipment.risk_score}</span>
              <span className="text-[11px] text-muted-text">/ 100</span>
            </div>
            <span className="text-[11px] text-high-risk font-medium block">Level: {shipment.delay_risk_level}</span>
          </div>

          <div className="p-3 bg-subtle-surface rounded-lg border border-border">
            <span className="text-[11px] text-muted-text block">Current Status</span>
            <span className="text-[15px] font-semibold text-primary-text">In Transit</span>
            <span className="text-[11px] text-secondary-text mt-0.5 block">Strait of Malacca Approach</span>
          </div>
        </div>
      </section>

      {/* 2. Main Two-Column Row: Journey Overview (62%) & Shipment Information (38%) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (7 cols): Route Progression Graphic */}
        <div className="lg:col-span-7 bg-primary-surface border border-border rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h3 className="text-[15px] font-semibold text-primary-text">Journey Overview &amp; Corridor Map</h3>
              <p className="text-[12px] text-secondary-text">Current position along Asia–Europe Corridor (RTE-01)</p>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-subtle-surface border border-border text-secondary-text">
              Real-time AIS track
            </span>
          </div>

          {/* SVG Route Visualization */}
          <div className="relative w-full h-[260px] bg-subtle-surface rounded-lg border border-border overflow-hidden flex items-center justify-center p-3">
            <svg className="w-full h-full" viewBox="0 0 540 220" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Pattern */}
              <pattern id="shipment-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#E6EAF0" />
              </pattern>
              <rect width="540" height="220" fill="url(#shipment-grid)" />

              {/* Traveled Route Line */}
              <path d="M 60 170 Q 180 180 260 140" stroke="#4263EB" strokeWidth="3" />
              {/* Upcoming Route Line */}
              <path d="M 260 140 Q 360 90 480 60" stroke="#CBD5E1" strokeWidth="3" strokeDasharray="6 4" />
              {/* Alternative Cape Bypass */}
              <path d="M 260 140 Q 380 210 480 60" stroke="#B7791F" strokeWidth="2" strokeDasharray="4 4" />

              {/* Origin Node: Shanghai */}
              <circle cx="60" cy="170" r="7" fill="#172033" />
              <text x="60" y="195" fill="#172033" fontSize="11" fontWeight="600" textAnchor="middle">
                Shanghai (CNSHA)
              </text>

              {/* Current Vessel Progress Node */}
              <circle cx="260" cy="140" r="12" fill="#EEF2FF" className="animate-pulse" />
              <circle cx="260" cy="140" r="6" fill="#4263EB" />
              <text x="260" y="125" fill="#4263EB" fontSize="11" fontWeight="700" textAnchor="middle">
                MV Madrid Maersk (Current Position)
              </text>

              {/* Chokepoint: Bab el-Mandeb */}
              <circle cx="370" cy="100" r="5" fill="#D94F4F" />
              <text x="370" y="85" fill="#D94F4F" fontSize="10" fontWeight="600" textAnchor="middle">
                Bab el-Mandeb Alert Zone
              </text>

              {/* Destination Node: Rotterdam */}
              <circle cx="480" cy="60" r="7" fill="#268568" />
              <text x="480" y="45" fill="#172033" fontSize="11" fontWeight="600" textAnchor="middle">
                Rotterdam (NLRTM)
              </text>
            </svg>

            <div className="absolute bottom-2 left-3 bg-primary-surface/90 backdrop-blur-xs px-2.5 py-1 rounded border border-border text-[11px] text-secondary-text">
              <span className="inline-block w-2.5 h-0.5 bg-[#B7791F] mr-1.5 align-middle" />
              Proposed Cape Bypass Option (+9.8 days, zero security risk)
            </div>
          </div>

          {/* Journey Stages Bar */}
          <div className="p-3 bg-subtle-surface rounded-lg border border-border flex items-center justify-between text-[12px]">
            <span className="text-secondary-text">Vessel Speed: <span className="font-semibold text-primary-text">17.8 kn</span></span>
            <span className="text-secondary-text">Distance to Destination: <span className="font-semibold text-primary-text">4,820 nm</span></span>
            <span className="text-secondary-text">Route Progress: <span className="font-semibold text-primary-accent">46% completed</span></span>
          </div>
        </div>

        {/* Right Column (5 cols): Shipment Information Panel */}
        <div className="lg:col-span-5 bg-primary-surface border border-border rounded-xl p-5 shadow-2xs space-y-4">
          <div className="pb-3 border-b border-border">
            <h3 className="text-[15px] font-semibold text-primary-text">Shipment Specifications</h3>
            <p className="text-[12px] text-secondary-text">Bill of Lading manifest &amp; logistics parameters</p>
          </div>

          <div className="divide-y divide-border text-[13px]">
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-secondary-text">Cargo Description</span>
              <span className="font-medium text-primary-text text-right max-w-[200px] truncate">{shipment.cargo_description}</span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-secondary-text">Carrier &amp; Service</span>
              <span className="font-medium text-primary-text">{shipment.carrier} (AE10)</span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-secondary-text">Container Serial</span>
              <span className="font-mono text-primary-text">{shipment.container_id}</span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-secondary-text">Departure Date</span>
              <span className="font-medium text-primary-text">{shipment.departure_date}</span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-secondary-text">Contractual SLA</span>
              <span className="font-medium text-primary-text">{shipment.delivery_deadline}</span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-secondary-text">Origin Port</span>
              <Link href={`/ports/${shipment.origin}`} className="text-primary-accent hover:underline font-medium">
                {shipment.origin_name} ({shipment.origin})
              </Link>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-secondary-text">Destination Port</span>
              <Link href={`/ports/${shipment.destination}`} className="text-primary-accent hover:underline font-medium">
                {shipment.dest_name} ({shipment.destination})
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Milestone Timeline & Disruption Impact */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Milestone Timeline (7 cols) */}
        <div className="lg:col-span-7 bg-primary-surface border border-border rounded-xl p-5 shadow-2xs space-y-4">
          <div className="pb-3 border-b border-border">
            <h3 className="text-[15px] font-semibold text-primary-text">Milestone Progression &amp; Timeline</h3>
            <p className="text-[12px] text-secondary-text">Status verification from origin gate-in to discharge</p>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
            {shipment.milestones?.map((m, idx) => (
              <div key={idx} className="relative flex items-start gap-4">
                <span
                  className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    m.completed
                      ? "bg-success text-white"
                      : idx === 3
                      ? "bg-primary-accent text-white animate-pulse"
                      : "bg-subtle-surface border border-border text-muted-text"
                  }`}
                >
                  <span className="material-symbols-outlined text-[12px]">
                    {m.completed ? "check" : idx === 3 ? "navigation" : "schedule"}
                  </span>
                </span>
                <div className="flex-1 bg-subtle-surface p-3 rounded-lg border border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-primary-text">{m.name}</span>
                    <span className="text-[11px] text-muted-text font-mono">{m.date}</span>
                  </div>
                  <span className="text-[11px] text-secondary-text block mt-0.5">{m.location}</span>
                  {m.status_note && (
                    <p className="text-[12px] text-primary-text mt-1.5 font-medium bg-primary-surface p-2 rounded border border-border">
                      {m.status_note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contributing Risk Factors & Recommendations (5 cols) */}
        <div className="lg:col-span-5 bg-primary-surface border border-border rounded-xl p-5 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-border">
              <h3 className="text-[15px] font-semibold text-primary-text">AI Analyst Recommendations</h3>
              <p className="text-[12px] text-secondary-text">Actionable mitigations for +34h variance</p>
            </div>

            <div className="space-y-3 mt-4">
              {shipment.mitigation_actions?.map((act, i) => (
                <div key={i} className="p-3 rounded-lg bg-soft-accent border border-primary-accent/20 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-primary-accent">check_circle</span>
                    <span className="text-[12px] font-semibold text-primary-text">Recommendation #{i + 1}</span>
                  </div>
                  <p className="text-[12px] text-secondary-text leading-relaxed">{act}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between">
            <span className="text-[12px] text-muted-text">Confidence: 94% Deterministic</span>
            <button
              onClick={() => alert("Mitigation instruction sent to Carrier Freight Operations.")}
              className="px-3.5 py-1.5 rounded-lg bg-primary-accent hover:bg-primary text-white text-[12px] font-medium transition-colors"
            >
              Authorize Actions
            </button>
          </div>
        </div>
      </section>

      {/* 4. Correlated / Related Shipments */}
      <section className="bg-primary-surface border border-border rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[15px] font-semibold text-primary-text">Related Corridor Shipments</h3>
            <p className="text-[12px] text-secondary-text">Other consignments sharing maritime chokepoints with this vessel</p>
          </div>
          <Link href="/shipments" className="text-[12px] text-primary-accent hover:underline font-medium">
            View All Shipments →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-subtle-surface/50 text-[11px] font-semibold text-secondary-text uppercase tracking-wider">
                <th className="py-2.5 px-3">Shipment Ref</th>
                <th className="py-2.5 px-3">Carrier</th>
                <th className="py-2.5 px-3">Route Lane</th>
                <th className="py-2.5 px-3">Delay Variance</th>
                <th className="py-2.5 px-3">Risk Level</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-[13px]">
              {relatedShipments.map((s) => (
                <tr key={s.id} className="hover:bg-subtle-surface transition-colors">
                  <td className="py-3 px-3 font-mono font-medium text-primary-text">{s.id}</td>
                  <td className="py-3 px-3 text-secondary-text">{s.carrier}</td>
                  <td className="py-3 px-3 text-primary-text">{s.origin} → {s.destination}</td>
                  <td className="py-3 px-3 font-medium text-high-risk">+{s.predicted_delay_hours}h</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-high-risk-bg text-high-risk">
                      {s.delay_risk_level}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link href={`/shipments/${s.id}`} className="text-primary-accent hover:underline text-[12px] font-medium">
                      View Dossier
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
