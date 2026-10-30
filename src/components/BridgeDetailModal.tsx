import React from 'react';
import {
  X,
  MapPin,
  Calendar,
  AlertTriangle,
  Camera,
  ThumbsDown,
  ThumbsUp,
  ShieldCheck,
  TrendingUp,
  Navigation,
  Droplets,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Bridge, CitizenReport } from '../types';
import { getRiskLevelBadge } from '../utils/riskAlgorithm';

interface BridgeDetailModalProps {
  bridge: Bridge | null;
  onClose: () => void;
  reports: CitizenReport[];
  onOpenReport: (bridgeId: string) => void;
  onNavigateToRoute: (bridge: Bridge) => void;
}

export const BridgeDetailModal: React.FC<BridgeDetailModalProps> = ({
  bridge,
  onClose,
  reports,
  onOpenReport,
  onNavigateToRoute,
}) => {
  if (!bridge) return null;

  const badge = getRiskLevelBadge(bridge.riskLevel);
  const bridgeReports = reports.filter((r) => r.bridgeId === bridge.id);

  // Simulated 7-day time series risk trend
  const trendHistory = [
    { day: '6d ago', score: Math.max(10, bridge.riskScore - 28) },
    { day: '5d ago', score: Math.max(12, bridge.riskScore - 22) },
    { day: '4d ago', score: Math.max(15, bridge.riskScore - 18) },
    { day: '3d ago', score: Math.max(18, bridge.riskScore - 12) },
    { day: '2d ago', score: Math.max(22, bridge.riskScore - 8) },
    { day: 'Yesterday', score: Math.max(25, bridge.riskScore - 4) },
    { day: 'Today', score: bridge.riskScore },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl">
        {/* Header with Photo Background */}
        <div className="relative h-48 sm:h-56 bg-slate-950 overflow-hidden rounded-t-3xl">
          {bridge.photoUrls[0] ? (
            <img src={bridge.photoUrls[0]} alt={bridge.name} className="w-full h-full object-cover opacity-75" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-950 text-slate-700">
              <Layers className="h-12 w-12" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/80 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header Badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${badge.badgeBg} ${badge.textColor} border ${badge.borderColor} backdrop-blur-md`}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${badge.dotColor} animate-pulse`} />
              Score: {bridge.riskScore}/100 • {badge.label}
            </span>
            {bridge.activeAlerts.length > 0 && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-600 text-white shadow-md flex items-center gap-1">
                <Droplets className="h-3.5 w-3.5" /> Flood Alert
              </span>
            )}
          </div>

          {/* Title Info */}
          <div className="absolute bottom-4 left-6 right-6">
            <h2 className="text-xl sm:text-2xl font-black text-white">{bridge.name}</h2>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-amber-400" />
              {bridge.riverOrCrossing} • {bridge.district} (GPS: {bridge.lat.toFixed(4)}, {bridge.lng.toFixed(4)})
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Key Engineering Specifications */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Year Built</span>
              <span className="font-extrabold text-sm text-white">{bridge.yearBuilt}</span>
              <span className="text-[10px] text-slate-400 block">{2026 - bridge.yearBuilt} years old</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Bridge Type</span>
              <span className="font-extrabold text-sm text-white truncate">{bridge.bridgeType}</span>
              <span className="text-[10px] text-slate-400 block">{bridge.lengthMeters}m span</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Traffic Load</span>
              <span className="font-extrabold text-sm text-amber-400">{bridge.trafficVolume}</span>
              <span className="text-[10px] text-slate-400 block">Heavy Axles</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Health Index</span>
              <span className="font-extrabold text-sm text-sky-400">{bridge.structuralHealthIndex}/100</span>
              <span className="text-[10px] text-slate-400 block">Last: {bridge.lastInspected}</span>
            </div>
          </div>

          {/* Risk Algorithm Factor Breakdown */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                Risk Score Algorithmic Breakdown
              </span>
              <span className="text-amber-400 font-mono font-bold">Total: {bridge.riskScore}/100</span>
            </div>

            <div className="space-y-2.5">
              {/* Component 1: Citizen reports */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">
                    Citizen & Driver Down Reports (Ratio: {Math.round(bridge.downRatio * 100)}%)
                  </span>
                  <span className="text-amber-400 font-bold font-mono">
                    {bridge.riskBreakdown.baseReportsScore} / 60 max
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all"
                    style={{ width: `${(bridge.riskBreakdown.baseReportsScore / 60) * 100}%` }}
                  />
                </div>
              </div>

              {/* Component 2: Flood Scour */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Environmental Flood Surge & River Basin Warnings</span>
                  <span className="text-sky-400 font-bold font-mono">
                    {bridge.riskBreakdown.environmentalScore} / 25 max
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-sky-400 h-full rounded-full transition-all"
                    style={{ width: `${(bridge.riskBreakdown.environmentalScore / 25) * 100}%` }}
                  />
                </div>
              </div>

              {/* Component 3: Infrastructure Age & Traffic */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Infrastructure Age Factor + Traffic Volume</span>
                  <span className="text-rose-400 font-bold font-mono">
                    {bridge.riskBreakdown.infrastructureScore} / 15 max
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-400 h-full rounded-full transition-all"
                    style={{ width: `${(bridge.riskBreakdown.infrastructureScore / 15) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80">
              <span>Time decay factor: {bridge.riskBreakdown.timeDecayFactor}x</span>
              <span className="text-slate-500">Updated {bridge.lastRiskUpdatedAt}</span>
            </div>
          </div>

          {/* 7-Day Time Series Trend Bar Chart */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
            <span className="font-bold text-white uppercase tracking-wider text-[11px] block">
              7-Day Risk Score Evolution
            </span>
            <div className="flex items-end justify-between gap-2 h-24 pt-4">
              {trendHistory.map((item, idx) => {
                const heightPercent = Math.min(100, Math.max(10, item.score));
                const isCritical = item.score >= 76;
                const isHigh = item.score >= 51;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[10px] font-mono text-slate-400">{item.score}</span>
                    <div
                      className={`w-full rounded-t-md transition-all ${
                        isCritical ? 'bg-rose-500' : isHigh ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[9px] text-slate-500 truncate w-full text-center">{item.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Citizen Reports on this Bridge */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Recent Citizen Reports ({bridgeReports.length})</h3>
              <button
                onClick={() => {
                  onClose();
                  onOpenReport(bridge.id);
                }}
                className="text-xs text-amber-400 hover:underline font-semibold cursor-pointer"
              >
                + Add Report
              </button>
            </div>

            {bridgeReports.length === 0 ? (
              <p className="text-xs text-slate-500 bg-slate-950 p-4 rounded-xl text-center">
                No reports submitted for this crossing yet. Be the first to report!
              </p>
            ) : (
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {bridgeReports.map((r) => (
                  <div key={r.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {r.thumbs === 'down' ? (
                          <span className="text-rose-400 font-bold flex items-center gap-1">
                            <ThumbsDown className="h-3 w-3" /> Hazard
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" /> Sound
                          </span>
                        )}
                        {r.issueCategory && <span className="text-slate-400 text-[10px]">({r.issueCategory})</span>}
                      </div>
                      <span className="text-[10px] text-slate-500">{r.reportedAt}</span>
                    </div>
                    <p className="text-slate-300">"{r.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => {
                onClose();
                onOpenReport(bridge.id);
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              Report Condition
            </button>
            <button
              onClick={() => {
                onClose();
                onNavigateToRoute(bridge);
              }}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Navigation className="h-4 w-4 text-emerald-400" />
              <span>Plan Safe Route</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
