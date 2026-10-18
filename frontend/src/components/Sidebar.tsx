"use client";

import React from "react";
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Ship, 
  Anchor, 
  Bell, 
  Bot, 
  Cpu, 
  BarChart3, 
  Settings,
  ChevronRight,
  Radio,
  ExternalLink
} from "lucide-react";

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  activeAlertsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  setCurrentTab,
  activeAlertsCount 
}) => {
  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "risks", label: "Risk Intelligence", icon: ShieldAlert },
    { id: "shipments", label: "Shipments", icon: Ship },
    { id: "ports", label: "Ports & Routes", icon: Anchor },
    { 
      id: "alerts", 
      label: "Alerts", 
      icon: Bell, 
      badge: activeAlertsCount > 0 ? activeAlertsCount : null,
      badgeColor: "bg-[#FF5252]"
    },
    { 
      id: "analyst", 
      label: "AI Analyst", 
      icon: Bot, 
      badge: "AI",
      badgeColor: "bg-[#4F8CFF]/20 text-[#4F8CFF] border border-[#4F8CFF]/40" 
    },
    { 
      id: "agent", 
      label: "Agent Center", 
      icon: Cpu, 
      badge: "TinyFish",
      badgeColor: "bg-[#25D9D0]/20 text-[#25D9D0] border border-[#25D9D0]/40" 
    },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0C1019] border-r border-[#242D3D] flex flex-col h-screen select-none shrink-0 sticky top-0 z-40">
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-[#242D3D] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#4F8CFF] to-[#25D9D0] flex items-center justify-center shadow-lg shadow-[#4F8CFF]/20">
            <Radio className="w-5 h-5 text-[#080B12] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-wider text-base text-[#F1F5F9]">NEXUS</span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-[#4F8CFF]/20 text-[#4F8CFF] border border-[#4F8CFF]/30">v1.0</span>
            </div>
            <p className="text-[11px] text-[#8D9AAF]">Supply Chain Intelligence</p>
          </div>
        </div>
      </div>

      {/* Workspace Indicator */}
      <div className="px-4 py-3 mx-3 my-3 rounded-lg bg-[#111722] border border-[#242D3D]/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#38D996] animate-pulse-subtle" />
          <span className="text-[#8D9AAF]">Workspace:</span>
          <span className="font-medium text-[#F1F5F9] truncate max-w-[100px]">Global Control</span>
        </div>
        <span className="text-[10px] text-[#25D9D0] font-mono">LIVE</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? "bg-[#4F8CFF]/15 text-[#4F8CFF] border border-[#4F8CFF]/30 shadow-sm shadow-[#4F8CFF]/10 font-semibold"
                  : "text-[#8D9AAF] hover:text-[#F1F5F9] hover:bg-[#111722] border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-[#4F8CFF]" : "text-[#8D9AAF] group-hover:text-[#F1F5F9]"}`} />
                <span>{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {item.badge && (
                  <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${item.badgeColor || "bg-[#FF5252] text-white"}`}>
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#4F8CFF]" />}
              </div>
            </button>
          );
        })}
      </nav>

      {/* TinyFish Agent Quick Status Card */}
      <div className="p-3 mx-3 mb-3 rounded-lg bg-gradient-to-b from-[#111722] to-[#0E1420] border border-[#242D3D]">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#25D9D0]">
            <Cpu className="w-3.5 h-3.5" />
            <span>TinyFish Automation</span>
          </div>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#38D996]/20 text-[#38D996] border border-[#38D996]/30">Active</span>
        </div>
        <p className="text-[10px] text-[#8D9AAF] leading-relaxed mb-2">
          5 logistics portals monitored for port notices, crane telemetry & carrier blank sailings.
        </p>
        <button
          onClick={() => setCurrentTab("agent")}
          className="w-full text-center py-1.5 text-[11px] font-medium text-[#F1F5F9] bg-[#242D3D] hover:bg-[#2D394D] rounded transition flex items-center justify-center gap-1.5"
        >
          <span>Open Agent Center</span>
          <ChevronRight className="w-3 h-3 text-[#25D9D0]" />
        </button>
      </div>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-[#242D3D] flex items-center justify-between bg-[#0C1019]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#242D3D] to-[#4F8CFF] flex items-center justify-center text-xs font-bold text-white shadow-inner">
            DO
          </div>
          <div className="text-left">
            <p className="text-xs font-medium text-[#F1F5F9] leading-tight">Daksh Ops</p>
            <p className="text-[10px] text-[#8D9AAF] leading-tight">Supply Chain Director</p>
          </div>
        </div>
        <button 
          onClick={() => setCurrentTab("settings")} 
          title="Account Settings"
          className="p-1.5 text-[#8D9AAF] hover:text-[#F1F5F9] hover:bg-[#111722] rounded transition"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
