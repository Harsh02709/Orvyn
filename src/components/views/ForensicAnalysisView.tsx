import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ForensicReport } from '../../types';
import {
  SearchCode,
  UploadCloud,
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  Fingerprint,
  Boxes,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  Download,
  Eye,
  FileText
} from 'lucide-react';
import { truncateHash, extractZeroWidthWatermark } from '../../utils/crypto';

export const ForensicAnalysisView: React.FC = () => {
  const { runForensicAnalysis, saveForensicReport, setActiveView } = useApp();

  const [leakedFileName, setLeakedFileName] = useState('classified_operation_leaked.pdf');
  const [leakedContent, setLeakedContent] = useState(`SECURITY OPERATIONS COMMAND
CLASSIFICATION: TOP SECRET // NOFORN // AIR-GAPPED DISTRIBUTION ONLY

DOCUMENT IDENTIFIER: DOC-00472 / TACTICAL-OPS-DIRECTIVE-2026
SUBJECT: TACTICAL ASSET DEPLOYMENT & FREQUENCY CHANNELING DIRECTIVE

1. OPERATIONAL MANDATE
All tactical units operating under primary command are hereby directed to maintain strict EMCON Delta along operational sectors Alpha-7 through Bravo-9. Passive sensor arrays shall remain synchronous with encrypted telemetry beacons.`);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [reportGenerated, setReportGenerated] = useState<ForensicReport | null>(null);

  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setReportGenerated(null);

    // Simulate forensic extraction delay for realism
    setTimeout(async () => {
      const res = await runForensicAnalysis(leakedContent, leakedFileName);
      setAnalysisResult(res);
      setIsAnalyzing(false);
    }, 1200);
  };

  const handleGenerateReport = () => {
    if (analysisResult?.report) {
      saveForensicReport(analysisResult.report);
      setReportGenerated(analysisResult.report);
    }
  };

  // Preset sample leak scenarios
  const loadPreset = (preset: 'OFFICER_A' | 'INTEL_GROUP' | 'SCIF_TERMINAL') => {
    if (preset === 'OFFICER_A') {
      setLeakedFileName('classified_operation.pdf');
      setLeakedContent(`SECURITY OPERATIONS COMMAND
CLASSIFICATION: TOP SECRET // NOFORN // AIR-GAPPED DISTRIBUTION ONLY

1. OPERATIONAL MANDATE
All tactical units operating under primary command are hereby directed to maintain strict EMCON Delta along operational sectors Alpha-7 through Bravo-9.
[Watermark Channel: WM-A82F-194C-91E4]`);
    } else if (preset === 'INTEL_GROUP') {
      setLeakedFileName('strategic_intel_brief_leaked.pdf');
      setLeakedContent(`CLASSIFICATION: TOP SECRET
SUBJECT: TACTICAL ASSET DEPLOYMENT DIRECTIVE
Session identifier decrypted at Intelligence Ops Station 41.
[Watermark Channel: WM-5D88-29BC-41E0]`);
    } else {
      setLeakedFileName('pqc_spec_leaked_sample.pdf');
      setLeakedContent(`TECHNICAL SPECIFICATION SPEC-PQC-2026-V4
DEPARTMENT: CRYPTOGRAPHIC HARDWARE DIVISION
CLEARANCE LEVEL: SECRET
[Watermark Channel: WM-7E44-11A0-99D2]`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
            Forensic Investigation Lab
          </span>
          <span className="text-slate-600">/</span>
          <span className="text-xs font-mono text-slate-400">Watermark Extraction & Attribution</span>
        </div>
        <h1 className="text-xl font-bold font-mono text-white">
          Leaked Document Forensic Analysis
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          Extract hidden session watermarks, cross-reference immutable blockchain ledger records, and verify post-quantum recipient signatures.
        </p>
      </div>

      {/* Main Grid: Upload & Controls on Left, Live Analysis & Attribution Report on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload / Paste (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 bg-[#090e1a] border border-slate-800 rounded-lg space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-200 font-bold flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-cyan-400" />
                Input Suspect / Leaked Document
              </span>
              <span className="text-[10px] text-cyan-400">Air-Gapped Inspection</span>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">File Name or Recovered Label</label>
              <input
                type="text"
                value={leakedFileName}
                onChange={(e) => setLeakedFileName(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#0d1424] border border-slate-700 rounded text-slate-200"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">
                Recovered Document Stream / Payload Content
              </label>
              <textarea
                rows={9}
                value={leakedContent}
                onChange={(e) => setLeakedContent(e.target.value)}
                placeholder="Paste leaked text or drop document buffer here..."
                className="w-full p-3 bg-[#0d1424] border border-slate-700 rounded text-slate-200 font-mono text-xs leading-relaxed"
              />
            </div>

            {/* Quick Demo Presets */}
            <div>
              <div className="text-[11px] text-slate-400 mb-1.5">Load Forensic Test Scenario:</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => loadPreset('OFFICER_A')}
                  className="px-2 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-[10px] text-cyan-300 text-center"
                >
                  Officer A (Block #184)
                </button>
                <button
                  type="button"
                  onClick={() => loadPreset('INTEL_GROUP')}
                  className="px-2 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-[10px] text-indigo-300 text-center"
                >
                  Group Recipient
                </button>
                <button
                  type="button"
                  onClick={() => loadPreset('SCIF_TERMINAL')}
                  className="px-2 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-[10px] text-amber-300 text-center"
                >
                  SCIF Terminal
                </button>
              </div>
            </div>

            <button
              onClick={handleStartAnalysis}
              disabled={isAnalyzing}
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-slate-950 font-bold font-mono rounded flex items-center justify-center gap-2 transition-colors shadow-lg shadow-cyan-950/40"
            >
              {isAnalyzing ? (
                <span>Extracting Invisible Fingerprint...</span>
              ) : (
                <>
                  <SearchCode className="w-4 h-4" />
                  <span>Execute Forensic Attribution Analysis</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Forensic Results & Attribution Card (7 Cols) */}
        <div className="lg:col-span-7">
          {isAnalyzing ? (
            <div className="p-12 bg-[#090e1a] border border-slate-800 rounded-lg flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
              <div className="font-mono text-sm font-bold text-white">
                Running Multi-Layer Forensic Decomposition
              </div>
              <div className="text-xs text-slate-400 font-mono space-y-1">
                <div>[1/4] Calculating document SHA3-256 and SHA-256 hashes...</div>
                <div>[2/4] Scanning zero-width Unicode steganographic spectrum...</div>
                <div>[3/4] Searching offline permissioned blockchain ledger...</div>
                <div>[4/4] Validating post-quantum ML-DSA-87 digital signature...</div>
              </div>
            </div>
          ) : analysisResult ? (
            <div className="p-4 sm:p-6 bg-[#090e1a] border border-slate-800 rounded-lg space-y-4 sm:space-y-5 font-mono text-xs">
              {/* Top Result Banner */}
              <div className="p-3.5 sm:p-4 bg-emerald-950/40 border border-emerald-700/60 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                      ATTRIBUTION STATUS
                    </div>
                    <div className="text-sm sm:text-base font-bold text-white">
                      CRYPTOGRAPHICALLY VERIFIED
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-[10px] text-slate-400">LEDGER MATCH</div>
                  <div className="text-xs font-bold text-emerald-400">
                    ✓ MATCH FOUND IN BLOCK #{analysisResult.block?.blockNumber || 184}
                  </div>
                </div>
              </div>

              {/* Exact Evidence Match Table */}
              <div className="space-y-3 bg-[#0d1424] border border-slate-800 p-4 rounded">
                <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-800 pb-2">
                  Forensic Attribution Evidence Matrix
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-slate-300">
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-500">LEAKED DOCUMENT:</span>
                    <span className="text-white font-bold">{leakedFileName}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-500">FORENSIC WATERMARK:</span>
                    <span className="text-cyan-300 font-bold select-all">
                      {analysisResult.watermarkId}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-500">DOCUMENT HASH:</span>
                    <span className="text-slate-300 select-all">
                      {truncateHash(analysisResult.event?.docHash || 'e3b0c44298fc1c14', 6, 6)}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-500">RECIPIENT NAME:</span>
                    <span className="text-white font-bold">
                      {analysisResult.recipient?.name || 'Officer A (V. Rao)'}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-500">RECIPIENT IDENTITY:</span>
                    <span className="text-cyan-400 font-bold">
                      {analysisResult.recipient?.code || 'SEC-OPS-0471'}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-500">RECIPIENT TYPE:</span>
                    <span className="text-slate-300">
                      {analysisResult.recipient?.type || 'INDIVIDUAL'}
                    </span>
                  </div>

                  {analysisResult.event?.individualSubUserId && (
                    <div className="flex justify-between py-1 border-b border-slate-800/60 col-span-2">
                      <span className="text-slate-500">INDIVIDUAL SUB-OPERATOR:</span>
                      <span className="text-amber-300 font-bold">
                        {analysisResult.event.individualSubUserId} ({analysisResult.event.individualSubUserName})
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-500">SESSION IDENTIFIER:</span>
                    <span className="text-slate-300">{analysisResult.event?.sessionId}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-500">UNSEAL TIMESTAMP:</span>
                    <span className="text-slate-300">{analysisResult.event?.timestamp}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-500">SIGNATURE:</span>
                    <span className="text-emerald-400 font-bold">ML-DSA VERIFIED ✓</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-500">LEDGER PROOF:</span>
                    <span className="text-emerald-400 font-bold">
                      BLOCK #{analysisResult.block?.blockNumber || 184} VERIFIED ✓
                    </span>
                  </div>
                </div>
              </div>

              {/* Digital Signature Audit Seal */}
              <div className="p-3 bg-slate-900 border border-slate-800 rounded space-y-1">
                <div className="text-[10px] text-slate-500">CRYPTOGRAPHIC SIGNATURE EVIDENCE:</div>
                <div className="text-[10px] text-slate-300 break-all select-all font-mono leading-relaxed">
                  {analysisResult.event?.mlDsaSignature}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="text-slate-500 text-[11px]">
                  Attribution verified under NIST FIPS 204 parameters.
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleGenerateReport}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded flex items-center gap-1.5 transition-colors"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>Generate Forensic Report</span>
                  </button>
                  {reportGenerated && (
                    <button
                      onClick={() => setActiveView('reports')}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded transition-colors flex items-center gap-1"
                    >
                      <span>View in Reports Vault</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 bg-[#090e1a] border border-slate-800 rounded-lg flex flex-col items-center justify-center text-center space-y-3">
              <SearchCode className="w-12 h-12 text-slate-600" />
              <div className="font-mono text-sm font-bold text-slate-300">
                Forensic Analysis Ready
              </div>
              <p className="text-xs text-slate-500 font-mono max-w-md">
                Load a suspect document or select a sample scenario on the left, then click "Execute Forensic Attribution Analysis".
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
