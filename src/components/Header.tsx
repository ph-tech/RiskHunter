import React, { useState } from 'react';
import { Menu, RefreshCw, Search as SearchIcon, ShieldCheck } from 'lucide-react';
import { PageId } from '../types';

interface HeaderProps {
  currentPage: PageId;
  onOpenMobile: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onOpenMobile,
  onSearch,
  searchQuery,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('2 min ago');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated('Just now');
    }, 600);
  };

  const getPageTitle = (page: PageId) => {
    switch (page) {
      case 'overview':
        return 'Risk overview';
      case 'investigations':
        return 'Investigations';
      case 'investigation-detail':
        return 'Investigation detail';
      case 'network':
        return 'Risk network';
      case 'simulator':
        return 'Attack simulator';
      case 'controls':
        return 'Risk controls';
      case 'alerts':
        return 'Alerts';
      case 'transactions':
        return 'Transactions';
      case 'entities':
        return 'Entities';
      case 'settings':
        return 'Settings';
      default:
        return 'Risk Hunter';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-[#E5E5E0] bg-white/95 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-3">
        <button
          id="mobile-menu-toggle-btn"
          onClick={onOpenMobile}
          className="rounded p-1.5 text-[#6B6B66] hover:bg-[#F7F7F5] md:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-[#8A8A85]">Risk Ops /</span>
          <h1 className="text-sm font-semibold text-[#1A1A1A]">{getPageTitle(currentPage)}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Global Search */}
        <div className="relative hidden w-48 lg:block xl:w-64">
          <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8A8A85]" />
          <input
            id="global-header-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search entities, IDs..."
            className="h-8 w-full rounded-md border border-[#E5E5E0] bg-[#F7F7F5] pl-8 pr-2.5 text-xs text-[#1A1A1A] placeholder-[#8A8A85] transition-colors focus:border-stone-400 focus:bg-white focus:outline-none"
          />
        </div>

        {/* Simulation Environment Badge */}
        <div className="hidden items-center gap-1.5 rounded border border-[#E5E5E0] bg-[#F7F7F5] px-2 py-1 text-[11px] font-medium text-[#4A4A45] sm:flex">
          <ShieldCheck className="h-3.5 w-3.5 text-stone-500" />
          <span>Simulation env</span>
        </div>

        {/* Sync / Last Updated Button */}
        <div className="flex items-center gap-1 text-xs text-[#6B6B66]">
          <span className="hidden text-[11px] sm:inline">Last updated {lastUpdated}</span>
          <button
            id="header-refresh-btn"
            onClick={handleRefresh}
            title="Refresh telemetry"
            className="rounded p-1 text-[#6B6B66] hover:bg-[#F7F7F5] hover:text-[#1A1A1A]"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Analyst Avatar */}
        <div className="flex items-center gap-2 border-l border-[#E5E5E0] pl-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-200 text-xs font-medium text-stone-700">
            PK
          </div>
          <span className="hidden text-xs font-medium text-[#1A1A1A] md:inline">
            P. Kulkarni
          </span>
        </div>
      </div>
    </header>
  );
};
