"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { SlickIncident, VesselCandidate } from "../data/mockMaritimeData";

interface LeafletMapInnerProps {
  incidents: SlickIncident[];
  selectedIncident: SlickIncident;
  selectedVesselId: string | null;
  onSelectIncident: (incident: SlickIncident) => void;
  onSelectVessel: (vesselId: string) => void;
  currentReplayHour: number; // 0, 2, 4, 6, 8
  showSlicks: boolean;
  showTrajectories: boolean;
  showAisGaps: boolean;
  showVectors: boolean;
  showGraticule: boolean;
  tileStyle: "light" | "satellite" | "nautical";
  onCursorMove: (lat: number, lng: number) => void;
}

export const LeafletMapInner: React.FC<LeafletMapInnerProps> = ({
  incidents,
  selectedIncident,
  selectedVesselId,
  onSelectIncident,
  onSelectVessel,
  currentReplayHour,
  showSlicks,
  showTrajectories,
  showAisGaps,
  showVectors,
  showGraticule,
  tileStyle,
  onCursorMove
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const [hasTileError, setHasTileError] = useState<boolean>(false);

  const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY || "";

  const getMapTilerUrl = (style: "light" | "satellite" | "nautical") => {
    if (!MAPTILER_KEY) return "";
    if (style === "satellite") {
      return `https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=${MAPTILER_KEY}`;
    }
    if (style === "nautical") {
      return `https://api.maptiler.com/maps/ocean/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`;
    }
    return `https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`;
  };

  // Initialize Leaflet map instance once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: selectedIncident.centerCoordinates,
      zoom: 11,
      zoomControl: false,
      attributionControl: false
    });

    // Handle mouse move telemetry for real-time lat/long readout
    map.on("mousemove", (e: L.LeafletMouseEvent) => {
      onCursorMove(e.latlng.lat, e.latlng.lng);
    });

    const initialUrl = getMapTilerUrl(tileStyle) || "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

    const tileLayer = L.tileLayer(initialUrl, {
      maxZoom: 19,
      subdomains: "abcd"
    });

    tileLayer.on("tileerror", () => {
      setHasTileError(true);
    });

    tileLayer.on("tileload", () => {
      setHasTileError(false);
    });

    tileLayer.addTo(map);
    tileLayerRef.current = tileLayer;

    // Zoom control at top right
    L.control.zoom({ position: "topright" }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Basemap Provider on tileStyle change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !tileLayerRef.current) return;

    map.removeLayer(tileLayerRef.current);

    const newUrl = getMapTilerUrl(tileStyle) || "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

    const newTileLayer = L.tileLayer(newUrl, {
      maxZoom: 19,
      subdomains: "abcd"
    });

    newTileLayer.on("tileerror", () => {
      setHasTileError(true);
    });

    newTileLayer.on("tileload", () => {
      setHasTileError(false);
    });

    newTileLayer.addTo(map);
    tileLayerRef.current = newTileLayer;
  }, [tileStyle]);

  // Update center when selectedIncident changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(selectedIncident.centerCoordinates, 11, {
        duration: 1.5
      });
    }
  }, [selectedIncident.id]);

  // Render Tactical Layers (Slicks, Trajectories, Range Rings, Graticule)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. Graticule Lat/Long Grid Lines
    if (showGraticule) {
      const bounds = map.getBounds();
      const minLat = Math.floor(bounds.getSouth() * 5) / 5;
      const maxLat = Math.ceil(bounds.getNorth() * 5) / 5;
      const minLng = Math.floor(bounds.getWest() * 5) / 5;
      const maxLng = Math.ceil(bounds.getEast() * 5) / 5;

      for (let lat = minLat; lat <= maxLat; lat += 0.1) {
        L.polyline([[lat, minLng], [lat, maxLng]], {
          color: "rgba(100, 116, 139, 0.25)",
          weight: 1,
          dashArray: "3, 6"
        }).addTo(layerGroup);
      }
      for (let lng = minLng; lng <= maxLng; lng += 0.1) {
        L.polyline([[minLat, lng], [maxLat, lng]], {
          color: "rgba(100, 116, 139, 0.25)",
          weight: 1,
          dashArray: "3, 6"
        }).addTo(layerGroup);
      }
    }

    // 2. Tactical Tactical Range Rings centered on selected incident (5 NM, 10 NM)
    if (selectedIncident) {
      const center = selectedIncident.centerCoordinates;
      
      // 5 Nautical Miles radius circle (~9260 meters)
      L.circle(center, {
        radius: 9260,
        color: "rgba(180, 83, 9, 0.35)",
        weight: 1,
        dashArray: "4, 4",
        fill: false
      }).addTo(layerGroup);

      // 10 Nautical Miles radius circle (~18520 meters)
      L.circle(center, {
        radius: 18520,
        color: "rgba(180, 83, 9, 0.2)",
        weight: 1,
        dashArray: "6, 6",
        fill: false
      }).addTo(layerGroup);
    }

    // 3. Slick Polygons & Replay Position
    if (showSlicks) {
      incidents.forEach((incident) => {
        const isSelected = incident.id === selectedIncident.id;

        // Compute drift center based on replay hour step
        const stepIndex = incident.driftReplaySteps.findIndex(s => s.hoursAgo === currentReplayHour);
        const activeStep = stepIndex !== -1 ? incident.driftReplaySteps[stepIndex] : incident.driftReplaySteps[0];
        
        // Offset polygon coordinates based on current replay center vs original center
        const latOffset = activeStep.center[0] - incident.centerCoordinates[0];
        const lngOffset = activeStep.center[1] - incident.centerCoordinates[1];

        const shiftedPolygon = incident.polygonCoordinates.map(([lat, lng]) => [
          lat + latOffset,
          lng + lngOffset
        ] as [number, number]);

        // Draw Slick Polygon
        const polygon = L.polygon(shiftedPolygon, {
          color: isSelected ? "#dc2626" : "#d97706",
          weight: isSelected ? 3 : 2,
          fillColor: isSelected ? "rgba(220, 38, 38, 0.4)" : "rgba(217, 119, 6, 0.25)",
          fillOpacity: isSelected ? 0.75 : 0.45,
          dashArray: isSelected ? undefined : "4, 4",
          className: isSelected ? "animate-slick-pulse cursor-pointer" : "cursor-pointer"
        });

        polygon.on("click", () => {
          onSelectIncident(incident);
        });

        polygon.bindPopup(`
          <div class="text-[12px] font-sans space-y-1.5 p-1 text-[#1a1f2e]">
            <div class="font-semibold text-[#b45309] text-[14px]">${incident.title}</div>
            <div class="border-b border-slate-200 pb-1 text-[11px] text-slate-500 font-mono">INCIDENT ID: ${incident.id}</div>
            <div><span class="text-slate-500">SAR Sensor:</span> <span class="text-[#1a1f2e] font-medium font-mono">${incident.sensor}</span></div>
            <div><span class="text-slate-500">Acquisition:</span> <span class="text-slate-700 font-mono">${incident.acquisitionUtc}</span></div>
            <div><span class="text-slate-500">Slick Area:</span> <span class="text-amber-800 font-mono font-semibold">${activeStep.slickSpreadKm2} km²</span></div>
            <div><span class="text-slate-500">Est. Oil Volume:</span> <span class="text-amber-800 font-mono font-semibold">${incident.estOilVolumeM3} m³ (${incident.estBarrels} bbls)</span></div>
            <div class="pt-1.5 text-[11px] text-amber-800 border-t border-slate-200 flex items-center justify-between font-medium">
              <span>MARPOL ANNEX I VIOLATION</span>
              <span class="text-red-700 font-semibold">CLICK TO ANALYZE →</span>
            </div>
          </div>
        `);

        polygon.addTo(layerGroup);

        // Slick Center Radar Pulse Marker
        const pulseIcon = L.divIcon({
          className: "custom-pulse-icon",
          html: `
            <div class="relative flex items-center justify-center w-7 h-7">
              <span class="absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75 animate-ping"></span>
              <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-600 border-2 border-white shadow-md"></span>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        L.marker(activeStep.center, { icon: pulseIcon }).addTo(layerGroup);
      });
    }

    // 4. Vessel Trajectories & Candidate Lines (ONLY for selected incident)
    if (showTrajectories && selectedIncident) {
      selectedIncident.candidates.forEach((cand) => {
        const isVesselSelected = cand.id === selectedVesselId;

        // Color coding by candidate risk category
        let color = "#059669"; // Low Risk Emerald
        if (cand.riskCategory === "CRITICAL") color = "#dc2626";
        else if (cand.riskCategory === "MODERATE") color = "#d97706";

        // Verified Empirical Trajectory (Solid Line)
        if (cand.trajectoryPoints && cand.trajectoryPoints.length > 1) {
          const solidPolyline = L.polyline(cand.trajectoryPoints, {
            color: color,
            weight: isVesselSelected ? 4 : 2.5,
            opacity: isVesselSelected ? 1.0 : 0.8,
            className: "cursor-pointer"
          });

          solidPolyline.on("click", () => {
            onSelectVessel(cand.id);
          });

          solidPolyline.bindPopup(`
            <div class="text-[12px] font-sans space-y-1 p-1 text-[#1a1f2e]">
              <div class="font-semibold text-[#b45309] text-[14px]">${cand.name}</div>
              <div class="font-mono text-[11px]"><span class="text-slate-500 font-sans">MMSI:</span> ${cand.mmsi} | <span class="text-slate-500 font-sans">Flag:</span> ${cand.flag}</div>
              <div><span class="text-slate-500">Ship Type:</span> ${cand.type}</div>
              <div><span class="text-slate-500">Attribution Score:</span> <span class="font-mono font-semibold text-[14px] ${cand.riskScore > 80 ? 'text-red-700' : 'text-amber-700'}">${cand.riskScore}%</span></div>
              <div><span class="text-slate-500">AIS Transponder Gap:</span> ${cand.hasAisGap ? `<span class="text-red-700 font-mono font-semibold">⚠️ ${cand.aisGapDuration}</span>` : '<span class="text-emerald-700 font-medium">None</span>'}</div>
            </div>
          `);

          solidPolyline.addTo(layerGroup);
        }

        // Inferred Probabilistic Trajectory / Gap Interpolation (Dashed Line)
        if (cand.inferredPoints && cand.inferredPoints.length > 1) {
          const dashedPolyline = L.polyline(cand.inferredPoints, {
            color: "#dc2626",
            weight: 2,
            dashArray: "6, 6",
            opacity: 0.9
          });

          dashedPolyline.addTo(layerGroup);
        }

        // AIS Blackout Gap Line indicator
        if (showAisGaps && cand.hasAisGap && cand.inferredPoints.length > 1) {
          const midPoint = cand.inferredPoints[Math.floor(cand.inferredPoints.length / 2)];
          const gapIcon = L.divIcon({
            className: "gap-alert-marker",
            html: `
              <div class="bg-red-700 border border-red-500 text-white text-[10px] font-mono px-2 py-0.5 rounded shadow-md flex items-center gap-1 font-bold">
                <span>⚠️ AIS DARK GAP (${cand.aisGapDuration})</span>
              </div>
            `,
            iconSize: [150, 22],
            iconAnchor: [75, 11]
          });
          L.marker(midPoint, { icon: gapIcon }).addTo(layerGroup);
        }

        // Vessel Marker Icon (Custom Imperial Vessel Marker)
        const shipIcon = L.divIcon({
          className: "vessel-ship-marker",
          html: `
            <div class="relative group cursor-pointer">
              <div class="w-8 h-8 rounded-full bg-white border-2 ${isVesselSelected ? 'border-red-600 ring-4 ring-red-400/40 scale-110' : 'border-amber-600'} flex items-center justify-center shadow-md transition-all">
                <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current ${cand.riskCategory === 'CRITICAL' ? 'text-red-600' : cand.riskCategory === 'MODERATE' ? 'text-amber-600' : 'text-emerald-600'}" style="transform: rotate(${cand.heading}deg);">
                  <path d="M12 2 L19 21 L12 17 L5 21 Z"/>
                </svg>
              </div>
              <div class="absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/95 border border-[#e2e8f0] text-[10px] font-mono px-2 py-0.5 rounded text-[#1a1f2e] pointer-events-none shadow-md font-semibold">
                ${cand.name} (${cand.riskScore}%)
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const vesselMarker = L.marker(cand.lastKnownPos, { icon: shipIcon });
        vesselMarker.on("click", () => {
          onSelectVessel(cand.id);
        });
        vesselMarker.addTo(layerGroup);
      });
    }

    // 5. Wind & Surface Current Field Vectors
    if (showVectors && selectedIncident) {
      const center = selectedIncident.centerCoordinates;
      const windSpeed = selectedIncident.windSpeedKnots;
      const windDir = selectedIncident.windDirectionDeg;

      // Draw Wind Direction Arrow Vector (Tooltip on hover/click only)
      const rad = (windDir * Math.PI) / 180;
      const endLat = center[0] + Math.cos(rad) * 0.08;
      const endLng = center[1] + Math.sin(rad) * 0.08;

      const windPolyline = L.polyline([center, [endLat, endLng]], {
        color: "#0284c7",
        weight: 2.5,
        dashArray: "3, 3"
      }).addTo(layerGroup);

      windPolyline.bindTooltip(`Surface Wind Vector: ${windSpeed} kn @ ${windDir}°`, {
        permanent: false,
        direction: "top"
      });
    }
  }, [
    incidents,
    selectedIncident,
    selectedVesselId,
    currentReplayHour,
    showSlicks,
    showTrajectories,
    showAisGaps,
    showVectors,
    showGraticule,
    tileStyle
  ]);

  return (
    <div className="relative w-full h-full min-h-[500px]">
      <div ref={mapContainerRef} className="w-full h-full min-h-[500px]" />
      {(hasTileError || !MAPTILER_KEY) && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[500] bg-red-50 border border-red-300 text-red-800 px-4 py-2 rounded-lg shadow-md font-sans text-[13px] font-semibold flex items-center gap-2 animate-in fade-in">
          <span>⚠️ Map tiles unavailable — check API key configuration</span>
        </div>
      )}
    </div>
  );
};
