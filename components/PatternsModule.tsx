"use client";

import React, { useState } from "react";
import { 
  TrendingUp, 
  Globe, 
  AlertTriangle, 
  Moon, 
  Sun, 
  Ship, 
  FileText, 
  BarChart2, 
  Clock,
  ShieldAlert,
  Search
} from "lucide-react";
import { CORRIDOR_STATS, RECURRENT_OFFENDERS } from "../data/mockMaritimeData";

export const PatternsModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"CORRIDORS" | "RECURRENT" | "GAPS">("CORRIDORS");

  return (
    <div className="w-full h-full p-6 overflow-y-auto bg-[#f7f8fa] space-y-6">
      {/* Module Header Bar */}
      <div className="navy-panel p-5 rounded-lg flex flex-wrap items-center justify-between gap-5 border-b-2 border-amber-600 bg-white border border-[#e2e8f0] shadow-sm">
        <div>
          <h2 className="font-sans font-semibold text-[#1a1f2e] text-[18px]">
            MARITIME PATTERNS, CORRIDORS & RECURRENCE ANALYTICS
          </h2>
          <p className="text-[12px] font-sans text-slate-500 mt-0.5">
            Long-term SAR discharge clustering, transponder dark window frequency, and flag-state violation profiling
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-[#f1f5f9] p-1 rounded border border-[#e2e8f0] text-[13px] font-sans font-medium">
          <button
            onClick={() => setActiveTab("CORRIDORS")}
            className={`px-3.5 py-1.5 rounded transition-all ${
              activeTab === "CORRIDORS" ? "bg-amber-600 text-white font-semibold shadow-xs" : "text-slate-600 hover:text-[#1a1f2e]"
            }`}
          >
            Route Corridors
          </button>
          <button
            onClick={() => setActiveTab("RECURRENT")}
            className={`px-3.5 py-1.5 rounded transition-all ${
              activeTab === "RECURRENT" ? "bg-amber-600 text-white font-semibold shadow-xs" : "text-slate-600 hover:text-[#1a1f2e]"
            }`}
          >
            Recurrent Offenders
          </button>
          <button
            onClick={() => setActiveTab("GAPS")}
            className={`px-3.5 py-1.5 rounded transition-all ${
              activeTab === "GAPS" ? "bg-amber-600 text-white font-semibold shadow-xs" : "text-slate-600 hover:text-[#1a1f2e]"
            }`}
          >
            AIS Gap Temporal Clusters
          </button>
        </div>
      </div>

      {/* SECTION 1: Route Corridor Heatmap & Incident Hotspots */}
      {activeTab === "CORRIDORS" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {CORRIDOR_STATS.map((corr) => (
              <div key={corr.id} className="accent-stat-card p-5 rounded-lg space-y-4 relative overflow-hidden bg-white group">
                <div className="flex items-start justify-between border-b border-[#e2e8f0] pb-2">
                  <div>
                    <h3 className="font-sans font-semibold text-[#1a1f2e] text-[15px]">{corr.name}</h3>
                    <p className="text-[12px] font-sans text-slate-500 mt-0.5">Coordinates: <span className="font-mono">{corr.coordinates[0]}°N, {corr.coordinates[1]}°E</span></p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-semibold ${
                    corr.riskLevel === 'HIGH' ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}>
                    {corr.riskLevel} RISK CORRIDOR
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 text-[13px] font-sans">
                  <div className="accent-stat-card p-3 rounded-lg bg-[#f8fafc]">
                    <div className="text-[11px] text-slate-500 font-medium uppercase">Total Incidents</div>
                    <div className="text-[22px] font-mono font-bold text-[#1a1f2e] mt-0.5">{corr.incidentCount}</div>
                  </div>
                  <div className="accent-stat-card p-3 rounded-lg bg-[#f8fafc]">
                    <div className="text-[11px] text-slate-500 font-medium uppercase">High Confidence</div>
                    <div className="text-[22px] font-mono font-bold text-red-700 mt-0.5">{corr.highConfidenceCount}</div>
                  </div>
                  <div className="accent-stat-card p-3 rounded-lg bg-[#f8fafc]">
                    <div className="text-[11px] text-slate-500 font-medium uppercase">Resolution Rate</div>
                    <div className="text-[22px] font-mono font-bold text-emerald-700 mt-0.5">
                      {Math.round((corr.highConfidenceCount / corr.incidentCount) * 100)}%
                    </div>
                  </div>
                </div>

                <div className="text-[13px] font-sans text-slate-700 space-y-1">
                  <div><strong className="text-slate-500 font-medium">Primary Implicated Types:</strong> {corr.primaryVesselTypes.join(", ")}</div>
                  <div><strong className="text-slate-500 font-medium">Recurrent MMSI Targets:</strong> <span className="font-mono text-slate-800">{corr.recurrentOffenderMmsi.join(", ")}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: Recurrent Offender MMSI Tables & Flag State Breakdown */}
      {activeTab === "RECURRENT" && (
        <div className="accent-stat-card p-5 rounded-lg space-y-4 bg-white">
          <div className="font-sans font-semibold text-[15px] text-[#1a1f2e] border-b border-[#e2e8f0] pb-2 flex items-center justify-between">
            <span>RECURRENT MARPOL ANNEX I OFFENDER REGISTRY</span>
            <span className="text-[12px] font-sans text-slate-500">Flag State of Convenience Profiling</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-[13px] border-collapse">
              <thead>
                <tr className="bg-[#f1f5f9] border-b border-[#e2e8f0] text-[#1a1f2e]">
                  <th className="p-3 font-semibold">VESSEL NAME</th>
                  <th className="p-3 font-semibold">MMSI</th>
                  <th className="p-3 font-semibold">FLAG STATE</th>
                  <th className="p-3 font-semibold">SHIP TYPE</th>
                  <th className="p-3 font-semibold text-center">SLICK INCIDENTS</th>
                  <th className="p-3 font-semibold">LAST DETECTED</th>
                  <th className="p-3 font-semibold">LEGAL ENFORCEMENT STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {RECURRENT_OFFENDERS.map((vessel, idx) => (
                  <tr key={idx} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="p-3 font-sans font-semibold text-[#1a1f2e]">{vessel.name}</td>
                    <td className="p-3 font-mono text-slate-500">{vessel.mmsi}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                        {vessel.flag}
                      </span>
                    </td>
                    <td className="p-3">{vessel.type}</td>
                    <td className="p-3 text-center font-mono font-bold text-red-700 text-[14px]">{vessel.incidentsCount}</td>
                    <td className="p-3 font-mono text-slate-500">{vessel.lastIncidentDate}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        vessel.marpolViolationStatus.includes('PORT STATE')
                          ? 'bg-red-100 text-red-800 border border-red-300'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}>
                        {vessel.marpolViolationStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: AIS Dark Gap Temporal Clustering (Nighttime vs Daylight) */}
      {activeTab === "GAPS" && (
        <div className="accent-stat-card p-5 rounded-lg space-y-6 bg-white">
          <div className="font-sans font-semibold text-[15px] text-[#1a1f2e] border-b border-[#e2e8f0] pb-2 flex items-center justify-between">
            <span>AIS TRANSPONDER BLACKOUT TEMPORAL CLUSTERING</span>
            <span className="text-[12px] font-sans text-slate-500">Nighttime vs Daylight Discharges</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nighttime vs Daylight Bar Comparison */}
            <div className="accent-stat-card p-5 rounded-lg bg-[#f8fafc] space-y-4">
              <div className="font-sans font-semibold text-[14px] text-[#1a1f2e]">
                TEMPORAL DISTRIBUTION OF TRANSPONDER BLACKOUTS
              </div>
              <p className="text-[13px] font-sans text-slate-600">
                Data confirms 78.4% of AIS blackout gaps occur during nighttime hours (22:00 - 04:00 UTC) prior to morning Sentinel-1 SAR orbital passes.
              </p>

              <div className="space-y-4 pt-2 font-sans text-[13px]">
                <div>
                  <div className="flex justify-between text-sky-900 font-semibold pb-1.5">
                    <span className="font-sans">Nighttime Transponder Blackouts (22:00 - 05:00 UTC)</span>
                    <span className="font-mono font-bold text-red-700">78.4% (272 incidents)</span>
                  </div>
                  <div className="h-3 w-full bg-slate-200 rounded overflow-hidden border border-red-200">
                    <div className="h-full bg-gradient-to-r from-red-600 to-red-700 w-[78.4%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-amber-900 font-semibold pb-1.5">
                    <span className="font-sans">Daylight Transponder Blackouts (05:00 - 22:00 UTC)</span>
                    <span className="font-mono font-bold text-amber-800">21.6% (75 incidents)</span>
                  </div>
                  <div className="h-3 w-full bg-slate-200 rounded overflow-hidden border border-amber-200">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-amber-600 w-[21.6%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Gap Duration Cluster Analysis */}
            <div className="accent-stat-card p-5 rounded-lg bg-[#f8fafc] space-y-4">
              <div className="font-sans font-semibold text-[14px] text-[#1a1f2e]">
                AIS GAP DURATION CLUSTER BREAKDOWN
              </div>
              <div className="space-y-2.5 font-sans text-[13px] text-slate-700">
                <div className="flex justify-between p-3 rounded-lg bg-white accent-stat-card">
                  <span>1h - 2h Gaps (Quick Discharge):</span>
                  <span className="font-mono font-bold text-[#b45309]">42%</span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-white accent-stat-card">
                  <span>2h - 4h Gaps (High Correlation Match):</span>
                  <span className="font-mono font-bold text-red-700">46%</span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-white accent-stat-card">
                  <span>&gt; 4h Extended Blackout:</span>
                  <span className="font-mono font-bold text-amber-700">12%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
