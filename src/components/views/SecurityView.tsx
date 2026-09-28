import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  ShieldCheck,
  Cpu,
  Lock,
  Boxes,
  AlertTriangle,
  RotateCcw,
  Zap,
  CheckCircle2,
  XCircle,
  FileText,
  Activity,
  Server
} from 'lucide-react';
import { truncateHash } from '../../utils/crypto';

export const SecurityView: React.FC = () => {
  const {
    blocks,
    documents,
    recipients,
    events,
    nodes,
    tamperLedgerBlock,
    restoreLedgerBlock,
    ledgerIntegrity
  } = useApp();

  const [tamperTargetBlock, setTamperTargetBlock] = useState<number>(184);
  const [tamperRecipientValue, setTamperRecipientValue] = useState('SEC-ROGUE-9999');

  const targetBlock = blocks.find((b) => b.blockNumber === tamperTargetBlock) || blocks[blocks.length - 1];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
            Security Command & Verification
          </span>
          <span className="text-slate-600">/</span>
          <span className="text-xs font-mono text-slate-400">Tamper-Evidence Lab</span>
        </div>
        <h1 className="text-xl font-bold font-mono text-white">
          Security Health & Cryptographic Immutability
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          Real-time consensus verification, post-quantum cipher compliance, and interactive hash-chain tamper detection demonstration.
        </p>
      </div>

      {/* 5 Security Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono text-xs">
        <div className="p-3.5 bg-[#090e1a] border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase">Air-Gapped Status</span>
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-sm font-bold text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>OFFLINE LOCAL</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Zero Cloud KMS Calls</div>
        </div>

        <div className="p-3.5 bg-[#090e1a] border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase">Post-Quantum Algorithms</span>
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-sm font-bold text-cyan-300">
            FIPS 203 / 204
          </div>
          <div className="text-[10px] text-slate-500 mt-1">ML-KEM & ML-DSA</div>
        </div>

        <div className="p-3.5 bg-[#090e1a] border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase">Ledger Integrity</span>
            <Boxes className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div
            className={`text-sm font-bold flex items-center gap-1 ${
              ledgerIntegrity === 'TAMPERED' ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {ledgerIntegrity === 'TAMPERED' ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>TAMPER DETECTED</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>CONSENSUS 100%</span>
              </>
            )}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">#{blocks[blocks.length - 1]?.blockNumber} Chained Blocks</div>
        </div>

        <div className="p-3.5 bg-[#090e1a] border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase">Watermark Engine</span>
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-sm font-bold text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>ACTIVE 100%</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Zero Visual Difference</div>
        </div>

        <div className="p-3.5 bg-[#090e1a] border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase">Key Management</span>
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-sm font-bold text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>AIR-GAPPED HSM</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Zero Private Key Leakage</div>
        </div>
      </div>

      {/* Immutability Demonstration Module */}
      <div className="p-6 bg-[#090e1a] border border-slate-800 rounded-lg space-y-5 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h2 className="text-base font-bold text-white uppercase">
                Interactive Immutability Demonstration
              </h2>
            </div>
            <p className="text-slate-400 text-xs mt-1">
              Simulate an unauthorized rogue administrator attempting to alter a committed ledger record.
            </p>
          </div>

          {targetBlock?.isTampered && (
            <button
              onClick={() => restoreLedgerBlock(targetBlock.blockNumber)}
              className="px-3.5 py-2 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 rounded text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Block #{targetBlock.blockNumber}</span>
            </button>
          )}
        </div>

        {/* Tamper Control Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-slate-400 mb-1">Target Ledger Block</label>
            <select
              value={tamperTargetBlock}
              onChange={(e) => setTamperTargetBlock(Number(e.target.value))}
              className="w-full px-3 py-1.5 bg-[#0d1424] border border-slate-700 rounded text-slate-200"
            >
              {blocks.map((b) => (
                <option key={b.blockNumber} value={b.blockNumber}>
                  Block #{b.blockNumber} ({b.recipientCode} - {b.eventId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">
              Malicious Recipient Replacement Value
            </label>
            <input
              type="text"
              value={tamperRecipientValue}
              onChange={(e) => setTamperRecipientValue(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#0d1424] border border-slate-700 rounded text-slate-200"
            />
          </div>

          <div className="flex items-end">
            {targetBlock?.isTampered ? (
              <button
                type="button"
                onClick={() => restoreLedgerBlock(targetBlock.blockNumber)}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded flex items-center justify-center gap-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset to Legitimate State</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  tamperLedgerBlock(
                    targetBlock.blockNumber,
                    'recipientCode',
                    tamperRecipientValue
                  )
                }
                className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded flex items-center justify-center gap-2 transition-colors shadow-lg shadow-rose-950/40"
              >
                <Zap className="w-4 h-4" />
                <span>Execute Tamper Attack Simulation</span>
              </button>
            )}
          </div>
        </div>

        {/* Comparison Grid: Legitimate vs Tampered Evidence */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Legitimate Block Baseline */}
          <div className="p-4 bg-[#0d1424] border border-slate-800 rounded space-y-3">
            <div className="flex items-center justify-between text-slate-400">
              <span className="font-bold text-slate-200">AUTHENTIC LEDGER RECORD</span>
              <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="w-3 h-3" /> VERIFIED
              </span>
            </div>

            <div className="space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Block Number:</span>
                <span className="font-bold">#{targetBlock?.blockNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Legitimate Recipient:</span>
                <span className="text-white font-bold">
                  {targetBlock?.originalData?.recipientCode || targetBlock?.recipientCode}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Watermark ID:</span>
                <span className="text-cyan-300">
                  {targetBlock?.originalData?.watermarkId || targetBlock?.watermarkId}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px]">ORIGINAL BLOCK HASH:</span>
                <div className="break-all p-2 rounded bg-slate-900 text-cyan-300 select-all mt-0.5">
                  {targetBlock?.originalData?.blockHash || targetBlock?.blockHash}
                </div>
              </div>
            </div>
          </div>

          {/* Current Verification Output */}
          <div
            className={`p-4 rounded space-y-3 border ${
              targetBlock?.isTampered
                ? 'bg-rose-950/40 border-rose-700/80 text-rose-200'
                : 'bg-[#0d1424] border-slate-800 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">LIVE AUDIT VERIFICATION</span>
              {targetBlock?.isTampered ? (
                <span className="text-rose-400 flex items-center gap-1 text-[11px] font-bold animate-pulse">
                  <XCircle className="w-3 h-3" /> INTEGRITY FAILED
                </span>
              ) : (
                <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3 h-3" /> ALL CHECKS PASS
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span>Cryptographic Hash Check:</span>
                {targetBlock?.isTampered ? (
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> ✗ HASH MISMATCH
                  </span>
                ) : (
                  <span className="text-emerald-400 font-bold">✓ SHA-256 MATCHED</span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span>Block Chain Integrity:</span>
                {targetBlock?.isTampered ? (
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> ✗ BLOCK INTEGRITY FAILED
                  </span>
                ) : (
                  <span className="text-emerald-400 font-bold">✓ CHAIN LINK VALID</span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span>ML-DSA Signature Validity:</span>
                {targetBlock?.isTampered ? (
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> ✗ SIGNATURE INVALID
                  </span>
                ) : (
                  <span className="text-emerald-400 font-bold">✓ DIGITAL SIG VALID</span>
                )}
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] leading-relaxed">
                {targetBlock?.isTampered ? (
                  <p className="text-rose-300 font-semibold">
                    Tamper Detected: The recalculated hash <code>SHA256(BlockHeader + MaliciousPayload)</code> does not match the anchored block header. Consensus nodes immediately reject this state.
                  </p>
                ) : (
                  <p className="text-slate-400">
                    The block matches its cryptographic hash pre-image. Any single-byte modification invalidates the parent hash chain and recipient signature.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Technical Notice */}
        <div className="p-3 bg-slate-900 border border-slate-800 rounded text-[11px] text-slate-400 leading-relaxed">
          <strong className="text-slate-200">Cryptographic Principle:</strong> The system does not make mystical claims that data is "physically impossible to touch." Rather, any unauthorized modification becomes immediately mathematically detectable across independent air-gapped validator nodes through hash-chain verification and ML-DSA digital signatures.
        </div>
      </div>

      {/* Consensus Nodes Status */}
      <div className="p-5 bg-[#090e1a] border border-slate-800 rounded-lg space-y-3 font-mono text-xs">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Server className="w-4 h-4 text-cyan-400" />
          Air-Gapped Consortium Validation Nodes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {nodes.map((node) => (
            <div key={node.id} className="p-3.5 bg-[#0d1424] border border-slate-800 rounded space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">{node.name}</span>
                <span className="text-[10px] text-emerald-400 font-semibold">{node.status}</span>
              </div>
              <div className="text-slate-400 text-[11px]">{node.role}</div>
              <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800/80 flex justify-between">
                <span>Subnet: {node.ip}</span>
                <span>Latency: {node.latency}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
