import React, { useState, useMemo } from 'react';
import { Search, Store, User, Smartphone, Globe, CreditCard, Network, ArrowRight, X } from 'lucide-react';
import { EntityNode, EntityType, RiskLevel, PageId } from '../types';
import { NETWORK_ENTITIES } from '../data/mockData';

interface EntitiesViewProps {
  onNavigateToNetwork: (entityId: string) => void;
  onNavigateToTransactions: (entityId: string) => void;
  onOpenInvestigation: (entityId: string) => void;
}

export const EntitiesView: React.FC<EntitiesViewProps> = ({
  onNavigateToNetwork,
  onNavigateToTransactions,
  onOpenInvestigation,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'All' | EntityType>('All');
  const [selectedEntity, setSelectedEntity] = useState<EntityNode | null>(null);

  const filteredEntities = useMemo(() => {
    return NETWORK_ENTITIES.filter((entity) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        entity.label.toLowerCase().includes(term) ||
        entity.id.toLowerCase().includes(term);
      const matchesType = selectedType === 'All' || entity.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [searchTerm, selectedType]);

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

  const getRiskScoreBadge = (score: number) => {
    if (score >= 85) {
      return (
        <span className="inline-flex items-center gap-1 rounded border border-red-200 bg-red-50 px-1.5 py-0.5 text-[11px] font-semibold text-red-700">
          <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
          {score} / 100
        </span>
      );
    }
    if (score >= 70) {
      return (
        <span className="inline-flex items-center gap-1 rounded border border-orange-200 bg-orange-50 px-1.5 py-0.5 text-[11px] font-semibold text-orange-700">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-600"></span>
          {score} / 100
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded border border-stone-200 bg-stone-100 px-1.5 py-0.5 text-[11px] font-medium text-stone-600">
        <span className="h-1.5 w-1.5 rounded-full bg-stone-400"></span>
        {score} / 100
      </span>
    );
  };

  const getStatusBadge = (status: EntityNode['status']) => {
    switch (status) {
      case 'Active':
        return <span className="text-[11px] font-medium text-emerald-800">Active</span>;
      case 'Under review':
        return <span className="text-[11px] font-medium text-amber-800">Under review</span>;
      case 'Suspended':
        return <span className="text-[11px] font-medium text-red-700">Suspended</span>;
      default:
        return <span className="text-[11px] text-stone-600">{status}</span>;
    }
  };

  return (
    <div className="relative mx-auto max-w-7xl space-y-4">
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-[#1A1A1A]">Entities</h2>
        <p className="text-xs text-[#6B6B66]">
          Directory of merchants, accounts, hardware devices, and IP subnets tracked by risk telemetry.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[#E5E5E0] bg-white p-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8A8A85]" />
          <input
            id="search-entities-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Accounts, Merchants, Devices, IPs..."
            className="h-8 w-full rounded-md border border-[#E5E5E0] bg-[#F7F7F5] pl-8 pr-3 text-xs text-[#1A1A1A] placeholder-[#8A8A85] focus:border-stone-400 focus:bg-white focus:outline-none"
          />
        </div>

        {/* Entity Type Selector */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {(['All', 'Merchant', 'Account', 'Device', 'IP', 'Card'] as const).map((t) => (
            <button
              key={t}
              id={`entity-filter-${t.toLowerCase()}`}
              onClick={() => setSelectedType(t as any)}
              className={`rounded px-2.5 py-1 text-[11px] font-medium transition-colors ${
                selectedType === t
                  ? 'bg-[#1A1A1A] text-white'
                  : 'bg-[#F2F2EE] text-[#4A4A45] hover:bg-stone-200'
              }`}
            >
              {t === 'Card' ? 'Cards' : `${t}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Entities Table (exact columns: Entity, Type, Risk score, Connections, Activity, Status) */}
      <div className="rounded-md border border-[#E5E5E0] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#E5E5E0] bg-[#FAFAF8] text-[11px] font-medium text-[#6B6B66]">
              <tr>
                <th className="px-4 py-2.5">Entity</th>
                <th className="px-4 py-2.5">Type</th>
                <th className="px-4 py-2.5">Risk score</th>
                <th className="px-4 py-2.5">Connections</th>
                <th className="px-4 py-2.5">Activity</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E0]">
              {filteredEntities.map((ent) => (
                <tr
                  key={ent.id}
                  id={`entity-row-${ent.id}`}
                  onClick={() => setSelectedEntity(ent)}
                  className="group cursor-pointer hover:bg-[#F9F9F7]"
                >
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded bg-stone-100 text-stone-600">
                        {getEntityIcon(ent.type)}
                      </div>
                      <span className="font-medium text-[#1A1A1A] group-hover:underline">
                        {ent.label}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-stone-600">{ent.type}</td>
                  <td className="whitespace-nowrap px-4 py-3">{getRiskScoreBadge(ent.riskScore)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-stone-700">
                    {ent.connections} linked nodes
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[11px] text-[#8A8A85]">
                    {ent.recentActivity}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{getStatusBadge(ent.status)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <button
                      id={`inspect-entity-${ent.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEntity(ent);
                      }}
                      className="rounded border border-[#E5E5E0] bg-white px-2 py-0.5 text-[11px] font-medium text-[#1A1A1A] hover:bg-stone-100"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Entity Details Slide-Over Drawer */}
      {selectedEntity && (
        <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-[#E5E5E0] bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-[#E5E5E0] p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-stone-100 text-stone-700">
                {getEntityIcon(selectedEntity.type)}
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight text-[#1A1A1A]">
                  {selectedEntity.label}
                </h3>
                <div className="text-[10px] text-[#8A8A85]">{selectedEntity.type}</div>
              </div>
            </div>
            <button
              onClick={() => setSelectedEntity(null)}
              className="rounded p-1 text-[#8A8A85] hover:bg-stone-100 hover:text-[#1A1A1A]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 rounded border border-[#E5E5E0] bg-[#FAFAF8] p-3">
              <div>
                <div className="text-[10px] text-[#8A8A85]">Risk Score</div>
                <div className="mt-0.5 text-lg font-bold text-[#1A1A1A]">
                  {selectedEntity.riskScore} / 100
                </div>
              </div>
              <div>
                <div className="text-[10px] text-[#8A8A85]">Status</div>
                <div className="mt-0.5 text-sm font-semibold text-[#1A1A1A]">
                  {selectedEntity.status}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-[#F2F2EE] pb-1.5">
                <span className="text-[#8A8A85]">First seen:</span>
                <span className="font-medium text-[#1A1A1A]">{selectedEntity.firstSeen}</span>
              </div>
              <div className="flex justify-between border-b border-[#F2F2EE] pb-1.5">
                <span className="text-[#8A8A85]">Direct connections:</span>
                <span className="font-medium text-[#1A1A1A]">
                  {selectedEntity.connections} entities
                </span>
              </div>
              {selectedEntity.volume && (
                <div className="flex justify-between border-b border-[#F2F2EE] pb-1.5">
                  <span className="text-[#8A8A85]">Transaction volume:</span>
                  <span className="font-medium text-[#1A1A1A]">{selectedEntity.volume}</span>
                </div>
              )}
            </div>

            {/* Why it matters */}
            <div>
              <h4 className="font-semibold text-[#1A1A1A]">Why it matters:</h4>
              <p className="mt-1 leading-relaxed text-[#4A4A45]">{selectedEntity.whyItMatters}</p>
            </div>

            {/* Actions */}
            <div className="space-y-2 border-t border-[#E5E5E0] pt-4">
              <button
                id="entity-open-in-network"
                onClick={() => onNavigateToNetwork(selectedEntity.id)}
                className="flex w-full items-center justify-center gap-1.5 rounded-md bg-[#1A1A1A] py-2 text-xs font-medium text-white hover:bg-stone-800"
              >
                <Network className="h-3.5 w-3.5" />
                <span>Explore in Risk Network</span>
              </button>

              <button
                id="entity-view-txns"
                onClick={() => onNavigateToTransactions(selectedEntity.id)}
                className="flex w-full items-center justify-center gap-1.5 rounded-md border border-[#E5E5E0] bg-[#F7F7F5] py-2 text-xs font-medium text-[#1A1A1A] hover:bg-stone-200"
              >
                <span>View associated transactions</span>
              </button>

              <button
                id="entity-open-inv"
                onClick={() => onOpenInvestigation(selectedEntity.id)}
                className="flex w-full items-center justify-center gap-1.5 rounded-md border border-[#E5E5E0] bg-white py-2 text-xs font-medium text-[#4A4A45] hover:bg-stone-50"
              >
                <span>Create investigation case</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
