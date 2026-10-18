"use client";

import React from "react";
import { Shipment, DisruptionEvent } from "@/lib/types";
import { 
  X, 
  Ship, 
  MapPin, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Circle, 
  ShieldAlert, 
  DollarSign, 
  Compass, 
  Check,
  ExternalLink
} from "lucide-react";

interface ShipmentDetailModalProps {
  shipment: Shipment | null;
  onClose: () => void;
  disruptions?: DisruptionEvent[];
  onRerouteCalculated?: () => Promise<void>;
}

export const ShipmentDetailModal: React.FC<ShipmentDetailModalProps> = ({
  shipment,
  onClose,
  disruptions = [],
  onRerouteCalculated
}) => {
  if (!shipment) return null;

  const related = disruptions.filter(d => 
    shipment.related_disruptions.includes(d.id)
  );

  const isHigh = shipment.risk_score >= 70;
  const isMed = shipment.risk_score >= 40 && shipment.risk_score < 70;
  const riskColor = isHigh ? "text-[#FF5252]" : (isMed ? "text-[#FFB547]" : "text-[#38D996]");
  const riskBg = isHigh ? "bg-[#FF5252]/15 border-[#FF5252]/30" : (isMed ? "bg-[#FFB547]/15 border-[#FFB547]/30" : "bg-[#38D996]/15 border-[#38D996]/30");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111722] border border-[#242D3D] rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#242D3D] flex items-center justify-between bg-[#0C1019]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#4F8CFF]/20 to-[#25D9D0]/20 border border-[#4F8CFF]/30">
              <Ship className="w-6 h-6 text-[#4F8CFF]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#F1F5F9] font-mono">{shipment.id}</h2>
                <span className="text-xs px-2 py-0.5 rounded bg-[#1A2333] border border-[#242D3D] text-[#8D9AAF] font-mono">
                  {shipment.tracking_ref}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#38D996]/20 text-[#38D996] border border-[#38D996]/30">
                  {shipment.status.replace("_", " ")}
                </span>
              </div>
              <p className="text-xs text-[#8D9AAF]">
                {shipment.cargo_description} • Value: ${shipment.value_usd.toLocaleString()} USD
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8D9AAF] hover:text-[#F1F5F9] hover:bg-[#1A2333] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Risk Overview Banner */}
          <div className={`p-4 rounded-xl border ${riskBg} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8D9AAF]">Predictive Disruption Assessment</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className={`text-3xl font-extrabold font-mono ${riskColor}`}>
                  {shipment.risk_score}
                </span>
                <span className="text-xs text-[#8D9AAF]">/ 100</span>
                <span className={`text-xs font-bold uppercase ml-2 ${riskColor}`}>
                  {shipment.delay_risk_level} RISK LEVEL
                </span>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[10px] text-[#8D9AAF] uppercase tracking-wider font-semibold">Predicted Delay Variance</span>
              <div className="text-xl font-bold font-mono text-[#FF5252] mt-0.5">
                +{shipment.predicted_delay_hours} hours
              </div>
              <span className="text-[11px] text-[#FFB547]">
                Customer Delivery Deadline: <strong>{shipment.delivery_deadline}</strong>
              </span>
            </div>
          </div>

          {/* Logistics Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-[#0C1019] border border-[#242D3D]">
              <span className="text-[10px] text-[#8D9AAF] block">Carrier</span>
              <span className="text-xs font-bold text-[#F1F5F9] truncate block mt-0.5">{shipment.carrier}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#0C1019] border border-[#242D3D]">
              <span className="text-[10px] text-[#8D9AAF] block">Vessel (IMO)</span>
              <span className="text-xs font-bold text-[#F1F5F9] truncate block mt-0.5">{shipment.vessel || "Pending Allocation"}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#0C1019] border border-[#242D3D]">
              <span className="text-[10px] text-[#8D9AAF] block">Departure Date</span>
              <span className="text-xs font-bold text-[#F1F5F9] block mt-0.5">{shipment.departure_date}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#0C1019] border border-[#242D3D]">
              <span className="text-[10px] text-[#8D9AAF] block">Scheduled Arrival</span>
              <span className="text-xs font-bold text-[#F1F5F9] block mt-0.5">{shipment.expected_arrival}</span>
            </div>
          </div>

          {/* Route Milestones Timeline */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8D9AAF]">Shipment Milestone Journey</h3>
            <div className="relative pl-6 border-l-2 border-[#242D3D] space-y-4 py-1">
              {shipment.milestones.map((m, idx) => (
                <div key={idx} className="relative">
                  {/* Dot */}
                  <div className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    m.completed 
                      ? "bg-[#38D996] border-[#38D996]" 
                      : "bg-[#111722] border-[#25D9D0]"
                  }`}>
                    {m.completed && <Check className="w-2.5 h-2.5 text-[#080B12]" />}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-xs font-bold text-[#F1F5F9]">{m.name} ({m.location})</span>
                    <span className="text-[10px] font-mono text-[#8D9AAF]">{m.date}</span>
                  </div>
                  {m.status_note && (
                    <p className={`text-[11px] mt-0.5 ${m.status_note.includes("Delay") || m.status_note.includes("Risk") ? "text-[#FFB547]" : "text-[#8D9AAF]"}`}>
                      {m.status_note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Correlated Disruption Signals */}
          {related.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#8D9AAF]">Correlated Disruption Signals</h3>
              <div className="space-y-2">
                {related.map(d => (
                  <div key={d.id} className="p-3 rounded-lg bg-[#0C1019] border border-[#242D3D] space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#4F8CFF]">{d.headline}</span>
                      <span className="text-[10px] font-mono font-bold text-[#FF5252]">+{d.risk_score_impact} pts risk</span>
                    </div>
                    <p className="text-[11px] text-[#8D9AAF] leading-relaxed">{d.description}</p>
                    <div className="text-[10px] text-[#57657A] pt-1 flex items-center justify-between">
                      <span>Source: <strong>{d.source_name}</strong></span>
                      <span className="text-[#25D9D0]">Evidence: {d.evidence}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Mitigation Actions */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#1A2333] to-[#111722] border border-[#242D3D] space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#25D9D0]">
              <ShieldAlert className="w-4 h-4" />
              <span>AI-Recommended Mitigation Playbook</span>
            </div>
            {shipment.mitigation_actions.length === 0 ? (
              <p className="text-xs text-[#8D9AAF]">Nominal schedule parameters. Standard tracking active.</p>
            ) : (
              <ul className="space-y-1.5 text-xs text-[#F1F5F9]">
                {shipment.mitigation_actions.map((act, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#38D996] shrink-0 mt-0.5" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#242D3D] flex items-center justify-end gap-3 bg-[#0C1019]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#242D3D] hover:bg-[#2D394D] text-xs font-semibold text-[#F1F5F9] transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
