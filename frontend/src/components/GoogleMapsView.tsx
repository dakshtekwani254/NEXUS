"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  APIProvider,
  Map,
  Marker,
  InfoWindow,
  useMap
} from "@vis.gl/react-google-maps";
import { Port, Route, DisruptionEvent } from "@/lib/types";

// Light theme Google Maps styling consistent with NEXUS Stitch light-theme tokens
const NEXUS_GOOGLE_MAP_STYLES: google.maps.MapTypeStyle[] = [
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#dbeafe" }] // Soft maritime blue
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#f8fafc" }] // Clean light landmass
  },
  {
    featureType: "road",
    stylers: [{ visibility: "off" }] // Omit road network to focus on maritime corridors
  },
  {
    featureType: "transit",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }] // Hide non-maritime POIs
  },
  {
    featureType: "administrative.country",
    elementType: "geometry.stroke",
    stylers: [{ color: "#cbd5e1" }, { weight: 0.8 }] // Subtle borders
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text.fill",
    stylers: [{ color: "#64748b" }]
  },
  {
    featureType: "administrative.province",
    stylers: [{ visibility: "off" }]
  }
];

// Inner helper component for Route Polylines
function GoogleMapRoutes({
  routes,
  showRoutes
}: {
  routes: Route[];
  showRoutes: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || typeof google === "undefined" || !showRoutes) return;

    const polylines: google.maps.Polyline[] = [];

    routes.forEach((rt) => {
      if (!rt.waypoints || rt.waypoints.length === 0) return;

      const path = rt.waypoints.map(([lat, lng]) => ({ lat, lng }));
      const isHigh = rt.current_risk_score >= 70;
      const isMed = rt.current_risk_score >= 40 && rt.current_risk_score < 70;
      const color = isHigh ? "#DC2626" : isMed ? "#D97706" : "#2563EB";

      const line = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: color,
        strokeOpacity: 0.85,
        strokeWeight: isHigh ? 3 : 2.2,
        icons: isHigh
          ? [
              {
                icon: {
                  path: "M 0,-1 0,1",
                  strokeOpacity: 1,
                  scale: 3,
                  strokeColor: color
                },
                offset: "0",
                repeat: "14px"
              }
            ]
          : undefined,
        map
      });

      polylines.push(line);
    });

    return () => {
      polylines.forEach((l) => l.setMap(null));
    };
  }, [map, routes, showRoutes]);

  return null;
}

// Inner helper component for Hotspot Circles
function GoogleMapHotspots({ showHotspots }: { showHotspots: boolean }) {
  const map = useMap();

  useEffect(() => {
    if (!map || typeof google === "undefined" || !showHotspots) return;

    const circles: google.maps.Circle[] = [];

    // East China Sea Typhoon Warning Zone
    const stormCircle = new google.maps.Circle({
      strokeColor: "#DC2626",
      strokeOpacity: 0.8,
      strokeWeight: 1.5,
      fillColor: "#DC2626",
      fillOpacity: 0.15,
      map,
      center: { lat: 29.5, lng: 125.0 },
      radius: 480000
    });
    circles.push(stormCircle);

    // Bab el-Mandeb / Red Sea Geopolitical Rerouting Zone
    const redSeaCircle = new google.maps.Circle({
      strokeColor: "#DC2626",
      strokeOpacity: 0.8,
      strokeWeight: 1.5,
      fillColor: "#DC2626",
      fillOpacity: 0.18,
      map,
      center: { lat: 12.6, lng: 43.3 },
      radius: 350000
    });
    circles.push(redSeaCircle);

    return () => {
      circles.forEach((c) => c.setMap(null));
    };
  }, [map, showHotspots]);

  return null;
}

