/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { 
  ExternalLink, ShieldCheck, SquarePen, X, BookOpen 
} from "lucide-react";

export const ThesisView: React.FC = () => {
  const { thesis, updateThesis, isSandboxMode, profile } = usePortfolio();

  // Admin edit fields
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(thesis.title);
  const [editAbstract, setEditAbstract] = useState(thesis.abstract);
  const [editLink, setEditLink] = useState(thesis.link);
  const [editPublished, setEditPublished] = useState(thesis.published);
  const [editFocus, setEditFocus] = useState(thesis.focus);

  // Communication Gap Solved Edit State Fields
  const [editCommGapSolvedTitle, setEditCommGapSolvedTitle] = useState(thesis.commGapSolvedTitle || "Communication Gap Solved");
  const [editCommGapSolvedHeading, setEditCommGapSolvedHeading] = useState(thesis.commGapSolvedHeading || "How This Experience Solves Corporate Client Bottlenecks");
  const [editCommGapSolvedDescription, setEditCommGapSolvedDescription] = useState(thesis.commGapSolvedDescription || "Most candidates are either pure atmospheric mathematicians who can't speak with a fund manager, or corporate relations advocates who don't understand convective vortexes or deep learning architecture constraints.");

  useEffect(() => {
    setEditTitle(thesis.title);
    setEditAbstract(thesis.abstract);
    setEditLink(thesis.link);
    setEditPublished(thesis.published);
    setEditFocus(thesis.focus);

    setEditCommGapSolvedTitle(thesis.commGapSolvedTitle || "Communication Gap Solved");
    setEditCommGapSolvedHeading(thesis.commGapSolvedHeading || "How This Experience Solves Corporate Client Bottlenecks");
    setEditCommGapSolvedDescription(thesis.commGapSolvedDescription || "Most candidates are either pure atmospheric mathematicians who can't speak with a fund manager, or corporate relations advocates who don't understand convective vortexes or deep learning architecture constraints.");
  }, [thesis]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateThesis({
      title: editTitle,
      abstract: editAbstract,
      link: editLink,
      published: editPublished,
      focus: editFocus,
      commGapSolvedTitle: editCommGapSolvedTitle,
      commGapSolvedHeading: editCommGapSolvedHeading,
      commGapSolvedDescription: editCommGapSolvedDescription
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-[#02040a] py-16 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        
        {/* Header Title */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400 animate-pulse" />
              {profile.thesisTitleCustom || "Machine Learning Thesis & Research"}
            </h3>
          </div>

          {isSandboxMode && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer no-print ${
                isEditing 
                  ? "bg-white/5 text-slate-350 border-white/10 hover:bg-white/10"
                  : "bg-cyan-500/10 text-cyan-400 border-cyan-500/25 hover:bg-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]"
              }`}
            >
              {isEditing ? <X className="w-3.5 h-3.5" /> : <SquarePen className="w-3.5 h-3.5" />}
              {isEditing ? "Cancel" : "Edit Thesis Meta"}
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="bg-slate-950/90 border border-white/10 rounded-2xl p-6 mb-8 gap-4 flex flex-col no-print shadow-2xl">
            <h4 className="font-semibold text-xs font-mono text-cyan-400 uppercase">
              REWRITE ACADEMIC THESIS DETAILS
            </h4>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Thesis Title</label>
              <input 
                type="text" 
                required
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full text-xs p-2 bg-slate-900 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden focus:ring-1 focus:ring-cyan-500/30"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Publisher Line</label>
                <input 
                  type="text" 
                  value={editPublished}
                  onChange={(e) => setEditPublished(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-900 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden focus:ring-1 focus:ring-cyan-500/30"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Archive PDF URL Link</label>
                <input 
                  type="text" 
                  value={editLink}
                  onChange={(e) => setEditLink(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-900 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden focus:ring-1 focus:ring-cyan-500/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Focus Core Keywords (Comma-separated)</label>
              <input 
                type="text" 
                value={editFocus}
                onChange={(e) => setEditFocus(e.target.value)}
                className="w-full text-xs p-2 bg-slate-900 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden font-mono focus:ring-1 focus:ring-cyan-500/30"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Abstract Text</label>
              <textarea 
                rows={6}
                required
                value={editAbstract}
                onChange={(e) => setEditAbstract(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-900 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden leading-relaxed focus:ring-1 focus:ring-cyan-500/30"
              />
            </div>

            {/* Communication Gap Solved Settings */}
            <div className="border-t border-white/10 pt-4 space-y-4">
              <h5 className="text-[11px] font-bold font-mono text-cyan-400 uppercase tracking-wider">
                EDIT "COMMUNICATION GAP SOLVED" ADVISORY SIGNATURE
              </h5>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Gap Box Title</label>
                  <input 
                    type="text" 
                    value={editCommGapSolvedTitle}
                    onChange={(e) => setEditCommGapSolvedTitle(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-900 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden focus:ring-1 focus:ring-cyan-500/30"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Gap Box Main Heading</label>
                  <input 
                    type="text" 
                    value={editCommGapSolvedHeading}
                    onChange={(e) => setEditCommGapSolvedHeading(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-900 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden focus:ring-1 focus:ring-cyan-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Gap Quote Description</label>
                <textarea 
                  rows={2}
                  value={editCommGapSolvedDescription}
                  onChange={(e) => setEditCommGapSolvedDescription(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-900 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden focus:ring-1 focus:ring-cyan-500/30"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-white/10">
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="text-xs px-3.5 py-1.5 bg-white/5 border border-white/10 text-slate-300 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="text-xs px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold rounded-lg hover:opacity-95 cursor-pointer"
              >
                Save Thesis
              </button>
            </div>
          </form>
        ) : (
          /* General Thesis Display */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-8">
            
            {/* Thesis Abstract Card */}
            <div className="lg:col-span-7 flex flex-col justify-between bg-slate-950/40 hover:bg-slate-950/60 border border-white/10 hover:border-cyan-500/20 p-6 md:p-8 rounded-2xl transition-all duration-300">
              <div>
                <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold px-2.5 py-1 rounded font-mono uppercase tracking-widest block w-fit">
                  {thesis.published}
                </span>

                <h4 className="text-md sm:text-lg font-bold font-display text-white tracking-tight mt-3">
                  {thesis.title}
                </h4>

                <p className="text-xs text-slate-300 mt-4 leading-relaxed line-clamp-10 md:line-clamp-none font-sans font-light">
                  <strong>Abstract:</strong> {thesis.abstract}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap gap-2 items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {thesis.focus.split(",").map((kw, i) => (
                    <span 
                      key={i}
                      className="text-[9px] font-mono font-bold bg-slate-900 border border-white/5 text-slate-400 px-2 py-0.5 rounded shadow-3xs"
                    >
                      {kw.trim()}
                    </span>
                  ))}
                </div>

                {thesis.link && (
                  <a 
                    href={thesis.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 hover:bg-white/5 px-3 py-1.5 rounded-lg font-semibold bg-white/5 transition-all shadow-3xs cursor-pointer select-none no-print-link whitespace-nowrap mt-2 sm:mt-0"
                  >
                    Read Published Paper
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Quick Context Card (Showcasing dual technical and business logic) */}
            <div className="lg:col-span-12 xl:col-span-5 flex flex-col bg-slate-950/40 hover:bg-slate-950/60 border border-white/10 hover:border-cyan-500/20 text-slate-300 p-6 md:p-8 rounded-2xl transition-all duration-300 shadow-2xl justify-center">
              <div>
                <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold px-2.5 py-1 rounded font-mono uppercase tracking-widest block w-fit mb-4">
                  {thesis.commGapSolvedTitle || "Communication Gap Solved"}
                </span>

                <h4 className="text-base font-bold font-display text-white tracking-tight leading-snug">
                  {thesis.commGapSolvedHeading || "How This Experience Solves Corporate Client Bottlenecks"}
                </h4>
                
                <p className="text-xs text-slate-400 mt-3 leading-relaxed font-light">
                  "{thesis.commGapSolvedDescription || "Most candidates are either pure atmospheric mathematicians who can't speak with a fund manager, or corporate relations advocates who don't understand convective vortexes or deep learning architecture constraints."}"
                </p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
