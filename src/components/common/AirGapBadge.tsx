import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const AirGapBadge: React.FC<{ compact?: boolean }> = ({ compact }) => {
  if (compact) {
    return (
      <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-900/90 border border-slate-700/80 rounded text-xs">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-mono text-slate-300 font-semibold tracking-wider text-[11px]">AIR-GAPPED</span>
        <span className="text-slate-500 font-mono text-[10px]">● OFFLINE</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-3 py-1.5 bg-[#0d1424] border border-slate-700/70 rounded">
      <div className="p-1 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
        <ShieldCheck className="w-3.5 h-3.5" />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span className="text-[11px] font-mono font-bold tracking-wider text-slate-200">
            AIR-GAPPED ENVIRONMENT
          </span>
          <span className="text-slate-500 text-[10px] font-mono">● OFFLINE</span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">
          Secure Local Operations · Isolated Enclave
        </span>
      </div>
    </div>
  );
};
