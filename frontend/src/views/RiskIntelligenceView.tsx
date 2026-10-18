"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { api } from "@/lib/api";
import { DEMO_DISRUPTIONS, DEMO_PORTS, DEMO_ROUTES } from "@/lib/demoData";

const GlobalMap = dynamic(
  () => import("@/components/GlobalMap").then((mod) => mod.GlobalMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[360px] bg-subtle-surface rounded-xl border border-border flex flex-col items-center justify-center text-xs text-secondary-text gap-2">
        <span className="material-symbols-outlined text-primary-accent text-[24px] animate-spin">
          progress_activity
        </span>
        <span>Loading Global Risk Radar...</span>
      </div>
    )
  }
);

export const RiskIntelligenceView: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);
  const [timeRange, setTimeRange] = useState("Last 7 days");
  const [riskCategory, setRiskCategory] = useState("ALL");
  const [regionFilter, setRegionFilter] = useState("Global");
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [showWeightSliders, setShowWeightSliders] = useState(false);

  // Dynamic risk weights
  const [weights, setWeights] = useState({
    weather: 25,
    congestion: 30,
    carrier: 20,
    labour: 15,
    geopolitical: 10
  });

  const loadRisks = async () => {
    try {
      const res = await api.getRisks();
      setData(res);
      if (res?.weights) {
        setWeights({
          weather: Math.round(res.weights.weather * 100),
          congestion: Math.round(res.weights.congestion * 100),
          carrier: Math.round(res.weights.carrier * 100),
          labour: Math.round(res.weights.labour * 100),
          geopolitical: Math.round(res.weights.geopolitical * 100)
        });
      }
    } catch (err) {
      console.warn("Using offline risk calculations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRisks();
  }, []);

  const handleRecalculate = async () => {
    setRecalculating(true);
    try {
      await api.updateSettings({
        weather_weight: weights.weather / 100,
        congestion_weight: weights.congestion / 100,
        carrier_weight: weights.carrier / 100,
        labour_weight: weights.labour / 100,
        geopolitical_weight: weights.geopolitical / 100
      });
      await loadRisks();
    } catch (err) {
      console.error(err);
    } finally {
      setRecalculating(false);
    }
  };

  const assessments = [
    {
      id: "RSK-01",
      title: "Port congestion",
      category: "Port congestion",
      location: "Shanghai",
      portCode: "CNSHA",
      affected_shipments: "32 shipments",
      severity: "High",
      severityClass: "bg-high-risk-bg text-high-risk border-high-risk/20",
      confidence: 87,
      icon: "anchor",
      iconColor: "text-high-risk",
      avgDelay: "3.2 days"
    },
    {
      id: "RSK-02",
      title: "Weather exposure",
      category: "Severe weather",
      location: "North Atlantic",
      portCode: null,
      affected_shipments: "18 shipments",
      severity: "Medium",
      severityClass: "bg-medium-risk-bg text-medium-risk border-medium-risk/20",
      confidence: 78,
      icon: "air",
      iconColor: "text-medium-risk",
      avgDelay: "Wind 48 kts"
    },
    {
      id: "RSK-03",
      title: "Schedule disruption",
      category: "Carrier operations",
      location: "Rotterdam",
      portCode: "NLRTM",
      affected_shipments: "14 shipments",
      severity: "Medium",
      severityClass: "bg-medium-risk-bg text-medium-risk border-medium-risk/20",
      confidence: 82,
      icon: "calendar_month",
      iconColor: "text-medium-risk",
      avgDelay: "Carriers: 3"
    },
    {
      id: "RSK-04",
      title: "Route exposure",
      category: "Route disruption",
      location: "Singapore",
      portCode: "SGSIN",
      affected_shipments: "9 shipments",
      severity: "Low",
      severityClass: "bg-soft-accent text-primary-accent border-primary-accent/20",
      confidence: 71,
      icon: "route",
      iconColor: "text-primary-accent",
      avgDelay: "Normal flow"
    }
  ];

  const filteredAssessments = assessments.filter((a) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      !term ||
      a.title.toLowerCase().includes(term) ||
      a.category.toLowerCase().includes(term) ||
      a.location.toLowerCase().includes(term);
    const matchSev = severityFilter === "ALL" || a.severity.toUpperCase() === severityFilter;
    return matchSearch && matchSev;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header & Filter Bar */}
      <section className="flex flex-col gap-4">
        {/* Compact Filter Bar */}
        <div className="flex items-center justify-between bg-primary-surface border border-border rounded-xl px-4 py-3 shadow-2xs flex-wrap gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Filter 1: Time range */}
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-muted-text">Time range:</span>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="text-[13px] font-medium text-primary-text bg-subtle-surface px-2.5 py-1 rounded-lg border border-border focus:outline-hidden"
              >
                <option value="Last 24 hours">Last 24 hours</option>
                <option value="Last 7 days">Last 7 days</option>
                <option value="Last 30 days">Last 30 days</option>
                <option value="Quarter to Date">Quarter to Date</option>
              </select>
            </div>

            <div className="h-4 w-[1px] bg-border hidden sm:block" />

            {/* Filter 2: Risk category */}
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-muted-text">Risk category:</span>
              <select
                value={riskCategory}
                onChange={(e) => setRiskCategory(e.target.value)}
                className="text-[13px] font-medium text-primary-text bg-subtle-surface px-2.5 py-1 rounded-lg border border-border focus:outline-hidden"
              >
                <option value="ALL">All categories</option>
                <option value="PORT_CONGESTION">Port Congestion</option>
                <option value="WEATHER">Severe Weather</option>
                <option value="CARRIER">Carrier Delays</option>
                <option value="GEOPOLITICAL">Geopolitical</option>
              </select>
            </div>

            <div className="h-4 w-[1px] bg-border hidden sm:block" />

            {/* Filter 3: Region */}
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-muted-text">Region:</span>
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="text-[13px] font-medium text-primary-text bg-subtle-surface px-2.5 py-1 rounded-lg border border-border focus:outline-hidden"
              >
                <option value="Global">Global</option>
                <option value="Asia-Europe">Asia–Europe</option>
                <option value="Trans-Pacific">Trans-Pacific</option>
                <option value="Trans-Atlantic">Trans-Atlantic</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/research"
              className="flex items-center gap-1.5 text-[13px] font-semibold text-on-primary bg-primary-accent hover:bg-primary px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
            >
              <span className="material-symbols-outlined text-[16px]">radar</span>
              <span>Research Disruption</span>
            </Link>

            <button
              onClick={() => setShowWeightSliders(!showWeightSliders)}
              className="flex items-center gap-1.5 text-[13px] font-medium text-secondary-text hover:text-primary-text px-2.5 py-1 rounded-lg border border-border bg-subtle-surface hover:bg-border/60 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span>{showWeightSliders ? "Hide Weights" : "Tune Engine Weights"}</span>
            </button>

            <button
              onClick={() => {
                setTimeRange("Last 7 days");
                setRiskCategory("ALL");
                setRegionFilter("Global");
                setSearchTerm("");
                setSeverityFilter("ALL");
              }}
              className="flex items-center gap-1 text-[13px] font-medium text-secondary-text hover:text-primary-text transition-colors px-2 py-1"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>Reset filters</span>
            </button>
          </div>
        </div>

        {/* Engine Weight Sliders Drawer (Preserved from original feature) */}
        {showWeightSliders && (
          <div className="p-5 bg-primary-surface border border-border rounded-xl shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-[14px] font-semibold text-primary-text">Deterministic Risk Weighting Engine</h3>
                <p className="text-[12px] text-secondary-text">Adjust factor contributions to composite risk score.</p>
              </div>
              <button
                onClick={handleRecalculate}
                disabled={recalculating}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-accent hover:bg-primary text-white text-[12px] font-medium transition-colors disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[16px]">{recalculating ? "sync" : "refresh"}</span>
                <span>{recalculating ? "Recalculating..." : "Apply & Recalculate"}</span>
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <div className="flex justify-between text-[12px] mb-1">
                  <span className="text-secondary-text">Port Congestion</span>
                  <span className="font-mono font-semibold text-primary-text">{weights.congestion}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weights.congestion}
                  onChange={(e) => setWeights({ ...weights, congestion: Number(e.target.value) })}
                  className="w-full accent-primary-accent"
                />
              </div>
              <div>
                <div className="flex justify-between text-[12px] mb-1">
                  <span className="text-secondary-text">Severe Weather</span>
                  <span className="font-mono font-semibold text-primary-text">{weights.weather}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weights.weather}
                  onChange={(e) => setWeights({ ...weights, weather: Number(e.target.value) })}
                  className="w-full accent-primary-accent"
                />
              </div>
              <div>
                <div className="flex justify-between text-[12px] mb-1">
                  <span className="text-secondary-text">Carrier Operations</span>
                  <span className="font-mono font-semibold text-primary-text">{weights.carrier}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weights.carrier}
                  onChange={(e) => setWeights({ ...weights, carrier: Number(e.target.value) })}
                  className="w-full accent-primary-accent"
                />
              </div>
              <div>
                <div className="flex justify-between text-[12px] mb-1">
                  <span className="text-secondary-text">Labor Strikes</span>
                  <span className="font-mono font-semibold text-primary-text">{weights.labour}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weights.labour}
                  onChange={(e) => setWeights({ ...weights, labour: Number(e.target.value) })}
                  className="w-full accent-primary-accent"
                />
              </div>
              <div>
                <div className="flex justify-between text-[12px] mb-1">
                  <span className="text-secondary-text">Geopolitical</span>
                  <span className="font-mono font-semibold text-primary-text">{weights.geopolitical}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weights.geopolitical}
                  onChange={(e) => setWeights({ ...weights, geopolitical: Number(e.target.value) })}
                  className="w-full accent-primary-accent"
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 2. 4 Risk Summary KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Critical Risks */}
        <div className="bg-primary-surface border border-border rounded-xl p-4 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-secondary-text">Critical Risks</span>
            <span className="w-2.5 h-2.5 rounded-full bg-high-risk" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-[28px] font-semibold text-primary-text leading-tight">4</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-high-risk-bg text-high-risk leading-none">
              Immediate action
            </span>
          </div>
          <p className="text-[12px] text-muted-text">Require immediate operational review</p>
        </div>

        {/* Card 2: High-Risk Shipments */}
        <div className="bg-primary-surface border border-border rounded-xl p-4 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-secondary-text">High-Risk Shipments</span>
            <span className="material-symbols-outlined text-[18px] text-muted-text">inventory_2</span>
          </div>
          <div className="my-2">
            <span className="text-[28px] font-semibold text-primary-text leading-tight">86</span>
          </div>
          <p className="text-[12px] text-muted-text">Across monitored global trade lanes</p>
        </div>

        {/* Card 3: Routes Affected */}
        <div className="bg-primary-surface border border-border rounded-xl p-4 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-secondary-text">Routes Affected</span>
            <span className="material-symbols-outlined text-[18px] text-muted-text">route</span>
          </div>
          <div className="my-2">
            <span className="text-[28px] font-semibold text-primary-text leading-tight">12</span>
          </div>
          <p className="text-[12px] text-muted-text">Potential disruption exposure</p>
        </div>

        {/* Card 4: Risk Trend */}
        <div className="bg-primary-surface border border-border rounded-xl p-4 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-secondary-text">Risk Trend</span>
            <span className="material-symbols-outlined text-[18px] text-medium-risk">trending_up</span>
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-[28px] font-semibold text-medium-risk leading-tight">Increasing</span>
          </div>
          <p className="text-[12px] text-muted-text">+8.4% variance vs 30-day baseline</p>
        </div>
      </section>

      {/* 3. Main Content Row: Global Risk Map (~60%) and Risk Distribution (~40%) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Panel: Global Risk Map */}
        <div className="lg:col-span-7 bg-primary-surface border border-border rounded-xl p-5 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h2 className="text-[16px] font-semibold text-primary-text">Global Risk Map</h2>
                <p className="text-[12px] text-secondary-text">Geographic distribution of detected and predicted risks</p>
              </div>
              <Link href="/ports-routes" className="text-[13px] text-primary-accent hover:underline flex items-center gap-1 font-medium">
                <span>View routes</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>

            {/* Interactive Global Maritime Radar Map */}
            <div className="my-4 rounded-xl overflow-hidden border border-border">
              <GlobalMap
                ports={DEMO_PORTS}
                routes={DEMO_ROUTES}
                disruptions={DEMO_DISRUPTIONS}
                height="340px"
              />
            </div>
          </div>

          {/* Map Legend */}
          <div className="flex items-center justify-between pt-2 border-t border-border text-[12px]">
            <span className="text-secondary-text">Severity Classifications:</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-high-risk" />
                <span className="text-primary-text">Critical</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-high-risk opacity-75" />
                <span className="text-primary-text">High</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-medium-risk" />
                <span className="text-primary-text">Medium</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-accent" />
                <span className="text-primary-text">Low</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Risk Distribution */}
        <div className="lg:col-span-5 bg-primary-surface border border-border rounded-xl p-5 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h2 className="text-[16px] font-semibold text-primary-text">Risk Distribution</h2>
                <p className="text-[12px] text-secondary-text">Current exposure by severity</p>
              </div>
              <span className="text-[11px] text-muted-text bg-subtle-surface px-2 py-0.5 rounded border border-border">
                Sample exposure data
              </span>
            </div>

            {/* Distribution Progress Bars Container */}
            <div className="flex flex-col gap-4 my-4">
              {/* Critical: 4 shipments */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-high-risk" />
                    <span className="text-primary-text font-medium">Critical</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-secondary-text text-[12px]">0.3%</span>
                    <span className="text-primary-text font-semibold">4 shipments</span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-subtle-surface rounded-full overflow-hidden border border-border/50">
                  <div className="h-full bg-high-risk rounded-full" style={{ width: "3%" }} />
                </div>
              </div>

              {/* High: 82 shipments */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-high-risk opacity-75" />
                    <span className="text-primary-text font-medium">High</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-secondary-text text-[12px]">6.4%</span>
                    <span className="text-primary-text font-semibold">82 shipments</span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-subtle-surface rounded-full overflow-hidden border border-border/50">
                  <div className="h-full bg-high-risk opacity-75 rounded-full" style={{ width: "14%" }} />
                </div>
              </div>

              {/* Medium: 216 shipments */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-medium-risk" />
                    <span className="text-primary-text font-medium">Medium</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-secondary-text text-[12px]">16.8%</span>
                    <span className="text-primary-text font-semibold">216 shipments</span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-subtle-surface rounded-full overflow-hidden border border-border/50">
                  <div className="h-full bg-medium-risk rounded-full" style={{ width: "32%" }} />
                </div>
              </div>

              {/* Low: 982 shipments */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-muted-text" />
                    <span className="text-primary-text font-medium">Low</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-secondary-text text-[12px]">76.5%</span>
                    <span className="text-primary-text font-semibold">982 shipments</span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-subtle-surface rounded-full overflow-hidden border border-border/50">
                  <div className="h-full bg-muted-text rounded-full" style={{ width: "76.5%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Subtext summary footer */}
          <div className="p-3 bg-subtle-surface rounded-xl border border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-primary-accent">insights</span>
              <span className="text-[13px] text-secondary-text">Total Active Tracked Exposure:</span>
            </div>
            <span className="text-[13px] font-semibold text-primary-text">1,284 Shipments</span>
          </div>
        </div>
      </section>

      {/* 4. Top Risk Factors */}
      <section className="space-y-3">
        <div>
          <h2 className="text-[16px] font-semibold text-primary-text">Top Risk Factors</h2>
          <p className="text-[12px] text-secondary-text">Conditions contributing to potential supply chain disruption.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Factor 1: Port Congestion */}
          <div className="bg-primary-surface border border-border rounded-xl p-5 flex flex-col justify-between hover:border-strong-border transition-colors shadow-2xs">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-high-risk-bg text-high-risk flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">anchor</span>
                  </div>
                  <div>
                    <h3 className="text-[14px] font-semibold text-primary-text">Port Congestion</h3>
                    <span className="text-[12px] text-secondary-text flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">location_on</span> Shanghai (CNSHA)
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-high-risk-bg text-high-risk border border-high-risk/20">
                  High
                </span>
              </div>
              <p className="text-[13px] text-secondary-text mt-3 leading-relaxed">
                Increased vessel waiting times due to typhoon gale warnings may affect departure schedules and downstream delivery estimates.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-muted-text text-[12px]">
              <span>Avg Berth Delay: 52h</span>
              <div className="flex items-center gap-2.5">
                <Link
                  href="/research?port=CNSHA&q=Shanghai+port+congestion+typhoon+gale+notice"
                  className="inline-flex items-center gap-1 text-primary-accent hover:underline font-semibold"
                >
                  <span className="material-symbols-outlined text-[13px]">radar</span>
                  <span>Research</span>
                </Link>
                <Link href="/ports/CNSHA" className="text-secondary-text hover:text-primary-text font-medium">
                  Inspect →
                </Link>
              </div>
            </div>
          </div>

          {/* Factor 2: Severe Weather */}
          <div className="bg-primary-surface border border-border rounded-xl p-5 flex flex-col justify-between hover:border-strong-border transition-colors shadow-2xs">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-medium-risk-bg text-medium-risk flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">air</span>
                  </div>
                  <div>
                    <h3 className="text-[14px] font-semibold text-primary-text">Severe Weather</h3>
                    <span className="text-[12px] text-secondary-text flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">location_on</span> East China Sea / N. Atlantic
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-medium-risk-bg text-medium-risk border border-medium-risk/20">
                  Medium
                </span>
              </div>
              <p className="text-[13px] text-secondary-text mt-3 leading-relaxed">
                Adverse weather may cause route changes, speed reductions, or longer transit times across primary sea corridors.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-muted-text text-[12px]">
              <span>Wave heights: 6.2m</span>
              <div className="flex items-center gap-2.5">
                <Link
                  href="/research?type=WEATHER&q=East+China+Sea+typhoon+gale+warning+advisory"
                  className="inline-flex items-center gap-1 text-primary-accent hover:underline font-semibold"
                >
                  <span className="material-symbols-outlined text-[13px]">radar</span>
                  <span>Research</span>
                </Link>
                <Link href="/alerts/ALT-0024" className="text-secondary-text hover:text-primary-text font-medium">
                  Inspect →
                </Link>
              </div>
            </div>
          </div>

          {/* Factor 3: Carrier Schedule Changes */}
          <div className="bg-primary-surface border border-border rounded-xl p-5 flex flex-col justify-between hover:border-strong-border transition-colors shadow-2xs">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-medium-risk-bg text-medium-risk flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                  </div>
                  <div>
                    <h3 className="text-[14px] font-semibold text-primary-text">Carrier Schedule Changes</h3>
                    <span className="text-[12px] text-secondary-text flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">location_on</span> Rotterdam (NLRTM)
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-medium-risk-bg text-medium-risk border border-medium-risk/20">
                  Medium
                </span>
              </div>
              <p className="text-[13px] text-secondary-text mt-3 leading-relaxed">
                Schedule revisions and rail terminal maintenance affect connecting shipments and planned arrival windows across central terminals.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-muted-text text-[12px]">
              <span>Carriers affected: 3</span>
              <div className="flex items-center gap-2.5">
                <Link
                  href="/research?port=NLRTM&type=PORT_CONGESTION&q=Rotterdam+Maasvlakte+barge+rail+dwell"
                  className="inline-flex items-center gap-1 text-primary-accent hover:underline font-semibold"
                >
                  <span className="material-symbols-outlined text-[13px]">radar</span>
                  <span>Research</span>
                </Link>
                <Link href="/ports/NLRTM" className="text-secondary-text hover:text-primary-text font-medium">
                  Inspect →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Risk Assessments Table */}
      <section className="bg-primary-surface border border-border rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-[16px] font-semibold text-primary-text">Risk Assessments Register</h2>
            <p className="text-[12px] text-secondary-text">Review the most significant risks identified across your monitored network.</p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Search Input */}
            <div className="relative w-56 sm:w-64">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-muted-text">
                search
              </span>
              <input
                type="text"
                placeholder="Search risks, categories, ports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-primary-surface border border-border rounded-lg pl-8 pr-2.5 py-1.5 text-[13px] text-primary-text placeholder:text-muted-text focus:outline-hidden focus:border-primary-accent"
              />
            </div>

            {/* Severity Filter */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="text-[13px] font-medium text-primary-text bg-primary-surface px-2.5 py-1.5 rounded-lg border border-border focus:outline-hidden"
            >
              <option value="ALL">All Severities</option>
              <option value="HIGH">High Severity</option>
              <option value="MEDIUM">Medium Severity</option>
              <option value="LOW">Low Severity</option>
            </select>

            {/* Export */}
            <button
              onClick={() => alert("Risk Assessments summary exported successfully.")}
              className="flex items-center gap-1 text-[13px] font-medium text-secondary-text hover:text-primary-text bg-primary-surface hover:bg-subtle-surface px-2.5 py-1.5 rounded-lg border border-border transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Enterprise Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-subtle-surface/50 text-[11px] font-semibold text-secondary-text uppercase tracking-wider select-none">
                <th className="py-2.5 px-3">Risk Assessment</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Affected Shipments</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Model Confidence</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-[13px]">
              {filteredAssessments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-muted-text">
                    No risk assessments match the specified criteria.
                  </td>
                </tr>
              ) : (
                filteredAssessments.map((a) => (
                  <tr key={a.id} className="hover:bg-subtle-surface transition-colors group">
                    <td className="py-3 px-3 font-medium text-primary-text">
                      <div className="flex items-center gap-2">
                        <span className={`material-symbols-outlined text-[18px] ${a.iconColor}`}>
                          {a.icon}
                        </span>
                        <span>{a.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-secondary-text">{a.category}</td>
                    <td className="py-3 px-3 text-primary-text">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-muted-text">location_on</span>
                        <span>{a.location}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-medium text-primary-text">{a.affected_shipments}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${a.severityClass}`}>
                        {a.severity}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-subtle-surface rounded-full overflow-hidden border border-border">
                          <div className="h-full bg-primary-accent rounded-full" style={{ width: `${a.confidence}%` }} />
                        </div>
                        <span className="text-secondary-text text-[12px] font-medium">{a.confidence}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {a.portCode ? (
                        <Link
                          href={`/ports/${a.portCode}`}
                          className="text-primary-accent hover:underline text-[12px] font-medium"
                        >
                          View Port
                        </Link>
                      ) : (
                        <Link
                          href="/alerts"
                          className="text-primary-accent hover:underline text-[12px] font-medium"
                        >
                          View Alert
                        </Link>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border text-[12px] text-secondary-text">
          <span>Showing {filteredAssessments.length} of {assessments.length} detected risks</span>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1 rounded border border-border bg-primary-surface text-primary-text disabled:opacity-50" disabled>
              Previous
            </button>
            <span className="px-2 text-primary-text font-medium">1</span>
            <button className="px-2.5 py-1 rounded border border-border bg-primary-surface text-primary-text disabled:opacity-50" disabled>
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
