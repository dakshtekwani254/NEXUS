"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  RefreshCw, 
  Bell, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Sparkles,
  Info
} from "lucide-react";

interface TopBarProps {
  currentTab: string;
  onRefresh: () => Promise<void>;
  isRefreshing: boolean;
  lastRefreshTime: string;
  globalSearch: string;
  setGlobalSearch: (s: string) => void;
  activeAlertsCount: number;
  onOpenAlerts: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  onRefresh,
  isRefreshing,
  lastRefreshTime,
  globalSearch,
  setGlobalSearch,
  activeAlertsCount,
  onOpenAlerts
}) => {
  const [currentTimeStr, setCurrentTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(now.toUTCString().replace("GMT", "UTC"));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const tabTitles: Record<string, { title: string; subtitle: string }> = {
    overview: { 
      title: "Supply Chain Control Tower", 
      subtitle: "Predict disruptions. Protect deliveries. Act before delays happen." 
    },
    risks: { 
      title: "Risk Intelligence & Predictive Scoring", 
      subtitle: "Transparent rules-based multi-factor risk engine with 24h/72h/7d forecast horizons." 
    },
    shipments: { 
      title: "Global Shipment Tracking & SLA Protection", 
      subtitle: "Active consignments, container references, milestones, and delay mitigations." 
    },
    ports: { 
      title: "Ports & Shipping Corridors", 
      subtitle: "Berth wait times, terminal congestion telemetry, and alternative route benchmarks." 
    },
    alerts: { 
      title: "Supply Chain Alert Center", 
      subtitle: "Real-time automated incident queue, breach warnings, and stakeholder response." 
    },
    analyst: { 
      title: "AI Logistics Analyst", 
      subtitle: "Data-grounded supply chain reasoning engine for risk diagnosis and route optimization." 
    },
    agent: { 
      title: "TinyFish Agent Center", 
      subtitle: "Autonomous browser agents extracting port authority notices & carrier schedule updates." 
    },
    analytics: { 
      title: "Operational Analytics & Risk Trends", 
      subtitle: "Performance benchmarks, disruption vectors, and agent reliability telemetry." 
    },
    settings: { 
      title: "System Configuration & Weights", 
      subtitle: "Fine-tune risk factor weights, threshold triggers, and external API credentials." 
    },
  };

  const headerInfo = tabTitles[currentTab] || {
    title: "Supply Chain Intelligence",
    subtitle: "Real-time predictive disruption platform"
  };

  return (
    <header className="h-16 px-6 bg-[#080B12]/80 backdrop-blur border-b border-[#242D3D] flex items-center justify-between sticky top-0 z-30">
      {/* Title & Breadcrumb */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-base font-bold text-[#F1F5F9] tracking-tight">
            {headerInfo.title}
          </h1>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#38D996]/15 text-[#38D996] border border-[#38D996]/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38D996] animate-pulse" />
            LIVE MONITORING
          </span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#FFB547]/10 text-[#FFB547] border border-[#FFB547]/20 flex items-center gap-1">
            <Info className="w-3 h-3" />
            DEMO DATASET ACTIVE
          </span>
        </div>
        <p className="text-xs text-[#8D9AAF] truncate max-w-xl">
          {headerInfo.subtitle}
        </p>
      </div>

      {/* Global Search & Actions */}
      <div className="flex items-center gap-3">
        {/* Global Search Bar */}
        <div className="relative w-64">
          <Search className="w-4 h-4 text-[#8D9AAF] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search shipments, ports, events..."
            className="w-full bg-[#111722] border border-[#242D3D] text-xs text-[#F1F5F9] rounded-lg pl-9 pr-3 py-1.5 focus:outline-none focus:border-[#4F8CFF] transition placeholder-[#57657A]"
          />
          {globalSearch && (
            <button 
              onClick={() => setGlobalSearch("")} 
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8D9AAF] hover:text-[#F1F5F9]"
            >
              ×
            </button>
          )}
        </div>

        {/* Live UTC Clock */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111722] border border-[#242D3D] text-[11px] font-mono text-[#8D9AAF]">
          <Clock className="w-3.5 h-3.5 text-[#25D9D0]" />
          <span>{currentTimeStr || "UTC Time Syncing..."}</span>
        </div>

        {/* Refresh Intelligence Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#4F8CFF] hover:bg-[#3D78E6] text-white text-xs font-semibold shadow-sm shadow-[#4F8CFF]/30 transition disabled:opacity-60 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>{isRefreshing ? "Syncing..." : "Refresh Intelligence"}</span>
        </button>

        {/* Notifications / Alerts Button */}
        <button
          onClick={onOpenAlerts}
          className="relative p-2 rounded-lg bg-[#111722] border border-[#242D3D] text-[#8D9AAF] hover:text-[#F1F5F9] hover:border-[#4F8CFF]/50 transition"
          title="Active Alerts"
        >
          <Bell className="w-4 h-4" />
          {activeAlertsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF5252] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
              {activeAlertsCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
