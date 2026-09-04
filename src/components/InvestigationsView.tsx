import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, ChevronRight } from 'lucide-react';
import { Investigation, RiskLevel, InvestigationStatus } from '../types';

interface InvestigationsViewProps {
  investigations: Investigation[];
  onSelectInvestigation: (inv: Investigation) => void;
  externalSearch?: string;
}

export const InvestigationsView: React.FC<InvestigationsViewProps> = ({
  investigations,
  onSelectInvestigation,
  externalSearch = '',
}) => {
  const [searchTerm, setSearchTerm] = useState(externalSearch);
  const [selectedRisk, setSelectedRisk] = useState<'All' | RiskLevel>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | InvestigationStatus>('All');
  const [dateRange, setDateRange] = useState<'24h' | '7d' | '30d'>('7d');
  const [sortField, setSortField] = useState<'riskScore' | 'updated'>('riskScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredInvestigations = useMemo(() => {
    return investigations
      .filter((inv) => {
        // Search term
        const term = searchTerm.toLowerCase().trim();
        const matchesSearch =
          !term ||
          inv.id.toLowerCase().includes(term) ||
          inv.entityName.toLowerCase().includes(term) ||
          inv.primarySignal.toLowerCase().includes(term) ||
          inv.explanation.toLowerCase().includes(term);

        // Risk filter
        const matchesRisk =
          selectedRisk === 'All' || inv.riskLevel.toLowerCase() === selectedRisk.toLowerCase();

        // Status filter
        const matchesStatus =
          selectedStatus === 'All' || inv.status.toLowerCase() === selectedStatus.toLowerCase();

        return matchesSearch && matchesRisk && matchesStatus;
      })
      .sort((a, b) => {
        if (sortField === 'riskScore') {
          return sortOrder === 'desc' ? b.riskScore - a.riskScore : a.riskScore - b.riskScore;
        }
        return 0; // Default order
      });
  }, [investigations, searchTerm, selectedRisk, selectedStatus, sortField, sortOrder]);

  const toggleSort = (field: 'riskScore' | 'updated') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getRiskBadge = (level: string, score: number) => {
    switch (level.toLowerCase()) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1.5 rounded border border-red-200 bg-red-50/70 px-2 py-0.5 text-[11px] font-medium text-red-700">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
            Critical ({score})
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1.5 rounded border border-orange-200 bg-orange-50/70 px-2 py-0.5 text-[11px] font-medium text-orange-700">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-600"></span>
            High ({score})
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50/70 px-2 py-0.5 text-[11px] font-medium text-amber-700">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-600"></span>
            Medium ({score})
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded border border-stone-200 bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-700">
            <span className="h-1.5 w-1.5 rounded-full bg-stone-400"></span>
            Low ({score})
          </span>
        );
    }
  };

  const getStatusLabel = (status: InvestigationStatus) => {
    switch (status) {
      case 'Investigating':
        return (
          <span className="rounded bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800 border border-amber-200/60">
            Investigating
          </span>
        );
      case 'Escalated':
        return (
          <span className="rounded bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-800 border border-red-200/60">
            Escalated
          </span>
        );
      case 'Review':
        return (
          <span className="rounded bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-800 border border-stone-200">
            Review
          </span>
        );
      case 'Resolved':
        return (
          <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800 border border-emerald-200/60">
            Resolved
          </span>
        );
      default:
        return (
          <span className="rounded bg-stone-100 px-2 py-0.5 text-[11px] text-stone-600">
            Open
          </span>
        );
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-4">
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-[#1A1A1A]">Investigations</h2>
        <p className="text-xs text-[#6B6B66]">
          Review suspicious activity and understand why an entity was flagged.
        </p>
      </div>

      {/* Top Filter Controls */}
      <div className="rounded-md border border-[#E5E5E0] bg-white p-3 space-y-3">
        <div className="flex flex-col gap-2.5 md:flex-row md:items-center md:justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8A8A85]" />
            <input
              id="investigations-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search investigations by ID, merchant, account, or signal..."
              className="h-8 w-full rounded-md border border-[#E5E5E0] bg-[#F7F7F5] pl-8 pr-3 text-xs text-[#1A1A1A] placeholder-[#8A8A85] focus:border-stone-400 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Date Range Selector */}
          <div className="flex items-center gap-1 self-start rounded border border-[#E5E5E0] bg-[#F7F7F5] p-0.5 text-xs md:self-auto">
            {(['24h', '7d', '30d'] as const).map((range) => (
              <button
                key={range}
                id={`filter-daterange-${range}`}
                onClick={() => setDateRange(range)}
                className={`rounded px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  dateRange === range
                    ? 'bg-white text-[#1A1A1A] shadow-xs'
                    : 'text-[#6B6B66] hover:text-[#1A1A1A]'
                }`}
              >
                {range === '24h' ? 'Last 24h' : range === '7d' ? 'Last 7 days' : 'Last 30 days'}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Pills Row */}
        <div className="flex flex-wrap items-center gap-4 border-t border-[#E5E5E0] pt-2.5 text-xs">
          {/* Risk Filters */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-[#8A8A85]">Risk:</span>
            <div className="flex items-center gap-1">
              {(['All', 'Low', 'Medium', 'High', 'Critical'] as const).map((r) => (
                <button
                  key={r}
                  id={`filter-risk-${r.toLowerCase()}`}
                  onClick={() => setSelectedRisk(r as any)}
                  className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${
                    selectedRisk === r
                      ? 'bg-[#1A1A1A] text-white'
                      : 'bg-[#F2F2EE] text-[#4A4A45] hover:bg-stone-200 hover:text-[#1A1A1A]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-[#8A8A85]">Status:</span>
            <div className="flex items-center gap-1">
              {(['All', 'Open', 'Investigating', 'Review', 'Escalated', 'Resolved'] as const).map(
                (s) => (
                  <button
                    key={s}
                    id={`filter-status-${s.toLowerCase()}`}
                    onClick={() => setSelectedStatus(s as any)}
                    className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${
                      selectedStatus === s
                        ? 'bg-[#1A1A1A] text-white'
                        : 'bg-[#F2F2EE] text-[#4A4A45] hover:bg-stone-200 hover:text-[#1A1A1A]'
                    }`}
                  >
                    {s}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Result Count */}
          <div className="ml-auto text-[11px] text-[#8A8A85]">
            Showing <span className="font-medium text-[#1A1A1A]">{filteredInvestigations.length}</span> of{' '}
            {investigations.length} investigations
          </div>
        </div>
      </div>

      {/* Investigations Data Table */}
      <div className="rounded-md border border-[#E5E5E0] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#E5E5E0] bg-[#FAFAF8] text-[11px] font-medium text-[#6B6B66]">
              <tr>
                <th className="px-4 py-2.5">ID</th>
                <th className="px-4 py-2.5">Entity</th>
                <th className="px-4 py-2.5">Type</th>
                <th
                  className="cursor-pointer px-4 py-2.5 hover:text-[#1A1A1A]"
                  onClick={() => toggleSort('riskScore')}
                >
                  <div className="flex items-center gap-1">
                    <span>Risk score</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-2.5">Primary signal</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5">Last activity</th>
                <th className="px-4 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E0]">
              {filteredInvestigations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-xs text-[#8A8A85]">
                    No investigations match current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredInvestigations.map((inv) => (
                  <tr
                    key={inv.id}
                    id={`inv-row-${inv.id}`}
                    onClick={() => onSelectInvestigation(inv)}
                    className="group cursor-pointer transition-colors hover:bg-[#F9F9F7]"
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-mono font-medium text-[#1A1A1A] group-hover:underline">
                      {inv.id}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-[#1A1A1A]">
                      {inv.entityName}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-stone-600">
                      {inv.entityType}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {getRiskBadge(inv.riskLevel, inv.riskScore)}
                    </td>
                    <td className="px-4 py-3 text-[#3A3A35] max-w-xs truncate">
                      {inv.primarySignal}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {getStatusLabel(inv.status)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-[11px] text-[#8A8A85]">
                      {inv.updated}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <button
                        id={`open-detail-${inv.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectInvestigation(inv);
                        }}
                        className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-[#1A1A1A] group-hover:bg-stone-200"
                      >
                        Inspect
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
