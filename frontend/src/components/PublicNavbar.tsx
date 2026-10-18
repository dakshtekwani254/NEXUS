"use client";

import React from "react";
import Link from "next/link";

export const PublicNavbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-primary-surface/95 backdrop-blur-md border-b border-border transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-soft-accent border border-primary-accent/20 flex items-center justify-center text-primary-accent group-hover:scale-105 transition-transform duration-150">
            <span className="material-symbols-outlined text-[20px]">hub</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[18px] font-bold tracking-tight text-primary-text">NEXUS</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-accent"></span>
            </div>
            <span className="text-[9px] uppercase tracking-wider font-semibold text-muted-text -mt-1">
              SUPPLY CHAIN INTELLIGENCE
            </span>
          </div>
        </Link>

        {/* Center: Nav links */}
        <nav className="hidden md:flex items-center space-x-8">
          <a
            className="text-[14px] text-secondary-text hover:text-primary-text transition-colors duration-150"
            href="#platform"
          >
            Platform
          </a>
          <a
            className="text-[14px] text-secondary-text hover:text-primary-text transition-colors duration-150"
            href="#capabilities"
          >
            Capabilities
          </a>
          <a
            className="text-[14px] text-secondary-text hover:text-primary-text transition-colors duration-150"
            href="#how-it-works"
          >
            How It Works
          </a>
          <a
            className="text-[14px] text-secondary-text hover:text-primary-text transition-colors duration-150"
            href="#principles"
          >
            Principles
          </a>
          <Link
            className="text-[14px] text-primary-accent font-medium hover:text-primary transition-colors duration-150"
            href="/overview"
          >
            Live Radar
          </Link>
        </nav>

        {/* Right: Action CTAs */}
        <div className="flex items-center gap-3">
          <Link
            className="text-[14px] font-medium text-secondary-text hover:text-primary-text px-3 py-1.5 rounded-lg border border-transparent hover:border-border transition-colors duration-150"
            href="/login"
          >
            Log in
          </Link>
          <Link
            className="inline-flex items-center justify-center text-[14px] font-medium text-on-primary bg-primary-accent hover:bg-primary transition-colors duration-150 px-4 py-2 rounded-xl shadow-xs"
            href="/overview"
          >
            Launch Platform
          </Link>
        </div>
      </div>
    </header>
  );
};
