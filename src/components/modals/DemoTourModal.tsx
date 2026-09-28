import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Lock,
  KeySquare,
  Boxes,
  Cpu,
  Fingerprint,
  SearchCode,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { truncateHash } from '../../utils/crypto';

interface DemoStep {
  number: number;
  title: string;
  badge: string;
  description: string;
  codeSnippet?: string;
  statusText: string;
}

export const DemoTourModal: React.FC = () => {
  const {
    demoTourOpen,
    setDemoTourOpen,
    activeDemoStep,
    setActiveDemoStep,
    setActiveView
  } = useApp();

  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const demoSteps: DemoStep[] = [
    {
      number: 1,
      title: 'Sender Uploads Sensitive Document',
      badge: 'UPLOAD',
      description: 'Document "classified_operation.pdf" (TOP SECRET) is prepared inside the air-gapped cryptographic enclave.',
      codeSnippet: 'Document: classified_operation.pdf (DOC-00472)\nClassification: TOP SECRET // NOFORN\nOwner: Cryptographic Security Operations',
      statusText: 'Document Loaded & Staged'
    },
    {
      number: 2,
      title: 'Calculate Cryptographic Document Hash',
      badge: 'HASHING',
      description: 'System calculates canonical SHA3-256 and SHA-256 hashes of the plaintext before encryption.',
      codeSnippet: 'SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\nSHA3-256: 8b7fa918c4e091b8273f4c10a8291847192837465019283746501928374691ac',
      statusText: 'Canonical Hash Computed'
    },
    {
      number: 3,
      title: 'Sender Selects Multi-Recipient List',
      badge: 'AUTHORIZATION',
      description: 'Sender selects 4 authorized endpoints: Officer A, Officer B, Group INTELLIGENCE-OPS, and Secure Server NIA-SRV-07.',
      codeSnippet: 'Authorized Endpoints:\n- Officer A (V. Rao) [SEC-OPS-0471]\n- Officer B (P. Sharma) [SEC-OPS-0892]\n- Strategic Analysis Group [INTELLIGENCE-OPS]\n- Secure Distribution Server [NIA-SRV-07]',
      statusText: '4 Cryptographic Identities Bound'
    },
    {
      number: 4,
      title: 'System Encrypts Once for Broadcast Distribution',
      badge: 'PQC ENCRYPTION',
      description: 'The file is encrypted once using NIST FIPS 203 (ML-KEM-1024) broadcast encapsulation.',
      codeSnippet: 'Cipher Suite: ML-KEM-1024 + AES-256-GCM\nBroadcast Package Hash: 7f91823acb4019283746e1928374650192837465019283746501928374619472',
      statusText: 'Broadcast Ciphertext Packaged'
    },
    {
      number: 5,
      title: 'Authorized Recipient Requests Decryption',
      badge: 'UNSEAL REQUEST',
      description: 'Officer A (SEC-OPS-0471) requests decryption on terminal OPS-CONSOLE-SEC-01 inside air-gapped subnet 10.14.8.22.',
      codeSnippet: 'Target: classified_operation.pdf\nRequesting Identity: SEC-OPS-0471 (Officer A)\nEnclave Terminal: OPS-CONSOLE-SEC-01',
      statusText: 'Decryption Authorized'
    },
    {
      number: 6,
      title: 'Cryptographic Authorization & Sovereign Decryption',
      badge: 'DECAPSULATION',
      description: 'Officer A decapsulates the ML-KEM-1024 key capsule using their sovereign private key inside the local HSM.',
      codeSnippet: 'Key Decapsulation: ML-KEM-1024 NIST FIPS 203\nHSM Enclave Status: AUTHORIZED\nPlaintext Integrity: Byte-Matched Hash',
      statusText: 'Plaintext Successfully Unsealed'
    },
    {
      number: 7,
      title: 'Unique Session Forensic Watermark Generated',
      badge: 'WATERMARK ENGINE',
      description: 'A unique invisible forensic watermark WM-A82F-194C is generated, bound to Officer A, session DEC-2026-000184, and timestamp.',
      codeSnippet: 'Watermark ID: WM-A82F-194C-91E4\nSession ID: DEC-2026-000184\nRecipient Code: SEC-OPS-0471\nTimestamp: 24 Sep 2026 — 14:32:18 UTC',
      statusText: 'Session Fingerprint Synthesized'
    },
    {
      number: 8,
      title: 'Invisible Watermark Embedded into Plaintext',
      badge: 'STEGANOGRAPHY',
      description: 'The watermark is invisibly injected using zero-width Unicode steganography. Zero visual difference from the original document.',
      codeSnippet: 'Visual Deviation: 0.00% (Identical Output)\nCarrier: Zero-Width Unicode Spectrum (\u200B, \u200C, \uFEFF)\nVisibility to Naked Eye: 100% Invisible',
      statusText: 'Fingerprint Invisibly Embedded'
    },
    {
      number: 9,
      title: 'Recipient Signs Decryption Record (ML-DSA)',
      badge: 'PQC DIGITAL SIGNATURE',
      description: 'Officer A generates an immutable post-quantum digital signature over the decryption record using their private ML-DSA-87 key.',
      codeSnippet: 'Algorithm: ML-DSA-87 (NIST FIPS 204)\nSignature: 0xMLDSA87_e942f1a08c0471d7b319a4e82c5f1107d3b9e4a81c002938...e3b0c442_SIG\nKey Fingerprint: FP-DSA-0471-VRAO',
      statusText: 'Cryptographic Signature Verified'
    },
    {
      number: 10,
      title: 'Signed Provenance Record Committed to Offline Ledger',
      badge: 'DLT CONSENSUS',
      description: 'The signed event is anchored into Block #184 of the private, permissioned, air-gapped blockchain ledger.',
      codeSnippet: 'Committed Block: BLOCK #184\nPrevious Block Hash: 0x81b74c0192847d8a2910384f9c10293847a982b1c0984712093849f018274a91\nCurrent Block Hash: 0xa83f910293847d8a2910384f9c10293847a982b1c0984712093849f0182772c1\nConsensus: Reached across air-gapped validator sentries',
      statusText: 'Block #184 Permanently Chained'
    },
    {
      number: 11,
      title: 'Recipient Receives Visually Identical Document',
      badge: 'ZERO DIFFERENCE',
      description: 'Officer A views the document with normal readability. No large watermark stamps or distractions.',
      codeSnippet: 'Plaintext rendered cleanly.\nEvery other recipient (Officer B, Strategic Analysis Group) sees an identical layout,\nbut with their own distinct session fingerprint.',
      statusText: 'Document Operational'
    },
    {
      number: 12,
      title: 'Security Incident: Document Leaked to Investigator',
      badge: 'INCIDENT SIMULATION',
      description: 'A leaked copy of "classified_operation.pdf" is recovered by Security Operations. Investigator uploads it to Forensic Lab.',
      codeSnippet: 'Suspect File: classified_operation_leaked.pdf\nInvestigator Unit: Digital Forensics & Incident Response Lab\nForensic Action: Extract invisible steganographic payload',
      statusText: 'Suspect Document Ingested'
    },
    {
      number: 13,
      title: 'System Extracts Forensic Watermark & Searches Ledger',
      badge: 'FORENSIC EXTRACTION',
      description: 'The forensic extraction engine recovers watermark WM-A82F-194C and queries the offline permissioned ledger.',
      codeSnippet: 'Extracted Watermark: WM-A82F-194C-91E4\nCalculated Hash: SHA-256 e3b0c442...\nLedger Query Result: 1 Exact Match Found in Block #184\nAttributed Session: DEC-2026-000184',
      statusText: 'Block #184 Match Found'
    },
    {
      number: 14,
      title: 'Cryptographic Attribution Verified & Report Issued',
      badge: 'VERIFIED ATTRIBUTION',
      description: 'The system verifies the recipient ML-DSA signature, document hash, and block hash chain. Official attribution report generated.',
      codeSnippet: 'ATTRIBUTION STATUS: CRYPTOGRAPHICALLY VERIFIED\nRecipient: Officer A (V. Rao) [SEC-OPS-0471]\nSession: DEC-2026-000184\nSignature Proof: ML-DSA-87 VERIFIED ✓\nLedger Proof: BLOCK #184 VERIFIED ✓\nVerdict: Attribution mathematically indisputable beyond mutable logs.',
      statusText: 'Workflow Verification Complete: VERIFIED'
    }
  ];

  const currentStep = demoSteps[activeDemoStep - 1] || demoSteps[0];

  // Auto-play timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && demoTourOpen) {
      timer = setTimeout(() => {
        if (activeDemoStep < demoSteps.length) {
          setActiveDemoStep(activeDemoStep + 1);
        } else {
          setIsPlaying(false);
        }
      }, 3500);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, activeDemoStep, demoTourOpen]);

  if (!demoTourOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-[#090e1a] border border-cyan-500/50 rounded-lg max-w-3xl w-full p-4 sm:p-6 space-y-4 sm:space-y-5 font-mono text-xs shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-cyan-950 border border-cyan-500 flex items-center justify-center font-bold text-cyan-400 text-xs">
              ORV
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                Cryptographic Provenance Walkthrough
              </h2>
              <div className="text-[10px] sm:text-[11px] text-slate-400">
                Orvyn · 14-Step End-to-End Flow
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setIsPlaying(false);
              setDemoTourOpen(false);
            }}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-cyan-400 font-bold">
              STEP {currentStep.number} OF {demoSteps.length}: {currentStep.badge}
            </span>
            <span className="text-slate-400 font-semibold">{currentStep.statusText}</span>
          </div>

          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800 flex">
            {demoSteps.map((s) => (
              <div
                key={s.number}
                onClick={() => setActiveDemoStep(s.number)}
                className={`flex-1 h-full cursor-pointer transition-colors border-r border-slate-900 ${
                  s.number < activeDemoStep
                    ? 'bg-cyan-600'
                    : s.number === activeDemoStep
                    ? 'bg-cyan-400 animate-pulse'
                    : 'bg-slate-800'
                }`}
                title={`Step ${s.number}: ${s.title}`}
              />
            ))}
          </div>
        </div>

        {/* Active Step Hero Card */}
        <div className="p-5 bg-[#0d1424] border border-cyan-800/60 rounded-lg space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider">
                Operation Sequence #{currentStep.number}
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                {currentStep.title}
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/60 text-[11px] font-bold">
              {currentStep.badge}
            </span>
          </div>

          <p className="text-slate-200 text-xs leading-relaxed font-sans">
            {currentStep.description}
          </p>

          {currentStep.codeSnippet && (
            <div className="p-3 bg-[#060a12] border border-slate-800 rounded font-mono text-[11px] text-cyan-300 whitespace-pre-wrap select-all leading-relaxed">
              {currentStep.codeSnippet}
            </div>
          )}
        </div>

        {/* Quick Jump Buttons for Evaluators */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px]">
          <span className="text-slate-500 mr-1">Quick Keypoints:</span>
          <button
            onClick={() => setActiveDemoStep(1)}
            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
          >
            1. Upload
          </button>
          <button
            onClick={() => setActiveDemoStep(4)}
            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
          >
            4. Broadcast Encrypt
          </button>
          <button
            onClick={() => setActiveDemoStep(7)}
            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
          >
            7. Invisible Watermark
          </button>
          <button
            onClick={() => setActiveDemoStep(10)}
            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
          >
            10. DLT Block #184
          </button>
          <button
            onClick={() => setActiveDemoStep(12)}
            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
          >
            12. Simulate Leak
          </button>
          <button
            onClick={() => setActiveDemoStep(14)}
            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-cyan-300 font-bold"
          >
            14. Verified Attribution
          </button>
        </div>

        {/* Footer Navigation Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-3 py-1.5 rounded text-xs flex items-center gap-1.5 transition-colors font-bold ${
                isPlaying
                  ? 'bg-amber-600 hover:bg-amber-500 text-slate-950'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause Auto-Play</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Auto-Play Demo</span>
                </>
              )}
            </button>

            <button
              onClick={() => setActiveDemoStep(1)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded text-xs"
              title="Restart from Step 1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeDemoStep > 1 && (
              <button
                onClick={() => setActiveDemoStep(activeDemoStep - 1)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
              >
                Previous Step
              </button>
            )}

            {activeDemoStep < demoSteps.length ? (
              <button
                onClick={() => setActiveDemoStep(activeDemoStep + 1)}
                className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setDemoTourOpen(false);
                  setActiveView('forensics');
                }}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded text-xs flex items-center gap-1.5 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Go to Forensic Investigation Lab</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
