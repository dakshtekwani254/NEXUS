"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { DEMO_TEMPLATES } from "@/lib/demoData";

export default function SavedPromptsTemplatesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"TEMPLATES" | "PROMPTS">("TEMPLATES");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Port Disruptions");
  const [newText, setNewText] = useState("");

  const filtered = DEMO_TEMPLATES.filter((t) => {
    const matchCategory = selectedCategory === "ALL" || t.category === selectedCategory;
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      (t.prompt || t.promptText || "").toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    DEMO_TEMPLATES.unshift({
      id: `TPL-${Date.now().toString().slice(-4)}`,
      title: newTitle,
      category: newCategory,
      description: newText.slice(0, 80) + "...",
      prompt: newText,
      promptText: newText,
      tags: [newCategory],
      type: "template",
      usageCount: 1,
      lastUsed: "Just now",
    });
    setIsModalOpen(false);
    setNewTitle("");
    setNewText("");
  };

  const handleUseTemplate = (prompt: string) => {
    router.push(`/ai-analyst?prompt=${encodeURIComponent(prompt)}`);
  };

  return (
    <AppShell
      title="Saved Prompts &amp; Templates"
      subtitle="Standardized investigation playbooks and prompt libraries for autonomous supply-network analysis."
      actions={
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-accent hover:bg-primary text-on-primary font-button-input text-button-input shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>+ New Template</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Navigation tabs within AI Analyst suite */}
        <div className="flex items-center gap-2 border-b border-border pb-3 text-body font-medium">
          <Link href="/ai-analyst" className="px-3 py-1.5 rounded-lg text-secondary-text hover:text-primary-text hover:bg-subtle-surface transition-colors">
            Workspace
          </Link>
          <Link href="/ai-analyst/investigations" className="px-3 py-1.5 rounded-lg text-secondary-text hover:text-primary-text hover:bg-subtle-surface transition-colors">
            History
          </Link>
          <Link href="/ai-analyst/compare" className="px-3 py-1.5 rounded-lg text-secondary-text hover:text-primary-text hover:bg-subtle-surface transition-colors">
            Compare
          </Link>
          <Link href="/ai-analyst/templates" className="px-3 py-1.5 rounded-lg bg-soft-accent text-primary-accent font-semibold transition-colors">
            Prompts &amp; Templates
          </Link>
          <Link href="/ai-analyst/knowledge-base" className="px-3 py-1.5 rounded-lg text-secondary-text hover:text-primary-text hover:bg-subtle-surface transition-colors">
            Knowledge Base
          </Link>
        </div>

        {/* Tab & Filter bar */}
        <div className="bg-primary-surface p-4 rounded-xl border border-border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center p-1 bg-subtle-surface border border-border rounded-xl">
            <button
              onClick={() => setActiveTab("TEMPLATES")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === "TEMPLATES"
                  ? "bg-primary-surface text-primary-accent shadow-xs"
                  : "text-secondary-text hover:text-primary-text"
              }`}
            >
              Investigation Templates
            </button>
            <button
              onClick={() => setActiveTab("PROMPTS")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === "PROMPTS"
                  ? "bg-primary-surface text-primary-accent shadow-xs"
                  : "text-secondary-text hover:text-primary-text"
              }`}
            >
              Saved Prompts ({DEMO_TEMPLATES.length})
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[220px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-text text-[18px]">search</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search templates &amp; prompts..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-border bg-subtle-surface text-primary-text placeholder:text-muted-text focus:outline-none focus:border-primary-accent"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-border bg-subtle-surface text-primary-text cursor-pointer focus:outline-none focus:border-primary-accent"
            >
              <option value="ALL">All Categories</option>
              <option value="Port Disruptions">Port Disruptions</option>
              <option value="Route Comparison">Route Comparison</option>
              <option value="Vessel Bottleneck">Vessel Bottleneck</option>
              <option value="Weather Impact">Weather Impact</option>
            </select>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-primary-surface border border-border rounded-xl p-5 hover:border-strong-border transition-colors flex flex-col justify-between shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-soft-accent text-primary-accent border border-primary-accent/20">
                    {tpl.category}
                  </span>
                  <span className="text-[11px] font-metadata text-muted-text">
                    Used {tpl.usageCount} times
                  </span>
                </div>
                <h3 className="font-section-heading text-section-heading text-primary-text font-semibold mb-1">
                  {tpl.title}
                </h3>
                <p className="text-[13px] text-secondary-text mb-3 leading-relaxed">
                  {tpl.description}
                </p>
                <div className="p-3 bg-subtle-surface rounded-lg border border-border text-[12px] font-mono text-primary-text mb-4 select-all">
                  &quot;{tpl.prompt || tpl.promptText}&quot;
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between">
                <span className="text-[11px] text-muted-text">Last used: {tpl.lastUsed}</span>
                <button
                  onClick={() => handleUseTemplate(tpl.prompt || tpl.promptText || "")}
                  className="px-3 py-1.5 rounded-lg bg-soft-accent text-primary-accent hover:bg-primary-accent hover:text-on-primary text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">play_arrow</span>
                  <span>Use Template</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for + New Template */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-primary-text/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-primary-surface border border-border rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-section-heading text-section-heading text-primary-text">Create Investigation Template</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-secondary-text hover:text-primary-text rounded-lg"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-secondary-text mb-1">Template Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g., Panama Canal Lake Draft Surcharge Assessment"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-subtle-surface text-primary-text focus:outline-none focus:border-primary-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary-text mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-subtle-surface text-primary-text focus:outline-none focus:border-primary-accent"
                  >
                    <option value="Port Disruptions">Port Disruptions</option>
                    <option value="Route Comparison">Route Comparison</option>
                    <option value="Vessel Bottleneck">Vessel Bottleneck</option>
                    <option value="Weather Impact">Weather Impact</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary-text mb-1">Prompt Instructions / Variables</label>
                  <textarea
                    rows={4}
                    required
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    placeholder="Analyze {port_name} operational queues for {carrier_code} vessels..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-subtle-surface text-primary-text focus:outline-none focus:border-primary-accent"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-secondary-text hover:text-primary-text"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-primary-accent text-on-primary text-xs font-semibold hover:bg-primary transition-colors"
                  >
                    Save Template
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
