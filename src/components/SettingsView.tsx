import React, { useState } from 'react';
import { Save, CheckCircle2, Shield, Users, Sliders, BellRing, Database } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [criticalThreshold, setCriticalThreshold] = useState(85);
  const [highRiskThreshold, setHighRiskThreshold] = useState(70);
  const [autoHoldEnabled, setAutoHoldEnabled] = useState(true);
  const [autoHoldAmount, setAutoHoldAmount] = useState('50000');
  const [webhookUrl, setWebhookUrl] = useState('https://internal.fintech.corp/hooks/risk-alerts');
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3500);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-[#1A1A1A]">Settings</h2>
        <p className="text-xs text-[#6B6B66]">
          Configure risk scoring thresholds, automated mitigation policies, and team access.
        </p>
      </div>

      {savedMsg && (
        <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs text-emerald-800">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Risk operational settings successfully updated across all settlement rails.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5 text-xs">
        {/* Risk Thresholds */}
        <div className="rounded-md border border-[#E5E5E0] bg-white p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E5E5E0] pb-2.5">
            <Sliders className="h-4 w-4 text-[#6B6B66]" />
            <h3 className="text-xs font-semibold text-[#1A1A1A]">Global Risk Scoring Thresholds</h3>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-medium text-[#1A1A1A]">Critical Risk cutoff (Score)</label>
              <p className="text-[11px] text-[#8A8A85]">
                Scores above this initiate automatic settlement hold and AML escalation.
              </p>
              <input
                type="number"
                min="50"
                max="99"
                value={criticalThreshold}
                onChange={(e) => setCriticalThreshold(Number(e.target.value))}
                className="mt-1.5 h-8 w-full rounded border border-[#E5E5E0] bg-[#FAFAF8] px-3 text-xs focus:border-stone-400 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-[#1A1A1A]">High Risk cutoff (Score)</label>
              <p className="text-[11px] text-[#8A8A85]">
                Scores above this route to the analyst investigation queue.
              </p>
              <input
                type="number"
                min="30"
                max="85"
                value={highRiskThreshold}
                onChange={(e) => setHighRiskThreshold(Number(e.target.value))}
                className="mt-1.5 h-8 w-full rounded border border-[#E5E5E0] bg-[#FAFAF8] px-3 text-xs focus:border-stone-400 focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Automated Settlement Holds */}
        <div className="rounded-md border border-[#E5E5E0] bg-white p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E5E5E0] pb-2.5">
            <Shield className="h-4 w-4 text-[#6B6B66]" />
            <h3 className="text-xs font-semibold text-[#1A1A1A]">Automated Payout Mitigation</h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={autoHoldEnabled}
                onChange={(e) => setAutoHoldEnabled(e.target.checked)}
                className="h-4 w-4 rounded border-stone-300 accent-[#1A1A1A]"
              />
              <div>
                <span className="font-medium text-[#1A1A1A]">Enable automatic pre-settlement hold</span>
                <span className="block text-[11px] text-[#8A8A85]">
                  Temporarily pause funds release for high-value transactions matching coordinated signals.
                </span>
              </div>
            </label>

            {autoHoldEnabled && (
              <div className="pt-2 pl-6">
                <label className="block font-medium text-[#1A1A1A]">Hold threshold amount (INR ₹)</label>
                <input
                  type="text"
                  value={autoHoldAmount}
                  onChange={(e) => setAutoHoldAmount(e.target.value)}
                  className="mt-1 h-8 w-60 rounded border border-[#E5E5E0] bg-[#FAFAF8] px-3 text-xs focus:border-stone-400 focus:bg-white focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Webhooks & Alerts */}
        <div className="rounded-md border border-[#E5E5E0] bg-white p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E5E5E0] pb-2.5">
            <BellRing className="h-4 w-4 text-[#6B6B66]" />
            <h3 className="text-xs font-semibold text-[#1A1A1A]">Integration Webhooks</h3>
          </div>

          <div>
            <label className="block font-medium text-[#1A1A1A]">Critical event webhook endpoint</label>
            <p className="text-[11px] text-[#8A8A85]">
              Dispatches encrypted payload to incident response channel on Critical network formation.
            </p>
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="mt-1.5 h-8 w-full rounded border border-[#E5E5E0] bg-[#FAFAF8] px-3 font-mono text-xs focus:border-stone-400 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Team Access */}
        <div className="rounded-md border border-[#E5E5E0] bg-white p-5 space-y-3">
          <div className="flex items-center gap-2 border-b border-[#E5E5E0] pb-2.5">
            <Users className="h-4 w-4 text-[#6B6B66]" />
            <h3 className="text-xs font-semibold text-[#1A1A1A]">Risk Operations Roster</h3>
          </div>

          <div className="divide-y divide-[#E5E5E0]">
            {[
              { name: 'Puneet Kulkarni', role: 'Senior Risk Analyst (Lead)', email: 'p.kulkarni@internal.corp', active: true },
              { name: 'Ananya Roy', role: 'Fraud Graph Specialist', email: 'a.roy@internal.corp', active: true },
              { name: 'Vikram Sethi', role: 'AML Compliance Officer', email: 'v.sethi@internal.corp', active: true },
            ].map((m) => (
              <div key={m.email} className="flex items-center justify-between py-2 text-xs">
                <div>
                  <span className="font-medium text-[#1A1A1A]">{m.name}</span>
                  <span className="ml-2 text-[11px] text-[#8A8A85]">({m.role})</span>
                  <div className="text-[10px] text-[#8A8A85] font-mono">{m.email}</div>
                </div>
                <span className="rounded border border-stone-200 bg-stone-50 px-2 py-0.5 text-[10px] text-stone-700">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            id="save-settings-btn"
            className="flex items-center gap-1.5 rounded-md bg-[#1A1A1A] px-4 py-2 text-xs font-medium text-white hover:bg-stone-800"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
