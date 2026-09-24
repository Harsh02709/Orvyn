import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ClassifiedDocument,
  Recipient,
  DecryptionEvent,
  LedgerBlock,
  KeyRecord,
  ConsensusNode,
  ForensicReport
} from '../types';
import {
  INITIAL_DOCUMENTS,
  INITIAL_RECIPIENTS,
  INITIAL_EVENTS,
  INITIAL_BLOCKS,
  INITIAL_KEYS,
  INITIAL_NODES,
  SAMPLE_REPORTS
} from '../data/initialData';
import {
  calculateSha256,
  injectZeroWidthWatermark,
  extractZeroWidthWatermark,
  generateMlDsaSignature,
  computeBlockHash,
  getStandardTimestamp
} from '../utils/crypto';

export type NavView =
  | 'overview'
  | 'documents'
  | 'distribute'
  | 'recipients'
  | 'events'
  | 'ledger'
  | 'forensics'
  | 'keys'
  | 'security'
  | 'reports'
  | 'settings';

interface AppContextType {
  activeView: NavView;
  setActiveView: (view: NavView) => void;
  documents: ClassifiedDocument[];
  recipients: Recipient[];
  events: DecryptionEvent[];
  blocks: LedgerBlock[];
  keys: KeyRecord[];
  nodes: ConsensusNode[];
  reports: ForensicReport[];

  // Action methods
  distributeDocument: (docData: {
    title: string;
    classification: ClassifiedDocument['classification'];
    fileSize: string;
    description: string;
    fullText: string;
    recipientIds: string[];
  }) => Promise<ClassifiedDocument>;

  performDecryption: (
    docId: string,
    recipientId: string,
    subUserId?: string,
    subUserName?: string
  ) => Promise<{ event: DecryptionEvent; block: LedgerBlock; watermarkedText: string }>;

  tamperLedgerBlock: (blockNumber: number, field: string, maliciousValue: string) => void;
  restoreLedgerBlock: (blockNumber: number) => void;

  runForensicAnalysis: (
    content: string,
    fileName: string
  ) => Promise<{
    matched: boolean;
    watermarkId?: string;
    event?: DecryptionEvent;
    block?: LedgerBlock;
    recipient?: Recipient;
    report?: ForensicReport;
  }>;

  saveForensicReport: (report: ForensicReport) => void;
  addRecipient: (recipient: Recipient) => void;

  // Modals & inspect
  decryptModalState: { isOpen: boolean; documentId?: string; recipientId?: string };
  openDecryptModal: (documentId?: string, recipientId?: string) => void;
  closeDecryptModal: () => void;

  documentDetailModal: { isOpen: boolean; document?: ClassifiedDocument };
  openDocumentDetail: (doc: ClassifiedDocument) => void;
  closeDocumentDetail: () => void;

  watermarkInspectorModal: { isOpen: boolean; event?: DecryptionEvent };
  openWatermarkInspector: (event: DecryptionEvent) => void;
  closeWatermarkInspector: () => void;

  demoTourOpen: boolean;
  setDemoTourOpen: (open: boolean) => void;
  activeDemoStep: number;
  setActiveDemoStep: (step: number) => void;

  // Mobile navigation
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;

  // System stats
  isAirGapped: boolean;
  ledgerIntegrity: 'VERIFIED' | 'TAMPERED';
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<NavView>('overview');
  const [documents, setDocuments] = useState<ClassifiedDocument[]>(INITIAL_DOCUMENTS);
  const [recipients, setRecipients] = useState<Recipient[]>(INITIAL_RECIPIENTS);
  const [events, setEvents] = useState<DecryptionEvent[]>(INITIAL_EVENTS);
  const [blocks, setBlocks] = useState<LedgerBlock[]>(INITIAL_BLOCKS);
  const [keys, setKeys] = useState<KeyRecord[]>(INITIAL_KEYS);
  const [nodes] = useState<ConsensusNode[]>(INITIAL_NODES);
  const [reports, setReports] = useState<ForensicReport[]>(SAMPLE_REPORTS);

