"use client";

import React, { useState } from "react";
import Link from "next/link";

export const AnalyticsView: React.FC = () => {
  const [dateRange, setDateRange] = useState("Last 30 days");
  const [region, setRegion] = useState("Global");
  const [comparePeriod, setComparePeriod] = useState(true);

  return (
    <div className="space-y-6">
      {/* Top Filter & Action Bar */}
      <section className="bg-primary-surface border border-border rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date Range Selector */}
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none pl-8 pr-7 py-1.5 rounded-xl border border-border bg-subtle-surface text-primary-text font-button-input text-xs cursor-pointer focus:outline-none focus:border-primary-accent"
            >
              <option value="Last 7 days">Last 7 days</option>
              <option value="Last 30 days">Last 30 days</option>
              <option value="Last 90 days">Last 90 days</option>
              <option value="Year to Date">Year to Date</option>
            </select>
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-secondary-text text-[16px] pointer-events-none">
              calendar_today
            </span>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-secondary-text text-[16px] pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Region Selector */}
          <div className="relative">
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="appearance-none pl-8 pr-7 py-1.5 rounded-xl border border-border bg-subtle-surface text-primary-text font-button-input text-xs cursor-pointer focus:outline-none focus:border-primary-accent"
            >
              <option value="Global">Region: Global</option>
              <option value="Asia-Pacific">Region: Asia-Pacific</option>
              <option value="Europe">Region: Europe</option>
              <option value="North America">Region: North America</option>
            </select>
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-secondary-text text-[16px] pointer-events-none">
              public
            </span>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-secondary-text text-[16px] pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Compare Toggle */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-subtle-surface text-secondary-text font-button-input text-xs">
            <span>Compare: <strong className="text-primary-text">Previous period</strong></span>
            <button
              onClick={() => setComparePeriod(!comparePeriod)}
              className={`w-8 h-4 rounded-full p-0.5 flex items-center transition-colors ${
                comparePeriod ? "bg-primary-accent justify-end" : "bg-border justify-start"
              }`}
            >
              <div className="w-3 h-3 bg-white rounded-full shadow-xs"></div>
            </button>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-border bg-primary-surface hover:bg-subtle-surface text-primary-text font-button-input text-xs font-semibold transition-colors self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-[16px] text-secondary-text">download</span>
          <span>Export report</span>
        </button>
      </section>

      {/* KPI SUMMARY CARDS (ROW OF 4) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-primary-surface border border-border rounded-xl p-4 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="font-body text-body text-secondary-text">On-Time Delivery</span>
            <div className="w-7 h-7 rounded-lg bg-soft-accent flex items-center justify-center text-primary-accent">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </div>
          </div>
          <div className="my-2">
            <div className="font-kpi-value text-kpi-value text-primary-text font-semibold">92.4%</div>
            <div className="font-body text-[13px] text-secondary-text mt-0.5">Delivery performance</div>
          </div>
          <div className="font-metadata text-metadata text-muted-text border-t border-border pt-2">
            Illustrative demo metric
          </div>
        </div>

        <div className="bg-primary-surface border border-border rounded-xl p-4 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="font-body text-body text-secondary-text">Average Delay</span>
            <div className="w-7 h-7 rounded-lg bg-subtle-surface flex items-center justify-center text-secondary-text">
              <span className="material-symbols-outlined text-[18px]">timer</span>
            </div>
          </div>
          <div className="my-2">
            <div className="font-kpi-value text-kpi-value text-primary-text font-semibold">18.6 hrs</div>
            <div className="font-body text-[13px] text-secondary-text mt-0.5">Across delayed shipments</div>
          </div>
          <div className="font-metadata text-metadata text-muted-text border-t border-border pt-2">
            Illustrative demo metric
          </div>
        </div>

        <div className="bg-primary-surface border border-border rounded-xl p-4 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="font-body text-body text-secondary-text">Disruption Events</span>
            <div className="w-7 h-7 rounded-lg bg-medium-risk-bg flex items-center justify-center text-medium-risk">
              <span className="material-symbols-outlined text-[18px]">warning</span>
            </div>
          </div>
          <div className="my-2">
            <div className="font-kpi-value text-kpi-value text-primary-text font-semibold">34</div>
            <div className="font-body text-[13px] text-secondary-text mt-0.5">Recorded in the selected period</div>
          </div>
          <div className="font-metadata text-metadata text-muted-text border-t border-border pt-2">
            Illustrative demo metric
          </div>
        </div>

        <div className="bg-primary-surface border border-border rounded-xl p-4 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="font-body text-body text-secondary-text">Shipments Affected</span>
            <div className="w-7 h-7 rounded-lg bg-soft-accent flex items-center justify-center text-primary-accent">
              <span className="material-symbols-outlined text-[18px]">inventory_2</span>
            </div>
          </div>
          <div className="my-2">
            <div className="font-kpi-value text-kpi-value text-primary-text font-semibold">216</div>
            <div className="font-body text-[13px] text-secondary-text mt-0.5">Linked to disruption events</div>
          </div>
          <div className="font-metadata text-metadata text-muted-text border-t border-border pt-2">
            Illustrative demo metric
          </div>
        </div>
      </section>

      {/* PRIMARY ANALYTICS CHARTS (Two-Column Row: 60% / 40%) */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        {/* Left: Shipment Performance Line Chart (7 cols) */}
        <div className="xl:col-span-7 bg-primary-surface border border-border rounded-xl p-5 flex flex-col justify-between shadow-2xs">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="font-section-heading text-section-heading font-semibold text-primary-text">Shipment Performance</h2>
              <p className="font-body text-[13px] text-secondary-text mt-0.5">Daily delivery outcomes over the selected period</p>
            </div>
            <div className="flex items-center gap-4 font-metadata text-metadata">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-primary-accent rounded-full inline-block"></span>
                <span className="text-primary-text font-medium">On-time delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-medium-risk rounded-full inline-block"></span>
                <span className="text-secondary-text">Delayed shipments</span>
              </div>
            </div>
          </div>

          <div className="relative w-full h-[260px] flex items-center">
            <svg className="w-full h-full overflow-visible" fill="none" preserveAspectRatio="none" viewBox="0 0 680 230">
              <defs>
                <linearGradient id="analyticsPrimaryGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#4263EB" stopOpacity="0.16" />
                  <stop offset="100%" stopColor="#4263EB" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <line stroke="#E6EAF0" strokeDasharray="3 3" strokeWidth="1" x1="45" x2="660" y1="20" y2="20" />
              <line stroke="#E6EAF0" strokeDasharray="3 3" strokeWidth="1" x1="45" x2="660" y1="65" y2="65" />
              <line stroke="#E6EAF0" strokeDasharray="3 3" strokeWidth="1" x1="45" x2="660" y1="110" y2="110" />
              <line stroke="#E6EAF0" strokeDasharray="3 3" strokeWidth="1" x1="45" x2="660" y1="155" y2="155" />
              <line stroke="#E6EAF0" strokeWidth="1" x1="45" x2="660" y1="200" y2="200" />

              <text fill="#8A93A3" fontFamily="Inter" fontSize="11" textAnchor="end" x="35" y="24">100%</text>
              <text fill="#8A93A3" fontFamily="Inter" fontSize="11" textAnchor="end" x="35" y="69">95%</text>
              <text fill="#8A93A3" fontFamily="Inter" fontSize="11" textAnchor="end" x="35" y="114">90%</text>
              <text fill="#8A93A3" fontFamily="Inter" fontSize="11" textAnchor="end" x="35" y="159">85%</text>
              <text fill="#8A93A3" fontFamily="Inter" fontSize="11" textAnchor="end" x="35" y="204">80%</text>

              <path d="M 60 75 Q 120 70 170 82 T 280 62 T 390 90 T 500 88 T 610 68 T 660 72 L 660 200 L 60 200 Z" fill="url(#analyticsPrimaryGradient)" />
              <path d="M 60 75 Q 120 70 170 82 T 280 62 T 390 90 T 500 88 T 610 68 T 660 72" fill="none" stroke="#4263EB" strokeLinecap="round" strokeWidth="2.5" />
              <path d="M 60 170 Q 120 175 170 168 T 280 180 T 390 162 T 500 164 T 610 178 T 660 174" fill="none" stroke="#B7791F" strokeDasharray="3 2" strokeLinecap="round" strokeWidth="2" />

              <line opacity="0.6" stroke="#4263EB" strokeDasharray="2 2" strokeWidth="1.5" x1="500" x2="500" y1="20" y2="200" />
              <circle cx="500" cy="88" fill="#4263EB" r="4.5" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="500" cy="164" fill="#B7791F" r="4" stroke="#FFFFFF" strokeWidth="2" />

              <text fill="#8A93A3" fontFamily="Inter" fontSize="11" textAnchor="middle" x="60" y="218">Oct 1</text>
              <text fill="#8A93A3" fontFamily="Inter" fontSize="11" textAnchor="middle" x="170" y="218">Oct 7</text>
              <text fill="#8A93A3" fontFamily="Inter" fontSize="11" textAnchor="middle" x="280" y="218">Oct 14</text>
              <text fill="#8A93A3" fontFamily="Inter" fontSize="11" textAnchor="middle" x="390" y="218">Oct 21</text>
              <text fill="#172033" fontFamily="Inter" fontSize="11" fontWeight="600" textAnchor="middle" x="500" y="218">Oct 22</text>
              <text fill="#8A93A3" fontFamily="Inter" fontSize="11" textAnchor="middle" x="610" y="218">Oct 28</text>
              <text fill="#8A93A3" fontFamily="Inter" fontSize="11" textAnchor="middle" x="660" y="218">Oct 30</text>
            </svg>

            <div className="absolute right-[22%] top-6 bg-primary-surface border border-strong-border rounded-lg shadow-sm p-2.5 z-10 pointer-events-none w-44">
              <div className="font-metadata text-metadata font-semibold text-primary-text mb-1.5 flex items-center justify-between">
                <span>Oct 22, 2026</span>
                <span className="text-muted-text text-[10px]">Daily report</span>
              </div>
              <div className="flex items-center justify-between font-metadata text-metadata">
                <span className="flex items-center gap-1.5 text-secondary-text">
                  <span className="w-2 h-2 rounded-full bg-primary-accent"></span>
                  On-Time:
                </span>
                <span className="font-button-input text-primary-text font-semibold">91.8%</span>
              </div>
              <div className="flex items-center justify-between font-metadata text-metadata mt-1">
                <span className="flex items-center gap-1.5 text-secondary-text">
                  <span className="w-2 h-2 rounded-full bg-medium-risk"></span>
                  Delayed:
                </span>
                <span className="font-button-input text-primary-text font-semibold">8.2%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Disruption Breakdown Donut Chart (5 cols) */}
        <div className="xl:col-span-5 bg-primary-surface border border-border rounded-xl p-5 flex flex-col justify-between shadow-2xs">
          <div>
            <h2 className="font-section-heading text-section-heading font-semibold text-primary-text">Disruption Breakdown</h2>
            <p className="font-body text-[13px] text-secondary-text mt-0.5">Events grouped by primary cause</p>
          </div>

          <div className="my-auto py-2 flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 140 140">
                <circle cx="70" cy="70" fill="transparent" r="48" stroke="#4263EB" strokeDasharray="124.3 301.6" strokeDashoffset="0" strokeWidth="16" />
                <circle cx="70" cy="70" fill="transparent" r="48" stroke="#B7791F" strokeDasharray="70.9 301.6" strokeDashoffset="-124.3" strokeWidth="16" />
                <circle cx="70" cy="70" fill="transparent" r="48" stroke="#5C7CFA" strokeDasharray="62.1 301.6" strokeDashoffset="-195.2" strokeWidth="16" />
                <circle cx="70" cy="70" fill="transparent" r="48" stroke="#91A7FF" strokeDasharray="44.3 301.6" strokeDashoffset="-257.3" strokeWidth="16" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-kpi-value text-[24px] font-bold text-primary-text leading-none">34</span>
                <span className="text-[11px] text-muted-text mt-0.5">Total events</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4263EB]"></span>
                <span className="text-secondary-text">Port Congestion:</span>
                <span className="font-semibold text-primary-text">41.2%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B7791F]"></span>
                <span className="text-secondary-text">Severe Weather:</span>
                <span className="font-semibold text-primary-text">23.5%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5C7CFA]"></span>
                <span className="text-secondary-text">Carrier Delays:</span>
                <span className="font-semibold text-primary-text">20.6%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#91A7FF]"></span>
                <span className="text-secondary-text">Route Restrictions:</span>
                <span className="font-semibold text-primary-text">14.7%</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-text">
            <span>Primary driver: Terminal yard congestion</span>
            <Link href="/risk-intelligence" className="text-primary-accent font-semibold hover:underline">
              View Risk Register →
            </Link>
          </div>
        </div>
      </section>

      {/* SECONDARY ROW: RISK BY REGION & KEY INSIGHTS */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        {/* Risk by Region (6 cols) */}
        <div className="xl:col-span-6 bg-primary-surface border border-border rounded-xl p-5 flex flex-col justify-between shadow-2xs">
          <div className="border-b border-border pb-3 mb-4">
            <h3 className="font-section-heading text-section-heading font-semibold text-primary-text">Risk Exposure by Region</h3>
            <p className="font-body text-[13px] text-secondary-text mt-0.5">Weighted composite risk across active operational corridors</p>
          </div>

          <div className="space-y-4">
            {[
              { region: "Asia-Pacific", score: 76, level: "HIGH", color: "bg-high-risk text-high-risk" },
              { region: "Middle East & Red Sea", score: 82, level: "HIGH", color: "bg-high-risk text-high-risk" },
              { region: "Northern Europe", score: 48, level: "MEDIUM", color: "bg-medium-risk text-medium-risk" },
              { region: "North America (Transpacific)", score: 38, level: "LOW", color: "bg-success text-success" },
            ].map((reg, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-primary-text">{reg.region}</span>
                  <span className={reg.color}>{reg.score} / 100 ({reg.level})</span>
                </div>
                <div className="w-full h-2 rounded-full bg-subtle-surface overflow-hidden border border-border">
                  <div
                    className={`h-full rounded-full ${
                      reg.level === "HIGH" ? "bg-high-risk" : reg.level === "MEDIUM" ? "bg-medium-risk" : "bg-success"
                    }`}
                    style={{ width: `${reg.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-border mt-4 flex items-center justify-between text-xs text-secondary-text">
            <span>Data refreshed continuously via AIS telemetry</span>
            <Link href="/ports-routes" className="text-primary-accent hover:underline font-semibold">
              Explore Network Map →
            </Link>
          </div>
        </div>

        {/* Key Operational Insights Card (6 cols) */}
        <div className="xl:col-span-6 bg-primary-surface border border-border rounded-xl p-5 flex flex-col justify-between shadow-2xs">
          <div className="border-b border-border pb-3 mb-4">
            <h3 className="font-section-heading text-section-heading font-semibold text-primary-text">Autonomous Operational Insights</h3>
            <p className="font-body text-[13px] text-secondary-text mt-0.5">Synthesized by NEXUS AI Analyst from live risk deltas</p>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-subtle-surface border border-border flex items-start gap-3">
              <span className="material-symbols-outlined text-high-risk text-[20px] shrink-0 mt-0.5">crisis_alert</span>
              <div>
                <h4 className="text-xs font-semibold text-primary-text">Shanghai Berth Dwell Compounding</h4>
                <p className="text-[12px] text-secondary-text mt-0.5">
                  Berth waiting times at Shanghai terminal have surged to 18 hours. 32 consignments are facing downstream delay penalties.
                </p>
                <Link href="/ports/CNSHA" className="text-[11px] text-primary-accent hover:underline font-semibold mt-1 inline-block">
                  Inspect Shanghai Port →
                </Link>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-subtle-surface border border-border flex items-start gap-3">
              <span className="material-symbols-outlined text-primary-accent text-[20px] shrink-0 mt-0.5">alt_route</span>
              <div>
                <h4 className="text-xs font-semibold text-primary-text">Cape Route Viability Confirmed</h4>
                <p className="text-[12px] text-secondary-text mt-0.5">
                  Southern Corridor circumnavigation provides higher reliability (+8h buffer) vs Red Sea transit risks for high-value cargo.
                </p>
                <Link href="/routes/RTE-01" className="text-[11px] text-primary-accent hover:underline font-semibold mt-1 inline-block">
                  Compare Alternatives →
                </Link>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-subtle-surface border border-border flex items-start gap-3">
              <span className="material-symbols-outlined text-success text-[20px] shrink-0 mt-0.5">check_circle</span>
              <div>
                <h4 className="text-xs font-semibold text-primary-text">Panama Neo-Panamax Draft Normalized</h4>
                <p className="text-[12px] text-secondary-text mt-0.5">
                  Gatun Lake water levels have recovered to 50.0 ft. Transit slot queues have cleared for transpacific container vessels.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border mt-4 flex items-center justify-between text-xs">
            <span className="text-muted-text">Audited by AI Analyst • Demo data</span>
            <Link href="/ai-analyst" className="text-primary-accent hover:underline font-semibold">
              Open AI Analyst Workspace →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
