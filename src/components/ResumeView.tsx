/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { Experience, Education, SkillCategory, Certification } from "../types";
import { 
  Briefcase, GraduationCap, Award, Terminal, Plus, Trash2, Check, Edit3, Save, X, ExternalLink, 
  FileSpreadsheet, ArrowUpRight, PlusCircle, CheckCircle, ChevronDown, ChevronUp 
} from "lucide-react";

export const ResumeView: React.FC = () => {
  const {
    profile,
    experiences,
    education,
    skills,
    certifications,
    isAdmin,
    isSandboxMode,
    saveExperience,
    deleteExperience,
    saveEducation,
    deleteEducation,
    saveSkillCategory,
    deleteSkillCategory,
    saveCertification,
    deleteCertification,
    updateProfile
  } = usePortfolio();

  // Editing forms state
  const [activeTab, setActiveTab] = useState<"experience" | "education" | "skills" | "certifications">("experience");

  // Header editing state
  const [isEditingHeaders, setIsEditingHeaders] = useState(false);
  const [resumeTitle, setResumeTitle] = useState("");

  const startEditingHeaders = () => {
    setResumeTitle(profile.resumeSectionTitle || "Executive Resume & Background");
    setIsEditingHeaders(true);
  };

  const handleSaveHeaders = async () => {
    await updateProfile({
      resumeSectionTitle: resumeTitle
    });
    setIsEditingHeaders(false);
  };

  // Experience forms
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [expRole, setExpRole] = useState("");
  const [expCompany, setExpCompany] = useState("");
  const [expLocation, setExpLocation] = useState("");
  const [expPeriod, setExpPeriod] = useState("");
  const [expPoints, setExpPoints] = useState<string[]>([]);
  const [newPoint, setNewPoint] = useState("");

  // Education forms
  const [editingEduId, setEditingEduId] = useState<string | null>(null);
  const [eduDegree, setEduDegree] = useState("");
  const [eduSchool, setEduSchool] = useState("");
  const [eduPeriod, setEduPeriod] = useState("");
  const [eduFocus, setEduFocus] = useState("");
  const [eduThesisTitle, setEduThesisTitle] = useState("");
  const [eduThesisLink, setEduThesisLink] = useState("");

  // Skills forms
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [skillCategoryName, setSkillCategoryName] = useState("");
  const [skillItems, setSkillItems] = useState("");

  // Certifications forms
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [certTitle, setCertTitle] = useState("");
  const [certIssuer, setCertIssuer] = useState("");
  const [certDate, setCertDate] = useState("");
  const [certDescription, setCertDescription] = useState("");
  const [certFocus, setCertFocus] = useState("");

  // Helper selectors
  const handleAddNewExperience = () => {
    setEditingExpId("NEW");
    setExpRole("");
    setExpCompany("");
    setExpLocation("");
    setExpPeriod("");
    setExpPoints([]);
    setNewPoint("");
  };

  const handleStartEditExperience = (exp: Experience) => {
    setEditingExpId(exp.id);
    setExpRole(exp.role);
    setExpCompany(exp.company);
    setExpLocation(exp.location);
    setExpPeriod(exp.period);
    setExpPoints([...exp.points]);
    setNewPoint("");
  };

  const handleSaveExperienceForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expRole || !expCompany || !expPeriod) return;
    const finalId = editingExpId === "NEW" ? `exp-${Date.now()}` : editingExpId!;
    await saveExperience({
      id: finalId,
      role: expRole,
      company: expCompany,
      location: expLocation || "Remote",
      period: expPeriod,
      points: expPoints,
      order: editingExpId === "NEW" ? experiences.length + 1 : experiences.find(item => item.id === editingExpId)?.order || 1
    });
    setEditingExpId(null);
  };

  const handleAddExperiencePoint = () => {
    if (newPoint.trim() !== "") {
      setExpPoints([...expPoints, newPoint.trim()]);
      setNewPoint("");
    }
  };

  const handleRemoveExperiencePoint = (idx: number) => {
    setExpPoints(expPoints.filter((_, i) => i !== idx));
  };


  // Education forms handlers
  const handleAddNewEducation = () => {
    setEditingEduId("NEW");
    setEduDegree("");
    setEduSchool("");
    setEduPeriod("");
    setEduFocus("");
    setEduThesisTitle("");
    setEduThesisLink("");
  };

  const handleStartEditEducation = (edu: Education) => {
    setEditingEduId(edu.id);
    setEduDegree(edu.degree);
    setEduSchool(edu.school);
    setEduPeriod(edu.period);
    setEduFocus(edu.focus || "");
    setEduThesisTitle(edu.thesisTitle || "");
    setEduThesisLink(edu.thesisLink || "");
  };

  const handleSaveEducationForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduDegree || !eduSchool || !eduPeriod) return;
    const finalId = editingEduId === "NEW" ? `edu-${Date.now()}` : editingEduId!;
    await saveEducation({
      id: finalId,
      degree: eduDegree,
      school: eduSchool,
      period: eduPeriod,
      focus: eduFocus,
      thesisTitle: eduThesisTitle || undefined,
      thesisLink: eduThesisLink || undefined,
      order: editingEduId === "NEW" ? education.length + 1 : education.find(item => item.id === editingEduId)?.order || 1
    });
    setEditingEduId(null);
  };


  // Skills categories handlers
  const handleAddNewSkill = () => {
    setEditingSkillId("NEW");
    setSkillCategoryName("");
    setSkillItems("");
  };

  const handleStartEditSkill = (s: SkillCategory) => {
    setEditingSkillId(s.id);
    setSkillCategoryName(s.category);
    setSkillItems(s.items);
  };

  const handleSaveSkillForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillCategoryName || !skillItems) return;
    const finalId = editingSkillId === "NEW" ? `skill-${Date.now()}` : editingSkillId!;
    await saveSkillCategory({
      id: finalId,
      category: skillCategoryName,
      items: skillItems,
      order: editingSkillId === "NEW" ? skills.length + 1 : skills.find(item => item.id === editingSkillId)?.order || 1
    });
    setEditingSkillId(null);
  };


  // Certification handlers
  const handleAddNewCert = () => {
    setEditingCertId("NEW");
    setCertTitle("");
    setCertIssuer("");
    setCertDate("");
    setCertDescription("");
    setCertFocus("");
  };

  const handleStartEditCert = (c: Certification) => {
    setEditingCertId(c.id);
    setCertTitle(c.title);
    setCertIssuer(c.issuer);
    setCertDate(c.date);
    setCertDescription(c.description || "");
    setCertFocus(c.focus || "");
  };

  const handleSaveCertForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitle || !certIssuer || !certDate) return;
    const finalId = editingCertId === "NEW" ? `cert-${Date.now()}` : editingCertId!;
    await saveCertification({
      id: finalId,
      title: certTitle,
      issuer: certIssuer,
      date: certDate,
      description: certDescription || undefined,
      focus: certFocus,
      order: editingCertId === "NEW" ? certifications.length + 1 : certifications.find(item => item.id === editingCertId)?.order || 1
    });
    setEditingCertId(null);
  };

  return (
    <div className="bg-[#02040a] py-12 border-t border-white/5 select-none md:select-text">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        
        {/* Tab Selection Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-5 mb-8 gap-4">
          {isEditingHeaders ? (
            <div className="w-full max-w-xl bg-slate-900 border border-cyan-500/30 p-4 rounded-xl space-y-3 shadow-lg no-print">
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase font-mono mb-1">Resume Section Title</label>
                <input
                  type="text"
                  value={resumeTitle}
                  onChange={(e) => setResumeTitle(e.target.value)}
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
                <h2 className="text-2xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-cyan-400 tracking-tight">
                  {profile.resumeSectionTitle || "Executive Resume & Background"}
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
          
          <div className="flex flex-wrap gap-1.5 bg-white/5 border border-white/10 p-1.5 rounded-xl no-print shadow-[0_4px_25px_rgba(0,0,0,0.4)]">
            <button
              onClick={() => setActiveTab("experience")}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all border cursor-pointer ${
                activeTab === "experience" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/25 shadow-[0_0_15px_rgba(6,182,212,0.15)]" : "text-slate-400 hover:text-slate-200 border-transparent hover:bg-white/5"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Work History
            </button>
            <button
              onClick={() => setActiveTab("education")}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all border cursor-pointer ${
                activeTab === "education" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/25 shadow-[0_0_15px_rgba(6,182,212,0.15)]" : "text-slate-400 hover:text-slate-200 border-transparent hover:bg-white/5"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Credentials
            </button>
            <button
              onClick={() => setActiveTab("skills")}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all border cursor-pointer ${
                activeTab === "skills" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/25 shadow-[0_0_15px_rgba(6,182,212,0.15)]" : "text-slate-400 hover:text-slate-200 border-transparent hover:bg-white/5"
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Skills & Systems
            </button>
            <button
              onClick={() => setActiveTab("certifications")}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all border cursor-pointer ${
                activeTab === "certifications" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/25 shadow-[0_0_15px_rgba(6,182,212,0.15)]" : "text-slate-400 hover:text-slate-200 border-transparent hover:bg-white/5"
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              Certifications
            </button>
          </div>
        </div>

        {/* Supplementary context buttons as requested */}
        <div className="mb-8 p-4 bg-slate-950/40 border border-white/5 rounded-2xl flex flex-col sm:flex-row items-center gap-4 no-print shadow-lg hover:border-cyan-500/10 transition-all duration-300">
          <div className="flex flex-col text-center sm:text-left">
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest">
              SUPPLEMENTAL RESOURCES
            </span>
          </div>
          <div className="flex flex-wrap gap-3 w-full sm:w-auto sm:ml-auto">
            <a 
              href="https://vimeo.com/1194951640?fl=ip&fe=ec"
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 text-cyan-300 border border-cyan-500/25 text-xs font-semibold px-4.5 py-2.5 rounded-xl transition-all hover:scale-[1.01] active:scale-95 cursor-pointer"
            >
              <span>So how did I end up in sustainability ?</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
            </a>
            <a 
              href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-red-600/10 to-red-500/10 hover:from-red-600/20 hover:to-red-500/20 text-red-300 border border-red-500/25 text-xs font-semibold px-4.5 py-2.5 rounded-xl transition-all hover:scale-[1.01] active:scale-95 cursor-pointer"
            >
              <span>Recommended reading for serious professionals</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-red-400" />
            </a>
          </div>
        </div>

        {/* --- EXPERIENCE SECTION --- */}
        {activeTab === "experience" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-cyan-400 animate-pulse" />
                {profile.workExperienceTitle || "Professional Work Experience"}
              </h3>
              {isSandboxMode && !editingExpId && (
                <button
                  onClick={handleAddNewExperience}
                  className="flex items-center gap-1.5 text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 hover:bg-cyan-500/20 px-3 py-1.5 rounded-lg transition-all cursor-pointer no-print focus:outline-hidden"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Add Direct Position
                </button>
              )}
            </div>

            {/* Exp Form */}
            {editingExpId && (
              <form onSubmit={handleSaveExperienceForm} className="bg-slate-950/90 border border-white/10 rounded-xl p-5 gap-4 flex flex-col animate-slideIn no-print shadow-2xl">
                <h4 className="font-semibold text-xs font-mono text-cyan-400">
                  {editingExpId === "NEW" ? "APPEND NEW POSITION RECORD" : "MODIFY EXPERIENCE RECORD"}
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400">Job Title / Role</label>
                    <input 
                      type="text" 
                      required
                      value={expRole} 
                      onChange={(e) => setExpRole(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-900 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden focus:ring-1 focus:ring-cyan-500/30"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400">Corporate Entity / Startup</label>
                    <input 
                      type="text" 
                      required
                      value={expCompany} 
                      onChange={(e) => setExpCompany(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-900 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden focus:ring-1 focus:ring-cyan-500/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400">Duration Period (e.g. Dec 2025 - Present)</label>
                    <input 
                      type="text" 
                      required
                      value={expPeriod} 
                      onChange={(e) => setExpPeriod(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-900 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden focus:ring-1 focus:ring-cyan-500/30"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400">Location</label>
                    <input 
                      type="text" 
                      value={expLocation} 
                      onChange={(e) => setExpLocation(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-900 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden focus:ring-1 focus:ring-cyan-500/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400">Achievements & Core Bullet Points</label>
                  <div className="space-y-2 mt-1">
                    {expPoints.map((point, index) => (
                      <div key={index} className="flex gap-2 items-center bg-slate-900 border border-white/10 px-3 py-1 rounded focus-within:border-cyan-500/50 transition-colors">
                        <input
                          type="text"
                          value={point}
                          onChange={(e) => {
                            const updated = [...expPoints];
                            updated[index] = e.target.value;
                            setExpPoints(updated);
                          }}
                          className="flex-1 text-xs text-slate-200 bg-transparent focus:outline-hidden py-1"
                          placeholder="Edit achievement bullet details..."
                        />
                        <button 
                          type="button" 
                          onClick={() => handleRemoveExperiencePoint(index)}
                          className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-white/5 cursor-pointer"
                          title="Delete Bullet"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Add dynamic achievement bullet..."
                        value={newPoint}
                        onChange={(e) => setNewPoint(e.target.value)}
                        className="flex-1 text-xs p-2 bg-slate-900 border border-white/10 text-slate-250 rounded focus:border-cyan-500 outline-hidden"
                      />
                      <button 
                        type="button" 
                        onClick={handleAddExperiencePoint}
                        className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 text-xs px-3 rounded-md font-semibold cursor-pointer"
                      >
                        Add Bullet
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-3 border-t border-white/10">
                  <button 
                    type="button" 
                    onClick={() => setEditingExpId(null)}
                    className="text-xs px-3.5 py-1.5 bg-white/5 text-slate-350 rounded-lg hover:bg-white/10 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="text-xs px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold rounded-lg hover:opacity-95 cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}

             {/* Exp List Cards */}
            <div className="space-y-6">
              {experiences.length === 0 && !editingExpId && (
                <div className="border border-white/5 bg-slate-950/40 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
                  <Briefcase className="w-12 h-12 text-slate-600 animate-bounce mb-3" />
                  <p className="text-sm text-slate-400 font-semibold font-display">No Experience Records Found</p>
                  <p className="text-xs text-slate-500 font-mono mt-1">THE SECTION HAS BEEN ENTIRELY EMPTIED</p>
                  {isSandboxMode && (
                    <button
                      onClick={handleAddNewExperience}
                      className="mt-4 flex items-center gap-1.5 text-xs font-semibold bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all font-mono px-4 py-2 rounded-xl shadow-lg border border-cyan-300/30 cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      Add Position Record
                    </button>
                  )}
                </div>
              )}
              {experiences.map((exp) => (
                <div 
                  key={exp.id} 
                  className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/35 p-5 md:p-6 rounded-2xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.08)] leading-relaxed"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h4 className="text-base font-bold text-white font-display">
                        {exp.role}
                      </h4>
                      <p className="text-sm font-semibold text-cyan-400 mt-1 flex items-center gap-2">
                        <span>{exp.company}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-xs text-slate-400 font-normal">{exp.location}</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
                      <span className="font-mono text-[11px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 font-bold px-2.5 py-1 rounded-sm tracking-wide">
                        {exp.period}
                      </span>
                      {isSandboxMode && (
                        <div className="flex items-center gap-1.5 no-print shrink-0">
                          <button
                            onClick={() => handleStartEditExperience(exp)}
                            className="p-1 px-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Edit3 className="w-3 h-3" /> Edit
                          </button>
                          <button
                            onClick={async () => {
                              await deleteExperience(exp.id);
                            }}
                            className="p-1 px-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <ul className="mt-4 list-none space-y-2 text-sm text-slate-300">
                    {exp.points.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0 shadow-[0_0_5px_rgba(34,211,238,0.8)]" />
                        <span className="flex-1">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- EDUCATION & THESIS SECTION --- */}
        {activeTab === "education" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between col-span-1">
              <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-cyan-400 animate-pulse" />
                {profile.academicHistoryTitle || "Academic Qualifications"}
              </h3>
              {isSandboxMode && !editingEduId && (
                <button
                  onClick={handleAddNewEducation}
                  className="flex items-center gap-1.5 text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 hover:bg-cyan-500/20 px-3 py-1.5 rounded-lg transition-all cursor-pointer no-print whitespace-nowrap focus:outline-hidden"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Add Academic History
                </button>
              )}
            </div>

            {/* Edu Form */}
            {editingEduId && (
              <form onSubmit={handleSaveEducationForm} className="bg-slate-950 border border-white/10 rounded-xl p-5 gap-4 flex flex-col animate-slideIn no-print shadow-2xl">
                <h4 className="font-semibold text-xs font-mono text-cyan-400">
                  {editingEduId === "NEW" ? "APPEND NEW EDUCATION RECORD" : "MODIFY REGISTERED EDUCATION"}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400">Degree & Specialization</label>
                    <input 
                      type="text" 
                      required
                      value={eduDegree} 
                      onChange={(e) => setEduDegree(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-900 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden focus:ring-1 focus:ring-cyan-500/30"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400">University / Institution</label>
                    <input 
                      type="text" 
                      required
                      value={eduSchool} 
                      onChange={(e) => setEduSchool(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-900 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden focus:ring-1 focus:ring-cyan-500/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400">Duration Period (e.g. Aug 2022 - June 2025)</label>
                    <input 
                      type="text" 
                      required
                      value={eduPeriod} 
                      onChange={(e) => setEduPeriod(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-900 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden focus:ring-1 focus:ring-cyan-500/30"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400">Course Focus Area</label>
                    <input 
                      type="text" 
                      value={eduFocus} 
                      onChange={(e) => setEduFocus(e.target.value)}
                      placeholder="e.g. Sustainable Energy Systems"
                      className="w-full text-xs p-2 bg-slate-900 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden focus:ring-1 focus:ring-cyan-500/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400">Optional Thesis Title</label>
                    <input 
                      type="text" 
                      value={eduThesisTitle} 
                      onChange={(e) => setEduThesisTitle(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-900 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400">Thesis External URL link</label>
                    <input 
                      type="text" 
                      value={eduThesisLink} 
                      onChange={(e) => setEduThesisLink(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-900 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-3 border-t border-white/10">
                  <button 
                    type="button" 
                    onClick={() => setEditingEduId(null)}
                    className="text-xs px-3.5 py-1.5 bg-white/5 text-slate-350 rounded-lg hover:bg-white/10 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="text-xs px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold rounded-lg hover:opacity-95 cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {/* Edu Cards */}
            <div className="space-y-6">
              {education.length === 0 && !editingEduId && (
                <div className="border border-white/5 bg-slate-950/40 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
                  <GraduationCap className="w-12 h-12 text-slate-600 animate-bounce mb-3" />
                  <p className="text-sm text-slate-400 font-semibold font-display">No Academic History Found</p>
                  <p className="text-xs text-slate-500 font-mono mt-1">THE SECTION HAS BEEN ENTIRELY EMPTIED</p>
                  {isSandboxMode && (
                    <button
                      onClick={handleAddNewEducation}
                      className="mt-4 flex items-center gap-1.5 text-xs font-semibold bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all font-mono px-4 py-2 rounded-xl shadow-lg border border-cyan-300/30 cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      Add Academic History
                    </button>
                  )}
                </div>
              )}
              {education.map((edu) => (
                <div 
                  key={edu.id} 
                  className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/35 p-5 md:p-6 rounded-2xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.08)] leading-relaxed"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h4 className="text-base font-bold text-white font-display">
                        {edu.degree}
                      </h4>
                      <p className="text-sm font-semibold text-cyan-400 mt-1">
                        {edu.school}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
                      <span className="font-mono text-[11px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 font-bold px-2.5 py-1 rounded-sm tracking-wide">
                        {edu.period}
                      </span>
                      {isSandboxMode && (
                        <div className="flex items-center gap-1.5 no-print shrink-0">
                          <button
                            onClick={() => handleStartEditEducation(edu)}
                            className="p-1 px-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Edit3 className="w-3 h-3" /> Edit
                          </button>
                          <button
                            onClick={async () => {
                              await deleteEducation(edu.id);
                            }}
                            className="p-1 px-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {edu.focus && (
                    <div className="mt-3 flex gap-2">
                       <span className="text-xs font-mono font-semibold text-slate-500">FOCUS AREAS:</span>
                      <p className="text-xs text-slate-350">{edu.focus}</p>
                    </div>
                  )}

                  {edu.thesisTitle && (
                    <div className="mt-4 p-4 bg-cyan-500/5 rounded-xl border border-cyan-500/20 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                      <div className="flex items-start gap-2.5">
                        <span className="text-xs font-mono font-bold bg-cyan-400 text-slate-950 px-2.5 py-1 rounded select-none mt-0.5 whitespace-nowrap">
                          THESIS
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-slate-200 font-display leading-tight">{edu.thesisTitle}</p>
                        </div>
                      </div>
                      
                      {edu.thesisLink && (
                        <a 
                          href={edu.thesisLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 bg-white/5 hover:bg-white/10 hover:text-cyan-400 border border-white/10 text-slate-200 text-[11px] px-3 py-1.5 rounded-lg transition-all font-semibold shadow-2xs cursor-pointer select-none no-print-link whitespace-nowrap w-fit self-end"
                        >
                          <ArrowUpRight className="w-3 h-3" /> View In Archives
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- SKILLS & SYSTEMS SECTION --- */}
        {activeTab === "skills" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400 animate-pulse" />
                {profile.skillsTitle || "Technical & Tool Capabilities"}
              </h3>
              {isSandboxMode && !editingSkillId && (
                <button
                  onClick={handleAddNewSkill}
                  className="flex items-center gap-1.5 text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 px-3 py-1.5 rounded-lg transition-all cursor-pointer no-print focus:outline-hidden"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Add Skill Category
                </button>
              )}
            </div>

            {/* Skill Form */}
            {editingSkillId && (
              <form onSubmit={handleSaveSkillForm} className="bg-slate-950/90 border border-white/10 rounded-xl p-5 gap-3 flex flex-col animate-slideIn no-print shadow-2xl">
                <h4 className="font-semibold text-xs font-mono text-cyan-400">
                  {editingSkillId === "NEW" ? "APPEND NEW SKILL CATEGORY" : "MODIFY SKILL GROUP"}
                </h4>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400">Category Name</label>
                  <input 
                    type="text" 
                    required
                    value={skillCategoryName} 
                    onChange={(e) => setSkillCategoryName(e.target.value)}
                    placeholder="e.g. Outreach & CRM, Data Science"
                    className="w-full text-xs p-2 bg-slate-900 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden focus:ring-1 focus:ring-cyan-500/30"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400">Skills / Tools (Comma-separated items)</label>
                  <textarea 
                    rows={2}
                    required
                    value={skillItems} 
                    onChange={(e) => setSkillItems(e.target.value)}
                    placeholder="e.g. Sales Navigator, Notion, Excel"
                    className="w-full text-xs p-2 bg-slate-900 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden font-mono focus:ring-1 focus:ring-cyan-500/30"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-3 border-t border-white/10">
                  <button 
                    type="button" 
                    onClick={() => setEditingSkillId(null)}
                    className="text-xs px-3.5 py-1.5 bg-white/5 text-slate-350 rounded-lg hover:bg-white/10 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="text-xs px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold rounded-lg hover:opacity-95 cursor-pointer"
                  >
                    Save Group
                  </button>
                </div>
              </form>
            )}

            {/* Skills Table / List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.length === 0 && !editingSkillId && (
                <div className="border border-white/5 bg-slate-950/40 rounded-2xl p-12 text-center col-span-1 md:col-span-2 flex flex-col items-center justify-center w-full">
                  <Terminal className="w-12 h-12 text-slate-600 animate-bounce mb-3" />
                  <p className="text-sm text-slate-400 font-semibold font-display">No Skill Categories Found</p>
                  <p className="text-xs text-slate-500 font-mono mt-1">THE SECTION HAS BEEN ENTIRELY EMPTIED</p>
                  {isSandboxMode && (
                    <button
                      onClick={handleAddNewSkill}
                      className="mt-4 flex items-center gap-1.5 text-xs font-semibold bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all font-mono px-4 py-2 rounded-xl shadow-lg border border-cyan-300/30 cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      Add Skill Category
                    </button>
                  )}
                </div>
              )}
              {skills.map((s) => (
                <div 
                  key={s.id} 
                  className="group relative bg-white/5 hover:bg-white/10 border border-white/10 p-5 rounded-2xl transition-all duration-300 flex flex-col gap-2 hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.06)]"
                >
                  <div className="flex justify-between items-start gap-3">
                    <span className="font-mono text-xs font-bold text-cyan-400/80 uppercase tracking-widest leading-tight">
                      {s.category}
                    </span>
                    {isSandboxMode && (
                      <div className="flex items-center gap-1.5 no-print shrink-0">
                        <button
                          onClick={() => handleStartEditSkill(s)}
                          className="p-1 px-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 rounded text-[10px] font-semibold flex items-center gap-0.5 cursor-pointer transition-colors"
                        >
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>
                        <button
                          onClick={async () => {
                            await deleteSkillCategory(s.id);
                          }}
                          className="p-1 px-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400 rounded text-[10px] font-semibold flex items-center gap-0.5 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {s.items.split(",").map((item, id) => (
                      <span 
                        key={id} 
                        className="bg-slate-900 border border-white/10 inline-block font-sans text-xs text-slate-300 px-3 py-1 rounded-md shadow-2xs font-medium"
                      >
                        {item.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- CERTIFICATIONS SECTION --- */}
        {activeTab === "certifications" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-400 animate-pulse" />
                {profile.certificationsTitle || "Specializations & Credentials"}
              </h3>
              {isSandboxMode && !editingCertId && (
                <button
                  onClick={handleAddNewCert}
                  className="flex items-center gap-1.5 text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 px-3 py-1.5 rounded-lg transition-all cursor-pointer no-print focus:outline-hidden"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Add Specialization
                </button>
              )}
            </div>            {/* Cert Form */}
            {editingCertId && (
              <form onSubmit={handleSaveCertForm} className="bg-slate-950/90 border border-white/10 rounded-xl p-5 gap-3 flex flex-col animate-slideIn no-print shadow-2xl">
                <h4 className="font-semibold text-xs font-mono text-cyan-400">
                  {editingCertId === "NEW" ? "APPEND NEW CREDENTIAL" : "MODIFY CERTIFICATION"}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400">Certificate Title</label>
                    <input 
                      type="text" 
                      required
                      value={certTitle} 
                      onChange={(e) => setCertTitle(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-900 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400">Issuing Authority (e.g. EDHEC)</label>
                    <input 
                      type="text" 
                      required
                      value={certIssuer} 
                      onChange={(e) => setCertIssuer(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-900 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400">Date (e.g. Issued May 2026)</label>
                    <input 
                      type="text" 
                      required
                      value={certDate} 
                      onChange={(e) => setCertDate(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-900 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400">Focus Areas (Comma-separated list)</label>
                    <input 
                      type="text" 
                      required
                      value={certFocus} 
                      onChange={(e) => setCertFocus(e.target.value)}
                      placeholder="e.g. ESG, Sustainable Engineering"
                      className="w-full text-xs p-2 bg-slate-900 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400">Detailed Description (Optional)</label>
                  <textarea 
                    rows={3}
                    value={certDescription} 
                    onChange={(e) => setCertDescription(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-900 border border-white/10 text-slate-200 rounded focus:border-cyan-500 outline-hidden"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-3 border-t border-white/10">
                  <button 
                    type="button" 
                    onClick={() => setEditingCertId(null)}
                    className="text-xs px-3.5 py-1.5 bg-white/5 text-slate-350 rounded-lg hover:bg-white/10 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="text-xs px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold rounded-lg hover:opacity-95 cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {/* Cert Cards */}
            <div className="space-y-6">
              {certifications.length === 0 && !editingCertId && (
                <div className="border border-white/5 bg-slate-950/40 rounded-2xl p-12 text-center flex flex-col items-center justify-center w-full">
                  <Award className="w-12 h-12 text-slate-600 animate-bounce mb-3" />
                  <p className="text-sm text-slate-400 font-semibold font-display">No Certification Records Found</p>
                  <p className="text-xs text-slate-500 font-mono mt-1">THE SECTION HAS BEEN ENTIRELY EMPTIED</p>
                  {isSandboxMode && (
                    <button
                      onClick={handleAddNewCert}
                      className="mt-4 flex items-center gap-1.5 text-xs font-semibold bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all font-mono px-4 py-2 rounded-xl shadow-lg border border-cyan-300/30 cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      Add Specialization
                    </button>
                  )}
                </div>
              )}
              {certifications.map((c) => (
                <div 
                  key={c.id} 
                  className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/35 p-5 md:p-6 rounded-2xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.08)] leading-relaxed"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h4 className="text-base font-bold text-white font-display">
                        {c.title}
                      </h4>
                      <p className="text-sm font-semibold text-cyan-400 mt-0.5">
                        {c.issuer}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
                      <span className="font-mono text-[11px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 font-bold px-2.5 py-1 rounded-sm tracking-wide">
                        {c.date}
                      </span>
                      {isSandboxMode && (
                        <div className="flex items-center gap-1.5 no-print shrink-0">
                          <button
                            onClick={() => handleStartEditCert(c)}
                            className="p-1 px-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Edit3 className="w-3 h-3" /> Edit
                          </button>
                          <button
                            onClick={async () => {
                              await deleteCertification(c.id);
                            }}
                            className="p-1 px-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {c.description && (
                    <p className="mt-3.5 text-slate-300 text-sm leading-relaxed">
                      {c.description}
                    </p>
                  )}

                  {c.focus && (
                    <div className="mt-4 flex flex-wrap gap-1 md:gap-1.5 pt-4 border-t border-white/5">
                      {c.focus.split(",").map((f, i) => (
                        <span 
                          key={i}
                          className="bg-slate-900 border border-white/10 text-slate-300 text-[10px] font-mono font-medium px-2 py-1 rounded shadow-3xs"
                        >
                          {f.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
