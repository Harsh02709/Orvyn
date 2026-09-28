export type RecipientType = 'INDIVIDUAL' | 'GROUP' | 'SERVER' | 'SECURE_TERMINAL';

export type ClassificationLevel = 'RESTRICTED' | 'CONFIDENTIAL' | 'SECRET' | 'TOP SECRET';

export interface Recipient {
  id: string;
  code: string;
  name: string;
  type: RecipientType;
  department: string;
  role: string;
  clearance: ClassificationLevel;
  mlKemPublicKey: string;
  mlDsaPublicKey: string;
  status: 'AUTHORIZED' | 'SUSPENDED' | 'PENDING';
  lastActive: string;
  memberCount?: number;
  serverNode?: string;
  terminalLocation?: string;
}

export interface ClassifiedDocument {
  id: string;
  docId: string;
  title: string;
  classification: ClassificationLevel;
  fileType: string;
  fileSize: string;
  sha3Hash: string;
  sha256Hash: string;
  owner: string;
  ownerDepartment: string;
  description: string;
  fullText: string;
  authorizedRecipientIds: string[];
  encryptionAlgorithm: 'ML-KEM-1024 + AES-256-GCM';
  broadcastPackageHash: string;
  decryptionCount: number;
  uploadedAt: string;
  ledgerStatus: 'VERIFIED' | 'TAMPERED';
}

export interface DecryptionTimeline {
  authorizedAt: string;
  decryptedAt: string;
  watermarkGeneratedAt: string;
  signedAt: string;
  ledgerCommittedAt: string;
  verifiedAt: string;
}

export interface DecryptionEvent {
  id: string;
  eventId: string;
  docId: string;
  docTitle: string;
  docHash: string;
  recipientId: string;
  recipientName: string;
  recipientCode: string;
  recipientType: RecipientType;
  individualSubUserId?: string;
  individualSubUserName?: string;
  sessionId: string;
  timestamp: string;
  ipAddress: string;
  terminalId: string;
  watermarkId: string;
  watermarkHash: string;
  watermarkPayload: {
    recipientCode: string;
    sessionId: string;
    docId: string;
    timestamp: string;
    subUser?: string;
  };
  mlDsaSignature: string;
  mlDsaPublicKeyFingerprint: string;
  ledgerBlockNumber: number;
  verificationStatus: 'VERIFIED' | 'TAMPERED' | 'INVESTIGATING';
  timeline: DecryptionTimeline;
}

export interface LedgerBlock {
  blockNumber: number;
  blockHash: string;
  previousHash: string;
  timestamp: string;
  eventId: string;
  docId: string;
  docHash: string;
  recipientId: string;
  recipientCode: string;
  recipientType: RecipientType;
  subUserId?: string;
  watermarkId: string;
  mlDsaSignature: string;
  validatorNode: string;
  consensusStatus: 'CONSENSUS_REACHED' | 'VALIDATED_OFFLINE';
  merkleRoot: string;
  isTampered?: boolean;
  tamperedField?: string;
  originalData?: {
    recipientCode: string;
    watermarkId: string;
    blockHash: string;
  };
}

export interface ForensicReport {
  caseId: string;
  generatedAt: string;
  leakedFileName: string;
  documentId: string;
  documentTitle: string;
  documentHash: string;
  extractedWatermarkId: string;
  matchedRecipientName: string;
  matchedRecipientCode: string;
  matchedRecipientType: RecipientType;
  individualAttribution?: string;
  sessionId: string;
  decryptionTimestamp: string;
  digitalSignature: string;
  signatureAlgorithm: 'ML-DSA-87';
  ledgerBlockNumber: number;
  previousBlockHash: string;
  currentBlockHash: string;
  verificationResults: {
    watermarkMatched: boolean;
    docHashVerified: boolean;
    signatureVerified: boolean;
    ledgerChainingValid: boolean;
    zeroVisualDifferenceConfirmed: boolean;
  };
  attributionStatus: 'CRYPTOGRAPHICALLY VERIFIED' | 'INCONCLUSIVE';
  investigatorUnit: string;
  officialVerdict: string;
}

export interface KeyRecord {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientCode: string;
  recipientType: RecipientType;
  kemAlgorithm: 'ML-KEM-1024 (NIST FIPS 203)';
  dsaAlgorithm: 'ML-DSA-87 (NIST FIPS 204)';
  kemPublicKey: string;
  dsaPublicKey: string;
  dsaFingerprint: string;
  privateKeyStorage: 'LOCAL SECURE KEY STORE (AIR-GAPPED HSM)';
  keyVersion: string;
  createdAt: string;
  lastUsed: string;
  status: 'ACTIVE' | 'ROTATED' | 'REVOKED';
}

export interface ConsensusNode {
  id: string;
  name: string;
  role: 'PRIMARY VALIDATOR' | 'CONSENSUS SENTRY' | 'ARCHIVAL WITNESS';
  ip: string;
  status: 'ONLINE' | 'STANDBY';
  blocksCommitted: number;
  latency: string;
}
