export type PageId =
  | 'overview'
  | 'investigations'
  | 'investigation-detail'
  | 'network'
  | 'simulator'
  | 'controls'
  | 'alerts'
  | 'transactions'
  | 'entities'
  | 'settings';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type InvestigationStatus = 'Open' | 'Investigating' | 'Review' | 'Escalated' | 'Resolved';

export type EntityType = 'Merchant' | 'Account' | 'Device' | 'IP' | 'Card';

export interface FlaggedSignal {
  rank: string;
  title: string;
  impact: string;
  detail: string;
}

export interface Investigation {
  id: string;
  entityId: string;
  entityName: string;
  entityType: EntityType;
  riskScore: number;
  riskLevel: RiskLevel;
  primarySignal: string;
  updated: string;
  status: InvestigationStatus;
  explanation: string;
  signals: FlaggedSignal[];
  recommendedAction: string;
  connectedEntitiesCount: number;
  totalVolume: string;
  firstSeen: string;
}

export interface EntityNode {
  id: string;
  label: string;
  type: EntityType;
  riskScore: number;
  riskLevel: RiskLevel;
  firstSeen: string;
  connections: number;
  recentActivity: string;
  whyItMatters: string;
  volume?: string;
  connectedTo: string[];
  status: 'Active' | 'Under review' | 'Suspended' | 'Whitelisted';
  x?: number;
  y?: number;
}

export interface NetworkEdge {
  source: string;
  target: string;
  label: string;
  riskLevel?: RiskLevel;
}

export type AttackType =
  | 'account-takeover'
  | 'coordinated-merchants'
  | 'transaction-splitting'
  | 'refund-abuse'
  | 'synthetic-identity'
  | 'custom';

export type AttackScale = 'small' | 'medium' | 'large';

export interface SimulationResultData {
  scenarioName: string;
  volume: string;
  entitiesInvolved: number;
  transactionsCount: number;
  detectedPct: number;
  missedPct: number;
  estimatedExposure: string;
  detectionGaps: string[];
  suggestedControl: {
    title: string;
    signal: string;
    expectedImpact: {
      detectionImprovement: string;
      falsePositiveIncrease: string;
    };
    why: string;
    evidence: {
      entities: number;
      deviceClusters: number;
      transactions: number;
      missedEntities: number;
    };
  };
}

export interface RiskControl {
  id: string;
  name: string;
  type: 'Rule' | 'Graph signal' | 'ML signal' | 'Behavioral';
  impact: 'High' | 'Medium' | 'Low';
  falsePositives: 'Low' | 'Medium' | 'High';
  status: 'Active' | 'Testing' | 'Paused';
  lastUpdated: string;
  conditions?: string;
  threshold?: string;
  affectedEntities?: string;
}

export interface AlertItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  severity: 'critical' | 'high' | 'medium' | 'info';
  entityId?: string;
  investigationId?: string;
  isRead: boolean;
}

export interface Transaction {
  id: string;
  time: string;
  amount: string;
  amountNum: number;
  customer: string;
  merchant: string;
  merchantId: string;
  device: string;
  ip: string;
  riskScore: number;
  riskLevel: RiskLevel;
  status: 'Completed' | 'Review' | 'Blocked' | 'Refunded';
  signals: string[];
  channel: 'UPI' | 'Card' | 'NetBanking';
  cardBin?: string;
}
