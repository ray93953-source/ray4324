import React from 'react';
import {
  ShieldAlert,
  MapPin,
  Navigation,
  FileText,
  Radio,
  Camera,
  AlertTriangle,
  CheckCircle2,
  ThumbsDown,
  ThumbsUp,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  Sliders,
  Droplets,
  ChevronRight,
  Activity,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';
import { Bridge, CitizenReport, EnvironmentalAlert, UserPersonalMetrics } from '../types';
import { getRiskLevelBadge } from '../utils/riskAlgorithm';
import { useLanguage } from '../i18n/LanguageContext';

interface DashboardMainProps {
  bridges: Bridge[];
  reports: CitizenReport[];
  alerts: EnvironmentalAlert[];
  userMetrics: UserPersonalMetrics;
  activeRole: 'citizen' | 'driver' | 'authority';
  onNavigate: (tab: 'dashboard' | 'map' | 'routes' | 'authority' | 'alerts') => void;
  onOpenReport: (bridgeId?: string) => void;
  onSelectBridge: (bridge: Bridge) => void;
  onTriggerSurgeSimulation: () => void;
  isSurgeSimulated: boolean;
}

export const DashboardMain: React.FC<DashboardMainProps> = ({
  bridges,
  reports,
  alerts,
  userMetrics,
  activeRole,
  onNavigate,
  onOpenReport,
  onSelectBridge,
  onTriggerSurgeSimulation,
  isSurgeSimulated,
}) => {
  const { t } = useLanguage();

  // Aggregate stats
  const criticalBridges = bridges.filter((b) => b.riskLevel === 'critical');
  const activeAlerts = alerts.filter((a) => a.isActive);

  // Top 3 hotspot bridges requiring immediate attention
  const sortedByRisk = [...bridges].sort((a, b) => b.riskScore - a.riskScore);
  const urgentHotspots = sortedByRisk.slice(0, 3);

  // Calculate progress towards next badge tier
  const nextTierPoints = 1000;
  const progressPercent = Math.min(100, Math.round((userMetrics.points / nextTierPoints) * 100));

  return (
    <div className="space-y-8 pb-16">
      {/* SECTION 1: PERSONALIZED WELCOME & PROGRESS METRICS */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-72 h-72 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Greeting & Role Info */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <Award className="h-3.5 w-3.5" />
              <span>{userMetrics.reputationLevel}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t('welcomeBack')}, <span className="text-amber-400">{userMetrics.name}</span>
            </h1>
            <p className="text-sm text-slate-400 max-w-xl">
              {activeRole === 'citizen' && t('citizenDesc')}
              {activeRole === 'driver' && t('driverDesc')}
              {activeRole === 'authority' && t('authorityDesc')}
            </p>
          </div>

          {/* Quick interactive surge demo toggle */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl">
            <div className="flex items-center gap-2.5">
              <div
                className={`p-2 rounded-xl ${
                  isSurgeSimulated ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Droplets className="h-5 w-5" />
              </div>
              <div className="text-left text-xs">
                <div className="font-semibold text-slate-200">{t('simulateSurge')}</div>
                <div className="text-slate-400 text-[11px]">
                  {isSurgeSimulated ? t('surgeActive') : t('surgeNormal')}
                </div>
              </div>
            </div>
            <button
              onClick={onTriggerSurgeSimulation}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isSurgeSimulated
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-400'
              }`}
            >
              {isSurgeSimulated ? t('resetBaseline') : t('triggerSurge')}
            </button>
          </div>
        </div>

        {/* Personalized Progress Tracker Banner */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs mb-2 gap-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-200">{t('safetyTierProgress')}</span>
              <span className="text-amber-400 font-bold">{userMetrics.points} / {nextTierPoints} {t('safetyPoints')}</span>
            </div>
            <div className="text-slate-400">
              {nextTierPoints - userMetrics.points > 0
                ? `${nextTierPoints - userMetrics.points} ${t('ptsToNextRank')}`
                : t('maxSentinelTier')}
            </div>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-amber-500 via-rose-500 to-emerald-400 h-full rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Personalized Metrics Grid */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1 */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 transition-transform hover:-translate-y-0.5">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-medium">
                {activeRole === 'authority' ? t('monitoredBridges') : t('reportsSubmitted')}
              </span>
              <FileText className="h-4 w-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white">
              {activeRole === 'authority' ? bridges.length : userMetrics.reportsSubmitted}
            </div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>
                {activeRole === 'authority'
                  ? t('telemetrySynced')
                  : `+${Math.floor(userMetrics.reportsSubmitted * 0.3)} ${t('thisWeek')}`}
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 transition-transform hover:-translate-y-0.5">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-medium">
                {activeRole === 'authority' ? t('criticalTriageQueue') : t('verifiedHazards')}
              </span>
              <AlertTriangle className="h-4 w-4 text-rose-400" />
            </div>
            <div className="text-2xl font-black text-rose-400">
              {activeRole === 'authority' ? criticalBridges.length : userMetrics.hazardsFlagged}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {activeRole === 'authority'
                ? t('requiresPriorityInspection')
                : `${userMetrics.verifiedCount} ${t('verifiedByEngineers')}`}
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 transition-transform hover:-translate-y-0.5">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-medium">
                {activeRole === 'driver'
                  ? t('riskyBridgesAverted')
                  : activeRole === 'authority'
                  ? t('inspectionDispatches')
                  : t('safeTripsLogged')}
              </span>
              <ShieldAlert className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400">
              {activeRole === 'driver'
                ? userMetrics.riskyBridgesAverted
                : activeRole === 'authority'
                ? userMetrics.inspectionsTriggered
                : userMetrics.safeTripsLogged}
            </div>
            <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              <span>
                {activeRole === 'driver'
                  ? t('zeroIncidents')
                  : activeRole === 'authority'
                  ? t('rapidFieldTeam')
                  : t('saferCrossingsChosen')}
              </span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 transition-transform hover:-translate-y-0.5">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-medium">
                {activeRole === 'driver'
                  ? t('safeRoutesOptimized')
                  : activeRole === 'authority'
                  ? t('activeFloodAlerts')
                  : t('communityReputation')}
              </span>
              <Zap className="h-4 w-4 text-sky-400" />
            </div>
            <div className="text-2xl font-black text-sky-400">
              {activeRole === 'driver'
                ? userMetrics.routesPlanned
                : activeRole === 'authority'
                ? activeAlerts.length
                : `${userMetrics.points} pts`}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {activeRole === 'authority' ? t('level4SurgeDelta') : t('topDistrictContributor')}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: QUICK-ACCESS NAVIGATION BUTTONS (PROMINENT TACTILE ACTIONS) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">{t('quickOperations')}</h2>
            <p className="text-xs text-slate-400">{t('quickOperationsSub')}</p>
          </div>
          <span className="text-xs font-semibold text-amber-400">{t('sixCoreTools')}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Quick Button 1: Report Condition */}
          <button
            onClick={() => onOpenReport()}
            className="group text-left p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/30 hover:border-amber-500 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="h-12 w-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Camera className="h-6 w-6" />
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950">
                {t('oneTapBadge')}
              </span>
            </div>
            <h3 className="mt-4 text-base font-bold text-white group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
              <span>{t('reportBridgeCardTitle')}</span>
              <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </h3>
            <p className="mt-1 text-xs text-slate-400 line-clamp-2">
              {t('reportBridgeCardSub')}
            </p>
          </button>

          {/* Quick Button 2: Interactive Risk Heatmap */}
          <button
            onClick={() => onNavigate('map')}
            className="group text-left p-5 rounded-2xl bg-gradient-to-br from-sky-500/10 via-slate-900 to-slate-950 border border-sky-500/30 hover:border-sky-500 transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/10 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="h-12 w-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="h-6 w-6" />
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                {t('gisBadge')}
              </span>
            </div>
            <h3 className="mt-4 text-base font-bold text-white group-hover:text-sky-400 transition-colors flex items-center gap-1.5">
              <span>{t('heatmapCardTitle')}</span>
              <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </h3>
            <p className="mt-1 text-xs text-slate-400 line-clamp-2">
              {t('heatmapCardSub')}
            </p>
          </button>

          {/* Quick Button 3: Safe Route Planner */}
          <button
            onClick={() => onNavigate('routes')}
            className="group text-left p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-950 border border-emerald-500/30 hover:border-emerald-500 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Navigation className="h-6 w-6" />
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {t('safeBadge')}
              </span>
            </div>
            <h3 className="mt-4 text-base font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
              <span>{t('routesCardTitle')}</span>
              <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </h3>
            <p className="mt-1 text-xs text-slate-400 line-clamp-2">
              {t('routesCardSub')}
            </p>
          </button>

          {/* Quick Button 4: Authority Triage Dashboard */}
          <button
            onClick={() => onNavigate('authority')}
            className="group text-left p-5 rounded-2xl bg-gradient-to-br from-rose-500/10 via-slate-900 to-slate-950 border border-rose-500/30 hover:border-rose-500 transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/10 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="h-12 w-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500 text-white">
                {criticalBridges.length} {t('urgentBadge')}
              </span>
            </div>
            <h3 className="mt-4 text-base font-bold text-white group-hover:text-rose-400 transition-colors flex items-center gap-1.5">
              <span>{t('authorityCardTitle')}</span>
              <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </h3>
            <p className="mt-1 text-xs text-slate-400 line-clamp-2">
              {t('authorityCardSub')}
            </p>
          </button>

          {/* Quick Button 5: Live Environmental Alerts */}
          <button
            onClick={() => onNavigate('alerts')}
            className="group text-left p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-slate-900 to-slate-950 border border-indigo-500/30 hover:border-indigo-500 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="h-12 w-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Radio className="h-6 w-6" />
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {t('hydroBadge')}
              </span>
            </div>
            <h3 className="mt-4 text-base font-bold text-white group-hover:text-indigo-400 transition-colors flex items-center gap-1.5">
              <span>{t('alertsCardTitle')}</span>
              <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </h3>
            <p className="mt-1 text-xs text-slate-400 line-clamp-2">
              {t('alertsCardSub')}
            </p>
          </button>

          {/* Quick Button 6: Risk Algorithm Breakdown */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-300 flex items-center gap-1">
                  <Sliders className="h-3.5 w-3.5 text-amber-400" />
                  {t('formulaWeightsTitle')}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">{t('normalizedBadge')}</span>
              </div>
              <div className="mt-3 space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-300">{t('citizenReportsWeight')}</span>
                    <span className="text-amber-400 font-bold">60%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-300">{t('floodSurgeWeight')}</span>
                    <span className="text-sky-400 font-bold">25%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-sky-400 h-full rounded-full" style={{ width: '25%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-300">{t('infraAgeWeight')}</span>
                    <span className="text-rose-400 font-bold">15%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-rose-400 h-full rounded-full" style={{ width: '15%' }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span>{t('timeDecayApplied')}</span>
              <button
                onClick={() => onNavigate('authority')}
                className="text-amber-400 hover:underline font-medium cursor-pointer"
              >
                {t('inspectData')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: URGENT HOTSPOTS CAROUSEL */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>{t('highRiskHotspots')}</span>
              <span className="px-2 py-0.5 rounded text-[11px] bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold">
                {t('urgentActionBadge')}
              </span>
            </h2>
            <p className="text-xs text-slate-400">{t('hotspotsSub')}</p>
          </div>
          <button
            onClick={() => onNavigate('map')}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>{t('viewAllOnMap')}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {urgentHotspots.map((bridge) => {
            const badge = getRiskLevelBadge(bridge.riskLevel);
            return (
              <div
                key={bridge.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between hover:border-slate-700 transition-all"
              >
                {/* Photo Header */}
                <div className="relative h-36 bg-slate-950 overflow-hidden">
                  {bridge.photoUrls[0] ? (
                    <img
                      src={bridge.photoUrls[0]}
                      alt={bridge.name}
                      className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-950 text-slate-600">
                      <ShieldAlert className="h-8 w-8" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Risk Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${badge.badgeBg} ${badge.textColor} ${badge.borderColor}`}
                    >
                      <span className={`h-2 w-2 rounded-full ${badge.dotColor} animate-pulse`} />
                      {t('score')}: {bridge.riskScore}/100
                    </span>
                  </div>

                  {/* Active Alert Flag */}
                  {bridge.activeAlerts.length > 0 && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-rose-600 text-white shadow-md flex items-center gap-1">
                        <Droplets className="h-3 w-3" />
                        {t('floodAlert')}
                      </span>
                    </div>
                  )}

                  {/* Name overlay */}
                  <div className="absolute bottom-2 left-3 right-3">
                    <h3 className="font-bold text-sm text-white truncate">{bridge.name}</h3>
                    <p className="text-[11px] text-slate-300 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-amber-400" />
                      {bridge.riverOrCrossing} • {bridge.district}
                    </p>
                  </div>
                </div>

                {/* Content details */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 bg-slate-950/50 rounded-xl border border-slate-800/80">
                    <div>
                      <div className="text-[10px] text-slate-400">{t('yearBuilt')}</div>
                      <div className="font-bold text-slate-200">{bridge.yearBuilt}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">{t('type')}</div>
                      <div className="font-bold text-slate-200 truncate">{bridge.bridgeType.split(' ')[0]}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">{t('reports')}</div>
                      <div className="font-bold text-rose-400">
                        {bridge.downReportsCount} 👎 / {bridge.reportsCount}
                      </div>
                    </div>
                  </div>

                  {/* Risk factor mini-breakdown */}
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between text-slate-400">
                      <span>{t('concernRatio')}</span>
                      <span className="font-semibold text-rose-400">{Math.round(bridge.downRatio * 100)}%</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>{t('healthIndex')}</span>
                      <span className="font-semibold text-slate-200">{bridge.structuralHealthIndex}/100</span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => onSelectBridge(bridge)}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
                    >
                      {t('viewDiagnostics')}
                    </button>
                    <button
                      onClick={() => onOpenReport(bridge.id)}
                      className="py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-slate-950 text-xs font-semibold border border-amber-500/30 transition-all cursor-pointer"
                    >
                      {t('report')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 4: LIVE CITIZEN ACTIVITY FEED & RECENT HAZARD DISCLOSURES */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Real-time Reports Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Activity className="h-4 w-4 text-amber-400" />
                {t('liveFeedTitle')}
              </h2>
              <p className="text-xs text-slate-400">{t('liveFeedSub')}</p>
            </div>
            <button
              onClick={() => onOpenReport()}
              className="text-xs text-amber-400 hover:underline font-semibold cursor-pointer"
            >
              {t('submitObservation')}
            </button>
          </div>

          <div className="space-y-3">
            {reports.slice(0, 4).map((report) => (
              <div
                key={report.id}
                className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-start hover:border-slate-700 transition-colors"
              >
                {/* Photo thumbnail if present */}
                {report.photoUrl ? (
                  <div className="h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden bg-slate-950 border border-slate-700/60">
                    <img
                      src={report.photoUrl}
                      alt="Hazard evidence"
                      className="h-full w-full object-cover hover:scale-110 transition-transform cursor-pointer"
                    />
                  </div>
                ) : (
                  <div className="h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                    {report.thumbs === 'down' ? (
                      <ThumbsDown className="h-6 w-6 text-rose-400" />
                    ) : (
                      <ThumbsUp className="h-6 w-6 text-emerald-400" />
                    )}
                  </div>
                )}

                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          report.thumbs === 'down'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {report.thumbs === 'down' ? (
                          <>
                            <ThumbsDown className="h-3 w-3" /> {t('hazardReported')}
                          </>
                        ) : (
                          <>
                            <ThumbsUp className="h-3 w-3" /> {t('clearAndSound')}
                          </>
                        )}
                      </span>
                      {report.issueCategory && (
                        <span className="text-[11px] font-medium text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                          {report.issueCategory}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {report.reportedAt}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-white truncate">{report.bridgeName}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">"{report.comment}"</p>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                    <span>
                      {t('reportedBy')} <span className="text-slate-200">{report.reporterName || report.reporterRole}</span>
                    </span>
                    <span
                      className={`font-semibold ${
                        report.status === 'Inspection Dispatched'
                          ? 'text-rose-400'
                          : report.status === 'Verified'
                          ? 'text-emerald-400'
                          : 'text-amber-400'
                      }`}
                    >
                      ● {report.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Environmental Alert Bulletin & Safety Checklist */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Droplets className="h-4 w-4 text-sky-400" />
              {t('hydroWatchTitle')}
            </h2>
            <p className="text-xs text-slate-400">{t('hydroWatchSub')}</p>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="border-b border-slate-800 last:border-0 pb-4 last:pb-0 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-rose-400 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                    Severity Level {alert.severity}/5
                  </span>
                  <span className="text-slate-400 text-[10px]">{alert.source}</span>
                </div>
                <h4 className="font-bold text-sm text-white leading-snug">{alert.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{alert.description}</p>
                <div className="flex items-center justify-between text-[11px] bg-slate-950 p-2 rounded-lg text-slate-400">
                  <span>{t('waterSurge')} +{alert.waterLevelRiseMeters}m</span>
                  <span className="text-amber-400 font-medium">{alert.affectedBridgeIds.length} {t('bridgesThreatened')}</span>
                </div>
              </div>
            ))}

            {/* Quick Driver Guidance Box */}
            <div className="mt-4 pt-4 border-t border-slate-800/80 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
                <Info className="h-3.5 w-3.5" />
                <span>{t('driverProtocolTitle')}</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-normal">
                {t('driverProtocolText')}
              </p>
              <button
                onClick={() => onNavigate('routes')}
                className="mt-2.5 w-full py-1.5 text-center rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                {t('launchRoutePlanner')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
