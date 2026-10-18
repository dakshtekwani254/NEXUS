"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AppShell } from "@/components/AppShell";
import { ShipmentsView } from "@/views/ShipmentsView";
import { ShipmentRiskTable } from "@/components/ShipmentRiskTable";
import { ShipmentDetailModal } from "@/components/ShipmentDetailModal";
import { AddShipmentModal } from "@/components/AddShipmentModal";
import { CSVImportModal } from "@/components/CSVImportModal";
import { api } from "@/lib/api";
import { Shipment } from "@/lib/types";

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadShipments = useCallback(async () => {
    try {
      const res = await api.getShipments();
      const list = Array.isArray(res) ? res : res?.shipments || [];
      setShipments(list);
    } catch (err) {
      console.warn("Shipments fetch fallback:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadShipments();
  }, [loadShipments]);

  const handleExportCSV = () => {
    window.open("http://127.0.0.1:8000/api/shipments/export-csv", "_blank");
  };

  return (
    <AppShell
      title="Shipments"
      subtitle="Complete global consignment registry and real-time transit risk status."
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-accent hover:bg-primary text-on-primary text-[13px] font-medium transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>New Shipment</span>
          </button>
          <button
            onClick={() => setIsImportOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-primary-surface hover:bg-subtle-surface text-secondary-text hover:text-primary-text text-[13px] font-medium transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">upload_file</span>
            <span>Import</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Shipment Summary KPI Cards (Horizontal 4-card row) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-primary-surface border border-border rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-secondary-text mb-2">
              <span className="font-metadata text-metadata font-medium uppercase tracking-wider">Total Shipments</span>
              <span className="material-symbols-outlined text-secondary-text">local_shipping</span>
            </div>
            <div>
              <div className="font-kpi-value text-kpi-value text-primary-text tracking-tight">
                {shipments.length > 0 ? shipments.length : 1284}
              </div>
              <p className="font-metadata text-metadata text-muted-text mt-0.5">Across monitored routes</p>
            </div>
          </div>

          <div className="bg-primary-surface border border-border rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-secondary-text mb-2">
              <span className="font-metadata text-metadata font-medium uppercase tracking-wider">In Transit</span>
              <span className="material-symbols-outlined text-secondary-text">directions_boat</span>
            </div>
            <div>
              <div className="font-kpi-value text-kpi-value text-primary-text tracking-tight">946</div>
              <p className="font-metadata text-metadata text-muted-text mt-0.5">Currently moving</p>
            </div>
          </div>

          <div className="bg-primary-surface border border-border rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-secondary-text mb-2">
              <span className="font-metadata text-metadata font-medium uppercase tracking-wider">Delayed</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-medium-risk-bg text-medium-risk">5.7%</span>
            </div>
            <div>
              <div className="font-kpi-value text-kpi-value text-medium-risk tracking-tight">73</div>
              <p className="font-metadata text-metadata text-muted-text mt-0.5">Behind estimated schedule</p>
            </div>
          </div>

          <div className="bg-primary-surface border border-border rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-secondary-text mb-2">
              <span className="font-metadata text-metadata font-medium uppercase tracking-wider">At Risk</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-high-risk-bg text-high-risk">6.7%</span>
            </div>
            <div>
              <div className="font-kpi-value text-kpi-value text-high-risk tracking-tight">
                {shipments.filter(s => (s.delay_risk_level === 'HIGH' || s.delay_risk_level === 'CRITICAL' || s.risk_level === 'HIGH' || s.risk_level === 'CRITICAL')).length || 86}
              </div>
              <p className="font-metadata text-metadata text-muted-text mt-0.5">Potential disruption exposure</p>
            </div>
          </div>
        </section>

        {/* Shipment Status Overview Panel */}
        <section className="bg-primary-surface border border-border rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-section-heading text-section-heading font-semibold text-primary-text">Shipment Overview</h2>
              <p className="font-metadata text-metadata text-secondary-text mt-0.5">Current transit breakdown across active fleet (Illustrative demo data)</p>
            </div>
            <span className="font-metadata text-metadata text-muted-text font-medium">100% Monitored</span>
          </div>

          <div className="w-full h-3 rounded-full overflow-hidden flex bg-subtle-surface mt-1">
            <div className="bg-primary-accent h-full" style={{ width: "73.7%" }} title="In Transit: 946 (73.7%)"></div>
            <div className="bg-success h-full" style={{ width: "13.9%" }} title="Delivered: 179 (13.9%)"></div>
            <div className="bg-medium-risk h-full" style={{ width: "5.7%" }} title="Delayed: 73 (5.7%)"></div>
            <div className="bg-high-risk h-full" style={{ width: "6.7%" }} title="Exception: 86 (6.7%)"></div>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary-accent"></span>
              <span className="text-primary-text font-medium">In Transit:</span>
              <span className="text-secondary-text">946 (73.7%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-success"></span>
              <span className="text-primary-text font-medium">Delivered:</span>
              <span className="text-secondary-text">179 (13.9%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-medium-risk"></span>
              <span className="text-primary-text font-medium">Delayed:</span>
              <span className="text-secondary-text">73 (5.7%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-high-risk"></span>
              <span className="text-primary-text font-medium">Exception:</span>
              <span className="text-secondary-text">86 (6.7%)</span>
            </div>
          </div>
        </section>

        <ShipmentRiskTable
          shipments={shipments}
          onSelectShipment={setSelectedShipment}
          onOpenAddModal={() => setIsAddOpen(true)}
          onOpenImportModal={() => setIsImportOpen(true)}
          onExportCSV={handleExportCSV}
        />
      </div>

      <ShipmentDetailModal
        shipment={selectedShipment}
        onClose={() => setSelectedShipment(null)}
        onRerouteCalculated={loadShipments}
      />

      <AddShipmentModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onShipmentAdded={loadShipments}
      />

      <CSVImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImportSuccess={loadShipments}
      />
    </AppShell>
  );
}
