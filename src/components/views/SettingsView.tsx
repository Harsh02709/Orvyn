import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings as SettingsIcon,
  Shield,
  Cpu,
  Lock,
  Layers,
  Save,
  CheckCircle2,
  Server
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [saved, setSaved] = useState(false);
  const [kemAlgo, setKemAlgo] = useState('ML-KEM-1024 (NIST FIPS 203)');
  const [dsaAlgo, setDsaAlgo] = useState('ML-DSA-87 (NIST FIPS 204)');
  const [watermarkDensity, setWatermarkDensity] = useState('HIGH_REDUNDANCY');
  const [networkSubnet, setNetworkSubnet] = useState('10.14.0.0/16');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl font-mono text-xs">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs uppercase tracking-wider text-cyan-400">
            System Configuration
          </span>
          <span className="text-slate-600">/</span>
          <span className="text-xs text-slate-400">Air-Gapped Node Parameters</span>
        </div>
        <h1 className="text-xl font-bold text-white">
          Enclave & Cryptographic Settings
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Local node configuration, post-quantum algorithm parameters, and invisible watermark engine thresholds.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Air-Gapped Network Configuration */}
        <div className="p-5 bg-[#090e1a] border border-slate-800 rounded-lg space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Air-Gapped Network Topology</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-slate-400 mb-1">Designated Isolated Subnet</label>
              <input
                type="text"
                value={networkSubnet}
                onChange={(e) => setNetworkSubnet(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#0d1424] border border-slate-700 rounded text-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">External WAN Gateway Status</label>
              <input
                type="text"
                disabled
                value="DISABLED (AIR-GAP ENFORCED)"
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-rose-400 font-bold"
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-500">
            The platform kernel blocks all public routable egress. Only authorized local validator sentries on 10.14.0.0/16 are peered.
          </p>
        </div>

        {/* Post-Quantum Cryptographic Suite */}
        <div className="p-5 bg-[#090e1a] border border-slate-800 rounded-lg space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Post-Quantum Cryptographic Suite (NIST PQC)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-slate-400 mb-1">Key Encapsulation Mechanism (KEM)</label>
              <select
                value={kemAlgo}
                onChange={(e) => setKemAlgo(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#0d1424] border border-slate-700 rounded text-slate-200"
              >
                <option value="ML-KEM-1024 (NIST FIPS 203)">ML-KEM-1024 (NIST FIPS 203 - Max Security)</option>
                <option value="ML-KEM-768 (NIST FIPS 203)">ML-KEM-768 (NIST FIPS 203 - Balanced)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Digital Signature Algorithm (DSA)</label>
              <select
                value={dsaAlgo}
                onChange={(e) => setDsaAlgo(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#0d1424] border border-slate-700 rounded text-slate-200"
              >
                <option value="ML-DSA-87 (NIST FIPS 204)">ML-DSA-87 (NIST FIPS 204 - Category 5)</option>
                <option value="ML-DSA-65 (NIST FIPS 204)">ML-DSA-65 (NIST FIPS 204 - Category 3)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Forensic Watermark Engine */}
        <div className="p-5 bg-[#090e1a] border border-slate-800 rounded-lg space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Invisible Watermarking Engine</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-slate-400 mb-1">Steganography Carrier Scheme</label>
              <input
                type="text"
                disabled
                value="Zero-Width Unicode + LSB Spatial Matrices"
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-300"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Redundancy / Survivability Rate</label>
              <select
                value={watermarkDensity}
                onChange={(e) => setWatermarkDensity(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#0d1424] border border-slate-700 rounded text-slate-200"
              >
                <option value="HIGH_REDUNDANCY">High Redundancy (Resistant to partial crops & OCR)</option>
                <option value="ULTRA_SUBTLE">Ultra Subtle (Zero font metric deviation)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {saved && (
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-4 h-4" /> Parameters Updated
            </span>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Enclave Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
