"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { RiskConfiguration } from "@/lib/types";

interface SettingsViewProps {
  onResetDemo?: () => Promise<void>;
  onRefresh?: () => Promise<void>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onResetDemo,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<
    "general" | "profile" | "notifications" | "data-sources" | "risk" | "agents" | "security"
  >("general");
  const [config, setConfig] = useState<RiskConfiguration | null>(null);
  const [saved, setSaved] = useState(false);
  const [resetting, setResetting] = useState(false);

  // General Form
  const [workspaceName, setWorkspaceName] = useState("NEXUS Demo Workspace");
  const [orgName, setOrgName] = useState("Global Logistics Operations Ltd.");
  const [defaultRegion, setDefaultRegion] = useState("Global");
  const [timezone, setTimezone] = useState("Asia/Kolkata (UTC+05:30)");

  // Profile Form
  const [userName, setUserName] = useState("Sarah Chen");
  const [userRole, setUserRole] = useState("Director of Global Logistics");
  const [userEmail, setUserEmail] = useState("sarah.chen@nexus-logistics.io");

  // Thresholds
  const [highThreshold, setHighThreshold] = useState(70);
  const [medThreshold, setMedThreshold] = useState(40);

  // Notification toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [inAppPush, setInAppPush] = useState(true);
  const [webhookActive, setWebhookActive] = useState(false);

