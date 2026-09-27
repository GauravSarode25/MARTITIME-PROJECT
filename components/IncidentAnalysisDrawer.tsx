"use client";

import React, { useState } from "react";
import { 
  X, 
  Layers, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Compass, 
  FileText, 
  Search, 
  Maximize2, 
  Eye, 
  Activity, 
  Ship, 
  Check, 
  Ban, 
  UserCheck,
  ChevronRight,
  Info,
  Sliders
} from "lucide-react";
import { SlickIncident, VesselCandidate } from "../data/mockMaritimeData";
import { ModalConfirmation } from "./ModalConfirmation";

interface IncidentAnalysisDrawerProps {
  incident: SlickIncident | null;
  onClose: () => void;
  selectedVesselId: string | null;
  onSelectVessel: (vesselId: string) => void;
}

export const IncidentAnalysisDrawer: React.FC<IncidentAnalysisDrawerProps> = ({
  incident,
  onClose,
  selectedVesselId,
  onSelectVessel
}) => {
  const [sarViewMode, setSarViewMode] = useState<"SEGMENTED" | "RAW_SAR" | "DUAL">("DUAL");
  const [modalAction, setModalAction] = useState<"CONFIRM" | "REJECT" | "REASSIGN" | null>(null);

  if (!incident) return null;

  const topCandidate = incident.candidates.find(c => c.id === selectedVesselId) || incident.candidates[0];

  return (
    <>
      <div className="w-full h-full bg-[#f7f8fa] border-l border-[#e2e8f0] text-[#4a5568] overflow-y-auto flex flex-col shadow-xl font-sans">
        {/* Drawer Header */}
        <div className="navy-panel p-3.5 border-b border-[#e2e8f0] flex items-center justify-between sticky top-0 z-30 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-red-100 border border-red-200 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-red-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-[#1a1f2e] text-[18px]">
                  {incident.title}
                </h2>
                <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-300 text-[11px] font-mono font-semibold">
                  {topCandidate ? `${topCandidate.riskScore}% RISK` : 'HIGH'}
                </span>
              </div>
              <p className="text-[12px] font-sans text-slate-500 flex items-center gap-2">
                <span>INCIDENT ID: <strong className="font-mono">{incident.id}</strong></span>
                <span>•</span>
                <span className="font-mono">{incident.acquisitionUtc}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-[#1a1f2e] transition-colors"
            title="Close Drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="p-6 space-y-6 flex-1">
          {/* SECTION 1: Dual SAR Imagery Comparison Panel */}
          <div className="navy-panel p-5 rounded-lg space-y-4 bg-white border border-[#e2e8f0] shadow-xs">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
              <div className="font-semibold text-[14px] text-[#1a1f2e]">
                SAR POLARIMETRIC SCENE ANALYSIS (VV / VH)
              </div>

              {/* View mode buttons */}
              <div className="flex items-center gap-1 bg-[#f1f5f9] p-1 rounded border border-[#e2e8f0] text-[12px] font-sans">
                <button
                  onClick={() => setSarViewMode("DUAL")}
                  className={`px-2 py-0.5 rounded transition-all ${sarViewMode === "DUAL" ? "bg-amber-600 text-white font-semibold shadow-xs" : "text-slate-600"}`}
                >
                  Dual Split
                </button>
                <button
                  onClick={() => setSarViewMode("RAW_SAR")}
                  className={`px-2 py-0.5 rounded transition-all ${sarViewMode === "RAW_SAR" ? "bg-amber-600 text-white font-semibold shadow-xs" : "text-slate-600"}`}
                >
                  Raw SAR
                </button>
                <button
                  onClick={() => setSarViewMode("SEGMENTED")}
                  className={`px-2 py-0.5 rounded transition-all ${sarViewMode === "SEGMENTED" ? "bg-amber-600 text-white font-semibold shadow-xs" : "text-slate-600"}`}
                >
                  Slick Mask
                </button>
              </div>
            </div>

            {/* Dual Viewport Canvas Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[220px]">
              {/* View 1: Original SAR Speckle Scene */}
              {(sarViewMode === "DUAL" || sarViewMode === "RAW_SAR") && (
                <div className="relative rounded-lg overflow-hidden border border-slate-300 bg-black flex flex-col justify-between p-3 group">
                  {/* Simulated Radar Speckle Background Image */}
                  <div 
                    className="absolute inset-0 opacity-80 mix-blend-screen"
                    style={{
                      backgroundImage: `radial-gradient(circle at 50% 50%, #1a2a3a 0%, #000 70%), repeating-radial-gradient(circle at 40% 40%, #ffffff 0%, transparent 2px, transparent 4px)`
                    }}
                  />
                  {/* Dark spot anomaly overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-16 rounded-full bg-black/90 border border-slate-700 blur-sm transform rotate-12" />
                  </div>

                  <div className="relative z-10 flex justify-between items-start text-[11px] font-mono text-amber-300 bg-black/70 px-2 py-1 rounded">
                    <span>SENSOR: {incident.sensor}</span>
                    <span>POL: {incident.polarization}</span>
                  </div>

                  <div className="relative z-10 text-[11px] font-mono text-slate-300 bg-black/70 px-2 py-1 rounded flex justify-between">
                    <span>Original Speckle Amplitude</span>
                    <span>Contrast: <strong className="text-amber-400">{incident.darkSpotContrastDb} dB</strong></span>
                  </div>
                </div>
              )}

              {/* View 2: Neural Net Segmented Slick Boundary */}
              {(sarViewMode === "DUAL" || sarViewMode === "SEGMENTED") && (
                <div className="relative rounded-lg overflow-hidden border border-[#e2e8f0] bg-[#f8fafc] flex flex-col justify-between p-3">
                  <div className="absolute inset-0 bg-slate-100" />
                  {/* Segmented Slick Geo Polygon Mask SVG */}
                  <svg className="absolute inset-0 w-full h-full p-4 text-red-600" viewBox="0 0 100 100">
                    <polygon
                      points="20,30 45,25 80,35 85,60 65,75 35,70 15,50"
                      fill="rgba(220, 38, 38, 0.25)"
                      stroke="#dc2626"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                      className="animate-slick-pulse"
                    />
                    <circle cx="50" cy="45" r="3" fill="#b45309" />
                  </svg>

                  <div className="relative z-10 flex justify-between items-start text-[11px] font-sans text-emerald-800 bg-white/90 border border-emerald-200 px-2 py-1 rounded shadow-xs font-medium">
                    <span>AI SEGMENTATION: CONV-NET v4</span>
                    <span className="font-mono font-semibold">CONFIDENCE: HIGH</span>
                  </div>

                  <div className="relative z-10 text-[11px] font-sans text-[#1a1f2e] bg-white/90 border border-slate-200 px-2 py-1 rounded shadow-xs flex justify-between">
                    <span>Slick Area: <strong className="text-[#b45309] font-mono font-semibold">{incident.slickAreaKm2} km²</strong></span>
                    <span>Noise Floor: <strong className="text-emerald-700 font-semibold">NOMINAL</strong></span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 2: Slick Classification Metadata Badge */}
          <div className="navy-panel p-5 rounded-lg space-y-4 bg-white border border-[#e2e8f0] shadow-xs">
            <div className="font-semibold text-[14px] text-[#1a1f2e] border-b border-[#e2e8f0] pb-2 flex items-center justify-between">
              <span>SLICK PHYSICAL PARAMETERS & METADATA</span>
              <span className="text-[11px] font-mono text-[#b45309] font-semibold">{incident.marpolAnnex}</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[13px]">
              <div className="bg-[#f8fafc] p-3 rounded-lg border border-[#e2e8f0]">
                <div className="text-[11px] text-slate-500 font-medium uppercase">SURFACE AREA</div>
                <div className="text-[16px] font-bold font-mono text-[#1a1f2e] mt-0.5">{incident.slickAreaKm2} km²</div>
              </div>

              <div className="bg-[#f8fafc] p-3 rounded-lg border border-[#e2e8f0]">
                <div className="text-[11px] text-slate-500 font-medium uppercase">ESTIMATED VOLUME</div>
                <div className="text-[16px] font-bold font-mono text-amber-800 mt-0.5">{incident.estOilVolumeM3} m³</div>
                <div className="text-[11px] text-slate-500 font-mono">({incident.estBarrels} bbls)</div>
              </div>

              <div className="bg-[#f8fafc] p-3 rounded-lg border border-[#e2e8f0]">
                <div className="text-[11px] text-slate-500 font-medium uppercase">WIND CORRECTION</div>
                <div className="text-[13px] font-mono font-semibold text-sky-800 mt-0.5">{incident.windSpeedKnots} kn @ {incident.windDirectionDeg}°</div>
              </div>

              <div className="bg-[#f8fafc] p-3 rounded-lg border border-[#e2e8f0]">
                <div className="text-[11px] text-slate-500 font-medium uppercase">SENSOR GEOMETRY</div>
                <div className="text-[12px] font-mono text-slate-700 mt-0.5">{incident.resolution}</div>
              </div>
            </div>
          </div>

          {/* SECTION 3: Ranked Candidate Vessel List */}
          <div className="navy-panel p-5 rounded-lg space-y-4 bg-white border border-[#e2e8f0] shadow-xs">
            <div className="font-semibold text-[14px] text-[#1a1f2e] border-b border-[#e2e8f0] pb-2 flex items-center justify-between">
              <span>RANKED CANDIDATE VESSELS (AIS ATTRIBUTION)</span>
              <span className="text-[11px] text-slate-500 font-medium">Sorted by Lagrangian Overlap</span>
            </div>

            <div className="space-y-3">
              {incident.candidates.map((cand, index) => {
                const isSelected = cand.id === topCandidate?.id;
                return (
                  <div
                    key={cand.id}
                    onClick={() => onSelectVessel(cand.id)}
                    className={`p-3.5 rounded-lg border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? "bg-amber-50/50 border-amber-600 ring-1 ring-amber-500/40 shadow-xs"
                        : "bg-[#f8fafc] border-[#e2e8f0] hover:border-amber-600/60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-white border border-amber-600/40 text-[11px] font-mono font-bold flex items-center justify-center text-[#b45309] shadow-xs">
                          #{index + 1}
                        </span>
                        <div>
                          <div className="font-semibold text-[14px] text-[#1a1f2e] flex items-center gap-2">
                            <span>{cand.name}</span>
                            <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-700 border border-slate-200 rounded font-mono font-medium">
                              {cand.flag}
                            </span>
                          </div>
                          <div className="text-[12px] font-mono text-slate-500">
                            MMSI: {cand.mmsi} | IMO: {cand.imo} | Type: {cand.type}
                          </div>
                        </div>
                      </div>

                      {/* Attribution Score Badge */}
                      <div className="text-right">
                        <div className={`text-[18px] font-extrabold font-mono ${
                          cand.riskScore > 80 ? 'text-red-700' : cand.riskScore > 50 ? 'text-amber-700' : 'text-emerald-700'
                        }`}>
                          {cand.riskScore}%
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium">ATTRIBUTION SCORE</div>
                      </div>
                    </div>

                    {/* Vessel Specs Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200 text-[12px] text-slate-700">
                      <div><span className="text-slate-500">Speed:</span> <strong className="font-mono">{cand.speed} kn</strong></div>
                      <div><span className="text-slate-500">Distance:</span> <strong className="font-mono">{cand.distanceToDischarge}</strong></div>
                      <div><span className="text-slate-500">Drift Match:</span> <strong className="text-amber-800 font-mono font-semibold">{cand.driftOverlapScore}%</strong></div>
                      <div>
                        <span className="text-slate-500">AIS Gap:</span>{" "}
                        {cand.hasAisGap ? (
                          <span className="text-red-700 font-mono font-semibold">⚠️ {cand.aisGapDuration}</span>
                        ) : (
                          <span className="text-emerald-700 font-medium">None</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 4: Chronological Evidence Feed */}
          <div className="navy-panel p-5 rounded-lg space-y-4 bg-white border border-[#e2e8f0] shadow-xs">
            <div className="font-semibold text-[14px] text-[#1a1f2e] border-b border-[#e2e8f0] pb-2 flex items-center justify-between">
              <span>CHRONOLOGICAL EVIDENCE FEED</span>
              <span className="text-[11px] text-slate-500 font-medium">EMPIRICAL vs INFERRED TIMELINE</span>
            </div>

            <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-amber-600/30">
              {incident.evidenceTimeline.map((item) => (
                <div key={item.id} className="relative pl-8 space-y-0.5">
                  {/* Node icon dot */}
                  <div className={`absolute left-1.5 top-1 -translate-x-1/2 w-3.5 h-3.5 rounded-full border border-amber-600 ${
                    item.type === 'ALERT' ? 'bg-red-600 animate-pulse' : item.type === 'EMPIRICAL' ? 'bg-amber-600' : 'bg-slate-200'
                  }`} />

                  <div className="flex items-center justify-between text-[12px]">
                    <span className="font-mono font-semibold text-[#1a1f2e]">{item.timestampUtc}</span>
                    <span className={`px-1.5 py-0.2 text-[10px] rounded font-mono font-semibold ${
                      item.type === 'EMPIRICAL'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : item.type === 'ALERT'
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : 'bg-slate-100 text-slate-700 border border-slate-300'
                    }`}>
                      {item.type}
                    </span>
                  </div>

                  <div className="font-semibold text-[13px] text-[#1a1f2e]">{item.title}</div>
                  <p className="text-[12px] text-slate-600 leading-relaxed font-sans">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 5: Decision Action Panel */}
          <div className="navy-panel p-5 rounded-lg space-y-4 bg-white border-t-2 border-amber-600 border-x border-b border-[#e2e8f0] shadow-xs">
            <div className="font-semibold text-[14px] text-[#1a1f2e] flex items-center justify-between border-b border-[#e2e8f0] pb-2">
              <span>ANALYST DECISION ACTION DIRECTIVE</span>
              <span className="text-[11px] font-mono text-[#b45309] font-semibold">MARPOL ANNEX I ENFORCEMENT</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => setModalAction("CONFIRM")}
                className="flex-1 py-2.5 px-4 rounded bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold text-[13px] border border-red-500 shadow-xs hover:brightness-110 flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                EXPERT CONFIRM (ISSUE MARPOL ALERT)
              </button>

              <button
                onClick={() => setModalAction("REJECT")}
                className="py-2.5 px-4 rounded bg-[#f8fafc] border border-amber-600/50 text-amber-800 hover:bg-amber-50 font-semibold text-[13px] flex items-center justify-center gap-1.5"
              >
                <Ban className="w-4 h-4" />
                REJECT (NATURAL SEEP)
              </button>

              <button
                onClick={() => setModalAction("REASSIGN")}
                className="py-2.5 px-4 rounded bg-[#f8fafc] border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-[13px] flex items-center justify-center gap-1.5"
              >
                <UserCheck className="w-4 h-4" />
                REASSIGN TARGET
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {modalAction && (
        <ModalConfirmation
          isOpen={!!modalAction}
          onClose={() => setModalAction(null)}
          actionType={modalAction}
          incident={incident}
          candidate={topCandidate}
          onConfirmSuccess={(action, notes) => {
            console.log(`Action ${action} logged with notes: ${notes}`);
          }}
        />
      )}
    </>
  );
};
