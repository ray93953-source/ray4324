import React, { useState } from 'react';
import {
  Building2,
  ShieldAlert,
  AlertTriangle,
  Download,
  Filter,
  Search,
  Camera,
  CheckCircle,
  Truck,
  Droplets,
  Calendar,
  Send,
  User,
  Clock,
  ArrowUpDown,
  ExternalLink,
} from 'lucide-react';
import { Bridge, CitizenReport, EnvironmentalAlert } from '../types';
import { getRiskLevelBadge } from '../utils/riskAlgorithm';

interface AuthorityCommandProps {
  bridges: Bridge[];
  reports: CitizenReport[];
  alerts: EnvironmentalAlert[];
  onSelectBridge: (bridge: Bridge) => void;
  onOpenReport: (bridgeId: string) => void;
}

export const AuthorityCommand: React.FC<AuthorityCommandProps> = ({
  bridges,
  reports,
  alerts,
  onSelectBridge,
  onOpenReport,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [selectedReportPhoto, setSelectedReportPhoto] = useState<CitizenReport | null>(null);
  const [dispatchModalBridge, setDispatchModalBridge] = useState<Bridge | null>(null);
  const [dispatchNotes, setDispatchNotes] = useState<string>('');
  const [dispatchedBridges, setDispatchedBridges] = useState<string[]>(['br-101']);

  // Summary counts
  const criticalCount = bridges.filter((b) => b.riskLevel === 'critical').length;
  const highCount = bridges.filter((b) => b.riskLevel === 'high').length;
  const moderateCount = bridges.filter((b) => b.riskLevel === 'moderate').length;
  const soundCount = bridges.filter((b) => b.riskLevel === 'low').length;
  const activeAlertsCount = alerts.filter((a) => a.isActive).length;

  // Filtered bridges
  const filteredBridges = bridges
    .filter((b) => {
      const matchesSearch =
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.riverOrCrossing.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (filterRisk === 'all') return true;
      if (filterRisk === 'critical') return b.riskLevel === 'critical';
      if (filterRisk === 'high') return b.riskLevel === 'high';
      if (filterRisk === 'urgent') return b.riskLevel === 'critical' || b.riskLevel === 'high';
      if (filterRisk === 'flood') return b.activeAlerts.length > 0;
      return true;
    })
    .sort((a, b) => b.riskScore - a.riskScore);

  // Photos from citizen reports
  const reportsWithPhotos = reports.filter((r) => r.hasPhoto && r.photoUrl);

  const handleDispatchTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchModalBridge) return;
    setDispatchedBridges((prev) => [...prev, dispatchModalBridge.id]);
    setDispatchModalBridge(null);
    setDispatchNotes('');
  };

  const handleExportCSV = () => {
    const headers = ['Bridge ID', 'Name', 'River Crossing', 'District', 'Risk Score', 'Risk Level', 'Year Built', 'Traffic Volume', 'Citizen Down Reports'];
    const rows = filteredBridges.map((b) => [
      b.id,
      `"${b.name}"`,
      `"${b.riverOrCrossing}"`,
      `"${b.district}"`,
      b.riskScore,
      b.riskLevel,
      b.yearBuilt,
      b.trafficVolume,
      b.downReportsCount,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BridgeRisk_Triage_Manifest_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-950/80 via-slate-900 to-slate-900 border border-rose-500/30 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
              <Building2 className="h-3.5 w-3.5" />
              <span>PWD & Disaster Management Authority Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Bridge Risk Triage & Inspection Dispatch
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Real-time situational awareness for municipal engineers: prioritize emergency inspections, review
              citizen photographic evidence, and dispatch structural teams.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-700 transition-colors cursor-pointer"
            >
              <Download className="h-4 w-4 text-amber-400" />
              <span>Export Triage Manifest (CSV)</span>
            </button>
          </div>
        </div>

        {/* High-Level Authority Stats Row */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-5 gap-3 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">Critical Risk (Immediate)</div>
            <div className="text-2xl font-black text-rose-400 mt-1">{criticalCount}</div>
            <div className="text-[10px] text-rose-500/80">Urgent inspection required</div>
          </div>
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">High Risk (Watchlist)</div>
            <div className="text-2xl font-black text-amber-400 mt-1">{highCount}</div>
            <div className="text-[10px] text-amber-400/80">Monitored daily</div>
          </div>
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">Moderate / Sound</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{moderateCount + soundCount}</div>
            <div className="text-[10px] text-emerald-400/80">Safe operating margin</div>
          </div>
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">Active River Flood Alerts</div>
            <div className="text-2xl font-black text-sky-400 mt-1">{activeAlertsCount}</div>
            <div className="text-[10px] text-sky-400/80">Level 4 surge in Delta</div>
          </div>
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">Crews Dispatched</div>
            <div className="text-2xl font-black text-purple-400 mt-1">{dispatchedBridges.length}</div>
            <div className="text-[10px] text-purple-400/80">Active in the field</div>
          </div>
        </div>
      </div>

      {/* Triage Search & Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search bridge, district, river..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs w-full md:w-auto">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <Filter className="h-3.5 w-3.5 text-amber-400" /> View:
          </span>
          <button
            onClick={() => setFilterRisk('all')}
            className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer ${
              filterRisk === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
            }`}
          >
            All ({bridges.length})
          </button>
          <button
            onClick={() => setFilterRisk('urgent')}
            className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer ${
              filterRisk === 'urgent' ? 'bg-rose-500 text-white font-bold' : 'bg-slate-800 text-rose-400'
            }`}
          >
            Urgent Triage ({criticalCount + highCount})
          </button>
          <button
            onClick={() => setFilterRisk('flood')}
            className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer ${
              filterRisk === 'flood' ? 'bg-sky-500 text-slate-950 font-bold' : 'bg-slate-800 text-sky-400'
            }`}
          >
            Under Flood Alert
          </button>
        </div>
      </div>

      {/* Main Bridges Triage Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-extrabold text-base text-white">Prioritized Infrastructure Manifest</h3>
          <span className="text-xs text-slate-400">Sorted dynamically by Risk Score Algorithm</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Bridge Details</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4">Algorithm Breakdown</th>
                <th className="py-3 px-4">Age / Traffic</th>
                <th className="py-3 px-4">Citizen Feedback</th>
                <th className="py-3 px-4">Status & Dispatch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredBridges.map((bridge) => {
                const badge = getRiskLevelBadge(bridge.riskLevel);
                const isDispatched = dispatchedBridges.includes(bridge.id);
                return (
                  <tr key={bridge.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Bridge Details */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm">{bridge.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {bridge.riverOrCrossing} • {bridge.district}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {bridge.bridgeType} • {bridge.lengthMeters}m
                      </div>
                    </td>

                    {/* Risk Score */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-extrabold text-xs ${badge.badgeBg} ${badge.textColor} border ${badge.borderColor}`}
                        >
                          <span className={`h-2 w-2 rounded-full ${badge.dotColor}`} />
                          {bridge.riskScore}/100
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">{badge.label}</span>
                    </td>

                    {/* Algorithm Breakdown */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="space-y-1 text-[10px]">
                        <div className="flex items-center gap-1 text-slate-300">
                          <span className="text-amber-400 font-bold">
                            {bridge.riskBreakdown.baseReportsScore}pt
                          </span>{' '}
                          Citizen Reports
                        </div>
                        <div className="flex items-center gap-1 text-slate-300">
                          <span className="text-sky-400 font-bold">
                            {bridge.riskBreakdown.environmentalScore}pt
                          </span>{' '}
                          Flood Surge
                        </div>
                        <div className="flex items-center gap-1 text-slate-300">
                          <span className="text-rose-400 font-bold">
                            {bridge.riskBreakdown.infrastructureScore}pt
                          </span>{' '}
                          Age/Traffic
                        </div>
                      </div>
                    </td>

                    {/* Age / Traffic */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="text-slate-200 font-medium">Built {bridge.yearBuilt}</div>
                      <div className="text-[11px] text-slate-400">{2026 - bridge.yearBuilt} yrs in service</div>
                      <div className="text-[10px] text-amber-400/90 font-medium">Traffic: {bridge.trafficVolume}</div>
                    </td>

                    {/* Citizen Feedback */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-rose-400">
                        {bridge.downReportsCount} Down / {bridge.reportsCount} Total
                      </div>
                      <div className="text-[10px] text-slate-400">{Math.round(bridge.downRatio * 100)}% Negative</div>
                      {bridge.photoUrls.length > 0 && (
                        <button
                          onClick={() => onSelectBridge(bridge)}
                          className="mt-1 text-[10px] text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Camera className="h-3 w-3" /> {bridge.photoUrls.length} Photo Evidence
                        </button>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {isDispatched ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            <CheckCircle className="h-3.5 w-3.5" /> Team Dispatched
                          </span>
                        ) : (
                          <button
                            onClick={() => setDispatchModalBridge(bridge)}
                            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow transition-colors cursor-pointer"
                          >
                            Dispatch Crew
                          </button>
                        )}
                        <button
                          onClick={() => onSelectBridge(bridge)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                          title="View Full Profile"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Citizen Photographic Evidence Gallery */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <Camera className="h-4 w-4 text-amber-400" />
              Citizen Photographic Evidence Gallery
            </h3>
            <p className="text-xs text-slate-400">
              Verified photos uploaded by road users and transit pilots during flood conditions
            </p>
          </div>
          <span className="text-xs text-slate-400">{reportsWithPhotos.length} Photos on file</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {reportsWithPhotos.map((rep) => (
            <div
              key={rep.id}
              onClick={() => setSelectedReportPhoto(rep)}
              className="group relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 hover:border-slate-600 cursor-pointer transition-all"
            >
              <div className="h-40 overflow-hidden">
                <img
                  src={rep.photoUrl}
                  alt={rep.bridgeName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3 bg-slate-950/90 border-t border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-rose-400 uppercase">{rep.issueCategory}</span>
                  <span className="text-slate-500">{rep.reportedAt}</span>
                </div>
                <h4 className="font-bold text-xs text-white truncate">{rep.bridgeName}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-1">"{rep.comment}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dispatch Team Modal */}
      {dispatchModalBridge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-rose-400">
                <ShieldAlert className="h-5 w-5" />
                <h3 className="font-bold text-base text-white">Emergency Inspection Order</h3>
              </div>
              <button
                onClick={() => setDispatchModalBridge(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <div className="text-xs text-slate-400">Bridge Target:</div>
              <div className="text-sm font-extrabold text-white">{dispatchModalBridge.name}</div>
              <div className="text-xs text-rose-400 font-semibold mt-0.5">
                Current Risk: {dispatchModalBridge.riskScore}/100 • Critical Structural Concern
              </div>
            </div>

            <form onSubmit={handleDispatchTeam} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Assign Municipal Unit & Priority
                </label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
                  <option>Rapid Response Unit #3 (Pier Scour & Diver Team)</option>
                  <option>PWD Structural Health Engineering Unit #1</option>
                  <option>District Disaster Taskforce Mobile Crew</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Engineering Instructions / Focus Area
                </label>
                <textarea
                  value={dispatchNotes}
                  onChange={(e) => setDispatchNotes(e.target.value)}
                  placeholder="E.g., Verify Pier 3 footings fracture, evaluate river current depth and water debris load..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDispatchModalBridge(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Confirm Dispatch</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
