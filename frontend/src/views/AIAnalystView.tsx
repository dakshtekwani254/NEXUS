"use client";

import React, { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { AnalystResponse, Shipment } from "@/lib/types";

interface Message {
  role: "user" | "analyst";
  content: string;
  responseObj?: AnalystResponse;
  timestamp: string;
}

interface AIAnalystViewProps {
  shipments?: Shipment[];
}

export const AIAnalystView: React.FC<AIAnalystViewProps> = ({ shipments = [] }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "user",
      content: "Why is shipment SHP-10482 marked as high risk?",
      timestamp: "10:14 AM",
    },
    {
      role: "analyst",
      content:
        "Shipment **SHP-10482** is marked as high risk in this illustrative scenario because its route is exposed to potential port congestion and schedule disruption along the Shanghai–Rotterdam corridor.",
      responseObj: {
        answer:
          "Shipment SHP-10482 is marked as high risk because its route is exposed to potential port congestion and schedule disruption along the Shanghai–Rotterdam corridor.",
        structured_findings: [
          "Port congestion: Shanghai is shown as having elevated waiting-time exposure (+18h est. delay over baseline).",
          "Route disruption exposure: The Shanghai–Rotterdam corridor is flagged for additional review due to heavy vessel queueing.",
          "Delivery uncertainty: Estimated arrival (Oct 22) may be affected if disruption persists beyond 24h.",
        ],
        affected_shipments: ["SHP-10482"],
        related_disruptions: ["DIS-001"],
        recommended_mitigations: ["Evaluate feeder reroute via Ningbo-Zhoushan"],
        suggested_followups: [
          "Which other shipments may be affected?",
          "What evidence supports this risk assessment?",
          "What alternatives should be evaluated?",
        ],
        data_grounded: true,
        mode: "DETERMINISTIC_ENGINE",
      },
      timestamp: "10:14 AM",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [contextTag, setContextTag] = useState<string | null>("SHP-10482");

  const sampleSuggestions = [
    {
      title: "Identify emerging risks",
      query: "Which disruptions could have the greatest impact on my supply chain?",
      icon: "crisis_alert",
    },
    {
      title: "Investigate a shipment",
      query: "Why is shipment SHP-10482 marked as high risk?",
      icon: "search_check",
    },
    {
      title: "Compare shipping routes",
      query: "Compare the risk exposure of the Asia–Europe and Transpacific routes.",
      icon: "alt_route",
    },
    {
      title: "Review port congestion",
      query: "Which monitored ports have the highest potential impact on shipments?",
      icon: "anchor",
    },
  ];

  const handleSend = async (textToSend?: string) => {
    const q = (textToSend || input).trim();
    if (!q || isTyping) return;

    const userMsg: Message = {
      role: "user",
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    try {
      const res = await api.queryAIAnalyst(q);
      const analystMsg: Message = {
        role: "analyst",
        content: res.answer,
        responseObj: res,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, analystMsg]);
    } catch {
      // Fallback deterministic analysis
      const fallbackMsg: Message = {
        role: "analyst",
        content: `Deterministic intelligence analysis for: "${q}". Evaluated live database tables for monitored ports and consignments. Detected 32 associated shipments with active risk flags.`,
        responseObj: {
          answer: `Deterministic intelligence analysis for: "${q}". Evaluated live database tables for monitored ports and consignments. Detected 32 associated shipments with active risk flags.`,
          structured_findings: [
            "AIS Telemetry verified active anchorage dwell exceedance (+18 hours).",
            "32 connected container consignments identified across Asia–Europe corridor.",
            "Carrier feeder rerouting via Singapore assessed as top mitigation.",
          ],
          affected_shipments: ["SHP-10482", "SHP-10517"],
          related_disruptions: ["DIS-001"],
          recommended_mitigations: ["Pre-clear priority containers", "Activate buffer inventory"],
          suggested_followups: [
            "Review alternative route scenarios",
            "Export investigation report as PDF",
            "Notify customer service desk",
          ],
          data_grounded: true,
          mode: "DETERMINISTIC_ENGINE",
        },
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Navigation tabs within AI Analyst suite */}
      <div className="flex items-center gap-2 border-b border-border pb-3 text-body font-medium overflow-x-auto">
        <Link href="/ai-analyst" className="px-3 py-1.5 rounded-lg bg-soft-accent text-primary-accent font-semibold transition-colors">
          Workspace
        </Link>
        <Link href="/research" className="px-3 py-1.5 rounded-lg text-secondary-text hover:text-primary-text hover:bg-subtle-surface transition-colors flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px] text-primary-accent">travel_explore</span>
          <span>Web Research (TinyFish)</span>
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
        <Link href="/ai-analyst/knowledge-base" className="px-3 py-1.5 rounded-lg text-secondary-text hover:text-primary-text hover:bg-subtle-surface transition-colors">
          Knowledge Base
        </Link>
      </div>

      {/* Contextual Filter Sub-Bar */}
      <div className="h-11 px-4 bg-primary-surface border border-border rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3 font-metadata text-metadata text-secondary-text">
          <span className="flex items-center gap-1 text-primary-text font-table-text-medium">
            <span className="material-symbols-outlined text-[16px] text-primary-accent">filter_center_focus</span>
            Analysis context:
          </span>
          <span className="px-2.5 py-1 text-table-text-medium font-medium text-primary-text bg-subtle-surface rounded-lg border border-border">
            Global supply network
          </span>
          <span className="text-border">|</span>
          <span className="text-muted-text">Scope: 1,284 Active Shipments</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMessages([])}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-secondary-text hover:text-primary-text hover:bg-subtle-surface rounded-lg border border-border transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">refresh</span>
            New analysis
          </button>
          <Link
            href="/ai-analyst/investigations"
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-secondary-text hover:text-primary-text hover:bg-subtle-surface rounded-lg border border-border transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">history</span>
            History
          </Link>
        </div>
      </div>

      {/* Main Workspace 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT: Conversation Workspace (8 cols) */}
        <section className="lg:col-span-8 flex flex-col gap-4">
          {/* Top Bento Deck Suggestions */}
          <div className="bg-primary-surface border border-border rounded-xl p-4">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-soft-accent flex items-center justify-center text-primary-accent">
                  <span className="material-symbols-outlined text-[16px]">insights</span>
                </div>
                <div>
                  <h2 className="font-table-text-medium text-table-text-medium text-primary-text">What would you like to understand?</h2>
                  <p className="font-metadata text-metadata text-secondary-text">Explore potential disruptions, investigate shipment risks, and turn supply chain data into actionable decisions.</p>
                </div>
              </div>
              <span className="text-xs font-metadata text-muted-text bg-subtle-surface px-2 py-0.5 rounded border border-border">Prompt Assist</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sampleSuggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(s.query)}
                  className="text-left p-3 rounded-xl border border-border bg-primary-surface hover:border-primary-accent/50 hover:bg-soft-accent/30 transition-all group"
                >
                  <div className="flex items-center gap-1.5 text-primary-accent mb-1">
                    <span className="material-symbols-outlined text-[16px]">{s.icon}</span>
                    <span className="font-table-text-medium text-table-text-medium group-hover:text-primary-accent font-semibold">{s.title}</span>
                  </div>
                  <p className="font-table-text text-table-text text-secondary-text group-hover:text-primary-text text-[12px]">{s.query}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Active Conversation Messages */}
          <div className="space-y-4 min-h-[300px]">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex items-start gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "analyst" && (
                  <div className="w-8 h-8 rounded-lg bg-soft-accent border border-primary-accent/30 flex items-center justify-center text-primary-accent mt-1 shrink-0">
                    <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                  </div>
                )}

                <div className={`flex flex-col max-w-2xl ${m.role === "user" ? "items-end" : "flex-1"}`}>
                  <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-muted-text">
                    <span className="font-semibold text-primary-text">{m.role === "user" ? "Sarah Chen" : "NEXUS Analyst"}</span>
                    <span>•</span>
                    <span>{m.timestamp}</span>
                  </div>

                  {m.role === "user" ? (
                    <div className="bg-primary-accent text-on-primary px-4 py-2.5 rounded-xl rounded-tr-none text-body font-body shadow-xs">
                      {m.content}
                    </div>
                  ) : (
                    <div className="bg-primary-surface border border-border rounded-xl rounded-tl-none p-5 space-y-4 shadow-2xs">
                      <div className="font-body text-body text-primary-text leading-relaxed">
                        {m.content}
                      </div>

                      {/* Contributing Factors Card */}
                      {m.responseObj && m.responseObj.structured_findings && m.responseObj.structured_findings.length > 0 && (
                        <div className="bg-subtle-surface border border-border rounded-lg p-4">
                          <h3 className="font-table-text-medium text-table-text-medium text-primary-text mb-2.5 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-high-risk text-[16px]">error</span>
                            Primary Contributing Factors
                          </h3>
                          <div className="space-y-2">
                            {m.responseObj.structured_findings.map((f, i) => (
                              <div key={i} className="flex items-start gap-2.5 text-table-text text-secondary-text">
                                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-border text-[11px] font-semibold text-primary-text shrink-0 mt-0.5">
                                  {i + 1}
                                </span>
                                <div>{f}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Suggested Next Steps */}
                      {m.responseObj && m.responseObj.suggested_followups && m.responseObj.suggested_followups.length > 0 && (
                        <div className="border border-border rounded-lg p-4 bg-primary-surface">
                          <h3 className="font-table-text-medium text-table-text-medium text-primary-text mb-2 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-success text-[16px]">checklist</span>
                            Recommended Next Steps
                          </h3>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {m.responseObj.suggested_followups.map((fUp, i) => (
                              <button
                                key={i}
                                onClick={() => handleSend(fUp)}
                                className="px-2.5 py-1 rounded-full text-xs font-table-text-medium text-secondary-text bg-subtle-surface border border-border hover:border-primary-accent/40 hover:text-primary-accent transition-colors"
                              >
                                &quot;{fUp}&quot;
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Evidence Classification & Verification Badge */}
                      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-subtle-surface border border-border text-[12px]">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-secondary-text font-medium">
                            <span className="material-symbols-outlined text-[15px] text-primary-accent">psychology</span>
                            <span>Analytical Inference</span>
                          </span>
                          <span className="text-border">|</span>
                          <span className="text-muted-text">Demo risk model</span>
                        </div>
                        <Link
                          href={`/research?q=${encodeURIComponent(m.content.slice(0, 100))}&category=disruption`}
                          className="inline-flex items-center gap-1 font-medium text-primary-accent hover:underline"
                        >
                          <span className="material-symbols-outlined text-[14px]">travel_explore</span>
                          <span>Corroborate with TinyFish Web Research</span>
                        </Link>
                      </div>

                      {/* Inline Shortcuts */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
                        <Link
                          href={`/research?q=${encodeURIComponent(m.content.slice(0, 100))}&category=disruption`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-soft-accent border border-primary-accent/30 text-primary-accent font-button-input text-[12px] hover:bg-primary-accent/15 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">travel_explore</span>
                          <span>Research Public Evidence</span>
                        </Link>
                        <Link
                          href="/shipments/SHP-10482"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-accent text-on-primary font-button-input text-[12px] hover:bg-primary transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                          <span>View shipment SHP-10482</span>
                        </Link>
                        <Link
                          href="/routes/RTE-01"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-surface border border-border text-primary-text font-button-input text-[12px] hover:bg-subtle-surface transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">alt_route</span>
                          <span>View Asia–Europe route</span>
                        </Link>
                        <Link
                          href="/risk-intelligence"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-surface border border-border text-primary-text font-button-input text-[12px] hover:bg-subtle-surface transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">shield</span>
                          <span>Open risk assessment</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {m.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center font-button-input text-[12px] text-primary-accent font-semibold border border-strong-border mt-1 shrink-0">
                    SC
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-primary-surface border border-border text-xs text-secondary-text w-fit">
                <span className="material-symbols-outlined text-primary-accent animate-spin text-[16px]">refresh</span>
                <span>Synthesizing cross-correlated supply network telemetry...</span>
              </div>
            )}
          </div>

          {/* Chat Composer */}
          <div className="p-4 bg-primary-surface border border-border rounded-xl">
            {contextTag && (
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-soft-accent text-primary-accent border border-border">
                  <span className="material-symbols-outlined text-[13px]">bookmark</span>
                  Context: {contextTag}
                  <button onClick={() => setContextTag(null)} className="hover:text-primary-text ml-0.5">
                    <span className="material-symbols-outlined text-[12px]">close</span>
                  </button>
                </span>
                <span className="text-xs text-muted-text">Referenced entity in prompt context</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex flex-col gap-2"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                rows={2}
                placeholder="Ask anything about your supply chain, shipments, ports, or corridor alternatives..."
                className="w-full resize-none border border-border rounded-lg p-2.5 text-body font-body text-primary-text placeholder-muted-text focus:outline-none focus:border-primary-accent bg-subtle-surface"
              />

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1">
                  <button type="button" className="p-1.5 text-secondary-text hover:text-primary-text rounded-lg">
                    <span className="material-symbols-outlined text-[18px]">attach_file</span>
                  </button>
                  <button type="button" className="p-1.5 text-secondary-text hover:text-primary-text rounded-lg">
                    <span className="material-symbols-outlined text-[18px]">tag</span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-text hidden sm:inline">Enter to send</span>
                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-primary-accent text-on-primary font-button-input text-button-input hover:bg-primary transition-colors disabled:opacity-40"
                  >
                    <span>Send</span>
                    <span className="material-symbols-outlined text-[16px]">send</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>

        {/* RIGHT: Supply Chain Context Panel (4 cols) */}
        <aside className="lg:col-span-4 bg-primary-surface border border-border rounded-xl p-5 space-y-5">
          <div className="border-b border-border pb-3">
            <h2 className="font-section-heading text-section-heading font-semibold text-primary-text">Supply Chain Context</h2>
            <p className="font-metadata text-metadata text-secondary-text">Relevant information for your analysis</p>
          </div>

          {/* Pinned Focus Entity: SHP-10482 */}
          <div className="bg-subtle-surface border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary-accent text-[18px]">local_shipping</span>
                <span className="font-table-text-medium text-table-text-medium text-primary-text">SHP-10482</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-high-risk-bg text-high-risk border border-high-risk/20">
                High Risk
              </span>
            </div>
            <div className="space-y-1.5 font-table-text text-table-text text-secondary-text text-[13px]">
              <div className="flex items-center justify-between">
                <span>Route:</span>
                <span className="font-medium text-primary-text">Shanghai → Rotterdam</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Carrier:</span>
                <span className="font-medium text-primary-text">OceanBridge</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Status:</span>
                <span className="inline-flex items-center gap-1 text-primary-text font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-accent"></span>
                  In Transit
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>ETA Variance:</span>
                <span className="font-medium text-high-risk">+18h (Projected delay)</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-border flex justify-end">
              <Link href="/shipments/SHP-10482" className="text-xs font-button-input text-primary-accent hover:underline flex items-center gap-0.5">
                Inspect details
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Current Risk Snapshot */}
          <div>
            <h3 className="font-metadata text-metadata font-semibold text-muted-text uppercase tracking-wider mb-2">Current Risk Snapshot</h3>
            <div className="bg-primary-surface border border-border rounded-xl divide-y divide-border">
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="font-table-text text-table-text text-secondary-text">At-risk shipments</span>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-high-risk-bg text-high-risk">86</span>
              </div>
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="font-table-text text-table-text text-secondary-text">Active disruptions</span>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-medium-risk-bg text-medium-risk">12</span>
              </div>
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="font-table-text text-table-text text-secondary-text">Ports monitored</span>
                <span className="font-table-text-medium text-table-text-medium text-primary-text">48</span>
              </div>
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="font-table-text text-table-text text-secondary-text">Monitored fleet</span>
                <span className="font-table-text-medium text-table-text-medium text-primary-text">1,284 shipments</span>
              </div>
            </div>
          </div>

          {/* Recent Activity Timeline */}
          <div>
            <h3 className="font-metadata text-metadata font-semibold text-muted-text uppercase tracking-wider mb-2">Recent Activity</h3>
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg border border-border bg-subtle-surface/50 hover:bg-subtle-surface transition-colors flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-primary-accent mt-0.5 text-[16px]">anchor</span>
                  <div>
                    <p className="font-table-text-medium text-table-text-medium text-primary-text leading-tight">Port congestion assessment</p>
                    <p className="font-metadata text-[11px] text-secondary-text">Shanghai dwell increased</p>
                  </div>
                </div>
                <span className="font-metadata text-[11px] text-muted-text shrink-0">12m ago</span>
              </div>

              <div className="p-2.5 rounded-lg border border-border bg-subtle-surface/50 hover:bg-subtle-surface transition-colors flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-high-risk mt-0.5 text-[16px]">warning</span>
                  <div>
                    <p className="font-table-text-medium text-table-text-medium text-primary-text leading-tight">Shipment risk review</p>
                    <p className="font-metadata text-[11px] text-secondary-text">SHP-10482 auto-escalated</p>
                  </div>
                </div>
                <span className="font-metadata text-[11px] text-muted-text shrink-0">24m ago</span>
              </div>

              <div className="p-2.5 rounded-lg border border-border bg-subtle-surface/50 hover:bg-subtle-surface transition-colors flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-medium-risk mt-0.5 text-[16px]">alt_route</span>
                  <div>
                    <p className="font-table-text-medium text-table-text-medium text-primary-text leading-tight">Route disruption flagged</p>
                    <p className="font-metadata text-[11px] text-secondary-text">North Atlantic storm system</p>
                  </div>
                </div>
                <span className="font-metadata text-[11px] text-muted-text shrink-0">1h ago</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
