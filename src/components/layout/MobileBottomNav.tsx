import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  FileText,
  KeyRound,
  SearchCode,
  Menu
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const {
    activeView,
    setActiveView,
    documents,
    openDecryptModal,
    toggleMobileMenu,
    ledgerIntegrity
  } = useApp();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#070b14]/95 backdrop-blur-md border-t border-slate-800/90 px-2 py-1.5 flex items-center justify-around shadow-2xl select-none">
      {/* 1. Overview */}
      <button
        onClick={() => setActiveView('overview')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded transition-colors ${
          activeView === 'overview' ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
        aria-label="Overview Dashboard"
      >
        <LayoutDashboard className="w-4 h-4 mb-0.5" />
        <span className="text-[10px] font-mono leading-none">Overview</span>
      </button>

      {/* 2. Documents Vault */}
      <button
        onClick={() => setActiveView('documents')}
        className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded transition-colors ${
          activeView === 'documents' ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
        aria-label="Documents Vault"
      >
        <FileText className="w-4 h-4 mb-0.5" />
        <span className="text-[10px] font-mono leading-none">Vault</span>
        {documents.length > 0 && (
          <span className="absolute top-0 right-1 w-3.5 h-3.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-[8px] font-mono flex items-center justify-center">
            {documents.length}
          </span>
        )}
      </button>

      {/* 3. Center Action: Sovereign Decrypt */}
      <button
        onClick={() => openDecryptModal()}
        className="flex flex-col items-center justify-center -mt-3.5 group"
        aria-label="Decrypt Document"
      >
        <div className="w-10 h-10 rounded-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-600/30 group-active:scale-95 transition-all border-2 border-[#070b14]">
          <KeyRound className="w-5 h-5 text-slate-950" />
        </div>
        <span className="text-[9px] font-mono font-bold text-cyan-400 mt-0.5">Decrypt</span>
      </button>

      {/* 4. Forensics */}
      <button
        onClick={() => setActiveView('forensics')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded transition-colors ${
          activeView === 'forensics' ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
        aria-label="Forensic Analysis"
      >
        <SearchCode className="w-4 h-4 mb-0.5" />
        <span className="text-[10px] font-mono leading-none">Forensics</span>
      </button>

      {/* 5. More / Drawer Menu */}
      <button
        onClick={toggleMobileMenu}
        className="relative flex flex-col items-center justify-center py-1 px-2.5 rounded text-slate-400 hover:text-slate-200 transition-colors"
        aria-label="Open Navigation Drawer"
      >
        <Menu className="w-4 h-4 mb-0.5" />
        <span className="text-[10px] font-mono leading-none">Modules</span>
        {ledgerIntegrity === 'TAMPERED' && (
          <span className="absolute top-0 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
        )}
      </button>
    </nav>
  );
};