  useEffect(() => {
    api
      .getSettings()
      .then((cfg) => {
        setConfig(cfg);
        setHighThreshold(cfg.high_risk_threshold);
        setMedThreshold(cfg.medium_risk_threshold);
      })
      .catch(console.error);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);
    try {
      const updated = await api.updateSettings({
        high_risk_threshold: Number(highThreshold),
        medium_risk_threshold: Number(medThreshold),
      });
      setConfig(updated);
      setSaved(true);
      if (onRefresh) await onRefresh();
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleReset = async () => {
    if (confirm("Reset all operational data back to the pristine demo dataset baseline?")) {
      setResetting(true);
      try {
        if (onResetDemo) {
          await onResetDemo();
        } else {
          await api.resetDemoData();
          if (onRefresh) await onRefresh();
        }
        alert("Demo data successfully reset to baseline.");
      } catch (err) {
        console.error(err);
      } finally {
        setResetting(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Workspace Identity Row Banner */}
      <div className="bg-primary-surface border border-border rounded-xl px-5 py-3 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-accent">domain</span>
            <span className="font-table-text-medium text-table-text-medium text-primary-text font-semibold">
              {workspaceName}
            </span>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[12px] font-medium bg-subtle-surface text-secondary-text border border-border">
            Demo environment
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[12px] font-medium bg-soft-accent text-primary-accent border border-primary-accent/20">
            Supervised Mode
          </span>
        </div>
        <div className="flex items-center gap-2 text-metadata text-secondary-text">
          <span className="material-symbols-outlined text-[15px] text-muted-text">info</span>
          <span>Settings persist for current demo session.</span>
        </div>
      </div>

      {/* Main Canvas: Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Settings Navigation Menu (3 cols) */}
        <div className="lg:col-span-3 bg-primary-surface border border-border rounded-xl p-2.5 flex flex-col gap-1 shadow-2xs">
          <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-text">
            Settings Menu
          </div>

          {[
            { id: "general", label: "General", icon: "tune", badge: null },
            { id: "profile", label: "Profile", icon: "person", badge: "Admin" },
            { id: "notifications", label: "Notifications", icon: "notifications", badge: "3 rules" },
            { id: "data-sources", label: "Data Sources", icon: "swap_horiz", badge: "Live" },
            { id: "risk", label: "Risk Preferences", icon: "warning", badge: null },
            { id: "agents", label: "Agent Permissions", icon: "smart_toy", badge: "Autonomous" },
            { id: "security", label: "Security", icon: "lock", badge: "SOC2" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left w-full ${
                activeTab === item.id
                  ? "bg-soft-accent text-primary-accent"
                  : "text-secondary-text hover:bg-subtle-surface hover:text-primary-text"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-subtle-surface text-secondary-text border border-border">
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          <div className="mt-4 p-3 bg-subtle-surface border border-border rounded-xl text-xs">
            <span className="font-semibold text-primary-text block mb-1">Pristine State</span>
            <p className="text-[11px] text-secondary-text mb-2">Revert all consignments, port dwell, and routes to pristine state.</p>
            <button
              onClick={handleReset}
              disabled={resetting}
              className="w-full py-1.5 px-3 rounded-lg bg-primary-surface border border-border hover:bg-border text-high-risk font-semibold text-xs transition-colors flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">rotate_left</span>
              <span>{resetting ? "Resetting..." : "Reset Demo Data"}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Active Tab Content (9 cols) */}
        <div className="lg:col-span-9 bg-primary-surface border border-border rounded-xl p-6 shadow-2xs">
          {saved && (
            <div className="mb-4 p-3 rounded-xl bg-success-bg border border-success/30 text-success text-xs font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>Settings successfully updated.</span>
            </div>
          )}

          {activeTab === "general" && (
            <form onSubmit={handleSave} className="space-y-5">
              <div className="flex items-start justify-between pb-3 border-b border-border">
                <div>
                  <h2 className="font-section-heading text-section-heading font-semibold text-primary-text">Workspace Information</h2>
                  <p className="text-body text-[13px] text-secondary-text mt-0.5">Manage the basic tenant details for this logistics workspace.</p>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-subtle-surface text-secondary-text border border-border font-mono">
                  Tenant ID: WS-8849-GLB
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-secondary-text mb-1">Workspace Name</label>
                  <input
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-subtle-surface text-primary-text focus:outline-none focus:border-primary-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary-text mb-1">Organization Name</label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-subtle-surface text-primary-text focus:outline-none focus:border-primary-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary-text mb-1">Default Geographic Region</label>
                  <select
                    value={defaultRegion}
                    onChange={(e) => setDefaultRegion(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-subtle-surface text-primary-text focus:outline-none focus:border-primary-accent"
                  >
                    <option value="Global">Global Operations</option>
                    <option value="Asia-Pacific">Asia-Pacific (APAC)</option>
                    <option value="Europe">Europe &amp; Mediterranean</option>
                    <option value="North America">North America (Transpacific)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary-text mb-1">Operational Time Zone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-subtle-surface text-primary-text focus:outline-none focus:border-primary-accent"
                  >
                    <option value="Asia/Kolkata (UTC+05:30)">Asia/Kolkata (UTC+05:30)</option>
                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                    <option value="Asia/Shanghai (UTC+08:00)">Asia/Shanghai (UTC+08:00)</option>
                    <option value="Europe/Rotterdam (UTC+01:00)">Europe/Rotterdam (UTC+01:00)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary-accent hover:bg-primary text-on-primary font-button-input text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">check</span>
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === "profile" && (
            <div className="space-y-4">
              <h2 className="font-section-heading text-section-heading font-semibold text-primary-text">Operator Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-secondary-text mb-1">Full Name</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-subtle-surface text-primary-text focus:outline-none focus:border-primary-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-secondary-text mb-1">Operational Title</label>
                  <input
                    type="text"
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-subtle-surface text-primary-text focus:outline-none focus:border-primary-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-secondary-text mb-1">Corporate Email</label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-subtle-surface text-primary-text focus:outline-none focus:border-primary-accent"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-4">
              <h2 className="font-section-heading text-section-heading font-semibold text-primary-text">Notification Channels</h2>
              <div className="space-y-3">
                <div className="p-3 bg-subtle-surface border border-border rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-primary-text block">Urgent Email Alerts</span>
                    <span className="text-[11px] text-secondary-text">Send high-risk and critical threshold breaches directly to email.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="rounded border-border text-primary-accent focus:ring-0"
                  />
                </div>

                <div className="p-3 bg-subtle-surface border border-border rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-primary-text block">In-App Push &amp; Audio Beacon</span>
                    <span className="text-[11px] text-secondary-text">Broadcast live AIS deviation signals in browser session.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={inAppPush}
                    onChange={(e) => setInAppPush(e.target.checked)}
                    className="rounded border-border text-primary-accent focus:ring-0"
                  />
                </div>

                <div className="p-3 bg-subtle-surface border border-border rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-primary-text block">Webhook Dispatch (Slack / Teams)</span>
                    <span className="text-[11px] text-secondary-text">Forward agent findings to external enterprise messaging webhooks.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={webhookActive}
                    onChange={(e) => setWebhookActive(e.target.checked)}
                    className="rounded border-border text-primary-accent focus:ring-0"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "risk" && (
            <form onSubmit={handleSave} className="space-y-5">
              <h2 className="font-section-heading text-section-heading font-semibold text-primary-text">Risk Scoring Sensitivity</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-primary-text">Critical / High Risk Threshold:</span>
                    <span className="font-mono font-bold text-high-risk">{highThreshold} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="90"
                    value={highThreshold}
                    onChange={(e) => setHighThreshold(Number(e.target.value))}
                    className="w-full accent-primary-accent"
                  />
                  <span className="text-[11px] text-muted-text">Shipments with scores exceeding this are immediately flagged for manual intervention.</span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-primary-text">Medium Risk Threshold:</span>
                    <span className="font-mono font-bold text-medium-risk">{medThreshold} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="60"
                    value={medThreshold}
                    onChange={(e) => setMedThreshold(Number(e.target.value))}
                    className="w-full accent-primary-accent"
                  />
                  <span className="text-[11px] text-muted-text">Consignments entering this range receive automated agent monitoring.</span>
                </div>
              </div>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-primary-accent hover:bg-primary text-on-primary font-button-input text-xs font-semibold transition-colors"
              >
                Save Thresholds
              </button>
            </form>
          )}

          {activeTab === "data-sources" && (
            <div className="space-y-3">
              <h2 className="font-section-heading text-section-heading font-semibold text-primary-text">Data Pipeline Connectors</h2>
              <p className="text-xs text-secondary-text">Integrated maritime intelligence feeds:</p>
              <div className="divide-y divide-border">
                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-primary-text block">AIS Satellite Positioning</span>
                    <span className="text-[11px] text-muted-text">Live Global Fleet Telemetry • Latency: 45ms</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-success-bg text-success">Connected</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-primary-text block">NOAA Oceanic Meteorological</span>
                    <span className="text-[11px] text-muted-text">Wave Heights &amp; Gale Advisories • Latency: 320ms</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-success-bg text-success">Connected</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-primary-text block">Port Authority Scrapers (TinyFish)</span>
                    <span className="text-[11px] text-muted-text">Headless Chromium Task Engine • 15m polling</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-success-bg text-success">Connected</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "agents" && (
            <div className="space-y-3">
              <h2 className="font-section-heading text-section-heading font-semibold text-primary-text">Autonomous Agent Governance</h2>
              <div className="p-4 rounded-xl bg-subtle-surface border border-border space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-primary-text">Supervised Operation Mode</span>
                  <span className="font-bold text-success">Mandatory Human Review</span>
                </div>
                <p className="text-secondary-text leading-relaxed">
                  Agents operate in read-only and analytical recommendation modes. Disruption diversion calculations and carrier booking requests cannot be executed autonomously without human operator confirmation.
                </p>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-3">
              <h2 className="font-section-heading text-section-heading font-semibold text-primary-text">Security &amp; Tenant Governance</h2>
              <div className="p-4 rounded-xl bg-subtle-surface border border-border space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-primary-text">Two-Factor Authentication (2FA)</span>
                  <span className="font-bold text-success">Enforced</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="font-semibold text-primary-text">Single Sign-On (SAML 2.0 / Okta)</span>
                  <span className="font-medium text-secondary-text">Configured</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="font-semibold text-primary-text">Data Encryption</span>
                  <span className="font-medium text-secondary-text">AES-256 at rest, TLS 1.3 in transit</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
