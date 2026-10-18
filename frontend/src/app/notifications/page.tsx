"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { api } from "@/lib/api";

interface NotificationItem {
  id: string;
  title: string;
  category: "CRITICAL" | "AGENTS" | "SYSTEM" | string;
  time?: string;
  created_at?: string;
  description: string;
  unread: boolean;
  icon?: string;
  iconColor?: string;
  action_url?: string;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "NOTIF-001",
    title: "Suez Canal Transit Variance Warning",
    category: "CRITICAL",
    time: "12m ago",
    description: "Autonomous AIS detection: 14 container vessels diverted via Cape of Good Hope. Average delay penalty increased to +98 hours.",
    unread: true,
    icon: "warning",
    iconColor: "text-high-risk bg-high-risk-bg",
  },
  {
    id: "NOTIF-002",
    title: "TinyFish Agent: Shanghai Berth Bulletin Extracted",
    category: "AGENTS",
    time: "42m ago",
    description: "Crawler task extracted typhoon precautionary anchorage orders for Yangshan Deepwater terminal. Delta score: +14.2.",
    unread: true,
    icon: "smart_toy",
    iconColor: "text-primary-accent bg-soft-accent",
    action_url: "/research?port=CNSHA",
  },
  {
    id: "NOTIF-003",
    title: "Shipment SHP-10482 High-Risk Flagged",
    category: "CRITICAL",
    time: "1h ago",
    description: "Consignment from Shanghai to Rotterdam marked High Risk (Score: 84) due to overlapping Red Sea chokepoint friction.",
    unread: false,
    icon: "local_shipping",
    iconColor: "text-high-risk bg-high-risk-bg",
    action_url: "/shipments/SHP-10482",
  },
  {
    id: "NOTIF-004",
    title: "NOAA Marine Weather Telemetry Updated",
    category: "SYSTEM",
    time: "2h ago",
    description: "North Atlantic gale advisories ingested. 6 trans-Atlantic container vessel routes adjusted for speed and safety.",
    unread: false,
    icon: "cloud_sync",
    iconColor: "text-secondary-text bg-subtle-surface",
  },
  {
    id: "NOTIF-005",
    title: "Panama Canal Gatun Lake Level Normal",
    category: "SYSTEM",
    time: "4h ago",
    description: "Canal Authority confirmed Neo-Panamax draft limit maintains at 50.0 feet. Normal transit slot allocation resumed.",
    unread: false,
    icon: "check_circle",
    iconColor: "text-success bg-success-bg",
  },
];

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"ALL" | "CRITICAL" | "AGENTS" | "SYSTEM">("ALL");
  const [notifications, setNotifications] = useState<NotificationItem[]>(DEFAULT_NOTIFICATIONS);

  useEffect(() => {
    let mounted = true;
    api.getNotifications()
      .then((items) => {
        if (mounted && Array.isArray(items) && items.length > 0) {
          setNotifications(items.map((n: any) => ({
            id: n.id || `NOTIF-${Math.random().toString(36).substring(7)}`,
            title: n.title,
            category: n.category || "SYSTEM",
            time: n.time || (n.created_at ? new Date(n.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Just now"),
            description: n.description || n.message,
            unread: n.unread ?? true,
            icon: n.icon || (n.category === "AGENTS" ? "smart_toy" : n.category === "CRITICAL" ? "warning" : "notifications"),
            iconColor: n.iconColor || (n.category === "AGENTS" ? "text-primary-accent bg-soft-accent" : n.category === "CRITICAL" ? "text-high-risk bg-high-risk-bg" : "text-secondary-text bg-subtle-surface"),
            action_url: n.action_url || (n.category === "AGENTS" ? "/research" : undefined),
          })));
        }
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const markItemRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  };

  const filtered = filter === "ALL" 
    ? notifications 
    : notifications.filter((n) => n.category === filter);

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <AppShell
      title="Notification Center"
      subtitle="Operational dispatches, TinyFish web research discoveries, and critical threshold alerts."
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/research"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary-accent/30 bg-soft-accent text-primary-accent text-[13px] font-medium hover:bg-primary-accent/15 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">travel_explore</span>
            <span>Launch Web Research</span>
          </Link>
          <button
            onClick={markAllRead}
            className="text-[13px] font-medium text-secondary-text hover:text-primary-text px-2 py-1 transition-colors"
          >
            Mark all as read
          </button>
        </div>
      }
    >
      <div className="bg-primary-surface border border-border rounded-xl shadow-2xs overflow-hidden">
        {/* Filter Bar */}
        <div className="p-5 border-b border-border flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-semibold text-primary-text">Inbox</span>
            {unreadCount > 0 ? (
              <span className="px-2 py-0.5 rounded-full bg-high-risk-bg text-high-risk text-[11px] font-semibold">
                {unreadCount} Unread
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-success-bg text-success text-[11px] font-semibold">
                All read
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {(["ALL", "CRITICAL", "AGENTS", "SYSTEM"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
                  filter === tab
                    ? "bg-primary-accent text-on-primary"
                    : "bg-subtle-surface text-secondary-text hover:text-primary-text hover:bg-border"
                }`}
              >
                {tab === "ALL" ? "All Notifications" : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Notification Items */}
        <div className="divide-y border-border divide-border">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-secondary-text">
              <span className="material-symbols-outlined text-[36px] text-muted-text mb-2 block">notifications_off</span>
              <p className="font-medium text-primary-text">No notifications in this category</p>
              <p className="text-xs text-muted-text mt-1">Research findings and system alerts will appear here as events occur.</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => markItemRead(item.id)}
                className={`p-5 flex items-start gap-4 transition-colors hover:bg-subtle-surface cursor-pointer ${
                  item.unread ? "bg-soft-accent/20" : "bg-primary-surface"
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 flex items-center justify-center ${item.iconColor || "bg-subtle-surface text-secondary-text"}`}>
                  <span className="material-symbols-outlined text-[20px]">{item.icon || "notifications"}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-semibold text-primary-text">{item.title}</span>
                      {item.unread && (
                        <span className="w-2 h-2 rounded-full bg-primary-accent shrink-0" />
                      )}
                      <span className="text-[10px] uppercase tracking-wider font-mono px-1.5 py-0.5 rounded bg-subtle-surface text-muted-text border border-border">
                        {item.category}
                      </span>
                    </div>
                    <span className="text-[12px] text-muted-text shrink-0">{item.time}</span>
                  </div>
                  <p className="text-[13px] text-secondary-text leading-relaxed">
                    {item.description}
                  </p>

                  {item.action_url && (
                    <div className="mt-2.5">
                      <Link
                        href={item.action_url}
                        className="inline-flex items-center gap-1 text-[12px] font-medium text-primary-accent hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                        <span>{item.category === "AGENTS" ? "View Research Evidence" : "Open Details"}</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
