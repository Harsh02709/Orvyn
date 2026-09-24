import React from 'react';
import { useApp } from '../../context/AppContext';
import { AirGapBadge } from '../common/AirGapBadge';
import { PqcStatusBadge } from '../common/PqcStatusBadge';
import { PlayCircle, KeyRound, AlertTriangle, ShieldCheck, Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    openDecryptModal,
    setDemoTourOpen,
    ledgerIntegrity,
    blocks,
    isMobileMenuOpen,
    toggleMobileMenu
  } = useApp();

  const lastBlock = blocks[blocks.length - 1];

  return (
    <header className="h-16 px-3 sm:px-6 bg-[#080d17] border-b border-slate-800 flex items-center justify-between z-30 shrink-0 gap-2">
      {/* Zone 1: Mobile Hamburger + Brand element */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors shrink-0"
          aria-label={isMobileMenuOpen ? 'Close Navigation' : 'Open Navigation'}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="w-8 h-8 rounded bg-cyan-950 border border-cyan-500/40 flex items-center justify-center font-mono font-bold text-cyan-400 text-xs sm:text-sm tracking-tighter shrink-0 shadow-xs shadow-cyan-500/20">
          ORV
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-sm sm:text-base font-bold tracking-tight text-white font-mono truncate">
              Orvyn
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300/90 border border-slate-700 shrink-0">
              ENTERPRISE DLP
            </span>
          </div>
          <span className="hidden sm:block text-[10px] text-slate-400 font-mono truncate">
            Cryptographic Attribution & Immutable Decryption Provenance
          </span>
        </div>
      </div>

      {/* Zone 2: System Status Badges (Desktop) */}
      <div className="hidden lg:flex items-center gap-3">
        <AirGapBadge compact />
        <PqcStatusBadge compact />

        {ledgerIntegrity === 'TAMPERED' ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-950/50 border border-rose-700/60 rounded text-xs text-rose-300 font-mono animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>LEDGER: TAMPER DETECTED</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/80 border border-slate-700/70 rounded text-xs text-slate-300 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>LEDGER: #{lastBlock?.blockNumber || 184} VERIFIED</span>
          </div>
        )}
      </div>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        <button
          onClick={() => setDemoTourOpen(true)}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-cyan-200 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 rounded transition-colors whitespace-nowrap"
          title="Start Guided End-to-End Walkthrough"
        >
          <PlayCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="hidden md:inline">Workflow Tour</span>
          <span className="md:hidden text-[11px]">Tour</span>
        </button>

        <button
          onClick={() => openDecryptModal()}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded transition-colors whitespace-nowrap shadow-xs"
        >
          <KeyRound className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="hidden md:inline">Decrypt Document</span>
          <span className="md:hidden text-[11px]">Decrypt</span>
        </button>
      </div>
    </header>
  );
};
