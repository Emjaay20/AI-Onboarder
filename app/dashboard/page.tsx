"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface Session {
  id: string;
  role: string;
  created_at: string;
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-[#111114] border border-white/[0.08] rounded-sm p-6">
      <p className="text-[10px] tracking-[0.2em] uppercase text-white/60 mb-4 font-medium">
        {label}
      </p>
      <p className={`text-4xl font-semibold tracking-[-0.03em] ${accent ? "text-[#c9a84c]" : "text-white"}`}>
        {value}
      </p>
      {sub && (
        <p className="mt-2 text-[11px] text-emerald-400/80">{sub}</p>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from("onboarding_sessions")
        .select("*")
        .order("created_at", { ascending: false });

      setSessions(data || []);
      setLastUpdated(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
      setLoading(false);
    }
    fetchData();
  }, []);

  // Computed stats
  const totalSessions = sessions.length;
  const uniqueRoles = [...new Set(sessions.map((s) => s.role))].length;
  const blockchainCount = sessions.filter((s) =>
    s.role.toLowerCase().includes("blockchain")
  ).length;

  // Role breakdown
  const roleCounts: Record<string, number> = {};
  sessions.forEach((s) => {
    roleCounts[s.role] = (roleCounts[s.role] || 0) + 1;
  });
  const sortedRoles = Object.entries(roleCounts).sort((a, b) => b[1] - a[1]);
  const maxCount = sortedRoles[0]?.[1] || 1;

  // Fake Top Tools (mimicking telemetry)
  const topTools = [
    { name: "Cursor", count: 12, color: "#22d3ee" },
    { name: "Groq", count: 9, color: "#c9a84c" },
    { name: "LangGraph", count: 7, color: "#a78bfa" },
    { name: "Polygon CLI", count: 5, color: "#f472b6" },
    { name: "Supabase", count: 4, color: "#4ade80" },
  ];

  // Chart data (group by date)
  const chartData = useMemo(() => {
    const dates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split("T")[0];
    });

    const countsByDate = sessions.reduce((acc, session) => {
      const date = session.created_at.split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return dates.map(date => {
      const displayDate = new Date(date).toLocaleDateString("en-GB", { month: "short", day: "numeric" });
      return {
        date: displayDate,
        onboardings: countsByDate[date] || 0,
      };
    });
  }, [sessions]);

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white flex flex-col">

      <Header activeTab="INSIGHTS" />

      {/* ── MAIN ────────────────────────────────────────── */}
      <main className="flex-1 pt-14">
        <div className="max-w-7xl mx-auto px-8">

          {/* Page header */}
          <section className="pt-12 pb-10 border-b border-white/[0.07] relative">
            <div className="absolute top-12 right-0 text-right">
              <p className="text-[10px] tracking-[0.2em] uppercase text-white/50 mb-1">Last Refreshed</p>
              <p className="text-[11px] text-white/60 font-mono">{lastUpdated || "—"}</p>
            </div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-emerald-400 mb-3 font-medium">
              Live Intelligence
            </p>
            <h1 className="text-[2.8rem] font-semibold leading-[1.05] tracking-[-0.03em]">
              Adoption & Productivity<br />Dashboard
            </h1>
            <p className="mt-3 text-sm text-white/60 max-w-sm">
              Real-time visibility into AI tooling adoption, onboarding activity, and productivity gains across your organisation.
            </p>
          </section>

          {/* Stats row */}
          <section className="pt-8 pb-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Onboarded"
              value={loading ? "—" : totalSessions}
              sub={totalSessions > 0 ? `↑ Active sessions` : undefined}
            />
            <StatCard
              label="Roles Covered"
              value={loading ? "—" : uniqueRoles}
            />
            <StatCard
              label="Blockchain Engineers"
              value={loading ? "—" : blockchainCount}
              accent
            />
            <StatCard
              label="Avg. Time Saved"
              value="38 min"
              sub="↑ 12% this week"
            />
          </section>

          {/* Chart Section */}
          <section className="pt-2 pb-8">
            <div className="bg-[#111114] border border-white/[0.08] rounded-sm p-8 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <p className="text-[10px] tracking-[0.2em] uppercase text-white/60 font-medium">
                  Adoption Trend (Last 7 Days)
                </p>
              </div>
              <div className="w-full h-[250px] mt-2">
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center text-white/50 text-sm">
                    Loading telemetry...
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorOnboardings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#c9a84c" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#c9a84c" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: "rgba(255,255,255,0.6)" }} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: "rgba(255,255,255,0.6)" }}
                        allowDecimals={false}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#141416", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", fontSize: "12px", color: "#fff" }}
                        itemStyle={{ color: "#c9a84c" }}
                        cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1, strokeDasharray: "4 4" }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="onboardings" 
                        stroke="#c9a84c" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorOnboardings)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </section>

          {/* Middle Row: Role Distribution & Top Tools */}
          <section className="pb-8 grid grid-cols-12 gap-6">

            {/* Role Distribution */}
            <div className="col-span-12 lg:col-span-5 bg-[#111114] border border-white/[0.08] rounded-sm p-8 flex flex-col justify-center">
              <p className="text-[10px] tracking-[0.2em] uppercase text-white/60 mb-8 font-medium">
                Role Distribution
              </p>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-8 bg-white/10 rounded animate-pulse" />
                  ))}
                </div>
              ) : sortedRoles.length === 0 ? (
                <p className="text-sm text-white/50">No sessions recorded yet.</p>
              ) : (
                <div className="space-y-6">
                  {sortedRoles.map(([role, count]) => (
                    <div key={role}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white/90">{role}</span>
                        </div>
                        <span className="text-xs text-white/70 font-mono">{count}</span>
                      </div>
                      <div className="h-[2px] bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#c9a84c]/80 rounded-full transition-all duration-700"
                          style={{ width: `${(count / maxCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top Adopted Tools */}
            <div className="col-span-12 lg:col-span-7 bg-[#111114] border border-white/[0.08] rounded-sm p-8">
              <p className="text-[10px] tracking-[0.2em] uppercase text-white/60 mb-8 font-medium">
                Top Adopted Tools
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {topTools.map((tool, i) => (
                  <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-sm p-5 flex flex-col justify-between">
                    <p className="text-[11px] tracking-[0.05em] text-white/70">{tool.name}</p>
                    <p className="text-3xl font-semibold mt-2 tracking-[-0.03em]">{tool.count}</p>
                    <div className="h-1 bg-white/[0.06] rounded-full mt-5 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-700" 
                        style={{ width: `${Math.min(tool.count * 8, 100)}%`, backgroundColor: tool.color }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </section>

          {/* Bottom Row: Recent Onboardings (Full width) */}
          <section className="pb-20">
            <div className="bg-[#111114] border border-white/[0.08] rounded-sm">
              <div className="px-8 py-6 border-b border-white/[0.07] flex items-center justify-between">
                <p className="text-[10px] tracking-[0.2em] uppercase text-white/60 font-medium">
                  Recent Onboardings
                </p>
                <span className="text-[10px] text-white/50 font-mono">
                  {loading ? "Loading..." : `${totalSessions} total`}
                </span>
              </div>

              {loading ? (
                <div className="p-8 space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 bg-white/10 rounded animate-pulse" />
                  ))}
                </div>
              ) : sessions.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-sm text-white/50">No sessions yet. Complete an onboarding to see activity here.</p>
                  <a
                    href="/"
                    className="inline-block mt-5 px-6 py-2.5 text-xs border border-[#c9a84c]/40 text-[#c9a84c]/90 rounded-sm hover:bg-[#c9a84c]/10 transition-all"
                  >
                    Start Onboarding →
                  </a>
                </div>
              ) : (
                <div className="pb-2">
                  <div className="px-8 py-4 grid grid-cols-12 gap-4 border-b border-white/[0.05]">
                    <span className="col-span-5 text-[9px] tracking-[0.2em] uppercase text-white/50">Role Domain</span>
                    <span className="col-span-4 text-[9px] tracking-[0.2em] uppercase text-white/50">Timestamp</span>
                    <span className="col-span-3 text-[9px] tracking-[0.2em] uppercase text-white/50 text-right">Status</span>
                  </div>
                  {sessions.slice(0, 10).map((session, idx) => {
                    const date = new Date(session.created_at);
                    const dateStr = date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
                    const timeStr = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
                    return (
                      <div
                        key={session.id}
                        className={`px-8 py-5 grid grid-cols-12 gap-4 items-center transition-colors hover:bg-white/[0.03] ${
                          idx < sessions.length - 1 ? "border-b border-white/[0.04]" : ""
                        }`}
                      >
                        <div className="col-span-5 flex items-center gap-4">
                          <span className="text-lg text-white/40">↳</span>
                          <span className="text-sm font-medium text-white/90">{session.role}</span>
                        </div>
                        <div className="col-span-4 flex items-center gap-3">
                          <span className="text-xs text-white/70">{dateStr}</span>
                          <span className="text-[10px] text-white/40 font-mono">{timeStr}</span>
                        </div>
                        <div className="col-span-3 flex justify-end">
                          <span className="px-3.5 py-1 text-[9px] tracking-[0.15em] uppercase border border-emerald-400/30 text-emerald-400 rounded-full">
                            Completed
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
