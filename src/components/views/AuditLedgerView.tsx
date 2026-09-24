import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LedgerBlock } from '../../types';
import {
  Boxes,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Link as LinkIcon,
  CheckCircle2,
  Cpu,
  Search,
  RotateCcw,
  Zap
} from 'lucide-react';
import { truncateHash } from '../../utils/crypto';

export const AuditLedgerView: React.FC = () => {
  const { blocks, tamperLedgerBlock, restoreLedgerBlock, setActiveView } = useApp();

  const [selectedBlockNumber, setSelectedBlockNumber] = useState<number>(
    blocks[blocks.length - 1]?.blockNumber || 184
  );
  const [search, setSearch] = useState('');

  const selectedBlock =
    blocks.find((b) => b.blockNumber === selectedBlockNumber) || blocks[blocks.length - 1];

  const filteredBlocks = blocks.filter(
    (b) =>
      b.blockNumber.toString().includes(search) ||
      b.eventId.toLowerCase().includes(search.toLowerCase()) ||
      b.recipientCode.toLowerCase().includes(search.toLowerCase()) ||
      b.watermarkId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
              Distributed Ledger Technology
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-mono text-slate-400">Permissioned Consortium</span>
          </div>
          <h1 className="text-xl font-bold font-mono text-white">
            Immutable Decryption Provenance Ledger
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Air-gapped cryptographic hash-chained blocks. Every decryption event permanently anchored.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('security')}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono rounded transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Tamper Detection Lab</span>
          </button>
        </div>
      </div>

      {/* Visual Block Chain Ribbon */}
      <div className="p-4 bg-[#090e1a] border border-slate-800 rounded-lg overflow-x-auto">
        <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-bold text-slate-300">
            <Boxes className="w-3.5 h-3.5 text-cyan-400" />
            Active Cryptographic Blockchain Sequence
          </span>
          <span className="text-slate-500">Hash Chained · Zero Single Point of Failure</span>
        </div>

        <div className="flex items-center gap-3 min-w-[700px] pb-2">
          {blocks.map((block, idx) => {
            const isSelected = selectedBlockNumber === block.blockNumber;
            const isTampered = block.isTampered;

            return (
              <React.Fragment key={block.blockNumber}>
                <div
                  onClick={() => setSelectedBlockNumber(block.blockNumber)}
                  className={`p-3.5 rounded-lg border cursor-pointer min-w-[170px] transition-all font-mono text-xs ${
                    isTampered
                      ? 'bg-rose-950/60 border-rose-600 text-rose-200 shadow-md shadow-rose-950/40'
                      : isSelected
                      ? 'bg-slate-900 border-cyan-400 text-white shadow-md shadow-cyan-950/30'
                      : 'bg-[#0d1424] border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-cyan-300">
                      BLOCK #{block.blockNumber}
                    </span>
                    {isTampered ? (
                      <span className="text-[10px] text-rose-400 font-bold animate-pulse">
                        CORRUPT
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        VALID
                      </span>
                    )}
                  </div>

                  <div className="text-slate-200 font-bold truncate">
                    {block.recipientCode}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">
                    {block.watermarkId}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 truncate select-all">
                    Hash: {truncateHash(block.blockHash, 4, 4)}
                  </div>
                </div>

                {idx < blocks.length - 1 && (
                  <div className="flex flex-col items-center justify-center shrink-0 text-slate-600">
                    <LinkIcon className="w-4 h-4 text-cyan-500/70" />
                    <span className="text-[9px] font-mono text-slate-600">prev_hash</span>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Block Inspector & Evidence Viewer */}
      {selectedBlock && (
        <div className="p-6 bg-[#090e1a] border border-slate-800 rounded-lg space-y-5 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-mono">
                  BLOCK #{selectedBlock.blockNumber} CRYPTOGRAPHIC EVIDENCE
                </h2>
                {selectedBlock.isTampered ? (
                  <span className="px-2 py-0.5 rounded bg-rose-950 border border-rose-700 text-rose-300 font-bold text-xs flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    HASH INTEGRITY BROKEN
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-800 text-emerald-300 font-bold text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    CONSENSUS REACHED
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-xs mt-1">
                Validated by {selectedBlock.validatorNode} · {selectedBlock.timestamp}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {selectedBlock.isTampered ? (
                <button
                  onClick={() => restoreLedgerBlock(selectedBlock.blockNumber)}
                  className="px-3 py-1.5 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 rounded text-xs flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Original Ledger Record</span>
                </button>
              ) : (
                <button
                  onClick={() =>
                    tamperLedgerBlock(
                      selectedBlock.blockNumber,
                      'recipientCode',
                      'SEC-ROGUE-000'
                    )
                  }
                  className="px-3 py-1.5 bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded text-xs flex items-center gap-1.5 transition-colors"
                  title="Simulate modifying this ledger record to watch cryptographic verification fail"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Simulate Record Alteration</span>
                </button>
              )}
            </div>
          </div>

          {/* Cryptographic Ledger Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#0d1424] border border-slate-800 rounded space-y-3">
              <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                Cryptographic Chaining Fields
              </div>

              <div>
                <div className="text-slate-500 text-[10px]">CURRENT BLOCK HASH:</div>
                <div
                  className={`break-all font-semibold p-2 rounded text-[11px] select-all mt-1 ${
                    selectedBlock.isTampered
                      ? 'bg-rose-950/60 text-rose-300 border border-rose-800'
                      : 'bg-slate-900 text-cyan-300'
                  }`}
                >
                  {selectedBlock.blockHash}
                </div>
              </div>

              <div>
                <div className="text-slate-500 text-[10px]">PREVIOUS BLOCK HASH (PARENT LINK):</div>
                <div className="break-all font-semibold p-2 rounded text-[11px] select-all bg-slate-900 text-slate-300 mt-1">
                  {selectedBlock.previousHash}
                </div>
              </div>

              <div>
                <div className="text-slate-500 text-[10px]">MERKLE EVENT ROOT:</div>
                <div className="break-all p-2 rounded text-[11px] select-all bg-slate-900 text-slate-400 mt-1">
                  {selectedBlock.merkleRoot}
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#0d1424] border border-slate-800 rounded space-y-3">
              <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                Bound Provenance Payload
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-500">Decryption Event ID:</span>
                  <span className="text-white font-bold">{selectedBlock.eventId}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-500">Recipient Identity:</span>
                  <span
                    className={`font-bold ${
                      selectedBlock.isTampered ? 'text-rose-400 line-through' : 'text-white'
                    }`}
                  >
                    {selectedBlock.recipientCode}
                  </span>
                </div>
                {selectedBlock.isTampered && (
                  <div className="flex justify-between py-1 text-rose-300 text-[11px] bg-rose-950/30 px-2 rounded">
                    <span>Tampered Modification:</span>
                    <span>Unauthorized Alteration Detected!</span>
                  </div>
                )}
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-500">Recipient Type:</span>
                  <span className="text-cyan-300">{selectedBlock.recipientType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-500">Forensic Watermark:</span>
                  <span className="text-cyan-300 font-bold">{selectedBlock.watermarkId}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-500">Document Hash:</span>
                  <span className="text-slate-300 select-all">{truncateHash(selectedBlock.docHash, 8, 8)}</span>
                </div>
              </div>

              <div>
                <div className="text-slate-500 text-[10px] mb-1">
                  POST-QUANTUM DIGITAL SIGNATURE (ML-DSA-87):
                </div>
                <div className="break-all p-2 rounded text-[10px] select-all bg-slate-900 text-slate-400 font-mono">
                  {selectedBlock.mlDsaSignature}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
