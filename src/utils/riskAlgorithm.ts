import { Bridge, CitizenReport, EnvironmentalAlert, RiskLevel } from '../types';

export function calculateBridgeRisk(
  bridge: Omit<Bridge, 'riskScore' | 'riskLevel' | 'riskBreakdown'>,
  reports: CitizenReport[],
  alerts: EnvironmentalAlert[],
  currentYear = 2026
): {
  riskScore: number;
  riskLevel: RiskLevel;
  breakdown: {
    baseReportsScore: number;
    environmentalScore: number;
    infrastructureScore: number;
    timeDecayFactor: number;
  };
} {
  // 1. Citizen reports calculation
  const bridgeReports = reports.filter((r) => r.bridgeId === bridge.id);
  const totalReports = bridgeReports.length;
  const downReports = bridgeReports.filter((r) => r.thumbs === 'down');
  const downRatio = totalReports > 0 ? downReports.length / totalReports : 0;

  // Photo confidence bonus: reports with photos provide high trust
  const reportsWithPhotos = downReports.filter((r) => r.hasPhoto).length;
  const photoConfidenceRatio = downReports.length > 0 ? reportsWithPhotos / downReports.length : 0;
  const photoConfidenceBonus = photoConfidenceRatio * 10; // max 10 points

  // Time decay factor: evaluate recency of down reports
  // If reports arrived recently, time_decay_factor is near 1.0
  let timeDecayFactor = 0.85;
  if (downReports.length > 0) {
    const mostRecentMs = Math.max(...downReports.map((r) => new Date(r.reportedAt).getTime()));
    const hoursSince = Math.max(0, (Date.now() - mostRecentMs) / (1000 * 60 * 60));
    if (hoursSince <= 12) {
      timeDecayFactor = 1.0;
    } else if (hoursSince <= 48) {
      timeDecayFactor = 0.9;
    } else if (hoursSince <= 168) {
      // 7 days
      timeDecayFactor = 0.75;
    } else {
      timeDecayFactor = 0.5;
    }
  }

  const baseFromReports = 60 * downRatio * timeDecayFactor + (downRatio > 0 ? photoConfidenceBonus : 0);

  // 2. Environmental alert severity
  const activeAlertsForBridge = alerts.filter(
    (a) => a.isActive && (a.affectedBridgeIds.includes(bridge.id) || bridge.activeAlerts.includes(a.id))
  );

  let maxEnvSeverity = 0;
  if (activeAlertsForBridge.length > 0) {
    maxEnvSeverity = Math.max(...activeAlertsForBridge.map((a) => a.severity)) / 5; // normalized 0 to 1
  }
  const envComponent = 25 * maxEnvSeverity;

  // 3. Infrastructure characteristics (Age + Traffic)
  const age = Math.max(0, currentYear - bridge.yearBuilt);
  const ageFactor = Math.min(1, Math.max(0, age / 80)); // 80 years normalized cap

  const trafficMap: Record<Bridge['trafficVolume'], number> = {
    Low: 0.25,
    Medium: 0.5,
    High: 0.8,
    'Very High': 1.0,
  };
  const trafficFactor = trafficMap[bridge.trafficVolume] ?? 0.5;

  const infraComponent = 15 * (0.5 * ageFactor + 0.5 * trafficFactor);

  // Total raw score (0-100)
  const rawScore = baseFromReports + envComponent + infraComponent;
  const riskScore = Math.round(Math.min(100, Math.max(0, rawScore)));

  // Risk Level Classification
  let riskLevel: RiskLevel = 'low';
  if (riskScore >= 76) {
    riskLevel = 'critical';
  } else if (riskScore >= 51) {
    riskLevel = 'high';
  } else if (riskScore >= 26) {
    riskLevel = 'moderate';
  } else {
    riskLevel = 'low';
  }

  return {
    riskScore,
    riskLevel,
    breakdown: {
      baseReportsScore: Math.round(baseFromReports),
      environmentalScore: Math.round(envComponent),
      infrastructureScore: Math.round(infraComponent),
      timeDecayFactor: Number(timeDecayFactor.toFixed(2)),
    },
  };
}

export function getRiskLevelBadge(level: RiskLevel): {
  label: string;
  badgeBg: string;
  textColor: string;
  dotColor: string;
  borderColor: string;
  hex: string;
} {
  switch (level) {
    case 'critical':
      return {
        label: 'Critical Risk',
        badgeBg: 'bg-rose-500/15',
        textColor: 'text-rose-400',
        dotColor: 'bg-rose-500',
        borderColor: 'border-rose-500/30',
        hex: '#ef4444',
      };
    case 'high':
      return {
        label: 'High Risk',
        badgeBg: 'bg-amber-500/15',
        textColor: 'text-amber-400',
        dotColor: 'bg-amber-500',
        borderColor: 'border-amber-500/30',
        hex: '#f59e0b',
      };
    case 'moderate':
      return {
        label: 'Moderate Risk',
        badgeBg: 'bg-yellow-500/15',
        textColor: 'text-yellow-400',
        dotColor: 'bg-yellow-500',
        borderColor: 'border-yellow-500/30',
        hex: '#eab308',
      };
    case 'low':
    default:
      return {
        label: 'Low / Sound',
        badgeBg: 'bg-emerald-500/15',
        textColor: 'text-emerald-400',
        dotColor: 'bg-emerald-500',
        borderColor: 'border-emerald-500/30',
        hex: '#10b981',
      };
  }
}
