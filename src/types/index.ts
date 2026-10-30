export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface Bridge {
  id: string;
  name: string;
  riverOrCrossing: string;
  district: string;
  lat: number;
  lng: number;
  yearBuilt: number;
  trafficVolume: 'Low' | 'Medium' | 'High' | 'Very High';
  bridgeType: 'Steel Truss' | 'Reinforced Concrete' | 'Prestressed Box Girder' | 'Arch Bridge' | 'Suspension' | 'Masonry Arch';
  lengthMeters: number;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  lastInspected: string;
  lastRiskUpdatedAt: string;
  reportsCount: number;
  downReportsCount: number;
  upReportsCount: number;
  downRatio: number;
  activeAlerts: string[];
  structuralHealthIndex: number; // 0-100 baseline
  photoUrls: string[];
  riskBreakdown: {
    baseReportsScore: number;
    environmentalScore: number;
    infrastructureScore: number;
    timeDecayFactor: number;
  };
}

export interface CitizenReport {
  id: string;
  bridgeId: string;
  bridgeName: string;
  thumbs: 'up' | 'down';
  issueCategory?: 'Cracking / Spalling' | 'Water Level / Submergence' | 'Vibration / Sway' | 'Pothole / Road Surface' | 'Expansion Joint Failure' | 'Debris Jamming Pier' | 'Normal Condition';
  comment: string;
  photoUrl?: string;
  hasPhoto: boolean;
  reportedAt: string;
  userLocation: { lat: number; lng: number };
  reporterRole: 'Citizen' | 'Truck Driver' | 'Bus Transit' | 'Municipal Inspector';
  status: 'Pending Review' | 'Verified' | 'Inspection Dispatched';
  reporterName?: string;
}

export interface EnvironmentalAlert {
  id: string;
  source: 'IMD / National Weather' | 'CWC River Monitoring' | 'District Disaster Mgmt' | 'Flash Flood Watch';
  alertType: 'Flash Flood' | 'River Surge' | 'Heavy Monsoon' | 'Structural Overload';
  severity: 1 | 2 | 3 | 4 | 5; // 1 is minor, 5 is emergency
  title: string;
  affectedRegion: string;
  riverBasin: string;
  waterLevelRiseMeters: number;
  validFrom: string;
  validTo: string;
  affectedBridgeIds: string[];
  polygonCoords: [number, number][];
  description: string;
  isActive: boolean;
}

export interface RouteOption {
  id: string;
  name: string;
  distanceKm: number;
  durationMins: number;
  bridgesOnRoute: {
    bridge: Bridge;
    isHighRisk: boolean;
  }[];
  maxRiskScore: number;
  averageRiskScore: number;
  isRecommended: boolean;
  pathCoordinates: [number, number][];
  warning: string | null;
  tag: 'Safest Route' | 'Fastest Route' | 'Scenic Alternative';
}

export interface UserPersonalMetrics {
  role: 'citizen' | 'driver' | 'authority';
  name: string;
  avatar: string;
  reputationLevel: string;
  reportsSubmitted: number;
  hazardsFlagged: number;
  verifiedCount: number;
  routesPlanned: number;
  riskyBridgesAverted: number;
  inspectionsTriggered: number;
  safeTripsLogged: number;
  points: number;
}
