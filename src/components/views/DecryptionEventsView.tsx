import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DecryptionEvent } from '../../types';
import {
  KeySquare,
  Search,
  CheckCircle2,
  Clock,
  Fingerprint,
  Boxes,
  ShieldCheck,
  Eye,
  ArrowDown,
  Terminal,
  Cpu
} from 'lucide-react';
import { truncateHash } from '../../utils/crypto';

export const DecryptionEventsView: React.FC = () => {
  const { events, openWatermarkInspector, openDecryptModal } = useApp();
  const [search, setSearch] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<DecryptionEvent>(events[0]);

  const filteredEvents = events.filter(
    (e) =>
      e.eventId.toLowerCase().includes(search.toLowerCase()) ||
      e.recipientCode.toLowerCase().includes(search.toLowerCase()) ||
      e.recipientName.toLowerCase().includes(search.toLowerCase()) ||
      e.watermarkId.toLowerCase().includes(search.toLowerCase()) ||
      e.docTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
              Provenance Audit Trail
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-mono text-slate-400">Cryptographic Timeline</span>
          </div>
          <h1 className="text-xl font-bold font-mono text-white">
            Decryption Events & Signatures
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Every successful unseal binds recipient ML-DSA signature, session watermark, and immutable ledger block.
          </p>
        </div>

        <button
          onClick={() => openDecryptModal()}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-xs rounded transition-colors self-start sm:self-auto"
        >
          <KeySquare className="w-3.5 h-3.5 text-cyan-400" />
          <span>Execute New Decryption</span>
        </button>
      </div>

      {/* Main Content Layout: Left Table, Right Detailed Timeline Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search event ID (DEC-2026-000184), watermark, recipient..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#090e1a] border border-slate-800 rounded text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-2">
            {filteredEvents.map((evt) => {
              const isSelected = selectedEvent?.id === evt.id;
              return (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500/80 shadow-md shadow-cyan-950/20'
                      : 'bg-[#090e1a] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-cyan-300">
                        {evt.eventId}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-xs font-mono text-slate-400">
                        Block #{evt.ledgerBlockNumber}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{evt.verificationStatus}</span>
                    </div>
                  </div>

                  <div className="text-sm font-bold text-white font-mono truncate">
                    {evt.docTitle}
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mt-2">
                    <div>
                      <span className="text-slate-200 font-semibold">{evt.recipientName}</span>
                      <span className="text-slate-500"> ({evt.recipientCode})</span>
                      {evt.individualSubUserId && (
                        <span className="text-cyan-400 ml-1.5">[{evt.individualSubUserId}]</span>
                      )}
                    </div>
                    <span className="text-cyan-300 font-bold">{evt.watermarkId}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mt-2 pt-2 border-t border-slate-800/80">
                    <span>{evt.timestamp}</span>
                    <span>Subnet: {evt.ipAddress.split(' ')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detail Card & Timeline (5 Cols) */}
        {selectedEvent && (
          <div className="lg:col-span-5 p-5 bg-[#090e1a] border border-slate-800 rounded-lg space-y-5 font-mono text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
              <div>
                <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider">
                  Detailed Event Inspection
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {selectedEvent.eventId}
                </h3>
              </div>
              <button
                onClick={() => openWatermarkInspector(selectedEvent)}
                className="px-2.5 py-1 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/60 rounded text-cyan-300 text-[11px] transition-colors self-start sm:self-auto"
              >
                Inspect Watermark Layer
              </button>
            </div>

            {/* Event Metadata Breakdown */}
            <div className="space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Document:</span>
                <span className="text-white font-semibold">{selectedEvent.docTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Recipient ID:</span>
                <span className="text-white font-semibold">{selectedEvent.recipientCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Recipient Type:</span>
                <span className="text-cyan-300">{selectedEvent.recipientType}</span>
              </div>
              {selectedEvent.individualSubUserId && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Session Operator:</span>
                  <span className="text-amber-300">{selectedEvent.individualSubUserId} ({selectedEvent.individualSubUserName})</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Air-Gapped IP:</span>
                <span className="text-slate-300">{selectedEvent.ipAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Physical Console:</span>
                <span className="text-slate-300">{selectedEvent.terminalId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Document Hash:</span>
                <span className="text-slate-300 select-all">{truncateHash(selectedEvent.docHash, 8, 8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Forensic Watermark:</span>
                <span className="text-cyan-300 font-bold select-all">{selectedEvent.watermarkId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ledger Block:</span>
                <span className="text-emerald-400 font-bold">#{selectedEvent.ledgerBlockNumber}</span>
              </div>
            </div>

            {/* ML-DSA Digital Signature Box */}
            <div className="p-3 bg-[#0d1424] border border-cyan-900/60 rounded space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-cyan-400 font-bold flex items-center gap-1">
                  <Cpu className="w-3 h-3" />
                  RECIPIENT ML-DSA SIGNATURE
                </span>
                <span className="text-emerald-400 flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" /> VERIFIED
                </span>
              </div>
              <p className="text-[10px] text-slate-400 break-all select-all font-mono leading-tight">
                {selectedEvent.mlDsaSignature}
              </p>
            </div>

            {/* Event Timeline Visualization */}
            <div className="pt-2 border-t border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                Decryption Execution Pipeline
              </div>

              <div className="space-y-2 relative pl-4 border-l border-slate-800">
                <div className="relative">
                  <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-[#090e1a]"></span>
                  <div className="text-slate-200 font-bold text-[11px]">1. AUTHORIZED</div>
                  <div className="text-slate-500 text-[10px]">{selectedEvent.timeline.authorizedAt}</div>
                </div>

                <div className="relative">
                  <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-[#090e1a]"></span>
                  <div className="text-slate-200 font-bold text-[11px]">2. DECRYPTED</div>
                  <div className="text-slate-500 text-[10px]">{selectedEvent.timeline.decryptedAt}</div>
                </div>

                <div className="relative">
                  <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-cyan-400 ring-4 ring-[#090e1a]"></span>
                  <div className="text-cyan-300 font-bold text-[11px]">3. WATERMARK GENERATED</div>
                  <div className="text-slate-500 text-[10px]">{selectedEvent.timeline.watermarkGeneratedAt}</div>
                </div>

                <div className="relative">
                  <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-[#090e1a]"></span>
                  <div className="text-slate-200 font-bold text-[11px]">4. RECIPIENT SIGNED (ML-DSA)</div>
                  <div className="text-slate-500 text-[10px]">{selectedEvent.timeline.signedAt}</div>
                </div>

                <div className="relative">
                  <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-[#090e1a]"></span>
                  <div className="text-slate-200 font-bold text-[11px]">5. LEDGER COMMITTED</div>
                  <div className="text-slate-500 text-[10px]">{selectedEvent.timeline.ledgerCommittedAt}</div>
                </div>

                <div className="relative">
                  <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-[#090e1a]"></span>
                  <div className="text-emerald-400 font-bold text-[11px]">6. VERIFIED & COMPLETE</div>
                  <div className="text-slate-500 text-[10px]">{selectedEvent.timeline.verifiedAt}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
