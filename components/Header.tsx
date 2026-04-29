"use client";

import { useState } from "react";

interface HeaderProps {
  activeTab?: string;
}

export function Header({ activeTab = "HOME" }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { label: "INSIGHTS", href: "/dashboard", active: activeTab === "INSIGHTS" },
    { label: "BLUEPRINT", href: "#", active: false, disabled: true },
    { label: "REGISTRY", href: "#", active: false, disabled: true },
    { label: "ARCHIVE", href: "#", active: false, disabled: true },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.1] bg-[#0d0d0f]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 md:px-8 h-14 flex items-center justify-between">
        
        {/* Left: Mobile Menu Toggle & Logo */}
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden text-white/70 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
          <a href="/" className="text-sm font-semibold tracking-[0.2em] uppercase text-white hover:text-white/80 transition-colors">
            ARCHETYPE
          </a>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-10">
          {tabs.map((tab) => (
            <a
              key={tab.label}
              href={tab.href}
              className={`text-xs tracking-[0.18em] font-medium transition-colors ${
                tab.active
                  ? "text-white border-b border-white pb-0.5"
                  : tab.disabled
                  ? "text-white/30 cursor-not-allowed"
                  : "text-white/70 hover:text-white"
              }`}
              onClick={(e) => tab.disabled && e.preventDefault()}
            >
              {tab.label}
            </a>
          ))}
        </div>

        {/* Right Side */}
        <div className="hidden md:block">
          {activeTab === "INSIGHTS" ? (
            <a
              href="/"
              className="px-5 py-1.5 text-xs tracking-[0.15em] font-medium border border-[#c9a84c]/80 text-[#c9a84c] rounded hover:bg-[#c9a84c]/20 transition-all"
            >
              ← Back
            </a>
          ) : (
            <a
              href="https://yusuf-saka-portfolio.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-1.5 text-xs tracking-[0.15em] font-medium border border-[#c9a84c]/80 text-[#c9a84c] rounded hover:bg-[#c9a84c]/20 transition-all block text-center"
            >
              Contact
            </a>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.1] bg-[#0d0d0f]">
          <div className="px-6 py-4 flex flex-col gap-4">
            {tabs.map((tab) => (
              <a
                key={tab.label}
                href={tab.href}
                className={`text-xs tracking-[0.18em] font-medium transition-colors ${
                  tab.active
                    ? "text-white"
                    : tab.disabled
                    ? "text-white/30 cursor-not-allowed"
                    : "text-white/70 hover:text-white"
                }`}
                onClick={(e) => tab.disabled && e.preventDefault()}
              >
                {tab.label}
              </a>
            ))}
            
            <div className="pt-4 border-t border-white/[0.05] mt-2">
              {activeTab === "INSIGHTS" ? (
                <a
                  href="/"
                  className="inline-block px-5 py-2 text-xs tracking-[0.15em] font-medium border border-[#c9a84c]/80 text-[#c9a84c] rounded hover:bg-[#c9a84c]/20 transition-all"
                >
                  ← Back to Onboard
                </a>
              ) : (
                <a
                  href="https://yusuf-saka-portfolio.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-5 py-2 text-xs tracking-[0.15em] font-medium border border-[#c9a84c]/80 text-[#c9a84c] rounded hover:bg-[#c9a84c]/20 transition-all"
                >
                  Contact
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
