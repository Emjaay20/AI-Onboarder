"use client";

import { useState, useEffect, useRef } from "react";
import { roles, RoleConfig } from "@/lib/roles";
import { type Recommendation } from "@/lib/recommendation-agent";
import { supabase } from "@/lib/supabase";
import { generateAndDownloadConfigs } from "@/lib/config-generator";

// Role icon map for clean SVG-style indicators
const roleIconMap: Record<string, string> = {
  "software-engineer": "</>",
  "blockchain-engineer": "⬡",
  "product-manager": "▦",
  "marketing": "◈",
  "operations": "⚙",
};

// Terminal lines for the system init sequence
const terminalLines = [
  { text: "> Initiating Polygon Blockchain Setup...", color: "text-white/80" },
  { text: "[OK] Resolving dependency graph...", color: "text-emerald-400" },
  { text: "[OK] Fetching marketing analytics RPC endpoints...", color: "text-emerald-400" },
  { text: "[OK] Compiling smart contracts for data hashing...", color: "text-emerald-400" },
  { text: "> Deploying proxy configurations...", color: "text-white/80" },
  { text: "-> Setting up G4 webhooks", color: "text-emerald-400/90" },
];

function TerminalLog({ active }: { active: boolean }) {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (!active) { setVisibleLines(0); return; }
    setVisibleLines(0);
    const timers = terminalLines.map((_, i) =>
      setTimeout(() => setVisibleLines(i + 1), i * 380)
    );
    return () => timers.forEach(clearTimeout);
  }, [active]);

  return (
    <div className="mt-8 bg-[#0a0a0c] border border-white/[0.07] rounded p-5 font-mono text-[11px] leading-6 min-h-[120px]">
      <p className="text-[10px] tracking-[0.2em] uppercase text-white/60 mb-3">
        System Initialization Sequence
      </p>
      <div className="space-y-0.5">
        {terminalLines.slice(0, visibleLines).map((line, i) => (
          <p key={i} className={`${line.color} transition-opacity duration-300`}>
            {line.text}
          </p>
        ))}
        {active && visibleLines < terminalLines.length && (
          <span className="inline-block w-1.5 h-3 bg-white/80 cursor-blink" />
        )}
      </div>
    </div>
  );
}

