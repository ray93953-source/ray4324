import React from 'react';
import {
  Radio,
  Droplets,
  AlertTriangle,
  Calendar,
  Layers,
  MapPin,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Info,
} from 'lucide-react';
import { Bridge, EnvironmentalAlert } from '../types';

interface AlertsFeedProps {
  alerts: EnvironmentalAlert[];
  bridges: Bridge[];
  onSelectBridge: (bridge: Bridge) => void;
  onNavigateToMap: () => void;
  onToggleSurgeSimulation: () => void;
  isSurgeSimulated: boolean;
}

export const AlertsFeed: React.FC<AlertsFeedProps> = ({
  alerts,
  bridges,
  onSelectBridge,
  onNavigateToMap,
  onToggleSurgeSimulation,
  isSurgeSimulated,
}) => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-950/80 via-slate-900 to-slate-900 border border-sky-500/30 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
              <Radio className="h-3.5 w-3.5" />
              <span>Real-time Hydrological & Meteorological Telemetry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Environmental Flood Alerts & River Basin Watch
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Automated ingestion from river water level sensors (CWC) and national weather precipitation radars (IMD).
              Spatial intersection automatically drives bridge vulnerability scoring.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSurgeSimulation}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer ${
                isSurgeSimulated
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30'
                  : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sky-500/30'
              }`}
            >
              <RefreshCw className="h-4 w-4" />
              <span>{isSurgeSimulated ? 'Surge Active (Simulated)' : 'Simulate Monsoon Flash Surge'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {alerts.map((alert) => {
          const affectedBridges = bridges.filter((b) => alert.affectedBridgeIds.includes(b.id));

          return (
            <div
              key={alert.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${
                      alert.severity >= 4
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                    Severity Level {alert.severity} / 5 ({alert.alertType})
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{alert.source}</span>
                </div>

                <div>
                  <h3 className="font-extrabold text-lg text-white">{alert.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-sky-400" />
                    {alert.riverBasin} • {alert.affectedRegion}
                  </p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80">
                  {alert.description}
                </p>

                {/* Hydro Telemetry Stats */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">Water Level Surge</span>
                    <span className="font-extrabold text-sky-400 text-sm">+{alert.waterLevelRiseMeters} meters</span>
                    <span className="text-[10px] text-slate-500 block">Above danger datum</span>
                  </div>
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">Alert Validity Window</span>
                    <span className="font-extrabold text-slate-200 text-xs">48h Active Window</span>
                    <span className="text-[10px] text-slate-500 block">Expires: 2026-10-31</span>
                  </div>
                </div>

                {/* Affected Bridges List */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 block">
                    Intersecting Threatened Bridges ({affectedBridges.length}):
                  </span>
                  <div className="space-y-1.5">
                    {affectedBridges.map((b) => (
                      <div
                        key={b.id}
                        onClick={() => onSelectBridge(b)}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800/80 cursor-pointer transition-colors"
                      >
                        <span className="text-xs text-white font-medium truncate">{b.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-rose-400">Risk: {b.riskScore}/100</span>
                          <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Algorithmic risk weight: +25%</span>
                <button
                  onClick={onNavigateToMap}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Layers className="h-3.5 w-3.5 text-sky-400" />
                  <span>View Flood Polygon on Map</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
