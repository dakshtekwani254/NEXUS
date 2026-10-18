"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Port, Route, DisruptionEvent, Shipment } from "@/lib/types";
import { api } from "@/lib/api";
import { 
  Anchor, 
  Compass, 
  Clock, 
  CloudRain, 
  ChevronRight, 
  Search,
  RefreshCw,
  AlertTriangle
} from "lucide-react";
import { PortDetailDrawer } from "@/components/PortDetailDrawer";
import { ShipmentDetailModal } from "@/components/ShipmentDetailModal";

interface PortsRoutesViewProps {
  ports?: Port[];
  routes?: Route[];
  disruptions?: DisruptionEvent[];
  shipments?: Shipment[];
  onSelectPort?: (port: Port) => void;
}

export const PortsRoutesView: React.FC<PortsRoutesViewProps> = ({
  ports: initialPorts,
  routes: initialRoutes,
  disruptions: initialDisruptions,
  shipments: initialShipments,
  onSelectPort
}) => {
  const [ports, setPorts] = useState<Port[]>(initialPorts || []);
  const [routes, setRoutes] = useState<Route[]>(initialRoutes || []);
  const [disruptions, setDisruptions] = useState<DisruptionEvent[]>(initialDisruptions || []);
  const [shipments, setShipments] = useState<Shipment[]>(initialShipments || []);
  const [loading, setLoading] = useState<boolean>(!initialPorts || !initialRoutes);
  const [error, setError] = useState<string | null>(null);

  const [selectedPort, setSelectedPort] = useState<Port | null>(null);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"ports" | "routes">("ports");

  // Fetch data if not passed via props
  useEffect(() => {
    if (initialPorts && initialRoutes) {
      setPorts(initialPorts);
      setRoutes(initialRoutes);
      if (initialDisruptions) setDisruptions(initialDisruptions);
      if (initialShipments) setShipments(initialShipments);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    Promise.all([
      api.getPorts().catch(() => []),
      api.getRoutes().catch(() => []),
      api.getDisruptions().catch(() => []),
      api.getShipments().catch(() => ({ shipments: [] })),
    ])
      .then(([p, r, d, s]) => {
        if (!isMounted) return;
        setPorts(Array.isArray(p) ? p : []);
        setRoutes(Array.isArray(r) ? r : []);
        setDisruptions(Array.isArray(d) ? d : []);
        const sList = Array.isArray(s) ? s : (s?.shipments || []);
        setShipments(sList);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("PortsRoutesView data load error:", err);
        setError("Unable to load maritime ports & routes telemetry. Please verify backend connection.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [initialPorts, initialRoutes, initialDisruptions, initialShipments]);

  // Safe arrays
  const safePorts = Array.isArray(ports) ? ports : [];
  const safeRoutes = Array.isArray(routes) ? routes : [];

  // Filter Ports with safe optional field validation
  const filteredPorts = safePorts.filter((p) => {
    if (!p) return false;
    const name = typeof p.name === "string" ? p.name.toLowerCase() : "";
    const code = typeof p.code === "string" ? p.code.toLowerCase() : "";
    const country = typeof p.country === "string" ? p.country.toLowerCase() : "";
    const q = (search || "").toLowerCase().trim();
    if (!q) return true;
    return name.includes(q) || code.includes(q) || country.includes(q);
  });

  // Filter Routes with safe optional field validation
  const filteredRoutes = safeRoutes.filter((r) => {
    if (!r) return false;
    const name = typeof r.name === "string" ? r.name.toLowerCase() : "";
    const id = typeof r.id === "string" ? r.id.toLowerCase() : "";
    const status = typeof r.status === "string" ? r.status.toLowerCase() : "";
    const q = (search || "").toLowerCase().trim();
    if (!q) return true;
    return name.includes(q) || id.includes(q) || status.includes(q);
  });

  const handlePortClick = (port: Port) => {
    setSelectedPort(port);
    if (onSelectPort) {
      onSelectPort(port);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-secondary-text flex flex-col items-center justify-center gap-3 bg-primary-surface border border-border rounded-xl">
        <RefreshCw className="w-5 h-5 text-primary-accent animate-spin" />
        <span className="font-medium text-primary-text text-[14px]">
          Loading maritime ports &amp; corridor telemetry...
        </span>
        <span className="text-[12px] text-muted-text">
          Connecting to live AIS telemetry receivers and meteorological feeds
        </span>
      </div>
    );
  }

  if (error && safePorts.length === 0 && safeRoutes.length === 0) {
    return (
      <div className="p-12 text-center bg-primary-surface border border-border rounded-xl">
        <AlertTriangle className="w-8 h-8 text-high-risk mx-auto mb-3" />
        <h4 className="text-[16px] font-semibold text-primary-text mb-1">Telemetry Unavailable</h4>
        <p className="text-[13px] text-secondary-text mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-xl bg-primary-accent hover:bg-primary text-on-primary text-[13px] font-medium transition-colors"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sub Header & Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("ports")}
            className={`px-3.5 py-2 rounded-xl text-[13px] font-semibold transition flex items-center gap-2 cursor-pointer shadow-2xs ${
              activeTab === "ports"
                ? "bg-primary-accent text-on-primary"
                : "bg-primary-surface text-secondary-text hover:text-primary-text border border-border hover:bg-subtle-surface"
            }`}
          >
            <Anchor className="w-4 h-4" />
            <span>Monitored Seaports ({safePorts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("routes")}
            className={`px-3.5 py-2 rounded-xl text-[13px] font-semibold transition flex items-center gap-2 cursor-pointer shadow-2xs ${
              activeTab === "routes"
                ? "bg-primary-accent text-on-primary"
                : "bg-primary-surface text-secondary-text hover:text-primary-text border border-border hover:bg-subtle-surface"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Corridors &amp; Route Alternatives ({safeRoutes.length})</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-muted-text absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={activeTab === "ports" ? "Search ports, code, country..." : "Search corridors, ID, status..."}
            className="w-full bg-primary-surface border border-border text-[13px] text-primary-text rounded-xl pl-9 pr-3 py-2 focus:outline-hidden focus:border-primary-accent transition-colors"
          />
        </div>
      </div>

      {/* Ports Grid */}
      {activeTab === "ports" && (
        <>
          {filteredPorts.length === 0 ? (
            <div className="p-12 text-center bg-primary-surface border border-border rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-subtle-surface border border-border flex items-center justify-center text-muted-text mx-auto mb-3">
                <Anchor className="w-6 h-6 text-secondary-text" />
              </div>
              <h4 className="text-[15px] font-semibold text-primary-text mb-1">No Seaports Found</h4>
              <p className="text-[13px] text-secondary-text mb-4">
                {search
                  ? `No ports matched "${search}". Try adjusting your search query.`
                  : "No monitored seaports are currently registered in this workspace."}
              </p>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="px-3.5 py-1.5 rounded-xl bg-primary-accent text-on-primary text-[12px] font-medium"
                >
                  Clear Search Filter
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredPorts.map((port, idx) => {
                const score = typeof port.risk_score === "number" ? port.risk_score : 0;
                const isHigh = score >= 70;
                const isMed = score >= 40 && score < 70;
                const riskColor = isHigh
                  ? "text-high-risk"
                  : isMed
                  ? "text-medium-risk"
                  : "text-success";
                const riskBadgeBg = isHigh
                  ? "bg-high-risk-bg text-high-risk"
                  : isMed
                  ? "bg-medium-risk-bg text-medium-risk"
                  : "bg-success-bg text-success";

                const notices = Array.isArray(port.active_notices) ? port.active_notices : [];
                const firstNotice = notices[0] || "All terminal berths and navigation channels normal.";
                const dataSource = typeof port.data_source === "string" 
                  ? port.data_source.split("+")[0] 
                  : "AIS Telemetry";

                return (
                  <div
                    key={port.code || `port-${idx}`}
                    onClick={() => handlePortClick(port)}
                    className="p-5 rounded-xl bg-primary-surface border border-border hover:border-strong-border transition-colors duration-150 cursor-pointer space-y-4 group shadow-2xs"
                  >
                    {/* Port Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[12px] px-2 py-0.5 rounded-md bg-subtle-surface text-primary-accent font-semibold border border-border">
                            {port.code}
                          </span>
                          <h3 className="text-[15px] font-semibold text-primary-text group-hover:text-primary-accent transition-colors">
                            {port.name}
                          </h3>
                        </div>
                        <span className="text-[12px] text-muted-text mt-1 block">{port.country}</span>
                      </div>
                      <div className="text-right">
                        <div className={`text-[24px] font-bold font-mono tracking-tight ${riskColor}`}>
                          {score}
                          <span className="text-[12px] text-muted-text font-sans">/100</span>
                        </div>
                        <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md ${riskBadgeBg}`}>
                          {port.severity || (isHigh ? "HIGH" : isMed ? "MEDIUM" : "LOW")} RISK
                        </span>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-3 rounded-lg bg-subtle-surface border border-border">
                        <div className="flex items-center justify-between text-muted-text">
                          <span className="text-[11px]">Avg Berth Dwell</span>
                          <Clock className="w-3.5 h-3.5 text-primary-accent" />
                        </div>
                        <span className="text-[14px] font-bold font-mono text-primary-text mt-1 block">
                          {port.avg_berth_wait_hours ?? 0}h
                        </span>
                      </div>

                      <div className="p-3 rounded-lg bg-subtle-surface border border-border">
                        <div className="flex items-center justify-between text-muted-text">
                          <span className="text-[11px]">Weather Index</span>
                          <CloudRain className="w-3.5 h-3.5 text-primary-accent" />
                        </div>
                        <span className="text-[14px] font-bold font-mono text-primary-text mt-1 block">
                          {port.weather_score ?? 0}/100
                        </span>
                      </div>
                    </div>

                    {/* Active Notice Teaser */}
                    <div className="text-[12px] text-secondary-text line-clamp-2 leading-relaxed bg-subtle-surface p-3 rounded-lg border border-border">
                      {firstNotice}
                    </div>

                    {/* Footer */}
                    <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-text">
                      <span>Source: {dataSource}</span>
                      <div className="flex items-center gap-2.5">
                        <Link
                          href={`/research?port=${port.code}&q=${encodeURIComponent(`${port.name} port congestion and vessel delays`)}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-primary-accent font-semibold hover:underline"
                        >
                          <span className="material-symbols-outlined text-[14px]">radar</span>
                          <span>Research Port</span>
                        </Link>
                        <span className="text-border">|</span>
                        <Link
                          href={`/ports/${port.code}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-primary-accent font-semibold hover:underline"
                        >
                          Dedicated Page →
                        </Link>
                        <div className="flex items-center gap-1 text-primary-accent font-medium group-hover:translate-x-0.5 transition-transform">
                          <span>Quick View</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Routes & Alternatives View */}
      {activeTab === "routes" && (
        <>
          {filteredRoutes.length === 0 ? (
            <div className="p-12 text-center bg-primary-surface border border-border rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-subtle-surface border border-border flex items-center justify-center text-muted-text mx-auto mb-3">
                <Compass className="w-6 h-6 text-secondary-text" />
              </div>
              <h4 className="text-[15px] font-semibold text-primary-text mb-1">No Corridors Found</h4>
              <p className="text-[13px] text-secondary-text mb-4">
                {search
                  ? `No routes matched "${search}". Try adjusting your search query.`
                  : "No shipping corridors are currently registered in this workspace."}
              </p>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="px-3.5 py-1.5 rounded-xl bg-primary-accent text-on-primary text-[12px] font-medium"
                >
                  Clear Search Filter
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredRoutes.map((rt) => {
                const riskScore = typeof rt.current_risk_score === "number" ? rt.current_risk_score : 0;
                const waypointsCount = Array.isArray(rt.waypoints) ? rt.waypoints.length : 0;
                const alternatives = Array.isArray(rt.alternatives) ? rt.alternatives : [];
                const isHighRisk = riskScore >= 70;

                return (
                  <div key={rt.id} className="p-5 rounded-xl bg-primary-surface border border-border space-y-4 shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[12px] px-2 py-0.5 rounded-md bg-subtle-surface text-primary-accent font-semibold border border-border">
                            {rt.id}
                          </span>
                          <h3 className="text-[15px] font-semibold text-primary-text">{rt.name}</h3>
                        </div>
                        <span className="text-[12px] text-muted-text mt-1 block">
                          Baseline Transit: <strong className="text-primary-text">{rt.baseline_days ?? 0} days</strong> • Waypoints: {waypointsCount} geodesics
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[10px] text-muted-text uppercase tracking-wider font-semibold block">Corridor Risk</span>
                          <div className={`text-[22px] font-bold font-mono tracking-tight ${isHighRisk ? "text-high-risk" : "text-medium-risk"}`}>
                            {riskScore} / 100
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/research?route=${encodeURIComponent(rt.name)}&q=${encodeURIComponent(`${rt.name} shipping corridor weather delays and carrier rerouting`)}&category=route`}
                              className="text-xs font-semibold text-primary-accent hover:underline flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-[14px]">travel_explore</span>
                              <span>Research</span>
                            </Link>
                            <span className="text-border">|</span>
                            <Link
                              href={`/routes/${rt.id}`}
                              className="text-xs font-semibold text-primary-accent hover:underline flex items-center gap-0.5"
                            >
                              <span>Inspect</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                          <span
                            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                              isHighRisk
                                ? "bg-high-risk-bg text-high-risk"
                                : "bg-medium-risk-bg text-medium-risk"
                            }`}
                          >
                            {rt.status || (isHighRisk ? "HIGH FRICTION" : "MODERATE")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Alternatives Benchmarking */}
                    <div>
                      <h4 className="text-[12px] font-semibold uppercase tracking-wider text-primary-accent mb-2.5">
                        Evaluated Alternative Routing Options
                      </h4>
                      {alternatives.length === 0 ? (
                        <p className="text-[13px] text-muted-text bg-subtle-surface p-3 rounded-lg border border-border">
                          No operational deviation currently necessary for this corridor.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {alternatives.map((alt, idx) => (
                            <div key={idx} className="p-4 rounded-xl bg-subtle-surface border border-border space-y-2">
                              <div className="flex items-center justify-between">
                                <h5 className="text-[13px] font-semibold text-primary-text">{alt.name}</h5>
                                <span
                                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                                    (alt.risk_score ?? 0) < 50
                                      ? "bg-success-bg text-success"
                                      : "bg-medium-risk-bg text-medium-risk"
                                  }`}
                                >
                                  Risk: {alt.risk_score ?? 0}/100
                                </span>
                              </div>
                              <p className="text-[12px] text-secondary-text leading-relaxed">{alt.description}</p>
                              <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] font-mono">
                                <span className="text-primary-text">Transit: <strong>{alt.transit_days ?? 0} days</strong></span>
                                <span className="text-medium-risk font-semibold">Cost Delta: +${(alt.additional_cost_usd ?? 0).toLocaleString()} USD</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Port Drawer */}
      <PortDetailDrawer
        port={selectedPort}
        onClose={() => setSelectedPort(null)}
        disruptions={disruptions}
        shipments={shipments}
        onSelectShipment={(s) => {
          setSelectedPort(null);
          setSelectedShipment(s);
        }}
      />

      {/* Shipment Modal */}
      <ShipmentDetailModal
        shipment={selectedShipment}
        onClose={() => setSelectedShipment(null)}
        disruptions={disruptions}
      />
    </div>
  );
};
