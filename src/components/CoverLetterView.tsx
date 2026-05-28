/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { Edit3, Check, X, FileText, Send, SquarePen, Save } from "lucide-react";

export const CoverLetterView: React.FC = () => {
  const { coverLetter, updateCoverLetter, isSandboxMode, profile } = usePortfolio();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editRecipient, setEditRecipient] = useState(coverLetter.recipient);
  const [editBody, setEditBody] = useState(coverLetter.body);

  useEffect(() => {
    setEditRecipient(coverLetter.recipient);
    setEditBody(coverLetter.body);
  }, [coverLetter]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateCoverLetter({
      recipient: editRecipient,
      body: editBody
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-[#02040a] py-16 border-b border-white/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400 animate-pulse" />
              {profile.coverLetterTitle || "Corporate Cover Letter"}
            </h3>
          </div>

          {isSandboxMode && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg transition-all border cursor-pointer no-print ${
                isEditing 
                  ? "bg-white/5 text-slate-350 border-white/10 hover:bg-white/10"
                  : "bg-cyan-500/10 text-cyan-400 border-cyan-500/25 hover:bg-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]"
              }`}
            >
              {isEditing ? (
                <>
                  <X className="w-3.5 h-3.5" /> Cancel
                </>
              ) : (
                <>
                  <SquarePen className="w-3.5 h-3.5" /> Customize Letter
                </>
              )}
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="bg-slate-950/90 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4 animate-slideIn no-print">
            <h4 className="font-semibold text-xs font-mono text-cyan-400 uppercase">
              REWRITE COVER LETTER INSTRUCTIONS
            </h4>
            
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Addressed To (Recipient)</label>
              <input 
                type="text" 
                required
                value={editRecipient}
                onChange={(e) => setEditRecipient(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-900 border border-white/10 text-slate-200 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Letter Content (Markdown-capable spacing)</label>
              <textarea 
                rows={16}
                required
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                className="w-full text-xs p-3 bg-slate-900 border border-white/10 text-slate-200 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 outline-hidden font-mono leading-relaxed"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-white/10">
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="text-xs px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="text-xs px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold rounded-lg flex items-center gap-1.5 cursor-pointer font-semibold hover:opacity-95 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" /> Save Letter
              </button>
            </div>
          </form>
        ) : (
          /* High-Fidelity Official Letterhead Layout */
          <div className="relative bg-slate-950/40 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl hover:border-cyan-500/30 transition-shadow duration-300 font-sans text-slate-200 leading-relaxed selection:bg-cyan-500/30">
            {/* Elegant Header Accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-t-3xl shadow-[0_0_15px_rgba(6,182,212,0.4)]" />
            
            {/* Top Contact Watermark */}
            <div className="flex flex-col sm:flex-row justify-between border-b border-white/5 pb-6 mb-8 gap-4 font-mono">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block">SENDER</span>
                <span className="text-xs font-semibold text-white block mt-1">Anadhi Sharma</span>
                <span className="text-[11px] text-slate-400 block">asharma9albs@gmail.com</span>
              </div>
            </div>

            {/* Address Line */}
            <p className="font-bold text-white mb-6 font-display">
              {coverLetter.recipient}
            </p>

            {/* Letter Body Body splits lines correctly into readable paragraph flows */}
            <div className="space-y-5 text-slate-300 text-[14px] leading-relaxed md:text-base font-sans font-light">
              {coverLetter.body.split("\n\n").map((para, idx) => {
                if (!para.trim()) return null;
                // If it looks like signature skip padding logic, or print cleanly
                const isSignature = para.toLowerCase().startsWith("cheers") || para.toLowerCase().startsWith("sincerely") || para.toLowerCase().includes("anadhi");
                return (
                  <p 
                    key={idx} 
                    className={isSignature ? "pt-4 font-normal text-white" : ""}
                  >
                    {para}
                  </p>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
