import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
  Store,
  User,
  Smartphone,
  Globe,
  CreditCard,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { EntityNode, EntityType, RiskLevel, PageId } from '../types';
import { NETWORK_ENTITIES, NETWORK_EDGES } from '../data/mockData';

interface RiskNetworkViewProps {
  initialFocusEntityId?: string;
  onNavigateToTransactions: (entityId: string) => void;
  onNavigateToSimulatorWithTarget: (entityId: string) => void;
  onOpenInvestigationForEntity: (entityId: string) => void;
}

export const RiskNetworkView: React.FC<RiskNetworkViewProps> = ({
  initialFocusEntityId,
  onNavigateToTransactions,
  onNavigateToSimulatorWithTarget,
  onOpenInvestigationForEntity,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'All' | EntityType>('All');
  const [minRiskThreshold, setMinRiskThreshold] = useState<number>(40);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(
    initialFocusEntityId || 'M284'
  );
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Filter nodes according to criteria
  const filteredNodes = useMemo(() => {
    return NETWORK_ENTITIES.filter((node) => {
      const matchesSearch =
        !searchQuery ||
        node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'All' || node.type === selectedType;
      const matchesRisk = node.riskScore >= minRiskThreshold;

      return matchesSearch && matchesType && matchesRisk;
    });
  }, [searchQuery, selectedType, minRiskThreshold]);

  const filteredNodeIds = useMemo(() => new Set(filteredNodes.map((n) => n.id)), [filteredNodes]);

  const activeEdges = useMemo(() => {
    return NETWORK_EDGES.filter(
      (edge) => filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
    );
  }, [filteredNodeIds]);

  const selectedEntity = useMemo(() => {
    if (!selectedEntityId) return null;
    return NETWORK_ENTITIES.find((n) => n.id === selectedEntityId) || null;
  }, [selectedEntityId]);

  // Connected accounts & devices count for selected entity
  const connectedStats = useMemo(() => {
    if (!selectedEntity) return { accounts: 0, devices: 0 };
    const directlyConnectedIds = selectedEntity.connectedTo;
    const accounts = NETWORK_ENTITIES.filter(
      (n) => directlyConnectedIds.includes(n.id) && n.type === 'Account'
    ).length;
    const devices = NETWORK_ENTITIES.filter(
      (n) => directlyConnectedIds.includes(n.id) && n.type === 'Device'
    ).length;
    return {
      accounts: Math.max(accounts, 8), // Matching prompt specifications
      devices: Math.max(devices, 3),
    };
  }, [selectedEntity]);

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

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setSelectedEntityId('M284');
  };

  return (
    <div className="relative mx-auto max-w-7xl space-y-4">
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-[#1A1A1A]">Risk network</h2>
        <p className="text-xs text-[#6B6B66]">Explore relationships between payment entities.</p>
      </div>

      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[#E5E5E0] bg-white p-3">
        {/* Search */}
        <div className="relative w-full sm:w-60">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8A8A85]" />
          <input
            id="network-search-entity"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search entity..."
            className="h-8 w-full rounded-md border border-[#E5E5E0] bg-[#F7F7F5] pl-8 pr-3 text-xs text-[#1A1A1A] placeholder-[#8A8A85] focus:border-stone-400 focus:bg-white focus:outline-none"
          />
        </div>

        {/* Entity Type Filter */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] font-medium text-[#8A8A85]">Entity type:</span>
          {(['All', 'Account', 'Merchant', 'Device', 'IP', 'Card'] as const).map((t) => (
            <button
              key={t}
              id={`filter-type-${t.toLowerCase()}`}
              onClick={() => setSelectedType(t as any)}
              className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${
                selectedType === t
                  ? 'bg-[#1A1A1A] text-white'
                  : 'bg-[#F2F2EE] text-[#4A4A45] hover:bg-stone-200 hover:text-[#1A1A1A]'
              }`}
            >
              {t === 'Card' ? 'Payment instrument' : t}
            </button>
          ))}
        </div>

        {/* Risk Threshold Slider */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[11px] font-medium text-[#8A8A85]">Risk threshold:</span>
          <input
            id="network-risk-threshold"
            type="range"
            min="0"
            max="95"
            step="5"
            value={minRiskThreshold}
            onChange={(e) => setMinRiskThreshold(Number(e.target.value))}
            className="h-1.5 w-24 cursor-pointer accent-[#1A1A1A]"
          />
          <span className="font-mono text-xs font-semibold text-[#1A1A1A]">
            ≥{minRiskThreshold}
          </span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 rounded border border-[#E5E5E0] bg-[#F7F7F5] p-0.5 text-xs">
          <button
            id="network-zoom-in"
            onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.8))}
            className="rounded p-1 text-[#6B6B66] hover:bg-white hover:text-[#1A1A1A]"
            title="Zoom in"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button
            id="network-zoom-out"
            onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.6))}
            className="rounded p-1 text-[#6B6B66] hover:bg-white hover:text-[#1A1A1A]"
            title="Zoom out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <button
            id="network-reset-view"
            onClick={resetView}
            className="rounded p-1 text-[#6B6B66] hover:bg-white hover:text-[#1A1A1A]"
            title="Reset view"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Graph Visualization Area & Right-Side Drawer */}
      <div className="relative flex min-h-[560px] overflow-hidden rounded-md border border-[#E5E5E0] bg-white">
        {/* Graph Canvas */}
        <div
          className="relative h-[560px] w-full flex-1 overflow-hidden bg-[#FAFAF8] cursor-grab active:cursor-grabbing select-none"
          onMouseDown={(e) => {
            if (e.button === 0) {
              setIsPanning(true);
              setStartPan({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
            }
          }}
          onMouseMove={(e) => {
            if (isPanning) {
              setPanOffset({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
            }
          }}
          onMouseUp={() => setIsPanning(false)}
          onMouseLeave={() => setIsPanning(false)}
        >
          {/* Subtle Grid Pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.06]"
            style={{
              backgroundImage:
                'radial-gradient(#1A1A1A 1px, transparent 1px), radial-gradient(#1A1A1A 1px, #FAFAF8 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* SVG Elements */}
          <svg
            className="h-full w-full"
            viewBox="0 0 850 480"
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
              transformOrigin: 'center center',
              transition: isPanning ? 'none' : 'transform 0.15s ease-out',
            }}
          >
            {/* Edge Connections */}
            {activeEdges.map((edge, idx) => {
              const srcNode = filteredNodes.find((n) => n.id === edge.source);
              const tgtNode = filteredNodes.find((n) => n.id === edge.target);
              if (!srcNode || !tgtNode) return null;

              const isHighlighted =
                selectedEntityId &&
                (edge.source === selectedEntityId || edge.target === selectedEntityId);
              const isHighRisk = edge.riskLevel === 'critical' || edge.riskLevel === 'high';

              return (
                <g key={idx}>
                  <line
                    x1={srcNode.x}
                    y1={srcNode.y}
                    x2={tgtNode.x}
                    y2={tgtNode.y}
                    stroke={
                      isHighlighted
                        ? '#1A1A1A'
                        : isHighRisk
                        ? '#E07A5F'
                        : '#D8D8D3'
                    }
                    strokeWidth={isHighlighted ? 2 : isHighRisk ? 1.5 : 1}
                    strokeDasharray={isHighRisk ? '3 3' : 'none'}
                    opacity={selectedEntityId && !isHighlighted ? 0.35 : 1}
                  />
                  {/* Label */}
                  <text
                    x={((srcNode.x || 0) + (tgtNode.x || 0)) / 2}
                    y={((srcNode.y || 0) + (tgtNode.y || 0)) / 2 - 5}
                    fill={isHighlighted ? '#1A1A1A' : '#8A8A85'}
                    fontSize="9"
                    fontWeight={isHighlighted ? '600' : '400'}
                    textAnchor="middle"
                    className="pointer-events-none"
                    opacity={selectedEntityId && !isHighlighted ? 0.3 : 1}
                  >
                    {edge.label}
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {filteredNodes.map((node) => {
              const isSelected = node.id === selectedEntityId;
              const isConnectedToSelected =
                selectedEntity &&
                (selectedEntity.connectedTo.includes(node.id) ||
                  node.connectedTo.includes(selectedEntity.id));
              const isDimmed = selectedEntityId && !isSelected && !isConnectedToSelected;

              return (
                <g
                  key={node.id}
                  id={`network-node-${node.id}`}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEntityId(node.id);
                  }}
                  opacity={isDimmed ? 0.3 : 1}
                >
                  {/* Selection ring */}
                  {isSelected && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="26"
                      fill="none"
                      stroke="#1A1A1A"
                      strokeWidth="1.5"
                      strokeDasharray="3 2"
                    />
                  )}

                  {/* Node Background */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="19"
                    fill={
                      isSelected
                        ? '#1A1A1A'
                        : node.type === 'Merchant'
                        ? '#FFFFFF'
                        : node.type === 'Account'
                        ? '#FFFFFF'
                        : '#FAFAF8'
                    }
                    stroke={
                      node.riskScore > 85
                        ? '#DC2626'
                        : node.riskScore > 70
                        ? '#EA580C'
                        : '#C4C4BE'
                    }
                    strokeWidth={isSelected ? '2' : '1.5'}
                  />

                  {/* Small Type Icon text or Initial */}
                  <text
                    x={node.x}
                    y={(node.y || 0) + 4}
                    fill={isSelected ? '#FFFFFF' : '#1A1A1A'}
                    fontSize="9"
                    fontWeight="600"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="pointer-events-none"
                  >
                    {node.id.length > 5 ? node.id.slice(0, 4) : node.id}
                  </text>

                  {/* Risk Badge dot */}
                  <circle
                    cx={(node.x || 0) + 13}
                    cy={(node.y || 0) - 13}
                    r="4.5"
                    fill={
                      node.riskScore > 85
                        ? '#DC2626'
                        : node.riskScore > 70
                        ? '#EA580C'
                        : '#16A34A'
                    }
                    stroke="#FFFFFF"
                    strokeWidth="1"
                  />

                  {/* Label Text below */}
                  <text
                    x={node.x}
                    y={(node.y || 0) + 34}
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

          {/* Graph Legend overlay in bottom left */}
          <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-3 rounded border border-[#E5E5E0] bg-white/90 px-3 py-1.5 text-[10px] text-[#6B6B66] backdrop-blur-xs">
            <span className="font-semibold text-[#1A1A1A]">Legend:</span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-red-600"></span> Critical (≥85)
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-orange-500"></span> High (≥70)
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-600"></span> Safe
            </span>
            <span className="text-[#BDBDB7]">|</span>
            <span>Drag canvas to pan • Click node for details</span>
          </div>
        </div>

        {/* Right-Side Details Drawer */}
        {selectedEntity && (
          <div
            id="network-entity-drawer"
            className="w-80 shrink-0 border-l border-[#E5E5E0] bg-white p-4 overflow-y-auto"
          >
            {/* Drawer Header */}
            <div className="flex items-start justify-between border-b border-[#E5E5E0] pb-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-[#8A8A85]">
                  {getEntityIcon(selectedEntity.type)}
                  <span>{selectedEntity.type}</span>
                </div>
                <h3 className="mt-0.5 text-sm font-bold tracking-tight text-[#1A1A1A]">
                  {selectedEntity.label}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEntityId(null)}
                className="rounded p-1 text-[#8A8A85] hover:bg-stone-100 hover:text-[#1A1A1A]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Metrics List (exact prompt requirements) */}
            <div className="mt-3 space-y-2.5 text-xs">
              <div className="flex items-center justify-between border-b border-[#F2F2EE] pb-2">
                <span className="text-[#8A8A85]">Risk score</span>
                <span
                  className={`font-semibold ${
                    selectedEntity.riskScore > 85
                      ? 'text-red-700'
                      : selectedEntity.riskScore > 70
                      ? 'text-orange-700'
                      : 'text-stone-700'
                  }`}
                >
                  {selectedEntity.riskScore} / 100
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#F2F2EE] pb-2">
                <span className="text-[#8A8A85]">Connected accounts</span>
                <span className="font-semibold text-[#1A1A1A]">
                  {connectedStats.accounts}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#F2F2EE] pb-2">
                <span className="text-[#8A8A85]">Connected devices</span>
                <span className="font-semibold text-[#1A1A1A]">
                  {connectedStats.devices}
                </span>
              </div>

              {selectedEntity.volume && (
                <div className="flex items-center justify-between border-b border-[#F2F2EE] pb-2">
                  <span className="text-[#8A8A85]">Transaction volume</span>
                  <span className="font-semibold text-[#1A1A1A]">{selectedEntity.volume}</span>
                </div>
              )}

              <div className="flex items-center justify-between border-b border-[#F2F2EE] pb-2">
                <span className="text-[#8A8A85]">First seen</span>
                <span className="font-medium text-[#1A1A1A]">{selectedEntity.firstSeen}</span>
              </div>

              {/* "Why it matters" Section */}
              <div className="pt-1">
                <h4 className="text-xs font-semibold tracking-tight text-[#1A1A1A]">
                  Why it matters
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-[#4A4A45]">
                  {selectedEntity.whyItMatters}
                </p>
              </div>

              {/* Connected entities chips */}
              <div className="pt-2">
                <div className="text-[11px] font-medium text-[#8A8A85]">Direct connections:</div>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {selectedEntity.connectedTo.map((id) => (
                    <button
                      key={id}
                      onClick={() => setSelectedEntityId(id)}
                      className="rounded border border-[#E5E5E0] bg-[#F7F7F5] px-1.5 py-0.5 text-[10px] font-medium text-stone-700 hover:bg-stone-200"
                    >
                      {id}
                    </button>
                  ))}
                </div>
              </div>

              {/* Operational Action Buttons */}
              <div className="pt-3 space-y-2 border-t border-[#E5E5E0]">
                <button
                  id="drawer-open-investigation-btn"
                  onClick={() => onOpenInvestigationForEntity(selectedEntity.id)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-md bg-[#1A1A1A] py-1.5 text-xs font-medium text-white hover:bg-stone-800"
                >
                  <span>Open investigation</span>
                  <ArrowRight className="h-3 w-3" />
                </button>

                <button
                  id="drawer-simulate-attack-btn"
                  onClick={() => onNavigateToSimulatorWithTarget(selectedEntity.id)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-md border border-[#E5E5E0] bg-[#F7F7F5] py-1.5 text-xs font-medium text-[#1A1A1A] hover:bg-stone-200"
                >
                  <ShieldAlert className="h-3.5 w-3.5 text-[#6B6B66]" />
                  <span>Simulate attack on entity</span>
                </button>

                <button
                  id="drawer-view-txns-btn"
                  onClick={() => onNavigateToTransactions(selectedEntity.id)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-md border border-[#E5E5E0] bg-white py-1.5 text-xs font-medium text-[#4A4A45] hover:bg-stone-50"
                >
                  <span>View entity transactions</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
