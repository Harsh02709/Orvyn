import {
  ClassifiedDocument,
  Recipient,
  DecryptionEvent,
  LedgerBlock,
  KeyRecord,
  ConsensusNode,
  ForensicReport
} from '../types';

export const INITIAL_RECIPIENTS: Recipient[] = [
  {
    id: 'rec-001',
    code: 'SEC-OPS-0471',
    name: 'Officer A (V. Rao)',
    type: 'INDIVIDUAL',
    department: 'Directorate of Security Operations',
    role: 'Principal Tactical Coordinator',
    clearance: 'TOP SECRET',
    mlKemPublicKey: '0xKEM1024_7a9f821c00471b8e43d9a1f592c3b8417d9e4a2c01928374a',
    mlDsaPublicKey: '0xDSA87_e942f1a08c0471d7b319a4e82c5f1107d3b9e4a81c00293847',
    status: 'AUTHORIZED',
    lastActive: '24 Sep 2026 — 14:32:18 UTC',
  },
  {
    id: 'rec-002',
    code: 'SEC-OPS-0892',
    name: 'Officer B (P. Sharma)',
    type: 'INDIVIDUAL',
    department: 'Cryptographic Systems Directorate',
    role: 'Senior Cryptographic Systems Analyst',
    clearance: 'TOP SECRET',
    mlKemPublicKey: '0xKEM1024_3c81b90200892f7a14e82d094b7c1a938e2d4f1a09817263b',
    mlDsaPublicKey: '0xDSA87_fa0182b74c0892c9e218a3d74f0c91823a7e5b9c0219847291',
    status: 'AUTHORIZED',
    lastActive: '24 Sep 2026 — 13:15:02 UTC',
  },
  {
    id: 'rec-003',
    code: 'SEC-OPS-0114',
    name: 'Director Arjun Dev',
    type: 'INDIVIDUAL',
    department: 'Strategic Threat Assessment Directorate',
    role: 'Chief Intelligence Briefing Officer',
    clearance: 'TOP SECRET',
    mlKemPublicKey: '0xKEM1024_89a71b2c00114e9f3108c4a72d9b1e847c2a0d91827463519',
    mlDsaPublicKey: '0xDSA87_1b7c93e04a0114d8f209b3a74e1d82930c7a4f8b1928374650',
    status: 'AUTHORIZED',
    lastActive: '23 Sep 2026 — 18:40:11 UTC',
  },
  {
    id: 'rec-004',
    code: 'INTELLIGENCE-OPS',
    name: 'Strategic Analysis Group',
    type: 'GROUP',
    department: 'Joint Intelligence Assessment Centre',
    role: 'Operational Assessment & Tactical Group',
    clearance: 'TOP SECRET',
    mlKemPublicKey: '0xKEM1024_GRP_99c81a201948b7e33d01827cfa4910b83e7a1c92019482',
    mlDsaPublicKey: '0xDSA87_GRP_88a10f92b7401c83d91726a4e091b8273f4c10a8291847',
    status: 'AUTHORIZED',
    lastActive: '24 Sep 2026 — 14:30:00 UTC',
    memberCount: 24,
  },
  {
    id: 'rec-005',
    code: 'TACTICAL-COMMAND-WING',
    name: 'Tactical Coordination Desk',
    type: 'GROUP',
    department: 'Operations Command Center',
    role: 'Field Asset Coordination Desk',
    clearance: 'SECRET',
    mlKemPublicKey: '0xKEM1024_GRP_44b7190c821a93e77f019284da3810c92f8a3d10293847',
    mlDsaPublicKey: '0xDSA87_GRP_55c92a10b83f0192e84719a0bc2918374a5d09f7182934',
    status: 'AUTHORIZED',
    lastActive: '24 Sep 2026 — 11:20:45 UTC',
    memberCount: 12,
  },
  {
    id: 'rec-006',
    code: 'NIA-SRV-07',
    name: 'Secure Distribution Server 07',
    type: 'SERVER',
    department: 'Cryptographic Distribution Infrastructure',
    role: 'Air-Gapped Distribution & Caching Relay',
    clearance: 'TOP SECRET',
    mlKemPublicKey: '0xKEM1024_SRV_77f019283a01948b29c817264e9a018273f4b810928374',
    mlDsaPublicKey: '0xDSA87_SRV_66a918273f019284c81029384d7a1029384e5b91827364',
    status: 'AUTHORIZED',
    lastActive: '24 Sep 2026 — 14:35:10 UTC',
    serverNode: 'RACK-04-AIRGAP-ISOLATED',
  },
  {
    id: 'rec-007',
    code: 'SEC-TERM-04',
    name: 'Secure SCIF Terminal 04',
    type: 'SECURE_TERMINAL',
    department: 'High-Assurance Cryptographic Facility',
    role: 'High-Security Physical Inspection Console',
    clearance: 'TOP SECRET',
    mlKemPublicKey: '0xKEM1024_TRM_11e829104b7a19283c0192847d8a2910384f9c10293847',
    mlDsaPublicKey: '0xDSA87_TRM_22f910293c8a019284d71928374e019283745a91827364',
    status: 'AUTHORIZED',
    lastActive: '24 Sep 2026 — 14:10:22 UTC',
    terminalLocation: 'SCIF Vault 3, Level -2',
  },
];

