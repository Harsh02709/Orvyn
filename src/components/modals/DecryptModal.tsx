import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Lock,
  KeySquare,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Fingerprint,
  Boxes,
  ArrowRight,
  Eye,
  Copy,
  Download
} from 'lucide-react';
import { truncateHash } from '../../utils/crypto';

export const DecryptModal: React.FC = () => {
  const {
    decryptModalState,
    closeDecryptModal,
    documents,
    recipients,
    performDecryption,
    openWatermarkInspector,
    setActiveView
  } = useApp();

  const [selectedDocId, setSelectedDocId] = useState<string>('');
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>('');
  const [subUserId, setSubUserId] = useState<string>('OFFICER-023');
  const [subUserName, setSubUserName] = useState<string>('Lt. Cdr. K. Sen');

  const [step, setStep] = useState<'SELECT' | 'PROCESSING' | 'SUCCESS'>('SELECT');
  const [processStepIndex, setProcessStepIndex] = useState<number>(0);
  const [decryptionResult, setDecryptionResult] = useState<any | null>(null);

  useEffect(() => {
    if (decryptModalState.isOpen) {
      setStep('SELECT');
      setSelectedDocId(decryptModalState.documentId || documents[0]?.id || '');
      setSelectedRecipientId(decryptModalState.recipientId || recipients[0]?.id || '');
    }
  }, [decryptModalState, documents, recipients]);

  if (!decryptModalState.isOpen) return null;

  const currentDoc = documents.find((d) => d.id === selectedDocId) || documents[0];
  const currentRec = recipients.find((r) => r.id === selectedRecipientId) || recipients[0];

  const isGroupOrServer =
    currentRec?.type === 'GROUP' ||
    currentRec?.type === 'SERVER' ||
    currentRec?.type === 'SECURE_TERMINAL';

  const handleStartDecryption = async () => {
    setStep('PROCESSING');
    setProcessStepIndex(0);

    // Sequence through visual steps
    setTimeout(() => setProcessStepIndex(1), 500); // Decrypting with ML-KEM
    setTimeout(() => setProcessStepIndex(2), 1000); // Injecting unique session watermark
    setTimeout(() => setProcessStepIndex(3), 1500); // Signing with ML-DSA
    setTimeout(async () => {
      setProcessStepIndex(4); // Committing to offline ledger
      const res = await performDecryption(
        currentDoc.id,
        currentRec.id,
        isGroupOrServer ? subUserId : undefined,
        isGroupOrServer ? subUserName : undefined
      );
      setDecryptionResult(res);
      setTimeout(() => {
        setStep('SUCCESS');
      }, 500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-[#090e1a] border border-slate-700 rounded-lg max-w-2xl w-full p-4 sm:p-6 space-y-4 sm:space-y-5 font-mono text-xs shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
            <h2 className="text-sm sm:text-base font-bold text-white font-mono truncate">
              Execute Sovereign Decryption & Provenance Binding
            </h2>
          </div>
          <button
            onClick={closeDecryptModal}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === 'SELECT' && (
          <div className="space-y-4">
            <div>
              <label className="block text-slate-400 mb-1">Select Classified Document to Unseal</label>
              <select
                value={selectedDocId}
                onChange={(e) => setSelectedDocId(e.target.value)}
                className="w-full px-3 py-2 bg-[#0d1424] border border-slate-700 rounded text-slate-200"
              >
                {documents.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.title} ({doc.classification} - {doc.docId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Select Decrypting Endpoint / Recipient</label>
              <select
                value={selectedRecipientId}
                onChange={(e) => setSelectedRecipientId(e.target.value)}
                className="w-full px-3 py-2 bg-[#0d1424] border border-slate-700 rounded text-slate-200"
              >
                {recipients.map((rec) => (
                  <option key={rec.id} value={rec.id}>
                    {rec.name} [{rec.code}] — {rec.type}
                  </option>
                ))}
              </select>
            </div>

            {/* Individual vs Group Attribution Demonstration */}
            {isGroupOrServer && (
              <div className="p-3 bg-[#0c1626] border border-cyan-800/50 rounded space-y-3">
                <div className="text-[11px] font-bold text-cyan-300">
                  Group / Server Operational Sub-Identity Binding
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Because this endpoint is a <strong>{currentRec.type}</strong>, every individual session operator retains distinct forensic provenance.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-slate-400 text-[10px] mb-1">Operator Badge / User ID</label>
                    <input
                      type="text"
                      value={subUserId}
                      onChange={(e) => setSubUserId(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#090e1a] border border-slate-700 rounded text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px] mb-1">Operator Name</label>
                    <input
                      type="text"
                      value={subUserName}
                      onChange={(e) => setSubUserName(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#090e1a] border border-slate-700 rounded text-slate-200"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Cryptographic Execution Preview */}
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded space-y-1 text-slate-400">
              <div className="flex justify-between">
                <span>Key Decapsulation:</span>
                <span className="text-white font-bold">ML-KEM-1024</span>
              </div>
              <div className="flex justify-between">
                <span>Provenance Signature:</span>
                <span className="text-white font-bold">ML-DSA-87 (Private Signing Key)</span>
              </div>
              <div className="flex justify-between">
                <span>Watermark Engine:</span>
                <span className="text-cyan-300">Invisible Session Zero-Width Injection</span>
              </div>
              <div className="flex justify-between">
                <span>Audit Target:</span>
                <span className="text-emerald-400">Offline Permissioned Ledger</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={closeDecryptModal}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStartDecryption}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded flex items-center gap-1.5 transition-colors shadow-lg shadow-cyan-950/40"
              >
                <KeySquare className="w-3.5 h-3.5" />
                <span>Decrypt & Generate Provenance</span>
              </button>
            </div>
          </div>
        )}

        {step === 'PROCESSING' && (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
            <div className="text-sm font-bold text-white">
              Executing Cryptographic Pipeline
            </div>
            <div className="space-y-1.5 text-xs text-slate-400 max-w-sm">
              <div className={processStepIndex >= 1 ? 'text-cyan-300 font-bold' : 'text-slate-600'}>
                [1/4] Decapsulating ciphertext via ML-KEM-1024...
              </div>
              <div className={processStepIndex >= 2 ? 'text-cyan-300 font-bold' : 'text-slate-600'}>
                [2/4] Injecting invisible zero-width session watermark...
              </div>
              <div className={processStepIndex >= 3 ? 'text-cyan-300 font-bold' : 'text-slate-600'}>
                [3/4] Generating sovereign ML-DSA-87 digital signature...
              </div>
              <div className={processStepIndex >= 4 ? 'text-cyan-300 font-bold' : 'text-slate-600'}>
                [4/4] Committing block to air-gapped ledger...
              </div>
            </div>
          </div>
        )}

        {step === 'SUCCESS' && decryptionResult && (
          <div className="space-y-4">
            <div className="p-3 bg-emerald-950/40 border border-emerald-700/60 rounded flex items-center gap-2.5 text-emerald-300">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div>
                <span className="font-bold">Decryption & Provenance Anchored:</span>{' '}
                <span>
                  Committed to Block #{decryptionResult.block.blockNumber} with Watermark {decryptionResult.event.watermarkId}
                </span>
              </div>
            </div>

            {/* Zero Visual Difference Notice */}
            <div className="p-3 bg-[#0d1424] border border-cyan-900/60 rounded space-y-1 text-slate-300">
              <div className="flex justify-between text-cyan-300 font-bold">
                <span>ZERO VISUAL DIFFERENCE CONFIRMED</span>
                <span>Byte Matched</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                The document text below appears 100% visually indistinguishable from any other recipient's copy, yet contains an invisible binary cryptographic payload tied exclusively to this session.
              </p>
            </div>

            {/* Decrypted Text Preview */}
            <div>
              <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                <span>Decrypted Classified Plaintext</span>
                <span className="text-cyan-400">Watermark: {decryptionResult.event.watermarkId}</span>
              </div>
              <div className="p-3 bg-[#070b12] border border-slate-800 rounded text-slate-300 max-h-48 overflow-y-auto font-mono text-[11px] leading-relaxed select-all">
                {decryptionResult.watermarkedText}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  closeDecryptModal();
                  openWatermarkInspector(decryptionResult.event);
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded text-xs flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Inspect Invisible Watermark Bits</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    closeDecryptModal();
                    setActiveView('events');
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
                >
                  View Event Log
                </button>
                <button
                  onClick={closeDecryptModal}
                  className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded text-xs"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
