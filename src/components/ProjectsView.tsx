/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { Project } from "../types";
import { 
  FolderGit2, Plus, Trash2, Edit3, Save, X, ExternalLink, Play, 
  ArrowUpRight, Image as ImageIcon, Video, Link as LinkIcon, Sparkles, FolderHeart
} from "lucide-react";

export const ProjectsView: React.FC = () => {
  const {
    projects,
    saveProject,
    deleteProject,
    isSandboxMode
  } = usePortfolio();

  // Dynamic Editing/Adding states
  const [editingProjId, setEditingProjId] = useState<string | null>(null);
  const [projTitle, setProjTitle] = useState("");
  const [projDescription, setProjDescription] = useState("");
  const [projProjectUrl, setProjProjectUrl] = useState("");
  const [projImageUrl, setProjImageUrl] = useState("");
  const [projVideoUrl, setProjVideoUrl] = useState("");

  const handleAddNewProject = () => {
    setEditingProjId("NEW");
    setProjTitle("");
    setProjDescription("");
    setProjProjectUrl("");
    setProjImageUrl("");
    setProjVideoUrl("");
  };

  const handleStartEditProject = (proj: Project) => {
    setEditingProjId(proj.id);
    setProjTitle(proj.title);
    setProjDescription(proj.description);
    setProjProjectUrl(proj.projectUrl || "");
    setProjImageUrl(proj.imageUrl || "");
    setProjVideoUrl(proj.videoUrl || "");
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim() || !projDescription.trim()) return;

    const targetId = editingProjId === "NEW" ? "proj-" + Date.now() : editingProjId!;
    const orderNum = editingProjId === "NEW" ? projects.length + 1 : (projects.find(p => p.id === editingProjId)?.order || 1);

    await saveProject({
      id: targetId,
      title: projTitle,
      description: projDescription,
      projectUrl: projProjectUrl.trim() || undefined,
      imageUrl: projImageUrl.trim() || undefined,
      videoUrl: projVideoUrl.trim() || undefined,
      order: orderNum
    });

    setEditingProjId(null);
  };

  const handleDeleteProject = async (id: string) => {
    await deleteProject(id);
  };

  const getEmbedUrl = (url?: string) => {
    if (!url) return "";
    if (url.includes("embed/")) return url;
    
    // Check for standard YouTube watch links
    const watchMatch = url.match(/(?:\?v=|\&v=)([a-zA-Z0-9_-]+)/);
    if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
    
    // Check for short YouTube share links
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
    
    return url;
  };

  return (
    <div id="projects-section" className="bg-[#02040a] py-16 border-b border-white/10 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h3 className="text-2xl font-bold font-display text-white flex items-center gap-2">
              <FolderHeart className="w-5 h-5 text-cyan-400 animate-pulse" />
              Projects
            </h3>
          </div>

          {isSandboxMode && (
            <button
              onClick={handleAddNewProject}
              className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-lg border bg-cyan-500/10 text-cyan-400 border-cyan-500/25 hover:bg-cyan-500/20 transition-all shadow-[0_0_10px_rgba(6,182,212,0.1)] cursor-pointer no-print"
            >
              <Plus className="w-4 h-4" /> Add Project
            </button>
          )}
        </div>

        {/* Modal-style Inline Editor for Adding/Modifying */}
        {editingProjId && (
          <div className="bg-slate-950/90 border border-white/10 rounded-2xl p-6 mb-10 shadow-2xl animate-slideIn no-print">
            <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-4">
              <h4 className="font-bold text-sm font-mono text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                {editingProjId === "NEW" ? "CREATE NEW PROJECT" : "EDIT PROJECT PROFILE"}
              </h4>
              <button 
                onClick={() => setEditingProjId(null)} 
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Scope 3 Supply Chain Analyzer"
                    value={projTitle}
                    onChange={(e) => setProjTitle(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-900 border border-white/10 text-slate-200 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 outline-hidden font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Project Link URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://github.com/... or project-url.com"
                    value={projProjectUrl}
                    onChange={(e) => setProjProjectUrl(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-900 border border-white/10 text-slate-200 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 outline-hidden font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Project Description * (Supports clear narrative spacing)</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detailed breakdown of scientific, technical or strategic business methodology, results, and overall communication value solved..."
                  value={projDescription}
                  onChange={(e) => setProjDescription(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-900 border border-white/10 text-slate-200 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 outline-hidden font-sans leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Demo Image Link URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... or absolute image URL"
                    value={projImageUrl}
                    onChange={(e) => setProjImageUrl(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-900 border border-white/10 text-slate-200 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 outline-hidden font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">YouTube Demo Video URL / Embed link (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    value={projVideoUrl}
                    onChange={(e) => setProjVideoUrl(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-900 border border-white/10 text-slate-200 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingProjId(null)}
                  className="text-xs px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-xs px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold rounded-lg flex items-center gap-1.5 cursor-pointer font-semibold hover:opacity-95 shadow-md"
                >
                  <Save className="w-3.5 h-3.5" /> Save Project
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Projects Collection Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
            <FolderGit2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No projects added yet.</p>
            {isSandboxMode && (
              <button
                onClick={handleAddNewProject}
                className="mt-3 inline-flex items-center gap-1 text-xs px-3 py-1.5 bg-cyan-500 text-black rounded-lg font-bold cursor-pointer hover:opacity-90"
              >
                <Plus className="w-3 h-3" /> Add Your First Project
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projects.map((proj) => {
              const videoEmbedUrl = getEmbedUrl(proj.videoUrl);
              return (
                <div 
                  key={proj.id} 
                  className="group relative bg-[#090d16]/60 border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:border-cyan-500/30 focus-within:border-cyan-500/30 transition-all duration-300 shadow-xl"
                >
                  {/* Decorative Subtle Accent Band */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent group-hover:via-cyan-500/50 rounded-t-3xl transition-opacity duration-300" />
                  
                  <div>
                    {/* Title & Actions */}
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <h4 className="text-lg font-bold font-display text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                        {proj.title}
                      </h4>

                      <div className="flex gap-2 shrink-0 no-print">
                        {isSandboxMode && (
                          <>
                            <button
                              onClick={() => handleStartEditProject(proj)}
                              className="p-1.5 bg-white/5 text-slate-400 hover:text-white rounded-md border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                              title="Edit project"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(proj.id)}
                              className="p-1.5 bg-red-950/10 text-red-400 hover:bg-red-950/30 hover:text-red-300 rounded-md border border-red-500/10 hover:border-red-500/25 transition-all cursor-pointer"
                              title="Delete project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}

                        {proj.projectUrl && (
                          <a
                            href={proj.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 rounded-md border border-cyan-500/20 transition-all cursor-pointer flex items-center justify-center"
                            title="Visit Website / Repo"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Rich Description */}
                    <p className="text-xs text-slate-300 leading-relaxed font-sans mb-6 whitespace-pre-line">
                      {proj.description}
                    </p>

                    {/* Media Render Box: Video OR Image */}
                    {(proj.imageUrl || videoEmbedUrl) && (
                      <div className="mb-6 rounded-2xl overflow-hidden border border-white/5 bg-slate-950 shadow-inner">
                        {videoEmbedUrl ? (
                          <div className="relative aspect-video w-full">
                            <iframe
                              src={videoEmbedUrl}
                              title={`${proj.title} Demo video`}
                              className="absolute top-0 left-0 w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                            />
                          </div>
                        ) : proj.imageUrl ? (
                          <div className="relative aspect-video w-full overflow-hidden">
                            <img
                              src={proj.imageUrl}
                              alt={proj.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                            />
                            {/* Ambient subtle linear gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#02040a]/40 to-transparent pointer-events-none" />
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>

                  {/* Footer Meta Details */}
                  <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                      {proj.videoUrl ? (
                        <span className="flex items-center gap-1 bg-cyan-950/20 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/15">
                          <Video className="w-3 h-3" /> DEMO VIDEO
                        </span>
                      ) : proj.imageUrl ? (
                        <span className="flex items-center gap-1 bg-blue-950/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/15">
                          <ImageIcon className="w-3 h-3" /> DEMO IMAGE
                        </span>
                      ) : null}
                    </div>

                    {proj.projectUrl && (
                      <a
                        href={proj.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors group/link"
                      >
                        Launch Project <ArrowUpRight className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