export const INITIAL_DOCUMENTS: ClassifiedDocument[] = [
  {
    id: 'doc-001',
    docId: 'DOC-00472',
    title: 'classified_operation.pdf',
    classification: 'TOP SECRET',
    fileType: 'PDF Document (Cryptographic Enclave)',
    fileSize: '4.8 MB',
    sha3Hash: '8b7fa918c4e091b8273f4c10a8291847192837465019283746501928374691ac',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    owner: 'Cryptographic Security Operations',
    ownerDepartment: 'High-Assurance Infrastructure',
    description: 'Strategic deployment directive for tactical corridor allocation, radar frequencies, and sensor telemetry protocols.',
    fullText: `SECURITY OPERATIONS COMMAND
CLASSIFICATION: TOP SECRET // NOFORN // AIR-GAPPED DISTRIBUTION ONLY

DOCUMENT IDENTIFIER: DOC-00472 / TACTICAL-OPS-DIRECTIVE-2026
SUBJECT: TACTICAL ASSET DEPLOYMENT & FREQUENCY CHANNELING DIRECTIVE

1. OPERATIONAL MANDATE
All tactical units operating under primary command are hereby directed to maintain strict EMCON (Emission Control) Delta along operational sectors Alpha-7 through Bravo-9. Passive sensor arrays shall remain synchronous with encrypted telemetry beacons.

2. CRYPTOGRAPHIC PROVENANCE INSTRUCTIONS
Pursuant to Security Framework Directive 2026-ORV, this document is encrypted under ML-KEM-1024 broadcast parameters. Each authorized recipient endpoint executes local decryption under sovereign NIST FIPS 204 (ML-DSA) signing mandates. Any offline copy extracted or captured retains unique session-level forensic watermarking.

3. DOWNLINK TELEMETRY VECTORS
Primary downlink slot 4B operational window: 0300Z to 0730Z. Emergency rendezvous coordinates: Sector Grid 18-North, 072-East.

AUTHENTICATION SEAL: SECURE-ENCLAVE-2026-ALPHA`,
    authorizedRecipientIds: ['rec-001', 'rec-002', 'rec-004', 'rec-006'],
    encryptionAlgorithm: 'ML-KEM-1024 + AES-256-GCM',
    broadcastPackageHash: '7f91823acb4019283746e1928374650192837465019283746501928374619472',
    decryptionCount: 8,
    uploadedAt: '24 Sep 2026 — 09:15:00 UTC',
    ledgerStatus: 'VERIFIED',
  },
  {
    id: 'doc-002',
    docId: 'DOC-00473',
    title: 'PQC-SPEC-V4.pdf',
    classification: 'SECRET',
    fileType: 'PDF Document',
    fileSize: '3.2 MB',
    sha3Hash: '1a90c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852c991',
    sha256Hash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
    owner: 'Senior Cryptographer',
    ownerDepartment: 'Cryptographic Systems',
    description: 'Architectural specifications for hardware-accelerated ML-KEM key generation on isolated tactical computing cores.',
    fullText: `TECHNICAL SPECIFICATION SPEC-PQC-2026-V4
DEPARTMENT: CRYPTOGRAPHIC HARDWARE DIVISION
CLEARANCE LEVEL: SECRET

1. POST-QUANTUM HARDWARE ABSTRACTION
This specification outlines the integration of NIST FIPS 203 (ML-KEM-1024) within air-gapped cryptographic accelerators. Central memory buses enforce zero-leakage bus encryption across non-volatile key storage banks.

2. DIGITAL SIGNATURE VERIFICATION
All decryption tokens must be authenticated against ML-DSA-87 parameter sets before plaintext payload unsealing is granted by local secure enclave microcontrollers.`,
    authorizedRecipientIds: ['rec-001', 'rec-002', 'rec-003', 'rec-004', 'rec-005', 'rec-007'],
    encryptionAlgorithm: 'ML-KEM-1024 + AES-256-GCM',
    broadcastPackageHash: '2b4c6e8019374829103948572019485730294857201948572019485720193847',
    decryptionCount: 5,
    uploadedAt: '23 Sep 2026 — 14:00:22 UTC',
    ledgerStatus: 'VERIFIED',
  },
  {
    id: 'doc-003',
    docId: 'DOC-00474',
    title: 'SENSOR-GRID-TELEMETRY-09.pdf',
    classification: 'CONFIDENTIAL',
    fileType: 'PDF Document',
    fileSize: '2.1 MB',
    sha3Hash: '5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f',
    sha256Hash: '3d4c5b6a70819283746501928374650192837465019283746501928374650192',
    owner: 'Lead Telemetry Analyst',
    ownerDepartment: 'Signals Intelligence',
    description: 'Oceanographic calibration data for deep-water passive acoustic sensor hydrophones.',
    fullText: `SIGNALS INTELLIGENCE TELEMETRY DIRECTIVE
CLASSIFICATION: CONFIDENTIAL

Sensor sensitivity matrices recorded across deep-sea acoustic sweeps. Frequency threshold 12Hz to 24kHz recorded nominal background ambient baseline across perimeter buoys.`,
    authorizedRecipientIds: ['rec-002', 'rec-004', 'rec-005', 'rec-006'],
    encryptionAlgorithm: 'ML-KEM-1024 + AES-256-GCM',
    broadcastPackageHash: '8e7d6c5b4a392817402938475019283746501928374650192837465019283746',
    decryptionCount: 14,
    uploadedAt: '22 Sep 2026 — 11:45:10 UTC',
    ledgerStatus: 'VERIFIED',
  }
];

