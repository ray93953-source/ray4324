import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Layers,
  MapPin,
  AlertTriangle,
  Droplets,
  Eye,
  SlidersHorizontal,
  Navigation,
  FileText,
  ShieldAlert,
  X,
  ExternalLink,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { Bridge, EnvironmentalAlert, RiskLevel } from '../types';
import { getRiskLevelBadge } from '../utils/riskAlgorithm';

interface BridgeMapProps {
  bridges: Bridge[];
  alerts: EnvironmentalAlert[];
  selectedBridge: Bridge | null;
  onSelectBridge: (bridge: Bridge | null) => void;
  onOpenReport: (bridgeId: string) => void;
  onNavigateToRoute: (bridge: Bridge) => void;
}

export const BridgeMap: React.FC<BridgeMapProps> = ({
  bridges,
  alerts,
  selectedBridge,
  onSelectBridge,
  onOpenReport,
  onNavigateToRoute,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const alertsLayerRef = useRef<L.LayerGroup | null>(null);
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [showFloodZones, setShowFloodZones] = useState<boolean>(true);
  const [showHeatGlow, setShowHeatGlow] = useState<boolean>(true);
  const [userCoord, setUserCoord] = useState<{ lat: number; lng: number } | null>({
    lat: 40.745,
    lng: -73.965,
  });

  // Filter bridges based on UI selection
  const filteredBridges = bridges.filter((b) => {
    if (filterRisk === 'all') return true;
    if (filterRisk === 'critical') return b.riskLevel === 'critical';
    if (filterRisk === 'high') return b.riskLevel === 'high' || b.riskLevel === 'critical';
    if (filterRisk === 'moderate') return b.riskLevel === 'moderate';
    if (filterRisk === 'low') return b.riskLevel === 'low';
    if (filterRisk === 'alerts') return b.activeAlerts.length > 0;
    return true;
  });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on river basin coordinates
    const map = L.map(mapContainerRef.current, {
      center: [40.745, -73.965],
      zoom: 12,
      zoomControl: false,
    });

    // Dark sleek OpenStreetMap/CartoDB Dark Matter tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    const alertsGroup = L.layerGroup().addTo(map);

    markersLayerRef.current = markersGroup;
    alertsLayerRef.current = alertsGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Render Flood Alert Polygons
  useEffect(() => {
    const alertsGroup = alertsLayerRef.current;
    if (!alertsGroup) return;

    alertsGroup.clearLayers();

    if (showFloodZones) {
      alerts.forEach((alert) => {
        if (!alert.isActive || !alert.polygonCoords || alert.polygonCoords.length === 0) return;

        const color = alert.severity >= 4 ? '#ef4444' : '#3b82f6';
        const polygon = L.polygon(alert.polygonCoords, {
          color: color,
          weight: 2,
          opacity: 0.8,
          fillColor: color,
          fillOpacity: 0.18,
          dashArray: '6, 6',
        });

        polygon.bindTooltip(
          `<strong>${alert.title}</strong><br/>Water Level Surge: +${alert.waterLevelRiseMeters}m`,
          { sticky: true }
        );

        alertsGroup.addLayer(polygon);
      });
    }
  }, [alerts, showFloodZones]);

  // Render Bridge Markers with Risk Styling
  useEffect(() => {
    const markersGroup = markersLayerRef.current;
    if (!markersGroup || !mapInstanceRef.current) return;

    markersGroup.clearLayers();

    // If heat glow is active, render subtle heat radius circles behind markers
    if (showHeatGlow) {
      filteredBridges.forEach((bridge) => {
        const badge = getRiskLevelBadge(bridge.riskLevel);
        const radius = Math.max(300, bridge.riskScore * 18);
        const circle = L.circle([bridge.lat, bridge.lng], {
          radius: radius,
          color: badge.hex,
          fillColor: badge.hex,
          fillOpacity: bridge.riskScore > 50 ? 0.22 : 0.08,
          weight: 1,
          opacity: 0.4,
        });
        markersGroup.addLayer(circle);
      });
    }

    // Render User Location Pin
    if (userCoord) {
      const userIcon = L.divIcon({
        className: 'user-pin-icon',
        html: `
          <div class="relative flex items-center justify-center">
            <span class="animate-ping absolute h-8 w-8 rounded-full bg-sky-400 opacity-60"></span>
            <div class="h-4 w-4 rounded-full bg-sky-500 border-2 border-white shadow-lg flex items-center justify-center"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const userMarker = L.marker([userCoord.lat, userCoord.lng], { icon: userIcon });
      userMarker.bindTooltip('Your Reported Current Location', { direction: 'top' });
      markersGroup.addLayer(userMarker);
    }

    // Render Bridge Custom DivIcons
    filteredBridges.forEach((bridge) => {
      const badge = getRiskLevelBadge(bridge.riskLevel);
      const isSelected = selectedBridge?.id === bridge.id;

      // Color coding: green (0-25), yellow (26-50), orange (51-75), red (76-100)
      const pinHtml = `
        <div class="group relative cursor-pointer transition-transform hover:scale-110 ${
          isSelected ? 'scale-125 z-50' : ''
        }">
          ${
            bridge.riskScore >= 76
              ? `<span class="animate-ping absolute -inset-1 rounded-full bg-rose-500 opacity-70"></span>`
              : ''
          }
          <div class="relative flex items-center justify-center h-9 w-9 rounded-full shadow-xl border-2 ${
            isSelected ? 'border-white ring-4 ring-amber-400/50' : 'border-slate-900'
          }" style="background-color: ${badge.hex}">
            <span class="font-extrabold text-[12px] text-slate-950 font-mono tracking-tight">${bridge.riskScore}</span>
          </div>
          <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-950/90 text-white border border-slate-700 shadow-md">
            ${bridge.name.split(' ')[0]}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'bridge-marker-custom',
        html: pinHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([bridge.lat, bridge.lng], { icon: customIcon });

      marker.on('click', () => {
        onSelectBridge(bridge);
        mapInstanceRef.current?.flyTo([bridge.lat, bridge.lng], 13.5, { duration: 1 });
      });

      markersGroup.addLayer(marker);
    });
  }, [filteredBridges, selectedBridge, showHeatGlow, userCoord, onSelectBridge]);

  const handleCenterUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserCoord(coords);
          mapInstanceRef.current?.flyTo([coords.lat, coords.lng], 13, { duration: 1.2 });
        },
        () => {
          // Fallback to default river basin location
          mapInstanceRef.current?.flyTo([40.745, -73.965], 13, { duration: 1 });
        }
      );
    } else {
      mapInstanceRef.current?.flyTo([40.745, -73.965], 13, { duration: 1 });
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Filter and Layer Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        {/* Risk Level Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
            <SlidersHorizontal className="h-3.5 w-3.5 text-amber-400" /> Filter:
          </span>
          <button
            onClick={() => setFilterRisk('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filterRisk === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Bridges ({bridges.length})
          </button>
          <button
            onClick={() => setFilterRisk('critical')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 cursor-pointer ${
              filterRisk === 'critical'
                ? 'bg-rose-500 text-white font-bold'
                : 'bg-slate-800 text-rose-400 hover:bg-slate-700'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            Critical (76-100)
          </button>
          <button
            onClick={() => setFilterRisk('high')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 cursor-pointer ${
              filterRisk === 'high'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-amber-400 hover:bg-slate-700'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            High (51-75)
          </button>
          <button
            onClick={() => setFilterRisk('moderate')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 cursor-pointer ${
              filterRisk === 'moderate'
                ? 'bg-yellow-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-yellow-400 hover:bg-slate-700'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-yellow-500" />
            Moderate (26-50)
          </button>
          <button
            onClick={() => setFilterRisk('low')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 cursor-pointer ${
              filterRisk === 'low'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-emerald-400 hover:bg-slate-700'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Sound (0-25)
          </button>
        </div>

        {/* Layer Toggles & Action */}
        <div className="flex items-center gap-3 text-xs w-full md:w-auto justify-between md:justify-end">
          <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showFloodZones}
              onChange={(e) => setShowFloodZones(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-sky-500"
            />
            <span className="flex items-center gap-1">
              <Droplets className="h-3.5 w-3.5 text-sky-400" /> Flood Warning Zones
            </span>
          </label>

          <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showHeatGlow}
              onChange={(e) => setShowHeatGlow(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-amber-500"
            />
            <span className="flex items-center gap-1">
              <Layers className="h-3.5 w-3.5 text-amber-400" /> Heatmap Aura
            </span>
          </label>

          <button
            onClick={handleCenterUser}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1 font-medium transition-colors cursor-pointer"
            title="Recenter on coordinates"
          >
            <Navigation className="h-3.5 w-3.5 text-sky-400" />
            <span>My GPS</span>
          </button>
        </div>
      </div>

      {/* Map Container + Floating Drawer */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl h-[560px] sm:h-[620px] bg-slate-950">
        {/* Leaflet DOM Node */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Legend Overlay on Map */}
        <div className="absolute top-4 left-4 z-10 bg-slate-950/90 backdrop-blur-md border border-slate-800 p-3 rounded-2xl shadow-xl text-xs space-y-2 pointer-events-auto max-w-[200px] hidden sm:block">
          <div className="font-bold text-white text-[11px] tracking-wide uppercase">Risk Score Legend</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-300 text-[11px]">
              <span className="h-3 w-3 rounded-full bg-rose-500 flex-shrink-0 animate-pulse" />
              <span>76 - 100: Critical Risk</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 text-[11px]">
              <span className="h-3 w-3 rounded-full bg-amber-500 flex-shrink-0" />
              <span>51 - 75: High Risk</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 text-[11px]">
              <span className="h-3 w-3 rounded-full bg-yellow-500 flex-shrink-0" />
              <span>26 - 50: Moderate Risk</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 text-[11px]">
              <span className="h-3 w-3 rounded-full bg-emerald-500 flex-shrink-0" />
              <span>0 - 25: Low / Sound</span>
            </div>
          </div>
          <div className="pt-1.5 border-t border-slate-800 text-[10px] text-slate-400">
            Click any bridge to inspect diagnostics and citizen reports.
          </div>
        </div>

        {/* Selected Bridge Quick-Drawer Overlay */}
        {selectedBridge && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-20 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-5 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  {(() => {
                    const badge = getRiskLevelBadge(selectedBridge.riskLevel);
                    return (
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${badge.badgeBg} ${badge.textColor} border ${badge.borderColor}`}
                      >
                        <span className={`h-2 w-2 rounded-full ${badge.dotColor}`} />
                        Score: {selectedBridge.riskScore}/100 • {badge.label}
                      </span>
                    );
                  })()}
                  {selectedBridge.activeAlerts.length > 0 && (
                    <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                      Flood Alert Active
                    </span>
                  )}
                </div>
                <h3 className="font-extrabold text-base text-white mt-1.5">{selectedBridge.name}</h3>
                <p className="text-xs text-slate-400">
                  {selectedBridge.riverOrCrossing} • Built {selectedBridge.yearBuilt} ({selectedBridge.bridgeType})
                </p>
              </div>
              <button
                onClick={() => onSelectBridge(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Quick Algorithm Breakdown */}
            <div className="mt-3.5 bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Citizen Reports Score:</span>
                <span className="font-mono font-bold text-amber-400">
                  {selectedBridge.riskBreakdown.baseReportsScore} / 60
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Environmental Flood Scour:</span>
                <span className="font-mono font-bold text-sky-400">
                  {selectedBridge.riskBreakdown.environmentalScore} / 25
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Infrastructure Age & Traffic:</span>
                <span className="font-mono font-bold text-rose-400">
                  {selectedBridge.riskBreakdown.infrastructureScore} / 15
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => onOpenReport(selectedBridge.id)}
                className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Report Condition
              </button>
              <button
                onClick={() => onNavigateToRoute(selectedBridge)}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 border border-slate-700 transition-colors cursor-pointer"
              >
                <Navigation className="h-3.5 w-3.5 text-emerald-400" />
                <span>Avoid in Route</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
