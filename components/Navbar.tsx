"use client";

import React, { useState, useEffect } from "react";
import { Shield, Radio, Activity, Navigation, Compass, Layers, BarChart3, Search, PlayCircle, TrendingUp, Clock } from "lucide-react";

interface NavbarProps {
  activeModule: "map" | "dashboard" | "analysis" | "simulator" | "patterns";
  setActiveModule: (module: "map" | "dashboard" | "analysis" | "simulator" | "patterns") => void;
  selectedIncidentId: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeModule,
  setActiveModule,
  selectedIncidentId
}) => {
  const [utcTime, setUtcTime] = useState<string>("");
  const [showInfo, setShowInfo] = useState<boolean>(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const isoString = now.toISOString().replace("T", " ").substring(0, 19) + " UTC";
      setUtcTime(isoString);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full bg-[#edf1f5] border-b border-[#cbd5e1] text-[#4a5568] shadow-sm z-40 relative">
      {/* Top Accent Line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-[#1a1f2e] via-[#d97706] to-[#1a1f2e]" />

      <div className="px-5 py-2.5 flex items-center justify-between gap-4">
        {/* Logo & Title Header */}
        <div className="flex items-center gap-3">
          {/* Modern Flat Vector Satellite/SAR Logo */}
          <div className="flex items-center justify-center w-8 h-8 rounded bg-white border border-[#cbd5e1] shadow-xs">
            <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2.5 L27.5 9.1 V22.9 L16 29.5 L4.5 22.9 V9.1 Z" stroke="#1a1f2e" strokeWidth="2.2" strokeLinejoin="round" fill="none" />
              <path d="M9.5 13 C12 10.5 20 10.5 22.5 13" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
              <path d="M11.5 22 L16 11.5 L20.5 22" stroke="#1a1f2e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13.5 17.5 H18.5" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
              <circle cx="16" cy="6.5" r="1.5" fill="#d97706" />
            </svg>
          </div>

          <div className="flex items-center gap-2">
            <h1 className="text-[17px] font-semibold text-[#1a1f2e] tracking-tight">
              <span className="text-[#b45309] font-bold">AEGIS</span> MARITIME
            </h1>
            
            {/* Info Menu Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="text-[11px] px-2 py-0.5 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-sans font-medium transition-colors shadow-2xs"
                title="System Info & Specifications"
              >
                v6.4 ℹ️
              </button>

              {/* System Info Popover */}
              {showInfo && (
                <div className="absolute top-8 left-0 w-64 bg-white border border-[#cbd5e1] rounded-lg shadow-lg p-3 text-[12px] font-sans text-slate-700 z-50 space-y-2 animate-in fade-in zoom-in-95 duration-150">
                  <div className="font-semibold text-[#1a1f2e] border-b border-slate-200 pb-1 flex justify-between items-center">
                    <span>SYSTEM SPECIFICATIONS</span>
                    <button onClick={() => setShowInfo(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
                  </div>
                  <div className="space-y-1 font-mono text-[11px]">
                    <div>Command: Nat'l Maritime Intel</div>
                    <div>Platform: NAVAL GIS v6.4</div>
                    <div>Satellite: Sentinel-1A C-Band SAR</div>
                    <div>AIS Pipeline: 12.4k Stream/sec</div>
                    <div>Datum: WGS-84 / EGM96</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Module Tabs */}
        <nav className="flex items-center gap-1 bg-white p-1 rounded-md border border-[#cbd5e1] shadow-xs">
          <button
            onClick={() => setActiveModule("map")}
            className={`px-3.5 py-1 rounded text-[13px] font-medium transition-all duration-200 ${
              activeModule === "map"
                ? "bg-[#1a1f2e] text-white shadow-xs font-semibold"
                : "text-slate-700 hover:text-[#1a1f2e] hover:bg-slate-100"
            }`}
          >
            <span>GIS MAP</span>
          </button>

          <button
            onClick={() => setActiveModule("dashboard")}
            className={`px-3.5 py-1 rounded text-[13px] font-medium transition-all duration-200 ${
              activeModule === "dashboard"
                ? "bg-[#1a1f2e] text-white shadow-xs font-semibold"
                : "text-slate-700 hover:text-[#1a1f2e] hover:bg-slate-100"
            }`}
          >
            <span>COMMAND DASHBOARD</span>
          </button>

          <button
            onClick={() => setActiveModule("analysis")}
            className={`flex items-center gap-1.5 px-3.5 py-1 rounded text-[13px] font-medium transition-all duration-200 ${
              activeModule === "analysis"
                ? "bg-[#1a1f2e] text-white shadow-xs font-semibold"
                : "text-slate-700 hover:text-[#1a1f2e] hover:bg-slate-100"
            }`}
          >
            <span>INCIDENT ANALYSIS</span>
            {selectedIncidentId && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveModule("simulator")}
            className={`flex items-center gap-1.5 px-3.5 py-1 rounded text-[13px] font-medium transition-all duration-200 ${
              activeModule === "simulator"
                ? "bg-amber-600 text-white shadow-xs font-semibold"
                : "text-[#b45309] hover:bg-amber-50"
            }`}
          >
            <span className="font-semibold">REPORT ANALYZER</span>
            <span className="text-[9px] px-1 py-0.2 bg-red-700 text-white rounded uppercase font-bold">DEMO</span>
          </button>

          <button
            onClick={() => setActiveModule("patterns")}
            className={`px-3.5 py-1 rounded text-[13px] font-medium transition-all duration-200 ${
              activeModule === "patterns"
                ? "bg-[#1a1f2e] text-white shadow-xs font-semibold"
                : "text-slate-700 hover:text-[#1a1f2e] hover:bg-slate-100"
            }`}
          >
            <span>PATTERNS & TRENDS</span>
          </button>
        </nav>

        {/* System Telemetry & Live Clock Panel (Single Compact Strip) */}
        <div className="flex items-center gap-3 text-[12px] font-sans">
          <div className="flex items-center gap-3 px-3 py-1 rounded bg-[#f8fafc] border border-[#e2e8f0] text-[#1a1f2e]">
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-[12px]">AIS Stream: <strong className="font-mono">ACTIVE (12.4K)</strong></span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1.5 text-slate-700 font-medium">
              <span className="text-[12px]">GPS: <strong className="font-mono text-[#b45309]">FIX-3D</strong></span>
            </div>
          </div>

          {/* Live UTC Clock */}
          <div className="px-3 py-1 rounded bg-white border border-[#e2e8f0] shadow-xs text-[#1a1f2e]">
            <span className="text-[12px] font-mono font-medium">{utcTime || "UTC"}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