export const INITIAL_EVENTS: DecryptionEvent[] = [
  {
    id: 'evt-001',
    eventId: 'DEC-2026-000181',
    docId: 'DOC-00474',
    docTitle: 'SENSOR-GRID-TELEMETRY-09.pdf',
    docHash: '3d4c5b6a70819283746501928374650192837465019283746501928374650192',
    recipientId: 'rec-002',
    recipientName: 'Officer B (P. Sharma)',
    recipientCode: 'SEC-OPS-0892',
    recipientType: 'INDIVIDUAL',
    sessionId: 'DEC-2026-000181',
    timestamp: '24 Sep 2026 — 11:20:14 UTC',
    ipAddress: '10.14.2.84 (Air-Gapped Subnet)',
    terminalId: 'SEC-WS-02',
    watermarkId: 'WM-3B12-9F40-77C1',
    watermarkHash: '91a82f7c0018b3e8274d6190a4e72c81',
    watermarkPayload: {
      recipientCode: 'SEC-OPS-0892',
      sessionId: 'DEC-2026-000181',
      docId: 'DOC-00474',
      timestamp: '24 Sep 2026 — 11:20:14 UTC'
    },
    mlDsaSignature: '0xMLDSA87_e942f1a08c0471d7b319a4e82c5f1107d3b9e4a81c002938...3d4c5b6a70819283_SIG_NIST_FIPS_204',
    mlDsaPublicKeyFingerprint: 'FP-DSA-892A-44C1',
    ledgerBlockNumber: 181,
    verificationStatus: 'VERIFIED',
    timeline: {
      authorizedAt: '24 Sep 2026 — 11:20:10 UTC',
      decryptedAt: '24 Sep 2026 — 11:20:11 UTC',
      watermarkGeneratedAt: '24 Sep 2026 — 11:20:12 UTC',
      signedAt: '24 Sep 2026 — 11:20:13 UTC',
      ledgerCommittedAt: '24 Sep 2026 — 11:20:14 UTC',
      verifiedAt: '24 Sep 2026 — 11:20:15 UTC'
    }
  },
  {
    id: 'evt-002',
    eventId: 'DEC-2026-000182',
    docId: 'DOC-00473',
    docTitle: 'PQC-SPEC-V4.pdf',
    docHash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
    recipientId: 'rec-007',
    recipientName: 'Secure SCIF Terminal 04',
    recipientCode: 'SEC-TERM-04',
    recipientType: 'SECURE_TERMINAL',
    individualSubUserId: 'OFFICER-055',
    individualSubUserName: 'Lead Analyst R. Sen',
    sessionId: 'DEC-2026-000182',
    timestamp: '24 Sep 2026 — 13:10:45 UTC',
    ipAddress: '10.14.8.104 (SCIF Vault Subnet)',
    terminalId: 'SCIF-CONSOLE-04',
    watermarkId: 'WM-7E44-11A0-99D2',
    watermarkHash: '44c91827b019a84f67e01928374a5d89',
    watermarkPayload: {
      recipientCode: 'SEC-TERM-04',
      sessionId: 'DEC-2026-000182',
      docId: 'DOC-00473',
      timestamp: '24 Sep 2026 — 13:10:45 UTC',
      subUser: 'OFFICER-055 (Lead Analyst R. Sen)'
    },
    mlDsaSignature: '0xMLDSA87_22f910293c8a019284d71928374e019283745a91827364...9a8b7c6d5e4f3a2b_SIG_NIST_FIPS_204',
    mlDsaPublicKeyFingerprint: 'FP-DSA-TRM4-99D2',
    ledgerBlockNumber: 182,
    verificationStatus: 'VERIFIED',
    timeline: {
      authorizedAt: '24 Sep 2026 — 13:10:40 UTC',
      decryptedAt: '24 Sep 2026 — 13:10:42 UTC',
      watermarkGeneratedAt: '24 Sep 2026 — 13:10:43 UTC',
      signedAt: '24 Sep 2026 — 13:10:44 UTC',
      ledgerCommittedAt: '24 Sep 2026 — 13:10:45 UTC',
      verifiedAt: '24 Sep 2026 — 13:10:46 UTC'
    }
  },
  {
    id: 'evt-003',
    eventId: 'DEC-2026-000183',
    docId: 'DOC-00472',
    docTitle: 'classified_operation.pdf',
    docHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    recipientId: 'rec-004',
    recipientName: 'Strategic Analysis Group',
    recipientCode: 'INTELLIGENCE-OPS',
    recipientType: 'GROUP',
    individualSubUserId: 'OFFICER-041',
    individualSubUserName: 'Senior Analyst M. Roy',
    sessionId: 'DEC-2026-000183',
    timestamp: '24 Sep 2026 — 14:15:30 UTC',
    ipAddress: '10.14.9.41 (Secure Ops Enclave)',
    terminalId: 'SEC-WS-41',
    watermarkId: 'WM-5D88-29BC-41E0',
    watermarkHash: '7a19284c81029384d7a1029384e5b918',
    watermarkPayload: {
      recipientCode: 'INTELLIGENCE-OPS',
      sessionId: 'DEC-2026-000183',
      docId: 'DOC-00472',
      timestamp: '24 Sep 2026 — 14:15:30 UTC',
      subUser: 'OFFICER-041 (Senior Analyst M. Roy)'
    },
    mlDsaSignature: '0xMLDSA87_88a10f92b7401c83d91726a4e091b8273f4c10a8291847...e3b0c44298fc1c14_SIG_NIST_FIPS_204',
    mlDsaPublicKeyFingerprint: 'FP-DSA-GRP1-041M',
    ledgerBlockNumber: 183,
    verificationStatus: 'VERIFIED',
    timeline: {
      authorizedAt: '24 Sep 2026 — 14:15:25 UTC',
      decryptedAt: '24 Sep 2026 — 14:15:26 UTC',
      watermarkGeneratedAt: '24 Sep 2026 — 14:15:27 UTC',
      signedAt: '24 Sep 2026 — 14:15:28 UTC',
      ledgerCommittedAt: '24 Sep 2026 — 14:15:29 UTC',
      verifiedAt: '24 Sep 2026 — 14:15:30 UTC'
    }
  },
  {
    id: 'evt-004',
    eventId: 'DEC-2026-000184',
    docId: 'DOC-00472',
    docTitle: 'classified_operation.pdf',
    docHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    recipientId: 'rec-001',
    recipientName: 'Officer A (V. Rao)',
    recipientCode: 'SEC-OPS-0471',
    recipientType: 'INDIVIDUAL',
    sessionId: 'DEC-2026-000184',
    timestamp: '24 Sep 2026 — 14:32:18 UTC',
    ipAddress: '10.14.8.22 (Air-Gapped Ops Net)',
    terminalId: 'OPS-CONSOLE-SEC-01',
    watermarkId: 'WM-A82F-194C-91E4',
    watermarkHash: '8b7f29a1c00471e98341904a82c5f110',
    watermarkPayload: {
      recipientCode: 'SEC-OPS-0471',
      sessionId: 'DEC-2026-000184',
      docId: 'DOC-00472',
      timestamp: '24 Sep 2026 — 14:32:18 UTC'
    },
    mlDsaSignature: '0xMLDSA87_e942f1a08c0471d7b319a4e82c5f1107d3b9e4a81c002938...e3b0c44298fc1c14_SIG_NIST_FIPS_204',
    mlDsaPublicKeyFingerprint: 'FP-DSA-0471-VRAO',
    ledgerBlockNumber: 184,
    verificationStatus: 'VERIFIED',
    timeline: {
      authorizedAt: '24 Sep 2026 — 14:32:12 UTC',
      decryptedAt: '24 Sep 2026 — 14:32:14 UTC',
      watermarkGeneratedAt: '24 Sep 2026 — 14:32:15 UTC',
      signedAt: '24 Sep 2026 — 14:32:16 UTC',
      ledgerCommittedAt: '24 Sep 2026 — 14:32:17 UTC',
      verifiedAt: '24 Sep 2026 — 14:32:18 UTC'
    }
  }
];

