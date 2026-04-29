import { RoleSelector } from "@/components/RoleSelector";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white flex flex-col">

      <Header activeTab="HOME" />

      {/* ── MAIN ────────────────────────────────────────────── */}
      <main className="flex-1 pt-14">
        <div className="max-w-7xl mx-auto px-8">

          {/* Hero section */}
          <section className="pt-10 md:pt-16 pb-14 border-b border-white/[0.1]">
            <div className="flex flex-col-reverse md:flex-row md:items-start justify-between gap-8 md:gap-4 relative">
              <div>
                <h1 className="text-[2.5rem] sm:text-[3.5rem] lg:text-[4.5rem] font-semibold leading-[1.05] tracking-[-0.03em] max-w-2xl">
                  Enterprise AI <br className="hidden sm:block" /> Onboarding Engine
                </h1>
                <div className="mt-6 max-w-xl space-y-4 text-sm text-white/70 leading-relaxed">
                  <p>
                    This platform is designed to standardize and accelerate AI adoption across your organization. It eliminates setup friction by providing instant, role-specific AI configurations.
                  </p>
                  <p>
                    <strong>How to use:</strong> Select your operational domain from the sidebar below. The system will analyze your role and automatically provision a customized AI tool stack, a 30-day skill progression path, and a downloadable configuration bundle ready for immediate deployment.
                  </p>
                </div>
              </div>

              {/* System architecture label */}
              <div className="md:text-right shrink-0">
                <p className="text-[11px] md:text-[15px] tracking-[0.2em] uppercase text-white/60 mb-1">System Architecture</p>
                <p className="text-[13px] md:text-[21px] text-white/70 font-light">Built with Groq • LangChain<br className="hidden md:block" /> • Next.js • Supabase</p>
              </div>
            </div>
          </section>

          {/* Two-column layout */}
          <section className="pt-12 pb-20 grid grid-cols-12 gap-8">

            {/* LEFT: Operational Domain sidebar */}
            <div className="col-span-12 lg:col-span-4 xl:col-span-3">
              <p className="text-[11px] tracking-[0.2em] uppercase text-white/70 mb-5 font-medium">
                Operational Domain
              </p>
              <RoleSelector />
            </div>

            {/* RIGHT: Personalized Panel — rendered inside RoleSelector via portal/state */}
            <div id="recommendation-panel" className="col-span-12 lg:col-span-8 xl:col-span-9" />

          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
