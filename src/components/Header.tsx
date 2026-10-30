import React from 'react';
import {
  ShieldAlert,
  MapPin,
  Navigation,
  FileText,
  Radio,
  SlidersHorizontal,
  Award,
  AlertTriangle,
  UserCheck,
  Truck,
  Building2,
} from 'lucide-react';
import { UserPersonalMetrics } from '../types';

interface HeaderProps {
  currentTab: 'dashboard' | 'map' | 'routes' | 'authority' | 'alerts';
  setCurrentTab: (tab: 'dashboard' | 'map' | 'routes' | 'authority' | 'alerts') => void;
  onOpenReport: () => void;
  activeRole: 'citizen' | 'driver' | 'authority';
  setActiveRole: (role: 'citizen' | 'driver' | 'authority') => void;
  userMetrics: UserPersonalMetrics;
  criticalBridgesCount: number;
  activeAlertsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  onOpenReport,
  activeRole,
  setActiveRole,
  userMetrics,
  criticalBridgesCount,
  activeAlertsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      {/* Top Alert Ticker */}
      {activeAlertsCount > 0 && (
        <div className="bg-gradient-to-r from-amber-950 via-rose-950 to-amber-950 border-b border-rose-500/30 px-4 py-1.5 text-xs flex items-center justify-between text-rose-200">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="flex h-2 w-2 relative flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="font-semibold text-rose-300">LIVE RIVER WARNING:</span>
            <span>
              CWC & IMD Flash Flood Alert Active – {criticalBridgesCount} bridges currently flagged with elevated risk!
            </span>
          </div>
          <button
            onClick={() => setCurrentTab('alerts')}
            className="flex-shrink-0 ml-3 underline hover:text-white font-medium cursor-pointer"
          >
            View Alert Zones →
          </button>
        </div>
      )}

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className="flex items-center gap-2.5 group text-left cursor-pointer"
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 via-rose-500 to-indigo-600 p-0.5 shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
                <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <ShieldAlert className="h-5 w-5 text-amber-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base sm:text-lg tracking-tight text-white group-hover:text-amber-400 transition-colors">
                    BridgeRisk<span className="text-amber-400">Map</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded">
                    LIVE
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  Crowd-Informed Bridge Heatmap & Safe Routing
                </p>
              </div>
            </button>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                currentTab === 'dashboard'
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentTab('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'map'
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <MapPin className="h-3.5 w-3.5" />
              Risk Heatmap
            </button>
            <button
              onClick={() => setCurrentTab('routes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'routes'
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Navigation className="h-3.5 w-3.5" />
              Safe Routes
            </button>
            <button
              onClick={() => setCurrentTab('authority')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'authority'
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              Authority Triage
              {criticalBridgesCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] bg-rose-500 text-white rounded-full font-bold">
                  {criticalBridgesCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setCurrentTab('alerts')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'alerts'
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Radio className="h-3.5 w-3.5" />
              Alerts
              {activeAlertsCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] bg-amber-500 text-slate-950 rounded-full font-bold">
                  {activeAlertsCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Area: Role Selector & Action */}
          <div className="flex items-center gap-2.5">
            {/* Quick Role Switcher */}
            <div className="hidden lg:flex items-center bg-slate-950/70 border border-slate-800 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setActiveRole('citizen')}
                className={`px-2 py-1 rounded flex items-center gap-1 transition-colors cursor-pointer ${
                  activeRole === 'citizen'
                    ? 'bg-slate-800 text-amber-400 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Citizen Contributor View"
              >
                <UserCheck className="h-3 w-3" />
                Citizen
              </button>
              <button
                onClick={() => setActiveRole('driver')}
                className={`px-2 py-1 rounded flex items-center gap-1 transition-colors cursor-pointer ${
                  activeRole === 'driver'
                    ? 'bg-slate-800 text-sky-400 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Professional Driver / Logistics View"
              >
                <Truck className="h-3 w-3" />
                Driver
              </button>
              <button
                onClick={() => setActiveRole('authority')}
                className={`px-2 py-1 rounded flex items-center gap-1 transition-colors cursor-pointer ${
                  activeRole === 'authority'
                    ? 'bg-slate-800 text-rose-400 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="PWD / Disaster Authority View"
              >
                <Building2 className="h-3 w-3" />
                Authority
              </button>
            </div>

            {/* Personalized User Status Pill */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-slate-800/60 border border-slate-700/60 rounded-lg text-xs">
              <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-500 flex items-center justify-center font-bold text-[10px] text-slate-950">
                {userMetrics.avatar}
              </div>
              <div className="text-left">
                <div className="text-[11px] font-medium text-slate-200 leading-tight">
                  {userMetrics.name.split(' ')[0]}
                </div>
                <div className="text-[10px] text-amber-400 flex items-center gap-1">
                  <Award className="h-2.5 w-2.5" />
                  {userMetrics.points} pts
                </div>
              </div>
            </div>

            {/* Primary Action: Report Bridge Condition */}
            <button
              onClick={onOpenReport}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600 text-slate-950 font-semibold text-xs shadow-lg shadow-rose-500/25 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Report Condition</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-slate-800/60 overflow-x-auto gap-2">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap ${
              currentTab === 'dashboard' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentTab('map')}
            className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap ${
              currentTab === 'map' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400'
            }`}
          >
            Heatmap
          </button>
          <button
            onClick={() => setCurrentTab('routes')}
            className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap ${
              currentTab === 'routes' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400'
            }`}
          >
            Safe Routes
          </button>
          <button
            onClick={() => setCurrentTab('authority')}
            className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap ${
              currentTab === 'authority' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400'
            }`}
          >
            Authority ({criticalBridgesCount})
          </button>
          <button
            onClick={() => setCurrentTab('alerts')}
            className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap ${
              currentTab === 'alerts' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400'
            }`}
          >
            Alerts ({activeAlertsCount})
          </button>
        </div>
      </div>
    </header>
  );
};
