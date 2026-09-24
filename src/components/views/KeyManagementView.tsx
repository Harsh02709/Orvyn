import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Key,
  ShieldCheck,
  Lock,
  Cpu,
  CheckCircle2,
  RefreshCw,
  Search,
  AlertCircle
} from 'lucide-react';
import { truncateHash } from '../../utils/crypto';

export const KeyManagementView: React.FC = () => {
  const { keys } = useApp();
  const [search, setSearch] = useState('');
  const [rotatedKeyId, setRotatedKeyId] = useState<string | null>(null);

  const filteredKeys = keys.filter(
    (k) =>
      k.recipientName.toLowerCase().includes(search.toLowerCase()) ||
      k.recipientCode.toLowerCase().includes(search.toLowerCase()) ||
      k.dsaFingerprint.toLowerCase().includes(search.toLowerCase())
  );

  const handleSimulateRotation = (keyId: string) => {
    setRotatedKeyId(keyId);
    setTimeout(() => {
      setRotatedKeyId(null);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
            Hardware Security Enclave
          </span>
          <span className="text-slate-600">/</span>
          <span className="text-xs font-mono text-slate-400">Local Air-Gapped Key Store</span>
        </div>
        <h1 className="text-xl font-bold font-mono text-white">
          Post-Quantum Key Management
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          NIST FIPS 203 (ML-KEM-1024) Key Encapsulation & NIST FIPS 204 (ML-DSA-87) Digital Signatures. Private keys are never exported.
        </p>
      </div>

      {/* Security Architecture Callout */}
      <div className="p-4 bg-[#0a1220] border border-cyan-800/40 rounded-lg flex items-start gap-3">
        <Lock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs font-mono">
          <span className="font-bold text-cyan-200">
            LOCAL SECURE KEY STORE · AIR-GAPPED HSM:
          </span>{' '}
          <span className="text-slate-300">
            All private signing keys are generated inside isolated physical Hardware Security Modules. By cryptographic policy, <strong>private keys are never displayed in plaintext or transmitted across the wire</strong>. Only public verification material and key fingerprints are registered.
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by recipient name, code (SEC-OPS-0471), or fingerprint..."
          className="w-full pl-9 pr-3 py-1.5 bg-[#090e1a] border border-slate-800 rounded text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Key Records Grid */}
      <div className="space-y-4">
        {filteredKeys.map((key) => {
          const isRotating = rotatedKeyId === key.id;

          return (
            <div
              key={key.id}
              className="p-5 bg-[#090e1a] border border-slate-800 hover:border-slate-700 rounded-lg space-y-4 font-mono text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-base text-white">
                      {key.recipientName}
                    </span>
                    <span className="text-cyan-400 font-bold">({key.recipientCode})</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {key.recipientType}
                    </span>
                  </div>
                  <div className="text-slate-400 text-xs mt-0.5">
                    Version: {key.keyVersion} · Created: {key.createdAt} · Last Used: {key.lastUsed}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{key.status}</span>
                  </span>

                  <button
                    onClick={() => handleSimulateRotation(key.id)}
                    disabled={isRotating}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded text-[11px] flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className={`w-3 h-3 ${isRotating ? 'animate-spin' : ''}`} />
                    <span>{isRotating ? 'Rotating HSM Session...' : 'Rotate Key Capsule'}</span>
                  </button>
                </div>
              </div>

              {/* Cryptographic Key Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-[#0d1424] border border-slate-800 rounded space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-400 font-bold">KEY ESTABLISHMENT: ML-KEM-1024</span>
                    <span className="text-[10px] text-slate-400">NIST FIPS 203</span>
                  </div>
                  <div className="text-slate-500 text-[10px]">PUBLIC ENCAPSULATION KEY:</div>
                  <div className="text-slate-300 break-all select-all text-[11px] bg-slate-900 p-2 rounded">
                    {key.kemPublicKey}
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                    <span>Private Key Status:</span>
                    <span className="text-emerald-400 font-bold">ISOLATED IN AIR-GAPPED HSM</span>
                  </div>
                </div>

                <div className="p-3 bg-[#0d1424] border border-slate-800 rounded space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-400 font-bold">DIGITAL SIGNATURE: ML-DSA-87</span>
                    <span className="text-[10px] text-slate-400">NIST FIPS 204</span>
                  </div>
                  <div className="text-slate-500 text-[10px]">PUBLIC VERIFICATION KEY:</div>
                  <div className="text-slate-300 break-all select-all text-[11px] bg-slate-900 p-2 rounded">
                    {key.dsaPublicKey}
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                    <span>Key Fingerprint:</span>
                    <span className="text-cyan-300 font-bold">{key.dsaFingerprint}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
