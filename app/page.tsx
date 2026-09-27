"use client";

import React, { useState } from "react";
import { Navbar } from "../components/Navbar";
import { MaritimeMap } from "../components/MaritimeMap";
import { DashboardModule } from "../components/DashboardModule";
import { IncidentAnalysisDrawer } from "../components/IncidentAnalysisDrawer";
import { SimulatorModule } from "../components/SimulatorModule";
import { PatternsModule } from "../components/PatternsModule";
import { MOCK_SLICK_INCIDENTS, SlickIncident } from "../data/mockMaritimeData";

export default function Home() {
  const [incidents, setIncidents] = useState<SlickIncident[]>(MOCK_SLICK_INCIDENTS);
  const [selectedIncident, setSelectedIncident] = useState<SlickIncident>(MOCK_SLICK_INCIDENTS[0]);
  const [selectedVesselId, setSelectedVesselId] = useState<string | null>(null);
  
  // Active Navigation Module: 'map' | 'dashboard' | 'analysis' | 'simulator' | 'patterns'
  const [activeModule, setActiveModule] = useState<"map" | "dashboard" | "analysis" | "simulator" | "patterns">("map");
  const [isAnalysisDrawerOpen, setIsAnalysisDrawerOpen] = useState<boolean>(false);

  const handleSelectIncident = (incident: SlickIncident) => {
    setSelectedIncident(incident);
    setSelectedVesselId(incident.candidates[0]?.id || null);
    setIsAnalysisDrawerOpen(true);
  };

  const handleSelectVessel = (vesselId: string) => {
    setSelectedVesselId(vesselId);
    setIsAnalysisDrawerOpen(true);
  };

  const handleSimulationComplete = (incident: SlickIncident) => {
    setSelectedIncident(incident);
    setSelectedVesselId(incident.candidates[0]?.id || null);
    setActiveModule("map");
    setIsAnalysisDrawerOpen(true);
  };

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden bg-[#f7f8fa] text-[#4a5568] selection:bg-amber-100 selection:text-amber-900">
      {/* 1. Global Navigation Top Bar */}
      <Navbar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        selectedIncidentId={selectedIncident.id}
      />

      {/* 2. Main Viewport Workspace (Map-First Architecture) */}
      <main className="flex-1 relative w-full h-full overflow-hidden flex">
        {/* Primary GIS Map Anchor (Always mounted in background or focused) */}
        <div className={`relative h-full transition-all duration-300 ${
          activeModule === "map"
            ? isAnalysisDrawerOpen ? "w-full lg:w-3/5 xl:w-2/3" : "w-full"
            : activeModule === "analysis"
            ? "w-1/3 hidden lg:block"
            : "hidden"
        }`}>
          <MaritimeMap
            incidents={incidents}
            selectedIncident={selectedIncident}
            selectedVesselId={selectedVesselId}
            onSelectIncident={handleSelectIncident}
            onSelectVessel={handleSelectVessel}
          />
        </div>

        {/* Sliding Incident Analysis Drawer (When active module is 'map' & drawer is open) */}
        {activeModule === "map" && isAnalysisDrawerOpen && (
          <div className="w-full lg:w-2/5 xl:w-1/3 h-full z-30 animate-in slide-in-from-right duration-300 shadow-2xl">
            <IncidentAnalysisDrawer
              incident={selectedIncident}
              onClose={() => setIsAnalysisDrawerOpen(false)}
              selectedVesselId={selectedVesselId}
              onSelectVessel={handleSelectVessel}
            />
          </div>
        )}

        {/* Standalone Incident Analysis View (When module switcher 'analysis' is clicked) */}
        {activeModule === "analysis" && (
          <div className="flex-1 h-full z-30">
            <IncidentAnalysisDrawer
              incident={selectedIncident}
              onClose={() => setActiveModule("map")}
              selectedVesselId={selectedVesselId}
              onSelectVessel={handleSelectVessel}
            />
          </div>
        )}

        {/* Dashboard Module View */}
        {activeModule === "dashboard" && (
          <div className="w-full h-full z-30">
            <DashboardModule
              incidents={incidents}
              onSelectIncident={handleSelectIncident}
              onOpenAnalysis={(incident) => {
                setSelectedIncident(incident);
                setActiveModule("analysis");
              }}
              onNavigateToTab={(tab) => setActiveModule(tab)}
            />
          </div>
        )}

        {/* Live Simulator & Report Analyzer Centerpiece View */}
        {activeModule === "simulator" && (
          <div className="w-full h-full z-30">
            <SimulatorModule
              onSimulationComplete={handleSimulationComplete}
            />
          </div>
        )}

        {/* Patterns & Corridor Trends Module View */}
        {activeModule === "patterns" && (
          <div className="w-full h-full z-30">
            <PatternsModule />
          </div>
        )}
      </main>
    </div>
  );
}
