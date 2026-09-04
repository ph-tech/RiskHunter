import React, { useState } from 'react';
import { PageId, Investigation, RiskControl, AlertItem, Transaction } from './types';
import {
  INITIAL_INVESTIGATIONS,
  INITIAL_CONTROLS,
  INITIAL_ALERTS,
  RECENT_TRANSACTIONS,
  NETWORK_ENTITIES,
} from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewView } from './components/OverviewView';
import { InvestigationsView } from './components/InvestigationsView';
import { InvestigationDetailView } from './components/InvestigationDetailView';
import { RiskNetworkView } from './components/RiskNetworkView';
import { AttackSimulatorView } from './components/AttackSimulatorView';
import { RiskControlsView } from './components/RiskControlsView';
import { AlertsView } from './components/AlertsView';
import { TransactionsView } from './components/TransactionsView';
import { EntitiesView } from './components/EntitiesView';
import { SettingsView } from './components/SettingsView';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // Domain data in state
  const [investigations, setInvestigations] = useState<Investigation[]>(INITIAL_INVESTIGATIONS);
  const [selectedInvestigation, setSelectedInvestigation] = useState<Investigation>(
    INITIAL_INVESTIGATIONS[0]
  );
  const [controls, setControls] = useState<RiskControl[]>(INITIAL_CONTROLS);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [transactions, setTransactions] = useState<Transaction[]>(RECENT_TRANSACTIONS);

  // Cross-page navigation context params
  const [networkFocusEntityId, setNetworkFocusEntityId] = useState<string | undefined>('M284');
  const [simulatorTargetEntity, setSimulatorTargetEntity] = useState<string | undefined>(undefined);
  const [controlPresetTitle, setControlPresetTitle] = useState<string | undefined>(undefined);
  const [transactionFilterEntity, setTransactionFilterEntity] = useState<string | undefined>(undefined);

  const unreadAlertsCount = alerts.filter((a) => !a.isRead).length;

  // Handlers for investigations
  const handleSelectInvestigation = (inv: Investigation) => {
    setSelectedInvestigation(inv);
    setCurrentPage('investigation-detail');
  };

  const handleUpdateInvestigationStatus = (
    id: string,
    newStatus: Investigation['status']
  ) => {
    setInvestigations((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: newStatus } : inv))
    );
    if (selectedInvestigation.id === id) {
      setSelectedInvestigation((prev) => ({ ...prev, status: newStatus }));
    }
  };

  // Handlers for controls
  const handleAddControl = (newCtrl: RiskControl) => {
    setControls((prev) => [newCtrl, ...prev]);
  };

  const handleAddControlToQueue = (
    ctrlData: Omit<RiskControl, 'id' | 'lastUpdated'>
  ) => {
    const newControl: RiskControl = {
      id: `CTRL-0${controls.length + 1}`,
      lastUpdated: 'Just now',
      ...ctrlData,
    };
    setControls((prev) => [newControl, ...prev]);
  };

  const handleToggleControlStatus = (id: string) => {
    setControls((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatus = c.status === 'Active' ? 'Paused' : 'Active';
          return { ...c, status: nextStatus, lastUpdated: 'Just now' };
        }
        return c;
      })
    );
  };

  // Handlers for alerts
  const handleMarkAlertAsRead = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, isRead: true } : a)));
  };

  const handleMarkAllAlertsAsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
  };

  // Handlers for transactions
  const handleUpdateTransactionStatus = (
    id: string,
    newStatus: Transaction['status']
  ) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  };

  // Navigation helpers
  const navigateToNetworkWithEntity = (entityId?: string) => {
    if (entityId) setNetworkFocusEntityId(entityId);
    setCurrentPage('network');
  };

  const navigateToSimulatorWithTarget = (entityId: string) => {
    setSimulatorTargetEntity(entityId);
    setCurrentPage('simulator');
  };

  const navigateToControlsWithPreset = (signalTitle: string) => {
    setControlPresetTitle(signalTitle);
    setCurrentPage('controls');
  };

  const navigateToTransactionsForEntity = (entityId: string) => {
    setTransactionFilterEntity(entityId);
    setCurrentPage('transactions');
  };

  const navigateToInvestigationById = (invId: string) => {
    const found = investigations.find((i) => i.id === invId);
    if (found) {
      setSelectedInvestigation(found);
      setCurrentPage('investigation-detail');
    } else {
      setCurrentPage('investigations');
    }
  };

  const navigateToInvestigationForEntity = (entityId: string) => {
    const found = investigations.find(
      (i) => i.entityId.toLowerCase() === entityId.toLowerCase()
    );
    if (found) {
      setSelectedInvestigation(found);
      setCurrentPage('investigation-detail');
    } else {
      // Create a focused synthetic investigation for that entity if none exists
      const node = NETWORK_ENTITIES.find((n) => n.id === entityId);
      const newInv: Investigation = {
        id: `INV-10${investigations.length + 43}`,
        entityId: entityId,
        entityName: node ? node.label : `Entity ${entityId}`,
        entityType: node ? node.type : 'Account',
        riskScore: node ? node.riskScore : 75,
        riskLevel: (node?.riskScore || 75) > 85 ? 'critical' : 'high',
        primarySignal: node?.whyItMatters.split('.')[0] || 'Unusual relationship cluster',
        updated: 'Just now',
        status: 'Investigating',
        explanation: node?.whyItMatters || 'Flagged for active telemetry review.',
        signals: [
          {
            rank: '01',
            title: 'Cluster relationship formation',
            impact: '+28 risk',
            detail: 'Linked to active syndicate nodes.',
          },
        ],
        recommendedAction: 'Restrict outbound transfers and review associated terminal logs.',
        connectedEntitiesCount: node?.connections || 3,
        totalVolume: node?.volume || '₹2.1L',
        firstSeen: node?.firstSeen || 'Aug 2026',
      };
      setInvestigations((prev) => [newInv, ...prev]);
      setSelectedInvestigation(newInv);
      setCurrentPage('investigation-detail');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#1A1A1A]">
      {/* Persistent Left Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={(p) => {
          if (p === 'network') setNetworkFocusEntityId('M284');
          if (p === 'controls') setControlPresetTitle(undefined);
          if (p === 'transactions') setTransactionFilterEntity(undefined);
          setCurrentPage(p);
        }}
        unreadAlertsCount={unreadAlertsCount}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex min-h-screen flex-col md:pl-60">
        {/* Top Header */}
        <Header
          currentPage={currentPage}
          onOpenMobile={() => setMobileSidebarOpen(true)}
          onSearch={(q) => {
            setGlobalSearch(q);
            if (q.trim() && currentPage !== 'investigations' && currentPage !== 'transactions') {
              setCurrentPage('investigations');
            }
          }}
          searchQuery={globalSearch}
        />

        {/* View Router */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {currentPage === 'overview' && (
            <OverviewView
              investigations={investigations}
              onSelectInvestigation={handleSelectInvestigation}
              onNavigate={setCurrentPage}
            />
          )}

          {currentPage === 'investigations' && (
            <InvestigationsView
              investigations={investigations}
              onSelectInvestigation={handleSelectInvestigation}
              externalSearch={globalSearch}
            />
          )}

          {currentPage === 'investigation-detail' && (
            <InvestigationDetailView
              investigation={selectedInvestigation}
              onBack={() => setCurrentPage('investigations')}
              onNavigateToNetwork={navigateToNetworkWithEntity}
              onNavigateToControlsWithPreset={navigateToControlsWithPreset}
              onUpdateStatus={handleUpdateInvestigationStatus}
            />
          )}

          {currentPage === 'network' && (
            <RiskNetworkView
              initialFocusEntityId={networkFocusEntityId}
              onNavigateToTransactions={navigateToTransactionsForEntity}
              onNavigateToSimulatorWithTarget={navigateToSimulatorWithTarget}
              onOpenInvestigationForEntity={navigateToInvestigationForEntity}
            />
          )}

          {currentPage === 'simulator' && (
            <AttackSimulatorView
              onAddControlToQueue={handleAddControlToQueue}
              preselectedTargetEntity={simulatorTargetEntity}
            />
          )}

          {currentPage === 'controls' && (
            <RiskControlsView
              controls={controls}
              onAddControl={handleAddControl}
              onToggleStatus={handleToggleControlStatus}
              presetSignalTitle={controlPresetTitle}
            />
          )}

          {currentPage === 'alerts' && (
            <AlertsView
              alerts={alerts}
              onMarkAsRead={handleMarkAlertAsRead}
              onMarkAllAsRead={handleMarkAllAlertsAsRead}
              onNavigateToInvestigation={navigateToInvestigationById}
              onNavigateToNetwork={navigateToNetworkWithEntity}
            />
          )}

          {currentPage === 'transactions' && (
            <TransactionsView
              transactions={transactions}
              onUpdateStatus={handleUpdateTransactionStatus}
              onOpenInvestigation={navigateToInvestigationForEntity}
              initialFilterEntityId={transactionFilterEntity}
            />
          )}

          {currentPage === 'entities' && (
            <EntitiesView
              onNavigateToNetwork={navigateToNetworkWithEntity}
              onNavigateToTransactions={navigateToTransactionsForEntity}
              onOpenInvestigation={navigateToInvestigationForEntity}
            />
          )}

          {currentPage === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
}
