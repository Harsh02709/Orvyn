import React from 'react';
import { useApp, NavView } from '../../context/AppContext';
import { AirGapBadge } from '../common/AirGapBadge';
import { PqcStatusBadge } from '../common/PqcStatusBadge';
import {
  LayoutDashboard,
  FileText,
  Send,
  Users,
  KeySquare,
  Boxes,
  SearchCode,
  Key,
  ShieldAlert,
  FileCheck2,
  Settings,
  ChevronRight,
  X
} from 'lucide-react';

interface NavItem {
  id: NavView;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
}

export const Sidebar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    documents,
    recipients,
    events,
    blocks,
    reports,
    ledgerIntegrity,
    isMobileMenuOpen,
    setIsMobileMenuOpen
  } = useApp();

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'documents', label: 'Documents Vault', icon: FileText, badge: documents.length },
    { id: 'distribute', label: 'Distribute Document', icon: Send },
    { id: 'recipients', label: 'Recipients & Roles', icon: Users, badge: recipients.length },
    { id: 'events', label: 'Decryption Events', icon: KeySquare, badge: events.length },
    { id: 'ledger', label: 'Audit Ledger (DLT)', icon: Boxes, badge: `#${blocks[blocks.length - 1]?.blockNumber || 184}` },
    { id: 'forensics', label: 'Forensic Analysis', icon: SearchCode },
    { id: 'keys', label: 'Key Management', icon: Key, badge: 'PQC' },
    {
      id: 'security',
      label: 'Security & Tamper',
      icon: ShieldAlert,
      badge: ledgerIntegrity === 'TAMPERED' ? 'ALERT' : undefined
    },
    { id: 'reports', label: 'Attribution Reports', icon: FileCheck2, badge: reports.length },
    { id: 'settings', label: 'Air-Gap Settings', icon: Settings }
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Navigation Sidebar / Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#060a12] border-r border-slate-800 flex flex-col justify-between select-none shadow-2xl transition-transform duration-200 ease-in-out lg:static lg:w-64 lg:z-auto lg:shadow-none lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header in Drawer */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-800/80 bg-[#080d17]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-cyan-950 border border-cyan-500/40 flex items-center justify-center font-mono font-bold text-cyan-400 text-xs tracking-tighter">
              ORV
            </div>
            <div>
              <div className="text-sm font-bold text-white font-mono">Orvyn</div>
              <div className="text-[10px] text-slate-400 font-mono">ENTERPRISE DLP</div>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1.5 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            aria-label="Close Navigation"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-3 px-3 flex flex-col gap-1">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-500">
            Navigation Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            const isAlert = item.badge === 'ALERT';

            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`group flex items-center justify-between px-3 py-2.5 text-xs font-medium rounded transition-colors ${
                  isActive
                    ? 'bg-slate-800/90 text-cyan-300 border-l-2 border-cyan-400 pl-2.5 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`ml-2 text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0 ${
                      isAlert
                        ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse'
                        : isActive
                        ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-800/50'
                        : 'bg-slate-900 text-slate-500 border border-slate-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Mobile Enclave & Trust Status in Drawer */}
        <div className="lg:hidden p-3 border-t border-slate-800/80 bg-slate-950/60 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <AirGapBadge compact />
            <PqcStatusBadge compact />
          </div>
        </div>

        {/* Air-Gapped Trust Footprint (Desktop & Mobile) */}
        <div className="p-3 border-t border-slate-800/80 m-2 rounded bg-slate-950/40">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              SECURITY ENCLAVE
            </span>
            <span className="text-[10px] text-slate-500">v2.4-PQC</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed font-mono">
            Air-Gapped Consortium Ledger. Zero Cloud KMS. Zero Public Chain.
          </p>
        </div>
      </aside>
    </>
  );
};
