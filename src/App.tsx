/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { PortfolioProvider, usePortfolio } from "./context/PortfolioContext";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { ResumeView } from "./components/ResumeView";
import { DocumentVault } from "./components/DocumentVault";
import { ThesisView } from "./components/ThesisView";
import { CoverLetterView } from "./components/CoverLetterView";
import { Linkedin, Mail, ArrowUpCircle, ShieldCheck } from "lucide-react";

function PortfolioAppContent() {
  const [activeSection, setActiveSection] = useState<string>("all");
  const { profile } = usePortfolio();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-slate-200 flex flex-col font-sans selection:bg-cyan-500/30">
      
      {/* Top Navigation */}
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Sections rendering depending on selected filters */}
      <main className="flex-1">
        {activeSection === "all" && (
          <div className="animate-fadeIn">
            {/* 1. Hero Summary & Presentation */}
            <div id="hero-sec">
              <Hero />
            </div>

            {/* 2. Timeline, Academic, Tools Section */}
            <div id="resume-sec">
              <ResumeView />
            </div>

            {/* Document attachment & upload vault repository */}
            <div id="vault-sec">
              <DocumentVault />
            </div>

            {/* 3. Deep Learning ML Application Simulator */}
            <div id="thesis-sec">
              <ThesisView />
            </div>

            {/* 4. Cover Letter letterhead layout */}
            <div id="cover-sec">
              <CoverLetterView />
            </div>
          </div>
        )}

        {activeSection === "resume" && (
          <div className="animate-fadeIn">
            <ResumeView />
          </div>
        )}

        {activeSection === "thesis" && (
          <div className="animate-fadeIn">
            <ThesisView />
          </div>
        )}

        {activeSection === "vault" && (
          <div className="animate-fadeIn">
            <DocumentVault />
          </div>
        )}

        {activeSection === "cover" && (
          <div className="animate-fadeIn">
            <CoverLetterView />
          </div>
        )}
      </main>

      {/* Floating Scroll To Top button */}
      <div className="fixed bottom-6 right-6 z-20 no-print">
        <button
          onClick={handleScrollToTop}
          className="p-3 rounded-full bg-slate-950/80 border border-white/10 text-white font-semibold hover:border-cyan-500/50 hover:text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all cursor-pointer active:scale-95 group"
          title="Scroll back to Top header"
        >
          <ArrowUpCircle className="w-5 h-5 group-hover:translate-y-[-2px] transition-transform" />
        </button>
      </div>

      {/* Executive Footer */}
      <footer className="bg-black/80 text-slate-400 py-10 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-1.5 items-center sm:items-start text-center sm:text-left">
            <div className="flex items-center gap-2">
              <div className="h-6.5 w-6.5 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded text-black flex items-center justify-center font-bold text-xs select-none">
                AS
              </div>
              <span className="font-bold font-display text-white text-md">Anadhi Sharma</span>
            </div>
          </div>

          {/* Social connections footer link triggers */}
          <div className="flex gap-6 items-center">
            <a 
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <Linkedin className="w-4 h-4 text-slate-400 hover:text-cyan-400" />
              <span>LinkedIn</span>
            </a>
            <a 
              href={`mailto:${profile.email}`}
              className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <Mail className="w-4 h-4 text-slate-400 hover:text-cyan-400" />
              <span>Email Contact: asharma9albs@gmail.com</span>
            </a>
          </div>

          <p className="text-[10px] text-slate-600 font-mono select-none text-center sm:text-right">
            © {new Date().getFullYear()} Anadhi Sharma. Constructed with React & Firebase Sandbox.
          </p>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioAppContent />
    </PortfolioProvider>
  );
}
