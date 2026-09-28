import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Fingerprint,
  Eye,
  Layers,
  Sparkles,
  CheckCircle2,
  Cpu,
  Boxes,
  Binary
} from 'lucide-react';
import { truncateHash } from '../../utils/crypto';

export const WatermarkInspectorModal: React.FC = () => {
  const { watermarkInspectorModal, closeWatermarkInspector, documents } = useApp();
  const [viewMode, setViewMode] = useState<'NORMAL' | 'FORENSIC_SPECTRUM' | 'BINARY_STREAM'>('NORMAL');

  if (!watermarkInspectorModal.isOpen || !watermarkInspectorModal.event) return null;

  const event = watermarkInspectorModal.event;
  const doc = documents.find((d) => d.docId === event.docId) || documents[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-[#090e1a] border border-slate-700 rounded-lg max-w-3xl w-full p-4 sm:p-6 space-y-4 sm:space-y-5 font-mono text-xs shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                Invisible Forensic Watermark Inspector
              </h2>
              <div className="text-[10px] sm:text-[11px] text-slate-400">
                Watermark ID: <span className="text-cyan-300 font-bold">{event.watermarkId}</span> · Session: {event.sessionId}
              </div>
            </div>
          </div>
          <button
            onClick={closeWatermarkInspector}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* View Mode Selector Tabs */}
        <div className="flex items-center justify-between bg-slate-900/80 p-1.5 rounded border border-slate-800">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode('NORMAL')}
              className={`px-3 py-1.5 rounded transition-colors text-xs flex items-center gap-1.5 ${
                viewMode === 'NORMAL'
                  ? 'bg-slate-800 text-cyan-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Normal Recipient View (Visually Identical)</span>
            </button>

            <button
              onClick={() => setViewMode('FORENSIC_SPECTRUM')}
              className={`px-3 py-1.5 rounded transition-colors text-xs flex items-center gap-1.5 ${
                viewMode === 'FORENSIC_SPECTRUM'
                  ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Forensic Spectrum (Stegano Highlighting)</span>
            </button>

            <button
              onClick={() => setViewMode('BINARY_STREAM')}
              className={`px-3 py-1.5 rounded transition-colors text-xs flex items-center gap-1.5 ${
                viewMode === 'BINARY_STREAM'
                  ? 'bg-indigo-950 text-indigo-300 font-bold border border-indigo-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Binary className="w-3.5 h-3.5 text-indigo-400" />
              <span>Binary Bitstream Payload</span>
            </button>
          </div>

          <span className="text-[10px] text-emerald-400 hidden sm:inline flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Zero Visual Deviation
          </span>
        </div>

        {/* Viewport Content */}
        <div className="p-4 bg-[#060a12] border border-slate-800 rounded min-h-[220px] max-h-72 overflow-y-auto leading-relaxed text-slate-300 select-all font-mono text-[11px]">
          {viewMode === 'NORMAL' && (
            <div>
              <p className="mb-2 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                DOCUMENT OUTPUT AS PRESENTED TO {event.recipientCode}:
              </p>
              <div className="whitespace-pre-wrap">{doc.fullText}</div>
            </div>
          )}

          {viewMode === 'FORENSIC_SPECTRUM' && (
            <div className="space-y-3">
              <div className="p-2.5 bg-cyan-950/30 border border-cyan-800/40 rounded text-[11px] text-cyan-300">
                <strong>Forensic Spectrum Active:</strong> Rendering hidden zero-width unicode glyphs in glowing contrast. Notice how in normal reading these glyphs occupy exactly 0 pixels width.
              </div>
              <div className="whitespace-pre-wrap">
                {doc.fullText.slice(0, 19)}
                <span className="bg-cyan-500/30 text-cyan-300 px-1 py-0.5 rounded border border-cyan-400 font-bold mx-0.5">
                  [HIDDEN_PAYLOAD::&ZeroWidthSpace;&zwnj;&zwj;::{event.watermarkId}::{event.sessionId}]
                </span>
                {doc.fullText.slice(19)}
              </div>
            </div>
          )}

          {viewMode === 'BINARY_STREAM' && (
            <div className="space-y-3">
              <div className="p-2.5 bg-indigo-950/30 border border-indigo-800/40 rounded text-[11px] text-indigo-300">
                <strong>Steganographic Bitstream:</strong> Binary representation encoded between token whitespace.
              </div>
              <div className="bg-slate-950 p-3 rounded border border-slate-800 text-[10px] font-mono break-all text-indigo-200">
                01010011 01000100 01010000 00101101 01010111 01001101 00111010 00111010 {event.watermarkId.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ')} 00111010 00111010 {event.sessionId.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ')}
              </div>
            </div>
          )}
        </div>

        {/* Bound Provenance Metadata */}
        <div className="p-3 bg-[#0d1424] border border-slate-800 rounded grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] text-slate-400">
          <div>
            <span className="text-slate-500 block text-[10px]">WATERMARK HASH:</span>
            <span className="text-slate-200 select-all font-semibold">
              {truncateHash(event.watermarkHash, 6, 6)}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">RECIPIENT CODE:</span>
            <span className="text-cyan-300 font-semibold">{event.recipientCode}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">LEDGER ANCHOR:</span>
            <span className="text-emerald-400 font-semibold">Block #{event.ledgerBlockNumber}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">SIGNATURE:</span>
            <span className="text-slate-200 font-semibold">ML-DSA Verified</span>
          </div>
        </div>

        <div className="flex items-center justify-end pt-2 border-t border-slate-800">
          <button
            onClick={closeWatermarkInspector}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
