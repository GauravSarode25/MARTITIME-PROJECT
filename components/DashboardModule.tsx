"use client";

import React, { useState } from "react";
import { 
  BarChart3, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Filter, 
  Layers, 
  Globe, 
  Anchor, 
  Ship, 
  ArrowUpRight,
  ExternalLink,
  Sliders,
  Calendar
} from "lucide-react";
import { SlickIncident, CORRIDOR_STATS, RECURRENT_OFFENDERS } from "../data/mockMaritimeData";

interface DashboardModuleProps {
  incidents: SlickIncident[];
  onSelectIncident: (incident: SlickIncident) => void;
  onOpenAnalysis: (incident: SlickIncident) => void;
  onNavigateToTab?: (tab: "map" | "dashboard" | "analysis" | "simulator" | "patterns") => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  incidents,
  onSelectIncident,
  onOpenAnalysis,
  onNavigateToTab
}) => {
  // Global Filters State
  const [regionFilter, setRegionFilter] = useState<string>("ALL");
  const [minConfidence, setMinConfidence] = useState<number>(50);
  const [marpolFilter, setMarpolFilter] = useState<string>("ALL");

  return (
    <div className="w-full h-full p-6 overflow-y-auto bg-[#f7f8fa] space-y-6">
      {/* Global Filter Toolbar */}
      <div className="navy-panel p-4 rounded-lg flex flex-wrap items-center justify-between gap-5 bg-white border border-[#e2e8f0] shadow-sm">
        <div className="text-[#1a1f2e] font-sans font-semibold text-[14px]">
          GLOBAL COMMAND FILTERS
        </div>

        <div className="flex flex-wrap items-center gap-5 text-[12px] font-sans">
          {/* Region Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-medium">Region:</span>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="bg-[#f8fafc] text-[#1a1f2e] border border-[#e2e8f0] rounded px-3 py-1.5 focus:outline-none focus:border-amber-600 font-medium shadow-xs"
            >
              <option value="ALL">All Strategic Sectors</option>
              <option value="Malacca">Malacca & Singapore Straits</option>
              <option value="NorthSea">North Sea & English Channel</option>
              <option value="Hormuz">Persian Gulf & Hormuz</option>
            </select>
          </div>

          {/* Confidence Level Slider */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-medium">Min Risk Threshold:</span>
            <input
              type="range"
              min="0"
              max="90"
              step="10"
              value={minConfidence}
              onChange={(e) => setMinConfidence(Number(e.target.value))}
              className="accent-amber-600 w-24 cursor-pointer"
            />
            <span className="text-[#b45309] font-mono font-bold w-8">{minConfidence}%</span>
          </div>

          {/* MARPOL Annex Selector */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-medium">MARPOL Category:</span>
            <select
              value={marpolFilter}
              onChange={(e) => setMarpolFilter(e.target.value)}
              className="bg-[#f8fafc] text-[#1a1f2e] border border-[#e2e8f0] rounded px-3 py-1.5 focus:outline-none focus:border-amber-600 font-medium shadow-xs"
            >
              <option value="ALL">All Violations</option>
              <option value="AnnexI">MARPOL Annex I (Oil)</option>
              <option value="AnnexII">MARPOL Annex II (Noxious)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Metrics Bar Header (4 Executive KPI Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="accent-stat-card p-5 rounded-lg relative overflow-hidden bg-white">
          <div className="text-[11px] font-sans text-slate-500 uppercase tracking-tight font-medium">
            TOTAL SAR SCENES PROCESSED
          </div>
          <div className="mt-2 text-[26px] font-mono font-bold text-[#1a1f2e]">1,482</div>
          <div className="mt-1 text-[11px] text-emerald-700 font-sans font-medium flex items-center gap-1">
            <span>+14.2% Sentinel-1A / RADARSAT coverage</span>
          </div>
        </div>

        <div className="accent-stat-card p-5 rounded-lg relative overflow-hidden bg-white">
          <div className="text-[11px] font-sans text-slate-500 uppercase tracking-tight font-medium">
            SLICKS DETECTED (km²)
          </div>
          <div className="mt-2 text-[26px] font-mono font-bold text-amber-700">347 <span className="text-[12px] font-mono font-normal text-slate-500">(4,820 km²)</span></div>
          <div className="mt-1 text-[11px] text-amber-800 font-sans font-medium">
            <span>Dark spot contrast &gt; 6.5 dB</span>
          </div>
        </div>

        <div className="accent-stat-card p-5 rounded-lg relative overflow-hidden bg-white">
          <div className="text-[11px] font-sans text-slate-500 uppercase tracking-tight font-medium">
            HIGH-CONFIDENCE ATTRIBUTIONS
          </div>
          <div className="mt-2 text-[26px] font-mono font-bold text-red-700">89 <span className="text-[12px] font-mono font-normal text-slate-500">(&gt;85% match)</span></div>
          <div className="mt-1 text-[11px] text-red-700 font-sans font-medium">
            <span>Flagged for Port State Enforcement</span>
          </div>
        </div>

        <div className="accent-stat-card p-5 rounded-lg relative overflow-hidden bg-white">
          <div className="text-[11px] font-sans text-slate-500 uppercase tracking-tight font-medium">
            ACTIVE WATCH CORRIDORS
          </div>
          <div className="mt-2 text-[26px] font-mono font-bold text-[#b45309]">14 <span className="text-[12px] font-mono font-normal text-slate-500">Hotspots</span></div>
          <div className="mt-1 text-[11px] text-emerald-700 font-sans font-medium flex items-center gap-1">
            <span>Telemetry streams synchronized</span>
          </div>
        </div>
      </div>

      {/* Main Grid Section: Trend Charts & Recent Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Regional Detections & Implicated Vessel Classes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart 1: Detection Frequency Over Time */}
          <div className="accent-stat-card p-5 rounded-lg space-y-4 bg-white">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
              <div className="font-sans font-semibold text-[14px] text-[#1a1f2e]">
                REGIONAL OIL SLICK DETECTIONS OVER TIME (2026)
              </div>
              <span className="text-[11px] font-sans text-slate-500">Monthly Density Barometer</span>
            </div>

            {/* Custom Graphic Bar Chart */}
            <div className="h-48 w-full flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-200 relative">
              {/* Background grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                <div className="border-b border-slate-200 w-full" />
                <div className="border-b border-slate-200 w-full" />
                <div className="border-b border-slate-200 w-full" />
              </div>

              {[
                { month: "Jan", count: 24, high: 6 },
                { month: "Feb", count: 31, high: 8 },
                { month: "Mar", count: 42, high: 12 },
                { month: "Apr", count: 38, high: 10 },
                { month: "May", count: 52, high: 15 },
                { month: "Jun", count: 48, high: 14 },
                { month: "Jul", count: 64, high: 18 },
                { month: "Aug", count: 59, high: 16 },
                { month: "Sep", count: 47, high: 13 }
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 z-10 group cursor-pointer">
                  <div className="w-full bg-[#f8fafc] rounded overflow-hidden flex flex-col justify-end h-36 border border-slate-200 relative">
                    {/* Total Slick Bar */}
                    <div
                      style={{ height: `${(item.count / 70) * 100}%` }}
                      className="w-full bg-gradient-to-t from-amber-200 to-amber-500 rounded-t group-hover:brightness-110 transition-all"
                    />
                    {/* High Confidence Alert Overlay */}
                    <div
                      style={{ height: `${(item.high / 70) * 100}%` }}
                      className="w-full bg-gradient-to-t from-red-600 to-red-700 absolute bottom-0 left-0 opacity-90"
                    />
                  </div>
                  <span className="text-[11px] font-sans text-slate-600 group-hover:text-[#b45309] font-semibold">
                    {item.month}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-5 text-[12px] font-sans pt-1">
              <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-sm" /> Total SAR Detections
              </span>
              <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                <span className="w-2.5 h-2.5 bg-red-600 rounded-sm" /> High-Confidence Vessel Matches
              </span>
            </div>
          </div>

          {/* Implicated Vessel Types & Condensed Offender Watchlist */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vessel Type Distribution (Horizontal Stacked Bar) */}
            <div className="accent-stat-card p-5 rounded-lg space-y-4 bg-white">
              <div className="font-sans font-semibold text-[14px] text-[#1a1f2e] border-b border-[#e2e8f0] pb-2">
                IMPLICATED VESSEL CLASSES
              </div>

              <div className="space-y-4 font-sans text-[13px]">
                {/* Single Multi-segmented Stacked Bar */}
                <div className="h-3.5 w-full rounded-full overflow-hidden flex border border-slate-200 shadow-xs">
                  <div style={{ width: "44%" }} className="bg-red-600 h-full" title="VLCC Crude Tankers: 44%" />
                  <div style={{ width: "28%" }} className="bg-amber-600 h-full" title="Chemical & Product: 28%" />
                  <div style={{ width: "16%" }} className="bg-amber-400 h-full" title="Container Ships: 16%" />
                  <div style={{ width: "12%" }} className="bg-emerald-600 h-full" title="Bulk Carriers & Fishing: 12%" />
                </div>

                {/* Compact Legend Grid */}
                <div className="grid grid-cols-2 gap-2.5 text-[12px] font-sans text-slate-700 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-xs bg-red-600 shrink-0" />
                    <span className="truncate">VLCC Tankers (<strong className="font-mono">44%</strong>)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-xs bg-amber-600 shrink-0" />
                    <span className="truncate">Chem/Product (<strong className="font-mono">28%</strong>)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-xs bg-amber-400 shrink-0" />
                    <span className="truncate">Container Ships (<strong className="font-mono">16%</strong>)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600 shrink-0" />
                    <span className="truncate">Bulk & Fishing (<strong className="font-mono">12%</strong>)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recurrent Offender Watchlist (Condensed Top 3 with Link to Patterns) */}
            <div className="accent-stat-card p-5 rounded-lg space-y-4 bg-white">
              <div className="font-sans font-semibold text-[14px] text-[#1a1f2e] flex items-center justify-between border-b border-[#e2e8f0] pb-2">
                <span>RECURRENT OFFENDER WATCHLIST</span>
                {onNavigateToTab && (
                  <button
                    onClick={() => onNavigateToTab("patterns")}
                    className="text-[12px] font-sans font-semibold text-[#b45309] hover:underline"
                  >
                    Full Registry →
                  </button>
                )}
              </div>

              <div className="space-y-2.5 text-[13px] font-sans">
                {RECURRENT_OFFENDERS.slice(0, 3).map((off, idx) => (
                  <div key={idx} className="bg-[#f8fafc] p-3 rounded-lg border border-[#e2e8f0] flex items-center justify-between">
                    <div>
                      <div className="font-sans font-semibold text-[#1a1f2e]">{off.name}</div>
                      <div className="text-[11px] font-sans text-slate-500">MMSI: <span className="font-mono">{off.mmsi}</span> | Flag: {off.flag}</div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 text-[11px] font-mono font-bold">
                        {off.incidentsCount} Incidents
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Top 3 High-Confidence Incidents & Strategic Corridors */}
        <div className="space-y-6">
          {/* Top 3 High-Confidence Incidents */}
          <div className="accent-stat-card p-5 rounded-lg space-y-4 bg-white">
            <div className="font-sans font-semibold text-[14px] text-[#1a1f2e] flex items-center justify-between border-b border-[#e2e8f0] pb-2">
              <span>HIGH-CONFIDENCE INCIDENTS</span>
              {onNavigateToTab && (
                <button
                  onClick={() => onNavigateToTab("analysis")}
                  className="text-[12px] font-sans font-semibold text-[#b45309] hover:underline"
                >
                  View all ({incidents.length}) →
                </button>
              )}
            </div>

            <div className="space-y-3">
              {incidents.slice(0, 3).map((incident) => {
                const topCandidate = incident.candidates[0];
                return (
                  <div
                    key={incident.id}
                    className="bg-[#f8fafc] p-3.5 rounded-lg border border-[#e2e8f0] hover:border-amber-600 transition-all space-y-2 group cursor-pointer shadow-xs"
                    onClick={() => {
                      onSelectIncident(incident);
                      onOpenAnalysis(incident);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="font-sans font-semibold text-[13px] text-[#1a1f2e] group-hover:text-[#b45309]">
                        {incident.title}
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-800 border border-red-300 text-[10px] font-mono font-bold">
                        {topCandidate ? `${topCandidate.riskScore}% RISK` : 'HIGH'}
                      </span>
                    </div>

                    <div className="text-[12px] font-sans text-slate-600 space-y-0.5">
                      <div>SAR Pass: <span className="font-mono text-slate-800">{incident.acquisitionUtc}</span></div>
                      <div>Slick Area: <span className="font-mono text-amber-800 font-semibold">{incident.slickAreaKm2} km² ({incident.estBarrels} bbls)</span></div>
                      {topCandidate && (
                        <div className="text-amber-900 font-semibold pt-1 border-t border-slate-200 flex items-center justify-between">
                          <span>Target: {topCandidate.name}</span>
                          <span className="text-[11px] text-[#b45309] font-bold">
                            Analyze →
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strategic Corridors */}
          <div className="accent-stat-card p-5 rounded-lg space-y-4 bg-white">
            <div className="font-sans font-semibold text-[14px] text-[#1a1f2e] border-b border-[#e2e8f0] pb-2">
              HIGH-RISK MARITIME CORRIDORS
            </div>

            <div className="space-y-2.5">
              {CORRIDOR_STATS.map((corr) => (
                <div key={corr.id} className="bg-[#f8fafc] p-3 rounded-lg border border-[#e2e8f0] text-[12px] font-sans space-y-1">
                  <div className="flex justify-between text-[#1a1f2e]">
                    <span className="font-semibold text-[13px]">{corr.name}</span>
                    <span className="text-amber-800 font-mono font-bold">{corr.incidentCount} incidents</span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center justify-between font-sans">
                    <span>Types: {corr.primaryVesselTypes.join(", ")}</span>
                    <span className="text-red-700 font-mono font-semibold">{corr.highConfidenceCount} confirmed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
