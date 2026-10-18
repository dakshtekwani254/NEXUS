"use client";

import React from "react";
import { DisruptionEvent, Shipment } from "@/lib/types";
import { 
  X, 
  AlertTriangle, 
  ExternalLink, 
  Clock, 
  ShieldCheck, 
  Ship, 
  Building2, 
  FileCode2,
  CheckCircle2
} from "lucide-react";

interface DisruptionDetailModalProps {
  disruption: DisruptionEvent | null;
  onClose: () => void;
  shipments?: Shipment[];
  onSelectShipment?: (s: Shipment) => void;
}

export const DisruptionDetailModal: React.FC<DisruptionDetailModalProps> = ({
  disruption,
  onClose,
  shipments = [],
  onSelectShipment
}) => {
  if (!disruption) return null;

  const safeShipments = Array.isArray(shipments) ? shipments : [];
  const affectedList = Array.isArray(disruption.affected_shipments) ? disruption.affected_shipments : [];
  const affected = safeShipments.filter(s => 
    s && affectedList.includes(s.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111722] border border-[#242D3D] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#242D3D] flex items-center justify-between bg-[#0C1019]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#FF5252]/15 border border-[#FF5252]/30 text-[#FF5252]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF5252] bg-[#FF5252]/10 px-2 py-0.5 rounded border border-[#FF5252]/20">
                  {disruption.category.replace("_", " ")}
                </span>
                <span className="text-xs font-mono text-[#8D9AAF]">{disruption.id}</span>
              </div>
              <h2 className="text-sm font-bold text-[#F1F5F9] mt-0.5">{disruption.headline}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8D9AAF] hover:text-[#F1F5F9] hover:bg-[#1A2333] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-[#0C1019] border border-[#242D3D]">
              <span className="text-[10px] text-[#8D9AAF] block">Location</span>
              <span className="font-semibold text-[#F1F5F9] block mt-0.5">{disruption.location}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#0C1019] border border-[#242D3D]">
              <span className="text-[10px] text-[#8D9AAF] block">Risk Impact</span>
              <span className="font-mono font-bold text-[#FF5252] block mt-0.5">+{disruption.risk_score_impact} pts</span>
            </div>
            <div className="p-3 rounded-lg bg-[#0C1019] border border-[#242D3D]">
              <span className="text-[10px] text-[#8D9AAF] block">Publication Time</span>
              <span className="font-mono text-[11px] text-[#F1F5F9] block mt-0.5">
                {new Date(disruption.publication_time).toLocaleDateString()}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-[#0C1019] border border-[#242D3D]">
              <span className="text-[10px] text-[#8D9AAF] block">Verification</span>
              <span className="text-[11px] font-bold text-[#38D996] block mt-0.5">
                {disruption.verification_status}
              </span>
            </div>
          </div>

          {/* Detailed Narrative */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8D9AAF]">Event Description</h3>
            <div className="p-4 rounded-xl bg-[#0C1019] border border-[#242D3D] text-xs text-[#F1F5F9] leading-relaxed">
              {disruption.description}
            </div>
          </div>

          {/* Raw Source & Evidence Breakdown */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#8D9AAF]">Source Attribution & Evidence</h3>
              {disruption.source_url && (
                <a
                  href={disruption.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#4F8CFF] hover:underline flex items-center gap-1"
                >
                  <span>Open Primary Source</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <div className="p-3.5 rounded-xl bg-[#1A2333]/60 border border-[#242D3D] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8D9AAF]">Reporting Body:</span>
                <strong className="text-[#F1F5F9]">{disruption.source_name}</strong>
              </div>
              <div className="text-xs border-t border-[#242D3D] pt-2">
                <span className="text-[10px] font-mono text-[#25D9D0] block mb-1">AUTOMATED TELEMETRY EXTRACT:</span>
                <p className="text-[11px] text-[#8D9AAF] font-mono leading-relaxed bg-[#0C1019] p-2.5 rounded border border-[#242D3D]">
                  {disruption.evidence}
                </p>
              </div>
            </div>
          </div>

          {/* Affected Shipments */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8D9AAF]">
              Correlated Monitored Shipments ({affected.length})
            </h3>
            {affected.length === 0 ? (
              <p className="text-xs text-[#8D9AAF]">No consignments currently in this chokepoint transit corridor.</p>
            ) : (
              <div className="space-y-2">
                {affected.map(s => (
                  <div
                    key={s.id}
                    onClick={() => {
                      onClose();
                      onSelectShipment?.(s);
                    }}
                    className="p-3 rounded-lg bg-[#0C1019] hover:bg-[#1A2333] border border-[#242D3D] flex items-center justify-between cursor-pointer transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#F1F5F9] text-xs">{s.id}</span>
                        <span className="text-xs text-[#8D9AAF]">• {s.carrier}</span>
                      </div>
                      <p className="text-[11px] text-[#8D9AAF]">{s.cargo_description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-[#FF5252]">
                        +{s.predicted_delay_hours}h delay
                      </span>
                      <p className="text-[10px] text-[#FFB547]">Deadline: {s.delivery_deadline}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#242D3D] flex items-center justify-end bg-[#0C1019]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#242D3D] hover:bg-[#2D394D] text-xs font-semibold text-[#F1F5F9] transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
