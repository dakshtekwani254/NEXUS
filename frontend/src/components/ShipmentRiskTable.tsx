"use client";

import React, { useState } from "react";
import { Shipment } from "@/lib/types";

interface ShipmentRiskTableProps {
  shipments: Shipment[];
  onSelectShipment: (s: Shipment) => void;
  onOpenAddModal?: () => void;
  onOpenImportModal?: () => void;
  onExportCSV?: () => void;
}

export const ShipmentRiskTable: React.FC<ShipmentRiskTableProps> = ({
  shipments = [],
  onSelectShipment,
  onOpenAddModal,
  onOpenImportModal,
  onExportCSV,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const safeShipments = Array.isArray(shipments) ? shipments : [];

  // Filter logic
  const filtered = safeShipments.filter((s) => {
    if (!s) return false;
    const id = typeof s.id === "string" ? s.id.toLowerCase() : "";
    const ref = typeof s.tracking_ref === "string" ? s.tracking_ref.toLowerCase() : "";
    const carrier = typeof s.carrier === "string" ? s.carrier.toLowerCase() : "";
    const cargo = typeof s.cargo_description === "string" ? s.cargo_description.toLowerCase() : "";
    const origin = typeof s.origin_name === "string" ? s.origin_name.toLowerCase() : "";
    const dest = typeof s.dest_name === "string" ? s.dest_name.toLowerCase() : "";
    const q = (searchTerm || "").toLowerCase().trim();

    const matchSearch = !q || id.includes(q) || ref.includes(q) || carrier.includes(q) || cargo.includes(q) || origin.includes(q) || dest.includes(q);
    const matchRisk = riskFilter === "ALL" || s.delay_risk_level === riskFilter;
    return matchSearch && matchRisk;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getRiskBadge = (level: string, score: number) => {
    const upper = level?.toUpperCase() || "";
    if (upper === "HIGH" || upper === "CRITICAL" || score >= 70) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-high-risk-bg text-high-risk text-[12px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-high-risk" />
          High ({score})
        </span>
      );
    }
    if (upper === "MEDIUM" || score >= 40) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-medium-risk-bg text-medium-risk text-[12px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-medium-risk" />
          Med ({score})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-success-bg text-success text-[12px] font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-success" />
        Low ({score})
      </span>
    );
  };

  return (
    <div className="bg-primary-surface border border-border rounded-xl shadow-2xs overflow-hidden">
      {/* Table Header Section with Search and Action Triggers */}
      <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-[16px] font-semibold text-primary-text">High-Risk Shipments</h3>
            <span className="px-2 py-0.5 rounded-full bg-subtle-surface border border-border text-[11px] font-medium text-secondary-text">
              {filtered.length} tracked
            </span>
          </div>
          <p className="text-[13px] text-secondary-text mt-0.5">
            Prioritized by composite disruption index &amp; downstream SLA exposure
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-muted-text text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search ID, carrier, port..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-border bg-primary-surface text-[13px] text-primary-text focus:outline-hidden focus:border-primary-accent w-48 sm:w-56"
            />
          </div>

          <select
            value={riskFilter}
            onChange={(e) => {
              setRiskFilter(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter shipments by risk level"
            className="px-2.5 py-1.5 rounded-xl border border-border bg-primary-surface text-[13px] text-secondary-text focus:outline-hidden focus:border-primary-accent"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="HIGH">High Risk Only</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk</option>
          </select>

          {onOpenAddModal && (
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-accent hover:bg-primary text-on-primary text-[13px] font-medium transition-colors shadow-2xs"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Add</span>
            </button>
          )}

          {onOpenImportModal && (
            <button
              onClick={onOpenImportModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-primary-surface hover:bg-subtle-surface text-secondary-text hover:text-primary-text text-[13px] font-medium transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">upload_file</span>
              <span>Import</span>
            </button>
          )}

          {onExportCSV && (
            <button
              onClick={onExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-primary-surface hover:bg-subtle-surface text-secondary-text hover:text-primary-text text-[13px] font-medium transition-colors"
              title="Export CSV"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
            </button>
          )}
        </div>
      </div>

      {/* Table Data Matrix */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-subtle-surface/50 text-[12px] font-semibold text-secondary-text uppercase tracking-wider">
              <th className="px-5 py-3">Shipment Ref</th>
              <th className="px-5 py-3">Carrier &amp; Cargo</th>
              <th className="px-5 py-3">Origin → Destination</th>
              <th className="px-5 py-3">Predicted Variance</th>
              <th className="px-5 py-3">Risk Level</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-[13px]">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-muted-text">
                  No shipments matching your filter criteria.
                </td>
              </tr>
            ) : (
              paginated.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => onSelectShipment(s)}
                  className="hover:bg-subtle-surface transition-colors cursor-pointer group"
                >
                  <td className="px-5 py-3.5 font-medium text-primary-text">
                    <div className="flex items-center gap-2">
                      <span className="text-primary-accent font-mono font-semibold">{s.id}</span>
                      <span className="text-[11px] text-muted-text">({s.tracking_ref})</span>
                    </div>
                  </td>

                  <td className="px-5 py-3.5 text-secondary-text">
                    <div className="font-medium text-primary-text">{s.carrier}</div>
                    <div className="text-[12px] text-muted-text truncate max-w-[200px]">
                      {s.cargo_description}
                    </div>
                  </td>

                  <td className="px-5 py-3.5 text-secondary-text">
                    <div className="flex items-center gap-1.5 font-medium text-primary-text">
                      <span>{s.origin_name}</span>
                      <span className="text-muted-text">→</span>
                      <span>{s.dest_name}</span>
                    </div>
                  </td>

                  <td className="px-5 py-3.5">
                    {s.predicted_delay_hours > 0 ? (
                      <span className="font-semibold text-high-risk">
                        +{s.predicted_delay_hours}h delay
                      </span>
                    ) : (
                      <span className="text-success font-medium">On schedule</span>
                    )}
                  </td>

                  <td className="px-5 py-3.5">
                    {getRiskBadge(s.delay_risk_level, s.risk_score)}
                  </td>

                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectShipment(s);
                      }}
                      className="px-2.5 py-1 rounded-lg border border-border bg-primary-surface hover:bg-subtle-surface text-primary-accent hover:text-primary text-[12px] font-medium transition-colors"
                    >
                      Assess
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-border flex items-center justify-between text-[12px] text-secondary-text">
          <span>
            Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-border disabled:opacity-40 hover:bg-subtle-surface"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
            </button>
            <span className="px-2 font-medium">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-border disabled:opacity-40 hover:bg-subtle-surface"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
