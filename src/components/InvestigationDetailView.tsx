import React, { useState } from 'react';
import {
  ArrowLeft,
  Network,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Shield,
  Smartphone,
  User,
  Store,
  Globe,
  CreditCard,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Investigation, EntityNode, PageId, EntityType } from '../types';
import { NETWORK_ENTITIES, NETWORK_EDGES } from '../data/mockData';

interface InvestigationDetailViewProps {
  investigation: Investigation;
  onBack: () => void;
  onNavigateToNetwork: (focusEntityId?: string) => void;
  onNavigateToControlsWithPreset: (signalTitle: string) => void;
  onUpdateStatus: (id: string, newStatus: Investigation['status']) => void;
}

export const InvestigationDetailView: React.FC<InvestigationDetailViewProps> = ({
  investigation,
  onBack,
  onNavigateToNetwork,
  onNavigateToControlsWithPreset,
  onUpdateStatus,
}) => {
  // Filter entities connected to this investigation's focus node or related cluster
  const [selectedNodeId, setSelectedNodeId] = useState<string>(investigation.entityId);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Entities in this investigation cluster: M284, A882, A731, D291, D882, IP-172, M193
  const clusterNodeIds = ['M284', 'A882', 'A731', 'D291', 'D882', 'IP-172', 'M193'];
  const clusterNodes = NETWORK_ENTITIES.filter((n) => clusterNodeIds.includes(n.id));
  const clusterEdges = NETWORK_EDGES.filter(
    (e) => clusterNodeIds.includes(e.source) && clusterNodeIds.includes(e.target)
  );

  const selectedNode = NETWORK_ENTITIES.find((n) => n.id === selectedNodeId) || clusterNodes[0];

  const handleAction = (status: Investigation['status'], msg: string) => {
    onUpdateStatus(investigation.id, status);
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const getEntityIcon = (type: EntityType) => {
    switch (type) {
      case 'Merchant':
        return <Store className="h-3.5 w-3.5" />;
      case 'Account':
        return <User className="h-3.5 w-3.5" />;
      case 'Device':
        return <Smartphone className="h-3.5 w-3.5" />;
      case 'IP':
        return <Globe className="h-3.5 w-3.5" />;
      case 'Card':
        return <CreditCard className="h-3.5 w-3.5" />;
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Top back link & breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          id="back-to-investigations-btn"
          onClick={onBack}
          className="group flex items-center gap-1.5 text-xs font-medium text-[#6B6B66] hover:text-[#1A1A1A]"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Investigations</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#8A8A85]">Investigation ID:</span>
          <span className="font-mono text-xs font-semibold text-[#1A1A1A]">
            {investigation.id}
          </span>
        </div>
      </div>

      {/* Success banner if action taken */}
      {actionSuccessMsg && (
        <div className="flex items-center justify-between rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button
            onClick={() => setActionSuccessMsg(null)}
            className="text-xs font-medium text-emerald-900 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header Block */}
      <div className="rounded-md border border-[#E5E5E0] bg-white p-5">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs text-[#8A8A85]">{investigation.id}</span>
              <span className="text-[#BDBDB7]">•</span>
              <h2 className="text-lg font-bold tracking-tight text-[#1A1A1A]">
                {investigation.entityName}
              </h2>
              <span className="rounded border border-stone-200 bg-stone-50 px-1.5 py-0.5 text-[10px] font-medium text-stone-600">
                {investigation.entityType}
              </span>
              <span
                className={`rounded border px-2 py-0.5 text-[11px] font-semibold ${
                  investigation.riskLevel === 'critical'
                    ? 'border-red-200 bg-red-50 text-red-700'
                    : 'border-orange-200 bg-orange-50 text-orange-700'
                }`}
              >
                {investigation.riskLevel.toUpperCase()} RISK
              </span>
            </div>

            <p className="max-w-2xl text-xs text-[#4A4A45]">
              "{investigation.explanation}"
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-[11px] text-[#8A8A85]">
              <span>First seen: {investigation.firstSeen}</span>
              <span>•</span>
              <span>Volume: {investigation.totalVolume}</span>
              <span>•</span>
              <span>Connected entities: {investigation.connectedEntitiesCount}</span>
              <span>•</span>
              <span>
                Status:{' '}
                <span className="font-medium text-[#1A1A1A]">{investigation.status}</span>
              </span>
            </div>
          </div>

          {/* Risk Score Pill */}
          <div className="flex items-center gap-3 rounded-md border border-[#E5E5E0] bg-[#FAFAF8] p-3 text-right">
            <div>
              <div className="text-[11px] font-medium text-[#6B6B66]">Risk score</div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold tracking-tight text-[#1A1A1A]">
                  {investigation.riskScore}
                </span>
                <span className="text-xs text-[#8A8A85]">/ 100</span>
              </div>
            </div>
            <div className="h-9 w-1.5 rounded-full bg-orange-500"></div>
          </div>
        </div>
      </div>

      {/* SECTION 1: Why was this flagged? */}
      <div className="rounded-md border border-[#E5E5E0] bg-white p-5">
        <div className="mb-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6B6B66]">
            Section 01
          </h3>
          <h4 className="text-sm font-semibold tracking-tight text-[#1A1A1A]">
            Why was this flagged?
          </h4>
          <p className="text-xs text-[#6B6B66]">
            Ranked risk signals evaluated during the automated intake pass
          </p>
        </div>

        <div className="divide-y divide-[#E5E5E0] border-t border-[#E5E5E0]">
          {investigation.signals.map((sig) => (
            <div key={sig.rank} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="font-mono text-xs font-semibold text-[#8A8A85]">
                  {sig.rank}
                </span>
                <div>
                  <div className="text-xs font-medium text-[#1A1A1A]">{sig.title}</div>
                  <div className="text-[11px] text-[#6B6B66]">{sig.detail}</div>
                </div>
              </div>
              <div className="self-end sm:self-center">
                <span className="inline-flex items-center rounded border border-amber-200/70 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800">
                  {sig.impact}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Connected Entities Relationship Graph */}
      <div className="rounded-md border border-[#E5E5E0] bg-white p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6B6B66]">
              Section 02
            </h3>
            <h4 className="text-sm font-semibold tracking-tight text-[#1A1A1A]">
              Connected entities
            </h4>
            <p className="text-xs text-[#6B6B66]">
              Relationship topology. Click a node to view entity attributes and activity.
            </p>
          </div>
          <button
            id="expand-network-btn"
            onClick={() => onNavigateToNetwork(investigation.entityId)}
            className="flex items-center gap-1 rounded border border-[#E5E5E0] bg-[#F7F7F5] px-2.5 py-1 text-xs font-medium text-[#1A1A1A] hover:bg-stone-200"
          >
            <Network className="h-3.5 w-3.5" />
            <span>Open in Risk Network</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Restrained interactive SVG Graph Area */}
          <div className="relative rounded border border-[#E5E5E0] bg-[#FAFAF8] p-3 lg:col-span-2">
            <div className="mb-2 flex items-center justify-between text-[11px] text-[#8A8A85]">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full border border-stone-300 bg-white"></span>
                Node circles: Entity accounts & devices
              </span>
              <span>7 cluster entities shown</span>
            </div>

            <div className="relative h-72 w-full overflow-hidden">
              <svg className="h-full w-full select-none" viewBox="0 0 750 380">
                <defs>
                  <marker
                    id="arrow"
                    viewBox="0 0 10 10"
                    refX="16"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#BDBDB7" />
                  </marker>
                </defs>

                {/* Edges */}
                {clusterEdges.map((edge, idx) => {
                  const srcNode = clusterNodes.find((n) => n.id === edge.source);
                  const tgtNode = clusterNodes.find((n) => n.id === edge.target);
                  if (!srcNode || !tgtNode) return null;

                  const isHighRisk = edge.riskLevel === 'critical' || edge.riskLevel === 'high';

                  return (
                    <g key={idx}>
                      <line
                        x1={srcNode.x || 300}
                        y1={srcNode.y || 150}
                        x2={tgtNode.x || 300}
                        y2={tgtNode.y || 150}
                        stroke={isHighRisk ? '#E07A5F' : '#D1D1CB'}
                        strokeWidth={isHighRisk ? 1.5 : 1}
                        strokeDasharray={isHighRisk ? '3 2' : 'none'}
                      />
                      {/* Edge Label text at midpoint */}
                      <text
                        x={((srcNode.x || 0) + (tgtNode.x || 0)) / 2}
                        y={((srcNode.y || 0) + (tgtNode.y || 0)) / 2 - 4}
                        fill="#8A8A85"
                        fontSize="9"
                        textAnchor="middle"
                        className="pointer-events-none font-sans"
                      >
                        {edge.label}
                      </text>
                    </g>
                  );
                })}

                {/* Nodes */}
                {clusterNodes.map((node) => {
                  const isSelected = node.id === selectedNodeId;
                  const isFocus = node.id === investigation.entityId;

                  return (
                    <g
                      key={node.id}
                      id={`cluster-node-${node.id}`}
                      className="cursor-pointer"
                      onClick={() => setSelectedNodeId(node.id)}
                    >
                      {/* Outer focus halo */}
                      {isSelected && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="25"
                          fill="none"
                          stroke="#1A1A1A"
                          strokeWidth="1.5"
                          strokeDasharray="2 2"
                        />
                      )}

                      {/* Main Node Circle */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="18"
                        fill={isFocus ? '#1A1A1A' : '#FFFFFF'}
                        stroke={
                          node.riskScore > 85
                            ? '#D9381E'
                            : node.riskScore > 70
                            ? '#E07A5F'
                            : '#D1D1CB'
                        }
                        strokeWidth="2"
                        className="transition-all hover:scale-105"
                      />

                      {/* Risk indicator dot */}
                      <circle
                        cx={(node.x || 0) + 12}
                        cy={(node.y || 0) - 12}
                        r="4"
                        fill={
                          node.riskScore > 85
                            ? '#DC2626'
                            : node.riskScore > 70
                            ? '#EA580C'
                            : '#D97706'
                        }
                      />

                      {/* Inner Text or Icon Initial */}
                      <text
                        x={node.x}
                        y={(node.y || 0) + 4}
                        fill={isFocus ? '#FFFFFF' : '#1A1A1A'}
                        fontSize="10"
                        fontWeight="600"
                        textAnchor="middle"
                        className="pointer-events-none font-mono"
                      >
                        {node.id.split('-')[0]}
                      </text>

                      {/* Node label text beneath */}
                      <text
                        x={node.x}
                        y={(node.y || 0) + 32}
                        fill="#1A1A1A"
                        fontSize="11"
                        fontWeight="500"
                        textAnchor="middle"
                        className="pointer-events-none"
                      >
                        {node.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="mt-2 flex items-center justify-between border-t border-[#E5E5E0] pt-2 text-[10px] text-[#8A8A85]">
              <span>Click any entity circle to inspect attributes in side panel</span>
              <span>Red dashed lines indicate critical risk correlations</span>
            </div>
          </div>

          {/* Node detail side panel */}
          <div className="rounded border border-[#E5E5E0] bg-white p-4">
            <div className="flex items-center justify-between border-b border-[#E5E5E0] pb-2.5">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-stone-100 text-stone-700">
                  {getEntityIcon(selectedNode.type)}
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#1A1A1A]">{selectedNode.label}</div>
                  <div className="text-[10px] text-[#8A8A85]">{selectedNode.type}</div>
                </div>
              </div>
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                  selectedNode.riskScore > 85
                    ? 'bg-red-50 text-red-700'
                    : selectedNode.riskScore > 70
                    ? 'bg-orange-50 text-orange-700'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                Risk: {selectedNode.riskScore}
              </span>
            </div>

            <div className="mt-3 space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-[#F2F2EE] pb-1.5">
                <span className="text-[#8A8A85]">First seen:</span>
                <span className="font-medium text-[#1A1A1A]">{selectedNode.firstSeen}</span>
              </div>
              <div className="flex justify-between border-b border-[#F2F2EE] pb-1.5">
                <span className="text-[#8A8A85]">Connections:</span>
                <span className="font-medium text-[#1A1A1A]">
                  {selectedNode.connections} linked entities
                </span>
              </div>
              <div className="flex justify-between border-b border-[#F2F2EE] pb-1.5">
                <span className="text-[#8A8A85]">Recent activity:</span>
                <span className="font-medium text-[#1A1A1A]">{selectedNode.recentActivity}</span>
              </div>
              {selectedNode.volume && (
                <div className="flex justify-between border-b border-[#F2F2EE] pb-1.5">
                  <span className="text-[#8A8A85]">Total volume:</span>
                  <span className="font-medium text-[#1A1A1A]">{selectedNode.volume}</span>
                </div>
              )}
              <div className="pt-1">
                <div className="text-[11px] font-medium text-[#8A8A85]">Why it matters:</div>
                <p className="mt-1 text-[11px] leading-relaxed text-[#4A4A45]">
                  {selectedNode.whyItMatters}
                </p>
              </div>

              <div className="pt-2">
                <button
                  id={`side-panel-focus-${selectedNode.id}`}
                  onClick={() => onNavigateToNetwork(selectedNode.id)}
                  className="flex w-full items-center justify-center gap-1 rounded border border-[#E5E5E0] bg-[#F7F7F5] py-1.5 text-xs font-medium text-[#1A1A1A] hover:bg-stone-200"
                >
                  <span>Focus in Risk Network</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Recommended Action */}
      <div className="rounded-md border border-[#E5E5E0] bg-white p-5">
        <div className="mb-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6B6B66]">
            Section 03
          </h3>
          <h4 className="text-sm font-semibold tracking-tight text-[#1A1A1A]">
            Recommended action
          </h4>
        </div>

        <div className="rounded border border-[#E5E5E0] bg-[#FAFAF8] p-3 text-xs leading-relaxed text-[#1A1A1A]">
          "{investigation.recommendedAction}"
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <button
            id="review-network-action-btn"
            onClick={() => onNavigateToNetwork(investigation.entityId)}
            className="flex items-center gap-1.5 rounded-md border border-[#E5E5E0] bg-white px-3 py-1.5 text-xs font-medium text-[#1A1A1A] hover:bg-stone-100"
          >
            <Network className="h-3.5 w-3.5 text-[#6B6B66]" />
            <span>Review network</span>
          </button>

          <button
            id="create-control-action-btn"
            onClick={() => onNavigateToControlsWithPreset(investigation.primarySignal)}
            className="flex items-center gap-1.5 rounded-md border border-[#E5E5E0] bg-white px-3 py-1.5 text-xs font-medium text-[#1A1A1A] hover:bg-stone-100"
          >
            <Sliders className="h-3.5 w-3.5 text-[#6B6B66]" />
            <span>Create control</span>
          </button>

          <button
            id="mark-as-reviewed-btn"
            onClick={() => handleAction('Review', 'Investigation marked as reviewed and logged.')}
            className="flex items-center gap-1.5 rounded-md bg-[#1A1A1A] px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-800"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Mark as reviewed</span>
          </button>

          <button
            id="escalate-investigation-btn"
            onClick={() => handleAction('Escalated', 'Case escalated to Senior Risk Ops & AML team.')}
            className="flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-800 hover:bg-red-100"
          >
            <AlertTriangle className="h-3.5 w-3.5 text-red-700" />
            <span>Escalate to AML unit</span>
          </button>
        </div>
      </div>
    </div>
  );
};
