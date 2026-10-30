import React, { useState } from 'react';
import {
  Navigation,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Truck,
  MapPin,
  Clock,
  Compass,
  CheckCircle2,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Bridge, RouteOption } from '../types';
import { SAMPLE_ROUTES } from '../data/mockData';
import { getRiskLevelBadge } from '../utils/riskAlgorithm';

interface RoutePlannerProps {
  bridges: Bridge[];
  onSelectBridge: (bridge: Bridge) => void;
  onOpenReport: (bridgeId: string) => void;
}

export const RoutePlanner: React.FC<RoutePlannerProps> = ({ bridges, onSelectBridge, onOpenReport }) => {
  const [origin, setOrigin] = useState<string>('North Freight Logistics Terminal (Harbor Access)');
  const [destination, setDestination] = useState<string>('South Delta Intermodal Rail & Sea Depot');
  const [avoidHighRisk, setAvoidHighRisk] = useState<boolean>(true);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('rt-safe');

  const safeRoute = SAMPLE_ROUTES.find((r) => r.id === 'rt-safe') || SAMPLE_ROUTES[0];
  const riskyRoute = SAMPLE_ROUTES.find((r) => r.id === 'rt-risky') || SAMPLE_ROUTES[1];

  const currentRoute = avoidHighRisk ? safeRoute : riskyRoute;

  const handleToggleAvoidRisk = (checked: boolean) => {
    setAvoidHighRisk(checked);
    setSelectedRouteId(checked ? 'rt-safe' : 'rt-risky');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Truck className="h-3.5 w-3.5" />
              <span>Commercial & Logistics Transit Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Bridge-Risk Aware Route Planner
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Calculates freight and commuter transit routes while penalizing high-risk bridge crossings and flood-scour
              zones to safeguard heavy vehicles.
            </p>
          </div>

          {/* Avoid High Risk Toggle Switch */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Avoid High-Risk Bridges</span>
              </div>
              <p className="text-[11px] text-slate-400">Penalize crossings with score &gt; 50</p>
            </div>
            <button
              onClick={() => handleToggleAvoidRisk(!avoidHighRisk)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                avoidHighRisk ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  avoidHighRisk ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Route Config & Comparison Cards */}
        <div className="space-y-4">
          {/* Origin & Destination Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Compass className="h-4 w-4 text-amber-400" /> Journey Waypoints
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Origin Departure Hub
                </label>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
                  <MapPin className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="bg-transparent border-0 focus:outline-none w-full text-xs text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Destination Terminal
                </label>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
                  <MapPin className="h-4 w-4 text-rose-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="bg-transparent border-0 focus:outline-none w-full text-xs text-slate-200"
                  />
                </div>
              </div>
            </div>

            {/* Preset Transit Presets */}
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[10px] text-slate-500 font-medium block mb-1.5">Common Corridor Presets:</span>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setOrigin('North Freight Logistics Terminal (Harbor Access)');
                    setDestination('South Delta Intermodal Rail & Sea Depot');
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-[11px] text-slate-300 truncate cursor-pointer"
                >
                  North Freight Hub ➔ South Delta Depot
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOrigin('Western Industrial Park Pier 12');
                    setDestination('Downtown Distribution Center');
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-[11px] text-slate-300 truncate cursor-pointer"
                >
                  Western Industrial Pier ➔ Downtown Center
                </button>
              </div>
            </div>
          </div>

          {/* Route Candidate Comparison Selector */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-white">Calculated Route Options</h3>

            {/* Option 1: Safe Route */}
            <div
              onClick={() => {
                setSelectedRouteId('rt-safe');
                setAvoidHighRisk(true);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedRouteId === 'rt-safe'
                  ? 'bg-emerald-950/40 border-emerald-500/80 ring-2 ring-emerald-500/20'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500 text-slate-950">
                  RECOMMENDED • SAFEST
                </span>
                <span className="text-xs font-bold text-emerald-400">Max Risk: 18/100</span>
              </div>
              <h4 className="font-bold text-sm text-white">{safeRoute.name}</h4>
              <div className="mt-2 flex items-center gap-4 text-xs text-slate-300">
                <span className="flex items-center gap-1">
                  <Navigation className="h-3.5 w-3.5 text-slate-400" /> {safeRoute.distanceKm} km
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-slate-400" /> {safeRoute.durationMins} mins
                </span>
                <span className="text-emerald-400 font-semibold">0 High-Risk Bridges</span>
              </div>
            </div>

            {/* Option 2: Risky Direct Route */}
            <div
              onClick={() => {
                setSelectedRouteId('rt-risky');
                setAvoidHighRisk(false);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedRouteId === 'rt-risky'
                  ? 'bg-rose-950/40 border-rose-500/80 ring-2 ring-rose-500/20'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-500 text-white">
                  FASTEST (HIGH RISK)
                </span>
                <span className="text-xs font-bold text-rose-400">Max Risk: 84/100</span>
              </div>
              <h4 className="font-bold text-sm text-white">{riskyRoute.name}</h4>
              <div className="mt-2 flex items-center gap-4 text-xs text-slate-300">
                <span className="flex items-center gap-1">
                  <Navigation className="h-3.5 w-3.5 text-slate-400" /> {riskyRoute.distanceKm} km
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-slate-400" /> {riskyRoute.durationMins} mins
                </span>
                <span className="text-rose-400 font-semibold">2 Critical Bridges!</span>
              </div>
              {riskyRoute.warning && (
                <div className="mt-2.5 p-2 bg-rose-500/10 border border-rose-500/30 rounded-lg text-[11px] text-rose-300 flex items-start gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                  <span>{riskyRoute.warning}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Route Details & Bridges Encountered Checkpoints */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                  <span>Corridor Bridge Checkpoints</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      avoidHighRisk
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {avoidHighRisk ? 'Zero Critical Crossings' : 'High Risk Warning'}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Every bridge crossed on this route evaluated by the live Risk Score Algorithm
                </p>
              </div>

              <div className="text-right text-xs">
                <span className="text-slate-400">Total Route Span: </span>
                <span className="font-bold text-white">{currentRoute.distanceKm} km</span>
              </div>
            </div>

            {/* Checkpoints Sequence */}
            <div className="space-y-4">
              {currentRoute.bridgesOnRoute.map((item, index) => {
                const b = item.bridge;
                const badge = getRiskLevelBadge(b.riskLevel);
                return (
                  <div
                    key={b.id}
                    className="relative bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                  >
                    {/* Index & Bridge Info */}
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-white">{b.name}</h4>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${badge.badgeBg} ${badge.textColor} border ${badge.borderColor}`}
                          >
                            Score: {b.riskScore}/100
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {b.riverOrCrossing} • Built {b.yearBuilt} • {b.bridgeType} • Traffic: {b.trafficVolume}
                        </p>
                      </div>
                    </div>

                    {/* Risk Tag & Actions */}
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                      {b.riskScore > 50 ? (
                        <div className="text-right">
                          <span className="text-[11px] text-rose-400 font-bold block">
                            ⚠️ DANGER: Flood Scour / Cracking
                          </span>
                          <span className="text-[10px] text-slate-400">{b.downReportsCount} citizen complaints</span>
                        </div>
                      ) : (
                        <div className="text-right">
                          <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Safe Clearance
                          </span>
                          <span className="text-[10px] text-slate-400">Regular inspection sound</span>
                        </div>
                      )}

                      <button
                        onClick={() => onSelectBridge(b)}
                        className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl font-medium transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Divert Safety Advisory */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-start gap-3">
              <Info className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <span className="font-bold text-white">Logistics Safety Recommendation</span>
                <p className="text-slate-400 leading-relaxed">
                  During peak monsoon and river surge alerts, the +5 minute detour via{' '}
                  <span className="text-amber-400 font-semibold">East River Cable-Stayed Crossing</span> reduces
                  catastrophic structural collapse exposure by 82% compared to the 1958 Old Industrial Viaduct corridor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
