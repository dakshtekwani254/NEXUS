"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Alert, DisruptionEvent, Shipment, AlertStatus, EventCategory } from "@/lib/types";
import { api } from "@/lib/api";
import { DEMO_DISRUPTIONS } from "@/lib/demoData";

interface AlertsViewProps {
  shipments?: Shipment[];
  disruptions?: DisruptionEvent[];
  onRefresh?: () => Promise<void>;
  onSelectDisruption?: (d: DisruptionEvent) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  shipments = [],
  disruptions = [],
  onRefresh,
}) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [tab, setTab] = useState<"ALL" | "UNREAD" | "CRITICAL">("ALL");
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const loadAlerts = async () => {
    try {
      const res = await api.getAlerts();
      setAlerts(res);
    } catch {
      // Use demo alerts fallback
      const mapped = DEMO_DISRUPTIONS.map((d: any, i) => ({
        id: d.id,
        title: d.headline || d.title || "Supply Disruption Notice",
        description: d.description,
        severity: d.severity,
        status: (i < 2 ? "ACTIVE" : "RESOLVED") as AlertStatus,
        affected_location: d.location || "Global Corridor",
        event_category: "PORT_CONGESTION" as EventCategory,
        related_shipments: ["SHP-10482", "SHP-10517"],
        risk_score: 85,
        source_evidence: d.description,
        timestamp: "18 Oct 2026, 10:42 AM",
        created_at: "18 Oct 2026, 10:42 AM",
        category: "Port Congestion",
      }));
      setAlerts(mapped as Alert[]);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleAcknowledge = async (id: string) => {
    try {
      await api.acknowledgeAlert(id);
    } catch {
      // optimistic update
    }
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "ACKNOWLEDGED" } : a))
    );
    if (onRefresh) await onRefresh();
  };

  const handleMarkAllRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, status: "RESOLVED" })));
  };

  const filtered = alerts.filter((a) => {
    const matchTab =
      tab === "ALL" ||
      (tab === "UNREAD" && a.status === "ACTIVE") ||
      (tab === "CRITICAL" && (a.severity === "CRITICAL" || a.severity === "HIGH"));
    const matchSev = severityFilter === "ALL" || a.severity === severityFilter;
    const matchStatus = statusFilter === "ALL" || a.status === statusFilter;
    const term = search.toLowerCase();
    const matchSearch =
      (a.title || "").toLowerCase().includes(term) ||
      (a.description || "").toLowerCase().includes(term) ||
      (a.affected_location || "").toLowerCase().includes(term) ||
      (a.id || "").toLowerCase().includes(term);
    return matchTab && matchSev && matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* 4 KPI CARDS ROW */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-primary-surface rounded-xl border border-border p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-metadata text-metadata text-secondary-text uppercase tracking-wider font-medium">Total Alerts</span>
            <span className="material-symbols-outlined text-secondary-text text-[18px]">layers</span>
          </div>
          <div>
            <div className="font-kpi-value text-kpi-value text-primary-text tracking-tight font-semibold">
              {alerts.length > 0 ? alerts.length : 24}
            </div>
            <p className="font-metadata text-metadata text-muted-text mt-1">Across monitored operations</p>
          </div>
        </div>

        <div className="bg-primary-surface rounded-xl border border-border p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-metadata text-metadata text-secondary-text uppercase tracking-wider font-medium">Unread</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold bg-soft-accent text-primary-accent">8 New</span>
          </div>
          <div>
            <div className="font-kpi-value text-kpi-value text-primary-accent tracking-tight font-semibold">8</div>
            <p className="font-metadata text-metadata text-muted-text mt-1">Awaiting review</p>
          </div>
        </div>

        <div className="bg-primary-surface rounded-xl border border-border p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-metadata text-metadata text-secondary-text uppercase tracking-wider font-medium">Critical</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold bg-high-risk-bg text-high-risk">Action Required</span>
          </div>
          <div>
            <div className="font-kpi-value text-kpi-value text-high-risk tracking-tight font-semibold">3</div>
            <p className="font-metadata text-metadata text-muted-text mt-1">Require immediate attention</p>
          </div>
        </div>

        <div className="bg-primary-surface rounded-xl border border-border p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-metadata text-metadata text-secondary-text uppercase tracking-wider font-medium">Resolved</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold bg-success-bg text-success">Last 7d</span>
          </div>
          <div>
            <div className="font-kpi-value text-kpi-value text-primary-text tracking-tight font-semibold">16</div>
            <p className="font-metadata text-metadata text-muted-text mt-1">Marked as resolved</p>
          </div>
        </div>
      </section>

      {/* Filter & Action Toolbar */}
      <section className="bg-primary-surface border border-border rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 flex-wrap">
          <div className="relative w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-text text-[18px]">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search alerts, ports, or IDs..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-subtle-surface border border-border rounded-lg text-primary-text placeholder-muted-text focus:outline-none focus:border-primary-accent"
            />
          </div>

          <div className="h-6 w-px bg-border hidden sm:block"></div>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-primary-surface border border-border rounded-lg text-primary-text cursor-pointer focus:outline-none focus:border-primary-accent"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-primary-surface border border-border rounded-lg text-primary-text cursor-pointer focus:outline-none focus:border-primary-accent"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="ACKNOWLEDGED">Acknowledged</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-border bg-primary-surface text-primary-text font-button-input text-xs hover:bg-subtle-surface transition-colors whitespace-nowrap self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-[16px] text-secondary-text">done_all</span>
          <span>Mark all as read</span>
        </button>
      </section>

      {/* Alert Feed Panel */}
      <section className="bg-primary-surface rounded-xl border border-border overflow-hidden shadow-2xs">
        <div className="px-6 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-section-heading text-section-heading font-semibold text-primary-text">Recent Alerts</h2>
            <p className="font-metadata text-metadata text-secondary-text mt-0.5">Review events and potential disruptions across your supply chain.</p>
          </div>
          <div className="flex items-center p-1 bg-subtle-surface rounded-lg border border-border gap-1">
            <button
              onClick={() => setTab("ALL")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                tab === "ALL" ? "bg-primary-accent text-on-primary" : "text-secondary-text hover:text-primary-text"
              }`}
            >
              All alerts ({alerts.length || 24})
            </button>
            <button
              onClick={() => setTab("UNREAD")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                tab === "UNREAD" ? "bg-primary-accent text-on-primary" : "text-secondary-text hover:text-primary-text"
              }`}
            >
              Unread (8)
            </button>
            <button
              onClick={() => setTab("CRITICAL")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                tab === "CRITICAL" ? "bg-primary-accent text-on-primary" : "text-secondary-text hover:text-primary-text"
              }`}
            >
              Critical (3)
            </button>
          </div>
        </div>

        <div className="divide-y divide-border">
          {filtered.map((item) => {
            const isUnread = item.status === "ACTIVE";
            const isHigh = item.severity === "HIGH" || item.severity === "CRITICAL";

            return (
              <div key={item.id} className="p-5 flex items-start gap-4 hover:bg-subtle-surface/50 transition-colors group">
                <div className="flex items-center gap-3 pt-0.5 min-w-[90px] shrink-0">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${isUnread ? "bg-primary-accent" : "bg-transparent"}`}
                    title={isUnread ? "Unread" : "Read"}
                  />
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                      isHigh
                        ? "bg-high-risk-bg text-high-risk"
                        : item.severity === "MEDIUM"
                        ? "bg-medium-risk-bg text-medium-risk"
                        : "bg-success-bg text-success"
                    }`}
                  >
                    {item.severity}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/alerts/${item.id}`}
                      className="font-button-input text-button-input font-semibold text-primary-text hover:text-primary-accent"
                    >
                      {item.title}
                    </Link>
                  </div>
                  <p className="font-body text-body text-secondary-text mt-1 leading-normal">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2.5">
                    {item.affected_location && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-subtle-surface border border-border text-primary-text">
                        <span className="material-symbols-outlined text-[14px] text-secondary-text">anchor</span>
                        {item.affected_location}
                      </span>
                    )}
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-subtle-surface border border-border text-secondary-text">
                      32 affected shipments
                    </span>
                    <span className="text-xs text-muted-text flex items-center gap-1 ml-1">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      {item.timestamp || "18 Oct, 10:42 AM"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleAcknowledge(item.id)}
                    className="px-3 py-1.5 rounded-lg border border-border bg-primary-surface text-primary-text font-button-input text-xs hover:bg-subtle-surface transition-colors"
                  >
                    {item.status === "ACKNOWLEDGED" ? "Acknowledged" : "Acknowledge"}
                  </button>
                  <Link
                    href={`/alerts/${item.id}`}
                    className="px-3 py-1.5 rounded-lg bg-soft-accent text-primary-accent font-button-input text-xs hover:bg-primary-accent hover:text-on-primary transition-colors"
                  >
                    Inspect Detail →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