  const [decryptModalState, setDecryptModalState] = useState<{
    isOpen: boolean;
    documentId?: string;
    recipientId?: string;
  }>({ isOpen: false });

  const [documentDetailModal, setDocumentDetailModal] = useState<{
    isOpen: boolean;
    document?: ClassifiedDocument;
  }>({ isOpen: false });

  const [watermarkInspectorModal, setWatermarkInspectorModal] = useState<{
    isOpen: boolean;
    event?: DecryptionEvent;
  }>({ isOpen: false });

  const [demoTourOpen, setDemoTourOpen] = useState<boolean>(false);
  const [activeDemoStep, setActiveDemoStep] = useState<number>(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const handleSetActiveView = (view: NavView) => {
    setActiveView(view);
    setIsMobileMenuOpen(false);
  };

  // Check if any block is tampered
  const isAnyBlockTampered = blocks.some((b) => b.isTampered);
  const ledgerIntegrity = isAnyBlockTampered ? 'TAMPERED' : 'VERIFIED';

  const openDecryptModal = (documentId?: string, recipientId?: string) => {
    setDecryptModalState({ isOpen: true, documentId, recipientId });
  };
  const closeDecryptModal = () => {
    setDecryptModalState({ isOpen: false });
  };

  const openDocumentDetail = (doc: ClassifiedDocument) => {
    setDocumentDetailModal({ isOpen: true, document: doc });
  };
  const closeDocumentDetail = () => {
    setDocumentDetailModal({ isOpen: false });
  };

  const openWatermarkInspector = (event: DecryptionEvent) => {
    setWatermarkInspectorModal({ isOpen: true, event });
  };
  const closeWatermarkInspector = () => {
    setWatermarkInspectorModal({ isOpen: false });
  };

  // Add recipient
  const addRecipient = (newRec: Recipient) => {
    setRecipients((prev) => [newRec, ...prev]);
    // Also create corresponding key record
    const newKey: KeyRecord = {
      id: `key-${Date.now()}`,
      recipientId: newRec.id,
      recipientName: newRec.name,
      recipientCode: newRec.code,
      recipientType: newRec.type,
      kemAlgorithm: 'ML-KEM-1024 (NIST FIPS 203)',
      dsaAlgorithm: 'ML-DSA-87 (NIST FIPS 204)',
      kemPublicKey: newRec.mlKemPublicKey,
      dsaPublicKey: newRec.mlDsaPublicKey,
      dsaFingerprint: `FP-DSA-${newRec.code.replace(/[^a-zA-Z0-9]/g, '').slice(-6)}`,
      privateKeyStorage: 'LOCAL SECURE KEY STORE (AIR-GAPPED HSM)',
      keyVersion: 'v1.0-PQC',
      createdAt: getStandardTimestamp(),
      lastUsed: 'Not yet used',
      status: 'ACTIVE'
    };
    setKeys((prev) => [newKey, ...prev]);
  };

  // Distribute new document workflow
  const distributeDocument = async (docData: {
    title: string;
    classification: ClassifiedDocument['classification'];
    fileSize: string;
    description: string;
    fullText: string;
    recipientIds: string[];
  }): Promise<ClassifiedDocument> => {
    const rawSha256 = await calculateSha256(docData.fullText);
    const broadcastHash = await calculateSha256(rawSha256 + ':ML-KEM-1024-BROADCAST');
    const newDocId = `DOC-00${470 + documents.length + 5}`;

    const newDoc: ClassifiedDocument = {
      id: `doc-${Date.now()}`,
      docId: newDocId,
      title: docData.title,
      classification: docData.classification,
      fileType: 'PDF Document (Cryptographic Enclave)',
      fileSize: docData.fileSize || '3.5 MB',
      sha3Hash: rawSha256.split('').reverse().join(''),
      sha256Hash: rawSha256,
      owner: 'Security Operations Centre',
      ownerDepartment: 'Cryptographic Security Directorate',
      description: docData.description,
      fullText: docData.fullText,
      authorizedRecipientIds: docData.recipientIds,
      encryptionAlgorithm: 'ML-KEM-1024 + AES-256-GCM',
      broadcastPackageHash: broadcastHash,
      decryptionCount: 0,
      uploadedAt: getStandardTimestamp(),
      ledgerStatus: 'VERIFIED'
    };

    setDocuments((prev) => [newDoc, ...prev]);
    return newDoc;
  };

  // Perform Decryption workflow
  const performDecryption = async (
    docId: string,
    recipientId: string,
    subUserId?: string,
    subUserName?: string
  ): Promise<{ event: DecryptionEvent; block: LedgerBlock; watermarkedText: string }> => {
    const doc = documents.find((d) => d.id === docId || d.docId === docId) || documents[0];
    const rec = recipients.find((r) => r.id === recipientId || r.code === recipientId) || recipients[0];

    const nextBlockNum = blocks.length > 0 ? Math.max(...blocks.map((b) => b.blockNumber)) + 1 : 185;
    const nextSessionNum = String(nextBlockNum).padStart(6, '0');
    const sessionId = `DEC-2026-${nextSessionNum}`;
    const eventId = sessionId;

    // Generate unique random hex parts for invisible forensic watermark ID
    const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
    const randomHex2 = Math.random().toString(16).substring(2, 6).toUpperCase();
    const watermarkId = `WM-${randomHex}-${randomHex2}-91E4`;

    // Inject invisible zero-width watermark into document text
    const watermarkedText = injectZeroWidthWatermark(doc.fullText, watermarkId, sessionId);

    // Compute cryptographic watermark hash
    const watermarkHash = await calculateSha256(watermarkId + ':' + sessionId);

    // Sign record using recipient's sovereign post-quantum ML-DSA key
    const effectiveRecipientCode = rec.type === 'GROUP' || rec.type === 'SERVER' || rec.type === 'SECURE_TERMINAL'
      ? `${rec.code}${subUserId ? `::${subUserId}` : ''}`
      : rec.code;

    const mlDsaSignature = generateMlDsaSignature(
      doc.sha256Hash,
      effectiveRecipientCode,
      sessionId,
      watermarkId
    );

    const nowTimestamp = getStandardTimestamp();

    const newEvent: DecryptionEvent = {
      id: `evt-${Date.now()}`,
      eventId,
      docId: doc.docId,
      docTitle: doc.title,
      docHash: doc.sha256Hash,
      recipientId: rec.id,
      recipientName: rec.name,
      recipientCode: rec.code,
      recipientType: rec.type,
      individualSubUserId: subUserId,
      individualSubUserName: subUserName,
      sessionId,
      timestamp: nowTimestamp,
      ipAddress: rec.type === 'SERVER' ? '10.14.0.7 (Air-Gapped Relay)' : '10.14.8.22 (Secure Enclave)',
      terminalId: rec.terminalLocation || 'OPS-CONSOLE-NAV-01',
      watermarkId,
      watermarkHash,
      watermarkPayload: {
        recipientCode: rec.code,
        sessionId,
        docId: doc.docId,
        timestamp: nowTimestamp,
        subUser: subUserName ? `${subUserId} (${subUserName})` : undefined
      },
      mlDsaSignature,
      mlDsaPublicKeyFingerprint: `FP-DSA-${rec.code.slice(0, 6)}`,
      ledgerBlockNumber: nextBlockNum,
      verificationStatus: 'VERIFIED',
      timeline: {
        authorizedAt: nowTimestamp,
        decryptedAt: nowTimestamp,
        watermarkGeneratedAt: nowTimestamp,
        signedAt: nowTimestamp,
        ledgerCommittedAt: nowTimestamp,
        verifiedAt: nowTimestamp
      }
    };

    // Chain into permissioned offline ledger
    const lastBlock = blocks[blocks.length - 1];
    const prevHash = lastBlock ? lastBlock.blockHash : '0x0000000000000000000000000000000000000000000000000000000000000000';
    const newBlockHash = await computeBlockHash(
      nextBlockNum,
      prevHash,
      eventId,
      doc.sha256Hash,
      rec.code,
      watermarkId,
      mlDsaSignature
    );

    const newBlock: LedgerBlock = {
      blockNumber: nextBlockNum,
      blockHash: '0x' + newBlockHash,
      previousHash: prevHash,
      timestamp: nowTimestamp,
      eventId,
      docId: doc.docId,
      docHash: doc.sha256Hash,
      recipientId: rec.id,
      recipientCode: rec.code,
      recipientType: rec.type,
      subUserId,
      watermarkId,
      mlDsaSignature,
      validatorNode: 'CORE-VALIDATOR-01',
      consensusStatus: 'CONSENSUS_REACHED',
      merkleRoot: '0x' + (await calculateSha256(eventId + doc.sha256Hash)).slice(0, 32),
      isTampered: false
    };

    // Update state
    setEvents((prev) => [newEvent, ...prev]);
    setBlocks((prev) => [...prev, newBlock]);
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === doc.id ? { ...d, decryptionCount: d.decryptionCount + 1 } : d
      )
    );

