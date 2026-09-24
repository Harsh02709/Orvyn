import React from 'react';
import { useApp } from '../../context/AppContext';
import { AirGapBadge } from '../common/AirGapBadge';
import { PqcStatusBadge } from '../common/PqcStatusBadge';
import {
  FileText,
  Users,
  KeySquare,
  Boxes,
  ShieldCheck,
  SearchCode,
  ArrowRight,
  Send,
  Fingerprint,
  Lock,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { truncateHash } from '../../utils/crypto';

export const OverviewView: React.FC = () => {
  const {
    documents,
    recipients,
    events,
    blocks,
    setActiveView,
    openDecryptModal,
    setDemoTourOpen,
    openWatermarkInspector,
    ledgerIntegrity
  } = useApp();

  const totalDecryptions = documents.reduce((acc, d) => acc + d.decryptionCount, 0);
  const lastBlock = blocks[blocks.length - 1];

  return (
    <div className="space-y-6">
      {/* Top Banner / Mission Context */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-[#0c1424] via-[#09101d] to-[#070b14] border border-slate-800 rounded-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-950/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase">
                High-Assurance Security Operations
              </span>
              <span className="text-slate-600">/</span>
              <span className="text-xs font-mono text-slate-400">Enterprise Enclave</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2 font-mono">
              Orvyn
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Cryptographic Attribution & Immutable Decryption Provenance for Multi-Recipient Encrypted Document Distribution.
              <span className="text-slate-400 block mt-1 text-[11px] sm:text-xs">
                "Encrypt once. Decrypt securely. Fingerprint every session. Sign every event. Record it immutably. Trace the leak cryptographically."
              </span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              onClick={() => setDemoTourOpen(true)}
              className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs font-mono rounded flex items-center justify-center gap-2 transition-colors shadow-lg shadow-cyan-950/40"
            >
              <span>RUN 14-STEP WORKFLOW TOUR</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => openDecryptModal()}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs font-mono border border-slate-700 rounded flex items-center justify-center gap-2 transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Simulate Decryption</span>
            </button>
          </div>
        </div>

        {/* Status Line */}
        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs font-mono">
          <AirGapBadge />
          <PqcStatusBadge />
          <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-[#0a1120] border border-slate-800 rounded text-slate-300">
            <Boxes className="w-3.5 h-3.5 text-cyan-400" />
            <span>LEDGER HEIGHT: #{lastBlock?.blockNumber || 184}</span>
          </div>
          <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-[#0a1120] border border-slate-800 rounded text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>ATTRIBUTION PROVENANCE: ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Primary Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-[#0a0f1d] border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Classified Vault</span>
            <FileText className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tracking-tight">
            {documents.length} Docs
          </div>
          <div className="text-xs text-slate-400 font-mono mt-1">
            {totalDecryptions} session fingerprinted decryptions
          </div>
        </div>

        <div className="p-4 bg-[#0a0f1d] border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Authorized Endpoints</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tracking-tight">
            {recipients.length} Entities
          </div>
          <div className="text-xs text-slate-400 font-mono mt-1">
            Individuals, Groups & Secure Servers
          </div>
        </div>

        <div className="p-4 bg-[#0a0f1d] border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Decryption Events</span>
            <KeySquare className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tracking-tight">
            {events.length} Recorded
          </div>
          <div className="text-xs text-slate-400 font-mono mt-1">
            100% ML-DSA Post-Quantum Signed
          </div>
        </div>

        <div className="p-4 bg-[#0a0f1d] border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Immutable DLT Blocks</span>
            <Boxes className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold font-mono text-white tracking-tight">
              #{lastBlock?.blockNumber || 184}
            </div>
            {ledgerIntegrity === 'TAMPERED' && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-300">
                TAMPERED
              </span>
            )}
          </div>
          <div className="text-xs text-slate-400 font-mono mt-1">
            Air-Gapped Consortium Consensus
          </div>
        </div>
      </div>

      {/* Core Workflow Architecture Visual (Zero-Pill, Command Center) */}
      <div className="p-6 bg-[#090e1a] border border-slate-800 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-200">
              Cryptographic Decryption Provenance Architecture
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Air-Gapped Broadcast Encryption & Individual Session Watermarking Flow
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400">Zero-Visual-Difference Engine</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          <div className="p-3.5 bg-[#0d1424] border border-slate-800 rounded flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono text-cyan-400 mb-1">STAGE 01</div>
              <div className="text-xs font-bold text-slate-100 font-mono">Broadcast Encryption</div>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Sender encrypts classified file once using ML-KEM-1024 parameters for all authorized recipients.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
              SHA3-256 Hash Chained
            </div>
          </div>

          <div className="p-3.5 bg-[#0d1424] border border-slate-800 rounded flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono text-cyan-400 mb-1">STAGE 02</div>
              <div className="text-xs font-bold text-slate-100 font-mono">Sovereign Decryption</div>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Individual or Group/Server initiates unseal using local HSM post-quantum key capsule.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
              Identity Verification
            </div>
          </div>

          <div className="p-3.5 bg-[#0d1424] border border-cyan-800/50 bg-cyan-950/20 rounded flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono text-cyan-400 mb-1">STAGE 03</div>
              <div className="text-xs font-bold text-cyan-200 font-mono">Invisible Watermarking</div>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                Session-unique invisible watermark injected. Zero visual difference. Payload bound to session ID.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-cyan-900/60 text-[10px] font-mono text-cyan-300">
              WM-XXXX-XXXX-91E4
            </div>
          </div>

          <div className="p-3.5 bg-[#0d1424] border border-slate-800 rounded flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono text-cyan-400 mb-1">STAGE 04</div>
              <div className="text-xs font-bold text-slate-100 font-mono">Recipient Signing</div>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Recipient creates an immutable ML-DSA-87 digital signature over the decryption record.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
              NIST FIPS 204 Standard
            </div>
          </div>

          <div className="p-3.5 bg-[#0d1424] border border-slate-800 rounded flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono text-cyan-400 mb-1">STAGE 05</div>
              <div className="text-xs font-bold text-slate-100 font-mono">Immutable Ledger Commit</div>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Signed record is committed to offline permissioned DLT. Tamper-evident hash chaining.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
              Consensus Block Verified
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Decryption Provenance & System Innovations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Decryption Events */}
        <div className="lg:col-span-2 p-5 bg-[#090e1a] border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold font-mono text-slate-200">
                Recent Provenance Ledger Commits
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Decryption events cryptographically anchored in offline blockchain
              </p>
            </div>
            <button
              onClick={() => setActiveView('events')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>View All Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2.5 px-3">Block / Event</th>
                  <th className="py-2.5 px-3">Document</th>
                  <th className="py-2.5 px-3">Recipient Identity</th>
                  <th className="py-2.5 px-3">Watermark ID</th>
                  <th className="py-2.5 px-3">Signature</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {events.slice(0, 4).map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-cyan-300">Block #{evt.ledgerBlockNumber}</div>
                      <div className="text-[10px] text-slate-500">{evt.sessionId}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-slate-200 font-medium truncate max-w-[150px]">
                        {evt.docTitle}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {truncateHash(evt.docHash, 6, 6)}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-slate-200">{evt.recipientName}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                        <span>{evt.recipientCode}</span>
                        {evt.individualSubUserId && (
                          <span className="text-cyan-400">· Sub: {evt.individualSubUserId}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-cyan-300 font-mono text-[11px]">
                        {evt.watermarkId}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1 text-emerald-400 text-[11px]">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>ML-DSA-87</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {truncateHash(evt.mlDsaSignature, 8, 4)}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => openWatermarkInspector(evt)}
                        className="px-2 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Key Innovations Checklist */}
        <div className="p-5 bg-[#090e1a] border border-slate-800 rounded-lg flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold font-mono text-slate-200 mb-1">
              Core Architectural Pillars
            </h2>
            <p className="text-xs text-slate-400 font-mono mb-4">
              Defence-grade provenance guarantees
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-2.5 bg-slate-900/60 border border-slate-800 rounded">
                <div className="font-semibold text-slate-200 font-mono flex items-center gap-1.5">
                  <Fingerprint className="w-3.5 h-3.5 text-cyan-400" />
                  Session-Level Forensic Fingerprint
                </div>
                <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                  Every unseal event gets a unique invisible watermark. Even when 50 authorized recipients decrypt the same broadcast file, each copy is forensically distinct.
                </p>
              </div>

              <div className="p-2.5 bg-slate-900/60 border border-slate-800 rounded">
                <div className="font-semibold text-slate-200 font-mono flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  Post-Quantum Signatures (ML-DSA)
                </div>
                <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                  Recipient-owned private signing keys execute sovereign digital signatures. Resistant to quantum algorithmic attacks.
                </p>
              </div>

              <div className="p-2.5 bg-slate-900/60 border border-slate-800 rounded">
                <div className="font-semibold text-slate-200 font-mono flex items-center gap-1.5">
                  <Boxes className="w-3.5 h-3.5 text-cyan-400" />
                  Air-Gapped Consortium DLT
                </div>
                <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                  No cloud KMS or public blockchains. Operates completely in isolated local subnets with tamper-evident cryptographic hash chaining.
                </p>
              </div>

              <div className="p-2.5 bg-slate-900/60 border border-slate-800 rounded">
                <div className="font-semibold text-slate-200 font-mono flex items-center gap-1.5">
                  <SearchCode className="w-3.5 h-3.5 text-cyan-400" />
                  Document-to-Ledger Attribution
                </div>
                <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                  Extract invisible watermark from leaked copy → instant ledger lookup → cryptographically indisputable recipient attribution.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Forensics Module:</span>
            <button
              onClick={() => setActiveView('forensics')}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Analyze Leaked Copy</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
