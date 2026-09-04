import React, { useState } from 'react';
import { Bell, AlertTriangle, ShieldAlert, CheckCircle2, ChevronRight, Check } from 'lucide-react';
import { AlertItem, PageId } from '../types';

interface AlertsViewProps {
  alerts: AlertItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onNavigateToInvestigation: (investigationId: string) => void;
  onNavigateToNetwork: (entityId: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  onMarkAsRead,
  onMarkAllAsRead,
  onNavigateToInvestigation,
  onNavigateToNetwork,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'high' | 'medium'>('all');

  const filteredAlerts = alerts.filter(
    (a) => filterSeverity === 'all' || a.severity === filterSeverity
  );

  const getSeverityBadge = (sev: AlertItem['severity']) => {
    switch (sev) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 rounded border border-red-200 bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold text-red-700">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
            Critical
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 rounded border border-orange-200 bg-orange-50 px-1.5 py-0.5 text-[10px] font-semibold text-orange-700">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-600"></span>
            High
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded border border-stone-200 bg-stone-100 px-1.5 py-0.5 text-[10px] font-medium text-stone-600">
            Medium
          </span>
        );
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-[#1A1A1A]">Alerts</h2>
          <p className="text-xs text-[#6B6B66]">
            Real-time operational alerts from active controls and graph heuristic monitors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="mark-all-read-btn"
            onClick={onMarkAllAsRead}
            className="flex items-center gap-1 rounded border border-[#E5E5E0] bg-white px-2.5 py-1 text-xs font-medium text-[#4A4A45] hover:bg-stone-50"
          >
            <Check className="h-3 w-3" />
            <span>Mark all as read</span>
          </button>
        </div>
      </div>

      {/* Severity Filter Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[#E5E5E0] pb-2 text-xs">
        {(['all', 'critical', 'high', 'medium'] as const).map((s) => (
          <button
            key={s}
            id={`alert-filter-${s}`}
            onClick={() => setFilterSeverity(s)}
            className={`rounded px-2.5 py-1 text-[11px] font-medium capitalize transition-colors ${
              filterSeverity === s
                ? 'bg-[#1A1A1A] text-white'
                : 'text-[#6B6B66] hover:bg-stone-200 hover:text-[#1A1A1A]'
            }`}
          >
            {s === 'all' ? 'All alerts' : s}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="divide-y divide-[#E5E5E0] rounded-md border border-[#E5E5E0] bg-white">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#8A8A85]">
            No alerts matching current severity filter.
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              id={`alert-item-${alert.id}`}
              className={`flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between transition-colors ${
                alert.isRead ? 'bg-white opacity-85' : 'bg-[#FAFAF8]'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {!alert.isRead && (
                    <span className="h-1.5 w-1.5 rounded-full bg-red-600" title="Unread"></span>
                  )}
                  {getSeverityBadge(alert.severity)}
                  <span className="text-xs font-semibold text-[#1A1A1A]">{alert.title}</span>
                  <span className="text-[10px] text-[#8A8A85]">• {alert.timestamp}</span>
                </div>
                <p className="text-xs leading-relaxed text-[#4A4A45]">{alert.description}</p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {!alert.isRead && (
                  <button
                    onClick={() => onMarkAsRead(alert.id)}
                    className="rounded px-2 py-1 text-[11px] text-[#6B6B66] hover:bg-stone-200 hover:text-[#1A1A1A]"
                  >
                    Acknowledge
                  </button>
                )}

                {alert.investigationId ? (
                  <button
                    id={`investigate-alert-${alert.id}`}
                    onClick={() => onNavigateToInvestigation(alert.investigationId!)}
                    className="flex items-center gap-1 rounded bg-[#1A1A1A] px-2.5 py-1 text-xs font-medium text-white hover:bg-stone-800"
                  >
                    <span>Investigate</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                ) : alert.entityId ? (
                  <button
                    onClick={() => onNavigateToNetwork(alert.entityId!)}
                    className="flex items-center gap-1 rounded border border-[#E5E5E0] bg-white px-2.5 py-1 text-xs font-medium text-[#1A1A1A] hover:bg-stone-100"
                  >
                    <span>Inspect entity</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
