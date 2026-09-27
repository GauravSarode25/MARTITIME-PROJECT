"use client";

import React, { useState, useEffect } from "react";
import { 
  PlayCircle, 
  UploadCloud, 
  Cpu, 
  RotateCcw, 
  ShieldAlert, 
  CheckCircle2, 
  Loader2, 
  FileText, 
  Radio, 
  ArrowRight,
  Layers,
  Search
} from "lucide-react";
import { SAMPLE_SAR_SCENES, MOCK_SLICK_INCIDENTS, SlickIncident } from "../data/mockMaritimeData";

interface SimulatorModuleProps {
  onSimulationComplete: (incident: SlickIncident) => void;
}

export const SimulatorModule: React.FC<SimulatorModuleProps> = ({
  onSimulationComplete
}) => {
  const [selectedSceneId, setSelectedSceneId] = useState<string>(SAMPLE_SAR_SCENES[0].id);
  const [currentStep, setCurrentStep] = useState<number>(1); // 1: Select Scene, 2: SAR Segmentation, 3: Drift Reconstruction, 4: AIS Correlation, 5: Complete
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [logMessages, setLogMessages] = useState<string[]>([]);

  const activeScene = SAMPLE_SAR_SCENES.find(s => s.id === selectedSceneId) || SAMPLE_SAR_SCENES[0];

  const addLog = (msg: string) => {
    setLogMessages((prev) => [...prev, `[${new Date().toISOString().substring(11, 19)} UTC] ${msg}`]);
  };

  const startLiveSimulation = () => {
    setIsSimulating(true);
    setCurrentStep(2);
    setScanProgress(0);
    setLogMessages([]);

    addLog(`INITIATING AUTOMATED SAR DISCHARGE ANALYZER FOR ${activeScene.id}...`);

    // Step 2: SAR Neural Net Segmentation Scan (2 seconds)
    let progress = 0;
    const scanInterval = setInterval(() => {
      progress += 10;
      setScanProgress(progress);
      if (progress === 30) addLog("Loading C-band VV/VH dual-pol speckle noise floor matrix...");
      if (progress === 70) addLog("Neural Net Conv-4: Dark spot contrast threshold crossed (-8.4 dB anomaly detected)...");
      
      if (progress >= 100) {
        clearInterval(scanInterval);
        addLog("✅ SAR SLICK SEGMENTATION COMPLETE: Surface Area 14.8 km² (Est. 305 bbls)");
        
        // Step 3: Hydrodynamic Backward Drift Reconstruction (2 seconds)
        setTimeout(() => {
          setCurrentStep(3);
          addLog("STARTING BACKWARD LAGRANGIAN HYDRODYNAMIC DRIFT RECONSTRUCTION...");
          addLog("Integrating HYCOM surface current vectors (1.4 kn @ 345°) & ERA5 wind fields (8.2 kn)...");
          
          setTimeout(() => {
            addLog("✅ DRIFT REPLAY COMPLETE: Historical discharge centroid calculated for T-3h 45m UTC.");
            
            // Step 4: AIS Correlation Sequence (2 seconds)
            setTimeout(() => {
              setCurrentStep(4);
              addLog("QUERYING AIS TELEMETRY STREAM & TRANSPONDER BLACKOUT REGISTRY...");
              addLog("Analyzing 14 candidate vessel vectors in 15 NM radius...");
              addLog("⚠️ CRITICAL OVERLAP: M/T OCEANIC LEGACY (MMSI: 352988102) AIS gap 3h 42m detected!");

              setTimeout(() => {
                addLog("✅ AIS CORRELATION COMPLETE: Top candidate attributed with 94.2% confidence score!");
                setCurrentStep(5);
                setIsSimulating(false);
                
                // Trigger auto callback to open map & incident drawer
                setTimeout(() => {
                  onSimulationComplete(MOCK_SLICK_INCIDENTS[0]);
                }, 1000);
              }, 1500);
            }, 1500);
          }, 1500);
        }, 1000);
      }
    }, 200);
  };

  return (
    <div className="w-full h-full p-6 overflow-y-auto bg-[#f7f8fa] space-y-6">
      {/* Simulation / Demo Mode Banner */}
      <div className="bg-amber-50/80 border border-amber-300 rounded-lg p-3 text-[12px] font-sans text-amber-900 flex items-center justify-between shadow-xs">
        <span className="font-semibold flex items-center gap-2">
          <span>⚠️ SIMULATION / DEMO MODE</span>
          <span className="text-amber-800 font-normal hidden sm:inline">| Synthetic SAR Ingestion & AIS Pipeline Validator</span>
        </span>
        <span className="text-amber-800 text-[11px] hidden md:inline">
          Live operational data is actively processed on the GIS Map & Command Dashboard.
        </span>
      </div>

      {/* Header Banner */}
      <div className="navy-panel p-5 rounded-lg flex items-center justify-between border-b-2 border-amber-600 bg-white border border-[#e2e8f0] shadow-sm">
        <div>
          <h2 className="font-sans font-semibold text-[#1a1f2e] text-[18px] flex items-center gap-2">
            AUTOMATED SAR REPORT ANALYZER <span className="text-[11px] px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-sans uppercase font-semibold">SIMULATION / DEMO MODE</span>
          </h2>
          <p className="text-[12px] font-sans text-slate-500 mt-0.5">
            End-to-End Workflow: SAR Scene Ingestion → AI Segmentation → Lagrangian Drift Replay → AIS Attribution
          </p>
        </div>

        {!isSimulating && currentStep === 1 && (
          <button
            onClick={startLiveSimulation}
            className="px-5 py-2.5 rounded bg-gradient-to-r from-amber-600 to-amber-700 text-white font-sans font-semibold text-[13px] border border-amber-500 shadow-md hover:brightness-110 flex items-center gap-2"
          >
            <PlayCircle className="w-4 h-4 fill-current" />
            TRIGGER LIVE DETECTION SEQUENCE
          </button>
        )}
      </div>

      {/* Workflow Stepper Bar */}
      <div className="navy-panel p-5 rounded-lg bg-white border border-[#e2e8f0] shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-sans">
          {[
            { step: 1, title: "1. SAR SCENE SELECTION", icon: UploadCloud },
            { step: 2, title: "2. AI SEGMENTATION", icon: Cpu },
            { step: 3, title: "3. DRIFT RECONSTRUCTION", icon: RotateCcw },
            { step: 4, title: "4. AIS CORRELATION", icon: Radio }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = currentStep === item.step;
            const isCompleted = currentStep > item.step;
            return (
              <div
                key={item.step}
                className={`p-3.5 rounded-lg border transition-all flex items-center gap-3 ${
                  isActive
                    ? "bg-amber-50/60 border-amber-600 ring-1 ring-amber-500/40 shadow-xs text-[#1a1f2e]"
                    : isCompleted
                    ? "bg-[#f8fafc] border-emerald-500/60 text-emerald-800 font-semibold"
                    : "bg-[#f8fafc] border-slate-200 text-slate-400"
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                  isActive ? "bg-amber-600 text-white" : isCompleted ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-500"
                }`}>
                  {isCompleted ? "✓" : item.step}
                </div>
                <div>
                  <div className="font-sans font-semibold text-[13px] text-[#1a1f2e]">{item.title}</div>
                  <div className="text-[12px] text-slate-500 font-normal">
                    {isActive ? "Executing..." : isCompleted ? "Completed" : "Waiting"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Simulator Workspace Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: SAR Scene Selection & Radar Scanner Interface */}
        <div className="navy-panel p-5 rounded-lg space-y-4 bg-white border border-[#e2e8f0] shadow-sm">
          <div className="font-sans font-semibold text-[14px] text-[#1a1f2e] border-b border-[#e2e8f0] pb-2 flex items-center justify-between">
            <span>SAR SCENE INGESTION CHAMBER</span>
            <span className="text-[12px] font-mono text-slate-500">Sentinel-1A & RADARSAT Archives</span>
          </div>

          {/* Scene Select Cards */}
          <div className="space-y-2.5">
            {SAMPLE_SAR_SCENES.map((scene) => (
              <div
                key={scene.id}
                onClick={() => !isSimulating && setSelectedSceneId(scene.id)}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer text-[13px] space-y-1 ${
                  selectedSceneId === scene.id
                    ? "bg-amber-50/50 border-amber-600 text-[#1a1f2e]"
                    : "bg-[#f8fafc] border-[#e2e8f0] text-slate-600 hover:border-slate-300"
                }`}
              >
                <div className="flex justify-between font-sans text-[#1a1f2e]">
                  <span className="font-semibold text-[14px]">{scene.name}</span>
                  <span className="text-amber-700 font-mono font-bold text-[13px]">{scene.darkContrast}</span>
                </div>
                <div className="text-[12px] text-slate-500 flex justify-between font-sans">
                  <span>File: <span className="font-mono">{scene.id}</span></span>
                  <span className="font-mono">{scene.date}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Radar Scanner Display Simulation */}
          <div className="relative h-60 rounded-lg border border-slate-300 bg-slate-900 overflow-hidden flex items-center justify-center p-4">
            {/* Circular Radar Sweep Screen */}
            <div className="relative w-44 h-44 rounded-full border border-amber-500/40 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border border-amber-500/20 flex items-center justify-center" />
              <div className="w-16 h-16 rounded-full border border-amber-500/20" />
              <div className="absolute inset-0 border-t border-b border-amber-500/20" />
              <div className="absolute inset-0 border-l border-r border-amber-500/20" />

              {/* Sweeping Radar Needle */}
              <div className={`absolute inset-0 rounded-full animate-radar-sweep pointer-events-none ${isSimulating ? 'opacity-100' : 'opacity-30'}`}>
                <div className="w-1/2 h-1/2 bg-gradient-to-br from-amber-500/50 to-transparent origin-bottom-right transform rotate-45 rounded-tl-full" />
              </div>

              {/* Detected Slick Anomaly Blob */}
              {scanProgress > 50 && (
                <div className="absolute top-10 right-10 w-8 h-5 rounded-full bg-red-600/80 border border-red-400 animate-pulse shadow-lg" />
              )}
            </div>

            {/* Scan Progress Bar Overlay */}
            {isSimulating && (
              <div className="absolute bottom-3 left-4 right-4 bg-white/95 p-3 rounded-lg border border-slate-300 text-[13px] font-sans space-y-1.5 shadow-md">
                <div className="flex justify-between text-[#1a1f2e] font-semibold">
                  <span>ANALYZING RADAR PIXELS...</span>
                  <span className="text-amber-700 font-mono font-bold">{scanProgress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded overflow-hidden">
                  <div style={{ width: `${scanProgress}%` }} className="h-full bg-gradient-to-r from-amber-600 to-red-600 transition-all duration-200" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Terminal Telemetry Output Log */}
        <div className="navy-panel p-5 rounded-lg space-y-4 flex flex-col h-full bg-white border border-[#e2e8f0] shadow-sm">
          <div className="font-sans font-semibold text-[14px] text-[#1a1f2e] border-b border-[#e2e8f0] pb-2 flex items-center justify-between">
            <span>LIVE PIPELINE PROCESSOR TELEMETRY LOG</span>
            <span className="text-[12px] font-mono text-emerald-700 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" /> SYSTEM ONLINE
            </span>
          </div>

          {logMessages.length === 0 ? (
            <div className="flex-1 min-h-[260px] flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-200 rounded-lg bg-[#f8fafc]">
              <Cpu className="w-8 h-8 text-slate-300 mb-2" />
              <div className="text-[13px] font-sans font-semibold text-[#1a1f2e]">No Active Simulation Telemetry</div>
              <p className="text-[12px] font-sans text-slate-500 max-w-xs mt-1">
                Click "TRIGGER LIVE DETECTION SEQUENCE" to simulate SAR image ingestion and AIS correlation.
              </p>
            </div>
          ) : (
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-4 font-mono text-[12px] text-[#1a1f2e] flex-1 min-h-[260px] overflow-y-auto space-y-2 shadow-inner">
              {logMessages.map((msg, i) => (
                <div key={i} className={`leading-relaxed ${
                  msg.includes("✅") ? "text-emerald-700 font-bold" : msg.includes("⚠️") ? "text-red-700 font-bold" : "text-slate-700"
                }`}>
                  {msg}
                </div>
              ))}
            </div>
          )}

          {currentStep === 5 && (
            <div className="bg-emerald-50 border border-emerald-300 p-3.5 rounded-lg text-[13px] font-sans text-emerald-900 flex items-center justify-between animate-in fade-in shadow-xs">
              <span className="flex items-center gap-2 font-sans font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                ATTRIBUTION PIPELINE COMPLETE
              </span>
              <button
                onClick={() => onSimulationComplete(MOCK_SLICK_INCIDENTS[0])}
                className="px-3.5 py-1.5 rounded bg-emerald-700 text-white font-semibold hover:brightness-110 flex items-center gap-1 shadow-xs text-[13px]"
              >
                OPEN MAP EVIDENCE DRAWER <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