export const INITIAL_BLOCKS: LedgerBlock[] = [
  {
    blockNumber: 181,
    blockHash: '0x49f018274a91b8273c0192847d8a2910384f9c10293847a982b1c09847120938',
    previousHash: '0x88e1029384d7a1029384e5b91827364102938475620194857201948572019485',
    timestamp: '24 Sep 2026 — 11:20:14 UTC',
    eventId: 'DEC-2026-000181',
    docId: 'DOC-00474',
    docHash: '3d4c5b6a70819283746501928374650192837465019283746501928374650192',
    recipientId: 'rec-002',
    recipientCode: 'SEC-OPS-0892',
    recipientType: 'INDIVIDUAL',
    watermarkId: 'WM-3B12-9F40-77C1',
    mlDsaSignature: '0xMLDSA87_e942f1a08c0471d7b319a4e82c5f1107...3d4c5b6a_SIG',
    validatorNode: 'CORE-VALIDATOR-01',
    consensusStatus: 'CONSENSUS_REACHED',
    merkleRoot: '0x77c190284b7a19283c0192847d8a2910'
  },
  {
    blockNumber: 182,
    blockHash: '0x62a109384b7c19283e0192847a8d2910394f8c10293847192847561029384756',
    previousHash: '0x49f018274a91b8273c0192847d8a2910384f9c10293847a982b1c09847120938',
    timestamp: '24 Sep 2026 — 13:10:45 UTC',
    eventId: 'DEC-2026-000182',
    docId: 'DOC-00473',
    docHash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
    recipientId: 'rec-007',
    recipientCode: 'SEC-TERM-04',
    recipientType: 'SECURE_TERMINAL',
    subUserId: 'OFFICER-055',
    watermarkId: 'WM-7E44-11A0-99D2',
    mlDsaSignature: '0xMLDSA87_22f910293c8a019284d71928374e0192...9a8b7c6d_SIG',
    validatorNode: 'AIRGAP-CONSENSUS-SENTRY-02',
    consensusStatus: 'CONSENSUS_REACHED',
    merkleRoot: '0x88d2910384b7a19283c0192847d8a291'
  },
  {
    blockNumber: 183,
    blockHash: '0x81b74c0192847d8a2910384f9c10293847a982b1c0984712093849f018274a91',
    previousHash: '0x62a109384b7c19283e0192847a8d2910394f8c10293847192847561029384756',
    timestamp: '24 Sep 2026 — 14:15:29 UTC',
    eventId: 'DEC-2026-000183',
    docId: 'DOC-00472',
    docHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    recipientId: 'rec-004',
    recipientCode: 'INTELLIGENCE-OPS',
    recipientType: 'GROUP',
    subUserId: 'OFFICER-041',
    watermarkId: 'WM-5D88-29BC-41E0',
    mlDsaSignature: '0xMLDSA87_88a10f92b7401c83d91726a4e091b827...e3b0c442_SIG',
    validatorNode: 'SECURE-LEDGER-CORE-03',
    consensusStatus: 'CONSENSUS_REACHED',
    merkleRoot: '0x99a19283c0192847d8a2910384f9c102'
  },
  {
    blockNumber: 184,
    blockHash: '0xa83f910293847d8a2910384f9c10293847a982b1c0984712093849f0182772c1',
    previousHash: '0x81b74c0192847d8a2910384f9c10293847a982b1c0984712093849f018274a91',
    timestamp: '24 Sep 2026 — 14:32:17 UTC',
    eventId: 'DEC-2026-000184',
    docId: 'DOC-00472',
    docHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    recipientId: 'rec-001',
    recipientCode: 'SEC-OPS-0471',
    recipientType: 'INDIVIDUAL',
    watermarkId: 'WM-A82F-194C-91E4',
    mlDsaSignature: '0xMLDSA87_e942f1a08c0471d7b319a4e82c5f1107...e3b0c442_SIG',
    validatorNode: 'CORE-VALIDATOR-01',
    consensusStatus: 'CONSENSUS_REACHED',
    merkleRoot: '0x184c81029384d7a1029384e5b9182736',
    isTampered: false
  }
];

