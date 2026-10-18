"use client";

import React, { useState } from "react";
import { DisruptionEvent, EventCategory } from "@/lib/types";

interface LiveDisruptionFeedProps {
  disruptions: DisruptionEvent[];
  onSelectDisruption: (d: DisruptionEvent) => void;
}

export const LiveDisruptionFeed: React.FC<LiveDisruptionFeedProps> = ({
  disruptions,
  onSelectDisruption,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const categories = [
    { id: "ALL", label: "All" },
    { id: "PORT_CONGESTION", label: "Congestion" },
    { id: "WEATHER", label: "Weather" },
    { id: "GEOPOLITICAL", label: "Geopolitical" },
    { id: "LABOUR_STRIKE", label: "Strikes" },
  ];

  const filtered =
    selectedCategory === "ALL"
      ? disruptions
      : disruptions.filter((d) => d.category === selectedCategory);

  const getSeverityBadge = (sev: string) => {
    const s = sev?.toUpperCase() || "";
    if (s === "CRITICAL" || s === "HIGH") {
      return (
        <span className="px-2 py-0.5 rounded-md bg-high-risk-bg text-high-risk text-[11px] font-semibold">
          High
        </span>
      );
    }
    if (s === "MEDIUM" || s === "MODERATE") {
      return (
        <span className="px-2 py-0.5 rounded-md bg-medium-risk-bg text-medium-risk text-[11px] font-semibold">
          Medium
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-md bg-success-bg text-success text-[11px] font-semibold">
        Low
      </span>
    );
  };

  return (
    <div className="bg-primary-surface border border-border rounded-xl shadow-2xs overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-accent text-[20px]">
              warning
            </span>
            <h3 className="text-[16px] font-semibold text-primary-text">
              Live Disruption Feed
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-subtle-surface border border-border text-[11px] font-medium text-secondary-text">
            {disruptions.length} Active
          </span>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-2.5 py-1 rounded-lg text-[12px] font-medium transition-colors shrink-0 ${
                selectedCategory === c.id
                  ? "bg-primary-accent text-on-primary shadow-2xs"
                  : "bg-subtle-surface text-secondary-text hover:text-primary-text hover:bg-border"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Disruption Feed Items */}
      <div className="p-4 space-y-3 overflow-y-auto max-h-[500px]">
        {filtered.length === 0 ? (
          <div className="py-8 text-center text-[13px] text-muted-text">
            No active disruptions reported in this category.
          </div>
        ) : (
          filtered.map((d) => (
            <div
              key={d.id}
              onClick={() => onSelectDisruption(d)}
              className="p-3.5 rounded-xl border border-border bg-subtle-surface hover:border-strong-border transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="text-[13px] font-semibold text-primary-text group-hover:text-primary-accent transition-colors leading-snug">
                  {d.headline}
                </span>
                {getSeverityBadge(d.severity)}
              </div>

              <p className="text-[12px] text-secondary-text line-clamp-2 leading-relaxed mb-2.5">
                {d.description}
              </p>

              <div className="flex items-center justify-between text-[11px] text-muted-text pt-2 border-t border-border/60">
                <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                  <span className="material-symbols-outlined text-[14px]">location_on</span>
                  <span className="truncate">{d.location}</span>
                </div>
                <span className="text-primary-accent font-medium group-hover:underline flex items-center gap-0.5">
                  Inspect
                  <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
