"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { api } from "@/lib/api";
import { 
  ResearchRequest, ResearchResponse, ResearchEvidenceItem, 
  ResearchStatus, Port, Route 
} from "@/lib/types";
import { DEMO_PORTS, DEMO_ROUTES } from "@/lib/demoData";

function ResearchContent() {
  const searchParams = useSearchParams();
  const initialPort = searchParams?.get("port") || "";
  const initialRoute = searchParams?.get("route") || "";
  const initialCarrier = searchParams?.get("carrier") || "";
  const initialType = searchParams?.get("type") || "";
  const initialQuery = searchParams?.get("q") || "";
  const initialId = searchParams?.get("id") || "";

  // State
  const [query, setQuery] = useState(initialQuery);
  const [selectedPort, setSelectedPort] = useState(initialPort);
  const [selectedRoute, setSelectedRoute] = useState(initialRoute);
  const [selectedCarrier, setSelectedCarrier] = useState(initialCarrier);
  const [selectedType, setSelectedType] = useState(initialType);
  const [allowSimulation, setAllowSimulation] = useState(true);

  const [loading, setLoading] = useState(false);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [progressStep, setProgressStep] = useState<string | null>(null);
  const [statusInfo, setStatusInfo] = useState<ResearchStatus | null>(null);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; latency_ms?: number } | null>(null);

  const [currentResponse, setCurrentResponse] = useState<ResearchResponse | null>(null);
  const [history, setHistory] = useState<ResearchResponse[]>([]);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // Quick Query Templates
  const templates = [
    {
      title: "Shanghai Typhoon & Crane Safety",
      query: "Typhoon Malakas gale warning offshore Yangshan terminal crane throttle",
      port: "CNSHA",
      type: "WEATHER",
    },
    {
      title: "Maasvlakte II Intermodal Congestion",
      query: "Port of Rotterdam Maasvlakte II container berth and inland barge dwell backlog",
      port: "NLRTM",
      type: "PORT_CONGESTION",
    },
    {
      title: "Red Sea Bab el-Mandeb Threat",
      query: "Southern Red Sea security threats and commercial carrier Cape diversion surcharges",
      route: "RTE-01",
      type: "GEOPOLITICAL",
    },
    {
      title: "Los Angeles Pier 400 Rail Dwell",
      query: "San Pedro Bay container import dwell and intermodal rail terminal congestion",
      port: "USLAX",
      type: "PORT_CONGESTION",
    },
    {
      title: "Antwerp Dockworkers Strike",
      query: "Belgian transport workers union 24h warning strike circular and terminal stoppage",
      type: "LABOUR_STRIKE",
    },
  ];

  // Fetch initial status and history
  const loadInitialData = useCallback(async () => {
    try {
      const statusRes = await api.getResearchStatus();
      setStatusInfo(statusRes);
    } catch {
      setStatusInfo({
        status: "NOT_CONFIGURED",
        api_key_configured: false,
        sdk_installed: true,
        api_base_url: "https://agent.tinyfish.ai",
        supported_features: ["LIVE_WEB_SEARCH", "AGENT_CRAWLER", "PAGE_CONTENT_FETCH"],
        message: "TinyFish API key not configured. Server operating in demo scenario mode.",
      });
    }

    try {
      const histRes = await api.getResearchHistory(15);
      if (Array.isArray(histRes) && histRes.length > 0) {
        setHistory(histRes);
        if (initialId) {
          const match = histRes.find((r) => r.research_id === initialId);
          if (match) setCurrentResponse(match);
        } else if (!currentResponse) {
          setCurrentResponse(histRes[0]);
        }
      }
    } catch (err) {
      console.warn("Could not load research history:", err);
    }
  }, [initialId, currentResponse]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Execute Web Research
  const handleExecuteResearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() && !selectedPort && !selectedRoute && !selectedCarrier) return;

    setLoading(true);
    setExecutionError(null);
    setProgressStep("Synthesizing query parameters with contextual port & lane metadata...");

    const payload: ResearchRequest = {
      query: query.trim() || `${selectedPort || selectedRoute || selectedCarrier} operational advisory`,
      port_code: selectedPort || undefined,
      route_id: selectedRoute || undefined,
      carrier: selectedCarrier || undefined,
      disruption_type: selectedType || undefined,
      include_demo_fallback: allowSimulation,
    };

    const stepTimer1 = setTimeout(() => {
      setProgressStep("Connecting to TinyFish Web Intelligence engine & dispatching crawler...");
    }, 400);

    const stepTimer2 = setTimeout(() => {
      setProgressStep("Extracting maritime bulletins, notices, and source verification excerpts...");
    }, 900);

    try {
      const res = await api.executeResearch(payload);
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setCurrentResponse(res);
      setExecutionError(null);
      setHistory((prev) => [res, ...prev.filter((h) => h.research_id !== res.research_id)]);
    } catch (err: any) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      console.error("Research execution failed:", err);
      setExecutionError(err?.message || "Failed to complete research execution. Check your backend connection and retry.");
    } finally {
      setLoading(false);
      setProgressStep(null);
    }
  };

  // Test TinyFish Connection
  const handleTestConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);
    try {
      const res = await api.testResearchConnection();
      setTestResult(res);
      if (res.success) {
        setStatusInfo((prev) => prev ? { ...prev, status: "CONNECTED" } : null);
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || "Failed to reach TinyFish service.",
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const applyTemplate = (t: typeof templates[0]) => {
    setQuery(t.query);
    if (t.port) setSelectedPort(t.port);
    if (t.route) setSelectedRoute(t.route);
    if (t.type) setSelectedType(t.type);
  };

  return (
    <AppShell
      title="TinyFish Web Research"
      subtitle="Autonomous public web crawler for port authority notices, extreme weather alerts, and carrier disruption bulletins."
      actions={
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsConfigModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-primary-surface hover:bg-subtle-surface text-secondary-text hover:text-primary-text text-[13px] font-medium transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px]">settings</span>
            <span>API Configuration</span>
          </button>
          <button
            onClick={handleTestConnection}
            disabled={testingConnection}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-soft-accent hover:bg-primary-accent hover:text-on-primary text-primary-accent text-[13px] font-medium transition-colors shadow-2xs"
          >
            <span className={`material-symbols-outlined text-[16px] ${testingConnection ? "animate-spin" : ""}`}>
              {testingConnection ? "sync" : "electrical_services"}
            </span>
            <span>{testingConnection ? "Testing..." : "Test Connection"}</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6 max-w-7xl">
        {/* 1. Connection Status Banner */}
        <section className={`border rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          statusInfo?.status === "CONNECTED"
            ? "bg-success-bg border-success/30"
            : statusInfo?.status === "ERROR"
            ? "bg-high-risk-bg border-high-risk/30"
            : "bg-medium-risk-bg/40 border-medium-risk/30"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              statusInfo?.status === "CONNECTED"
                ? "bg-success text-on-primary"
                : statusInfo?.status === "ERROR"
                ? "bg-high-risk text-on-primary"
                : "bg-medium-risk text-on-primary"
            }`}>
              <span className="material-symbols-outlined text-[20px]">
                {statusInfo?.status === "CONNECTED" ? "verified" : statusInfo?.status === "ERROR" ? "error" : "travel_explore"}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-button-input text-section-heading font-semibold text-primary-text">
                  TinyFish Integration Status:
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  statusInfo?.status === "CONNECTED"
                    ? "bg-success text-on-primary"
                    : statusInfo?.status === "ERROR"
                    ? "bg-high-risk text-on-primary"
                    : "bg-medium-risk text-on-primary"
                }`}>
                  {statusInfo?.status === "CONNECTED" ? "CONNECTED" : statusInfo?.status === "ERROR" ? "ERROR" : "NOT CONFIGURED"}
                </span>
              </div>
              <p className="font-metadata text-metadata text-secondary-text mt-0.5">
                {statusInfo?.message}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {testResult && (
              <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${
                testResult.success ? "bg-success/20 text-success" : "bg-high-risk/20 text-high-risk"
              }`}>
                {testResult.message} {testResult.latency_ms ? `(${testResult.latency_ms}ms)` : ""}
              </span>
            )}
            <button
              onClick={() => setIsConfigModalOpen(true)}
              className="text-xs font-semibold text-primary-accent hover:underline px-2 py-1"
            >
              Setup Guide →
            </button>
          </div>
        </section>

        {/* 2. Research Query & Context Form */}
        <section className="bg-primary-surface border border-border rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-accent text-[20px]">manage_search</span>
              <h2 className="font-section-heading text-section-heading font-semibold text-primary-text">
                Targeted Web Investigation
              </h2>
            </div>
            <span className="font-metadata text-metadata text-muted-text">
              Grounded in public port authority notices &amp; maritime circulars
            </span>
          </div>

          {/* Quick Template Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-secondary-text font-medium whitespace-nowrap">Suggested topics:</span>
            {templates.map((tpl, i) => (
              <button
                key={i}
                type="button"
                onClick={() => applyTemplate(tpl)}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-subtle-surface hover:bg-soft-accent hover:text-primary-accent border border-border text-secondary-text transition-colors"
              >
                {tpl.title}
              </button>
            ))}
          </div>

          <form onSubmit={handleExecuteResearch} className="space-y-4">
            {/* Query Input Bar */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-text text-[20px]">
                search
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter maritime disruption query (e.g., Shanghai gale warning, Rotterdam Maasvlakte dwell, Red Sea diversion)..."
                className="w-full pl-11 pr-28 py-3 rounded-xl border border-border bg-primary-surface text-primary-text placeholder-secondary-text focus:outline-none focus:border-primary-accent font-button-input text-sm shadow-inner-xs"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-28 top-1/2 -translate-y-1/2 text-secondary-text hover:text-primary-text px-2"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-accent hover:bg-primary text-on-primary text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                    <span>Crawling...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">radar</span>
                    <span>Research</span>
                  </>
                )}
              </button>
            </div>

            {/* Context Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-secondary-text uppercase tracking-wider mb-1">
                  Port Focus
                </label>
                <select
                  value={selectedPort}
                  onChange={(e) => setSelectedPort(e.target.value)}
                  className="w-full px-3 py-2 bg-primary-surface border border-border rounded-xl text-xs text-primary-text focus:outline-none focus:border-primary-accent"
                >
                  <option value="">All Ports (Global)</option>
                  {DEMO_PORTS.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.name} ({p.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-secondary-text uppercase tracking-wider mb-1">
                  Trade Corridor
                </label>
                <select
                  value={selectedRoute}
                  onChange={(e) => setSelectedRoute(e.target.value)}
                  className="w-full px-3 py-2 bg-primary-surface border border-border rounded-xl text-xs text-primary-text focus:outline-none focus:border-primary-accent"
                >
                  <option value="">All Corridors</option>
                  {DEMO_ROUTES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-secondary-text uppercase tracking-wider mb-1">
                  Carrier Scope
                </label>
                <select
                  value={selectedCarrier}
                  onChange={(e) => setSelectedCarrier(e.target.value)}
                  className="w-full px-3 py-2 bg-primary-surface border border-border rounded-xl text-xs text-primary-text focus:outline-none focus:border-primary-accent"
                >
                  <option value="">All Carriers</option>
                  <option value="Maersk Line">Maersk Line</option>
                  <option value="MSC">MSC Mediterranean Shipping</option>
                  <option value="CMA CGM">CMA CGM Group</option>
                  <option value="COSCO Shipping">COSCO Shipping</option>
                  <option value="Hapag-Lloyd">Hapag-Lloyd</option>
                  <option value="ONE (Ocean Network Express)">Ocean Network Express</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-secondary-text uppercase tracking-wider mb-1">
                  Disruption Category
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 bg-primary-surface border border-border rounded-xl text-xs text-primary-text focus:outline-none focus:border-primary-accent"
                >
                  <option value="">All Categories</option>
                  <option value="WEATHER">Extreme Weather / Gale Warning</option>
                  <option value="PORT_CONGESTION">Port Congestion &amp; Berth Wait</option>
                  <option value="CARRIER_DELAY">Carrier Blank Sailing &amp; Omission</option>
                  <option value="LABOUR_STRIKE">Labour Action &amp; Terminal Strike</option>
                  <option value="GEOPOLITICAL">Geopolitical / Security Threat</option>
                  <option value="TRADE_RESTRICTION">Customs &amp; Regulatory Hold</option>
                </select>
              </div>
            </div>

            {/* Simulation Fallback Option */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-secondary-text select-none">
                <input
                  type="checkbox"
                  checked={allowSimulation}
                  onChange={(e) => setAllowSimulation(e.target.checked)}
                  className="rounded text-primary-accent focus:ring-primary-accent/30"
                />
                <span>Allow pre-computed scenario fallback if live API key is unconfigured</span>
              </label>

              <div className="flex items-center gap-3 text-xs text-muted-text">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-success"></span>
                  Sourced Facts
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary-accent"></span>
                  Analytical Inferences
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-medium-risk"></span>
                  Unverified Claims
                </span>
              </div>
            </div>
          </form>

          {/* Progress state banner */}
          {loading && (
            <div className="bg-soft-accent/60 border border-primary-accent/20 rounded-xl p-3 flex items-center gap-3 animate-pulse">
              <span className="material-symbols-outlined text-primary-accent text-[20px] animate-spin">
                progress_activity
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-primary-accent block">
                  TinyFish Web Crawler Active
                </span>
                <span className="text-xs text-secondary-text truncate block">
                  {progressStep || "Executing web extraction..."}
                </span>
              </div>
            </div>
          )}

          {/* Execution Error Banner with Retry */}
          {executionError && (
            <div className="bg-high-risk-bg border border-high-risk/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-high-risk">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[22px] shrink-0">error</span>
                <div>
                  <span className="text-xs font-bold block">Research Execution Error</span>
                  <span className="text-xs text-high-risk/90">{executionError}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleExecuteResearch()}
                className="px-3.5 py-1.5 rounded-lg bg-high-risk text-on-primary text-xs font-semibold hover:bg-high-risk/90 transition-colors shrink-0 flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span className="material-symbols-outlined text-[15px]">refresh</span>
                <span>Retry Query</span>
              </button>
            </div>
          )}
        </section>

        {/* 3. Research Results Section */}
        {currentResponse && (
          <section className="space-y-4">
            {/* Result Header & Metadata Strip */}
            <div className="bg-primary-surface border border-border rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-2xs">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-metadata text-metadata text-muted-text uppercase tracking-wider font-semibold">
                    Research Session {currentResponse.research_id}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    currentResponse.connection_mode === "LIVE_TINYFISH"
                      ? "bg-success-bg text-success border border-success/30"
                      : "bg-subtle-surface text-secondary-text border border-border"
                  }`}>
                    <span className="material-symbols-outlined text-[13px]">
                      {currentResponse.connection_mode === "LIVE_TINYFISH" ? "wifi" : "science"}
                    </span>
                    {currentResponse.connection_mode === "LIVE_TINYFISH" ? "LIVE TINYFISH CRAWL" : "ILLUSTRATIVE SCENARIO"}
                  </span>
                </div>
                <h3 className="font-section-heading text-[16px] font-semibold text-primary-text mt-0.5">
                  &quot;{currentResponse.query}&quot;
                </h3>
              </div>

              <div className="flex items-center gap-4 text-xs text-secondary-text">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-muted-text">schedule</span>
                  <span>{new Date(currentResponse.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-muted-text">timer</span>
                  <span>{currentResponse.execution_time_ms}ms</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-muted-text">library_books</span>
                  <span>{currentResponse.evidence_items.length} Sourced Evidence Items</span>
                </div>
              </div>
            </div>

            {/* Key Findings Box */}
            {currentResponse.summary_findings.length > 0 && (
              <div className="bg-primary-surface border border-border rounded-2xl p-5 shadow-2xs space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-accent text-[20px]">fact_check</span>
                  <h4 className="font-section-heading text-section-heading font-semibold text-primary-text">
                    Synthesized Intelligence Findings
                  </h4>
                </div>
                <div className="space-y-2">
                  {currentResponse.summary_findings.map((f, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-[13px] text-primary-text">
                      <span className="material-symbols-outlined text-primary-accent text-[16px] shrink-0 mt-0.5">
                        check_circle
                      </span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sourced Evidence Items Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h4 className="font-section-heading text-section-heading font-semibold text-primary-text flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-accent text-[18px]">verified</span>
                  Extracted Public Evidence ({currentResponse.evidence_items.length})
                </h4>
                <span className="text-xs text-muted-text">
                  Direct external source citations
                </span>
              </div>

              {currentResponse.evidence_items.length === 0 ? (
                <div className="bg-primary-surface border border-border rounded-2xl p-8 text-center text-secondary-text">
                  <span className="material-symbols-outlined text-muted-text text-[36px] mb-2">search_off</span>
                  <p className="font-body text-body">No matching public bulletins found for this specific query.</p>
                  <p className="text-xs text-muted-text mt-1">Try broadening the query terms or testing with a pre-configured template.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentResponse.evidence_items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-primary-surface border border-border rounded-2xl p-5 shadow-2xs flex flex-col justify-between hover:border-strong-border transition-colors gap-3"
                    >
                      <div className="space-y-2.5">
                        {/* Header Badges */}
                        <div className="flex items-start justify-between gap-2">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            item.severity === "CRITICAL"
                              ? "bg-high-risk text-on-primary"
                              : item.severity === "HIGH"
                              ? "bg-high-risk-bg text-high-risk border border-high-risk/20"
                              : item.severity === "MEDIUM"
                              ? "bg-medium-risk-bg text-medium-risk border border-medium-risk/20"
                              : "bg-success-bg text-success border border-success/20"
                          }`}>
                            <span className="material-symbols-outlined text-[12px]">warning</span>
                            {item.severity} SEVERITY
                          </span>

                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                            item.verification_status === "SOURCED_FACT"
                              ? "bg-success-bg text-success border border-success/30"
                              : item.verification_status === "ANALYTICAL_INFERENCE"
                              ? "bg-soft-accent text-primary-accent border border-primary-accent/30"
                              : item.verification_status === "UNVERIFIED_CLAIM"
                              ? "bg-medium-risk-bg text-medium-risk border border-medium-risk/30"
                              : "bg-subtle-surface text-secondary-text border border-border"
                          }`}>
                            <span className="material-symbols-outlined text-[13px]">
                              {item.verification_status === "SOURCED_FACT" ? "verified_user" : item.verification_status === "SIMULATED" ? "science" : "help"}
                            </span>
                            {item.verification_status.replace("_", " ")}
                          </span>
                        </div>

                        {/* Title & Summary */}
                        <h4 className="font-button-input text-[15px] font-semibold text-primary-text leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-[13px] text-secondary-text leading-relaxed">
                          {item.summary}
                        </p>

                        {/* Direct Excerpt */}
                        <div className="p-3 bg-subtle-surface rounded-xl border border-border text-xs text-primary-text font-mono leading-relaxed select-text">
                          <span className="text-secondary-text font-semibold uppercase text-[10px] block mb-1">
                            Exact Bulletin Excerpt:
                          </span>
                          &ldquo;{item.evidence_excerpt}&rdquo;
                        </div>
                      </div>

                      {/* Footer & Source URL */}
                      <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-secondary-text">
                          <span className="material-symbols-outlined text-[14px]">public</span>
                          <span className="font-medium text-primary-text">{item.source_name}</span>
                        </div>
                        <a
                          href={item.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary-accent hover:underline font-semibold"
                        >
                          <span>Inspect Source</span>
                          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommended Operator Actions */}
            {currentResponse.suggested_actions.length > 0 && (
              <div className="bg-primary-surface border border-border rounded-2xl p-5 shadow-2xs space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-accent text-[20px]">assignment_turned_in</span>
                  <h4 className="font-section-heading text-section-heading font-semibold text-primary-text">
                    Recommended Operational Mitigations
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {currentResponse.suggested_actions.map((act, i) => (
                    <div key={i} className="p-3 bg-subtle-surface rounded-xl border border-border flex items-start gap-2 text-xs text-primary-text">
                      <span className="w-5 h-5 rounded-full bg-soft-accent text-primary-accent flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Regulatory Disclaimer Card */}
            <div className="bg-subtle-surface/70 border border-border rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-secondary-text">
              <span className="material-symbols-outlined text-muted-text text-[18px] shrink-0 mt-0.5">policy</span>
              <p>
                <strong>Data Integrity Protocol:</strong> Public web intelligence establishes verifiable third-party evidence of maritime, weather, and labor disruptions. It does not automatically modify private consignment manifests or establish commercial breach without corroborating carrier telemetry.
              </p>
            </div>
          </section>
        )}

        {/* 4. Persisted Research History Section */}
        <section className="bg-primary-surface border border-border rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-accent text-[20px]">history</span>
              <h3 className="font-section-heading text-section-heading font-semibold text-primary-text">
                Persisted Research Archive
              </h3>
            </div>
            <span className="text-xs text-secondary-text">
              {history.length} sessions stored in local database
            </span>
          </div>

          <div className="divide-y divide-border">
            {history.map((hist) => {
              const isSelected = currentResponse?.research_id === hist.research_id;
              return (
                <div
                  key={hist.research_id}
                  className={`py-3 px-3 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 transition-colors ${
                    isSelected ? "bg-soft-accent/40 border border-primary-accent/30" : "hover:bg-subtle-surface"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs font-semibold text-primary-accent shrink-0">
                      {hist.research_id}
                    </span>
                    <span className="text-sm font-medium text-primary-text truncate max-w-md">
                      {hist.query}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                      hist.connection_mode === "LIVE_TINYFISH"
                        ? "bg-success-bg text-success"
                        : "bg-subtle-surface text-secondary-text border border-border"
                    }`}>
                      {hist.connection_mode === "LIVE_TINYFISH" ? "LIVE" : "SIMULATED"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-xs">
                    <span className="text-muted-text">
                      {new Date(hist.timestamp).toLocaleDateString([], { month: "short", day: "numeric" })}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentResponse(hist);
                        setQuery(hist.query);
                      }}
                      className="px-3 py-1 rounded-lg border border-border bg-primary-surface hover:bg-primary-accent hover:text-on-primary text-secondary-text font-semibold transition-colors"
                    >
                      Review
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* API Configuration & Setup Modal */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 z-50 bg-primary-text/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-primary-surface border border-border rounded-2xl max-w-xl w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-soft-accent text-primary-accent flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">key</span>
                </div>
                <h3 className="font-section-heading text-section-heading font-semibold text-primary-text">
                  TinyFish API Credentials
                </h3>
              </div>
              <button
                onClick={() => setIsConfigModalOpen(false)}
                className="text-secondary-text hover:text-primary-text"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <p className="text-xs text-secondary-text leading-relaxed">
              TinyFish enables autonomous browser agents and structured search for public supply chain notices. Credentials remain strictly server-side and are never exposed to client browsers.
            </p>

            <div className="bg-subtle-surface rounded-xl p-3 border border-border space-y-2 text-xs font-mono">
              <span className="text-secondary-text font-semibold uppercase text-[10px] block">
                Configure in backend/.env:
              </span>
              <p className="text-primary-text">
                TINYFISH_API_KEY=&quot;tf_live_your_api_key_here&quot;
              </p>
              <p className="text-muted-text text-[11px]">
                # Retrieve from: https://agent.tinyfish.ai/api-keys
              </p>
            </div>

            <div className="space-y-2 text-xs text-secondary-text">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-success text-[16px]">check_circle</span>
                <span>Supported SDK: <code>tinyfish</code> v0.9.0 Python package installed in backend.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-success text-[16px]">check_circle</span>
                <span>Server-side secrets protection: No keys sent to browser or recorded in logs.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-success text-[16px]">check_circle</span>
                <span>Pre-computed scenario fallback enabled for offline development and testing.</span>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
              <button
                onClick={() => setIsConfigModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-primary-accent text-on-primary font-button-input text-xs font-semibold hover:bg-primary transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

export default function WebResearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-app-background flex items-center justify-center p-8">
        <div className="flex items-center gap-2 text-primary-accent text-sm font-medium">
          <span className="material-symbols-outlined animate-spin">progress_activity</span>
          <span>Loading Web Research workspace...</span>
        </div>
      </div>
    }>
      <ResearchContent />
    </Suspense>
  );
}
