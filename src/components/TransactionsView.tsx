import React, { useState, useMemo } from 'react';
import { Search, Filter, X, ShieldAlert, ArrowRight, ArrowUpDown, CheckCircle2, Ban } from 'lucide-react';
import { Transaction, RiskLevel } from '../types';

interface TransactionsViewProps {
  transactions: Transaction[];
  onUpdateStatus: (id: string, newStatus: Transaction['status']) => void;
  onOpenInvestigation: (merchantId: string) => void;
  initialFilterEntityId?: string;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  onUpdateStatus,
  onOpenInvestigation,
  initialFilterEntityId,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialFilterEntityId || '');
  const [statusFilter, setStatusFilter] = useState<'All' | Transaction['status']>('All');
  const [riskFilter, setRiskFilter] = useState<'All' | RiskLevel>('All');
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        txn.id.toLowerCase().includes(term) ||
        txn.customer.toLowerCase().includes(term) ||
        txn.merchant.toLowerCase().includes(term) ||
        txn.merchantId.toLowerCase().includes(term) ||
        txn.device.toLowerCase().includes(term);

      const matchesStatus = statusFilter === 'All' || txn.status === statusFilter;
      const matchesRisk = riskFilter === 'All' || txn.riskLevel === riskFilter;

      return matchesSearch && matchesStatus && matchesRisk;
    });
  }, [transactions, searchTerm, statusFilter, riskFilter]);

  const getRiskBadge = (score: number, level: RiskLevel) => {
    switch (level) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-red-50 px-1.5 py-0.5 text-[11px] font-semibold text-red-700 border border-red-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
            {score}
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-orange-50 px-1.5 py-0.5 text-[11px] font-semibold text-orange-700 border border-orange-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-600"></span>
            {score}
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 text-[11px] font-medium text-amber-700 border border-amber-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-600"></span>
            {score}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded bg-stone-100 px-1.5 py-0.5 text-[11px] font-medium text-stone-600 border border-stone-200">
            <span className="h-1.5 w-1.5 rounded-full bg-stone-400"></span>
            {score}
          </span>
        );
    }
  };

  const getStatusLabel = (status: Transaction['status']) => {
    switch (status) {
      case 'Completed':
        return <span className="text-[11px] font-medium text-emerald-700">Completed</span>;
      case 'Review':
        return <span className="text-[11px] font-medium text-amber-800">Review</span>;
      case 'Blocked':
        return <span className="text-[11px] font-medium text-red-700">Blocked</span>;
      case 'Refunded':
        return <span className="text-[11px] text-stone-600">Refunded</span>;
    }
  };

  return (
    <div className="relative mx-auto max-w-7xl space-y-4">
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-[#1A1A1A]">Transactions</h2>
        <p className="text-xs text-[#6B6B66]">
          Real-time transaction stream with automated scoring and risk heuristics.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[#E5E5E0] bg-white p-3">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8A8A85]" />
          <input
            id="search-transactions-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, customer, merchant, or device..."
            className="h-8 w-full rounded-md border border-[#E5E5E0] bg-[#F7F7F5] pl-8 pr-3 text-xs text-[#1A1A1A] placeholder-[#8A8A85] focus:border-stone-400 focus:bg-white focus:outline-none"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-[#8A8A85]">Risk:</span>
            {(['All', 'low', 'medium', 'high', 'critical'] as const).map((r) => (
              <button
                key={r}
                id={`txn-filter-risk-${r}`}
                onClick={() => setRiskFilter(r as any)}
                className={`rounded px-2 py-0.5 text-[11px] font-medium capitalize transition-colors ${
                  riskFilter === r
                    ? 'bg-[#1A1A1A] text-white'
                    : 'bg-[#F2F2EE] text-[#4A4A45] hover:bg-stone-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[11px] text-[#8A8A85]">Status:</span>
            {(['All', 'Completed', 'Review', 'Blocked'] as const).map((s) => (
              <button
                key={s}
                id={`txn-filter-status-${s.toLowerCase()}`}
                onClick={() => setStatusFilter(s as any)}
                className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${
                  statusFilter === s
                    ? 'bg-[#1A1A1A] text-white'
                    : 'bg-[#F2F2EE] text-[#4A4A45] hover:bg-stone-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions Data Table */}
      <div className="rounded-md border border-[#E5E5E0] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#E5E5E0] bg-[#FAFAF8] text-[11px] font-medium text-[#6B6B66]">
              <tr>
                <th className="px-4 py-2.5">Transaction ID</th>
                <th className="px-4 py-2.5">Time</th>
                <th className="px-4 py-2.5">Amount</th>
                <th className="px-4 py-2.5">Customer</th>
                <th className="px-4 py-2.5">Merchant</th>
                <th className="px-4 py-2.5">Device</th>
                <th className="px-4 py-2.5">Risk</th>
                <th className="px-4 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E0]">
              {filteredTransactions.map((txn) => (
                <tr
                  key={txn.id}
                  id={`txn-row-${txn.id}`}
                  onClick={() => setSelectedTxn(txn)}
                  className="group cursor-pointer hover:bg-[#F9F9F7]"
                >
                  <td className="whitespace-nowrap px-4 py-3 font-mono font-medium text-[#1A1A1A] group-hover:underline">
                    {txn.id}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[11px] text-[#8A8A85]">
                    {txn.time}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono font-semibold text-[#1A1A1A]">
                    {txn.amount}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[#3A3A35]">{txn.customer}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-[#3A3A35]">{txn.merchant}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-[11px] text-stone-600">
                    {txn.device}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {getRiskBadge(txn.riskScore, txn.riskLevel)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{getStatusLabel(txn.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Inspection Drawer */}
      {selectedTxn && (
        <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-[#E5E5E0] bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-[#E5E5E0] p-4">
            <div>
              <span className="font-mono text-xs text-[#8A8A85]">{selectedTxn.id}</span>
              <h3 className="text-base font-bold tracking-tight text-[#1A1A1A]">
                {selectedTxn.amount}
              </h3>
            </div>
            <button
              onClick={() => setSelectedTxn(null)}
              className="rounded p-1 text-[#8A8A85] hover:bg-stone-100 hover:text-[#1A1A1A]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {/* Summary details */}
            <div className="grid grid-cols-2 gap-3 rounded border border-[#E5E5E0] bg-[#FAFAF8] p-3">
              <div>
                <div className="text-[10px] text-[#8A8A85]">Risk Score</div>
                <div className="mt-0.5 text-lg font-bold text-[#1A1A1A]">
                  {selectedTxn.riskScore} / 100
                </div>
              </div>
              <div>
                <div className="text-[10px] text-[#8A8A85]">Current Status</div>
                <div className="mt-0.5 text-sm font-semibold text-[#1A1A1A]">
                  {selectedTxn.status}
                </div>
              </div>
            </div>

            {/* Signals list (explicitly requested in Section 12) */}
            <div>
              <h4 className="text-xs font-semibold text-[#1A1A1A]">Signals:</h4>
              <div className="mt-2 space-y-1.5">
                {selectedTxn.signals.map((sig, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 rounded border border-[#E5E5E0] bg-white p-2 text-xs text-[#3A3A35]"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-600"></span>
                    <span>{sig}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical payload attributes */}
            <div className="space-y-2 border-t border-[#E5E5E0] pt-3 text-xs">
              <h4 className="font-semibold text-[#1A1A1A]">Authorization telemetry</h4>
              <div className="space-y-1.5">
                <div className="flex justify-between py-1 border-b border-[#F2F2EE]">
                  <span className="text-[#8A8A85]">Customer:</span>
                  <span className="font-medium text-[#1A1A1A]">{selectedTxn.customer}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F2F2EE]">
                  <span className="text-[#8A8A85]">Merchant:</span>
                  <span className="font-medium text-[#1A1A1A]">{selectedTxn.merchant}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F2F2EE]">
                  <span className="text-[#8A8A85]">Channel:</span>
                  <span className="font-medium text-[#1A1A1A]">{selectedTxn.channel}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F2F2EE]">
                  <span className="text-[#8A8A85]">Hardware Device:</span>
                  <span className="font-mono text-[#1A1A1A]">{selectedTxn.device}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F2F2EE]">
                  <span className="text-[#8A8A85]">IP Subnet:</span>
                  <span className="font-mono text-[#1A1A1A]">{selectedTxn.ip}</span>
                </div>
                {selectedTxn.cardBin && (
                  <div className="flex justify-between py-1 border-b border-[#F2F2EE]">
                    <span className="text-[#8A8A85]">Card BIN:</span>
                    <span className="font-mono text-[#1A1A1A]">{selectedTxn.cardBin}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 border-t border-[#E5E5E0] pt-4">
              <button
                id="hold-txn-action-btn"
                onClick={() => {
                  onUpdateStatus(selectedTxn.id, 'Blocked');
                  setSelectedTxn({ ...selectedTxn, status: 'Blocked' });
                }}
                className="flex w-full items-center justify-center gap-1.5 rounded-md border border-red-200 bg-red-50 py-2 text-xs font-medium text-red-800 hover:bg-red-100"
              >
                <Ban className="h-3.5 w-3.5" />
                <span>Hold / Block transaction</span>
              </button>

              <button
                id="release-txn-action-btn"
                onClick={() => {
                  onUpdateStatus(selectedTxn.id, 'Completed');
                  setSelectedTxn({ ...selectedTxn, status: 'Completed' });
                }}
                className="flex w-full items-center justify-center gap-1.5 rounded-md border border-[#E5E5E0] bg-white py-2 text-xs font-medium text-[#1A1A1A] hover:bg-stone-50"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Release transaction</span>
              </button>

              <button
                id="escalate-txn-investigation-btn"
                onClick={() => onOpenInvestigation(selectedTxn.merchantId)}
                className="flex w-full items-center justify-center gap-1.5 rounded-md bg-[#1A1A1A] py-2 text-xs font-medium text-white hover:bg-stone-800"
              >
                <span>Escalate to investigation</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
