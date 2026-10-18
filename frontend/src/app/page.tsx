"use client";

import React from "react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-app-background text-primary-text font-sans antialiased selection:bg-soft-accent selection:text-primary-accent flex flex-col">
      {/* 1. SLIM GLOBAL NAVIGATION */}
      <header className="sticky top-0 z-50 bg-primary-surface/95 backdrop-blur-md border-b border-border transition-colors duration-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          {/* Left: Brand Identity */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-soft-accent border border-primary-accent/20 flex items-center justify-center text-primary-accent">
              <span className="material-symbols-outlined text-[20px]">hub</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[18px] font-bold tracking-tight text-primary-text">NEXUS</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-accent" />
              </div>
              <span className="text-[9px] uppercase tracking-wider font-semibold text-muted-text -mt-1">
                SUPPLY CHAIN INTELLIGENCE
              </span>
            </div>
          </Link>

          {/* Center: Nav links */}
          <nav className="hidden md:flex items-center space-x-8">
            <a className="text-[14px] text-secondary-text hover:text-primary-text transition-colors duration-150" href="#platform">
              Platform
            </a>
            <a className="text-[14px] text-secondary-text hover:text-primary-text transition-colors duration-150" href="#capabilities">
              Capabilities
            </a>
            <a className="text-[14px] text-secondary-text hover:text-primary-text transition-colors duration-150" href="#how-it-works">
              How It Works
            </a>
            <a className="text-[14px] text-secondary-text hover:text-primary-text transition-colors duration-150" href="#principles">
              Principles
            </a>
          </nav>

          {/* Right: Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-[14px] font-medium text-secondary-text hover:text-primary-text px-3 py-2 transition-colors duration-150"
            >
              Log in
            </Link>
            <Link
              href="/overview"
              className="inline-flex items-center justify-center text-[14px] font-medium text-white bg-primary-accent hover:bg-primary transition-colors duration-150 px-4 py-2 rounded-xl shadow-xs"
            >
              Launch Platform
            </Link>
          </div>
        </div>
      </header>

      {/* 2. UNIQUE SIGNATURE HERO */}
      <section className="relative pt-12 pb-20 md:py-24 overflow-hidden border-b border-border bg-app-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left 58% Content */}
            <div className="lg:col-span-7 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-soft-accent border border-primary-accent/20 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-accent animate-ping" />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-primary-accent">
                  SUPPLY CHAIN INTELLIGENCE, REIMAGINED
                </span>
                <span className="text-[11px] text-muted-text border-l border-primary-accent/30 pl-2">
                  Demo Environment
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-primary-text tracking-tight leading-[1.12]">
                The world is connected.<br />
                <span className="text-primary-text">So is its </span>
                <span className="text-primary-accent relative inline-block">
                  risk.
                  <svg className="absolute -bottom-1 left-0 w-full h-2 text-primary-accent/30" preserveAspectRatio="none" viewBox="0 0 100 10">
                    <path d="M0 5 Q 50 10, 100 5" fill="none" stroke="currentColor" strokeWidth="3" />
                  </svg>
                </span>
              </h1>

              <p className="text-[16px] text-secondary-text leading-relaxed max-w-xl mt-6 mb-8">
                See disruptions take shape across ports, routes, and shipments. Understand what they could affect—and decide what to do next.
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Link
                  href="/overview"
                  className="inline-flex items-center justify-center font-medium text-[14px] text-white bg-primary-accent hover:bg-primary px-6 py-3 rounded-xl shadow-xs transition-all duration-150"
                >
                  Explore NEXUS
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 font-medium text-[14px] text-primary-text hover:text-primary-accent px-4 py-3 transition-colors duration-150"
                >
                  <span>See how it works</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </a>
              </div>

              <div className="mt-8 pt-6 border-t border-border flex items-center gap-3">
                <span className="material-symbols-outlined text-[16px] text-muted-text">linear_scale</span>
                <span className="text-[12px] text-muted-text font-medium">
                  Visibility → Context → Informed action
                </span>
              </div>
            </div>

            {/* Right Visual: Network Topology Layer */}
            <div className="lg:col-span-5 relative w-full h-[460px] md:h-[520px] flex items-center justify-center">
              {/* Vector Network Map Canvas */}
              <div className="relative w-full h-full bg-primary-surface rounded-xl border border-border p-4 shadow-sm overflow-hidden flex flex-col justify-between">
                {/* Map Top Bar Indicators */}
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-semibold tracking-wider text-primary-text uppercase">
                      NETWORK STATUS
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-text bg-subtle-surface px-2 py-0.5 rounded-lg border border-border">
                    Illustrative Demo Feed
                  </span>
                </div>

                {/* SVG Graph Visualization */}
                <div className="relative flex-1 w-full flex items-center justify-center my-2">
                  <svg className="w-full h-full" fill="none" viewBox="0 0 460 300" xmlns="http://www.w3.org/2000/svg">
                    {/* Abstract pale land masses */}
                    <path d="M40 70 C70 60, 110 80, 130 110 C150 140, 120 180, 80 190 C50 200, 30 150, 40 70 Z" fill="#F3F5F8" stroke="#E6EAF0" strokeWidth="1" />
                    <path d="M190 50 C240 40, 310 60, 330 90 C340 110, 300 140, 260 130 C220 120, 200 160, 170 140 C150 120, 160 70, 190 50 Z" fill="#F3F5F8" stroke="#E6EAF0" strokeWidth="1" />
                    <path d="M330 130 C370 120, 420 140, 430 180 C440 210, 400 240, 360 230 C330 220, 310 160, 330 130 Z" fill="#F3F5F8" stroke="#E6EAF0" strokeWidth="1" />

                    {/* Curved Shipping Arcs */}
                    {/* Shanghai (340, 150) to Rotterdam (220, 80) */}
                    <path d="M340 150 C290 100, 260 85, 220 80" stroke="#94A3B8" strokeDasharray="4 3" strokeWidth="1.75" />
                    {/* Shanghai (340, 150) to Singapore (315, 215) */}
                    <path d="M340 150 C330 180, 325 195, 315 215" stroke="#4263EB" strokeWidth="2" />
                    {/* Rotterdam (220, 80) to Los Angeles (80, 110) */}
                    <path d="M220 80 C160 50, 120 70, 80 110" stroke="#94A3B8" strokeDasharray="4 3" strokeWidth="1.75" />
                    {/* Weather Warning Region Arc on North Atlantic */}
                    <path d="M150 67 C170 63, 190 70, 195 73" stroke="#B7791F" strokeLinecap="round" strokeWidth="3" />

                    {/* Network Nodes */}
                    {/* Los Angeles */}
                    <circle cx="80" cy="110" fill="#FFFFFF" r="5" stroke="#172033" strokeWidth="2" />
                    <text fill="#667085" fontSize="10" fontWeight="500" textAnchor="middle" x="80" y="128">Los Angeles</text>

                    {/* Rotterdam */}
                    <circle cx="220" cy="80" fill="#FFFFFF" r="5" stroke="#172033" strokeWidth="2" />
                    <text fill="#667085" fontSize="10" fontWeight="500" textAnchor="middle" x="220" y="98">Rotterdam</text>

                    {/* Singapore */}
                    <circle cx="315" cy="215" fill="#FFFFFF" r="5" stroke="#172033" strokeWidth="2" />
                    <text fill="#667085" fontSize="10" fontWeight="500" textAnchor="middle" x="315" y="233">Singapore</text>

                    {/* Shanghai Node (Focal Point with Ping) */}
                    <circle className="animate-ping" cx="340" cy="150" fill="#EEF2FF" r="14" opacity="0.75" />
                    <circle cx="340" cy="150" fill="#4263EB" opacity="0.2" r="8" />
                    <circle cx="340" cy="150" fill="#D94F4F" r="5" stroke="#FFFFFF" strokeWidth="1.5" />
                    <text fill="#172033" fontSize="10" fontWeight="600" textAnchor="middle" x="340" y="140">Shanghai Port</text>
                  </svg>

                  {/* Floating Micro Badge 1: Weather Exposure */}
                  <div className="absolute top-8 left-16 bg-primary-surface/95 border border-medium-risk/30 rounded-lg px-2.5 py-1 text-left shadow-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-medium-risk" />
                      <span className="text-[10px] font-semibold text-medium-risk uppercase">Weather Alert</span>
                    </div>
                    <span className="text-[11px] font-medium text-primary-text block mt-0.5">North Atlantic Route</span>
                  </div>

                  {/* Floating Micro Badge 2: Shanghai Congestion */}
                  <div className="absolute bottom-10 right-4 bg-primary-surface border border-high-risk/30 rounded-lg p-2 text-left shadow-xs max-w-[190px]">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-bold text-high-risk uppercase tracking-wide">Elevated Risk</span>
                      <span className="px-1.5 py-0.2 bg-high-risk-bg text-high-risk rounded text-[9px] font-semibold">Berth Delay</span>
                    </div>
                    <p className="text-[11px] font-medium text-primary-text leading-tight">32 active shipments bound for Rotterdam &amp; Antwerp</p>
                  </div>
                </div>

                {/* Lower Map Summary Bar */}
                <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-secondary-text">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-primary-accent">route</span>
                    Asia–Europe Corridor
                  </span>
                  <span className="font-medium text-primary-text">4 Disruption Signals Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRANSITION / 3-STEP PROCESS */}
      <section className="py-16 md:py-20 bg-primary-surface border-b border-border" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-[22px] md:text-[24px] font-semibold text-primary-text tracking-tight">
              One connected view. Better-informed decisions.
            </h2>
            <p className="text-[14px] text-secondary-text mt-2">
              From first detection to orchestrated response, eliminate the blind spots between enterprise supply network tiers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-6 rounded-xl border border-border bg-subtle-surface/50 hover:bg-subtle-surface transition-colors duration-150">
              <div className="w-9 h-9 rounded-xl bg-soft-accent text-primary-accent flex items-center justify-center font-bold text-sm mb-5">
                01
              </div>
              <h3 className="text-[16px] font-semibold text-primary-text mb-2">Detect</h3>
              <p className="text-[14px] text-secondary-text leading-relaxed">
                Identify emerging disruptions across global ports, maritime trade routes, and in-transit multi-modal shipments.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-xl border border-border bg-subtle-surface/50 hover:bg-subtle-surface transition-colors duration-150">
              <div className="w-9 h-9 rounded-xl bg-soft-accent text-primary-accent flex items-center justify-center font-bold text-sm mb-5">
                02
              </div>
              <h3 className="text-[16px] font-semibold text-primary-text mb-2">Connect</h3>
              <p className="text-[14px] text-secondary-text leading-relaxed">
                Understand how a local event cascaded across dependencies, affecting inventory allocations and delivery timelines.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-xl border border-border bg-subtle-surface/50 hover:bg-subtle-surface transition-colors duration-150">
              <div className="w-9 h-9 rounded-xl bg-soft-accent text-primary-accent flex items-center justify-center font-bold text-sm mb-5">
                03
              </div>
              <h3 className="text-[16px] font-semibold text-primary-text mb-2">Respond</h3>
              <p className="text-[14px] text-secondary-text leading-relaxed">
                Investigate exposure scenarios, model alternative shipping lanes, and evaluate verified next steps in real time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CAPABILITIES SECTION (Asymmetrical authentic UI previews) */}
      <section className="py-20 bg-app-background border-b border-border" id="capabilities">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-[12px] uppercase tracking-wider font-semibold text-primary-accent">CORE ARCHITECTURE</span>
            <h2 className="text-[32px] font-bold text-primary-text tracking-tight mt-1 mb-3">
              From scattered signals to a clearer picture.
            </h2>
            <p className="text-[15px] text-secondary-text">
              Bring supply-chain visibility, operational risk assessment, and contextual investigation into one synchronized workspace.
            </p>
          </div>

          {/* Asymmetrical 4-Card Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Capability 1: Risk Intelligence (7 cols) */}
            <div className="lg:col-span-7 bg-primary-surface rounded-xl border border-border p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-primary-accent text-[20px]">warning</span>
                  <h3 className="text-[16px] font-semibold text-primary-text">Risk Intelligence</h3>
                </div>
                <p className="text-[14px] text-secondary-text mb-6">
                  Surface emerging threats across your geographic footprint and examine their potential cascading impact on manufacturing cycles.
                </p>
              </div>

              {/* UI Matrix Preview */}
              <div className="bg-subtle-surface rounded-lg border border-border p-4">
                <div className="flex items-center justify-between pb-3 border-b border-border text-[11px] font-semibold text-secondary-text">
                  <span>ACTIVE RISK SURFACES</span>
                  <span>CONFIDENCE: HIGH (94%)</span>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-3">
                  <div className="bg-primary-surface p-3 rounded-lg border border-border">
                    <span className="text-[12px] text-muted-text block">Port Berth Delays</span>
                    <span className="text-high-risk text-[18px] font-bold">14 Ports</span>
                    <span className="text-[11px] text-high-risk flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-[13px]">arrow_upward</span> +3 this week
                    </span>
                  </div>
                  <div className="bg-primary-surface p-3 rounded-lg border border-border">
                    <span className="text-[12px] text-muted-text block">Geopolitical / Straits</span>
                    <span className="text-medium-risk text-[18px] font-bold">2 Corridors</span>
                    <span className="text-[11px] text-medium-risk flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-[13px]">remove</span> Stable monitoring
                    </span>
                  </div>
                  <div className="bg-primary-surface p-3 rounded-lg border border-border">
                    <span className="text-[12px] text-muted-text block">Labor Action Watch</span>
                    <span className="text-success text-[18px] font-bold">0 Critical</span>
                    <span className="text-[11px] text-success flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-[13px]">check_circle</span> Normal operations
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Capability 2: Ports & Routes (5 cols) */}
            <div className="lg:col-span-5 bg-primary-surface rounded-xl border border-border p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-primary-accent text-[20px]">anchor</span>
                  <h3 className="text-[16px] font-semibold text-primary-text">Ports &amp; Routes</h3>
                </div>
                <p className="text-[14px] text-secondary-text mb-6">
                  Explore vessel queues, choke point exposure, and maritime disruption velocity before departures lock in.
                </p>
              </div>

              {/* Corridor Mini Status */}
              <div className="bg-subtle-surface rounded-lg border border-border p-3 space-y-2">
                <div className="flex items-center justify-between text-xs p-2 bg-primary-surface rounded border border-border">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-high-risk" />
                    <span className="font-medium text-primary-text">East China Sea Choke</span>
                  </div>
                  <span className="text-[11px] text-high-risk font-medium bg-high-risk-bg px-1.5 py-0.5 rounded">Congested</span>
                </div>
                <div className="flex items-center justify-between text-xs p-2 bg-primary-surface rounded border border-border">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-medium-risk" />
                    <span className="font-medium text-primary-text">Suez Transit Channel</span>
                  </div>
                  <span className="text-[11px] text-medium-risk font-medium bg-medium-risk-bg px-1.5 py-0.5 rounded">Moderate Queues</span>
                </div>
                <div className="flex items-center justify-between text-xs p-2 bg-primary-surface rounded border border-border">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success" />
                    <span className="font-medium text-primary-text">Trans-Pacific Northern</span>
                  </div>
                  <span className="text-[11px] text-success font-medium bg-success-bg px-1.5 py-0.5 rounded">Nominal Flow</span>
                </div>
              </div>
            </div>

            {/* Capability 3: Shipment Visibility (6 cols) */}
            <div className="lg:col-span-6 bg-primary-surface rounded-xl border border-border p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-primary-accent text-[20px]">local_shipping</span>
                  <h3 className="text-[16px] font-semibold text-primary-text">Shipment Visibility</h3>
                </div>
                <p className="text-[14px] text-secondary-text mb-6">
                  Follow cargo container status, dynamic estimated arrivals, and customs milestones with pinpoint precision.
                </p>
              </div>

              {/* Mini Shipments Table */}
              <div className="border border-border rounded-lg overflow-hidden bg-primary-surface">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-subtle-surface border-b border-border text-[11px] font-semibold text-secondary-text">
                      <th className="py-2.5 px-3">TRACKING ID</th>
                      <th className="py-2.5 px-3">DESTINATION</th>
                      <th className="py-2.5 px-3">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-[12px]">
                    <tr className="hover:bg-subtle-surface/50 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-medium text-primary-text">SHP-10482</td>
                      <td className="py-2.5 px-3 text-secondary-text">Rotterdam Hub</td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-high-risk-bg text-high-risk">
                          +34h Delay
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-subtle-surface/50 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-medium text-primary-text">SHP-10844</td>
                      <td className="py-2.5 px-3 text-secondary-text">Shanghai Yangshan</td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-success-bg text-success">
                          On Schedule
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Capability 4: AI Analyst (6 cols) */}
            <div className="lg:col-span-6 bg-primary-surface rounded-xl border border-border p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-primary-accent text-[20px]">smart_toy</span>
                  <h3 className="text-[16px] font-semibold text-primary-text">AI Analyst</h3>
                </div>
                <p className="text-[14px] text-secondary-text mb-6">
                  Investigate incidents, evaluate mitigation trade-offs, and synthesize operational briefings in seconds.
                </p>
              </div>

              {/* Prompt Response Interactivity Sample */}
              <div className="bg-subtle-surface rounded-lg border border-border p-3 text-xs space-y-2.5">
                <div className="flex items-start gap-2 bg-primary-surface p-2.5 rounded-lg border border-border">
                  <span className="material-symbols-outlined text-secondary-text text-[16px] shrink-0 mt-0.5">person</span>
                  <p className="text-primary-text font-medium">&quot;What is our critical path risk if Shanghai port delays extend past 72 hours?&quot;</p>
                </div>
                <div className="flex items-start gap-2 bg-soft-accent/60 p-2.5 rounded-lg border border-primary-accent/20">
                  <span className="material-symbols-outlined text-primary-accent text-[16px] shrink-0 mt-0.5">psychology</span>
                  <p className="text-secondary-text text-[11px] leading-relaxed">
                    <span className="font-semibold text-primary-text">Impact Analysis:</span> 3 Tier-1 auto assembly plants run below safety stock by Thursday. Recommended rerouting: 8 containers via Ningbo feeder lane.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRODUCT SHOWCASE SECTION */}
      <section className="py-20 bg-subtle-surface border-b border-border" id="platform">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-[12px] uppercase tracking-wider font-semibold text-primary-accent">SYSTEM ARCHITECTURE IN PRACTICE</span>
            <h2 className="text-[32px] md:text-[36px] font-bold text-primary-text tracking-tight mt-1 mb-4">
              Understand the impact—not just the incident.
            </h2>
            <p className="text-[16px] text-secondary-text leading-relaxed">
              A delay at one port can ripple across an entire corridor. NEXUS connects raw disruption signals directly to downstream manufacturing lines and client commitments.
            </p>
          </div>

          {/* Main Showcase Container */}
          <div className="bg-primary-surface rounded-xl border border-border shadow-xs p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left: Corridor & Route Visualization Canvas */}
              <div className="lg:col-span-7 bg-subtle-surface rounded-xl border border-border p-5 relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary-accent text-[18px]">travel_explore</span>
                    <span className="text-[13px] text-primary-text font-semibold">East Asia to Western Europe Lane</span>
                  </div>
                  <span className="text-[11px] bg-primary-surface text-secondary-text px-2 py-0.5 rounded border border-border">
                    Active Telemetry
                  </span>
                </div>

                {/* Route Graph SVG */}
                <div className="relative w-full h-[280px] bg-primary-surface rounded-lg border border-border flex items-center justify-center p-2">
                  <svg className="w-full h-full" fill="none" viewBox="0 0 500 240">
                    {/* Grid dots */}
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1" fill="#E6EAF0" />
                    </pattern>
                    <rect width="500" height="240" fill="url(#grid)" />

                    {/* Primary Route Lane (Shanghai -> Singapore -> Suez -> Rotterdam) */}
                    <path d="M420 180 Q300 190 230 140 T80 60" stroke="#CBD5E1" strokeDasharray="6 4" strokeWidth="3" />
                    {/* Diverging Mitigation Lane */}
                    <path d="M420 180 Q280 230 160 180 T80 60" stroke="#4263EB" strokeWidth="2" />

                    {/* Nodes */}
                    {/* Shanghai Node */}
                    <circle cx="420" cy="180" r="8" fill="#D94F4F" />
                    <circle cx="420" cy="180" r="16" fill="#FCECEC" opacity="0.6" />
                    <text fill="#172033" fontSize="11" fontWeight="600" textAnchor="middle" x="420" y="210">Shanghai (Origin)</text>

                    {/* Singapore Waypoint */}
                    <circle cx="290" cy="170" r="5" fill="#172033" />
                    <text fill="#667085" fontSize="10" fontWeight="500" textAnchor="middle" x="290" y="155">Singapore Hub</text>

                    {/* Suez Choke Point */}
                    <circle cx="190" cy="115" r="5" fill="#B7791F" />
                    <text fill="#B7791F" fontSize="10" fontWeight="500" textAnchor="middle" x="190" y="100">Suez Checkpoint</text>

                    {/* Rotterdam Port */}
                    <circle cx="80" cy="60" r="7" fill="#4263EB" />
                    <text fill="#172033" fontSize="11" fontWeight="600" textAnchor="middle" x="80" y="45">Rotterdam (Target)</text>
                  </svg>

                  <div className="absolute bottom-3 left-3 bg-primary-surface/90 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-border text-[11px] text-secondary-text shadow-xs">
                    <span className="inline-block w-2.5 h-0.5 bg-[#4263EB] mr-1.5 align-middle" />
                    Proposed alternate reroute via Cape lane (+10d, avoids Suez security)
                  </div>
                </div>

                {/* Operational Telemetry Indicators */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-primary-surface p-3 rounded-lg border border-border">
                    <span className="text-[11px] text-muted-text font-medium block">Average Vessel Dwell Time</span>
                    <span className="text-base font-semibold text-primary-text">
                      4.8 Days <span className="text-xs text-high-risk font-normal">(+38% vs norm)</span>
                    </span>
                  </div>
                  <div className="bg-primary-surface p-3 rounded-lg border border-border">
                    <span className="text-[11px] text-muted-text font-medium block">Berth Availability</span>
                    <span className="text-base font-semibold text-primary-text">32% Operating Cap</span>
                  </div>
                </div>
              </div>

              {/* Right: Concrete Impact Summary Card */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-high-risk bg-high-risk-bg px-2 py-0.5 rounded">
                      Incident Analysis
                    </span>
                    <span className="text-xs text-muted-text">Updated 12 mins ago</span>
                  </div>
                  <h4 className="text-[18px] font-bold text-primary-text mt-4 mb-2">
                    Shanghai Berth Congestion &amp; Weather Hold
                  </h4>
                  <p className="text-[14px] text-secondary-text mb-5 leading-relaxed">
                    Force 9-10 gale winds and seasonal maintenance backlog have created an 84-hour berthing delay impacting the Asia-Europe Maritime Corridor.
                  </p>

                  {/* Structural Breakdown Items */}
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg border border-border bg-subtle-surface/60 flex items-start justify-between">
                      <div>
                        <span className="text-[11px] font-semibold text-muted-text uppercase block">Exposed Shipments</span>
                        <span className="text-sm font-semibold text-primary-text">32 In-Transit Shipments</span>
                      </div>
                      <span className="material-symbols-outlined text-high-risk text-[20px]">inventory_2</span>
                    </div>

                    <div className="p-3 rounded-lg border border-border bg-subtle-surface/60 flex items-start justify-between">
                      <div>
                        <span className="text-[11px] font-semibold text-muted-text uppercase block">Estimated Delay Impact</span>
                        <span className="text-sm font-semibold text-primary-text">+34 Hours Projected SLA Slippage</span>
                      </div>
                      <span className="material-symbols-outlined text-medium-risk text-[20px]">schedule</span>
                    </div>

                    <div className="p-3 rounded-lg border border-border bg-soft-accent/50 flex items-start justify-between">
                      <div>
                        <span className="text-[11px] font-semibold text-primary-accent uppercase block">Recommended Mitigation</span>
                        <span className="text-sm font-semibold text-primary-text">Divert 14 High-Priority Lots via Ningbo</span>
                      </div>
                      <span className="material-symbols-outlined text-primary-accent text-[20px]">call_split</span>
                    </div>
                  </div>
                </div>

                {/* Card Interactive Action */}
                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-secondary-text">Action status: Awaiting Authorization</span>
                  <Link
                    href="/ai-analyst/investigations/INV-0018"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary-accent text-white font-medium text-xs hover:bg-primary transition-colors"
                  >
                    <span>View Scenario</span>
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TRUST & TRANSPARENCY PRINCIPLES */}
      <section className="py-20 bg-primary-surface border-b border-border" id="principles">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-xl mb-14">
            <span className="text-[12px] uppercase tracking-wider font-semibold text-primary-accent">FOUNDATIONAL INTEGRITY</span>
            <h2 className="text-[30px] font-bold text-primary-text tracking-tight mt-1 mb-3">
              Clarity you can act on.
            </h2>
            <p className="text-[14px] text-secondary-text">
              Enterprise operations demand transparency. NEXUS never obscures calculation factors or replaces human judgment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Principle 1 */}
            <div className="p-6 rounded-xl border border-border bg-subtle-surface/40 hover:bg-subtle-surface transition-colors duration-150">
              <div className="w-10 h-10 rounded-xl bg-soft-accent text-primary-accent flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-[22px]">schema</span>
              </div>
              <h3 className="text-[16px] font-semibold text-primary-text mb-2">Understand the context</h3>
              <p className="text-[14px] text-secondary-text leading-relaxed">
                See precisely which upstream factors contribute to a risk assessment. Inspect source signals, dwell benchmarks, and historical variance scores.
              </p>
            </div>

            {/* Principle 2 */}
            <div className="p-6 rounded-xl border border-border bg-subtle-surface/40 hover:bg-subtle-surface transition-colors duration-150">
              <div className="w-10 h-10 rounded-xl bg-soft-accent text-primary-accent flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-[22px]">verified_user</span>
              </div>
              <h3 className="text-[16px] font-semibold text-primary-text mb-2">Keep people in control</h3>
              <p className="text-[14px] text-secondary-text leading-relaxed">
                Review recommendations with full lineage before taking operational action. NEXUS delivers decision-ready synthesis, leaving governance with your team.
              </p>
            </div>

            {/* Principle 3 */}
            <div className="p-6 rounded-xl border border-border bg-subtle-surface/40 hover:bg-subtle-surface transition-colors duration-150">
              <div className="w-10 h-10 rounded-xl bg-soft-accent text-primary-accent flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-[22px]">database</span>
              </div>
              <h3 className="text-[16px] font-semibold text-primary-text mb-2">Know your data</h3>
              <p className="text-[14px] text-secondary-text leading-relaxed">
                Always distinguish live authenticated EDI/API feeds from probabilistic estimates and mock test sets with unambiguous surface badges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION */}
      <section className="py-20 md:py-28 bg-app-background border-b border-border relative overflow-hidden" id="cta">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-soft-accent border border-primary-accent/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-primary-accent" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-primary-accent">DEPLOY INTELLIGENCE TODAY</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-[44px] font-bold text-primary-text tracking-tight leading-tight mb-4">
            See the connections. Understand the risk.
          </h2>
          <p className="text-[16px] text-secondary-text max-w-xl mx-auto mb-10 leading-relaxed">
            Explore a more connected way to understand and neutralize supply-chain disruptions across global multi-tier ecosystems.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/overview"
              className="w-full sm:w-auto inline-flex items-center justify-center font-medium text-[14px] text-white bg-primary-accent hover:bg-primary px-8 py-3.5 rounded-xl shadow-xs transition-all duration-150"
            >
              Get Started with NEXUS
            </Link>
            <a
              href="#platform"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-medium text-[14px] text-primary-text hover:text-primary-accent px-6 py-3.5 rounded-xl border border-border bg-primary-surface hover:border-strong-border transition-colors duration-150"
            >
              <span>Explore the Platform</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </a>
          </div>

          <div className="mt-8 text-xs text-muted-text">
            Enterprise SOC2 Type II Certified • Native TMS &amp; ERP Connectors • SOC Ready
          </div>
        </div>
      </section>

      {/* 8. MINIMAL ENTERPRISE FOOTER */}
      <footer className="bg-primary-surface py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-border">
            {/* Left Brand & Mission */}
            <div className="md:col-span-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-soft-accent border border-primary-accent/20 flex items-center justify-center text-primary-accent">
                  <span className="material-symbols-outlined text-[16px]">hub</span>
                </div>
                <span className="text-[18px] font-bold tracking-tight text-primary-text">NEXUS</span>
              </div>
              <p className="text-[14px] text-secondary-text max-w-sm mb-4 leading-relaxed">
                Supply Chain Intelligence operating system providing end-to-end multi-tier network visibility, automated disruption indexing, and actionable risk synthesis.
              </p>
              <div className="text-[11px] text-muted-text bg-subtle-surface px-2.5 py-1.5 rounded-lg border border-border inline-block">
                Production Release v2.8.4
              </div>
            </div>

            {/* Links Column 1: Workspace Modules */}
            <div className="md:col-span-3">
              <h4 className="text-[12px] font-bold uppercase tracking-wider text-primary-text mb-4">Intelligence Platform</h4>
              <ul className="space-y-2.5 text-xs text-secondary-text">
                <li><Link className="hover:text-primary-text transition-colors" href="/risk-intelligence">Risk Intelligence Engine</Link></li>
                <li><Link className="hover:text-primary-text transition-colors" href="/shipments">Shipment Visibility &amp; Telemetry</Link></li>
                <li><Link className="hover:text-primary-text transition-colors" href="/ports-routes">Ports &amp; Maritime Routes</Link></li>
                <li><Link className="hover:text-primary-text transition-colors" href="/ai-analyst">AI Analyst Workspace</Link></li>
                <li><Link className="hover:text-primary-text transition-colors" href="/agent-center">Agent Center Orchestration</Link></li>
              </ul>
            </div>

            {/* Links Column 2: Governance & Support */}
            <div className="md:col-span-4">
              <h4 className="text-[12px] font-bold uppercase tracking-wider text-primary-text mb-4">Company &amp; Governance</h4>
              <ul className="space-y-2.5 text-xs text-secondary-text">
                <li><span className="text-muted-text">Methodology &amp; Data Lineage</span></li>
                <li><span className="text-muted-text">Security Architecture &amp; Trust</span></li>
                <li><span className="text-muted-text">Documentation &amp; API Reference</span></li>
                <li><Link className="hover:text-primary-text transition-colors font-medium text-primary-accent" href="/overview">Overview Console</Link></li>
                <li><Link className="hover:text-primary-text transition-colors font-medium text-primary-accent" href="/login">Log In to Console</Link></li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom Row */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-muted-text gap-4">
            <div>
              <span>© 2026 NEXUS Supply Chain OS Inc. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Responsible AI Disclosure</span>
              <span className="text-muted-text/60">Illustrative demo mode</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
