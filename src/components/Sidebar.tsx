import React from 'react';
import {
  LayoutDashboard,
  Search,
  Network,
  ShieldAlert,
  Sliders,
  Bell,
  ArrowLeftRight,
  Database,
  Settings,
  CheckCircle2,
  X,
} from 'lucide-react';
import { PageId } from '../types';

interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  unreadAlertsCount: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  unreadAlertsCount,
  mobileOpen,
  onCloseMobile,
}) => {
  const mainNav: { id: PageId; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'investigations', label: 'Investigations', icon: Search },
    { id: 'network', label: 'Risk Network', icon: Network },
    { id: 'simulator', label: 'Attack Simulator', icon: ShieldAlert },
    { id: 'controls', label: 'Risk Controls', icon: Sliders },
    { id: 'alerts', label: 'Alerts', icon: Bell },
  ];

  const dataNav: { id: PageId; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'entities', label: 'Entities', icon: Database },
  ];

  const handleNav = (id: PageId) => {
    onNavigate(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          id="sidebar-backdrop"
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-[#E5E5E0] bg-white transition-transform duration-200 ease-in-out md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-14 items-center justify-between border-b border-[#E5E5E0] px-4">
          <button
            id="brand-header-btn"
            onClick={() => handleNav('overview')}
            className="flex items-center gap-2.5 text-left text-sm font-semibold tracking-tight text-[#1A1A1A] hover:opacity-80"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded bg-[#1A1A1A] text-[10px] font-bold text-white">
              RH
            </div>
            <div>
              <span className="block leading-none">RISK HUNTER</span>
              <span className="block text-[10px] font-normal text-[#6B6B66]">Risk intelligence</span>
            </div>
          </button>
          <button
            id="mobile-close-sidebar-btn"
            onClick={onCloseMobile}
            className="rounded p-1 text-[#6B6B66] hover:bg-[#F7F7F5] md:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Area */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3">
          <nav className="space-y-0.5">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive =
                currentPage === item.id ||
                (item.id === 'investigations' && currentPage === 'investigation-detail');
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleNav(item.id)}
                  className={`group flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-[13px] font-medium transition-colors ${
                    isActive
                      ? 'bg-[#F2F2EE] text-[#1A1A1A]'
                      : 'text-[#4A4A45] hover:bg-[#F7F7F5] hover:text-[#1A1A1A]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`h-4 w-4 ${
                        isActive ? 'text-[#1A1A1A]' : 'text-[#8A8A85] group-hover:text-[#1A1A1A]'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.id === 'alerts' && unreadAlertsCount > 0 && (
                    <span className="inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-stone-200 px-1 text-[10px] font-semibold text-stone-700">
                      {unreadAlertsCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="my-3.5 border-t border-[#E5E5E0]" />

          <div className="px-2.5 pb-1.5 text-[11px] font-medium tracking-wide text-[#8A8A85]">
            Data
          </div>
          <nav className="space-y-0.5">
            {dataNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleNav(item.id)}
                  className={`group flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-[13px] font-medium transition-colors ${
                    isActive
                      ? 'bg-[#F2F2EE] text-[#1A1A1A]'
                      : 'text-[#4A4A45] hover:bg-[#F7F7F5] hover:text-[#1A1A1A]'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      isActive ? 'text-[#1A1A1A]' : 'text-[#8A8A85] group-hover:text-[#1A1A1A]'
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="my-3.5 border-t border-[#E5E5E0]" />

          <nav className="space-y-0.5">
            <button
              id="nav-item-settings"
              onClick={() => handleNav('settings')}
              className={`group flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-[13px] font-medium transition-colors ${
                currentPage === 'settings'
                  ? 'bg-[#F2F2EE] text-[#1A1A1A]'
                  : 'text-[#4A4A45] hover:bg-[#F7F7F5] hover:text-[#1A1A1A]'
              }`}
            >
              <Settings
                className={`h-4 w-4 ${
                  currentPage === 'settings'
                    ? 'text-[#1A1A1A]'
                    : 'text-[#8A8A85] group-hover:text-[#1A1A1A]'
                }`}
              />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer: System Status */}
        <div className="border-t border-[#E5E5E0] bg-[#FAFAF8] p-3 text-xs">
          <div className="flex items-center gap-2 text-[#4A4A45]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600"></span>
            </span>
            <div className="leading-tight">
              <span className="block text-[11px] font-medium text-[#1A1A1A]">
                System status
              </span>
              <span className="block text-[10px] text-[#6B6B66]">
                All systems operational
              </span>
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between border-t border-[#E5E5E0] pt-2 text-[10px] text-[#8A8A85]">
            <span>Simulation env</span>
            <span>v2.4.1</span>
          </div>
        </div>
      </aside>
    </>
  );
};
