/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { 
  Cloud, CloudOff, RefreshCw, ShieldAlert, BadgeCheck, 
  ChevronRight, Lock, Key, LogOut, Coffee, Settings,
  Eye, EyeOff, X
} from "lucide-react";

interface NavbarProps {
  activeSection: string;
  setActiveSection: (sec: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, setActiveSection }) => {
  const { 
    user, 
    isAdmin, 
    isSandboxMode, 
    isFirebaseActive, 
    triggerGoogleLogin, 
    triggerLogout,
    resetToDefaults,
    toggleSandboxMode,
    syncSandboxToFirestore
  } = usePortfolio();

  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success" | "error" | "login_required">("idle");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleToggleEditor = () => {
    if (isSandboxMode) {
      toggleSandboxMode(false);
    } else {
      setPasswordInput("");
      setPasswordError("");
      setShowPassword(false);
      setShowPasswordModal(true);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "Pika0portfolio") {
      toggleSandboxMode(true);
      setShowPasswordModal(false);
      setPasswordError("");
    } else {
      setPasswordError("Incorrect credentials. Access Denied.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const dbStatusText = () => {
    if (isFirebaseActive) {
      if (isSandboxMode || isAdmin) {
        return "LIVE FIRESTORE DATABASE - WRITES ACTIVE";
      }
      return "CONNECTED TO FIRESTORE (READ ONLY)";
    }
    return "LOCAL CACHE STATE ACTIVE";
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-white/10 bg-[#02040a]/80 backdrop-blur-md no-print select-none">
      
      {/* Top micro bar detailing clock, databases config constraints */}
      <div className="bg-black text-slate-400 text-[10px] font-mono py-1.5 px-4 md:px-6 flex flex-col sm:flex-row justify-between items-center gap-2 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isFirebaseActive ? "bg-cyan-400 animate-pulse" : "bg-amber-400"}`} />
            <span className="text-slate-300 font-semibold uppercase">{dbStatusText()}</span>
          </div>
          
          {isSandboxMode && (
            <span className="text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/25 px-1.5 py-0.5 rounded leading-none text-[9px] shadow-[0_0_10px_rgba(16,185,129,0.15)]">
              LIVE EDITING ENFORCE
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 text-[10px]">
          {/* Core authorization action widgets */}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-slate-300 font-semibold text-[9px] truncate max-w-[120px]" title={user.email || ""}>
                {user.email === "asharma9albs@gmail.com" ? "OWNER (ANADHI)" : "PREVIEW GUEST"}
              </span>
              <button 
                onClick={triggerLogout}
                className="hover:text-amber-400 text-slate-300 font-bold flex items-center gap-1.5 cursor-pointer hover:underline transition-colors leading-none"
              >
                <LogOut className="w-2.5 h-2.5" /> SIGN OUT
              </button>
            </div>
          ) : (
            <button 
              onClick={triggerGoogleLogin}
              className="hover:text-emerald-400 text-slate-300 font-bold flex items-center gap-1 capitalize cursor-pointer hover:underline tracking-wide"
            >
              <Lock className="w-2.5 h-2.5 text-slate-500 inline mr-0.5" /> Owner Cloud Login
            </button>
          )}
        </div>
      </div>

      {/* Primary navbar panel */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        
        {/* Brand signature */}
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center font-display font-medium text-black shadow-[0_0_15px_rgba(6,182,212,0.35)] text-sm cursor-default">
            AS
          </div>
          <div>
            <span className="font-semibold text-white tracking-tight font-display text-base block">Anadhi Sharma</span>
          </div>
        </div>

        {/* Tab Selection */}
        <nav className="hidden md:flex gap-1.5">
          {[
            { id: "all", label: "Executive Summary" },
            { id: "resume", label: "Interactive Resume" },
            { id: "vault", label: "Document Vault" },
            { id: "thesis", label: "Weather ML Thesis" },
            { id: "cover", label: "Cover Letter" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-all border ${
                activeSection === tab.id 
                  ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-bold" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border-transparent"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Print / Download triggers */}
        <div className="flex items-center gap-2">
        </div>

      </div>

      {/* Mobile Tab Scroller */}
      <div className="md:hidden flex overflow-x-auto gap-1 border-t border-white/10 bg-black/60 px-2.5 py-2 scrollbar-none">
        {[
          { id: "all", label: "Summary" },
          { id: "resume", label: "Resume" },
          { id: "vault", label: "Attachments" },
          { id: "thesis", label: "ML Thesis" },
          { id: "cover", label: "Cover Letter" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`text-xs font-semibold px-4 py-1.5 rounded-full whitespace-nowrap cursor-pointer transition-colors border ${
              activeSection === tab.id 
                ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-400" 
                : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-white/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Password Authorization Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-sm bg-[#0b0f19] border border-cyan-500/20 rounded-2xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.15)] animate-scale-up">
            
            {/* Close button */}
            <button
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Lock Icon */}
            <div className="flex flex-col items-center text-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white text-sm font-semibold tracking-wide uppercase">
                  Administrator Access
                </h3>
                <p className="text-[10px] text-slate-400 mt-1 max-w-[240px]">
                  Provide authorization credentials to unlock editing controls across the website.
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                  placeholder="Enter administrator password..."
                  autoFocus
                  className="w-full px-3.5 py-2.5 bg-black/55 border border-white/10 hover:border-white/15 focus:border-cyan-500/50 rounded-lg text-xs text-white placeholder-slate-500 outline-none transition-all pr-10 font-mono tracking-wider"
                />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {passwordError && (
                <div className="text-[10px] text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-lg font-mono flex items-center gap-1.5 animate-pulse">
                  <span className="w-1 h-1 rounded-full bg-rose-400" />
                  {passwordError}
                </div>
              )}

              <div className="flex gap-2.5 mt-1">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white rounded-lg text-xs font-semibold cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:text-cyan-300 rounded-lg text-xs font-bold cursor-pointer transition-all shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                >
                  Authorize
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </header>
  );
};
