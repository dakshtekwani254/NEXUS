"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { DEMO_ROUTES, DEMO_SHIPMENTS } from "@/lib/demoData";

export default function RouteDetailPage() {
  const params = useParams();
  const routeId = typeof params?.routeId === "string" ? params.routeId : "RTE-01";

  const route = DEMO_ROUTES.find(
    (r) => r.id.toLowerCase() === routeId.toLowerCase() || r.name.toLowerCase().includes(routeId.toLowerCase())
  ) || DEMO_ROUTES[0];

  const shipmentsOnRoute = DEMO_SHIPMENTS.filter((s) => s.route === route.name || (s.origin === route.origin && s.destination === route.destination));

  return (
    <AppShell
      title={route.name}
      subtitle="Understand route conditions, transit-time risk, and potential alternatives."
      actions={
        <div className="flex items-center gap-2">
          <Link
            href={`/research?route=${encodeURIComponent(route.name)}&q=${encodeURIComponent(`${route.name} shipping corridor weather delays and carrier rerouting`)}&category=route`}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary-accent text-on-primary font-button-input text-button-input hover:bg-primary transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-[18px]">travel_explore</span>
            <span>Research Corridor</span>
          </Link>
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-primary-surface hover:bg-subtle-surface text-primary-text font-button-input text-button-input transition-colors">
            <span className="material-symbols-outlined text-[18px]">compare_arrows</span>
            <span>Compare Alternatives</span>
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-primary-surface hover:bg-subtle-surface text-primary-text font-button-input text-button-input transition-colors">
            <span className="material-symbols-outlined text-[18px]">add_alert</span>
            <span>Create Alert</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Compact Metadata Strip */}
        <section className="bg-primary-surface rounded-xl border border-border p-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <div className="flex flex-col">
              <span className="font-metadata text-metadata text-secondary-text">Origin</span>
              <span className="font-table-text-medium text-table-text-medium text-primary-text mt-0.5 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary-accent">flight_takeoff</span>
                {route.origin}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-metadata text-metadata text-secondary-text">Destination</span>
              <span className="font-table-text-medium text-table-text-medium text-primary-text mt-0.5 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-success">flag</span>
                {route.destination}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-metadata text-metadata text-secondary-text">Transport Mode</span>
              <span className="font-table-text-medium text-table-text-medium text-primary-text mt-0.5 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-secondary-text">directions_boat</span>
                Ocean Freight
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-metadata text-metadata text-secondary-text">Route ID</span>
              <span className="font-table-text-medium text-table-text-medium text-primary-text mt-0.5 font-mono">
                {route.id}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-metadata text-metadata text-secondary-text">Monitoring Status</span>
              <span className="font-table-text-medium text-table-text-medium text-medium-risk mt-0.5 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-medium-risk"></span>
                Demo data
              </span>
            </div>
          </div>
        </section>

        {/* 4 KPI CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-primary-surface rounded-xl border border-border p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-secondary-text">
              <span className="font-metadata text-metadata font-medium">Route Risk</span>
              <div className="w-8 h-8 rounded-lg bg-high-risk-bg flex items-center justify-center text-high-risk">
                <span className="material-symbols-outlined text-[18px]">warning</span>
              </div>
            </div>
            <div className="my-2">
              <div className="font-kpi-value text-kpi-value text-high-risk tracking-tight">High</div>
            </div>
            <div className="flex items-center justify-between text-muted-text font-metadata text-metadata border-t border-border pt-2">
              <span>Elevated transit &amp; dwell exposure</span>
              <span className="font-mono text-[11px] text-high-risk font-medium">Score 76</span>
            </div>
          </div>

          <div className="bg-primary-surface rounded-xl border border-border p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-secondary-text">
              <span className="font-metadata text-metadata font-medium">Estimated Transit Time</span>
              <div className="w-8 h-8 rounded-lg bg-subtle-surface flex items-center justify-center text-primary-accent">
                <span className="material-symbols-outlined text-[18px]">schedule</span>
              </div>
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <div className="font-kpi-value text-kpi-value text-primary-text tracking-tight">{route.transitEstimate}</div>
              <span className="font-table-text-medium text-[12px] text-high-risk font-medium">+2 days vs typical</span>
            </div>
            <div className="flex items-center justify-between text-muted-text font-metadata text-metadata border-t border-border pt-2">
              <span>Illustrative estimate</span>
              <span className="text-secondary-text">Base: 26d</span>
            </div>
          </div>

          <div className="bg-primary-surface rounded-xl border border-border p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-secondary-text">
              <span className="font-metadata text-metadata font-medium">Shipments on Route</span>
              <div className="w-8 h-8 rounded-lg bg-subtle-surface flex items-center justify-center text-secondary-text">
                <span className="material-symbols-outlined text-[18px]">inventory_2</span>
              </div>
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <div className="font-kpi-value text-kpi-value text-primary-text tracking-tight">{route.affectedShipments}</div>
              <span className="font-table-text-medium text-[12px] text-secondary-text">Active vessels</span>
            </div>
            <div className="flex items-center justify-between text-muted-text font-metadata text-metadata border-t border-border pt-2">
              <span>Illustrative shipment count</span>
              <span className="text-primary-accent font-medium">4 delayed</span>
            </div>
          </div>

          <div className="bg-primary-surface rounded-xl border border-border p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-secondary-text">
              <span className="font-metadata text-metadata font-medium">Active Risk Factors</span>
              <div className="w-8 h-8 rounded-lg bg-medium-risk-bg flex items-center justify-center text-medium-risk">
                <span className="material-symbols-outlined text-[18px]">report</span>
              </div>
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <div className="font-kpi-value text-kpi-value text-primary-text tracking-tight">3</div>
              <span className="font-table-text-medium text-[12px] text-medium-risk font-medium">1 High, 2 Med</span>
            </div>
            <div className="flex items-center justify-between text-muted-text font-metadata text-metadata border-t border-border pt-2">
              <span>Illustrative assessment</span>
              <span className="text-secondary-text">Active monitoring</span>
            </div>
          </div>
        </section>

        {/* ROUTE MAP & ROUTE INFORMATION (Two-Column) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT: Route Map Canvas (8 cols) */}
          <div className="lg:col-span-8 bg-primary-surface rounded-xl border border-border p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-primary-accent">map</span>
                  <h2 className="font-section-heading text-section-heading text-primary-text">Route Overview</h2>
                </div>
                <span className="font-metadata text-metadata px-2 py-0.5 rounded bg-subtle-surface text-secondary-text border border-border">
                  Live AIS Tracked Corridor
                </span>
              </div>
              <p className="font-metadata text-metadata text-secondary-text">
                Maritime transit corridor from {route.origin} to {route.destination}
              </p>
            </div>

            <div className="relative my-4 w-full h-[320px] bg-[#F4F6F9] rounded-xl border border-border overflow-hidden flex items-center justify-center select-none">
              <svg className="absolute inset-0 w-full h-full text-slate-200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern height="32" id="grid-pattern-route" patternUnits="userSpaceOnUse" width="32">
                    <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#E6EAF0" strokeWidth="0.75" />
                  </pattern>
                  <linearGradient id="route-gradient-detail" x1="0%" x2="100%" y1="100%" y2="0%">
                    <stop offset="0%" stopColor="#4263EB" />
                    <stop offset="60%" stopColor="#D94F4F" />
                    <stop offset="100%" stopColor="#4263EB" />
                  </linearGradient>
                </defs>
                <rect fill="url(#grid-pattern-route)" height="100%" width="100%" />

                {/* Continental outlines */}
                <path d="M 120 70 Q 150 60 180 80 T 230 110 L 220 140 Q 170 150 140 120 Z" fill="#EAEFF5" stroke="#D5DBE5" strokeWidth="1" />
                <path d="M 200 150 Q 250 160 270 210 T 260 290 L 190 280 Q 170 200 200 150 Z" fill="#EAEFF5" stroke="#D5DBE5" strokeWidth="1" />
                <path d="M 400 90 Q 520 80 620 120 T 700 200 L 640 260 Q 500 230 430 170 Z" fill="#EAEFF5" stroke="#D5DBE5" strokeWidth="1" />
                <path d="M 420 150 L 470 210 L 410 240 Z" fill="#EAEFF5" stroke="#D5DBE5" strokeWidth="1" />

                {/* Route Path */}
                <path d="M 640 155 C 570 190, 530 225, 490 235 C 410 255, 340 230, 280 195 C 260 180, 245 160, 235 142 C 220 125, 175 130, 140 135 C 130 115, 145 95, 165 80" fill="none" stroke="url(#route-gradient-detail)" strokeDasharray="6 4" strokeLinecap="round" strokeWidth="3" />

                {/* Congestion auras */}
                <circle cx="640" cy="155" fill="#FCECEC" fillOpacity="0.8" r="28" stroke="#D94F4F" strokeDasharray="3 3" strokeWidth="1" />
                <circle cx="240" cy="145" fill="#FFF4D6" fillOpacity="0.7" r="20" stroke="#B7791F" strokeDasharray="3 3" strokeWidth="1" />

                {/* Waypoints */}
                <circle cx="490" cy="235" fill="#4263EB" r="3.5" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="360" cy="235" fill="#4263EB" r="3.5" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="280" cy="195" fill="#4263EB" r="3.5" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="140" cy="135" fill="#4263EB" r="3.5" stroke="#FFFFFF" strokeWidth="1.5" />

                {/* Origin Marker */}
                <g transform="translate(640, 155)">
                  <circle cx="0" cy="0" fill="#4263EB" r="6" stroke="#FFFFFF" strokeWidth="2" />
                  <rect fill="#172033" fillOpacity="0.9" height="20" rx="4" width="70" x="-35" y="-28" />
                  <text fill="#FFFFFF" fontFamily="Inter" fontSize="10" fontWeight="500" textAnchor="middle" x="0" y="-14">{route.origin}</text>
                </g>

                {/* Destination Marker */}
                <g transform="translate(165, 80)">
                  <circle cx="0" cy="0" fill="#268568" r="6" stroke="#FFFFFF" strokeWidth="2" />
                  <rect fill="#172033" fillOpacity="0.9" height="20" rx="4" width="84" x="-42" y="-28" />
                  <text fill="#FFFFFF" fontFamily="Inter" fontSize="10" fontWeight="500" textAnchor="middle" x="0" y="-14">{route.destination}</text>
                </g>
              </svg>

              <div className="absolute top-3 left-3 bg-primary-surface/95 backdrop-blur-xs border border-border rounded-lg p-2.5 shadow-xs text-[11px] font-metadata flex flex-col gap-1.5">
                <span className="font-semibold text-primary-text">Map Legend</span>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-accent"></span>
                  <span className="text-secondary-text">Origin: {route.origin}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-success"></span>
                  <span className="text-secondary-text">Destination: {route.destination}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-high-risk-bg border border-high-risk"></span>
                  <span className="text-secondary-text">High Congestion Zone</span>
                </div>
              </div>
            </div>

            <div className="bg-subtle-surface border border-border rounded-xl p-3 flex flex-wrap items-center justify-between text-secondary-text font-metadata text-metadata gap-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-primary-accent">hub</span>
                <span><strong>Primary Nodes:</strong> {route.origin} • Singapore • Suez • {route.destination}</span>
              </div>
              <div className="flex items-center gap-4">
                <span><strong>Distance:</strong> ~10,500 nm</span>
                <span className="text-border">|</span>
                <span><strong>Typical Speed:</strong> 18.2 kts</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Route Information (4 cols) */}
          <div className="lg:col-span-4 bg-primary-surface rounded-xl border border-border p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-primary-accent">info</span>
                  <h2 className="font-section-heading text-section-heading text-primary-text">Route Information</h2>
                </div>
                <span className="font-metadata text-metadata text-muted-text">Details</span>
              </div>

              <div className="divide-y divide-border text-table-text">
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-secondary-text">Route Name</span>
                  <span className="font-table-text-medium text-primary-text">{route.name}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-secondary-text">Origin Port</span>
                  <span className="font-table-text-medium text-primary-text">{route.origin}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-secondary-text">Destination Port</span>
                  <span className="font-table-text-medium text-primary-text">{route.destination}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-secondary-text">Transport Mode</span>
                  <span className="font-table-text-medium text-primary-text">Ocean Freight (Container)</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-secondary-text">Typical Transit Time</span>
                  <span className="font-table-text-medium text-primary-text">26 days</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-secondary-text">Current Transit Estimate</span>
                  <span className="font-table-text-medium text-high-risk font-semibold">{route.transitEstimate} (+2d)</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-secondary-text">Monitoring Status</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-medium-risk-bg text-medium-risk">
                    Under review
                  </span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-secondary-text">Assessment Type</span>
                  <span className="font-metadata text-metadata text-muted-text">Illustrative demo assessment</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-medium-risk-bg/40 border border-medium-risk/20 rounded-xl flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[18px] text-medium-risk shrink-0 mt-0.5">report_problem</span>
              <p className="font-metadata text-metadata text-secondary-text leading-relaxed">
                <strong className="text-primary-text">Operational Notice:</strong> Potential port congestion and schedule uncertainty may affect the estimated transit window.
              </p>
            </div>
          </div>
        </section>

        {/* ROUTE RISK ASSESSMENT & CONTRIBUTING FACTORS */}
        <section className="bg-primary-surface rounded-xl border border-border p-5 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-high-risk">security</span>
                <h2 className="font-section-heading text-section-heading text-primary-text">Route Risk Assessment</h2>
              </div>
              <p className="font-metadata text-metadata text-secondary-text mt-0.5">
                Comprehensive weighted index factoring terminal congestion, carrier variability, and waterway dwell times.
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5 min-w-[280px]">
              <div className="flex items-center justify-between w-full text-[12px] font-metadata">
                <span className="text-secondary-text">Overall Risk Score:</span>
                <span className="font-bold text-high-risk">High (76 / 100)</span>
              </div>
              <div className="w-full h-3 bg-subtle-surface rounded-full overflow-hidden flex relative border border-border">
                <div className="h-full bg-success/30 w-[40%]"></div>
                <div className="h-full bg-medium-risk/30 w-[30%]"></div>
                <div className="h-full bg-high-risk/30 w-[30%]"></div>
                <div className="absolute top-0 bottom-0 w-1.5 bg-high-risk shadow-xs" style={{ left: "76%" }}></div>
              </div>
              <div className="flex justify-between w-full text-[10px] font-mono text-muted-text">
                <span>0 (Low)</span>
                <span>40</span>
                <span>70</span>
                <span>100 (High)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-border p-4 bg-subtle-surface/50 hover:bg-subtle-surface transition-colors flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-high-risk">anchor</span>
                    <span className="font-table-text-medium text-table-text-medium text-primary-text font-semibold">Port Congestion</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-high-risk-bg text-high-risk">High</span>
                </div>
                <div className="text-[12px] text-muted-text font-metadata mb-2">Location: <span className="text-primary-text font-medium">Shanghai Port</span></div>
                <p className="font-body text-secondary-text text-[13px] leading-relaxed">
                  Potential congestion may increase cargo handling or departure delays. Berth wait times currently up +36 hours.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border">
                <Link className="font-button-input text-[13px] text-primary-accent hover:underline inline-flex items-center gap-1" href="/ports/CNSHA">
                  View Shanghai Port Details →
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-border p-4 bg-subtle-surface/50 hover:bg-subtle-surface transition-colors flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-medium-risk">event_busy</span>
                    <span className="font-table-text-medium text-table-text-medium text-primary-text font-semibold">Schedule Uncertainty</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-medium-risk-bg text-medium-risk">Medium</span>
                </div>
                <div className="text-[12px] text-muted-text font-metadata mb-2">Location: <span className="text-primary-text font-medium">{route.name}</span></div>
                <p className="font-body text-secondary-text text-[13px] leading-relaxed">
                  Changes to carrier schedules and blank sailings may affect planned arrival dates at intermediate bunkering hubs.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border">
                <Link className="font-button-input text-[13px] text-primary-accent hover:underline inline-flex items-center gap-1" href="/alerts">
                  Review Schedule Feed →
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-border p-4 bg-subtle-surface/50 hover:bg-subtle-surface transition-colors flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-medium-risk">warehouse</span>
                    <span className="font-table-text-medium text-table-text-medium text-primary-text font-semibold">Destination Port Conditions</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-medium-risk-bg text-medium-risk">Medium</span>
                </div>
                <div className="text-[12px] text-muted-text font-metadata mb-2">Location: <span className="text-primary-text font-medium">{route.destination} Port</span></div>
                <p className="font-body text-secondary-text text-[13px] leading-relaxed">
                  Destination handling conditions and inland barge availability may contribute to arrival or unloading uncertainty.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border">
                <Link className="font-button-input text-[13px] text-primary-accent hover:underline inline-flex items-center gap-1" href="/ports/NLRTM">
                  View Rotterdam Port Details →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ALTERNATIVE ROUTE COMPARISON */}
        <section className="bg-primary-surface rounded-xl border border-border p-5 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary-accent">alt_route</span>
                <h2 className="font-section-heading text-section-heading text-primary-text">Alternative Routes</h2>
              </div>
              <p className="font-metadata text-metadata text-secondary-text">
                Compare illustrative route scenarios before making operational decisions.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-subtle-surface/70 border-b border-border text-secondary-text font-table-text-medium text-table-text-medium">
                  <th className="py-3 px-4">Route Option</th>
                  <th className="py-3 px-4">Transit Estimate</th>
                  <th className="py-3 px-4">Risk Level</th>
                  <th className="py-3 px-4">Potential Delay</th>
                  <th className="py-3 px-4">Relative Cost</th>
                  <th className="py-3 px-4">Recommendation</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-table-text">
                <tr className="bg-soft-accent/30 hover:bg-soft-accent/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2 font-table-text-medium text-primary-text">
                      <span className="font-semibold">{route.name}</span>
                      <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-primary-accent text-on-primary">Current</span>
                    </div>
                    <span className="text-[11px] text-muted-text">Via Suez Canal / Red Sea Corridor</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-primary-text">{route.transitEstimate}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-high-risk-bg text-high-risk">High</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-high-risk font-medium">+18 hours</td>
                  <td className="py-3.5 px-4 text-secondary-text">Baseline</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-primary-accent/10 text-primary-accent border border-primary-accent/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-accent"></span>
                      Current route
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-muted-text text-[13px] font-metadata font-medium">Selected</span>
                  </td>
                </tr>

                <tr className="hover:bg-subtle-surface transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-table-text-medium text-primary-text font-medium">Alternative Northern Corridor</div>
                    <span className="text-[11px] text-muted-text">Via Intermodal Transshipment</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-primary-text">30 days</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-medium-risk-bg text-medium-risk">Medium</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-medium-risk font-medium">+8 hours</td>
                  <td className="py-3.5 px-4 text-secondary-text">Higher (+12%)</td>
                  <td className="py-3.5 px-4 text-secondary-text">
                    <span>Review alternative</span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="font-button-input text-[13px] text-primary-accent hover:underline inline-flex items-center gap-1">
                      Evaluate Corridor →
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-subtle-surface transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-table-text-medium text-primary-text font-medium">Alternative Southern Corridor (via Cape)</div>
                    <span className="text-[11px] text-muted-text">Circumnavigating Cape of Good Hope</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-primary-text">29 days</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-medium-risk-bg text-medium-risk">Medium</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-medium-risk font-medium">+10 hours</td>
                  <td className="py-3.5 px-4 text-secondary-text">Higher (+18%)</td>
                  <td className="py-3.5 px-4 text-secondary-text">
                    <span>Review alternative</span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="font-button-input text-[13px] text-primary-accent hover:underline inline-flex items-center gap-1">
                      Evaluate Corridor →
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SHIPMENTS ON THIS ROUTE */}
        <section className="bg-primary-surface rounded-xl border border-border p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary-accent">inventory_2</span>
                <h2 className="font-section-heading text-section-heading text-primary-text">Shipments on This Route</h2>
              </div>
              <p className="font-metadata text-metadata text-secondary-text">
                Illustrative consignments currently assigned to or scheduled along this corridor.
              </p>
            </div>
            <Link className="font-button-input text-[13px] text-primary-accent hover:underline inline-flex items-center gap-1" href="/shipments">
              View All Shipments ({route.affectedShipments}) →
            </Link>
          </div>

          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-subtle-surface/70 border-b border-border text-secondary-text font-table-text-medium text-table-text-medium">
                  <th className="py-3 px-4">Shipment ID</th>
                  <th className="py-3 px-4">Origin</th>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">Estimated Arrival</th>
                  <th className="py-3 px-4">Risk</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-table-text">
                {(shipmentsOnRoute.length > 0 ? shipmentsOnRoute : DEMO_SHIPMENTS.slice(0, 4)).map((s) => (
                  <tr key={s.id} className="hover:bg-subtle-surface transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-primary-accent">
                      <Link href={`/shipments/${s.id}`}>{s.id}</Link>
                    </td>
                    <td className="py-3.5 px-4">{s.origin}</td>
                    <td className="py-3.5 px-4">{s.destination}</td>
                    <td className="py-3.5 px-4 font-mono">{s.eta}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                        s.riskLevel === "HIGH" ? "bg-high-risk-bg text-high-risk" : s.riskLevel === "MEDIUM" ? "bg-medium-risk-bg text-medium-risk" : "bg-success-bg text-success"
                      }`}>
                        {s.riskLevel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 text-primary-text text-[13px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-accent"></span>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link className="text-secondary-text hover:text-primary-accent text-[13px] font-button-input" href={`/shipments/${s.id}`}>
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
