"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("elena.vance@nexus-logistics.io");
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const demoRoles = [
    { name: "Elena Vance", role: "Global Operations Director", email: "elena.vance@nexus-logistics.io" },
    { name: "Marcus Chen", role: "Supply Chain Risk Analyst", email: "marcus.chen@nexus-logistics.io" },
    { name: "Sarah Jenkins", role: "Port Logistics Supervisor", email: "sarah.j@nexus-logistics.io" },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push("/overview");
    }, 400);
  };

  const handleSelectRole = (roleEmail: string) => {
    setEmail(roleEmail);
  };

  return (
    <div className="min-h-screen bg-app-background text-primary-text font-sans antialiased flex flex-col justify-between selection:bg-soft-accent selection:text-primary-accent">
      {/* Top Bar with Back Link */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-border bg-primary-surface/80 backdrop-blur-xs">
        <Link href="/" className="flex items-center gap-2 group text-secondary-text hover:text-primary-text transition-colors">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span className="text-[13px] font-medium">Back to overview</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-[12px] font-mono text-secondary-text">NEXUS DEMO ENVIRONMENT</span>
        </div>
      </header>

      {/* Main Dual-Zone Container */}
      <main className="w-full flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-5xl bg-primary-surface border border-border rounded-xl shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          {/* Left Zone (45%): Brand Context & Live Topology Preview */}
          <section className="lg:col-span-5 bg-subtle-surface border-b lg:border-b-0 lg:border-r border-border p-8 flex flex-col justify-between relative overflow-hidden">
            <div>
              {/* Logo & Badges */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary-accent flex items-center justify-center text-primary-surface shadow-xs">
                    <span className="material-symbols-outlined text-[20px]">hub</span>
                  </div>
                  <div>
                    <span className="text-[16px] font-semibold text-primary-text block leading-tight">NEXUS</span>
                    <span className="text-[11px] text-muted-text">Supply Chain OS v2.8.4</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-primary-surface border border-border text-[11px] font-medium text-secondary-text">
                  Demo
                </span>
              </div>

              {/* Headline & Value Pitch */}
              <div className="space-y-3">
                <h1 className="text-[26px] font-semibold text-primary-text tracking-tight leading-snug">
                  Welcome back to a clearer view.
                </h1>
                <p className="text-[13px] text-secondary-text leading-relaxed">
                  Sign in to review shipment risk, investigate disruptions, and understand 
                  what is happening across your global supply network.
                </p>
              </div>

              {/* Middle Visual: SVG Network Topology */}
              <div className="my-6 bg-primary-surface border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary-accent text-[18px]">public</span>
                    <span className="text-[13px] font-medium text-primary-text">Active Corridors</span>
                  </div>
                  <span className="text-[11px] text-success font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Live Feeds
                  </span>
                </div>

                <div className="relative w-full h-28 bg-subtle-surface rounded-lg overflow-hidden flex items-center justify-center border border-border">
                  <svg className="w-full h-full" viewBox="0 0 360 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 20 80 Q 90 20 180 60 T 340 40" stroke="#4263EB" strokeWidth="2.5" fill="none" />
                    <path d="M 40 100 Q 140 90 220 30 T 320 80" stroke="#D94F4F" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
                    <circle cx="20" cy="80" r="4" fill="#4263EB" />
                    <circle cx="180" cy="60" r="4" fill="#4263EB" />
                    <circle cx="340" cy="40" r="4" fill="#4263EB" />
                    <circle cx="220" cy="30" r="4" fill="#D94F4F" />
                    <text x="25" y="98" fill="#667085" fontSize="10" fontFamily="sans-serif">Shanghai</text>
                    <text x="160" y="80" fill="#667085" fontSize="10" fontFamily="sans-serif">Singapore</text>
                    <text x="280" y="32" fill="#667085" fontSize="10" fontFamily="sans-serif">Rotterdam</text>
                  </svg>
                </div>
              </div>
            </div>

            {/* Bottom Proof Metric */}
            <div className="pt-4 border-t border-border flex items-center justify-between text-[12px] text-muted-text">
              <span>99.2% Disruption Precision</span>
              <span>Deterministic Engine</span>
            </div>
          </section>

          {/* Right Zone (55%): Login Form & Quick Role Presets */}
          <section className="lg:col-span-7 p-8 lg:p-10 flex flex-col justify-between">
            <div>
              <div className="mb-6">
                <h2 className="text-[22px] font-semibold text-primary-text tracking-tight">Sign In</h2>
                <p className="text-[13px] text-secondary-text mt-1">
                  Enter your credentials or choose a quick demo persona below.
                </p>
              </div>

              {/* Demo Persona Quick Select */}
              <div className="mb-6 p-3.5 rounded-xl bg-subtle-surface border border-border">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-text block mb-2">
                  Select Demo Persona
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  {demoRoles.map((r, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectRole(r.email)}
                      className={`text-left px-3 py-2 rounded-lg text-[12px] transition-colors flex items-center justify-between border ${
                        email === r.email
                          ? "bg-soft-accent border-primary-accent/30 text-primary-accent font-medium"
                          : "bg-primary-surface border-border text-secondary-text hover:text-primary-text hover:border-border"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-accent" />
                        <span className="font-medium text-primary-text">{r.name}</span>
                        <span className="text-[11px] text-muted-text">({r.role})</span>
                      </div>
                      <span className="text-[11px] text-muted-text font-mono">Use</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Authentication Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-primary-text mb-1">
                    Work Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-primary-surface text-primary-text text-[14px] focus:outline-hidden focus:border-primary-accent transition-colors"
                    placeholder="name@company.com"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[13px] font-medium text-primary-text">
                      Password
                    </label>
                    <button 
                      type="button"
                      onClick={() => alert("Password reset instructions have been dispatched to your corporate email address.")}
                      className="text-[12px] text-primary-accent hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-border bg-primary-surface text-primary-text text-[14px] focus:outline-hidden focus:border-primary-accent transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary-text hover:text-primary-text"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-[13px] text-secondary-text">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded-sm border-border text-primary-accent focus:ring-0"
                    />
                    <span>Remember this session</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 rounded-xl bg-primary-accent hover:bg-primary text-on-primary font-medium text-[14px] shadow-xs flex items-center justify-center gap-2 transition-colors duration-150"
                >
                  {loading ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>Enter Control Tower</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Note at Bottom */}
            <div className="pt-6 mt-6 border-t border-border text-center">
              <p className="text-[12px] text-muted-text">
                Demo simulation environment. No real enterprise credentials are required.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 px-6 text-center text-[12px] text-muted-text border-t border-border bg-primary-surface">
        NEXUS Supply Chain OS • Secure Authenticated Session
      </footer>
    </div>
  );
}