export const INITIAL_KEYS: KeyRecord[] = [
  {
    id: 'key-001',
    recipientId: 'rec-001',
    recipientName: 'Officer A (V. Rao)',
    recipientCode: 'SEC-OPS-0471',
    recipientType: 'INDIVIDUAL',
    kemAlgorithm: 'ML-KEM-1024 (NIST FIPS 203)',
    dsaAlgorithm: 'ML-DSA-87 (NIST FIPS 204)',
    kemPublicKey: '0xKEM1024_7a9f821c00471b8e43d9a1f592c3b8417d9e4a2c01928374a5892c',
    dsaPublicKey: '0xDSA87_e942f1a08c0471d7b319a4e82c5f1107d3b9e4a81c0029384719482b',
    dsaFingerprint: 'FP-DSA-0471-VRAO',
    privateKeyStorage: 'LOCAL SECURE KEY STORE (AIR-GAPPED HSM)',
    keyVersion: 'v2.4-PQC',
    createdAt: '15 Jan 2026',
    lastUsed: '24 Sep 2026 — 14:32:16 UTC',
    status: 'ACTIVE'
  },
  {
    id: 'key-002',
    recipientId: 'rec-002',
    recipientName: 'Officer B (P. Sharma)',
    recipientCode: 'SEC-OPS-0892',
    recipientType: 'INDIVIDUAL',
    kemAlgorithm: 'ML-KEM-1024 (NIST FIPS 203)',
    dsaAlgorithm: 'ML-DSA-87 (NIST FIPS 204)',
    kemPublicKey: '0xKEM1024_3c81b90200892f7a14e82d094b7c1a938e2d4f1a09817263b41829',
    dsaPublicKey: '0xDSA87_fa0182b74c0892c9e218a3d74f0c91823a7e5b9c021984729183746a',
    dsaFingerprint: 'FP-DSA-0892-PSHA',
    privateKeyStorage: 'LOCAL SECURE KEY STORE (AIR-GAPPED HSM)',
    keyVersion: 'v2.4-PQC',
    createdAt: '18 Jan 2026',
    lastUsed: '24 Sep 2026 — 11:20:13 UTC',
    status: 'ACTIVE'
  },
  {
    id: 'key-003',
    recipientId: 'rec-004',
    recipientName: 'Strategic Analysis Group',
    recipientCode: 'INTELLIGENCE-OPS',
    recipientType: 'GROUP',
    kemAlgorithm: 'ML-KEM-1024 (NIST FIPS 203)',
    dsaAlgorithm: 'ML-DSA-87 (NIST FIPS 204)',
    kemPublicKey: '0xKEM1024_GRP_99c81a201948b7e33d01827cfa4910b83e7a1c920194827182',
    dsaPublicKey: '0xDSA87_GRP_88a10f92b7401c83d91726a4e091b8273f4c10a8291847582910',
    dsaFingerprint: 'FP-DSA-GRP-INTEL',
    privateKeyStorage: 'LOCAL SECURE KEY STORE (AIR-GAPPED HSM)',
    keyVersion: 'v2.1-PQC',
    createdAt: '01 Feb 2026',
    lastUsed: '24 Sep 2026 — 14:15:28 UTC',
    status: 'ACTIVE'
  },
  {
    id: 'key-004',
    recipientId: 'rec-006',
    recipientName: 'Secure Distribution Server 07',
    recipientCode: 'NIA-SRV-07',
    recipientType: 'SERVER',
    kemAlgorithm: 'ML-KEM-1024 (NIST FIPS 203)',
    dsaAlgorithm: 'ML-DSA-87 (NIST FIPS 204)',
    kemPublicKey: '0xKEM1024_SRV_77f019283a01948b29c817264e9a018273f4b8109283748291',
    dsaPublicKey: '0xDSA87_SRV_66a918273f019284c81029384d7a1029384e5b91827364102938',
    dsaFingerprint: 'FP-DSA-SRV-07',
    privateKeyStorage: 'LOCAL SECURE KEY STORE (AIR-GAPPED HSM)',
    keyVersion: 'v3.0-PQC',
    createdAt: '10 Feb 2026',
    lastUsed: '24 Sep 2026 — 14:35:10 UTC',
    status: 'ACTIVE'
  },
  {
    id: 'key-005',
    recipientId: 'rec-007',
    recipientName: 'Secure SCIF Terminal 04',
    recipientCode: 'SEC-TERM-04',
    recipientType: 'SECURE_TERMINAL',
    kemAlgorithm: 'ML-KEM-1024 (NIST FIPS 203)',
    dsaAlgorithm: 'ML-DSA-87 (NIST FIPS 204)',
    kemPublicKey: '0xKEM1024_TRM_11e829104b7a19283c0192847d8a2910384f9c102938475829',
    dsaPublicKey: '0xDSA87_TRM_22f910293c8a019284d71928374e019283745a91827364102938',
    dsaFingerprint: 'FP-DSA-TRM-04',
    privateKeyStorage: 'LOCAL SECURE KEY STORE (AIR-GAPPED HSM)',
    keyVersion: 'v2.0-PQC',
    createdAt: '05 Mar 2026',
    lastUsed: '24 Sep 2026 — 14:10:22 UTC',
    status: 'ACTIVE'
  }
];

