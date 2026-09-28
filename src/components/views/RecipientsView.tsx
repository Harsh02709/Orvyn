import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Recipient, RecipientType } from '../../types';
import {
  Users,
  User,
  Server,
  Monitor,
  Key,
  ShieldCheck,
  Plus,
  Info,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { truncateHash } from '../../utils/crypto';

export const RecipientsView: React.FC = () => {
  const { recipients, addRecipient, openDecryptModal } = useApp();

  const [activeTab, setActiveTab] = useState<RecipientType>('INDIVIDUAL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newDept, setNewDept] = useState('');
  const [newType, setNewType] = useState<RecipientType>('INDIVIDUAL');

  const filteredRecipients = recipients.filter((r) => r.type === activeTab);

  const handleAddRecipient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newName) return;

    const newRec: Recipient = {
      id: `rec-${Date.now()}`,
      code: newCode.toUpperCase(),
      name: newName,
      type: newType,
      department: newDept || 'Naval Operations',
      role: newRole || 'Operational Analyst',
      clearance: 'TOP SECRET',
      mlKemPublicKey: `0xKEM1024_${Math.random().toString(16).slice(2, 10)}${newCode.slice(-4)}8291048b7e33d01`,
      mlDsaPublicKey: `0xDSA87_${Math.random().toString(16).slice(2, 10)}${newCode.slice(-4)}b7401c83d91726a`,
      status: 'AUTHORIZED',
      lastActive: 'Registered just now',
      memberCount: newType === 'GROUP' ? 8 : undefined,
      serverNode: newType === 'SERVER' ? 'RELAY-NODE-LOCAL' : undefined
    };

    addRecipient(newRec);
    setShowAddModal(false);
    setNewCode('');
    setNewName('');
    setNewRole('');
    setNewDept('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
              Identity & Access Management
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-mono text-slate-400">Air-Gapped Registry</span>
          </div>
          <h1 className="text-xl font-bold font-mono text-white">
            Recipient Cryptographic Identities
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Individual officers, analysis groups, secure distribution servers, and SCIF terminals
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs font-mono rounded transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Endpoint</span>
        </button>
      </div>

      {/* Group Attribution Callout Banner */}
      <div className="p-4 bg-[#0a1220] border border-cyan-800/40 rounded-lg flex items-start gap-3">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs font-mono">
          <span className="font-bold text-cyan-200">
            Individual + Group/Server Attribution Model:
          </span>{' '}
          <span className="text-slate-300">
            When a broadcast-encrypted document is shared with a Group (e.g. <code>INTELLIGENCE-OPS</code>) or Server (<code>NIA-SRV-07</code>), individual attribution is <strong>never destroyed</strong>. Every single physical decryption creates a unique session watermark (e.g. Officer-023 vs Officer-041) signed by the local station key.
          </span>
        </div>
      </div>

      {/* 4 Tabs: INDIVIDUALS | GROUPS | SERVERS | SECURE TERMINALS */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('INDIVIDUAL')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-mono rounded transition-colors whitespace-nowrap ${
            activeTab === 'INDIVIDUAL'
              ? 'bg-slate-800 text-cyan-300 font-bold border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>INDIVIDUALS ({recipients.filter((r) => r.type === 'INDIVIDUAL').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('GROUP')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-mono rounded transition-colors whitespace-nowrap ${
            activeTab === 'GROUP'
              ? 'bg-slate-800 text-cyan-300 font-bold border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>GROUPS ({recipients.filter((r) => r.type === 'GROUP').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('SERVER')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-mono rounded transition-colors whitespace-nowrap ${
            activeTab === 'SERVER'
              ? 'bg-slate-800 text-cyan-300 font-bold border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>SERVERS ({recipients.filter((r) => r.type === 'SERVER').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('SECURE_TERMINAL')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-mono rounded transition-colors whitespace-nowrap ${
            activeTab === 'SECURE_TERMINAL'
              ? 'bg-slate-800 text-cyan-300 font-bold border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>SECURE TERMINALS ({recipients.filter((r) => r.type === 'SECURE_TERMINAL').length})</span>
        </button>
      </div>

      {/* Grid of Recipients */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRecipients.map((rec) => (
          <div
            key={rec.id}
            className="p-5 bg-[#090e1a] border border-slate-800 hover:border-slate-700/80 rounded-lg flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-cyan-400">
                  {rec.code}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                  {rec.status}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white font-mono">{rec.name}</h3>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  {rec.role} · {rec.department}
                </div>
              </div>

              {rec.memberCount && (
                <div className="text-xs text-indigo-300 font-mono">
                  Operational Pool: {rec.memberCount} Authorized Active Analysts
                </div>
              )}

              {rec.serverNode && (
                <div className="text-xs text-emerald-300 font-mono">
                  Hardware Node: {rec.serverNode}
                </div>
              )}

              {rec.terminalLocation && (
                <div className="text-xs text-amber-300 font-mono">
                  Physical Installation: {rec.terminalLocation}
                </div>
              )}

              {/* Keys Registered Box */}
              <div className="p-3 bg-[#0d1424] border border-slate-800 rounded font-mono text-[11px] space-y-1.5 text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">ML-KEM Key:</span>
                  <span className="text-cyan-300 font-mono">Registered (FIPS 203)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">ML-DSA Key:</span>
                  <span className="text-emerald-400 font-mono">Registered (FIPS 204)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Public Key:</span>
                  <span className="text-slate-400">{truncateHash(rec.mlDsaPublicKey, 8, 6)}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">
                Active: {rec.lastActive}
              </span>
              <button
                onClick={() => openDecryptModal(undefined, rec.id)}
                className="px-2.5 py-1 text-xs font-mono text-cyan-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors flex items-center gap-1"
              >
                <span>Decrypt As This</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Recipient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-[#090e1a] border border-slate-700 rounded-lg max-w-md w-full p-4 sm:p-5 space-y-4 font-mono max-h-[90vh] overflow-y-auto">
            <h2 className="text-base font-bold text-white">Register Cryptographic Recipient</h2>
            <form onSubmit={handleAddRecipient} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Recipient Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as RecipientType)}
                  className="w-full px-3 py-1.5 bg-[#0d1424] border border-slate-700 rounded text-slate-200"
                >
                  <option value="INDIVIDUAL">Individual Officer</option>
                  <option value="GROUP">Operational Group</option>
                  <option value="SERVER">Secure Distribution Server</option>
                  <option value="SECURE_TERMINAL">Secure Terminal / Workstation</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  Recipient Code (e.g. SEC-OPS-0992 or NIA-SRV-09)
                </label>
                <input
                  type="text"
                  required
                  placeholder="SEC-OPS-0992"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#0d1424] border border-slate-700 rounded text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Full Name or Unit Designation</label>
                <input
                  type="text"
                  required
                  placeholder="Senior Analyst S. Nair"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#0d1424] border border-slate-700 rounded text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Operational Role</label>
                <input
                  type="text"
                  placeholder="Cryptographic Officer"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#0d1424] border border-slate-700 rounded text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Department</label>
                <input
                  type="text"
                  placeholder="Security Operations Command"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#0d1424] border border-slate-700 rounded text-slate-200"
                />
              </div>

              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded text-[11px] text-slate-400">
                PQC Keys (ML-KEM-1024 & ML-DSA-87) will be generated inside the local air-gapped secure keystore.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded"
                >
                  Save & Register Keys
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
