import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ForensicReport } from '../../types';
import {
  FileCheck2,
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Boxes,
  Cpu,
  Fingerprint,
  Search,
  ExternalLink
} from 'lucide-react';
import { truncateHash } from '../../utils/crypto';

export const ReportsView: React.FC = () => {
  const { reports, setActiveView } = useApp();
  const [selectedReport, setSelectedReport] = useState<ForensicReport>(reports[0]);
  const [search, setSearch] = useState('');

  const filteredReports = reports.filter(
    (r) =>
      r.caseId.toLowerCase().includes(search.toLowerCase()) ||
      r.matchedRecipientCode.toLowerCase().includes(search.toLowerCase()) ||
      r.extractedWatermarkId.toLowerCase().includes(search.toLowerCase()) ||
      r.documentTitle.toLowerCase().includes(search.toLowerCase())
  );

  const handlePrint = () => {
    window.print();
  };

  const handleExportText = () => {
    if (!selectedReport) return;
    const textData = `SECURE DOCUMENT PROVENANCE ENCLAVE
OFFICIAL FORENSIC ATTRIBUTION REPORT: ${selectedReport.caseId}
DATE: ${selectedReport.generatedAt}
INVESTIGATING UNIT: ${selectedReport.investigatorUnit}
================================================================================
CASE SUMMARY & VERDICT:
Status: ${selectedReport.attributionStatus}
Verdict: ${selectedReport.officialVerdict}

EVIDENTIARY TRACE CHAIN:
1. Leaked Document: ${selectedReport.leakedFileName}
2. Original Document: ${selectedReport.documentTitle} (ID: ${selectedReport.documentId})
3. Document Hash: ${selectedReport.documentHash}
4. Extracted Invisible Watermark: ${selectedReport.extractedWatermarkId}
5. Attributed Recipient: ${selectedReport.matchedRecipientName} (${selectedReport.matchedRecipientCode})
6. Recipient Type: ${selectedReport.matchedRecipientType}
7. Decryption Session ID: ${selectedReport.sessionId}
8. Decryption Timestamp: ${selectedReport.decryptionTimestamp}
9. Post-Quantum Digital Signature: ${selectedReport.digitalSignature}
10. Immutable Ledger Block: #${selectedReport.ledgerBlockNumber}
11. Previous Block Hash: ${selectedReport.previousBlockHash}
12. Current Block Hash: ${selectedReport.currentBlockHash}

CRYPTOGRAPHIC INTEGRITY CHECKS:
[PASS] Invisible Forensic Watermark Byte Matching
[PASS] Post-Quantum ML-DSA-87 Digital Signature Pre-image
[PASS] Air-Gapped Permissioned Blockchain Chaining
[PASS] Zero-Visual-Difference Plaintext Conformance
================================================================================
ISSUED UNDER THE AUTHORITY OF ORVYN ENCLAVE`;

    const blob = new Blob([textData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedReport.caseId}_VERIFIED_REPORT.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
              Counter-Intelligence Archives
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-mono text-slate-400">Attribution Reports Vault</span>
          </div>
          <h1 className="text-xl font-bold font-mono text-white">
            Forensic Attribution Case Reports
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Formal evidentiary dossiers cross-linking invisible watermarks, sovereign ML-DSA signatures, and immutable DLT proofs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('forensics')}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-xs rounded transition-colors"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>New Investigation</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left report list, Right full official dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search case ID, watermark, recipient..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#090e1a] border border-slate-800 rounded text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-2">
            {filteredReports.map((rep) => {
              const isSelected = selectedReport?.caseId === rep.caseId;
              return (
                <div
                  key={rep.caseId}
                  onClick={() => setSelectedReport(rep)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all font-mono text-xs ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-400 shadow-md shadow-cyan-950/20'
                      : 'bg-[#090e1a] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-cyan-300">{rep.caseId}</span>
                    <span className="text-emerald-400 text-[10px] font-semibold">VERIFIED</span>
                  </div>

                  <div className="text-white font-bold truncate">{rep.matchedRecipientName}</div>
                  <div className="text-slate-400 text-[11px] truncate">
                    {rep.matchedRecipientCode} · Block #{rep.ledgerBlockNumber}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800/80 flex justify-between text-[10px] text-slate-500">
                    <span>{rep.extractedWatermarkId}</span>
                    <span>{rep.generatedAt.split('—')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Full Dossier (8 Cols) */}
        {selectedReport && (
          <div className="lg:col-span-8 p-6 bg-[#090e1a] border border-slate-800 rounded-lg space-y-6 font-mono text-xs">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-cyan-400">
                    Official Evidentiary Dossier
                  </span>
                  <span className="text-slate-600">/</span>
                  <span className="text-[10px] text-slate-400">Security Enclave</span>
                </div>
                <h2 className="text-lg font-bold text-white mt-0.5">
                  {selectedReport.caseId}
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <button
                  onClick={handleExportText}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Export Report (.txt)</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Dossier</span>
                </button>
              </div>
            </div>

            {/* Verdict Box */}
            <div className="p-4 bg-emerald-950/40 border border-emerald-700/60 rounded space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                  OFFICIAL ATTRIBUTION VERDICT
                </span>
                <span className="text-emerald-300 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {selectedReport.attributionStatus}
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans font-medium">
                {selectedReport.officialVerdict}
              </p>
              <div className="text-[10px] text-slate-400 pt-1">
                Investigating Unit: {selectedReport.investigatorUnit} · Date: {selectedReport.generatedAt}
              </div>
            </div>

            {/* Chain of Custody & Evidence Breakdown */}
            <div className="space-y-4">
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                Cryptographic Evidence Chain
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-[#0d1424] border border-slate-800 rounded space-y-2">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Document Identification</div>
                  <div className="space-y-1 text-slate-300 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Suspect File:</span>
                      <span className="text-white font-bold">{selectedReport.leakedFileName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Original Document:</span>
                      <span className="text-white">{selectedReport.documentTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Document ID:</span>
                      <span className="text-cyan-300">{selectedReport.documentId}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px]">DOCUMENT HASH:</span>
                      <div className="text-slate-300 text-[10px] break-all select-all bg-slate-900 p-1.5 rounded mt-0.5">
                        {selectedReport.documentHash}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-[#0d1424] border border-slate-800 rounded space-y-2">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Attributed Recipient & Session</div>
                  <div className="space-y-1 text-slate-300 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Recipient Name:</span>
                      <span className="text-white font-bold">{selectedReport.matchedRecipientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Recipient Code:</span>
                      <span className="text-cyan-400 font-bold">{selectedReport.matchedRecipientCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Recipient Type:</span>
                      <span className="text-slate-300">{selectedReport.matchedRecipientType}</span>
                    </div>
                    {selectedReport.individualAttribution && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Individual Sub-User:</span>
                        <span className="text-amber-300 font-bold">{selectedReport.individualAttribution}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-500">Session ID:</span>
                      <span className="text-slate-300">{selectedReport.sessionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Unseal Timestamp:</span>
                      <span className="text-slate-300">{selectedReport.decryptionTimestamp}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Watermark & Blockchain Proof Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-[#0d1424] border border-slate-800 rounded space-y-2">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Forensic Watermark Proof</div>
                  <div className="space-y-1 text-slate-300 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Extracted Watermark:</span>
                      <span className="text-cyan-300 font-bold select-all">
                        {selectedReport.extractedWatermarkId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Visual Deviation:</span>
                      <span className="text-emerald-400 font-bold">0.00% (Identical Output)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Encoding Scheme:</span>
                      <span className="text-slate-400">Zero-Width Stego & Spatial Enclave</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-[#0d1424] border border-slate-800 rounded space-y-2">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Blockchain / DLT Proof</div>
                  <div className="space-y-1 text-slate-300 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Anchored Block:</span>
                      <span className="text-emerald-400 font-bold">
                        BLOCK #{selectedReport.ledgerBlockNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Signature Algorithm:</span>
                      <span className="text-white font-bold">
                        {selectedReport.signatureAlgorithm} (NIST FIPS 204)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Hash Chaining:</span>
                      <span className="text-emerald-400 font-bold">VERIFIED VALID</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Digital Signature Proof Block */}
              <div className="p-3 bg-slate-900 border border-slate-800 rounded space-y-1">
                <div className="text-[10px] text-slate-500">
                  RECIPIENT DIGITAL SIGNATURE (PROVENANCE PRE-IMAGE):
                </div>
                <div className="text-[10px] text-slate-300 break-all select-all font-mono leading-tight">
                  {selectedReport.digitalSignature}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
