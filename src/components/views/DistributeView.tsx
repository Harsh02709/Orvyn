import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { RecipientType, ClassificationLevel } from '../../types';
import {
  Send,
  FileText,
  Shield,
  Cpu,
  CheckCircle2,
  Users,
  Server,
  Monitor,
  User,
  ArrowRight,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';
import { calculateSha256, truncateHash } from '../../utils/crypto';

export const DistributeView: React.FC = () => {
  const { recipients, distributeDocument, setActiveView, openDecryptModal } = useApp();

  const [title, setTitle] = useState('classified_operation_delta.pdf');
  const [classification, setClassification] = useState<ClassificationLevel>('TOP SECRET');
  const [description, setDescription] = useState(
    'Tactical Fleet Air Arm surveillance corridor allocation and frequency hopping instructions.'
  );
  const [fullText, setFullText] = useState(`SECURITY OPERATIONS COMMAND
CLASSIFICATION: TOP SECRET // NOFORN // AIR-GAPPED DISTRIBUTION ONLY

1. OPERATIONAL MANDATE
All operational tactical nodes are hereby directed to maintain strict EMCON Delta along operational corridor Alpha-7 through Bravo-9.

2. CRYPTOGRAPHIC PROVENANCE
Encrypted under sovereign ML-KEM-1024 parameters. Any offline copy extracted or captured retains unique session-level forensic watermarking.`);

  const [selectedRecipientIds, setSelectedRecipientIds] = useState<string[]>([
    'rec-001',
    'rec-002',
    'rec-004',
    'rec-006'
  ]);

  const [activeTabFilter, setActiveTabFilter] = useState<'ALL' | RecipientType>('ALL');
  const [calculatedSha256, setCalculatedSha256] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [distributionSuccess, setDistributionSuccess] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;
    calculateSha256(fullText).then((hash) => {
      if (isCurrent) setCalculatedSha256(hash);
    });
    return () => {
      isCurrent = false;
    };
  }, [fullText]);

  const toggleRecipient = (id: string) => {
    setSelectedRecipientIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleDistribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRecipientIds.length === 0) {
      alert('Please select at least one authorized recipient.');
      return;
    }

    setIsProcessing(true);
    try {
      const doc = await distributeDocument({
        title,
        classification,
        fileSize: `${(fullText.length / 1024 + 1.2).toFixed(1)} MB`,
        description,
        fullText,
        recipientIds: selectedRecipientIds
      });

      setDistributionSuccess(doc.docId);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredRecipients = recipients.filter(
    (r) => activeTabFilter === 'ALL' || r.type === activeTabFilter
  );

  const getRecipientIcon = (type: RecipientType) => {
    switch (type) {
      case 'INDIVIDUAL':
        return <User className="w-3.5 h-3.5 text-cyan-400" />;
      case 'GROUP':
        return <Users className="w-3.5 h-3.5 text-indigo-400" />;
      case 'SERVER':
        return <Server className="w-3.5 h-3.5 text-emerald-400" />;
      case 'SECURE_TERMINAL':
        return <Monitor className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
            Distribution Module
          </span>
          <span className="text-slate-600">/</span>
          <span className="text-xs font-mono text-slate-400">Broadcast Encrypt Once</span>
        </div>
        <h1 className="text-xl font-bold font-mono text-white">
          Broadcast Encrypted Document Distribution
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          Step 1 through 4: Calculate original hash, configure multi-recipient authorization, and broadcast-encapsulate with ML-KEM-1024.
        </p>
      </div>

      {distributionSuccess ? (
        <div className="p-6 bg-[#0a1424] border border-cyan-700/60 rounded-lg space-y-4">
          <div className="flex items-center gap-3 text-emerald-400">
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <div>
              <h2 className="text-base font-bold font-mono text-white">
                Document Successfully Encrypted & Broadcasted
              </h2>
              <p className="text-xs text-slate-300 font-mono">
                Assigned Identifier: <span className="text-cyan-300">{distributionSuccess}</span> · ML-KEM Protected
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded font-mono text-xs space-y-2 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">Document Title:</span>
              <span className="text-white font-bold">{title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Document SHA-256:</span>
              <span className="text-cyan-300 select-all">{calculatedSha256}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Authorized Endpoints:</span>
              <span className="text-white">{selectedRecipientIds.length} Recipients (Individual & Groups)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Broadcast Key Capsule:</span>
              <span className="text-slate-400">ML-KEM-1024 (NIST FIPS 203) Broadcast Container Ready</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2">
            <button
              onClick={() => openDecryptModal(distributionSuccess)}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs font-mono rounded flex items-center justify-center gap-1.5 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Simulate Decryption Now</span>
            </button>
            <button
              onClick={() => setActiveView('documents')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded transition-colors flex items-center justify-center"
            >
              <span>View in Document Vault</span>
            </button>
            <button
              onClick={() => setDistributionSuccess(null)}
              className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors text-center"
            >
              Distribute Another
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleDistribute} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Document Details & Text */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-5 bg-[#090e1a] border border-slate-800 rounded-lg space-y-4">
              <h2 className="text-sm font-bold font-mono text-slate-200 flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                Step 1 & 2: Classified Payload & Hash Calculation
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Document Filename
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#0d1424] border border-slate-700 rounded text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Security Classification
                  </label>
                  <select
                    value={classification}
                    onChange={(e) => setClassification(e.target.value as ClassificationLevel)}
                    className="w-full px-3 py-1.5 bg-[#0d1424] border border-slate-700 rounded text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="TOP SECRET">TOP SECRET</option>
                    <option value="SECRET">SECRET</option>
                    <option value="CONFIDENTIAL">CONFIDENTIAL</option>
                    <option value="RESTRICTED">RESTRICTED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Brief Operational Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#0d1424] border border-slate-700 rounded text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-mono text-slate-400">
                    Document Text Payload (Encrypted Body)
                  </label>
                  <span className="text-[11px] font-mono text-slate-500">
                    {fullText.length} characters
                  </span>
                </div>
                <textarea
                  rows={8}
                  required
                  value={fullText}
                  onChange={(e) => setFullText(e.target.value)}
                  className="w-full p-3 bg-[#0d1424] border border-slate-700 rounded text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed font-mono"
                />
              </div>

              {/* Real-time Document Hash Calculation */}
              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded font-mono text-xs">
                <div className="text-[10px] uppercase text-cyan-400 font-bold mb-1">
                  Calculated Document Hash (Web Crypto API)
                </div>
                <div className="text-slate-300 break-all select-all font-semibold">
                  SHA-256: {calculatedSha256 || 'Calculating...'}
                </div>
                <div className="text-slate-500 text-[10px] mt-1">
                  Every authorized recipient receives an exact byte-match of this hash upon decryption.
                </div>
              </div>
            </div>
          </div>

          {/* Right 1 Col: Recipient Selection & Cryptographic Status */}
          <div className="space-y-4">
            <div className="p-5 bg-[#090e1a] border border-slate-800 rounded-lg space-y-4">
              <div>
                <h2 className="text-sm font-bold font-mono text-slate-200 flex items-center justify-between">
                  <span>Step 3: Authorized Recipients</span>
                  <span className="text-xs text-cyan-400 font-normal">
                    {selectedRecipientIds.length} Selected
                  </span>
                </h2>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Supports Individuals, Groups, Distribution Servers & Terminals
                </p>
              </div>

              {/* Recipient Category Filter Tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded text-[11px] font-mono">
                {(['ALL', 'INDIVIDUAL', 'GROUP', 'SERVER'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTabFilter(tab)}
                    className={`flex-1 py-1 rounded transition-colors text-center ${
                      activeTabFilter === tab
                        ? 'bg-slate-800 text-cyan-300 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab === 'INDIVIDUAL' ? 'Indiv' : tab}
                  </button>
                ))}
              </div>

              {/* Recipients Checklist */}
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {filteredRecipients.map((rec) => {
                  const isSelected = selectedRecipientIds.includes(rec.id);
                  return (
                    <div
                      key={rec.id}
                      onClick={() => toggleRecipient(rec.id)}
                      className={`p-2.5 rounded border cursor-pointer transition-colors flex items-start gap-2.5 ${
                        isSelected
                          ? 'bg-cyan-950/30 border-cyan-800/80 text-white'
                          : 'bg-[#0d1424] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="mt-1 h-3.5 w-3.5 accent-cyan-500 rounded border-slate-700"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          {getRecipientIcon(rec.type)}
                          <span className="text-xs font-mono font-bold truncate">
                            {rec.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-0.5">
                          <span>{rec.code}</span>
                          <span>·</span>
                          <span className="truncate">{rec.role}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Cryptographic Status Panel */}
              <div className="p-3 bg-[#0a1322] border border-cyan-900/60 rounded space-y-1.5 font-mono text-xs">
                <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                  Post-Quantum Security Parameters
                </div>
                <div className="flex justify-between text-slate-300 text-[11px]">
                  <span>Key Encapsulation:</span>
                  <span className="text-white font-bold">ML-KEM-1024</span>
                </div>
                <div className="flex justify-between text-slate-300 text-[11px]">
                  <span>Decryption Signing:</span>
                  <span className="text-white font-bold">ML-DSA-87</span>
                </div>
                <div className="flex justify-between text-slate-300 text-[11px]">
                  <span>Air-Gapped Status:</span>
                  <span className="text-emerald-400 font-bold">VERIFIED LOCAL</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-slate-950 font-bold font-mono text-xs rounded flex items-center justify-center gap-2 transition-colors shadow-lg shadow-cyan-950/40"
              >
                {isProcessing ? (
                  <span>Generating ML-KEM Encapsulation...</span>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Broadcast Encrypt (ML-KEM)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
