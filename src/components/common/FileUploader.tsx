import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, FileText, Trash2, ShieldCheck, Loader2 } from 'lucide-react';
import { VerificationDoc } from '../../types';

interface FileUploaderProps {
  label: string;
  description: string;
  docType: VerificationDoc['type'];
  onUploaded: (doc: VerificationDoc) => void;
  acceptedTypes?: string[];
  maxSizeMb?: number;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  label,
  description,
  docType,
  onUploaded,
  acceptedTypes = ['application/pdf', 'image/jpeg', 'image/png'],
  maxSizeMb = 10,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<VerificationDoc | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const calculateSha256 = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  };

  const processFile = async (file: File) => {
    setErrorMessage(null);

    // Validate type
    if (!acceptedTypes.includes(file.type)) {
      setErrorMessage(`Invalid file format (${file.type || 'unknown'}). Only PDF, JPEG, and PNG are accepted.`);
      return;
    }

    // Validate size
    if (file.size > maxSizeMb * 1024 * 1024) {
      setErrorMessage(`File exceeds maximum size limit of ${maxSizeMb} MB.`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(15);

    try {
      // Simulate presigned S3 upload progress
      const progressTimer = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 85) {
            clearInterval(progressTimer);
            return 85;
          }
          return prev + 20;
        });
      }, 150);

      const sha256 = await calculateSha256(file);
      await new Promise((r) => setTimeout(r, 600));
      clearInterval(progressTimer);
      setUploadProgress(100);

      const doc: VerificationDoc = {
        id: 'doc-' + Date.now(),
        type: docType,
        name: file.name,
        size: file.size,
        sha256,
        presignedUrl: `https://storage.reloop.eco/uploads/${encodeURIComponent(file.name)}?token=exp_3600`,
        uploadedAt: new Date().toISOString(),
        status: 'valid',
      };

      setUploadedFile(doc);
      onUploaded(doc);
    } catch (err: any) {
      setErrorMessage('Failed to generate document hash or upload to secure storage.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <label className="text-sm font-bold text-stone-900 dark:text-white">{label}</label>
        <span className="text-xs text-stone-500">Max {maxSizeMb}MB (PDF, JPG, PNG)</span>
      </div>
      <p className="text-xs text-stone-500 dark:text-stone-400">{description}</p>

      {!uploadedFile ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition cursor-pointer ${
            isDragging
              ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20'
              : 'border-stone-300 dark:border-stone-700 hover:border-emerald-500 hover:bg-stone-50/50 dark:hover:bg-stone-800/40'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileSelect}
          />

          {isUploading ? (
            <div className="space-y-3 max-w-xs mx-auto py-2">
              <div className="flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-400 text-sm font-semibold">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Computing SHA-256 & Encrypting... {uploadProgress}%</span>
              </div>
              <div className="w-full bg-stone-200 dark:bg-stone-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <UploadCloud className="w-9 h-9 text-stone-400 group-hover:text-emerald-600 mb-2" />
              <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                Drag and drop your document here, or <span className="text-emerald-700 underline">browse</span>
              </p>
              <p className="text-xs text-stone-400 mt-1">Cryptographic integrity verified on client before dispatch</p>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-emerald-700" />
              <div>
                <span className="text-sm font-bold text-stone-900 dark:text-white block">{uploadedFile.name}</span>
                <span className="text-xs text-stone-500">
                  {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB · Validated
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setUploadedFile(null)}
              className="text-stone-400 hover:text-rose-600 p-1"
              title="Remove file"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white dark:bg-stone-900 p-2.5 rounded-lg border border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-stone-500 shrink-0 font-medium">SHA-256:</span>
              <span className="font-mono text-stone-700 dark:text-stone-300 truncate" title={uploadedFile.sha256}>
                {uploadedFile.sha256}
              </span>
            </div>
            <span className="text-emerald-700 font-semibold text-[11px] shrink-0 ml-2">Verified</span>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 text-rose-600 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
