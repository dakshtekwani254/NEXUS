"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { AppShell } from "@/components/AppShell";
import { KPICards } from "@/components/KPICards";
import { ShipmentRiskTable } from "@/components/ShipmentRiskTable";
import { LiveDisruptionFeed } from "@/components/LiveDisruptionFeed";
import { PortDetailDrawer } from "@/components/PortDetailDrawer";
import { ShipmentDetailModal } from "@/components/ShipmentDetailModal";
import { DisruptionDetailModal } from "@/components/DisruptionDetailModal";
import { AddShipmentModal } from "@/components/AddShipmentModal";
import { CSVImportModal } from "@/components/CSVImportModal";
import { api } from "@/lib/api";
import {
  DashboardSummaryResponse,
  Port,
  Shipment,
  DisruptionEvent,
} from "@/lib/types";

// Dynamically import GlobalMap to avoid any Leaflet SSR issues
const GlobalMap = dynamic(
  () => import("@/components/GlobalMap").then((mod) => mod.GlobalMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[480px] bg-subtle-surface rounded-xl border border-border flex flex-col items-center justify-center text-xs text-secondary-text gap-2">
        <span className="material-symbols-outlined text-primary-accent text-[28px] animate-spin">
          sync
        </span>
        <span>Initializing Global Shipping Telemetry Radar...</span>
      </div>
    ),
  }
);

export default function OverviewPage() {
  const [data, setData] = useState<DashboardSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals & Panels
  const [selectedPort, setSelectedPort] = useState<Port | null>(null);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [selectedDisruption, setSelectedDisruption] = useState<DisruptionEvent | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  // Load Dashboard Data
  const loadDashboardData = useCallback(async () => {
    try {
      const summaryRes = await api.getDashboardSummary();
      setData(summaryRes);
    } catch (err) {
      console.warn("Backend summary fetch fallback:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleExportCSV = () => {
    window.open("http://127.0.0.1:8000/api/shipments/export-csv", "_blank");
  };

  const activeShipments = data?.recent_shipments || [];
  const activeDisruptions = data?.top_disruptions || [];
  const activePorts = data?.ports || [];

  return (
    <AppShell
      title="Overview"
      subtitle="Your supply chain, one step ahead."
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-accent hover:bg-primary text-on-primary text-[13px] font-medium transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span className="hidden sm:inline">Add Shipment</span>
          </button>
          <button
            onClick={() => setIsImportOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-primary-surface hover:bg-subtle-surface text-secondary-text hover:text-primary-text text-[13px] font-medium transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">upload_file</span>
            <span className="hidden sm:inline">Import CSV</span>
          </button>
        </div>
      }
    >
      {/* 1. KPI Cards Row (from Stitch Overview mockup) */}
      <KPICards kpis={data?.kpis} />

      {/* 2. Global Radar Map Container */}
      <section className="bg-primary-surface border border-border rounded-xl shadow-2xs p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-soft-accent text-primary-accent">
              <span className="material-symbols-outlined text-[20px]">public</span>
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-primary-text">
                Global Shipping Telemetry Radar
              </h2>
              <p className="text-[12px] text-secondary-text">
                Interactive AIS vessel tracking, port nodes, and meteorological bottleneck zones
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-success-bg text-success text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-success mr-1.5 animate-pulse" />
              AIS Signal Live
            </span>
          </div>
        </div>

        {/* GlobalMap Component Container */}
        <div className="rounded-xl overflow-hidden border border-border">
          <GlobalMap
            ports={activePorts}
            routes={data?.routes || []}
            disruptions={activeDisruptions}
            onSelectPort={setSelectedPort}
          />
        </div>

        {/* Chokepoint Summary Cards at Bottom of Map */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-border">
          <div className="p-3 rounded-lg bg-subtle-surface border border-border">
            <div className="flex items-center justify-between text-[11px] text-muted-text mb-1">
              <span>Suez Canal</span>
              <span className="text-high-risk font-semibold">High Risk</span>
            </div>
            <div className="text-[13px] font-semibold text-primary-text">Bab el-Mandeb Alert</div>
            <div className="text-[11px] text-secondary-text mt-0.5">+4.2d transit detour</div>
          </div>
          <div className="p-3 rounded-lg bg-subtle-surface border border-border">
            <div className="flex items-center justify-between text-[11px] text-muted-text mb-1">
              <span>Strait of Malacca</span>
              <span className="text-medium-risk font-semibold">Moderate</span>
            </div>
            <div className="text-[13px] font-semibold text-primary-text">Singapore Queue</div>
            <div className="text-[11px] text-secondary-text mt-0.5">38 vessels anchored</div>
          </div>
          <div className="p-3 rounded-lg bg-subtle-surface border border-border">
            <div className="flex items-center justify-between text-[11px] text-muted-text mb-1">
              <span>Panama Canal</span>
              <span className="text-success font-semibold">Optimal</span>
            </div>
            <div className="text-[13px] font-semibold text-primary-text">Lake Gatun Level Normal</div>
            <div className="text-[11px] text-secondary-text mt-0.5">Draft 50.0 ft authorized</div>
          </div>
          <div className="p-3 rounded-lg bg-subtle-surface border border-border">
            <div className="flex items-center justify-between text-[11px] text-muted-text mb-1">
              <span>Shanghai Deepwater</span>
              <span className="text-medium-risk font-semibold">Moderate</span>
            </div>
            <div className="text-[13px] font-semibold text-primary-text">Offshore Gale Alert</div>
            <div className="text-[11px] text-secondary-text mt-0.5">Average wait: 28 hrs</div>
          </div>
        </div>
      </section>

      {/* 3. Dual-Column Workspace: High-Risk Shipments & Live Disruption Feed */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): High-Risk Shipments Matrix */}
        <div className="lg:col-span-8">
          <ShipmentRiskTable
            shipments={activeShipments}
            onSelectShipment={setSelectedShipment}
            onOpenAddModal={() => setIsAddOpen(true)}
            onOpenImportModal={() => setIsImportOpen(true)}
            onExportCSV={handleExportCSV}
          />
        </div>

        {/* Right Column (4 cols): Real-Time Disruption Feed */}
        <div className="lg:col-span-4">
          <LiveDisruptionFeed
            disruptions={activeDisruptions}
            onSelectDisruption={setSelectedDisruption}
          />
        </div>
      </section>

      {/* 4. Interactive Drawers and Detail Modals */}
      <PortDetailDrawer
        port={selectedPort}
        onClose={() => setSelectedPort(null)}
      />

      <ShipmentDetailModal
        shipment={selectedShipment}
        onClose={() => setSelectedShipment(null)}
        onRerouteCalculated={loadDashboardData}
      />

      <DisruptionDetailModal
        disruption={selectedDisruption}
        onClose={() => setSelectedDisruption(null)}
      />

      <AddShipmentModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onShipmentAdded={loadDashboardData}
      />

      <CSVImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImportSuccess={loadDashboardData}
      />
    </AppShell>
  );
}