export function RoleSelector() {
  const [selectedRole, setSelectedRole] = useState<RoleConfig | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [terminalActive, setTerminalActive] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleSelect = async (role: RoleConfig) => {
    if (loading) return;
    setSelectedRole(role);
    setLoading(true);
    setRecommendation(null);
    setTerminalActive(false);

    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: role.title }),
      });

      if (!response.ok) throw new Error("Failed to fetch recommendations");

      const recs = await response.json() as Recommendation;
      setRecommendation(recs);
      setTerminalActive(true);

      // Save to Supabase silently
      supabase.from("onboarding_sessions").insert({
        role: role.title,
        recommendations: recs,
      }).then(() => {});

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Scroll panel into view on mobile when results load
  useEffect(() => {
    if (recommendation && panelRef.current) {
      const isMobile = window.innerWidth < 1024;
      if (isMobile) panelRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [recommendation]);

  return (
    <>
      {/* ── ROLE LIST ─────────────────────────────────────────── */}
      <div className="space-y-1">
        {roles.map((role) => {
          const isSelected = selectedRole?.id === role.id;
          return (
            <button
              key={role.id}
              onClick={() => handleSelect(role)}
              disabled={loading}
              className={`
                w-full text-left px-4 py-3.5 rounded-sm border
                flex items-center justify-between
                transition-all duration-200 group
                disabled:cursor-not-allowed
                ${isSelected
                  ? "border-white/20 bg-white/[0.06] border-l-2 border-l-white"
                  : "border-white/[0.06] hover:border-white/20 hover:bg-white/[0.05]"
                }
              `}
            >
              <span className={`text-sm font-medium transition-colors ${isSelected ? "text-white" : "text-white/80 group-hover:text-white"}`}>
                {role.title}
              </span>
              <span className={`text-xs font-mono transition-colors ${isSelected ? "text-white/90" : "text-white/50 group-hover:text-white/80"}`}>
                {roleIconMap[role.id] ?? "›"}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── LOADING STATE ──────────────────────────────────────── */}
      {loading && (
        <div className="mt-8 flex items-center gap-3 text-white/70">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1 h-1 rounded-full bg-white/70 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <span className="text-[11px] tracking-[0.15em] uppercase">Architecting stack...</span>
        </div>
      )}

      {/* ── PERSONALIZED PANEL ────────────────────────────────── */}
      {selectedRole && !loading && recommendation && (
        <RecommendationPanel
          role={selectedRole}
          recommendation={recommendation}
          terminalActive={terminalActive}
          ref={panelRef}
        />
      )}
    </>
  );
}

import { createPortal } from "react-dom";
import { forwardRef } from "react";

interface PanelProps {
  role: RoleConfig;
  recommendation: Recommendation;
  terminalActive: boolean;
}

const RecommendationPanel = forwardRef<HTMLDivElement, PanelProps>(
  function RecommendationPanel({ role, recommendation, terminalActive }, ref) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const content = (
      <div ref={ref} className="bg-[#111114] border border-white/[0.09] rounded-sm overflow-hidden">
        
        {/* Panel header */}
        <div className="px-8 pt-7 pb-6 border-b border-white/[0.07]">
          <div className="flex items-start justify-between gap-4 mb-1">
            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#c9a84c]/90 mb-2 font-medium">
                Domain Secured
              </p>
              <h2 className="text-3xl font-semibold tracking-[-0.02em] leading-tight text-white">
                Your Personalized AI<br />Onboarding
              </h2>
            </div>
            <div className="text-right shrink-0 pt-1">
              <p className="text-[10px] tracking-[0.15em] uppercase text-white/60 mb-1">Target</p>
              <p className="text-sm text-white/90 font-medium">{role.title}</p>
            </div>
          </div>
        </div>

        <div className="px-8 py-7">
          {/* Two-col content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

            {/* Core Tools */}
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-white/60 mb-5 font-medium">
                Core Tools Configuration
              </p>
              <ul className="space-y-4">
                {recommendation.coreTools?.map((tool, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 w-4 h-4 shrink-0 rounded-sm border border-white/30 bg-white/10 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    </span>
                    <span className="text-sm text-white/90 leading-snug">{tool}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skill Path */}
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-white/60 mb-5 font-medium">
                Skill Path (Next 30 Days)
              </p>
              <div className="space-y-5">
                {recommendation.skillPath?.map((step, i) => {
                  const dayRanges = ["DAYS 01-10", "DAYS 11-20", "DAYS 21-30"];
                  return (
                    <div key={i} className="flex gap-4">
                      <div className="shrink-0">
                        <p className="text-[9px] tracking-[0.15em] text-white/50 font-medium mb-0.5 uppercase">
                          {dayRanges[i] ?? `STEP ${String(i+1).padStart(2,"0")}`}
                        </p>
                      </div>
                      <p className="text-sm text-white/80 leading-snug">{step}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Terminal */}
          <TerminalLog active={terminalActive} />

          {/* Productivity Tips (if present) */}
          {recommendation.productivityTips && recommendation.productivityTips.length > 0 && (
            <div className="mt-6 pt-6 border-t border-white/[0.07]">
              <p className="text-[10px] tracking-[0.2em] uppercase text-white/50 mb-4 font-medium">
                Productivity Tips
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recommendation.productivityTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] text-white/70">
                    <span className="text-[#c9a84c]/80 mt-0.5">—</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Download CTA */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => generateAndDownloadConfigs(role.title, recommendation)}
              className="flex items-center gap-3 px-8 py-3.5 border border-[#c9a84c]/60 text-[#c9a84c] text-sm font-medium tracking-[0.05em] rounded-sm hover:bg-[#c9a84c]/20 hover:border-[#c9a84c] transition-all duration-200 group"
            >
              <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download All Configs (ZIP) + Push to GitHub
            </button>
          </div>
        </div>
      </div>
    );

    // Portal into the right column on desktop
    if (!mounted) return null;
    const portal = document.getElementById("recommendation-panel");
    if (portal) return createPortal(content, portal);
    return content;
  }
);
