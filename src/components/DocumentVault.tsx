/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { DocumentAttachment } from "../types";
import { 
  FilePlus, UploadCloud, X, ArrowUpRight, Download, FileText, Trash2, 
  CheckCircle, Database, HelpCircle, FileDown, ShieldCheck, RefreshCw, FileImage, Edit3, Check
} from "lucide-react";

export const DocumentVault: React.FC = () => {
  const { documents, saveDocument, deleteDocument, isAdmin, isSandboxMode, profile, updateProfile } = usePortfolio();

  // Dialog / upload control states
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [newDocCategory, setNewDocCategory] = useState<"Resume" | "Cover Letter" | "Thesis" | "Other">("Other");
  const [newDocName, setNewDocName] = useState("");
  const [selectedFileContent, setSelectedFileContent] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedFileType, setSelectedFileType] = useState("");
  const [selectedFileSize, setSelectedFileSize] = useState("");

  const [filterCategory, setFilterCategory] = useState<string>("All");

  // Header editing state
  const [isEditingHeaders, setIsEditingHeaders] = useState(false);
  const [vaultTitle, setVaultTitle] = useState("");

  const startEditingHeaders = () => {
    setVaultTitle(profile.documentVaultTitle || "Executive Document & Attachment Vault");
    setIsEditingHeaders(true);
  };

  const handleSaveHeaders = async () => {
    await updateProfile({
      documentVaultTitle: vaultTitle
    });
    setIsEditingHeaders(false);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag handles
  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result;
      if (typeof result === "string") {
        setSelectedFileContent(result);
        setSelectedFileName(file.name);
        setSelectedFileType(file.type || "application/octet-stream");
        
        // Format size
        const kb = file.size / 1024;
        const sizeStr = kb > 1024 
          ? `${(kb / 1024).toFixed(1)} MB` 
          : `${kb.toFixed(0)} KB`;
        setSelectedFileSize(sizeStr);
        
        // Auto-fill title if empty
        if (!newDocName) {
          setNewDocName(file.name.replace(/\.[^/.]+$/, ""));
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleResetForm = () => {
    setSelectedFileContent(null);
    setSelectedFileName("");
    setSelectedFileType("");
    setSelectedFileSize("");
    setNewDocName("");
    setNewDocCategory("Other");
    setIsUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFileContent || !newDocName) return;

    const newDoc: DocumentAttachment = {
      id: `doc-${Date.now()}`,
      name: `${newDocName}.${selectedFileName.split(".").pop() || "bin"}`,
      category: newDocCategory,
      fileUrl: selectedFileContent,
      fileType: selectedFileType,
      uploadedAt: new Date().toISOString(),
      size: selectedFileSize
    };

    await saveDocument(newDoc);
    handleResetForm();
  };

  const getIconForDoc = (category: string) => {
    switch(category) {
      case "Resume":
        return <FileText className="w-5 h-5 text-cyan-400" />;
      case "Cover Letter":
        return <FileDown className="w-5 h-5 text-amber-400" />;
      case "Thesis":
        return <Database className="w-5 h-5 text-emerald-400" />;
      default:
        return <FileImage className="w-5 h-5 text-blue-400" />;
    }
  };

  const filteredDocs = filterCategory === "All" 
    ? documents 
    : documents.filter(d => d.category === filterCategory);

  return (
    <div className="bg-[#02040a] py-14 border-t border-white/5 select-none md:select-text">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        
        {/* Title Header with Cyber Accents */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-5 mb-8 gap-4">
          {isEditingHeaders ? (
            <div className="w-full max-w-xl bg-slate-900 border border-cyan-500/30 p-4 rounded-xl space-y-3 shadow-lg no-print">
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase font-mono mb-1">Document Vault Title</label>
                <input
                  type="text"
                  value={vaultTitle}
                  onChange={(e) => setVaultTitle(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-950 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden font-display font-bold"
                />
              </div>
              <div className="flex gap-2 justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditingHeaders(false)}
                  className="px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveHeaders}
                  className="px-2.5 py-1 text-[11px] bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3 h-3" /> Save Headers
                </button>
              </div>
            </div>
          ) : (
            <div className="relative group/head">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                <h2 className="text-2xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-cyan-400 tracking-tight">
                  {profile.documentVaultTitle || "Executive Document & Attachment Vault"}
                </h2>
                {isSandboxMode && (
                  <button
                    onClick={startEditingHeaders}
                    className="opacity-100 md:opacity-0 md:group-hover/head:opacity-100 transition-opacity p-1 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-cyan-400 border border-white/10 rounded-md cursor-pointer no-print flex items-center gap-1"
                    title="Edit Section Headers"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span className="text-[10px] uppercase font-mono md:hidden">Edit Headers</span>
                  </button>
                )}
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2.5 no-print">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 bg-white/5 border border-white/10 p-1.5 rounded-xl text-xs font-mono">
              {["All", "Resume", "Cover Letter", "Thesis", "Other"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg transition-all font-semibold border cursor-pointer ${
                    filterCategory === cat 
                      ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/25 shadow-[0_0_15px_rgba(6,182,212,0.15)]" 
                      : "text-slate-400 hover:text-slate-200 border-transparent hover:bg-white/5"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {isSandboxMode && !isUploading && (
              <button
                onClick={() => setIsUploading(true)}
                className="flex items-center gap-1 text-xs font-semibold bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all font-mono px-4 py-2.5 rounded-xl shadow-lg border border-cyan-300/30 cursor-pointer"
              >
                <FilePlus className="w-3.5 h-3.5" />
                Upload File
              </button>
            )}
          </div>
        </div>

        {/* --- UPLOADER FORM OVERLAY PANEL --- */}
        {isUploading && isSandboxMode && (
          <div className="bg-slate-950/90 border border-white/10 rounded-2xl p-6 mb-8 animate-slideIn no-print shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                STAGE NEW ATTACHMENT IN VAULT
              </span>
              <button 
                onClick={handleResetForm}
                className="p-1 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div 
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                  dragActive 
                    ? "border-cyan-400 bg-cyan-500/5 shadow-[0_0_15px_rgba(6,182,212,0.1)] animate-pulse" 
                    : "border-white/15 hover:border-white/25 bg-white/2"
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={onButtonClick}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleChange}
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  className="hidden" 
                />

                {selectedFileContent ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle className="w-10 h-10 text-cyan-400 mb-2 animate-bounce" />
                    <p className="text-xs font-mono text-cyan-400 font-bold mb-1 truncate max-w-lg">
                      {selectedFileName}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {selectedFileType} • {selectedFileSize}
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFileContent(null);
                      }}
                      className="mt-3 text-[10px] text-red-400 hover:text-red-300 border border-red-500/20 px-2.5 py-1 rounded-md bg-red-500/5 hover:bg-red-500/10 transition-colors"
                    >
                      Remove selection
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <UploadCloud className="w-12 h-12 text-slate-400 animate-pulse mb-3" />
                    <p className="text-xs text-slate-300 font-medium">
                      Drag & Drop files here, or <span className="text-cyan-400 font-bold underline">browse local directory</span>
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono mt-1.5">
                      SUPPORTS PDF, DOCX, OR IMAGES UP TO 25MB
                    </p>
                  </div>
                )}
              </div>

              {selectedFileContent && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-sans font-bold text-slate-400 mb-1">Vault Display Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Anadhi Sharma Resume Spring 2026"
                      value={newDocName}
                      onChange={(e) => setNewDocName(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-900 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-sans font-bold text-slate-400 mb-1">Document Category Classification</label>
                    <select
                      value={newDocCategory}
                      onChange={(e) => setNewDocCategory(e.target.value as any)}
                      className="w-full text-xs p-2 bg-slate-900 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden h-9 font-medium cursor-pointer"
                    >
                      <option value="Resume">Resume</option>
                      <option value="Cover Letter">Cover Letter</option>
                      <option value="Thesis">Thesis Manuscript</option>
                      <option value="Other">Other Executive Brief</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-4 py-2 text-xs bg-white/5 text-slate-450 hover:bg-white/10 text-slate-300 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedFileContent}
                  className={`px-4 py-2 text-xs font-bold font-mono rounded-lg cursor-pointer ${
                    selectedFileContent 
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-black hover:opacity-95" 
                      : "bg-slate-800 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  Secure Document In Vault
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- DOCUMENTS GRID DISPLAY --- */}
        {filteredDocs.length === 0 ? (
          <div className="border border-white/5 bg-slate-950/40 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
            <Database className="w-12 h-12 text-slate-600 animate-bounce mb-3" />
            <p className="text-sm text-slate-400 font-semibold font-display">No Documents Located</p>
            <p className="text-xs text-slate-500 font-mono mt-1">THE SELECTED FILE VAULT IS EMPTY OF THE REGISTERED CATEGORY</p>
            {isSandboxMode && !isUploading && (
              <button
                onClick={() => {
                  setNewDocCategory(
                    filterCategory === "All" ? "Other" : (filterCategory as any)
                  );
                  setIsUploading(true);
                }}
                className="mt-4 flex items-center gap-1.5 text-xs font-semibold bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all font-mono px-4 py-2.5 rounded-xl shadow-lg border border-cyan-300/30 cursor-pointer"
              >
                <FilePlus className="w-3.5 h-3.5" />
                Upload {filterCategory === "All" ? "" : filterCategory} Document
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDocs.map((docItem) => (
              <div 
                key={docItem.id} 
                className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/25 p-5 rounded-2xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.06)] flex flex-col justify-between"
              >
                <div>
                  {/* Category Pill Tag and Actions */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-mono text-[10px] font-bold bg-white/5 text-slate-400 border border-white/10 px-2 py-0.5 rounded tracking-wide uppercase">
                      {docItem.category}
                    </span>
                    
                    {isSandboxMode && (
                      <button 
                        id={`delete-doc-${docItem.id}`}
                        onClick={async () => {
                          await deleteDocument(docItem.id);
                        }}
                        className="text-red-400 hover:text-red-350 p-1.5 bg-red-500/5 hover:bg-red-500/15 border border-red-500/10 hover:border-red-500/30 rounded-lg transition-all cursor-pointer no-print"
                        title="Delete Document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Header Title Information */}
                  <div className="flex gap-3">
                    <div className="p-3 bg-slate-950 rounded-xl border border-white/10 group-hover:border-cyan-500/30 transition-colors h-fit select-none">
                      {getIconForDoc(docItem.category)}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-white font-display group-hover:text-cyan-400 transition-colors truncate max-w-[190px]" title={docItem.name}>
                        {docItem.name}
                      </h4>
                      <p className="text-[10px] text-slate-450 font-mono mt-1 select-none">
                        {docItem.size || "Unknown Size"} • {new Date(docItem.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons to Download/Open */}
                <div className="mt-5 pt-3 border-t border-white/5 flex gap-2 w-full no-print">
                  <a 
                    href={docItem.fileUrl} 
                    download={docItem.name}
                    className="flex-1 select-none flex items-center justify-center gap-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 hover:border-cyan-500/40 text-xs px-3 py-2 rounded-lg transition-all font-mono font-medium cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download File
                  </a>
                  {docItem.fileUrl.startsWith("http") && (
                    <a 
                      href={docItem.fileUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-2 select-none flex items-center justify-center bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 rounded-lg transition-all cursor-pointer"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
