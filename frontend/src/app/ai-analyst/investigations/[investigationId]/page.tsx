"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { DEMO_INVESTIGATIONS } from "@/lib/demoData";

export default function InvestigationDetailPage() {
  const params = useParams();
  const investigationId = typeof params?.investigationId === "string" ? params.investigationId : "INV-0018";
  const [followUp, setFollowUp] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "user",
      text: "Investigate how the 18-hour congestion at Shanghai Port impacts our European consignments on the Asia-Europe corridor.",
      time: "10:45 AM",
    },
    {
      role: "assistant",
      text: "Analysis completed. Identified 32 consignments at risk of delay. Highest impact is concentrated on container ship MSC Paloma (SHP-10482) carrying temperature-sensitive electronic components. Recommended action: expedite discharge priority or evaluate intermodal feeder rerouting via Singapore.",
      time: "10:46 AM",
    },
  ]);

  const inv = DEMO_INVESTIGATIONS.find(
    (i) => i.id.toLowerCase() === investigationId.toLowerCase() || i.title.toLowerCase().includes(investigationId.toLowerCase())
  ) || DEMO_INVESTIGATIONS[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUp.trim()) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", text: followUp, time: "Just now" },
      {
        role: "assistant",
        text: `Analysis updated for "${followUp}". Evaluated real-time buffer thresholds across North Sea ports. Rotterdam dwell times remain within standard limits (+2.4h), but Antwerp feeder lines indicate secondary container staging friction.`,
        time: "Just now",
      },
    ]);
    setFollowUp("");
  };

  return (
    <AppShell
      title={`Investigation: ${inv.title}`}
      subtitle="Understand how port congestion and transit friction affect connected supply chains."
      actions={
        <div className="flex items-center gap-2.5">
          <Link
            href="/ai-analyst/investigations"
            className="px-3.5 py-2 bg-primary-surface border border-border rounded-xl font-button-input text-button-input text-primary-text hover:bg-subtle-surface transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Back to History</span>
          </Link>
          <button className="px-3.5 py-2 bg-primary-accent rounded-xl font-button-input text-button-input text-on-primary hover:bg-primary transition-colors flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export Report</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Investigation Metadata Row */}
        <div className="flex items-center flex-wrap gap-y-2 gap-x-6 pb-4 border-b border-border font-metadata text-metadata text-secondary-text">
          <span className="flex items-center gap-1.5">
            <span className="text-muted-text">Investigation ID:</span>
            <span className="font-mono font-medium text-primary-text">{inv.id}</span>
          </span>
          <span className="text-border">|</span>
          <span className="flex items-center gap-1.5">
            <span className="text-muted-text">Created:</span>
            <span className="font-medium text-primary-text">{inv.createdAt}</span>
          </span>
          <span className="text-border">|</span>
          <span className="flex items-center gap-1.5">
            <span className="text-muted-text">Scope:</span>
            <span className="font-medium text-primary-text">{inv.scope}</span>
          </span>
          <span className="text-border">|</span>
          <span className="flex items-center gap-1.5">
            <span className="text-muted-text">Related Corridor:</span>
            <span className="font-medium text-primary-text">Asia–Europe</span>
          </span>
          <span className="text-border">|</span>
          <span className="flex items-center gap-1.5">
            <span className="text-muted-text">Analyst:</span>
            <span className="font-medium text-primary-text flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-primary-accent">smart_toy</span>
              AI Analyst (Fine-tuned)
            </span>
          </span>
        </div>

        {/* 4 KPI CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-primary-surface border border-border rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-secondary-text">
              <span className="font-metadata text-metadata font-medium">Potentially Affected Shipments</span>
              <span className="material-symbols-outlined text-[20px] text-muted-text">local_shipping</span>
            </div>
            <div className="mt-2">
              <div className="font-kpi-value text-kpi-value text-primary-text">{inv.affectedShipmentsCount}</div>
              <div className="font-metadata text-metadata text-secondary-text mt-0.5">Illustrative shipment count</div>
            </div>
          </div>

          <div className="bg-primary-surface border border-border rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-secondary-text">
              <span className="font-metadata text-metadata font-medium">Primary Risk Location</span>
              <span className="material-symbols-outlined text-[20px] text-muted-text">anchor</span>
            </div>
            <div className="mt-2">
              <div className="font-section-heading text-[20px] leading-tight font-semibold text-primary-text">{inv.primaryEntity}</div>
              <div className="font-metadata text-metadata text-high-risk font-medium mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-high-risk"></span>
                High congestion risk
              </div>
            </div>
          </div>

          <div className="bg-primary-surface border border-border rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-secondary-text">
              <span className="font-metadata text-metadata font-medium">Estimated Waiting Time</span>
              <span className="material-symbols-outlined text-[20px] text-muted-text">schedule</span>
            </div>
            <div className="mt-2">
              <div className="font-kpi-value text-kpi-value text-primary-text">18 hrs</div>
              <div className="font-metadata text-metadata text-secondary-text mt-0.5">Illustrative estimate</div>
            </div>
          </div>

          <div className="bg-primary-surface border border-border rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-secondary-text">
              <span className="font-metadata text-metadata font-medium">Overall Risk Level</span>
              <span className="material-symbols-outlined text-[20px] text-high-risk">report</span>
            </div>
            <div className="mt-2">
              <div className="font-kpi-value text-kpi-value text-high-risk flex items-center gap-2">
                {inv.riskLevel}
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-high-risk-bg text-high-risk">Critical</span>
              </div>
              <div className="font-metadata text-metadata text-secondary-text mt-0.5">Requires operational review</div>
            </div>
          </div>
        </section>

        {/* TWO-COLUMN WORKSPACE (65% Left / 35% Right) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Executive Summary */}
            <div className="bg-primary-surface border border-border rounded-xl p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-primary-accent text-[22px]">description</span>
                  <h2 className="font-section-heading text-section-heading text-primary-text">Executive Summary</h2>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-metadata text-metadata bg-subtle-surface text-secondary-text border border-border">
                  Illustrative analysis
                </span>
              </div>
              <p className="font-body text-body text-primary-text leading-relaxed">
                {inv.summary}
              </p>
              <div className="bg-subtle-surface border border-border rounded-xl p-4 flex flex-col gap-2">
                <span className="font-button-input text-button-input text-primary-text font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-primary-accent">lightbulb</span>
                  Key Takeaways:
                </span>
                <ul className="flex flex-col gap-2 text-primary-text font-body text-body pl-2">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-accent mt-2 shrink-0"></span>
                    <span><strong className="font-medium">Primary concern:</strong> Congestion at {inv.primaryEntity} with compounding berth queues.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-accent mt-2 shrink-0"></span>
                    <span><strong className="font-medium">Network exposure:</strong> Shipments travelling toward Rotterdam and secondary distribution hubs.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-accent mt-2 shrink-0"></span>
                    <span><strong className="font-medium">Decision priority:</strong> Verify current shipment status and compare alternative routing options.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Key Findings */}
            <div className="bg-primary-surface border border-border rounded-xl p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-accent text-[22px]">insights</span>
                  <h2 className="font-section-heading text-section-heading text-primary-text">Key Findings</h2>
                </div>
                <span className="font-metadata text-metadata text-muted-text">3 items identified</span>
              </div>
              <div className="flex flex-col divide-y divide-border">
                <div className="py-3 first:pt-0 last:pb-0 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-button-input text-button-input font-semibold text-primary-text">1. Port Congestion</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-high-risk-bg text-high-risk">High Severity</span>
                  </div>
                  <p className="font-body text-[13px] text-secondary-text">
                    Berth queue depth at Shanghai terminal gates has increased by 42%. Turnaround time currently averages 3.8 days vs standard 2.2 days.
                  </p>
                </div>
                <div className="py-3 first:pt-0 last:pb-0 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-button-input text-button-input font-semibold text-primary-text">2. Carrier Schedule Uncertainty</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-medium-risk-bg text-medium-risk">Medium Severity</span>
                  </div>
                  <p className="font-body text-[13px] text-secondary-text">
                    Carrier blank sailings and ad-hoc rotation changes have introduced +48 hours variance for Suez transit booking slots.
                  </p>
                </div>
                <div className="py-3 first:pt-0 last:pb-0 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-button-input text-button-input font-semibold text-primary-text">3. Secondary Hub Congestion Spillover</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-medium-risk-bg text-medium-risk">Medium Severity</span>
                  </div>
                  <p className="font-body text-[13px] text-secondary-text">
                    Singapore feeder terminals report yard utilization surpassing 88%, potentially impacting intermodal transshipment connections.
                  </p>
                </div>
              </div>
            </div>

            {/* Recommended Next Steps */}
            <div className="bg-primary-surface border border-border rounded-xl p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-accent text-[22px]">checklist</span>
                <h2 className="font-section-heading text-section-heading text-primary-text">Recommended Next Steps</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-subtle-surface border border-border flex flex-col justify-between">
                  <div>
                    <span className="font-button-input text-xs font-semibold text-primary-text block mb-1">1. Prioritize Cargo Reroute</span>
                    <p className="text-[12px] text-secondary-text">Evaluate alternative Southern Corridor via Cape of Good Hope for delayed consignments.</p>
                  </div>
                  <Link href="/routes/RTE-01" className="mt-3 text-[12px] text-primary-accent hover:underline font-medium">
                    Compare Routes →
                  </Link>
                </div>

                <div className="p-3 rounded-xl bg-subtle-surface border border-border flex flex-col justify-between">
                  <div>
                    <span className="font-button-input text-xs font-semibold text-primary-text block mb-1">2. Notify Consignees</span>
                    <p className="text-[12px] text-secondary-text">Issue proactive ETA revisions for 14 Tier-1 customer shipments arriving in Rotterdam.</p>
                  </div>
                  <Link href="/shipments" className="mt-3 text-[12px] text-primary-accent hover:underline font-medium">
                    View Shipments →
                  </Link>
                </div>

                <div className="p-3 rounded-xl bg-subtle-surface border border-border flex flex-col justify-between">
                  <div>
                    <span className="font-button-input text-xs font-semibold text-primary-text block mb-1">3. Configure Monitor</span>
                    <p className="text-[12px] text-secondary-text">Assign TinyFish Disruption Monitor agent to track berth telemetry hourly.</p>
                  </div>
                  <Link href="/agent-center" className="mt-3 text-[12px] text-primary-accent hover:underline font-medium">
                    Open Agent Center →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Related Entities */}
            <div className="bg-primary-surface border border-border rounded-xl p-5 flex flex-col gap-3">
              <h3 className="font-section-heading text-section-heading text-primary-text">Related Entities</h3>
              <div className="divide-y divide-border">
                <div className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-primary-accent">anchor</span>
                    <span className="text-[13px] font-medium text-primary-text">Shanghai Port</span>
                  </div>
                  <Link href="/ports/CNSHA" className="text-[12px] text-primary-accent hover:underline font-medium">
                    View Port
                  </Link>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-primary-accent">alt_route</span>
                    <span className="text-[13px] font-medium text-primary-text">Asia–Europe Corridor</span>
                  </div>
                  <Link href="/routes/RTE-01" className="text-[12px] text-primary-accent hover:underline font-medium">
                    View Route
                  </Link>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-primary-accent">inventory_2</span>
                    <span className="text-[13px] font-medium text-primary-text font-mono">SHP-10482</span>
                  </div>
                  <Link href="/shipments/SHP-10482" className="text-[12px] text-primary-accent hover:underline font-medium">
                    Inspect
                  </Link>
                </div>
              </div>
            </div>

            {/* Conversation Transcript & Follow-Up Composer */}
            <div className="bg-primary-surface border border-border rounded-xl p-5 flex flex-col justify-between min-h-[420px]">
              <div>
                <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-primary-accent">forum</span>
                    <h3 className="font-section-heading text-section-heading text-primary-text">Analyst Discussion</h3>
                  </div>
                  <span className="font-metadata text-[11px] text-muted-text">Interactive Demo</span>
                </div>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl text-[13px] leading-relaxed ${
                        m.role === "user"
                          ? "bg-soft-accent text-primary-text border border-primary-accent/20"
                          : "bg-subtle-surface text-primary-text border border-border"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] text-muted-text mb-1">
                        <span className="font-semibold text-primary-text">
                          {m.role === "user" ? "Sarah Chen" : "AI Analyst"}
                        </span>
                        <span>{m.time}</span>
                      </div>
                      <p>{m.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSend} className="mt-4 pt-3 border-t border-border flex items-center gap-2">
                <input
                  type="text"
                  value={followUp}
                  onChange={(e) => setFollowUp(e.target.value)}
                  placeholder="Ask a follow-up inquiry..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-border bg-subtle-surface text-primary-text placeholder:text-muted-text focus:outline-none focus:border-primary-accent"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-primary-accent text-on-primary hover:bg-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