export const INITIAL_NODES: ConsensusNode[] = [
  {
    id: 'node-01',
    name: 'CORE-VALIDATOR-01',
    role: 'PRIMARY VALIDATOR',
    ip: '10.14.0.11',
    status: 'ONLINE',
    blocksCommitted: 184,
    latency: '< 0.4 ms'
  },
  {
    id: 'node-02',
    name: 'AIRGAP-CONSENSUS-SENTRY-02',
    role: 'CONSENSUS SENTRY',
    ip: '10.14.0.12',
    status: 'ONLINE',
    blocksCommitted: 184,
    latency: '< 0.6 ms'
  },
  {
    id: 'node-03',
    name: 'SECURE-LEDGER-CORE-03',
    role: 'ARCHIVAL WITNESS',
    ip: '10.14.0.13',
    status: 'ONLINE',
    blocksCommitted: 184,
    latency: '< 0.5 ms'
  }
];

export const SAMPLE_REPORTS: ForensicReport[] = [
  {
    caseId: 'CASE-2026-ORV-0042',
    generatedAt: '24 Sep 2026 — 15:02:11 UTC',
    leakedFileName: 'classified_operation_leaked_copy.pdf',
    documentId: 'DOC-00472',
    documentTitle: 'classified_operation.pdf',
    documentHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    extractedWatermarkId: 'WM-A82F-194C-91E4',
    matchedRecipientName: 'Officer A (V. Rao)',
    matchedRecipientCode: 'SEC-OPS-0471',
    matchedRecipientType: 'INDIVIDUAL',
    sessionId: 'DEC-2026-000184',
    decryptionTimestamp: '24 Sep 2026 — 14:32:18 UTC',
    digitalSignature: '0xMLDSA87_e942f1a08c0471d7b319a4e82c5f1107d3b9e4a81c002938...e3b0c44298fc1c14_SIG_NIST_FIPS_204',
    signatureAlgorithm: 'ML-DSA-87',
    ledgerBlockNumber: 184,
    previousBlockHash: '0x81b74c0192847d8a2910384f9c10293847a982b1c0984712093849f018274a91',
    currentBlockHash: '0xa83f910293847d8a2910384f9c10293847a982b1c0984712093849f0182772c1',
    verificationResults: {
      watermarkMatched: true,
      docHashVerified: true,
      signatureVerified: true,
      ledgerChainingValid: true,
      zeroVisualDifferenceConfirmed: true
    },
    attributionStatus: 'CRYPTOGRAPHICALLY VERIFIED',
    investigatorUnit: 'Digital Forensics & Incident Response Lab',
    officialVerdict: 'Forensic extraction confirmed identical invisible watermark WM-A82F-194C-91E4 linked to block #184. Recipient SEC-OPS-0471 verified via ML-DSA-87 digital signature.'
  }
];
