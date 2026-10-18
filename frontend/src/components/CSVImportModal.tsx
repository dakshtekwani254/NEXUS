"use client";

import React, { useState } from "react";
import { X, Upload, FileText, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onImportSuccess?: () => void;
}

export const CSVImportModal: React.FC<CSVImportModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onImportSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{
    imported_count: number;
    errors: string[];
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setErrorMsg(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setErrorMsg(null);
    try {
      const res = await api.importCSV(file);
      setResult(res);
      if (res.imported_count > 0) {
        if (onSuccess) onSuccess();
        if (onImportSuccess) onImportSuccess();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to process CSV file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111722] border border-[#242D3D] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#242D3D] flex items-center justify-between bg-[#0C1019]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#25D9D0]/20 text-[#25D9D0] border border-[#25D9D0]/30">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#F1F5F9]">Import Shipments via CSV</h2>
              <p className="text-xs text-[#8D9AAF]">Bulk ingest logistics manifests with validation</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#8D9AAF] hover:text-[#F1F5F9]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-[#FF5252]/15 border border-[#FF5252]/30 text-xs text-[#FF5252] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Upload Area */}
          <div className="border-2 border-dashed border-[#242D3D] hover:border-[#4F8CFF] rounded-xl p-6 text-center transition cursor-pointer bg-[#0C1019]/60">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-file-input"
            />
            <label htmlFor="csv-file-input" className="cursor-pointer flex flex-col items-center">
              <FileText className="w-8 h-8 text-[#4F8CFF] mb-2" />
              <span className="text-xs font-semibold text-[#F1F5F9]">
                {file ? file.name : "Click to select CSV or drag and drop"}
              </span>
              <span className="text-[10px] text-[#8D9AAF] mt-1">
                Supported columns: tracking_ref, origin, destination, carrier, departure_date, expected_arrival, delivery_deadline, value_usd
              </span>
            </label>
          </div>

          {/* Result Feedback */}
          {result && (
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-[#38D996]/15 border border-[#38D996]/30 text-xs text-[#38D996] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Successfully imported {result.imported_count} shipments into risk engine.</span>
              </div>
              {result.errors.length > 0 && (
                <div className="p-3 rounded-lg bg-[#FFB547]/15 border border-[#FFB547]/30 text-xs text-[#FFB547] space-y-1">
                  <div className="font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Encountered {result.errors.length} validation errors:</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                    {result.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Sample CSV Format Preview */}
          <div className="p-3 rounded-lg bg-[#0C1019] border border-[#242D3D] text-[10px] font-mono text-[#8D9AAF]">
            <span className="text-[#25D9D0] block mb-1">SAMPLE CSV HEADER:</span>
            tracking_ref,origin,destination,carrier,departure_date,expected_arrival,delivery_deadline,value_usd,cargo_description
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#242D3D] flex items-center justify-end gap-3 bg-[#0C1019]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#242D3D] hover:bg-[#2D394D] text-xs font-semibold text-[#F1F5F9] transition"
          >
            Close
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="px-4 py-2 rounded-lg bg-[#4F8CFF] hover:bg-[#3D78E6] text-white text-xs font-semibold shadow-sm transition disabled:opacity-50 flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{uploading ? "Ingesting..." : "Import Manifest"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