// Inner helper component for Simulated AIS Vessels
function GoogleMapVessels({ showVessels }: { showVessels: boolean }) {
  const map = useMap();

  useEffect(() => {
    if (!map || typeof google === "undefined" || !showVessels) return;

    const simulatedVessels = [
      { name: "Madrid Maersk", lat: 35.8, lng: 165.2, cargo: "EV Batteries", dest: "USLAX", speed: "14.2 kn" },
      { name: "MSC Loreto", lat: -18.4, lng: 52.1, cargo: "Robotics Spindles", dest: "NLRTM", speed: "18.5 kn" },
      { name: "ONE Continuity", lat: 34.2, lng: -145.0, cargo: "Electronics", dest: "USLAX", speed: "17.0 kn" },
      { name: "Berlin Express", lat: -28.0, lng: 32.5, cargo: "Chemical Polymers", dest: "NLRTM", speed: "19.1 kn" }
    ];

    const markers: google.maps.Marker[] = [];

    simulatedVessels.forEach((v) => {
      const marker = new google.maps.Marker({
        position: { lat: v.lat, lng: v.lng },
        map,
        title: `${v.name} (Simulated AIS) - Destination: ${v.dest} | Speed: ${v.speed}`,
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 4,
          fillColor: "#2563EB",
          fillOpacity: 1,
          strokeColor: "#FFFFFF",
          strokeWeight: 1.5,
          rotation: 45
        }
      });
      markers.push(marker);
    });

    return () => {
      markers.forEach((m) => m.setMap(null));
    };
  }, [map, showVessels]);

  return null;
}

interface GoogleMapsViewProps {
  apiKey: string;
  ports: Port[];
  routes: Route[];
  disruptions: DisruptionEvent[];
  showPorts: boolean;
  showRoutes: boolean;
  showHotspots: boolean;
  showVessels: boolean;
  onSelectPort?: (port: Port) => void;
  selectedPortCode?: string | null;
  onError?: (error: { type: string; message: string }) => void;
  className?: string;
}

