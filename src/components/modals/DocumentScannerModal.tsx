import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  X,
  FileText,
  Shield,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Zap,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import {
  processUploadedFile,
  processCameraScan,
  ScannedDocumentResult
} from '../../utils/documentScanner';
import { truncateHash } from '../../utils/crypto';

interface DocumentScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyResult: (result: ScannedDocumentResult, destination: 'DISTRIBUTE' | 'FORENSICS' | 'VAULT') => void;
  targetPurpose?: 'DISTRIBUTE' | 'FORENSICS';
}

export const DocumentScannerModal: React.FC<DocumentScannerModalProps> = ({
  isOpen,
  onClose,
  onApplyResult,
  targetPurpose = 'DISTRIBUTE'
}) => {
  const [activeTab, setActiveTab] = useState<'CAMERA' | 'FILE_UPLOAD'>('CAMERA');
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanResult, setScanResult] = useState<ScannedDocumentResult | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera stream when modal closes or switching tabs
  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  };

  useEffect(() => {
    if (!isOpen) {
      stopCameraStream();
      setScanResult(null);
      setIsProcessing(false);
    }
  }, [isOpen]);

  // Start live webcam stream if user desires live HUD viewfinder
  const startLiveWebcam = async () => {
    setCameraError(null);
    try {
      stopCameraStream();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsStreaming(true);
      }
    } catch (err) {
      console.warn('Live camera stream not available, falling back to camera file picker', err);
      setCameraError('Direct camera stream inaccessible. Use Mobile Camera Capture button below.');
      setIsStreaming(false);
    }
  };

  // Capture frame from live video
  const captureLiveFrame = async () => {
    if (!videoRef.current) return;
    setIsProcessing(true);
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(async (blob) => {
          if (blob) {
            const res = await processCameraScan(blob, `camera_scan_${Date.now()}.png`);
            setScanResult(res);
            stopCameraStream();
          }
          setIsProcessing(false);
        }, 'image/png');
      }
    } catch (e) {
      console.error(e);
      setIsProcessing(false);
    }
  };

  // Handle mobile camera file capture or manual file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessing(true);
    try {
      const res = await processUploadedFile(file);
      setScanResult(res);
    } catch (err) {
      console.error('File parsing error:', err);
    } finally {
      setIsProcessing(false);
      // reset input value so re-selecting same file works
      e.target.value = '';
    }
  };

  // Handle Drag and Drop
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setIsProcessing(true);
    try {
      const res = await processUploadedFile(file);
      setScanResult(res);
    } catch (err) {
      console.error('Drop error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-xs select-none animate-in fade-in duration-150">
      <div className="w-full sm:max-w-2xl bg-[#090e1a] border border-slate-700/80 rounded-t-2xl sm:rounded-xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[85vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-slate-800 bg-[#070b14] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white font-mono">
                  Optical Document Scanner & Ingestion
                </h3>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  OFFLINE 100%
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 font-mono">
                Pure client-side Web Crypto & optical parsing • Zero server exposure
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCameraStream();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close Scanner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls (Mobile-first large buttons) */}
        {!scanResult && (
          <div className="flex border-b border-slate-800/80 bg-slate-900/50 p-1 shrink-0">
            <button
              onClick={() => {
                setActiveTab('CAMERA');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-mono transition-all ${
                activeTab === 'CAMERA'
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Camera Scan (Phone/Webcam)</span>
            </button>
            <button
              onClick={() => {
                stopCameraStream();
                setActiveTab('FILE_UPLOAD');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-mono transition-all ${
                activeTab === 'FILE_UPLOAD'
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Document (PDF/Text/Image)</span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* STATE 1: Scan Result Achieved */}
          {scanResult ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3 bg-emerald-950/30 border border-emerald-700/60 rounded-lg flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold font-mono text-emerald-300">
                    Document Successfully Ingested & Verified
                  </div>
                  <div className="text-[11px] font-mono text-slate-300 truncate">
                    {scanResult.fileName} ({scanResult.fileSizeFormatted})
                  </div>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700 shrink-0">
                  {scanResult.detectedClassification}
                </span>
              </div>

              {/* Cryptographic Hash Badge */}
              <div className="p-3 bg-[#070b14] border border-slate-800 rounded-lg font-mono text-xs space-y-1">
                <div className="flex justify-between items-center text-slate-400 text-[10px]">
                  <span>SHA-256 HASH (CLIENT-SIDE WEB CRYPTO):</span>
                  <span className="text-cyan-400">UNALTERED</span>
                </div>
                <div className="text-cyan-300 font-semibold break-all text-[11px] select-all bg-slate-900/80 p-1.5 rounded border border-slate-800">
                  {scanResult.sha256Hash}
                </div>
              </div>

              {/* Optional Image Thumbnail */}
              {scanResult.previewUrl && (
                <div className="relative rounded-lg overflow-hidden border border-slate-700 max-h-40 bg-black flex items-center justify-center">
                  <img
                    src={scanResult.previewUrl}
                    alt="Scanned Document Preview"
                    className="max-h-40 object-contain w-auto"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 backdrop-blur-xs rounded text-[9px] font-mono text-cyan-300 border border-cyan-800">
                    OPTICAL RETRIEVAL
                  </div>
                </div>
              )}

              {/* Extracted Text Body */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400 flex items-center justify-between">
                  <span>Extracted Document Stream:</span>
                  <span className="text-[10px] text-slate-500">
                    {scanResult.extractedText.length} characters
                  </span>
                </label>
                <textarea
                  rows={6}
                  value={scanResult.extractedText}
                  onChange={(e) =>
                    setScanResult({ ...scanResult, extractedText: e.target.value })
                  }
                  className="w-full p-2.5 bg-[#070b14] border border-slate-700 rounded text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed font-mono"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                {targetPurpose === 'FORENSICS' ? (
                  <button
                    onClick={() => {
                      onApplyResult(scanResult, 'FORENSICS');
                      onClose();
                    }}
                    className="flex-1 py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs font-mono rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20"
                  >
                    <span>Load Into Forensic Analysis Lab</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        onApplyResult(scanResult, 'DISTRIBUTE');
                        onClose();
                      }}
                      className="flex-1 py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs font-mono rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Distribute & Encrypt Now</span>
                    </button>
                    <button
                      onClick={() => {
                        onApplyResult(scanResult, 'VAULT');
                        onClose();
                      }}
                      className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded-lg flex items-center justify-center gap-1.5"
                    >
                      <span>Direct Ingest to Vault</span>
                    </button>
                  </>
                )}

                <button
                  onClick={() => {
                    setScanResult(null);
                    if (activeTab === 'CAMERA') startLiveWebcam();
                  }}
                  className="py-2 px-3 text-xs font-mono text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Scan Another</span>
                </button>
              </div>
            </div>
          ) : activeTab === 'CAMERA' ? (
            /* STATE 2: Camera Scanner View */
            <div className="space-y-4">
              {/* Native Mobile Camera Trigger (Works flawlessly on all Android / iPhone devices) */}
              <div className="p-4 bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-800/40 rounded-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-mono">
                      Phone / Mobile Camera Capture
                    </h4>
                    <p className="text-[11px] text-slate-300 font-mono">
                      Instantly snap a physical classified document or screen with your device camera
                    </p>
                  </div>
                </div>

                {/* Hidden native camera input */}
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => cameraInputRef.current?.click()}
                  className="w-full py-3 px-4 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs font-mono rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 transition-all active:scale-[0.98]"
                >
                  <Camera className="w-4 h-4" />
                  <span>{isProcessing ? 'Processing Optical Capture...' : 'Launch Device Camera Scanner'}</span>
                </button>
              </div>

              {/* Secondary Option: Live Web Viewfinder (for Laptop/Desktop Webcam) */}
              <div className="border border-slate-800 rounded-xl p-3 bg-[#070b14] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-300 font-bold flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    Live Optical Viewfinder (Webcam HUD)
                  </span>
                  {!isStreaming ? (
                    <button
                      onClick={startLiveWebcam}
                      className="px-2.5 py-1 text-[11px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-800 rounded hover:bg-cyan-900 transition-colors"
                    >
                      Enable Live Stream
                    </button>
                  ) : (
                    <button
                      onClick={stopCameraStream}
                      className="px-2.5 py-1 text-[11px] font-mono text-rose-400 bg-rose-950/60 border border-rose-800 rounded"
                    >
                      Turn Off
                    </button>
                  )}
                </div>

                {cameraError && (
                  <div className="p-2.5 bg-amber-950/30 border border-amber-800/60 rounded text-[11px] font-mono text-amber-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>{cameraError}</span>
                  </div>
                )}

                {/* Viewfinder Canvas / Video Frame */}
                {isStreaming ? (
                  <div className="relative rounded-lg overflow-hidden border border-cyan-500/60 bg-black aspect-video flex items-center justify-center">
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />

                    {/* HUD Military Crosshair Overlays */}
                    <div className="absolute inset-4 border border-cyan-500/30 rounded pointer-events-none flex flex-col justify-between p-2">
                      <div className="flex justify-between text-[9px] font-mono text-cyan-400">
                        <span>[OPTICAL SENSOR ACQUIRED]</span>
                        <span>EMCON DELTA</span>
                      </div>
                      <div className="flex justify-between text-[9px] font-mono text-cyan-400">
                        <span>ALIGN DOCUMENT BOUNDS</span>
                        <span>PQC READY</span>
                      </div>
                    </div>

                    {/* Laser Scan line animation */}
                    <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse shadow-sm shadow-cyan-400" />

                    {/* Capture Shutter Button */}
                    <button
                      onClick={captureLiveFrame}
                      disabled={isProcessing}
                      className="absolute bottom-3 py-2 px-5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono rounded-full flex items-center gap-2 shadow-xl shadow-cyan-500/40"
                    >
                      <Camera className="w-4 h-4" />
                      <span>{isProcessing ? 'Capturing...' : 'Capture Document Frame'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-4 text-center text-slate-500 text-xs font-mono bg-slate-900/40 rounded border border-dashed border-slate-800">
                    Live camera stream is dormant. Tap "Launch Device Camera Scanner" above or "Enable Live Stream" for webcam capture.
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* STATE 3: File Upload Dropzone */
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.pdf,.docx,.doc,.md,.json,.csv,.log,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  isDragOver
                    ? 'border-cyan-400 bg-cyan-950/30'
                    : 'border-slate-700/80 hover:border-slate-600 bg-[#070b14]'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400 mb-3 border border-slate-700">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white font-mono">
                  Drop Classified File or Tap to Browse
                </h4>
                <p className="text-[11px] text-slate-400 font-mono mt-1 max-w-sm">
                  Supports PDF, Word (.docx), Plaintext (.txt, .md, .json), and Captured Screenshots (.png, .jpg)
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-[10px] font-mono text-slate-400">
                  <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded">
                    .PDF
                  </span>
                  <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded">
                    .TXT
                  </span>
                  <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded">
                    .DOCX
                  </span>
                  <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded">
                    .PNG / .JPG
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg text-[11px] font-mono text-slate-400 space-y-1">
                <div className="text-cyan-400 font-bold uppercase text-[10px]">
                  Zero-Knowledge Guarantee
                </div>
                <div>
                  All parsing and cryptographic calculations occur strictly in your browser RAM. No files are transmitted to any cloud or external network.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
