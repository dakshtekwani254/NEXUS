"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { AgentJob } from "@/lib/types";
import { DEMO_AGENTS } from "@/lib/demoData";

interface AgentCenterViewProps {
  onRefresh?: () => Promise<void>;
}

export const AgentCenterView: React.FC<AgentCenterViewProps> = ({ onRefresh }) => {
  const [sources, setSources] = useState<any[]>([]);
  const [jobs, setJobs] = useState<AgentJob[]>([]);
  const [runningSourceId, setRunningSourceId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "PAUSED">("ALL");
  const [search, setSearch] = useState("");
  const [activeLogs, setActiveLogs] = useState<string[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [srcRes, jobsRes] = await Promise.all([
        api.getAgentSources(),
        api.getAgentJobs(),
      ]);
      setSources(srcRes);
      setJobs(jobsRes);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTriggerAgent = async (sourceId: string) => {
    setRunningSourceId(sourceId);
    setActiveLogs([
      `[TinyFish Dispatcher] Queuing execution task for source ${sourceId}...`,
      `[TinyFish Dispatcher] Launching Chromium instance with secure sandbox context...`,
    ]);

    try {
      const newJob = await api.triggerAgent(sourceId);
      setActiveLogs(newJob.logs);
      await loadData();
      if (onRefresh) await onRefresh();
    } catch (err: any) {
      setActiveLogs((prev) => [...prev, `[TinyFish Error] Task failed: ${err.message}`]);
    } finally {
      setRunningSourceId(null);
    }
  };

  const filteredAgents = DEMO_AGENTS.filter((a) => {
    const matchFilter =
      filter === "ALL" ||
      (filter === "ACTIVE" && a.status === "ACTIVE") ||
      (filter === "PAUSED" && a.status === "PAUSED");
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase()) ||
      (a.scope || a.category || "").toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* 1. Operational Guardrail Note Banner */}
      <section className="bg-subtle-surface border border-border rounded-xl p-3 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-primary-accent text-[20px]">info</span>
          <p className="font-body text-body text-primary-text">
            Agents monitor conditions, extract real-time web bulletins, and surface recommendations. Operational overrides require human supervisor approval.
          </p>
        </div>
        <span className="text-secondary-text font-metadata text-metadata whitespace-nowrap ml-4 font-medium">
          Supervised Mode Active
        </span>
      </section>

      {/* 2. Summary KPI Cards (4 in one row) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-primary-surface border border-border rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-secondary-text">
            <span className="font-metadata text-metadata font-medium">Total Agents</span>
            <span className="material-symbols-outlined text-secondary-text text-[18px]">smart_toy</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-kpi-value text-kpi-value text-primary-text">{DEMO_AGENTS.length}</span>
          </div>
          <p className="font-metadata text-metadata text-secondary-text mt-1">Configured agents</p>
        </div>

        <div className="bg-primary-surface border border-border rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-secondary-text">
            <span className="font-metadata text-metadata font-medium">Active</span>
            <span className="w-2.5 h-2.5 rounded-full bg-success"></span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-kpi-value text-kpi-value text-primary-text">
              {DEMO_AGENTS.filter((a) => a.status === "ACTIVE").length}
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-success-bg text-success">
              Healthy
            </span>
          </div>
          <p className="font-metadata text-metadata text-secondary-text mt-1">Currently enabled</p>
        </div>

        <div className="bg-primary-surface border border-border rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-secondary-text">
            <span className="font-metadata text-metadata font-medium">Tasks Running</span>
            <span className="material-symbols-outlined text-primary-accent text-[18px]">sync</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-kpi-value text-kpi-value text-primary-text">3</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-soft-accent text-primary-accent">
              Processing
            </span>
          </div>
          <p className="font-metadata text-metadata text-secondary-text mt-1">In progress</p>
        </div>

        <div className="bg-primary-surface border border-border rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-secondary-text">
            <span className="font-metadata text-metadata font-medium">Actions Requiring Review</span>
            <span className="material-symbols-outlined text-medium-risk text-[18px]">pending_actions</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-kpi-value text-kpi-value text-primary-text">4</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-medium-risk-bg text-medium-risk">
              Action needed
            </span>
          </div>
          <p className="font-metadata text-metadata text-secondary-text mt-1">Awaiting approval</p>
        </div>
      </section>

      {/* 3. Live Crawler Action Strip (TinyFish Backend Integration) */}
      <section className="bg-primary-surface border border-border rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-section-heading text-section-heading text-primary-text">TinyFish Autonomous Browser Agents</h3>
            <p className="font-metadata text-metadata text-secondary-text">Trigger headless Chromium agent crawlers against live port authority portals.</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-soft-accent text-primary-accent border border-primary-accent/20">
            FastAPI Backend Connected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {sources.map((src) => (
            <div key={src.id} className="p-3 bg-subtle-surface border border-border rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-primary-text block">{src.name}</span>
                <span className="text-[11px] text-muted-text">{src.port_or_corridor}</span>
              </div>
              <div className="mt-3 pt-2 border-t border-border flex items-center justify-between">
                <span className="text-[11px] text-secondary-text font-mono">{src.cadence_minutes}m cadence</span>
                <button
                  onClick={() => handleTriggerAgent(src.id)}
                  disabled={runningSourceId === src.id}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-primary-accent text-on-primary hover:bg-primary transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  {runningSourceId === src.id ? (
                    <>
                      <span className="material-symbols-outlined text-[13px] animate-spin">refresh</span>
                      <span>Crawling...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[13px]">play_arrow</span>
                      <span>Trigger Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Live Execution Logs Terminal */}
        {activeLogs.length > 0 && (
          <div className="mt-3 p-3 bg-primary-text text-on-primary rounded-xl font-mono text-[11px] space-y-1 max-h-36 overflow-y-auto">
            <div className="text-muted-text font-bold mb-1">// REAL-TIME TINYFISH DISPATCHER LOG STREAM</div>
            {activeLogs.map((log, i) => (
              <div key={i} className="text-emerald-400">{log}</div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Your Configured Agents Section */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="font-section-heading text-section-heading text-primary-text">Your Agents</h2>
            <p className="font-metadata text-metadata text-secondary-text">Review the autonomous agents configured for your supply chain workflows.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-subtle-surface p-1 rounded-xl border border-border">
              <button
                onClick={() => setFilter("ALL")}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  filter === "ALL" ? "bg-primary-surface text-primary-text shadow-xs border border-border" : "text-secondary-text hover:text-primary-text"
                }`}
              >
                All agents ({DEMO_AGENTS.length})
              </button>
              <button
                onClick={() => setFilter("ACTIVE")}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  filter === "ACTIVE" ? "bg-primary-surface text-primary-text shadow-xs border border-border" : "text-secondary-text hover:text-primary-text"
                }`}
              >
                Active ({DEMO_AGENTS.filter((a) => a.status === "ACTIVE").length})
              </button>
              <button
                onClick={() => setFilter("PAUSED")}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  filter === "PAUSED" ? "bg-primary-surface text-primary-text shadow-xs border border-border" : "text-secondary-text hover:text-primary-text"
                }`}
              >
                Paused ({DEMO_AGENTS.filter((a) => a.status === "PAUSED").length})
              </button>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-secondary-text text-[18px]">search</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search agents..."
                className="pl-8 pr-3 py-1.5 bg-primary-surface border border-border rounded-xl text-xs text-primary-text placeholder-secondary-text focus:outline-none focus:border-primary-accent w-48"
              />
            </div>
          </div>
        </div>

        {/* 2x2 Grid of Primary Agent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAgents.map((agent) => (
            <div
              key={agent.id}
              className="bg-primary-surface border border-border rounded-xl p-5 flex flex-col justify-between hover:border-strong-border transition-colors shadow-2xs"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-soft-accent text-primary-accent flex items-center justify-center border border-border">
                      <span className="material-symbols-outlined">
                        {agent.id === "disruption-monitor"
                          ? "radar"
                          : agent.id === "shipment-risk-analyst"
                          ? "analytics"
                          : agent.id === "route-optimization-advisor"
                          ? "alt_route"
                          : "anchor"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <h3 className="font-button-input text-section-heading text-primary-text font-semibold">{agent.name}</h3>
                      <span className="font-metadata text-metadata text-secondary-text">Last active {agent.lastActive || agent.last_run}</span>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-table-text-medium font-table-text-medium ${
                    agent.status === "ACTIVE" ? "bg-success-bg text-success" : "bg-subtle-surface text-muted-text"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${agent.status === "ACTIVE" ? "bg-success" : "bg-muted-text"}`} />
                    {agent.status}
                  </span>
                </div>

                <p className="font-body text-body text-secondary-text text-[13px] leading-relaxed">
                  {agent.description}
                </p>

                {/* Current Task Block */}
                <div className="bg-subtle-surface border border-border rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary-accent text-[18px] animate-spin">progress_activity</span>
                    <div className="flex flex-col">
                      <span className="font-metadata text-[10px] text-secondary-text uppercase tracking-wider font-semibold">Current Task</span>
                      <span className="font-table-text-medium text-table-text-medium text-primary-text font-medium">{agent.currentTask || "Monitoring maritime data feeds"}</span>
                    </div>
                  </div>
                  <span className="font-metadata text-metadata text-secondary-text">Running</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border font-metadata text-metadata text-secondary-text">
                  <div><span className="text-secondary-text">Scope:</span> <span className="font-table-text-medium text-primary-text font-medium">{agent.scope || agent.category}</span></div>
                  <div><span className="text-secondary-text">Mode:</span> <span className="font-table-text-medium text-primary-text font-medium">{agent.mode || "Autonomous Crawler"}</span></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 mt-3 border-t border-border">
                <Link
                  href={`/agent-center/${agent.id}`}
                  className="px-3.5 py-1.5 bg-primary-surface border border-border text-primary-text hover:bg-subtle-surface font-button-input text-xs font-semibold rounded-xl transition-colors"
                >
                  View details
                </Link>
                <button className="text-secondary-text hover:text-high-risk font-button-input text-xs font-medium px-2 py-1">
                  {agent.status === "ACTIVE" ? "Pause Agent" : "Resume Agent"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
