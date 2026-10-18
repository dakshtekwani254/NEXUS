"use client";

import React from "react";
import { Port, DisruptionEvent, Shipment } from "@/lib/types";
import { 
  X, 
  Anchor, 
  CloudRain, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  ArrowRight,
  TrendingUp,
  ExternalLink
} from "lucide-react";

interface PortDetailDrawerProps {
  port: Port | null;
  onClose: () => void;
  disruptions?: DisruptionEvent[];
  shipments?: Shipment[];
  onSelectShipment?: (s: Shipment) => void;
}

export const PortDetailDrawer: React.FC<PortDetailDrawerProps> = ({
  port,
  onClose,
  disruptions = [],
  shipments = [],
  onSelectShipment
}) => {
  if (!port) return null;

  const safeDisruptions = Array.isArray(disruptions) ? disruptions : [];
  const safeShipments = Array.isArray(shipments) ? shipments : [];

  const portDisruptions = safeDisruptions.filter(d => 
    d && (d.port_code === port.code || (typeof d.location === "string" && (d.location.includes(port.name) || d.location.includes(port.code))))
  );

  const portShipments = safeShipments.filter(s => 
    s && (s.origin === port.code || s.destination === port.code)
  );

  const isHigh = port.risk_score >= 70;
  const isMed = port.risk_score >= 40 && port.risk_score < 70;
  const riskColor = isHigh ? "text-[#FF5252]" : (isMed ? "text-[#FFB547]" : "text-[#38D996]");
  const riskBg = isHigh ? "bg-[#FF5252]/15 border-[#FF5252]/30" : (isMed ? "bg-[#FFB547]/15 border-[#FFB547]/30" : "bg-[#38D996]/15 border-[#38D996]/30");

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-[#0C1019] border-l border-[#242D3D] shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
      {/* Drawer Header */}
      <div className="p-5 border-b border-[#242D3D] flex items-center justify-between bg-[#111722]/80">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#1A2333] border border-[#242D3D]">
            <Anchor className="w-5 h-5 text-[#25D9D0]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#F1F5F9]">{port.name}</h2>
              <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-[#242D3D] text-[#8D9AAF]">{port.code}</span>
            </div>
            <p className="text-xs text-[#8D9AAF]">{port.country}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-[#8D9AAF] hover:text-[#F1F5F9] hover:bg-[#1A2333] transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Risk Score Summary Card */}
        <div className={`p-4 rounded-xl border ${riskBg} flex items-center justify-between`}>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8D9AAF]">Composite Risk Score</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className={`text-3xl font-extrabold font-mono ${riskColor}`}>
                {port.risk_score}
              </span>
              <span className="text-xs font-semibold text-[#8D9AAF]">/ 100</span>
              <span className={`text-xs font-bold uppercase ml-2 ${riskColor}`}>
                {port.severity} RISK
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#8D9AAF]">7-Day Trend</span>
            <div className="flex items-center gap-1 mt-1 text-xs font-mono text-[#F1F5F9]">
              <TrendingUp className={`w-3.5 h-3.5 ${riskColor}`} />
              <span>+{port.risk_score - (port.historical_trend[0] || 40)} pts</span>
            </div>
          </div>
        </div>

        {/* Operational Indicators Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-[#111722] border border-[#242D3D]">
            <div className="flex items-center justify-between text-[#8D9AAF] mb-1">
              <span className="text-[11px]">Avg Berth Dwell</span>
              <Clock className="w-3.5 h-3.5 text-[#25D9D0]" />
            </div>
            <div className="text-xl font-bold font-mono text-[#F1F5F9]">
              {port.avg_berth_wait_hours}h
            </div>
            <span className="text-[10px] text-[#FFB547]">
              Baseline: ~14.0h
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#111722] border border-[#242D3D]">
            <div className="flex items-center justify-between text-[#8D9AAF] mb-1">
              <span className="text-[11px]">Weather Index</span>
              <CloudRain className="w-3.5 h-3.5 text-[#4F8CFF]" />
            </div>
            <div className="text-xl font-bold font-mono text-[#F1F5F9]">
              {port.weather_score}/100
            </div>
            <span className="text-[10px] text-[#FF5252]">
              {port.weather_score > 60 ? "Storm Gale Warning" : "Normal Conditions"}
            </span>
          </div>
        </div>

        {/* Active Notices from Port Authority */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8D9AAF]">Active Port Notices</h3>
            <span className="text-[10px] text-[#25D9D0] font-mono">TinyFish Verified</span>
          </div>
          {port.active_notices.length === 0 ? (
            <div className="p-3 rounded-lg bg-[#111722] border border-[#242D3D] text-xs text-[#8D9AAF]">
              No active restrictions or navigational notices.
            </div>
          ) : (
            port.active_notices.map((notice, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-[#111722] border border-[#242D3D] text-xs leading-relaxed text-[#F1F5F9] flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-[#FFB547] shrink-0 mt-0.5" />
                <span>{notice}</span>
              </div>
            ))
          )}
        </div>

        {/* Correlated Disruptions */}
        {portDisruptions.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8D9AAF]">Correlated Disruption Events</h3>
            {portDisruptions.map(d => (
              <div key={d.id} className="p-3 rounded-lg bg-[#111722] border border-[#242D3D] text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#4F8CFF]">{d.headline}</span>
                  <span className="text-[10px] font-bold text-[#FF5252]">+{d.risk_score_impact} pts</span>
                </div>
                <p className="text-[11px] text-[#8D9AAF]">{d.description}</p>
                <div className="text-[10px] text-[#57657A] pt-1 flex items-center justify-between">
                  <span>Source: {d.source_name}</span>
                  <span>{d.verification_status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Affected Active Shipments */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8D9AAF]">Affected Shipments ({portShipments.length})</h3>
          </div>
          {portShipments.length === 0 ? (
            <p className="text-xs text-[#8D9AAF]">No monitored shipments currently scheduled through this port.</p>
          ) : (
            <div className="space-y-1.5">
              {portShipments.map(s => (
                <div
                  key={s.id}
                  onClick={() => onSelectShipment?.(s)}
                  className="p-2.5 rounded-lg bg-[#111722] hover:bg-[#1A2333] border border-[#242D3D] flex items-center justify-between cursor-pointer transition"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#F1F5F9] text-xs">{s.id}</span>
                      <span className="text-[10px] text-[#8D9AAF]">({s.carrier})</span>
                    </div>
                    <p className="text-[10px] text-[#8D9AAF] truncate max-w-[200px]">{s.cargo_description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-[#FF5252]">
                      +{s.predicted_delay_hours}h
                    </span>
                    <p className="text-[9px] text-[#FFB547]">Risk: {s.risk_score}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Alternative Diversion Ports */}
        {Array.isArray(port.alternative_ports) && port.alternative_ports.length > 0 && (
          <div className="p-3 rounded-xl bg-[#1A2333]/50 border border-[#242D3D] space-y-2">
            <h4 className="text-xs font-bold text-[#25D9D0]">Recommended Diversion Hubs</h4>
            <div className="flex flex-wrap gap-2">
              {port.alternative_ports.map(code => (
                <span key={code} className="px-2 py-1 rounded bg-[#111722] border border-[#242D3D] text-xs font-mono text-[#F1F5F9]">
                  {code}
                </span>
              ))}
            </div>
            <p className="text-[10px] text-[#8D9AAF]">
              Carriers have designated these bypass terminals for vessels seeking foul-weather pilotage relief.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