export const GoogleMapsView: React.FC<GoogleMapsViewProps> = ({
  apiKey,
  ports,
  routes,
  disruptions,
  showPorts,
  showRoutes,
  showHotspots,
  showVessels,
  onSelectPort,
  selectedPortCode,
  onError,
  className
}) => {
  const [selectedPortForInfo, setSelectedPortForInfo] = useState<Port | null>(null);

  // Listen for Google Maps Platform global auth failures (e.g. invalid key, billing missing)
  useEffect(() => {
    const prevAuthFailure = (window as any).gm_authFailure;
    (window as any).gm_authFailure = () => {
      console.warn("[GoogleMaps] gm_authFailure fired by Google Maps Platform.");
      if (onError) {
        onError({
          type: "AUTH_FAILURE",
          message: "Google Maps Platform authentication failed (gm_authFailure). The API key may lack billing, have exceeded quota, or lack Maps JavaScript API activation."
        });
      }
      if (prevAuthFailure) prevAuthFailure();
    };

    return () => {
      (window as any).gm_authFailure = prevAuthFailure;
    };
  }, [onError]);

  // Handle marker click
  const handleMarkerClick = useCallback((p: Port) => {
    setSelectedPortForInfo(p);
    if (onSelectPort) {
      onSelectPort(p);
    }
  }, [onSelectPort]);

  // Create custom marker icons based on port risk rating
  const getPortMarkerIcon = useCallback((p: Port) => {
    if (typeof google === "undefined") return undefined;
    const isHigh = p.risk_score >= 70;
    const isMed = p.risk_score >= 40 && p.risk_score < 70;
    const fillColor = isHigh ? "#DC2626" : isMed ? "#D97706" : "#16A34A";

    return {
      path: google.maps.SymbolPath.CIRCLE,
      scale: isHigh ? 8 : 6.5,
      fillColor: fillColor,
      fillOpacity: 1,
      strokeColor: "#FFFFFF",
      strokeWeight: 2
    };
  }, []);

  return (
    <APIProvider
      apiKey={apiKey}
      onError={(err: any) => {
        console.error("[GoogleMaps] APIProvider loader error:", err);
        if (onError) {
          onError({
            type: "LOAD_ERROR",
            message: `Google Maps loader encountered an error: ${err?.message || "Check network connectivity and API key."}`
          });
        }
      }}
    >
      <div className={`relative w-full h-full min-h-[500px] ${className || ""}`}>
        <Map
          defaultCenter={{ lat: 24.0, lng: 35.0 }}
          defaultZoom={2.3}
          minZoom={1.8}
          maxZoom={9}
          gestureHandling="greedy"
          disableDefaultUI={false}
          zoomControl={true}
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={true}
          styles={NEXUS_GOOGLE_MAP_STYLES}
          className="w-full h-full"
        >
          {/* 1. Illustrative Shipping Corridor Polylines */}
          <GoogleMapRoutes routes={routes} showRoutes={showRoutes} />

          {/* 2. Disruption Hotspots */}
          <GoogleMapHotspots showHotspots={showHotspots} />

          {/* 3. Simulated Vessel AIS Markers */}
          <GoogleMapVessels showVessels={showVessels} />

          {/* 4. Port Markers */}
          {showPorts &&
            ports.map((p) => (
              <Marker
                key={p.code}
                position={{ lat: p.lat, lng: p.lng }}
                title={`${p.name} (${p.code}) - Risk: ${p.risk_score}/100`}
                onClick={() => handleMarkerClick(p)}
                icon={getPortMarkerIcon(p)}
                label={{
                  text: p.code,
                  color: "#1E293B",
                  fontSize: "10px",
                  fontWeight: "bold",
                  className: "google-maps-port-label"
                }}
              />
            ))}

          {/* 5. Clickable InfoWindow for Selected Port */}
          {selectedPortForInfo && (
            <InfoWindow
              position={{ lat: selectedPortForInfo.lat, lng: selectedPortForInfo.lng }}
              onCloseClick={() => setSelectedPortForInfo(null)}
              pixelOffset={[0, -18]}
            >
              <div className="p-1 min-w-[240px] max-w-[280px] font-sans text-xs space-y-2 select-text">
                <div className="flex items-start justify-between border-b border-gray-200 pb-1.5 gap-2">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 leading-tight">
                      {selectedPortForInfo.name}
                    </h4>
                    <span className="text-[11px] text-gray-500 font-mono">
                      UN/LOCODE: {selectedPortForInfo.code} • {selectedPortForInfo.country}
                    </span>
                  </div>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      selectedPortForInfo.risk_score >= 70
                        ? "bg-red-100 text-red-700"
                        : selectedPortForInfo.risk_score >= 40
                        ? "bg-amber-100 text-amber-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {selectedPortForInfo.risk_score}/100 RISK
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 py-1 text-[11px]">
                  <div className="bg-gray-50 p-1.5 rounded border border-gray-100">
                    <span className="text-gray-500 block">Avg Berth Wait</span>
                    <strong className="text-gray-800 font-mono text-xs">
                      {selectedPortForInfo.avg_berth_wait_hours ?? 0}h
                    </strong>
                  </div>
                  <div className="bg-gray-50 p-1.5 rounded border border-gray-100">
                    <span className="text-gray-500 block">Weather Index</span>
                    <strong className="text-gray-800 font-mono text-xs">
                      {selectedPortForInfo.weather_score ?? 0}/100
                    </strong>
                  </div>
                </div>

                {selectedPortForInfo.active_notices && selectedPortForInfo.active_notices.length > 0 && (
                  <p className="text-[11px] text-gray-600 line-clamp-2 bg-gray-50 p-1.5 rounded border border-gray-100 italic">
                    &ldquo;{selectedPortForInfo.active_notices[0]}&rdquo;
                  </p>
                )}

                <div className="pt-1.5 border-t border-gray-200 flex items-center justify-between gap-2">
                  <Link
                    href={`/research?port=${selectedPortForInfo.code}&q=${encodeURIComponent(`${selectedPortForInfo.name} port congestion and shipping delays`)}`}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline"
                  >
                    <span>Research (TinyFish)</span>
                    <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                  </Link>

                  <Link
                    href={`/ports/${selectedPortForInfo.code}`}
                    className="text-[11px] font-semibold text-gray-700 hover:text-gray-900"
                  >
                    Inspect Details →
                  </Link>
                </div>
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
};
