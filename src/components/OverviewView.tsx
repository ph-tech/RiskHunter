import React, { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Shield,
  Activity,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { Investigation, PageId } from '../types';
import { ACTIVITY_7_DAYS, RISK_DISTRIBUTION } from '../data/mockData';

interface OverviewViewProps {
  investigations: Investigation[];
  onSelectInvestigation: (inv: Investigation) => void;
  onNavigate: (page: PageId) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  investigations,
  onSelectInvestigation,
  onNavigate,
}) => {
  const [metricMode, setMetricMode] = useState<'volume' | 'count'>('volume');
  const recentList = investigations.slice(0, 4);

  const getRiskBadge = (level: string) => {
    switch (level.toLowerCase()) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1.5 rounded border border-red-200 bg-red-50/60 px-1.5 py-0.5 text-[11px] font-medium text-red-700">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
            Critical
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1.5 rounded border border-orange-200 bg-orange-50/60 px-1.5 py-0.5 text-[11px] font-medium text-orange-700">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-600"></span>
            High
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50/60 px-1.5 py-0.5 text-[11px] font-medium text-amber-700">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-600"></span>
            Medium
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded border border-stone-200 bg-stone-100 px-1.5 py-0.5 text-[11px] font-medium text-stone-700">
            <span className="h-1.5 w-1.5 rounded-full bg-stone-400"></span>
            Low
          </span>
        );
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Investigating':
        return <span className="text-xs font-medium text-amber-700">Investigating</span>;
      case 'Escalated':
        return <span className="text-xs font-medium text-red-700">Escalated</span>;
      case 'Review':
        return <span className="text-xs font-medium text-stone-700">Review</span>;
      case 'Resolved':
        return <span className="text-xs font-medium text-emerald-700">Resolved</span>;
      default:
        return <span className="text-xs text-stone-600">{status}</span>;
    }
  };

  // Max value for 7-day activity bars
  const maxVal = metricMode === 'volume' ? 7.5 : 90;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Top Title & Context */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-[#1A1A1A]">Risk overview</h2>
          <p className="text-xs text-[#6B6B66]">
            Monitor emerging payment risk, investigate suspicious networks and test new controls.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#8A8A85]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          <span>Telemetry stream active</span>
          <span className="text-[#BDBDB7]">•</span>
          <span>Last updated 2 min ago</span>
        </div>
      </div>

      {/* 4 Compact Operational KPI Blocks */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* KPI 1 */}
        <div
          id="kpi-active-investigations"
          onClick={() => onNavigate('investigations')}
          className="group cursor-pointer rounded-md border border-[#E5E5E0] bg-white p-3.5 transition-colors hover:border-stone-400"
        >
          <div className="flex items-center justify-between text-xs text-[#6B6B66]">
            <span>Active investigations</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-[#8A8A85] opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <div className="mt-1.5 text-2xl font-semibold tracking-tight text-[#1A1A1A]">12</div>
          <div className="mt-1 text-[11px] text-[#8A8A85]">
            <span className="font-medium text-stone-700">+2</span> new in last 2 hrs
          </div>
        </div>

        {/* KPI 2 */}
        <div
          id="kpi-high-risk-entities"
          onClick={() => onNavigate('entities')}
          className="group cursor-pointer rounded-md border border-[#E5E5E0] bg-white p-3.5 transition-colors hover:border-stone-400"
        >
          <div className="flex items-center justify-between text-xs text-[#6B6B66]">
            <span>High-risk entities</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-[#8A8A85] opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <div className="mt-1.5 text-2xl font-semibold tracking-tight text-[#1A1A1A]">38</div>
          <div className="mt-1 text-[11px] text-[#8A8A85]">
            <span className="font-medium text-amber-700">14 merchants</span>, 24 accounts
          </div>
        </div>

        {/* KPI 3 */}
        <div
          id="kpi-suspicious-networks"
          onClick={() => onNavigate('network')}
          className="group cursor-pointer rounded-md border border-[#E5E5E0] bg-white p-3.5 transition-colors hover:border-stone-400"
        >
          <div className="flex items-center justify-between text-xs text-[#6B6B66]">
            <span>Suspicious networks</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-[#8A8A85] opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <div className="mt-1.5 text-2xl font-semibold tracking-tight text-[#1A1A1A]">7</div>
          <div className="mt-1 text-[11px] text-[#8A8A85]">
            <span className="font-medium text-red-700">2 coordinated</span> syndicates
          </div>
        </div>

        {/* KPI 4 */}
        <div
          id="kpi-potential-exposure"
          className="rounded-md border border-[#E5E5E0] bg-white p-3.5"
        >
          <div className="flex items-center justify-between text-xs text-[#6B6B66]">
            <span>Potential exposure</span>
            <span className="rounded bg-amber-50 px-1 py-0.5 text-[10px] font-medium text-amber-800">
              ₹14.2L held
            </span>
          </div>
          <div className="mt-1.5 text-2xl font-semibold tracking-tight text-[#1A1A1A]">₹18.4L</div>
          <div className="mt-1 text-[11px] text-[#8A8A85]">
            Across trailing 72 hours
          </div>
        </div>
      </div>

      {/* Two-Column Section: Risk Activity & Risk Distribution */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* LEFT (2 cols): Risk activity */}
        <div className="rounded-md border border-[#E5E5E0] bg-white p-4 lg:col-span-2">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-xs font-semibold tracking-tight text-[#1A1A1A]">Risk activity</h3>
              <p className="text-[11px] text-[#6B6B66]">
                Suspicious payment activity over trailing 7 days
              </p>
            </div>
            <div className="flex items-center gap-1 rounded border border-[#E5E5E0] bg-[#F7F7F5] p-0.5 text-xs">
              <button
                id="toggle-metric-volume"
                onClick={() => setMetricMode('volume')}
                className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${
                  metricMode === 'volume'
                    ? 'bg-white text-[#1A1A1A] shadow-sm'
                    : 'text-[#6B6B66] hover:text-[#1A1A1A]'
                }`}
              >
                Volume (₹)
              </button>
              <button
                id="toggle-metric-count"
                onClick={() => setMetricMode('count')}
                className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${
                  metricMode === 'count'
                    ? 'bg-white text-[#1A1A1A] shadow-sm'
                    : 'text-[#6B6B66] hover:text-[#1A1A1A]'
                }`}
              >
                Flag count
              </button>
            </div>
          </div>

          {/* Activity Visualizer: Clean, functional bar chart */}
          <div className="mt-5">
            <div className="flex h-44 items-end gap-2 border-b border-[#E5E5E0] pb-2 sm:gap-4">
              {ACTIVITY_7_DAYS.map((d) => {
                const val = metricMode === 'volume' ? d.suspiciousVolume : d.flagCount;
                const heightPct = Math.round((val / maxVal) * 100);
                return (
                  <div key={d.day} className="group relative flex flex-1 flex-col items-center">
                    {/* Tooltip on hover */}
                    <div className="pointer-events-none absolute -top-12 z-20 hidden w-44 rounded border border-[#E5E5E0] bg-white p-1.5 text-[11px] text-[#1A1A1A] shadow-sm group-hover:block">
                      <div className="font-semibold">{d.day} Activity</div>
                      <div className="text-[10px] text-[#6B6B66]">
                        {metricMode === 'volume' ? `₹${d.suspiciousVolume}L volume` : `${d.flagCount} flags`}
                      </div>
                      {d.hasSpike && (
                        <div className="mt-0.5 text-[10px] text-amber-700">
                          {d.spikeReason}
                        </div>
                      )}
                    </div>

                    {/* Bar */}
                    <div className="relative flex h-36 w-full items-end justify-center">
                      <div
                        style={{ height: `${heightPct}%` }}
                        className={`w-full max-w-[40px] rounded-t transition-all ${
                          d.hasSpike
                            ? 'border-t-2 border-amber-600 bg-amber-200/80 hover:bg-amber-300'
                            : 'bg-stone-200 hover:bg-stone-300'
                        }`}
                      >
                        {d.hasSpike && (
                          <div className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold text-amber-800">
                            Spike
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Day label */}
                    <span className="mt-2 text-[11px] font-medium text-[#6B6B66]">{d.day}</span>
                  </div>
                );
              })}
            </div>

            {/* Explanatory footnote for risk ops */}
            <div className="mt-3 flex items-center justify-between text-[11px] text-[#8A8A85]">
              <span>Baseline threshold: ₹2.2L / day</span>
              <span className="text-amber-800">
                Friday spike: Coordinated merchant syndicate burst (+283% vs baseline)
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT (1 col): Risk distribution */}
        <div className="rounded-md border border-[#E5E5E0] bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold tracking-tight text-[#1A1A1A]">
                Risk distribution
              </h3>
              <p className="text-[11px] text-[#6B6B66]">Evaluated across 1,823 entities</p>
            </div>
          </div>

          {/* Subtle multi-segment stacked bar */}
          <div className="mt-4 flex h-2.5 w-full overflow-hidden rounded bg-stone-100">
            {RISK_DISTRIBUTION.map((item) => (
              <div
                key={item.label}
                style={{ width: `${item.percentage}%` }}
                className={item.barColor}
                title={`${item.label}: ${item.percentage}%`}
              />
            ))}
          </div>

          {/* Breakdown items */}
          <div className="mt-4 divide-y divide-[#E5E5E0]">
            {RISK_DISTRIBUTION.map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${item.barColor}`}></span>
                  <span className="text-[#4A4A45]">{item.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-[#8A8A85]">{item.count} entities</span>
                  <span className={`font-semibold ${item.color}`}>{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded border border-[#E5E5E0] bg-[#FAFAF8] p-2.5 text-[11px] text-[#6B6B66]">
            <span className="font-medium text-[#1A1A1A]">11% High + Critical</span> requires immediate analyst action under current risk appetite threshold.
          </div>
        </div>
      </div>

      {/* Recent Investigations Table */}
      <div className="rounded-md border border-[#E5E5E0] bg-white">
        <div className="flex items-center justify-between border-b border-[#E5E5E0] px-4 py-3">
          <div>
            <h3 className="text-xs font-semibold tracking-tight text-[#1A1A1A]">
              Recent investigations
            </h3>
            <p className="text-[11px] text-[#6B6B66]">Prioritized by risk severity and recency</p>
          </div>
          <button
            id="view-all-investigations-btn"
            onClick={() => onNavigate('investigations')}
            className="flex items-center gap-1 text-xs font-medium text-[#1A1A1A] hover:text-[#6B6B66]"
          >
            <span>View all</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#E5E5E0] bg-[#FAFAF8] text-[11px] font-medium text-[#6B6B66]">
              <tr>
                <th className="px-4 py-2.5">Investigation</th>
                <th className="px-4 py-2.5">Entity</th>
                <th className="px-4 py-2.5">Risk</th>
                <th className="px-4 py-2.5">Reason</th>
                <th className="px-4 py-2.5">Updated</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E0]">
              {recentList.map((inv) => (
                <tr
                  key={inv.id}
                  id={`recent-inv-row-${inv.id}`}
                  onClick={() => onSelectInvestigation(inv)}
                  className="group cursor-pointer transition-colors hover:bg-[#F9F9F7]"
                >
                  <td className="whitespace-nowrap px-4 py-3 font-mono font-medium text-[#1A1A1A] group-hover:underline">
                    {inv.id}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="font-medium text-[#1A1A1A]">{inv.entityName}</span>
                    <span className="ml-1.5 text-[10px] text-[#8A8A85]">({inv.entityType})</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {getRiskBadge(inv.riskLevel)}
                  </td>
                  <td className="px-4 py-3 text-[#4A4A45]">{inv.primarySignal}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-[11px] text-[#8A8A85]">
                    {inv.updated}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{getStatusLabel(inv.status)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <span className="inline-flex items-center gap-0.5 text-xs font-medium text-[#1A1A1A] group-hover:text-stone-600">
                      Inspect
                      <ChevronRight className="h-3 w-3" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
