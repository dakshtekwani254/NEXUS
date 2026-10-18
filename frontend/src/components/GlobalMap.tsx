"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Port, Route, DisruptionEvent } from "@/lib/types";
import { 
  Layers, RotateCcw, AlertTriangle, ShieldCheck, Compass, 
  Anchor, Navigation, Settings, Info, CheckCircle2, MapPin
} from "lucide-react";
import "leaflet/dist/leaflet.css";

// Dynamically load GoogleMapsView to ensure clean client-side rendering
const GoogleMapsView = dynamic(
  () => import("./GoogleMapsView").then((mod) => mod.GoogleMapsView),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[500px] bg-subtle-surface flex flex-col items-center justify-center gap-2 text-xs text-secondary-text">
        <span className="material-symbols-outlined text-primary-accent text-[28px] animate-spin">
          progress_activity
        </span>
        <span>Loading Google Maps Platform JavaScript SDK...</span>
      </div>
    )
  }
);

interface GlobalMapProps {
  ports: Port[];
  routes: Route[];
  disruptions: DisruptionEvent[];
  onSelectPort?: (port: Port) => void;
  selectedPortCode?: string | null;
  className?: string;
  height?: string;
}

export const GlobalMap: React.FC<GlobalMapProps> = ({
  ports = [],
  routes = [],
  disruptions = [],
  onSelectPort,
  selectedPortCode,
  className,
  height = "540px"
}) => {
  // Read public frontend variable for Google Maps Platform SDK
  const googleMapsApiKey = (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "").trim();

  // Engine selection: defaults to GOOGLE if key exists, otherwise FALLBACK
  const [engineMode, setEngineMode] = useState<"GOOGLE" | "FALLBACK">(
    googleMapsApiKey ? "GOOGLE" : "FALLBACK"
  );

  const [googleMapsError, setGoogleMapsError] = useState<{
    type: string;
    message: string;
  } | null>(null);

  const [showConfigModal, setShowConfigModal] = useState(false);

  // Layer Toggles
  const [showPorts, setShowPorts] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [showHotspots, setShowHotspots] = useState(true);
  const [showVessels, setShowVessels] = useState(true);

  // Leaflet Fallback Refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layersRef = useRef<{
    portsLayer: any;
    routesLayer: any;
    hotspotsLayer: any;
    vesselsLayer: any;
  }>({
    portsLayer: null,
    routesLayer: null,
    hotspotsLayer: null,
    vesselsLayer: null
  });
  const [leafletReady, setLeafletReady] = useState(false);

  // Initialize Leaflet Fallback Map when engineMode === "FALLBACK"
  useEffect(() => {
    if (engineMode !== "FALLBACK") return;
    let isMounted = true;
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    import("leaflet").then((L) => {
      const container = mapContainerRef.current;
      if (!isMounted || mapInstanceRef.current || !container) return;

      // Clean default Leaflet icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(container, {
        center: [24.0, 40.0],
        zoom: 2.2,
        minZoom: 1.8,
        maxZoom: 10,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        subdomains: "abcd",
        maxZoom: 19
      }).addTo(map);

      L.control.zoom({ position: "topright" }).addTo(map);

      const routesLayer = L.layerGroup().addTo(map);
      const hotspotsLayer = L.layerGroup().addTo(map);
      const portsLayer = L.layerGroup().addTo(map);
      const vesselsLayer = L.layerGroup().addTo(map);

      layersRef.current = { routesLayer, hotspotsLayer, portsLayer, vesselsLayer };
      mapInstanceRef.current = map;
      setLeafletReady(true);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      setLeafletReady(false);
    };
  }, [engineMode]);

  // Leaflet Layer Updates
  useEffect(() => {
    if (engineMode !== "FALLBACK" || !leafletReady || !mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      const { portsLayer, routesLayer, hotspotsLayer, vesselsLayer } = layersRef.current;
      if (!portsLayer) return;

      // 1. Routes Layer
      routesLayer.clearLayers();
      if (showRoutes) {
        routes.forEach((rt) => {
          const isHigh = rt.current_risk_score >= 70;
          const isMed = rt.current_risk_score >= 40 && rt.current_risk_score < 70;
          const color = isHigh ? "#DC2626" : isMed ? "#D97706" : "#2563EB";
          const polyline = L.polyline(rt.waypoints as any, {
            color: color,
            weight: 2.5,
            opacity: 0.85,
            dashArray: isHigh ? "6, 6" : undefined
          }).addTo(routesLayer);

          polyline.bindTooltip(`
            <div style="font-family: sans-serif; font-size: 11px;">
              <strong style="color: #172033;">${rt.name}</strong><br/>
              <span style="color: #64748B;">Corridor Risk Score: ${rt.current_risk_score}/100</span><br/>
              <span style="color: ${color}; font-weight: bold;">Status: ${rt.status}</span><br/>
              <span style="color: #94A3B8; font-size: 10px;">(Illustrative geometry & demo risk)</span>
            </div>
          `, { sticky: true });
        });
      }

      // 2. Hotspots Layer
      hotspotsLayer.clearLayers();
      if (showHotspots) {
        const stormCircle = L.circle([29.5, 125.0], {
          color: "#DC2626",
          fillColor: "#DC2626",
          fillOpacity: 0.18,
          radius: 480000,
          weight: 1.5,
          dashArray: "4, 4"
        }).addTo(hotspotsLayer);

        stormCircle.bindTooltip(`
          <div style="font-size: 11px; font-family: sans-serif;">
            <strong style="color: #DC2626;">⚠️ Weather Disruption Zone: East China Sea</strong><br/>
            <span>Gale Force 9 Winds (40-48 kts). Pilotage throttled.</span>
          </div>
        `, { sticky: true });

        const redSeaCircle = L.circle([12.6, 43.3], {
          color: "#DC2626",
          fillColor: "#DC2626",
          fillOpacity: 0.2,
          radius: 350000,
          weight: 1.5,
          dashArray: "4, 4"
        }).addTo(hotspotsLayer);

        redSeaCircle.bindTooltip(`
          <div style="font-size: 11px; font-family: sans-serif;">
            <strong style="color: #DC2626;">⛔ Geopolitical Rerouting Zone: Bab el-Mandeb</strong><br/>
            <span>Cape of Good Hope transit diversion (+10-14 days).</span>
          </div>
        `, { sticky: true });
      }

      // 3. Ports Layer
      portsLayer.clearLayers();
      if (showPorts) {
        ports.forEach((p) => {
          const isHigh = p.risk_score >= 70;
          const isMed = p.risk_score >= 40 && p.risk_score < 70;
          const markerColor = isHigh ? "#DC2626" : isMed ? "#D97706" : "#16A34A";
          const isSelected = selectedPortCode === p.code;

          const customHtml = `
            <div style="
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 32px;
              height: 32px;
              cursor: pointer;
            ">
              ${isHigh ? `<div style="
                position: absolute;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                background: ${markerColor};
                opacity: 0.35;
                animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
              "></div>` : ""}
              <div style="
                width: ${isSelected ? "20px" : "16px"};
                height: ${isSelected ? "20px" : "16px"};
                border-radius: 50%;
                background: ${markerColor};
                border: 2px solid #FFFFFF;
                box-shadow: 0 1px 4px rgba(0,0,0,0.25);
              "></div>
              <div style="
                position: absolute;
                top: 24px;
                white-space: nowrap;
                background: #FFFFFF;
                border: 1px solid #CBD5E1;
                box-shadow: 0 1px 3px rgba(0,0,0,0.08);
                padding: 1px 5px;
                border-radius: 4px;
                font-size: 9px;
                font-weight: 700;
                color: #1E293B;
                font-family: sans-serif;
                pointer-events: none;
              ">
                ${p.code} (${p.risk_score})
              </div>
            </div>
          `;

          const icon = L.divIcon({
            html: customHtml,
            className: "custom-port-marker",
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          });

          const marker = L.marker([p.lat, p.lng], { icon }).addTo(portsLayer);

          marker.on("click", () => {
            if (onSelectPort) onSelectPort(p);
          });

          marker.bindTooltip(`
            <div style="font-size: 11px; padding: 3px; font-family: sans-serif;">
              <strong style="color: #0F172A;">${p.name} (${p.code})</strong><br/>
              <span style="color: #64748B;">Country: ${p.country}</span><br/>
              <span style="color: ${markerColor}; font-weight: bold;">Risk Score: ${p.risk_score}/100 (${p.severity})</span><br/>
              <span style="color: #2563EB;">Berth Dwell: ${p.avg_berth_wait_hours}h</span>
            </div>
          `, { direction: "top", offset: [0, -10] });
        });
      }

      // 4. Vessels Layer
      vesselsLayer.clearLayers();
      if (showVessels) {
        const simulatedVessels = [
          { name: "Madrid Maersk", lat: 35.8, lng: 165.2, cargo: "EV Batteries", dest: "USLAX", speed: "14.2 kn" },
          { name: "MSC Loreto", lat: -18.4, lng: 52.1, cargo: "Robotics Spindles", dest: "NLRTM", speed: "18.5 kn" },
          { name: "ONE Continuity", lat: 34.2, lng: -145.0, cargo: "Electronics", dest: "USLAX", speed: "17.0 kn" },
          { name: "Berlin Express", lat: -28.0, lng: 32.5, cargo: "Chemical Polymers", dest: "NLRTM", speed: "19.1 kn" }
        ];

        simulatedVessels.forEach((v) => {
          const vesselHtml = `
            <div style="
              width: 12px;
              height: 12px;
              background: #2563EB;
              border: 2px solid #FFFFFF;
              border-radius: 2px;
              transform: rotate(45deg);
              box-shadow: 0 1px 3px rgba(0,0,0,0.3);
            "></div>
          `;
          const vesselIcon = L.divIcon({
            html: vesselHtml,
            className: "vessel-marker",
            iconSize: [12, 12],
            iconAnchor: [6, 6]
          });
          const marker = L.marker([v.lat, v.lng], { icon: vesselIcon }).addTo(vesselsLayer);
          marker.bindTooltip(`
            <div style="font-size: 11px; font-family: sans-serif;">
              <strong style="color: #2563EB;">🚢 ${v.name}</strong> (Simulated AIS)<br/>
              <span style="color: #64748B;">Cargo: ${v.cargo}</span><br/>
              <span>Destination: <strong>${v.dest}</strong> | Speed: ${v.speed}</span>
            </div>
          `, { direction: "top", offset: [0, -8] });
        });
      }
    });
  }, [engineMode, leafletReady, ports, routes, showPorts, showRoutes, showHotspots, showVessels, selectedPortCode, onSelectPort]);

  const resetView = () => {
    if (engineMode === "FALLBACK" && mapInstanceRef.current) {
      mapInstanceRef.current.setView([24.0, 40.0], 2.2);
    }
  };

  const handleGoogleMapsError = (err: { type: string; message: string }) => {
    console.warn("[GlobalMap] Switching to fallback due to Google Maps error:", err);
    setGoogleMapsError(err);
    setEngineMode("FALLBACK");
  };

  return (
    <div
      className={`relative w-full bg-primary-surface rounded-xl border border-border overflow-hidden shadow-xs ${className || ""}`}
      style={{ height }}
    >
      {/* Map Engine View */}
      {engineMode === "GOOGLE" && googleMapsApiKey ? (
        <GoogleMapsView
          apiKey={googleMapsApiKey}
          ports={ports}
          routes={routes}
          disruptions={disruptions}
          showPorts={showPorts}
          showRoutes={showRoutes}
          showHotspots={showHotspots}
          showVessels={showVessels}
          onSelectPort={onSelectPort}
          selectedPortCode={selectedPortCode}
          onError={handleGoogleMapsError}
          className="w-full h-full"
        />
      ) : (
        <div ref={mapContainerRef} className="w-full h-full z-0" />
      )}

      {/* Top Left Title & Engine Mode Status Badge */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2 pointer-events-auto">
        <div className="bg-primary-surface/95 backdrop-blur-xs border border-border rounded-xl px-3 py-2 flex items-center gap-2.5 shadow-xs">
          <Compass className="w-4 h-4 text-primary-accent animate-spin" style={{ animationDuration: "14s" }} />
          <span className="text-xs font-semibold text-primary-text">Global Maritime Radar</span>
          
          {/* Active Engine Badge */}
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              engineMode === "GOOGLE"
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "bg-slate-100 text-slate-700 border border-slate-200"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${engineMode === "GOOGLE" ? "bg-blue-600 animate-pulse" : "bg-slate-500"}`} />
            {engineMode === "GOOGLE" ? "Google Maps Platform" : "CartoDB Maritime Fallback"}
          </span>

          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-subtle-surface text-secondary-text border border-border hidden sm:inline-block">
            {ports.length} Hubs | {routes.length} Corridors
          </span>
        </div>

        {/* Engine Switcher / Info Button */}
        <div className="bg-primary-surface/95 backdrop-blur-xs border border-border rounded-xl px-2 py-1 flex items-center gap-1.5 shadow-xs text-xs">
          <button
            onClick={() => {
              if (engineMode === "FALLBACK" && !googleMapsApiKey) {
                setShowConfigModal(true);
              } else {
                setEngineMode((prev) => (prev === "GOOGLE" ? "FALLBACK" : "GOOGLE"));
              }
            }}
            className="px-2 py-1 rounded-lg bg-subtle-surface hover:bg-hover-surface text-secondary-text hover:text-primary-text text-[11px] font-medium transition"
            title="Toggle between Google Maps and CartoDB maritime layer"
          >
            Switch to {engineMode === "GOOGLE" ? "Fallback Map" : "Google Maps"}
          </button>

          <button
            onClick={() => setShowConfigModal(true)}
            className="p-1 rounded-lg text-secondary-text hover:text-primary-text hover:bg-subtle-surface transition"
            title="Google Maps Platform API Status & Configuration"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top Right Controls & Layer Toggles */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2 pointer-events-auto">
        <div className="bg-primary-surface/95 backdrop-blur-xs border border-border rounded-xl p-2 text-xs flex items-center gap-3 shadow-xs">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-secondary-text border-r border-border pr-2">
            <Layers className="w-3.5 h-3.5 text-primary-accent" />
            <span className="hidden sm:inline">Layers:</span>
          </div>
          <label className="flex items-center gap-1 cursor-pointer text-[11px] text-primary-text select-none">
            <input
              type="checkbox"
              checked={showPorts}
              onChange={(e) => setShowPorts(e.target.checked)}
              className="accent-primary-accent rounded"
            />
            <span>Ports</span>
          </label>
          <label className="flex items-center gap-1 cursor-pointer text-[11px] text-primary-text select-none">
            <input
              type="checkbox"
              checked={showRoutes}
              onChange={(e) => setShowRoutes(e.target.checked)}
              className="accent-primary-accent rounded"
            />
            <span>Routes</span>
          </label>
          <label className="flex items-center gap-1 cursor-pointer text-[11px] text-primary-text select-none">
            <input
              type="checkbox"
              checked={showHotspots}
              onChange={(e) => setShowHotspots(e.target.checked)}
              className="accent-high-risk rounded"
            />
            <span>Hotspots</span>
          </label>
          <label className="flex items-center gap-1 cursor-pointer text-[11px] text-primary-text select-none">
            <input
              type="checkbox"
              checked={showVessels}
              onChange={(e) => setShowVessels(e.target.checked)}
              className="accent-primary-accent rounded"
            />
            <span>Vessels</span>
          </label>
        </div>

        {engineMode === "FALLBACK" && (
          <button
            onClick={resetView}
            title="Reset Global View"
            className="p-2.5 rounded-xl bg-primary-surface/95 backdrop-blur-xs border border-border hover:bg-subtle-surface text-secondary-text hover:text-primary-text transition shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Diagnostic Warning Banner if Google Maps Error Occurred */}
      {googleMapsError && (
        <div className="absolute top-16 left-3 right-3 sm:right-auto sm:max-w-md z-10 bg-amber-50 border border-amber-300 rounded-xl p-3 shadow-md text-amber-900 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <span className="font-bold block">Google Maps Platform Notice</span>
            <p className="text-[11px] text-amber-800 leading-snug">
              {googleMapsError.message}
            </p>
            <span className="text-[10px] text-amber-700 font-medium block mt-1">
              Active fallback: CartoDB Positron Maritime Layer.
            </span>
          </div>
          <button
            onClick={() => setGoogleMapsError(null)}
            className="text-amber-700 hover:text-amber-900 font-bold px-1"
          >
            ×
          </button>
        </div>
      )}

      {/* Bottom Left Legend & Illustrative Label */}
      <div className="absolute bottom-3 left-3 z-10 bg-primary-surface/95 backdrop-blur-xs border border-border rounded-xl p-2.5 text-xs shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-high-risk" />
          <span className="text-[11px] text-secondary-text">High Risk (≥70)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-medium-risk" />
          <span className="text-[11px] text-secondary-text">Medium (40-69)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-success" />
          <span className="text-[11px] text-secondary-text">Low (&lt;40)</span>
        </div>
        <div className="flex items-center gap-1.5 border-l border-border pl-2.5">
          <div className="w-2 h-2 bg-primary-accent rotate-45" />
          <span className="text-[11px] text-secondary-text">Simulated Vessel</span>
        </div>
        <div className="text-[10px] text-muted-text italic">
          (Illustrative shipping route geometry &amp; demo risk telemetry)
        </div>
      </div>

      {/* Google Maps Configuration & Status Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-primary-surface border border-border rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-accent text-[22px]">map</span>
                <h3 className="font-section-heading text-section-heading font-semibold text-primary-text">
                  Google Maps Platform Integration
                </h3>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="p-1 rounded-lg text-secondary-text hover:text-primary-text hover:bg-subtle-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs text-secondary-text">
              <div className="p-3 rounded-xl bg-subtle-surface border border-border space-y-1">
                <span className="font-semibold text-primary-text block">Client-Side Public Variable:</span>
                <code className="text-primary-accent font-mono text-[11px] block bg-primary-surface p-2 rounded border border-border select-all">
                  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
                </code>
                <span className="text-[11px] text-muted-text block pt-1">
                  Status: {googleMapsApiKey ? "Configured in environment" : "Not configured (Operating in fallback mode)"}
                </span>
              </div>

              <div className="space-y-2">
                <span className="font-semibold text-primary-text block">Required Google Maps APIs:</span>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                    <span><strong>Maps JavaScript API</strong>: Core raster/vector world map &amp; styling</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                    <span><strong>Markers &amp; InfoWindows</strong>: Port node status &amp; interactive callouts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                    <span><strong>Geodesic Polylines</strong>: Maritime shipping corridor geometries</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 space-y-1">
                <span className="font-semibold block">To link a Google Maps API Key:</span>
                <ol className="list-decimal pl-4 space-y-0.5 text-[11px]">
                  <li>Create or edit <code>frontend/.env.local</code> (strictly ignored by Git).</li>
                  <li>Add: <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=&quot;your_key_here&quot;</code></li>
                  <li>Restart frontend dev server: <code>npm run dev</code></li>
                </ol>
              </div>

              <div className="p-3 bg-subtle-surface rounded-xl border border-border text-[11px] text-muted-text">
                Note on Google Maps Demo Keys: If your key has not activated billing or lacks the Maps JavaScript API, the application detects <code>gm_authFailure</code> and automatically runs in the interactive CartoDB fallback layer.
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 rounded-xl bg-primary-accent text-on-primary font-button-input text-xs font-semibold hover:bg-primary transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
