import React from 'react';
import { Cpu, CheckCircle2 } from 'lucide-react';

export const PqcStatusBadge: React.FC<{ compact?: boolean }> = ({ compact }) => {
  if (compact) {
    return (
      <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-900/90 border border-cyan-900/50 rounded text-xs">
        <Cpu className="w-3.5 h-3.5 text-cyan-400" />
        <span className="font-mono text-cyan-300 font-semibold tracking-wider text-[11px]">PQC</span>
        <span className="text-slate-400 font-mono text-[10px]">ML-KEM / ML-DSA</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-3 py-1.5 bg-[#0a1526] border border-cyan-800/40 rounded">
      <div className="p-1 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-700/40">
        <Cpu className="w-3.5 h-3.5" />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-mono font-bold tracking-wider text-cyan-200">
            POST-QUANTUM SECURITY
          </span>
          <span className="text-emerald-400 text-[10px] font-mono flex items-center gap-0.5">
            <CheckCircle2 className="w-2.5 h-2.5 inline" /> VERIFIED
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">
          ML-KEM-1024 · ML-DSA-87 (NIST FIPS 203/204)
        </span>
      </div>
    </div>
  );
};
