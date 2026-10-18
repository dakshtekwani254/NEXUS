"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  title = "Overview",
  subtitle = "Your supply chain, one step ahead.",
  actions,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [unreadAlerts, setUnreadAlerts] = useState<number>(12);
  const [lastUpdated, setLastUpdated] = useState<string>("4m ago");

  const navItems = [
    { href: "/overview", label: "Overview", icon: "dashboard" },
    { href: "/risk-intelligence", label: "Risk Intelligence", icon: "shield_with_heart" },
    { href: "/research", label: "Web Research", icon: "travel_explore" },
    { href: "/shipments", label: "Shipments", icon: "local_shipping" },
    { href: "/ports-routes", label: "Ports & Routes", icon: "anchor" },
    { 
      href: "/alerts", 
      label: "Alerts", 
      icon: "notifications_active", 
      badge: unreadAlerts > 0 ? unreadAlerts : null 
    },
    { href: "/ai-analyst", label: "AI Analyst", icon: "psychology" },
    { href: "/agents", label: "Agent Center", icon: "smart_toy" },
    { href: "/analytics", label: "Analytics", icon: "analytics" },
    { href: "/settings", label: "Settings", icon: "settings" },
  ];

  return (
    <div className="min-h-screen flex flex-row bg-app-background text-primary-text font-sans antialiased">
      {/* Persistent Left Navigation Sidebar (224px width as defined in Stitch DESIGN.md) */}
      <aside className="fixed top-0 bottom-0 left-0 w-[224px] h-screen bg-primary-surface border-r border-border z-30 flex flex-col justify-between p-4 select-none">
        <div className="flex flex-col gap-4">
          {/* Brand Header */}
          <Link href="/" className="flex items-center gap-2.5 px-2 py-1.5 group">
            <div className="w-8 h-8 rounded-xl bg-soft-accent flex items-center justify-center text-primary-accent border border-border shadow-xs group-hover:scale-105 transition-transform duration-150">
              <span className="material-symbols-outlined text-primary-accent text-[20px]">hub</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[16px] font-semibold text-primary-text tracking-tight leading-tight">NEXUS</span>
              <span className="text-[11px] text-muted-text font-normal">Supply Chain OS</span>
            </div>
          </Link>

          {/* Primary Navigation Links */}
          <nav className="flex flex-col gap-1 mt-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/overview" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-[14px] transition-colors duration-150 ease-in-out ${
                    isActive
                      ? "bg-soft-accent text-primary-accent font-medium shadow-2xs"
                      : "text-secondary-text hover:bg-subtle-surface hover:text-primary-text font-normal"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`material-symbols-outlined text-[20px] ${isActive ? "text-primary-accent" : "text-secondary-text"}`}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge !== null && (
                    <span className="px-1.5 py-0.5 rounded-full bg-high-risk-bg text-high-risk text-[10px] font-semibold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: System Status & User Profile */}
        <div className="flex flex-col gap-3 pt-3 border-t border-border">
          {/* Telemetry Status Indicator */}
          <div className="px-3 py-2 rounded-xl bg-subtle-surface border border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-[12px] text-secondary-text">Telemetry</span>
            </div>
            <span className="text-[10px] uppercase font-semibold text-success bg-success-bg px-1.5 py-0.5 rounded-sm">
              Live
            </span>
          </div>

          {/* User Account Tile */}
          <div className="flex items-center justify-between px-1.5 py-1">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-soft-accent border border-border flex items-center justify-center text-primary-accent text-xs font-semibold">
                  EV
                </div>
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-success border border-primary-surface" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[13px] font-medium text-primary-text leading-snug">Elena Vance</span>
                <span className="text-[11px] text-muted-text">Operations Dir</span>
              </div>
            </div>
            <Link
              href="/login"
              title="Sign out / Switch user"
              className="p-1 rounded-lg text-secondary-text hover:text-primary-text hover:bg-subtle-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Workspace with persistent sidebar margin */}
      <div className="flex-1 ml-[224px] flex flex-col min-h-screen min-w-0">
        {/* Global Application Header */}
        <header className="sticky top-0 z-20 w-full bg-primary-surface/95 backdrop-blur-xs border-b border-border px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Header Titles */}
            <div>
              <h1 className="text-[26px] font-semibold text-primary-text tracking-tight leading-tight">{title}</h1>
              <p className="text-[14px] text-secondary-text mt-0.5">{subtitle}</p>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-3">
              {actions}

              {/* Sample / Demo Data Pill (from DESIGN.md) */}
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-subtle-surface border border-border text-[12px] text-secondary-text">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-text mr-1.5" />
                Demo data
              </span>

              {/* Live Timestamp */}
              <span className="text-[12px] text-muted-text hidden sm:inline-block">
                Updated {lastUpdated}
              </span>

              {/* Notification Bell Button */}
              <Link
                href="/notifications"
                className="relative p-2 rounded-xl border border-border bg-primary-surface hover:bg-subtle-surface text-secondary-text hover:text-primary-text transition-colors duration-150"
                title="View Notifications"
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                {unreadAlerts > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-high-risk" />
                )}
              </Link>

              {/* Quick Public View Link */}
              <Link
                href="/"
                className="text-[13px] font-medium text-secondary-text hover:text-primary-accent px-2.5 py-1.5 rounded-lg border border-border hover:border-primary-accent/30 bg-primary-surface transition-colors"
              >
                Public Portal
              </Link>
            </div>
          </div>
        </header>

        {/* Page Body Canvas */}
        <main className="flex-1 px-8 py-7 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
};
