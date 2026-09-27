"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Play, Pause, RotateCcw, Layers, Compass, ShieldAlert, Navigation, MapPin, Eye, Radio } from "lucide-react";
import { SlickIncident } from "../data/mockMaritimeData";

// Dynamically import LeafletMapInner with ssr: false
const LeafletMapInner = dynamic(
  () => import("./LeafletMapInner").then((mod) => mod.LeafletMapInner),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#f7f8fa] text-[#b45309] space-y-3 font-sans">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-[#b45309] opacity-20 animate-ping" />
          <div className="absolute inset-0 rounded-full border-t-2 border-[#b45309] animate-spin" />
        </div>
        <div className="text-[15px] font-semibold text-[#1a1f2e]">INITIALIZING GIS MAP ENGINE...</div>
        <div className="text-[13px] text-slate-500">Loading Open Light Oceanic Basemap</div>
      </div>
    )
  }
);

interface MaritimeMapProps {
  incidents: SlickIncident[];
  selectedIncident: SlickIncident;
  selectedVesselId: string | null;
  onSelectIncident: (incident: SlickIncident) => void;
  onSelectVessel: (vesselId: string) => void;
}

export const MaritimeMap: React.FC<MaritimeMapProps> = ({
  incidents,
  selectedIncident,
  selectedVesselId,
  onSelectIncident,
  onSelectVessel
}) => {
  // Layer Toggles State & Collapsible Panel
  const [isLayersOpen, setIsLayersOpen] = useState<boolean>(false);
  const [showSlicks, setShowSlicks] = useState<boolean>(true);
  const [showTrajectories, setShowTrajectories] = useState<boolean>(true);
  const [showAisGaps, setShowAisGaps] = useState<boolean>(true);
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [showGraticule, setShowGraticule] = useState<boolean>(true);
  const [tileStyle, setTileStyle] = useState<"light" | "satellite" | "nautical">("light");

  // Mouse Cursor Telemetry
  const [cursorLat, setCursorLat] = useState<number>(selectedIncident.centerCoordinates[0]);
  const [cursorLng, setCursorLng] = useState<number>(selectedIncident.centerCoordinates[1]);

  // Timeline Replay State
  const [currentReplayHour, setCurrentReplayHour] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [replaySpeed, setReplaySpeed] = useState<number>(1);

  // Replay timer loop
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      const intervalMs = 2000 / replaySpeed;
      timer = setInterval(() => {
        setCurrentReplayHour((prev) => {
          if (prev >= 8) return 0;
          return prev + 2;
        });
      }, intervalMs);
    }
    return () => clearInterval(timer);
  }, [isPlaying, replaySpeed]);

  // Format Lat/Lng to DMS string
  const formatDms = (val: number, isLat: boolean) => {
    const dir = val >= 0 ? (isLat ? "N" : "E") : (isLat ? "S" : "W");
    const abs = Math.abs(val);
    const deg = Math.floor(abs);
    const min = Math.floor((abs - deg) * 60);
    const sec = (((abs - deg) * 60 - min) * 60).toFixed(1);
    return `${deg}°${min}'${sec}"${dir}`;
  };

  return (
    <div className="relative w-full h-full min-h-[600px] overflow-hidden bg-[#f7f8fa] font-sans">
      {/* Leaflet Map Container */}
      <LeafletMapInner
        incidents={incidents}
        selectedIncident={selectedIncident}
        selectedVesselId={selectedVesselId}
        onSelectIncident={onSelectIncident}
        onSelectVessel={onSelectVessel}
        currentReplayHour={currentReplayHour}
        showSlicks={showSlicks}
        showTrajectories={showTrajectories}
        showAisGaps={showAisGaps}
        showVectors={showVectors}
        showGraticule={showGraticule}
        tileStyle={tileStyle}
        onCursorMove={(lat, lng) => {
          setCursorLat(lat);
          setCursorLng(lng);
        }}
      />

      {/* Floating Top Left: Target Incident Selector & Basemap Tile Switcher */}
      <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2 font-sans">
        <div className="navy-panel p-2.5 rounded-lg shadow-md border border-[#e2e8f0] flex items-center gap-2.5 bg-white">
          <ShieldAlert className="w-4 h-4 text-[#b45309]" />
          <div>
            <div className="text-[11px] text-slate-500 uppercase font-medium tracking-tight">Active Incident Target</div>
            <select
              value={selectedIncident.id}
              onChange={(e) => {
                const found = incidents.find((i) => i.id === e.target.value);
                if (found) onSelectIncident(found);
              }}
              className="bg-[#f8fafc] text-[#1a1f2e] font-sans font-semibold text-[13px] border border-[#e2e8f0] rounded px-2 py-0.5 focus:outline-none focus:border-amber-600 shadow-xs"
            >
              {incidents.map((inc) => (
                <option key={inc.id} value={inc.id}>
                  {inc.title} ({inc.slickAreaKm2} km²)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Basemap Tile Switcher Buttons */}
        <div className="navy-panel p-2 rounded-lg shadow-md border border-[#e2e8f0] flex items-center gap-1 text-[12px] font-sans bg-white">
          <span className="text-[11px] text-slate-500 px-1 uppercase font-medium">Basemap:</span>
          <button
            onClick={() => setTileStyle("light")}
            className={`px-2 py-0.5 rounded text-[12px] transition-all font-medium ${
              tileStyle === "light" ? "bg-amber-600 text-white font-semibold shadow-xs" : "text-slate-600 hover:text-[#1a1f2e] hover:bg-slate-100"
            }`}
          >
            Basic Light
          </button>
          <button
            onClick={() => setTileStyle("satellite")}
            className={`px-2 py-0.5 rounded text-[12px] transition-all font-medium ${
              tileStyle === "satellite" ? "bg-amber-600 text-white font-semibold shadow-xs" : "text-slate-600 hover:text-[#1a1f2e] hover:bg-slate-100"
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => setTileStyle("nautical")}
            className={`px-2 py-0.5 rounded text-[12px] transition-all font-medium ${
              tileStyle === "nautical" ? "bg-amber-600 text-white font-semibold shadow-xs" : "text-slate-600 hover:text-[#1a1f2e] hover:bg-slate-100"
            }`}
          >
            Ocean / Nautical
          </button>
        </div>
      </div>

      {/* Floating Top Right: GIS Tactical Layers Control Panel (Collapsible) */}
      <div className="absolute top-4 right-4 z-[400] font-sans">
        {!isLayersOpen ? (
          <button
            onClick={() => setIsLayersOpen(true)}
            className="navy-panel px-3 py-2 rounded-lg shadow-md border border-[#e2e8f0] bg-white hover:bg-slate-50 text-[13px] font-sans font-semibold text-[#b45309] flex items-center gap-2 cursor-pointer transition-all"
          >
            <Layers className="w-4 h-4" />
            <span>Tactical Layers</span>
          </button>
        ) : (
          <div className="navy-panel p-4 rounded-lg shadow-md border border-[#e2e8f0] text-[13px] space-y-3 w-64 bg-white animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2 text-[#b45309] font-semibold text-[14px]">
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                GIS TACTICAL LAYERS
              </span>
              <button
                onClick={() => setIsLayersOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold px-1"
                title="Close Layers Panel"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 pt-0.5">
              <label className="flex items-center justify-between cursor-pointer text-[#4a5568] hover:text-[#1a1f2e]">
                <span className="flex items-center gap-2 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-xs" />
                  SAR Slick Boundary
                </span>
                <input
                  type="checkbox"
                  checked={showSlicks}
                  onChange={(e) => setShowSlicks(e.target.checked)}
                  className="accent-amber-600"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer text-[#4a5568] hover:text-[#1a1f2e]">
                <span className="flex items-center gap-2 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600 shadow-xs" />
                  Vessel AIS Trajectories
                </span>
                <input
                  type="checkbox"
                  checked={showTrajectories}
                  onChange={(e) => setShowTrajectories(e.target.checked)}
                  className="accent-amber-600"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer text-[#4a5568] hover:text-[#1a1f2e]">
                <span className="flex items-center gap-2 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-700 shadow-xs" />
                  AIS Dark Gap Alerts
                </span>
                <input
                  type="checkbox"
                  checked={showAisGaps}
                  onChange={(e) => setShowAisGaps(e.target.checked)}
                  className="accent-amber-600"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer text-[#4a5568] hover:text-[#1a1f2e]">
                <span className="flex items-center gap-2 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-600 shadow-xs" />
                  Drift & Wind Vectors
                </span>
                <input
                  type="checkbox"
                  checked={showVectors}
                  onChange={(e) => setShowVectors(e.target.checked)}
                  className="accent-amber-600"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer text-[#4a5568] hover:text-[#1a1f2e]">
                <span className="flex items-center gap-2 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shadow-xs" />
                  Graticule Lat/Long Grid
                </span>
                <input
                  type="checkbox"
                  checked={showGraticule}
                  onChange={(e) => setShowGraticule(e.target.checked)}
                  className="accent-amber-600"
                />
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Telemetry Bar: Live Mouse Lat/Long & Bathymetry Scale */}
      <div className="absolute bottom-2 left-4 z-[400] hidden sm:flex items-center gap-3 px-3 py-1 rounded-lg navy-panel text-[12px] font-sans text-[#4a5568] shadow-md border border-[#e2e8f0] bg-white">
        <div className="flex items-center gap-1.5 text-[#b45309] font-medium">
          <MapPin className="w-3.5 h-3.5" />
          <span>CURSOR: <strong className="font-mono">{formatDms(cursorLat, true)} {formatDms(cursorLng, false)}</strong></span>
        </div>
        <span className="text-slate-300">|</span>
        <div>DATUM: <strong className="text-[#1a1f2e] font-mono">WGS-84</strong></div>
        <span className="text-slate-300">|</span>
        <div>DEPTH: <strong className="text-amber-800 font-mono font-semibold">42 FATHOMS</strong></div>
      </div>

      {/* Floating Tactical Compass Rose (Bottom Right) */}
      <div className="absolute bottom-16 right-4 z-[400] pointer-events-none opacity-85 hidden md:block">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full text-[#b45309] fill-current">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#b45309" strokeWidth="1" strokeDasharray="2 2" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="#b45309" strokeWidth="0.5" />
            {/* Compass points */}
            <polygon points="50,10 54,46 50,42 46,46" fill="#b45309" />
            <polygon points="50,90 54,54 50,58 46,54" fill="#d97706" />
            <polygon points="90,50 54,54 58,50 54,46" fill="#d97706" />
            <polygon points="10,50 46,54 42,50 46,46" fill="#d97706" />
            <text x="47" y="8" fill="#b45309" fontSize="9" fontWeight="bold" fontFamily="sans-serif">N</text>
          </svg>
        </div>
      </div>

      {/* Floating Bottom Center: Hydrodynamic Backward Drift Replay Controller */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[400] w-11/12 max-w-2xl font-sans">
        <div className="navy-panel p-3 rounded-lg shadow-md border border-[#e2e8f0] flex flex-col gap-2 bg-white">
          <div className="flex items-center justify-between text-[13px]">
            <div className="flex items-center gap-2 text-[#b45309] font-semibold text-[14px]">
              <RotateCcw className="w-4 h-4" />
              <span>LAGRANGIAN DRIFT REPLAY CONTROLLER</span>
            </div>

            <div className="flex items-center gap-3 text-[#4a5568] text-[12px]">
              <span>Step: <strong className="text-amber-800 font-mono font-semibold">T-{currentReplayHour}h</strong></span>
              <span className="text-slate-300">|</span>
              <span>Discharge Spread: <strong className="text-amber-800 font-mono font-semibold">
                {selectedIncident.driftReplaySteps.find(s => s.hoursAgo === currentReplayHour)?.slickSpreadKm2 || selectedIncident.slickAreaKm2} km²
              </strong></span>
            </div>
          </div>

          {/* Scrubbing Timeline & Playback Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:brightness-110 font-semibold transition-all shadow-xs flex items-center justify-center"
              title={isPlaying ? "Pause Drift Animation" : "Play Backward Drift"}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            <button
              onClick={() => setCurrentReplayHour(0)}
              className="px-2.5 py-1 rounded bg-[#f8fafc] border border-[#e2e8f0] text-[#1a1f2e] hover:bg-slate-100 text-[12px] font-medium"
              title="Reset to T-0 (SAR Pass Time)"
            >
              Reset T-0
            </button>

            {/* Step Hours Selector Buttons */}
            <div className="flex-1 flex items-center justify-between bg-[#f1f5f9] p-1 rounded border border-[#e2e8f0]">
              {[0, 2, 4, 6, 8].map((hour) => (
                <button
                  key={hour}
                  onClick={() => {
                    setCurrentReplayHour(hour);
                    setIsPlaying(false);
                  }}
                  className={`flex-1 py-1 text-[12px] font-mono rounded transition-all ${
                    currentReplayHour === hour
                      ? "bg-amber-600 text-white font-semibold shadow-xs"
                      : "text-slate-600 hover:text-[#1a1f2e]"
                  }`}
                >
                  T-{hour}h
                </button>
              ))}
            </div>

            {/* Replay Speed Toggle */}
            <div className="flex items-center gap-1 bg-[#f1f5f9] p-1 rounded border border-[#e2e8f0] text-[12px] font-mono">
              {[1, 2, 4].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setReplaySpeed(spd)}
                  className={`px-1.5 py-0.5 rounded ${
                    replaySpeed === spd ? "bg-white text-[#b45309] font-bold shadow-xs" : "text-slate-500"
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
