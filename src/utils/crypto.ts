/**
 * Cryptographic utility layer for Secure Document Provenance
 * Implements Web Crypto SHA-256, Zero-Width Invisible Watermarking,
 * and Post-Quantum cryptographic primitives simulation (ML-KEM-1024, ML-DSA-87).
 */

// Compute true SHA-256 hash using the Web Crypto API
export async function calculateSha256(input: string | Uint8Array): Promise<string> {
  let data: Uint8Array;
  if (typeof input === 'string') {
    data = new TextEncoder().encode(input);
  } else {
    data = input;
  }
  const hashBuffer = await crypto.subtle.digest('SHA-256', data.buffer as ArrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate realistic pseudo-cryptographic hash for demonstration consistency
export function generateHash(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `${hex}${seed.length.toString(16).padStart(4, '0')}7f4a2b9c3e1d6805`.slice(0, 64);
}

// Invisible Zero-Width Unicode Steganography
// Encodes binary data into zero-width characters that render completely invisibly:
// \u200B = Zero-Width Space (bit 0)
// \u200C = Zero-Width Non-Joiner (bit 1)
// \u200D = Zero-Width Joiner (delimiter)
// \uFEFF = Zero-Width No-Break Space (sentinel marker)

const ZW_ZERO = '\u200B';
const ZW_ONE = '\u200C';
const ZW_DELIM = '\u200D';
const ZW_SENTINEL = '\uFEFF';

export function injectZeroWidthWatermark(plainText: string, watermarkId: string, sessionId: string): string {
  const payload = `ORV-WM::${watermarkId}::${sessionId}`;
  
  // Convert payload string to binary string
  let binaryString = '';
  for (let i = 0; i < payload.length; i++) {
    const code = payload.charCodeAt(i);
    binaryString += code.toString(2).padStart(8, '0');
  }

  // Convert binary to zero-width sequence
  let zwSequence = ZW_SENTINEL;
  for (let i = 0; i < binaryString.length; i++) {
    zwSequence += binaryString[i] === '1' ? ZW_ONE : ZW_ZERO;
  }
  zwSequence += ZW_SENTINEL;

  // Invisibly inject sequence after the first punctuation or space in the text
  const splitIndex = plainText.indexOf(' ');
  if (splitIndex !== -1) {
    return plainText.slice(0, splitIndex) + zwSequence + plainText.slice(splitIndex);
  }
  return zwSequence + plainText;
}

export function extractZeroWidthWatermark(textWithWatermark: string): { watermarkId: string; sessionId: string } | null {
  const startIdx = textWithWatermark.indexOf(ZW_SENTINEL);
  if (startIdx === -1) return null;

  const nextSentinel = textWithWatermark.indexOf(ZW_SENTINEL, startIdx + 1);
  if (nextSentinel === -1) return null;

  const zwData = textWithWatermark.substring(startIdx + 1, nextSentinel);
  let binary = '';
  for (let i = 0; i < zwData.length; i++) {
    const char = zwData[i];
    if (char === ZW_ONE) binary += '1';
    else if (char === ZW_ZERO) binary += '0';
  }

  if (binary.length % 8 !== 0 || binary.length === 0) return null;

  let decoded = '';
  for (let i = 0; i < binary.length; i += 8) {
    const byteStr = binary.substring(i, i + 8);
    decoded += String.fromCharCode(parseInt(byteStr, 2));
  }

  const parts = decoded.split('::');
  if (parts.length >= 3 && (parts[0] === 'ORV-WM' || parts[0] === 'SDP-WM' || parts[0] === 'CT-WM')) {
    return {
      watermarkId: parts[1],
      sessionId: parts[2]
    };
  }

  return null;
}

// Generate Post-Quantum ML-DSA Signature simulation
export function generateMlDsaSignature(
  docHash: string,
  recipientCode: string,
  sessionId: string,
  watermarkId: string
): string {
  // Realistic ML-DSA-87 signature representation (3309 bytes standard in NIST FIPS 204)
  const seed = `${docHash}:${recipientCode}:${sessionId}:${watermarkId}`;
  let sigBase = '';
  for (let i = 0; i < 4; i++) {
    sigBase += Math.abs(Math.sin(i + seed.length) * 1e16).toString(16).replace('.', '');
  }
  return `0xMLDSA87_${sigBase.slice(0, 48)}...${docHash.slice(0, 16)}_SIG_NIST_FIPS_204`;
}

// Verify Post-Quantum ML-DSA Signature simulation
export function verifyMlDsaSignature(
  signature: string,
  docHash: string,
  recipientCode: string,
  isTampered: boolean = false
): boolean {
  if (isTampered) return false;
  if (!signature.startsWith('0xMLDSA87_')) return false;
  return signature.includes(docHash.slice(0, 16));
}

// Calculate block hash based on cryptographic properties
export async function computeBlockHash(
  blockNumber: number,
  previousHash: string,
  eventId: string,
  docHash: string,
  recipientCode: string,
  watermarkId: string,
  signature: string
): Promise<string> {
  const blockHeader = `${blockNumber}:${previousHash}:${eventId}:${docHash}:${recipientCode}:${watermarkId}:${signature}`;
  return await calculateSha256(blockHeader);
}

// Helper to format short hash
export function truncateHash(hash: string, start: number = 8, end: number = 8): string {
  if (!hash) return '';
  if (hash.length <= start + end) return hash;
  return `${hash.slice(0, start)}...${hash.slice(-end)}`;
}

// Generate human-readable timestamp
export function getStandardTimestamp(): string {
  const now = new Date();
  const day = now.getUTCDate().toString().padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[now.getUTCMonth()];
  const year = now.getUTCFullYear();
  const hours = now.getUTCHours().toString().padStart(2, '0');
  const minutes = now.getUTCMinutes().toString().padStart(2, '0');
  const seconds = now.getUTCSeconds().toString().padStart(2, '0');
  return `${day} ${month} ${year} — ${hours}:${minutes}:${seconds} UTC`;
}
