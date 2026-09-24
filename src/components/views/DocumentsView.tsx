import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClassifiedDocument } from '../../types';
import {
  FileText,
  Search,
  Lock,
  Eye,
  ShieldCheck,
  Send,
  CheckCircle2,
  KeyRound,
  Filter
} from 'lucide-react';
import { truncateHash } from '../../utils/crypto';

export const DocumentsView: React.FC = () => {
  const {
    documents,
    openDecryptModal,
    openDocumentDetail,
    setActiveView
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassification, setSelectedClassification] = useState<string>('ALL');

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.docId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass =
      selectedClassification === 'ALL' || doc.classification === selectedClassification;
    return matchesSearch && matchesClass;
  });

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'TOP SECRET':
        return 'text-rose-400 border-rose-900/60 bg-rose-950/40';
      case 'SECRET':
        return 'text-amber-400 border-amber-900/60 bg-amber-950/40';
      case 'CONFIDENTIAL':
        return 'text-blue-400 border-blue-900/60 bg-blue-950/40';
      default:
        return 'text-slate-400 border-slate-800 bg-slate-900';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
              Cryptographic Enclave
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-mono text-slate-400">Secure Storage</span>
          </div>
          <h1 className="text-xl font-bold font-mono text-white">
            Classified Document Vault
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Broadcast-encrypted packages stored with post-quantum ML-KEM encapsulation parameters
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('distribute')}
            className="flex items-center gap-2 px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs font-mono rounded transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Encrypt & Distribute New</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 bg-[#090e1a] border border-slate-800 rounded-lg flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, document ID, custodian..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#0d1424] border border-slate-700/80 rounded text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Classification Segmented Filter */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded overflow-x-auto shrink-0">
          {['ALL', 'TOP SECRET', 'SECRET', 'CONFIDENTIAL'].map((level) => (
            <button
              key={level}
              onClick={() => setSelectedClassification(level)}
              className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors whitespace-nowrap ${
                selectedClassification === level
                  ? 'bg-slate-800 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Document Grid */}
      <div className="space-y-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-4 sm:p-5 bg-[#090e1a] border border-slate-800 hover:border-slate-700/80 rounded-lg transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-2 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${getClassificationColor(
                      doc.classification
                    )}`}
                  >
                    {doc.classification}
                  </span>
                  <span className="text-xs font-mono text-cyan-400 font-bold">
                    {doc.docId}
                  </span>
                  <span className="text-slate-600 hidden sm:inline">·</span>
                  <span className="text-xs text-slate-400 font-mono">
                    Owner: {doc.owner} ({doc.ownerDepartment})
                  </span>
                  <span className="text-slate-600 hidden sm:inline">·</span>
                  <span className="text-xs text-slate-500 font-mono">
                    Added: {doc.uploadedAt}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 sm:gap-3">
                  <FileText className="w-5 h-5 text-cyan-400 shrink-0" />
                  <h3 className="text-sm sm:text-base font-bold font-mono text-white truncate">
                    {doc.title}
                  </h3>
                  <span className="text-[11px] font-mono text-slate-500 shrink-0">
                    ({doc.fileSize})
                  </span>
                </div>

                <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                  {doc.description}
                </p>

                {/* Cryptographic Hashes Line */}
                <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-1 text-xs font-mono pt-1 text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">SHA-256:</span>
                    <span className="text-slate-300 select-all">
                      {truncateHash(doc.sha256Hash, 8, 6)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">Encryption:</span>
                    <span className="text-cyan-300 font-semibold">
                      {doc.encryptionAlgorithm}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">Authorized:</span>
                    <span className="text-slate-300">
                      {doc.authorizedRecipientIds.length} Entities
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">Sessions:</span>
                    <span className="text-emerald-400 font-semibold">
                      {doc.decryptionCount} Events
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">
                      Ledger: {doc.ledgerStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 w-full sm:w-auto lg:w-48">
                <button
                  onClick={() => openDecryptModal(doc.id)}
                  className="w-full px-3 py-2 bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-700/60 rounded text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Decrypt Document</span>
                </button>
                <button
                  onClick={() => openDocumentDetail(doc)}
                  className="w-full px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredDocs.length === 0 && (
          <div className="p-12 text-center bg-[#090e1a] border border-slate-800 rounded-lg">
            <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <div className="text-sm font-bold font-mono text-slate-300">
              No matching documents found
            </div>
            <p className="text-xs text-slate-500 font-mono mt-1">
              Adjust your search keywords or classification filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