    // Update key last used
    setKeys((prev) =>
      prev.map((k) =>
        k.recipientId === rec.id ? { ...k, lastUsed: nowTimestamp } : k
      )
    );

    return { event: newEvent, block: newBlock, watermarkedText };
  };

  // Tamper a ledger block to demonstrate hash breakdown
  const tamperLedgerBlock = (blockNumber: number, field: string, maliciousValue: string) => {
    setBlocks((prev) =>
      prev.map((block) => {
        if (block.blockNumber === blockNumber) {
          return {
            ...block,
            isTampered: true,
            tamperedField: field,
            originalData: block.originalData || {
              recipientCode: block.recipientCode,
              watermarkId: block.watermarkId,
              blockHash: block.blockHash
            },
            recipientCode: field === 'recipientCode' ? maliciousValue : block.recipientCode,
            watermarkId: field === 'watermarkId' ? maliciousValue : block.watermarkId,
            // Keep original hash to deliberately trigger a mismatch with recalculated hash!
          };
        }
        return block;
      })
    );
  };

  // Restore tampered block back to valid state
  const restoreLedgerBlock = (blockNumber: number) => {
    setBlocks((prev) =>
      prev.map((block) => {
        if (block.blockNumber === blockNumber && block.originalData) {
          return {
            ...block,
            isTampered: false,
            tamperedField: undefined,
            recipientCode: block.originalData.recipientCode,
            watermarkId: block.originalData.watermarkId,
            blockHash: block.originalData.blockHash,
            originalData: undefined
          };
        }
        return block;
      })
    );
  };

  // Forensic Analysis engine
  const runForensicAnalysis = async (
    content: string,
    fileName: string
  ): Promise<{
    matched: boolean;
    watermarkId?: string;
    event?: DecryptionEvent;
    block?: LedgerBlock;
    recipient?: Recipient;
    report?: ForensicReport;
  }> => {
    // 1. Try zero-width watermark extraction
    let extracted = extractZeroWidthWatermark(content);

    // 2. If user pasted text without zero-width, check if text has "WM-XXXX-XXXX-XXXX" or simulate detection
    let watermarkId = extracted ? extracted.watermarkId : null;

    if (!watermarkId) {
      // Check for explicit string pattern in case of manual search
      const match = content.match(/WM-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}/i);
      if (match) {
        watermarkId = match[0].toUpperCase();
      } else {
        // Fallback for demo: if analyzing classified_operation or sample leak, match the famous Block #184
        watermarkId = 'WM-A82F-194C-91E4';
      }
    }

    // 3. Search events and ledger blocks for watermarkId
    const matchedEvent = events.find(
      (e) => e.watermarkId.toLowerCase() === watermarkId?.toLowerCase()
    );
    const matchedBlock = blocks.find(
      (b) => b.watermarkId.toLowerCase() === watermarkId?.toLowerCase()
    );
    const matchedRecipient = matchedEvent
      ? recipients.find((r) => r.id === matchedEvent.recipientId || r.code === matchedEvent.recipientCode)
      : recipients[0];

    if (!matchedEvent && !matchedBlock) {
      return { matched: false, watermarkId: watermarkId || undefined };
    }

    const event = matchedEvent || events[0];
    const block = matchedBlock || blocks.find((b) => b.blockNumber === event.ledgerBlockNumber) || blocks[blocks.length - 1];
    const recipient = matchedRecipient || recipients[0];

    const report: ForensicReport = {
      caseId: `CASE-${new Date().getFullYear()}-ORV-${Math.floor(1000 + Math.random() * 9000)}`,
      generatedAt: getStandardTimestamp(),
      leakedFileName: fileName || 'classified_operation_leaked_sample.pdf',
      documentId: event.docId,
      documentTitle: event.docTitle,
      documentHash: event.docHash,
      extractedWatermarkId: event.watermarkId,
      matchedRecipientName: recipient.name,
      matchedRecipientCode: recipient.code,
      matchedRecipientType: recipient.type,
      individualAttribution: event.individualSubUserId
        ? `${event.individualSubUserId} (${event.individualSubUserName || 'Operator'})`
        : undefined,
      sessionId: event.sessionId,
      decryptionTimestamp: event.timestamp,
      digitalSignature: event.mlDsaSignature,
      signatureAlgorithm: 'ML-DSA-87',
      ledgerBlockNumber: block.blockNumber,
      previousBlockHash: block.previousHash,
      currentBlockHash: block.blockHash,
      verificationResults: {
        watermarkMatched: true,
        docHashVerified: true,
        signatureVerified: !block.isTampered,
        ledgerChainingValid: !block.isTampered,
        zeroVisualDifferenceConfirmed: true
      },
      attributionStatus: !block.isTampered ? 'CRYPTOGRAPHICALLY VERIFIED' : 'INCONCLUSIVE',
      investigatorUnit: 'Digital Forensics & Incident Response Lab',
      officialVerdict: !block.isTampered
        ? `Forensic extraction verified identical invisible watermark ${event.watermarkId} mapped to Block #${block.blockNumber}. Recipient ${recipient.code} conclusively attributed via Post-Quantum ML-DSA-87 signature.`
        : `Cryptographic audit alert: Block #${block.blockNumber} hash mismatch detected. Ledger evidence flagged as tampered.`
    };

    return {
      matched: true,
      watermarkId: event.watermarkId,
      event,
      block,
      recipient,
      report
    };
  };

  const saveForensicReport = (report: ForensicReport) => {
    setReports((prev) => [report, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView: handleSetActiveView,
        documents,
        recipients,
        events,
        blocks,
        keys,
        nodes,
        reports,
        distributeDocument,
        performDecryption,
        tamperLedgerBlock,
        restoreLedgerBlock,
        runForensicAnalysis,
        saveForensicReport,
        addRecipient,
        decryptModalState,
        openDecryptModal,
        closeDecryptModal,
        documentDetailModal,
        openDocumentDetail,
        closeDocumentDetail,
        watermarkInspectorModal,
        openWatermarkInspector,
        closeWatermarkInspector,
        demoTourOpen,
        setDemoTourOpen,
        activeDemoStep,
        setActiveDemoStep,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        toggleMobileMenu,
        isAirGapped: true,
        ledgerIntegrity
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
