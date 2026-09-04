import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Play,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Layers,
  ChevronRight,
  Info,
} from 'lucide-react';
import { AttackType, AttackScale, SimulationResultData, RiskControl } from '../types';
import { getSimulationScenario } from '../data/mockData';

interface AttackSimulatorViewProps {
  onAddControlToQueue: (control: Omit<RiskControl, 'id' | 'lastUpdated'>) => void;
  preselectedTargetEntity?: string;
}

export const AttackSimulatorView: React.FC<AttackSimulatorViewProps> = ({
  onAddControlToQueue,
  preselectedTargetEntity,
}) => {
  const [attackType, setAttackType] = useState<AttackType>(
    preselectedTargetEntity ? 'coordinated-merchants' : 'coordinated-merchants'
  );
  const [scale, setScale] = useState<AttackScale>('medium');

  // Custom scenario settings
  const [customVelocity, setCustomVelocity] = useState<number>(6);
  const [customDevices, setCustomDevices] = useState<number>(4);
  const [customTargetVol, setCustomTargetVol] = useState<string>('₹7.2L');

  // Simulation execution state
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(-1);
  const [simulationResult, setSimulationResult] = useState<SimulationResultData | null>(null);

  // Defense state
  const [isDefenseGenerated, setIsDefenseGenerated] = useState(false);
  const [isTestingDefense, setIsTestingDefense] = useState(false);
  const [defenseTestedResult, setDefenseTestedResult] = useState<boolean>(false);
  const [addedToQueueMsg, setAddedToQueueMsg] = useState<string | null>(null);

  const stages = [
    'Generating scenario',
    'Mapping entities',
    'Executing transactions',
    'Applying current controls',
    'Evaluating detection',
  ];

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setCurrentStageIdx(0);
    setSimulationResult(null);
    setIsDefenseGenerated(false);
    setDefenseTestedResult(false);
    setAddedToQueueMsg(null);

    // Multi-stage progression
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step < stages.length) {
        setCurrentStageIdx(step);
      } else {
        clearInterval(interval);
        setIsSimulating(false);
        const result = getSimulationScenario(attackType, scale);
        setSimulationResult(result);
      }
    }, 600);
  };

  const handleGenerateDefense = () => {
    setIsDefenseGenerated(true);
  };

  const handleTestControl = () => {
    setIsTestingDefense(true);
    setTimeout(() => {
      setIsTestingDefense(false);
      setDefenseTestedResult(true);
    }, 900);
  };

  const handleAddToQueue = () => {
    if (!simulationResult) return;
    onAddControlToQueue({
      name: simulationResult.suggestedControl.title,
      type: 'Graph signal',
      impact: 'High',
      falsePositives: 'Low',
      status: 'Testing',
      conditions: simulationResult.suggestedControl.signal,
      threshold: 'Cross-device cluster velocity > 3 txns/min',
      affectedEntities: 'Connected merchant-account rings',
    });
    setAddedToQueueMsg(
      `Control "${simulationResult.suggestedControl.title}" successfully appended to the review queue as 'Testing'.`
    );
    setTimeout(() => setAddedToQueueMsg(null), 5000);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-[#1A1A1A]">Attack simulator</h2>
        <p className="text-xs text-[#6B6B66]">
          Test how existing controls respond to simulated fraud strategies.
        </p>
      </div>

      {/* Target notification if coming from network node */}
      {preselectedTargetEntity && (
        <div className="flex items-center gap-2 rounded-md border border-stone-200 bg-stone-50 px-3.5 py-2 text-xs text-stone-700">
          <Info className="h-3.5 w-3.5 text-stone-500" />
          <span>
            Targeting simulation topology centered around entity{' '}
            <strong className="font-mono text-stone-900">{preselectedTargetEntity}</strong>.
          </span>
        </div>
      )}

      {/* Banner explanation as requested */}
      <div className="rounded-md border border-[#E5E5E0] bg-[#FAFAF8] p-3.5 text-xs text-[#4A4A45]">
        Generate a synthetic attack scenario and test whether current controls would detect it.
      </div>

      {/* Configuration Area */}
      <div className="rounded-md border border-[#E5E5E0] bg-white p-5 space-y-5">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6B6B66]">
            Configuration
          </h3>
          <h4 className="text-sm font-semibold tracking-tight text-[#1A1A1A]">
            Define synthetic scenario
          </h4>
        </div>

        {/* Attack Type Selector */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-[#1A1A1A]">Attack type:</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {[
              { id: 'coordinated-merchants', label: 'Coordinated merchants' },
              { id: 'account-takeover', label: 'Account takeover' },
              { id: 'transaction-splitting', label: 'Transaction splitting' },
              { id: 'refund-abuse', label: 'Refund abuse' },
              { id: 'synthetic-identity', label: 'Synthetic identity' },
              { id: 'custom', label: 'Custom scenario' },
            ].map((t) => (
              <button
                key={t.id}
                id={`attack-type-${t.id}`}
                onClick={() => {
                  setAttackType(t.id as AttackType);
                  setSimulationResult(null);
                  setIsDefenseGenerated(false);
                }}
                className={`flex items-center justify-between rounded-md border px-3 py-2 text-left text-xs transition-colors ${
                  attackType === t.id
                    ? 'border-[#1A1A1A] bg-[#F2F2EE] font-medium text-[#1A1A1A]'
                    : 'border-[#E5E5E0] bg-white text-[#4A4A45] hover:bg-[#F9F9F7]'
                }`}
              >
                <span>{t.label}</span>
                {attackType === t.id && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1A1A1A]"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Scenario Parameter Controls */}
        {attackType === 'custom' && (
          <div className="rounded-md border border-[#E5E5E0] bg-[#FAFAF8] p-3.5 space-y-3">
            <div className="text-xs font-semibold text-[#1A1A1A]">Custom attack parameters</div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
              <div>
                <label className="text-[11px] text-[#6B6B66]">Injection velocity (tx/min)</label>
                <input
                  type="number"
                  value={customVelocity}
                  onChange={(e) => setCustomVelocity(Number(e.target.value))}
                  className="mt-1 h-7 w-full rounded border border-[#E5E5E0] bg-white px-2 text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#6B6B66]">Spoofed hardware nodes</label>
                <input
                  type="number"
                  value={customDevices}
                  onChange={(e) => setCustomDevices(Number(e.target.value))}
                  className="mt-1 h-7 w-full rounded border border-[#E5E5E0] bg-white px-2 text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#6B6B66]">Target volume</label>
                <input
                  type="text"
                  value={customTargetVol}
                  onChange={(e) => setCustomTargetVol(e.target.value)}
                  className="mt-1 h-7 w-full rounded border border-[#E5E5E0] bg-white px-2 text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* Attack Scale Selector */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-[#1A1A1A]">Attack scale:</label>
          <div className="flex gap-2">
            {[
              { id: 'small', label: 'Small', desc: '50–120 transactions' },
              { id: 'medium', label: 'Medium', desc: '300–500 transactions' },
              { id: 'large', label: 'Large', desc: '1,000+ transactions' },
            ].map((s) => (
              <button
                key={s.id}
                id={`attack-scale-${s.id}`}
                onClick={() => {
                  setScale(s.id as AttackScale);
                  setSimulationResult(null);
                  setIsDefenseGenerated(false);
                }}
                className={`flex-1 rounded-md border p-2 text-left text-xs transition-colors ${
                  scale === s.id
                    ? 'border-[#1A1A1A] bg-[#F2F2EE] font-medium text-[#1A1A1A]'
                    : 'border-[#E5E5E0] bg-white text-[#4A4A45] hover:bg-[#F9F9F7]'
                }`}
              >
                <div className="font-medium">{s.label}</div>
                <div className="text-[10px] text-[#8A8A85]">{s.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Primary Simulation Button (Clean, understated, not flashy) */}
        <div className="pt-2">
          <button
            id="run-simulation-btn"
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="flex items-center justify-center gap-2 rounded-md bg-[#1A1A1A] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-stone-800 disabled:opacity-60"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>{isSimulating ? 'Running simulation...' : 'Run simulation'}</span>
          </button>
        </div>
      </div>

      {/* Progress State during execution */}
      {isSimulating && (
        <div className="rounded-md border border-[#E5E5E0] bg-white p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#1A1A1A]">Simulation in progress</span>
            <span className="font-mono text-xs text-[#8A8A85]">
              Stage {currentStageIdx + 1} of {stages.length}
            </span>
          </div>

          <div className="space-y-2">
            {stages.map((stg, idx) => {
              const isDone = idx < currentStageIdx;
              const isCurrent = idx === currentStageIdx;
              return (
                <div
                  key={stg}
                  className={`flex items-center justify-between rounded border px-3 py-2 text-xs transition-colors ${
                    isCurrent
                      ? 'border-stone-400 bg-stone-100 font-medium text-[#1A1A1A]'
                      : isDone
                      ? 'border-[#E5E5E0] bg-[#FAFAF8] text-[#6B6B66]'
                      : 'border-transparent text-[#BDBDB7]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isDone ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-stone-700" />
                    ) : isCurrent ? (
                      <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-stone-800 border-t-transparent" />
                    ) : (
                      <span className="inline-block h-3.5 w-3.5 rounded-full border border-stone-300" />
                    )}
                    <span>{stg}</span>
                  </div>
                  <span className="font-mono text-[10px]">
                    {isDone ? 'COMPLETED' : isCurrent ? 'EXECUTING' : 'QUEUED'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 8: SIMULATION RESULTS */}
      {simulationResult && !isSimulating && (
        <div className="rounded-md border border-[#E5E5E0] bg-white p-5 space-y-6">
          <div className="flex flex-col justify-between gap-2 border-b border-[#E5E5E0] pb-4 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-600"></span>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                  Simulation complete
                </span>
              </div>
              <h3 className="mt-1 text-base font-bold tracking-tight text-[#1A1A1A]">
                Scenario: {simulationResult.scenarioName}
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs text-[#6B6B66]">
              <div>
                <span className="text-[10px] text-[#8A8A85]">Volume:</span>{' '}
                <span className="font-medium text-[#1A1A1A]">{simulationResult.volume}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#8A8A85]">Entities:</span>{' '}
                <span className="font-medium text-[#1A1A1A]">{simulationResult.entitiesInvolved}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#8A8A85]">Transactions:</span>{' '}
                <span className="font-medium text-[#1A1A1A]">
                  {simulationResult.transactionsCount}
                </span>
              </div>
            </div>
          </div>

          {/* Three compact metrics (exactly matching requirements) */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded border border-[#E5E5E0] bg-[#FAFAF8] p-3">
              <div className="text-xs text-[#6B6B66]">Detected</div>
              <div className="mt-1 text-2xl font-bold tracking-tight text-[#1A1A1A]">
                {defenseTestedResult ? '96%' : `${simulationResult.detectedPct}%`}
              </div>
              <div className="mt-0.5 text-[10px] text-emerald-700">
                {defenseTestedResult ? '+14% improvement' : 'Via active rules'}
              </div>
            </div>

            <div className="rounded border border-[#E5E5E0] bg-[#FAFAF8] p-3">
              <div className="text-xs text-[#6B6B66]">Missed</div>
              <div className="mt-1 text-2xl font-bold tracking-tight text-amber-800">
                {defenseTestedResult ? '4%' : `${simulationResult.missedPct}%`}
              </div>
              <div className="mt-0.5 text-[10px] text-[#8A8A85]">
                {defenseTestedResult ? 'Residual false negative' : 'False negative gap'}
              </div>
            </div>

            <div className="rounded border border-[#E5E5E0] bg-[#FAFAF8] p-3">
              <div className="text-xs text-[#6B6B66]">Estimated exposure</div>
              <div className="mt-1 text-2xl font-bold tracking-tight text-[#1A1A1A]">
                {defenseTestedResult ? '₹0.12L' : simulationResult.estimatedExposure}
              </div>
              <div className="mt-0.5 text-[10px] text-[#8A8A85]">
                {defenseTestedResult ? '92% reduction' : 'At risk without control'}
              </div>
            </div>
          </div>

          {/* Detection gaps (numbered list matching prompt) */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6B6B66]">
              Detection gaps
            </h4>
            <div className="mt-2.5 divide-y divide-[#E5E5E0] rounded border border-[#E5E5E0] bg-[#FAFAF8]">
              {simulationResult.detectionGaps.map((gap, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 text-xs">
                  <span className="font-mono font-semibold text-[#8A8A85]">{idx + 1}.</span>
                  <span className="text-[#3A3A35] leading-relaxed">{gap}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action to Generate Defense if not yet shown */}
          {!isDefenseGenerated ? (
            <div className="pt-2">
              <button
                id="generate-defense-btn"
                onClick={handleGenerateDefense}
                className="flex items-center gap-1.5 rounded-md bg-[#1A1A1A] px-3.5 py-2 text-xs font-medium text-white hover:bg-stone-800"
              >
                <span>Generate defense</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            /* SECTION 9: AI / AGENTIC FEATURE (Subtle, professional, no chatbot) */
            <div className="space-y-4 rounded-md border border-[#E5E5E0] bg-[#FAFAF8] p-4 text-xs">
              <div className="flex items-center justify-between border-b border-[#E5E5E0] pb-2">
                <div>
                  <h4 className="text-xs font-bold tracking-tight text-[#1A1A1A]">
                    Suggested risk control
                  </h4>
                  <p className="text-[11px] text-[#6B6B66]">
                    The system identifies a recurring pattern across the simulated network.
                  </p>
                </div>
                <span className="rounded border border-stone-300 bg-white px-2 py-0.5 text-[10px] font-medium text-stone-700">
                  Risk intelligence synthesis
                </span>
              </div>

              {/* Suggested signal */}
              <div>
                <div className="text-[11px] font-medium text-[#8A8A85]">Suggested signal:</div>
                <div className="mt-1 rounded border border-[#E5E5E0] bg-white p-2.5 font-medium text-[#1A1A1A]">
                  "{simulationResult.suggestedControl.signal}"
                </div>
              </div>

              {/* Expected impact */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded border border-[#E5E5E0] bg-white p-2.5">
                  <div className="text-[11px] text-[#6B6B66]">
                    Potential detection improvement
                  </div>
                  <div className="mt-1 text-base font-bold text-emerald-800">
                    {simulationResult.suggestedControl.expectedImpact.detectionImprovement}
                  </div>
                </div>
                <div className="rounded border border-[#E5E5E0] bg-white p-2.5">
                  <div className="text-[11px] text-[#6B6B66]">
                    Estimated false-positive increase
                  </div>
                  <div className="mt-1 text-base font-bold text-stone-800">
                    {simulationResult.suggestedControl.expectedImpact.falsePositiveIncrease}
                  </div>
                </div>
              </div>

              {/* Why this control? */}
              <div>
                <div className="text-[11px] font-medium text-[#8A8A85]">Why this control?</div>
                <p className="mt-1 leading-relaxed text-[#4A4A45]">
                  {simulationResult.suggestedControl.why}
                </p>
              </div>

              {/* Evidence */}
              <div>
                <div className="text-[11px] font-medium text-[#8A8A85]">Evidence:</div>
                <div className="mt-1.5 flex flex-wrap gap-2 text-[11px]">
                  <span className="rounded bg-white border border-[#E5E5E0] px-2 py-1 font-mono text-[#1A1A1A]">
                    {simulationResult.suggestedControl.evidence.entities} entities
                  </span>
                  <span className="rounded bg-white border border-[#E5E5E0] px-2 py-1 font-mono text-[#1A1A1A]">
                    {simulationResult.suggestedControl.evidence.deviceClusters} device clusters
                  </span>
                  <span className="rounded bg-white border border-[#E5E5E0] px-2 py-1 font-mono text-[#1A1A1A]">
                    {simulationResult.suggestedControl.evidence.transactions} transactions
                  </span>
                  <span className="rounded bg-white border border-amber-200 px-2 py-1 font-mono text-amber-800">
                    {simulationResult.suggestedControl.evidence.missedEntities} missed entities
                  </span>
                </div>
              </div>

              {/* Notification when added to queue */}
              {addedToQueueMsg && (
                <div className="rounded border border-emerald-200 bg-emerald-50 p-2.5 text-emerald-800">
                  <div className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
                    <span>Control added</span>
                  </div>
                  <p className="mt-0.5 text-[11px]">{addedToQueueMsg}</p>
                </div>
              )}

              {/* Buttons: Test control & Add to review queue */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-[#E5E5E0]">
                <button
                  id="test-control-btn"
                  onClick={handleTestControl}
                  disabled={isTestingDefense}
                  className="flex items-center gap-1.5 rounded-md border border-[#E5E5E0] bg-white px-3 py-1.5 text-xs font-medium text-[#1A1A1A] hover:bg-stone-100 disabled:opacity-60"
                >
                  <RotateCcw className={`h-3.5 w-3.5 ${isTestingDefense ? 'animate-spin' : ''}`} />
                  <span>
                    {isTestingDefense
                      ? 'Simulating retroactive pass...'
                      : defenseTestedResult
                      ? 'Re-test control'
                      : 'Test control'}
                  </span>
                </button>

                <button
                  id="add-to-review-queue-btn"
                  onClick={handleAddToQueue}
                  className="flex items-center gap-1.5 rounded-md bg-[#1A1A1A] px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-800"
                >
                  <Sliders className="h-3.5 w-3.5" />
                  <span>Add to review queue</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
