/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { Play, Pause, Youtube, Video, FileText, Globe, Linkedin, ArrowRight, Eye, Settings, Edit3, ShieldAlert, MessageSquare } from "lucide-react";

export const Hero: React.FC = () => {
  const { 
    profile, 
    updateProfile, 
    isAdmin, 
    isSandboxMode, 
    toggleSandboxMode, 
    isFirebaseActive 
  } = usePortfolio();

  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [progress, setProgress] = useState(0);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Edit fields
  const [editName, setEditName] = useState(profile.name);
  const [editTitle, setEditTitle] = useState(profile.title);
  const [editSubtitle, setEditSubtitle] = useState(profile.subtitle);
  const [editBio, setEditBio] = useState(profile.bio);
  const [editLinkedin, setEditLinkedin] = useState(profile.linkedin);
  const [editVideoUrl, setEditVideoUrl] = useState(profile.videoUrl);
  const [editTranscript, setEditTranscript] = useState(profile.videoTranscript);
  
  // New Axis and Bridger edit fields
  const [editTechAxisTitle, setEditTechAxisTitle] = useState(profile.techAxisTitle || "01 . TECHNICAL SCIENTIFIC AXIS");
  const [editTechAxisContent, setEditTechAxisContent] = useState(profile.techAxisContent || "Expert in Atmospheric modeling, physical energy equations, and complex deep learning structures like Convolutional Neural Networks on climate data gaps.");
  const [editStratAxisTitle, setEditStratAxisTitle] = useState(profile.stratAxisTitle || "02 . STRATEGIC BUSINESS AXIS");
  const [editStratAxisContent, setEditStratAxisContent] = useState(profile.stratAxisContent || "Pioneered 300+ client advising operations, engineered custom regulatory systems triggers (CSRD, CDP, Scope 3), and framed ROI modeling in climate economics.");
  const [editCommBridgerTitle, setEditCommBridgerTitle] = useState(profile.commBridgerTitle || "Communication Bridger");
  const [editCommBridgerContent, setEditCommBridgerContent] = useState(profile.commBridgerContent || "Climate change is fundamentally an economic problem. Profit runs the market. If we can't demonstrate real ROI, sustainability won't scale.");

  // Brand Titles & Headings
  const [editTopBannerText, setEditTopBannerText] = useState(profile.topBannerText || "Bridging Scientific Systems & Financial Viability (6 Years Experience)");
  const [editResumeSectionTitle, setEditResumeSectionTitle] = useState(profile.resumeSectionTitle || "Executive Resume & Background");
  const [editWorkExperienceTitle, setEditWorkExperienceTitle] = useState(profile.workExperienceTitle || "Professional Work Experience");
  const [editAcademicHistoryTitle, setEditAcademicHistoryTitle] = useState(profile.academicHistoryTitle || "Academic Credentials & History");
  const [editSkillsTitle, setEditSkillsTitle] = useState(profile.skillsTitle || "Technical Systems & Skills Inventory");
  const [editCertificationsTitle, setEditCertificationsTitle] = useState(profile.certificationsTitle || "Professional Specializations & Certifications");
  const [editDocumentVaultTitle, setEditDocumentVaultTitle] = useState(profile.documentVaultTitle || "Executive Document & Attachment Vault");
  const [editThesisTitleCustom, setEditThesisTitleCustom] = useState(profile.thesisTitleCustom || "Machine Learning Thesis & Research");
  const [editCoverLetterTitle, setEditCoverLetterTitle] = useState(profile.coverLetterTitle || "Corporate Cover Letter");

  useEffect(() => {
    setEditName(profile.name);
    setEditTitle(profile.title);
    setEditSubtitle(profile.subtitle);
    setEditBio(profile.bio);
    setEditLinkedin(profile.linkedin);
    setEditVideoUrl(profile.videoUrl);
    setEditTranscript(profile.videoTranscript);
    setEditTechAxisTitle(profile.techAxisTitle || "01 . TECHNICAL SCIENTIFIC AXIS");
    setEditTechAxisContent(profile.techAxisContent || "Expert in Atmospheric modeling, physical energy equations, and complex deep learning structures like Convolutional Neural Networks on climate data gaps.");
    setEditStratAxisTitle(profile.stratAxisTitle || "02 . STRATEGIC BUSINESS AXIS");
    setEditStratAxisContent(profile.stratAxisContent || "Pioneered 300+ client advising operations, engineered custom regulatory systems triggers (CSRD, CDP, Scope 3), and framed ROI modeling in climate economics.");
    setEditCommBridgerTitle(profile.commBridgerTitle || "Communication Bridger");
    setEditCommBridgerContent(profile.commBridgerContent || "Climate change is fundamentally an economic problem. Profit runs the market. If we can't demonstrate real ROI, sustainability won't scale.");
    setEditTopBannerText(profile.topBannerText || "Bridging Scientific Systems & Financial Viability (6 Years Experience)");
    setEditResumeSectionTitle(profile.resumeSectionTitle || "Executive Resume & Background");
    setEditWorkExperienceTitle(profile.workExperienceTitle || "Professional Work Experience");
    setEditAcademicHistoryTitle(profile.academicHistoryTitle || "Academic Credentials & History");
    setEditSkillsTitle(profile.skillsTitle || "Technical Systems & Skills Inventory");
    setEditCertificationsTitle(profile.certificationsTitle || "Professional Specializations & Certifications");
    setEditDocumentVaultTitle(profile.documentVaultTitle || "Executive Document & Attachment Vault");
    setEditThesisTitleCustom(profile.thesisTitleCustom || "Machine Learning Thesis & Research");
    setEditCoverLetterTitle(profile.coverLetterTitle || "Corporate Cover Letter");
  }, [profile]);

  // Handle fake text-teleprompter playback simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.5 * playbackSpeed;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name: editName,
      title: editTitle,
      subtitle: editSubtitle,
      bio: editBio,
      linkedin: editLinkedin,
      videoUrl: editVideoUrl,
      videoTranscript: editTranscript,
      techAxisTitle: editTechAxisTitle,
      techAxisContent: editTechAxisContent,
      stratAxisTitle: editStratAxisTitle,
      stratAxisContent: editStratAxisContent,
      commBridgerTitle: editCommBridgerTitle,
      commBridgerContent: editCommBridgerContent,
      topBannerText: editTopBannerText,
      resumeSectionTitle: editResumeSectionTitle,
      workExperienceTitle: editWorkExperienceTitle,
      academicHistoryTitle: editAcademicHistoryTitle,
      skillsTitle: editSkillsTitle,
      certificationsTitle: editCertificationsTitle,
      documentVaultTitle: editDocumentVaultTitle,
      thesisTitleCustom: editThesisTitleCustom,
      coverLetterTitle: editCoverLetterTitle
    });
    setShowEditProfile(false);
  };

  // Render video or fallback clean transcript interactive player
  const renderVideoPlayer = () => {
    const isYoutube = profile.videoUrl.includes("youtube.com") || profile.videoUrl.includes("youtu.be");
    
    if (isYoutube) {
      // Clean up youtube embed link
      let embedUrl = profile.videoUrl;
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = profile.videoUrl.match(regExp);
      if (match && match[2].length === 11) {
        embedUrl = `https://www.youtube.com/embed/${match[2]}`;
      }
      return (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-xl border border-white/10 bg-slate-900 group">
          <iframe 
            src={embedUrl}
            title="Introduction Video Player"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <div className="absolute top-3 left-3 bg-cyan-600 text-white text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 shadow-md shadow-cyan-500/10">
            <Youtube className="w-3.5 h-3.5" />
            Live YouTube Intro
          </div>
        </div>
      );
    }

    // Interactive Pre-recorded Transcript player fallback
    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-xl border border-white/10 bg-slate-950 flex flex-col justify-between p-4 md:p-6 overflow-y-auto font-sans">
        {/* Top Info Header */}
        <div className="flex items-center justify-between pointer-events-none mb-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          </div>
          <span className="text-xs bg-slate-900 text-slate-300 font-mono px-2 py-1 rounded">
            {isPlaying ? "PLAYING AUDIO PLAYBACK" : "PAUSED"}
          </span>
        </div>

        {/* Scrollable Transcript Text that reacts to playback simulation */}
        <div className="flex-1 overflow-y-auto py-2 pr-2 scrollbar-thin text-slate-200 leading-relaxed text-sm md:text-base selection:bg-cyan-500/35 select-none hover:scrollbar-thumb-cyan-500 transition-colors">
          {profile.videoTranscript.split("\n\n").map((para, paraIdx) => {
            // Highlighting based on playback simulation
            const activeParagraphIndex = Math.floor((progress / 100) * profile.videoTranscript.split("\n\n").length);
            const isHighlighted = paraIdx === activeParagraphIndex && isPlaying;
            return (
              <p 
                key={paraIdx} 
                className={`mb-4 transition-all duration-300 ${isHighlighted ? "text-cyan-400 font-normal scale-[1.01] border-l-2 border-cyan-500 pl-3 translate-x-1" : "text-slate-400"}`}
              >
                {para}
              </p>
            );
          })}
        </div>

        {/* Bottom Audio Visualizer & Player Controls */}
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-3">
          {/* Waveform graphic */}
          <div className="flex items-end justify-between gap-[3px] h-6 px-1">
            {Array.from({ length: 42 }).map((_, idx) => {
              const height = isPlaying 
                ? Math.sin(idx + progress) * 12 + 12 
                : Math.sin(idx) * 4 + 4;
              return (
                <div 
                  key={idx} 
                  style={{ height: `${Math.max(2, height)}px` }}
                  className={`flex-1 rounded-sm transition-all duration-150 ${isPlaying ? "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.4)]" : "bg-slate-850"}`}
                />
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Control buttons */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2.5 rounded-full bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300 active:scale-95 transition-all shadow-lg flex items-center justify-center cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-slate-950" />}
              </button>
              
              <div className="text-xs text-slate-400 font-mono">
                {Math.floor(progress / 10)}s / 10s
              </div>
            </div>

            {/* Playback rate */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono text-slate-500">SPEED:</span>
              <div className="flex gap-1">
                {[1, 1.5, 2].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`text-[10px] font-mono px-2 py-1 rounded cursor-pointer ${playbackSpeed === speed ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "bg-slate-900 text-slate-400 hover:text-white"}`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-16 border-b border-white/10 bg-gradient-to-b from-[#02040a] via-[#080d1a] to-[#02040a]">
      
      {/* Absolute Admin Section Toggle for Recruiters */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 no-print">
        {isSandboxMode && (
          <div className="hidden sm:flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs px-3 py-1 rounded-full animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5" />
            Sandbox Playground Enabled
          </div>
        )}
        <button
          onClick={() => toggleSandboxMode(!isSandboxMode)}
          className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-all shadow-md cursor-pointer border ${
            isSandboxMode 
              ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]" 
              : "bg-white/5 text-slate-300 hover:bg-white/10 border-white/10"
          }`}
        >
          <Settings className="w-3.5 h-3.5 animate-spin-slow text-cyan-400" />
          {isSandboxMode ? "Exit Recruiters' Sandbox" : "Try Interactive Admin Editor"}
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6">
        
        {/* Banner highlighting Anadhi's dual profiles */}
        <div className="flex justify-start mb-6 no-print">
          <div className="inline-flex bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full text-cyan-400 text-xs font-mono gap-1.5 items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>{profile.topBannerText || "Bridging Scientific Systems & Financial Viability (6 Years Experience)"}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Text and Introduction Content */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-cyan-400 tracking-tight leading-none animate-fadeIn">
                  {profile.name}
                </h1>
                <p className="mt-3 text-lg font-medium text-cyan-400 tracking-tight flex items-center gap-2">
                  <span>{profile.title}</span>
                </p>
              </div>
              
              {/* Trigger Profile Editor inline in admin/sandbox */}
              {isSandboxMode && (
                <button
                  onClick={() => setShowEditProfile(!showEditProfile)}
                  className="p-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 rounded-md transition-colors cursor-pointer no-print"
                  title="Edit Profile"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
            </div>

            <p className="text-md font-sans text-slate-300 leading-normal border-l-2 border-cyan-500 pl-4 bg-white/5 py-2 rounded-r-lg">
              {profile.subtitle}
            </p>

            {/* Profile editor form */}
            {showEditProfile ? (
              <form onSubmit={handleSaveProfile} className="bg-slate-950/90 p-5 border border-white/10 rounded-xl flex flex-col gap-3 animate-fadeIn no-print shadow-2xl">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400">Name</label>
                    <input 
                      type="text" 
                      value={editName} 
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-900 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden focus:ring-1 focus:ring-cyan-500/30"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400">Title</label>
                    <input 
                      type="text" 
                      value={editTitle} 
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-900 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden focus:ring-1 focus:ring-cyan-500/30"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400">Subtitle Line</label>
                  <input 
                    type="text" 
                    value={editSubtitle} 
                    onChange={(e) => setEditSubtitle(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-900 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden focus:ring-1 focus:ring-cyan-500/30"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400">Author Bio Summarizer</label>
                  <textarea 
                    rows={3}
                    value={editBio} 
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-900 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden focus:ring-1 focus:ring-cyan-500/30"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400">LinkedIn Profile URL</label>
                  <input 
                    type="text" 
                    value={editLinkedin} 
                    onChange={(e) => setEditLinkedin(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-900 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden focus:ring-1 focus:ring-cyan-500/30"
                  />
                </div>

                {/* Technical Scientific Axis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400">Technical Axis Title</label>
                    <input 
                      type="text" 
                      value={editTechAxisTitle} 
                      onChange={(e) => setEditTechAxisTitle(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-900 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden focus:ring-1 focus:ring-cyan-500/30"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400">Technical Axis Description</label>
                    <textarea 
                      rows={2}
                      value={editTechAxisContent} 
                      onChange={(e) => setEditTechAxisContent(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-900 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden focus:ring-1 focus:ring-cyan-500/30"
                    />
                  </div>
                </div>

                {/* Strategic Business Axis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400">Strategic Axis Title</label>
                    <input 
                      type="text" 
                      value={editStratAxisTitle} 
                      onChange={(e) => setEditStratAxisTitle(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-900 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden focus:ring-1 focus:ring-cyan-500/30"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400">Strategic Axis Description</label>
                    <textarea 
                      rows={2}
                      value={editStratAxisContent} 
                      onChange={(e) => setEditStratAxisContent(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-900 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden focus:ring-1 focus:ring-cyan-500/30"
                    />
                  </div>
                </div>

                {/* Communication Bridger Box */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400">Communication Bridger Title</label>
                    <input 
                      type="text" 
                      value={editCommBridgerTitle} 
                      onChange={(e) => setEditCommBridgerTitle(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-900 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden focus:ring-1 focus:ring-cyan-500/30"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400">Communication Bridger Quote</label>
                    <textarea 
                      rows={2}
                      value={editCommBridgerContent} 
                      onChange={(e) => setEditCommBridgerContent(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-900 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden focus:ring-1 focus:ring-cyan-500/30"
                    />
                  </div>
                </div>

                <div className="border border-white/15 bg-slate-900/60 rounded-xl p-4 space-y-4">
                  <h4 className="text-xs font-bold text-cyan-400 font-mono tracking-wider uppercase">
                    🎨 Page Section Headers & Banner Text
                  </h4>
                  
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400">Top Header Banner Text</label>
                    <input 
                      type="text" 
                      value={editTopBannerText} 
                      onChange={(e) => setEditTopBannerText(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-950 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden focus:ring-1 focus:ring-cyan-500/30"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400">Resume Section Title</label>
                    <input 
                      type="text" 
                      value={editResumeSectionTitle} 
                      onChange={(e) => setEditResumeSectionTitle(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-950 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden focus:ring-1 focus:ring-cyan-500/30"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400">Work Experience Heading</label>
                      <input 
                        type="text" 
                        value={editWorkExperienceTitle} 
                        onChange={(e) => setEditWorkExperienceTitle(e.target.value)}
                        className="w-full text-xs p-2 bg-slate-950 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden focus:ring-1 focus:ring-cyan-500/30"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400">Academic Credentials Heading</label>
                      <input 
                        type="text" 
                        value={editAcademicHistoryTitle} 
                        onChange={(e) => setEditAcademicHistoryTitle(e.target.value)}
                        className="w-full text-xs p-2 bg-slate-950 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden focus:ring-1 focus:ring-cyan-500/30"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400">Skills Tab Title</label>
                      <input 
                        type="text" 
                        value={editSkillsTitle} 
                        onChange={(e) => setEditSkillsTitle(e.target.value)}
                        className="w-full text-xs p-2 bg-slate-950 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden focus:ring-1 focus:ring-cyan-500/30"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400">Certifications Tab Title</label>
                      <input 
                        type="text" 
                        value={editCertificationsTitle} 
                        onChange={(e) => setEditCertificationsTitle(e.target.value)}
                        className="w-full text-xs p-2 bg-slate-950 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden focus:ring-1 focus:ring-cyan-500/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400">Document Vault Title</label>
                    <input 
                      type="text" 
                      value={editDocumentVaultTitle} 
                      onChange={(e) => setEditDocumentVaultTitle(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-950 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden focus:ring-1 focus:ring-cyan-500/30"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400">Thesis Card Title</label>
                    <input 
                      type="text" 
                      value={editThesisTitleCustom} 
                      onChange={(e) => setEditThesisTitleCustom(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-950 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden focus:ring-1 focus:ring-cyan-500/30"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400">Cover Letter Header Title</label>
                    <input 
                      type="text" 
                      value={editCoverLetterTitle} 
                      onChange={(e) => setEditCoverLetterTitle(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-950 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden focus:ring-1 focus:ring-cyan-500/30"
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowEditProfile(false)}
                    className="text-xs px-3.5 py-1.5 bg-white/5 text-slate-350 rounded-lg hover:bg-white/10 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="text-xs px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold rounded-lg hover:opacity-95 cursor-pointer"
                  >
                    Save Biography
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-slate-600 text-base leading-relaxed md:text-md">
                {profile.bio}
              </p>
            )}

            {/* Grid display showcasing "The Bridge" explicitly as requested */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl hover:shadow-xs hover:border-cyan-500/30 transition-all flex flex-col gap-1.5">
                <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
                  {profile.techAxisTitle || "01 . TECHNICAL SCIENTIFIC AXIS"}
                </span>
                <p className="text-xs mt-1 text-slate-300 leading-normal">
                  {profile.techAxisContent || "Expert in Atmospheric modeling, physical energy equations, and complex deep learning structures like Convolutional Neural Networks on climate data gaps."}
                </p>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-xl hover:shadow-xs hover:border-blue-500/30 transition-all flex flex-col gap-1.5">
                <span className="font-mono text-xs text-blue-400 font-bold uppercase tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
                  {profile.stratAxisTitle || "02 . STRATEGIC BUSINESS AXIS"}
                </span>
                <p className="text-xs mt-1 text-slate-300 leading-normal">
                  {profile.stratAxisContent || "Pioneered 300+ client advising operations, engineered custom regulatory systems triggers (CSRD, CDP, Scope 3), and framed ROI modeling in climate economics."}
                </p>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-wrap gap-3.5 mt-2 no-print">
              <a 
                href={profile.linkedin} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-black text-sm font-bold px-5 py-2.5 rounded-lg hover:opacity-90 transition-all shadow-md group border-transparent cursor-pointer"
              >
                <Linkedin className="w-4 h-4 fill-black text-transparent group-hover:scale-110 transition-transform" />
                Connect on LinkedIn
                <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
              </a>
              <div 
                className="flex items-center gap-2 bg-white/5 text-slate-300 text-xs sm:text-sm px-4 py-2.5 rounded-lg border border-white/10 font-sans shadow-xs"
              >
                <span className="font-semibold text-slate-200">Get in Touch</span>
                <span className="text-cyan-400 font-mono text-xs sm:text-sm">({profile.email || "asharma9albs@gmail.com"})</span>
              </div>
            </div>
          </div>

          {/* Communication Bridger section */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex gap-4 shadow-2xs items-start">
              <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-lg">
                <MessageSquare className="w-5 h-5 flex-shrink-0" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-white font-display">
                  {profile.commBridgerTitle || "Communication Bridger"}
                </h4>
                <p className="text-xs text-slate-350 mt-1.5 leading-relaxed">
                  "{profile.commBridgerContent || "Climate change is fundamentally an economic problem. Profit runs the market. If we can't demonstrate real ROI, sustainability won't scale."}"
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
