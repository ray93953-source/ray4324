/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { DashboardMain } from './components/DashboardMain';
import { BridgeMap } from './components/BridgeMap';
import { RoutePlanner } from './components/RoutePlanner';
import { AuthorityCommand } from './components/AuthorityCommand';
import { AlertsFeed } from './components/AlertsFeed';
import { ReportModal } from './components/ReportModal';
import { BridgeDetailModal } from './components/BridgeDetailModal';
import {
  INITIAL_BRIDGES,
  INITIAL_ALERTS,
  INITIAL_REPORTS,
  INITIAL_USER_METRICS,
} from './data/mockData';
import { Bridge, CitizenReport, EnvironmentalAlert, UserPersonalMetrics } from './types';
import { calculateBridgeRisk } from './utils/riskAlgorithm';

export default function App() {
  const [bridges, setBridges] = useState<Bridge[]>(INITIAL_BRIDGES);
  const [reports, setReports] = useState<CitizenReport[]>(INITIAL_REPORTS);
  const [alerts, setAlerts] = useState<EnvironmentalAlert[]>(INITIAL_ALERTS);
  const [activeRole, setActiveRole] = useState<'citizen' | 'driver' | 'authority'>('citizen');
  const [metricsState, setMetricsState] = useState<Record<'citizen' | 'driver' | 'authority', UserPersonalMetrics>>(
    INITIAL_USER_METRICS
  );
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'map' | 'routes' | 'authority' | 'alerts'>('dashboard');

  // Modals & Selected states
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [preselectedBridgeId, setPreselectedBridgeId] = useState<string | undefined>(undefined);
  const [inspectingBridge, setInspectingBridge] = useState<Bridge | null>(null);
  const [isSurgeSimulated, setIsSurgeSimulated] = useState<boolean>(true);

  const currentUserMetrics = metricsState[activeRole];

  // Derived counts
  const criticalBridgesCount = useMemo(
    () => bridges.filter((b) => b.riskLevel === 'critical').length,
    [bridges]
  );
  const activeAlertsCount = useMemo(
    () => alerts.filter((a) => a.isActive).length,
    [alerts]
  );

  // Recalculate bridge risk when a new report is added
  const handleAddNewReport = (newReportData: Omit<CitizenReport, 'id' | 'reportedAt' | 'status'>) => {
    const newReport: CitizenReport = {
      ...newReportData,
      id: `rep-${Date.now()}`,
      reportedAt: 'Just now',
      status: 'Verified',
    };

    const updatedReports = [newReport, ...reports];
    setReports(updatedReports);

    // Recalculate the targeted bridge risk score using the algorithm
    setBridges((prevBridges) =>
      prevBridges.map((b) => {
        if (b.id !== newReportData.bridgeId) return b;

        const newDownCount = b.downReportsCount + (newReportData.thumbs === 'down' ? 1 : 0);
        const newUpCount = b.upReportsCount + (newReportData.thumbs === 'up' ? 1 : 0);
        const newTotal = b.reportsCount + 1;
        const newDownRatio = newDownCount / newTotal;

        const updatedBridgeSkeleton = {
          ...b,
          reportsCount: newTotal,
          downReportsCount: newDownCount,
          upReportsCount: newUpCount,
          downRatio: newDownRatio,
          lastRiskUpdatedAt: 'Just now',
        };

        const calc = calculateBridgeRisk(updatedBridgeSkeleton, updatedReports, alerts);

        return {
          ...updatedBridgeSkeleton,
          riskScore: calc.riskScore,
          riskLevel: calc.riskLevel,
          riskBreakdown: calc.breakdown,
          photoUrls:
            newReportData.photoUrl && !b.photoUrls.includes(newReportData.photoUrl)
              ? [newReportData.photoUrl, ...b.photoUrls]
              : b.photoUrls,
        };
      })
    );

    // Update personalized metrics
    setMetricsState((prev) => ({
      ...prev,
      [activeRole]: {
        ...prev[activeRole],
        reportsSubmitted: prev[activeRole].reportsSubmitted + 1,
        hazardsFlagged: prev[activeRole].hazardsFlagged + (newReportData.thumbs === 'down' ? 1 : 0),
        points: prev[activeRole].points + 50,
      },
    }));
  };

  // Toggle River Surge Simulation (Monsoon Flash Flood)
  const handleToggleSurgeSimulation = () => {
    const nextState = !isSurgeSimulated;
    setIsSurgeSimulated(nextState);

    // Update alerts severity
    const updatedAlerts = alerts.map((a) => {
      if (a.id === 'alert-fl-01') {
        return {
          ...a,
          severity: nextState ? ((4 as const)) : ((1 as const)),
          isActive: nextState,
          waterLevelRiseMeters: nextState ? 2.8 : 0.4,
        };
      }
      return a;
    });

    setAlerts(updatedAlerts);

    // Re-evaluate risk across all bridges
    setBridges((prev) =>
      prev.map((b) => {
        const calc = calculateBridgeRisk(b, reports, updatedAlerts);
        return {
          ...b,
          riskScore: calc.riskScore,
          riskLevel: calc.riskLevel,
          riskBreakdown: calc.breakdown,
          lastRiskUpdatedAt: 'Just now',
        };
      })
    );
  };

  const handleOpenReportModal = (bridgeId?: string) => {
    setPreselectedBridgeId(bridgeId);
    setIsReportModalOpen(true);
  };

  const handleSelectBridgeForInspection = (bridge: Bridge | null) => {
    setInspectingBridge(bridge);
  };

  const handleNavigateToRouteWithBridge = (bridge: Bridge) => {
    setInspectingBridge(null);
    setCurrentTab('routes');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Global Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenReport={() => handleOpenReportModal()}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        userMetrics={currentUserMetrics}
        criticalBridgesCount={criticalBridgesCount}
        activeAlertsCount={activeAlertsCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'dashboard' && (
          <DashboardMain
            bridges={bridges}
            reports={reports}
            alerts={alerts}
            userMetrics={currentUserMetrics}
            activeRole={activeRole}
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenReport={handleOpenReportModal}
            onSelectBridge={handleSelectBridgeForInspection}
            onTriggerSurgeSimulation={handleToggleSurgeSimulation}
            isSurgeSimulated={isSurgeSimulated}
          />
        )}

        {currentTab === 'map' && (
          <BridgeMap
            bridges={bridges}
            alerts={alerts}
            selectedBridge={inspectingBridge}
            onSelectBridge={handleSelectBridgeForInspection}
            onOpenReport={handleOpenReportModal}
            onNavigateToRoute={handleNavigateToRouteWithBridge}
          />
        )}

        {currentTab === 'routes' && (
          <RoutePlanner
            bridges={bridges}
            onSelectBridge={handleSelectBridgeForInspection}
            onOpenReport={handleOpenReportModal}
          />
        )}

        {currentTab === 'authority' && (
          <AuthorityCommand
            bridges={bridges}
            reports={reports}
            alerts={alerts}
            onSelectBridge={handleSelectBridgeForInspection}
            onOpenReport={handleOpenReportModal}
          />
        )}

        {currentTab === 'alerts' && (
          <AlertsFeed
            alerts={alerts}
            bridges={bridges}
            onSelectBridge={handleSelectBridgeForInspection}
            onNavigateToMap={() => setCurrentTab('map')}
            onToggleSurgeSimulation={handleToggleSurgeSimulation}
            isSurgeSimulated={isSurgeSimulated}
          />
        )}
      </main>

      {/* Citizen Report Submission Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        bridges={bridges}
        preselectedBridgeId={preselectedBridgeId}
        onSubmitReport={handleAddNewReport}
      />

      {/* Bridge Detail / Diagnostics Modal */}
      <BridgeDetailModal
        bridge={inspectingBridge}
        onClose={() => setInspectingBridge(null)}
        reports={reports}
        onOpenReport={handleOpenReportModal}
        onNavigateToRoute={handleNavigateToRouteWithBridge}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>BridgeRisk Map • Crowd-Informed Geospatial Heatmap & Driver Routing Prototype</span>
          <div className="flex items-center gap-4">
            <span>Deterministic Risk Algorithm (60/25/15)</span>
            <span>CWC / IMD Environmental Open Data</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
