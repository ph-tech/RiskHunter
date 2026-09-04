import React, { useState } from 'react';
import { Plus, Sliders, CheckCircle2, Play, AlertCircle, X, Shield } from 'lucide-react';
import { RiskControl } from '../types';

interface RiskControlsViewProps {
  controls: RiskControl[];
  onAddControl: (control: RiskControl) => void;
  onToggleStatus: (id: string) => void;
  presetSignalTitle?: string;
}

export const RiskControlsView: React.FC<RiskControlsViewProps> = ({
  controls,
  onAddControl,
  onToggleStatus,
  presetSignalTitle,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(Boolean(presetSignalTitle));
  const [name, setName] = useState(
    presetSignalTitle ? `Mitigation: ${presetSignalTitle}` : ''
  );
  const [type, setType] = useState<'Rule' | 'Graph signal' | 'ML signal' | 'Behavioral'>(
    'Rule'
  );
  const [conditions, setConditions] = useState(
    presetSignalTitle
      ? 'Cluster velocity > 4 events per minute across shared device tokens'
      : 'Transaction count exceeds velocity threshold within rolling 180s window'
  );
  const [threshold, setThreshold] = useState('4 txns / 60s');
  const [affectedEntities, setAffectedEntities] = useState('Consumer checkouts & Merchant VPAs');
  const [impact, setImpact] = useState<'High' | 'Medium' | 'Low'>('High');
  const [falsePositives, setFalsePositives] = useState<'Low' | 'Medium' | 'High'>('Low');

  // Historical test status
  const [isTestingHistorical, setIsTestingHistorical] = useState(false);
  const [testResult, setTestResult] = useState<{
    evaluatedCount: number;
    hits: number;
    fpRate: string;
  } | null>(null);

  const handleTestHistorical = () => {
    setIsTestingHistorical(true);
    setTestResult(null);
    setTimeout(() => {
      setIsTestingHistorical(false);
      setTestResult({
        evaluatedCount: 42800,
        hits: 24,
        fpRate: '0.04%',
      });
    }, 800);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCtrl: RiskControl = {
      id: `CTRL-0${controls.length + 1}`,
      name: name.trim(),
      type,
      impact,
      falsePositives,
      status: 'Active',
      lastUpdated: 'Just now',
      conditions,
      threshold,
      affectedEntities,
    };

    onAddControl(newCtrl);
    setIsModalOpen(false);
    // Reset form
    setName('');
    setTestResult(null);
  };

  const getImpactBadge = (val: string) => {
    switch (val) {
      case 'High':
        return <span className="font-semibold text-stone-900">High</span>;
      case 'Medium':
        return <span className="text-stone-700">Medium</span>;
      default:
        return <span className="text-stone-500">Low</span>;
    }
  };

  const getStatusBadge = (status: RiskControl['status']) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[11px] font-medium text-emerald-800 border border-emerald-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
            Active
          </span>
        );
      case 'Testing':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 text-[11px] font-medium text-amber-800 border border-amber-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-600"></span>
            Testing
          </span>
        );
      case 'Paused':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-stone-100 px-1.5 py-0.5 text-[11px] font-medium text-stone-600 border border-stone-200">
            <span className="h-1.5 w-1.5 rounded-full bg-stone-400"></span>
            Paused
          </span>
        );
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-4">
      {/* Title & Subtitle */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-[#1A1A1A]">Risk controls</h2>
          <p className="text-xs text-[#6B6B66]">
            Review and manage the signals used to identify suspicious activity.
          </p>
        </div>
        <button
          id="open-create-control-modal"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 self-start rounded-md bg-[#1A1A1A] px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-800 sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Create control</span>
        </button>
      </div>

      {/* Controls Data Table */}
      <div className="rounded-md border border-[#E5E5E0] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#E5E5E0] bg-[#FAFAF8] text-[11px] font-medium text-[#6B6B66]">
              <tr>
                <th className="px-4 py-2.5">Control</th>
                <th className="px-4 py-2.5">Type</th>
                <th className="px-4 py-2.5">Impact</th>
                <th className="px-4 py-2.5">False positives</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5">Last updated</th>
                <th className="px-4 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E0]">
              {controls.map((ctrl) => (
                <tr key={ctrl.id} id={`control-row-${ctrl.id}`} className="hover:bg-[#F9F9F7]">
                  <td className="px-4 py-3">
                    <div className="font-medium text-[#1A1A1A]">{ctrl.name}</div>
                    {ctrl.conditions && (
                      <div className="text-[11px] text-[#8A8A85] truncate max-w-sm">
                        {ctrl.conditions}
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="rounded border border-stone-200 bg-stone-50 px-1.5 py-0.5 text-[10px] text-stone-700">
                      {ctrl.type}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{getImpactBadge(ctrl.impact)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-stone-600">
                    {ctrl.falsePositives}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{getStatusBadge(ctrl.status)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-[11px] text-[#8A8A85]">
                    {ctrl.lastUpdated}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <button
                      id={`toggle-status-${ctrl.id}`}
                      onClick={() => onToggleStatus(ctrl.id)}
                      className="rounded border border-[#E5E5E0] bg-white px-2 py-0.5 text-[11px] font-medium text-[#4A4A45] hover:bg-stone-100"
                    >
                      {ctrl.status === 'Active' ? 'Pause' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simple "Create Control" Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div
            id="create-control-modal"
            className="w-full max-w-lg rounded-lg border border-[#E5E5E0] bg-white shadow-lg overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-[#E5E5E0] px-5 py-3.5">
              <div>
                <h3 className="text-sm font-semibold text-[#1A1A1A]">Create control</h3>
                <p className="text-[11px] text-[#6B6B66]">
                  Configure detection signal parameters and test against historical volume.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded p-1 text-[#8A8A85] hover:bg-stone-100 hover:text-[#1A1A1A]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-3.5 text-xs">
              {/* Control Name */}
              <div>
                <label className="block text-[11px] font-medium text-[#1A1A1A]">Control name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Cross-device cluster velocity"
                  className="mt-1 h-8 w-full rounded-md border border-[#E5E5E0] bg-[#FAFAF8] px-3 text-xs focus:border-stone-400 focus:bg-white focus:outline-none"
                />
              </div>

              {/* Signal Type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#1A1A1A]">
                    Signal type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="mt-1 h-8 w-full rounded-md border border-[#E5E5E0] bg-[#FAFAF8] px-2 text-xs focus:border-stone-400 focus:bg-white focus:outline-none"
                  >
                    <option value="Rule">Rule</option>
                    <option value="Graph signal">Graph signal</option>
                    <option value="ML signal">ML signal</option>
                    <option value="Behavioral">Behavioral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#1A1A1A]">Threshold</label>
                  <input
                    type="text"
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    placeholder="e.g., 5 txns / 60s"
                    className="mt-1 h-8 w-full rounded-md border border-[#E5E5E0] bg-[#FAFAF8] px-3 text-xs focus:border-stone-400 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Conditions */}
              <div>
                <label className="block text-[11px] font-medium text-[#1A1A1A]">Conditions</label>
                <textarea
                  rows={2}
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                  placeholder="Boolean or expression criteria for trigger evaluation"
                  className="mt-1 w-full rounded-md border border-[#E5E5E0] bg-[#FAFAF8] p-2 text-xs focus:border-stone-400 focus:bg-white focus:outline-none"
                />
              </div>

              {/* Affected Entities */}
              <div>
                <label className="block text-[11px] font-medium text-[#1A1A1A]">
                  Affected entities
                </label>
                <input
                  type="text"
                  value={affectedEntities}
                  onChange={(e) => setAffectedEntities(e.target.value)}
                  placeholder="e.g., All UPI checkout endpoints"
                  className="mt-1 h-8 w-full rounded-md border border-[#E5E5E0] bg-[#FAFAF8] px-3 text-xs focus:border-stone-400 focus:bg-white focus:outline-none"
                />
              </div>

              {/* Test on historical data button */}
              <div className="rounded border border-[#E5E5E0] bg-[#FAFAF8] p-3">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-medium text-[#1A1A1A]">
                    Test on historical data
                  </div>
                  <button
                    type="button"
                    onClick={handleTestHistorical}
                    disabled={isTestingHistorical}
                    className="flex items-center gap-1 rounded border border-[#E5E5E0] bg-white px-2.5 py-1 text-[11px] font-medium text-[#1A1A1A] hover:bg-stone-100 disabled:opacity-60"
                  >
                    <Play className="h-3 w-3 fill-current text-stone-700" />
                    <span>{isTestingHistorical ? 'Evaluating...' : 'Run retroactive test'}</span>
                  </button>
                </div>

                {testResult && (
                  <div className="mt-2 text-[11px] text-emerald-800 space-y-0.5">
                    <div className="font-semibold">Back-test complete (42,800 historical txns):</div>
                    <div>• Flagged 24 transactions across 3 known suspicious clusters</div>
                    <div>• Estimated false-positive rate: {testResult.fpRate}</div>
                  </div>
                )}
              </div>

              {/* Form Action Buttons */}
              <div className="flex justify-end gap-2 border-t border-[#E5E5E0] pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md border border-[#E5E5E0] bg-white px-3 py-1.5 text-xs font-medium text-[#4A4A45] hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="save-new-control-btn"
                  className="rounded-md bg-[#1A1A1A] px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-800"
                >
                  Save control
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
