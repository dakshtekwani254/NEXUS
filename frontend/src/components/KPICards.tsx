"use client";

import React from "react";
import { KPISummary } from "@/lib/types";

interface KPICardsProps {
  kpis?: Partial<KPISummary> | null;
  onSelectKPI?: (filterKey: string) => void;
}

export const KPICards: React.FC<KPICardsProps> = ({ kpis, onSelectKPI }) => {
  // Use real backend data if present, or fallback to Stitch demo values
  const monitoredCount = kpis?.monitored_shipments !== undefined ? kpis.monitored_shipments : 1284;
  const atRiskCount = kpis?.at_risk_shipments !== undefined ? kpis.at_risk_shipments : 86;
  const disruptionsCount = kpis?.active_disruptions !== undefined ? kpis.active_disruptions : 12;
  const portsCount = kpis?.high_risk_ports !== undefined && kpis.high_risk_ports > 0 ? kpis.high_risk_ports : 28;

  const cards = [
    {
      id: "monitored",
      title: "Monitored Shipments",
      value: monitoredCount.toLocaleString(),
      subtitle: "Across monitored corridors",
      icon: "local_shipping",
      iconBg: "bg-subtle-surface text-secondary-text",
      valueColor: "text-primary-text",
    },
    {
      id: "at_risk",
      title: "Shipments at Risk",
      value: atRiskCount.toLocaleString(),
      subtitle: "Require operational assessment",
      icon: "warning",
      iconBg: "bg-high-risk-bg text-high-risk",
      valueColor: "text-high-risk",
    },
    {
      id: "disruptions",
      title: "Active Disruptions",
      value: disruptionsCount.toLocaleString(),
      subtitle: "Across choke routes & ports",
      icon: "report",
      iconBg: "bg-medium-risk-bg text-medium-risk",
      valueColor: "text-primary-text",
    },
    {
      id: "ports",
      title: "Ports Monitored",
      value: portsCount.toLocaleString(),
      subtitle: "Telemetry nodes online",
      icon: "anchor",
      iconBg: "bg-subtle-surface text-secondary-text",
      valueColor: "text-primary-text",
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card) => (
        <div
          key={card.id}
          onClick={() => onSelectKPI && onSelectKPI(card.id)}
          className="bg-primary-surface border border-border rounded-xl p-5 hover:border-strong-border transition-colors duration-150 ease-in-out cursor-pointer shadow-2xs"
        >
          <div className="flex items-start justify-between">
            <span className="text-[14px] font-medium text-secondary-text">
              {card.title}
            </span>
            <div className={`p-1.5 rounded-lg ${card.iconBg} flex items-center justify-center`}>
              <span className="material-symbols-outlined text-[20px]">{card.icon}</span>
            </div>
          </div>
          <div className="mt-3">
            <div className={`text-[28px] font-bold tracking-tight ${card.valueColor}`}>
              {card.value}
            </div>
            <div className="text-[12px] text-muted-text mt-1">{card.subtitle}</div>
          </div>
        </div>
      ))}
    </section>
  );
};
