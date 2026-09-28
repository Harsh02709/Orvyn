import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  FileText,
  Shield,
  KeyRound,
  Lock,
  Cpu,
  Boxes,
  Users,
  CheckCircle2
} from 'lucide-react';
import { truncateHash } from '../../utils/crypto';

export const DocumentDetailModal: React.FC = () => {
  const {
    documentDetailModal,
    closeDocumentDetail,
    recipients,
    events,
    openDecryptModal
  } = useApp();

  if (!documentDetailModal.isOpen || !documentDetailModal.document) return null;

  const doc = documentDetailModal.document;
  const authorizedRecipients = recipients.filter((r) =>
    doc.authorizedRecipientIds.includes(r.id)
  );
  const docEvents = events.filter((e) => e.docId === doc.docId);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-[#090e1a] border border-slate-700 rounded-lg max-w-3xl w-full p-4 sm:p-6 space-y-4 sm:space-y-5 font-mono text-xs shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-[200px] sm:max-w-none">{doc.title}</h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold shrink-0">
                  {doc.classification}
                </span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
                ID: {doc.docId} · Owner: {doc.owner} ({doc.ownerDepartment})
              </div>
            </div>
          </div>
          <button
            onClick={closeDocumentDetail}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hashes & Cryptographic Parameters */}
        <div className="p-4 bg-[#0d1424] border border-slate-800 rounded space-y-2">
          <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            Document Cryptographic Fingerprint
          </div>
          <div className="space-y-1 text-slate-300">
            <div>
              <span className="text-slate-500 text-[10px]">ORIGINAL DOCUMENT SHA-256:</span>
              <div className="text-[11px] bg-slate-900 p-2 rounded break-all select-all font-semibold text-cyan-300 mt-0.5">
                {doc.sha256Hash}
              </div>
            </div>
            <div>
              <span className="text-slate-500 text-[10px]">BROADCAST CIPHERTEXT PACKAGE HASH (ML-KEM):</span>
              <div className="text-[11px] bg-slate-900 p-2 rounded break-all select-all text-slate-400 mt-0.5">
                {doc.broadcastPackageHash}
              </div>
            </div>
          </div>
        </div>

        {/* Document Plaintext Body */}
        <div>
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold">Classified Text Content</span>
            <span className="text-[10px]">Encrypted Enclave Buffer</span>
          </div>
          <div className="p-4 bg-[#070b12] border border-slate-800 rounded text-slate-200 max-h-52 overflow-y-auto leading-relaxed select-all">
            <pre className="whitespace-pre-wrap font-mono text-[11px]">{doc.fullText}</pre>
          </div>
        </div>

        {/* Authorized Recipients List */}
        <div>
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Authorized Recipients ({authorizedRecipients.length})</span>
            <span className="text-[10px] text-slate-500 font-normal">Registered PQC Public Keys</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {authorizedRecipients.map((rec) => (
              <div
                key={rec.id}
                className="p-2.5 bg-[#0d1424] border border-slate-800 rounded flex items-center justify-between"
              >
                <div>
                  <div className="text-white font-bold">{rec.name}</div>
                  <div className="text-[10px] text-slate-400">{rec.code} · {rec.type}</div>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">PQC OK</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Decryption Events */}
        {docEvents.length > 0 && (
          <div>
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Recent Sovereign Decryption Sessions ({docEvents.length})
            </div>
            <div className="space-y-1.5">
              {docEvents.slice(0, 3).map((evt) => (
                <div
                  key={evt.id}
                  className="p-2 bg-slate-900/80 border border-slate-800 rounded flex items-center justify-between text-[11px]"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">{evt.eventId}</span>
                    <span className="text-slate-400">by {evt.recipientName} ({evt.recipientCode})</span>
                  </div>
                  <span className="text-emerald-400 font-bold">{evt.watermarkId}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            onClick={() => {
              closeDocumentDetail();
              openDecryptModal(doc.id);
            }}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded flex items-center gap-1.5 transition-colors"
          >
            <KeyRound className="w-4 h-4" />
            <span>Decrypt As Recipient</span>
          </button>

          <button
            onClick={closeDocumentDetail}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
