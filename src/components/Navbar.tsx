/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { 
  Cloud, CloudOff, RefreshCw, ShieldAlert, BadgeCheck, 
  ChevronRight, Lock, Key, LogOut, Coffee, Settings 
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

  const handlePrint = () => {
    window.print();
  };

  const dbStatusText = () => {
    if (isFirebaseActive && !isSandboxMode) {
      return isAdmin ? "CONNECTED TO FIRESTORE" : "CONNECTED TO FIRESTORE (READ ONLY GUEST)";
    }
    return isSandboxMode ? "LOCAL STORAGE SANDBOX EDIT EMULATOR ACTIVE" : "LOCAL CACHE STATE ACTIVE";
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
            <span className="text-cyan-400 font-bold bg-cyan-500/10 border border-cyan-500/25 px-1.5 py-0.5 rounded leading-none text-[9px] shadow-[0_0_10px_rgba(6,182,212,0.15)]">
              PLAYGROUND MODE
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
                  ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)] font-bold" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border-transparent"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Print / Download triggers */}
        <div className="flex items-center gap-2">
          {/* Global Editor Switch for absolute discoverability */}
          <button
            onClick={() => toggleSandboxMode(!isSandboxMode)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all shadow-md cursor-pointer border ${
              isSandboxMode 
                ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-bold text-cyan-400" 
                : "bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10 border-white/10"
            }`}
            title="Toggle Live Portfolio Editor Mode"
          >
            <Settings className={`w-3.5 h-3.5 ${isSandboxMode ? "animate-spin-slow text-cyan-400" : "text-slate-400"}`} />
            <span>{isSandboxMode ? "Live Editing Mode" : "Turn On Editor"}</span>
          </button>

          {isSandboxMode && (
            <button
              onClick={async () => {
                if (!user || user.email !== "asharma9albs@gmail.com") {
                  setSyncStatus("login_required");
                  setTimeout(() => setSyncStatus("idle"), 5000);
                  return;
                }
                setSyncStatus("syncing");
                const success = await syncSandboxToFirestore();
                if (success) {
                  setSyncStatus("success");
                  setTimeout(() => setSyncStatus("idle"), 3000);
                } else {
                  setSyncStatus("error");
                  setTimeout(() => setSyncStatus("idle"), 3000);
                }
              }}
              disabled={syncStatus === "syncing"}
              className={`text-xs font-semibold px-3.5 py-2 rounded-lg cursor-pointer transition-all border flex items-center gap-1.5 ${
                syncStatus === "syncing"
                  ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300 animate-pulse"
                  : syncStatus === "success"
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 animate-[pulse_1.5s_infinite]"
                  : syncStatus === "error"
                  ? "bg-red-500/20 border-red-500/40 text-red-300"
                  : syncStatus === "login_required"
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-300 animate-bounce"
                  : "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20 text-emerald-400"
              }`}
              title={
                !user || user.email !== "asharma9albs@gmail.com"
                  ? "Authenticate as owner to publish changes to Google Cloud Firestore"
                  : "Publish all local sandbox edits to Google Cloud Firestore"
              }
            >
              <Cloud className={`w-3.5 h-3.5 ${syncStatus === "syncing" ? "animate-bounce" : ""}`} />
              <span>
                {syncStatus === "syncing"
                  ? "Publishing..."
                  : syncStatus === "success"
                  ? "Published!"
                  : syncStatus === "error"
                  ? "Sync Failed"
                  : syncStatus === "login_required"
                  ? "Login via Top-Right First!"
                  : "Save to Cloud"}
              </span>
            </button>
          )}
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

    </header>
  );
};
