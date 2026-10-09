import { createServerSupabase } from "@/lib/supabase-server";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowDownRight, ArrowRight, Radio, ShieldCheck, Wrench, Clock3 } from "lucide-react";
import FleetSection from "@/components/FleetSection";
import FeatureGrid from "@/components/FeatureGrid";
import MarketTrendsSection from "@/components/MarketTrendsSection";
import OperationalAnalyticsSection from "@/components/OperationalAnalyticsSection";
import RentalDemandSection from "@/components/RentalDemandSection";
import MobilePWAButton from "@/components/MobilePWAButton";

const MachineHealthChart = dynamic(() => import("@/components/MachineHealthChart"));

function StatusIndicator({ label, status, alert }: { label: string; status: string; alert?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.07] py-3 last:border-0">
      <span className="text-sm text-slate-300">{label}</span>
      <span className={`flex items-center gap-2 rounded-sm px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${alert ? "bg-amber-400/10 text-amber-300" : "bg-emerald-400/10 text-emerald-300"}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${alert ? "bg-amber-400" : "bg-emerald-400 animate-pulse"}`} />{status}
      </span>
    </div>
  );
}

export const revalidate = 60;

export default async function LandingPage() {
  const supabase = await createServerSupabase();
  const [fleetRes, partsRes, projectsRes, shipmentsRes, rentalRes] = await Promise.all([
    supabase.from("fleet").select("*"),
    supabase.from("spare_parts").select("*"),
    supabase.from("projects").select("*"),
    supabase.from("shipments").select("*"),
    supabase.from("rental_requests").select("*"),
  ]);

  const fleetData = fleetRes.data || [];
  const partsData = partsRes.data || [];
  const projectsData = projectsRes.data || [];
  const shipmentsData = shipmentsRes.data || [];
  const rentalRequestsData = rentalRes.data || [];

  return (
    <main className="industrial-grid min-h-screen w-full overflow-x-hidden bg-[#090d16] text-white">
      <section className="relative isolate flex min-h-[760px] items-center overflow-hidden px-5 pb-20 pt-28 sm:px-8 lg:min-h-[820px]">
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,#090d16_0%,rgba(9,13,22,.94)_34%,rgba(9,13,22,.48)_72%,rgba(9,13,22,.22)_100%),linear-gradient(0deg,#090d16_0%,transparent_45%)]" />
        <div className="hero-image-drift absolute inset-0 -z-30 bg-[url('/excavator.jpg')] bg-cover bg-center opacity-90" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_78%_45%,rgba(245,158,11,.14),transparent_38%)]" />
        <div aria-hidden="true" className="hero-telemetry-sweep pointer-events-none absolute inset-x-0 top-0 z-0 h-32 bg-gradient-to-b from-transparent via-cyan-200/[.07] to-transparent" />
        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-end gap-14 lg:grid-cols-[1.1fr_.9fr]">
          <div className="max-w-3xl pt-8">
            <div className="mb-7 inline-flex items-center gap-2 border border-emerald-400/25 bg-[#090d16]/70 px-3 py-2 font-mono text-[10px] uppercase tracking-[.18em] text-emerald-300 backdrop-blur">
                <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60"/><span className="status-led relative inline-flex h-2 w-2 rounded-full bg-emerald-400"/></span>
              Fleet network operational <span className="text-slate-500">/</span> Indonesia
            </div>
            <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[.32em] text-amber-400 sm:text-sm">Mitra operasional alat berat</p>
            <h1 className="font-barlow text-[clamp(3.8rem,9vw,8.5rem)] font-extrabold uppercase leading-[.78] tracking-[-.045em]">
              Dibangun<br/>untuk <span className="text-amber-400">kerja</span><br/><span className="text-white/80">berat.</span>
            </h1>
            <p className="mt-8 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              Armada tangguh, dukungan teknis responsif, dan visibilitas operasional berbasis IoT untuk menjaga proyek terus bergerak.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <MobilePWAButton />
              <Link href="/fleet" className="group inline-flex items-center gap-3 bg-amber-400 px-6 py-4 text-xs font-extrabold uppercase tracking-[.12em] text-[#111827] transition hover:bg-amber-300">
                Jelajahi Armada <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-3 border border-white/20 bg-white/[.04] px-6 py-4 text-xs font-bold uppercase tracking-[.12em] text-white backdrop-blur transition hover:border-amber-400/70 hover:text-amber-300">
                Konsultasi Proyek
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="ml-auto max-w-[340px] border-l border-amber-400/70 bg-[#090d16]/55 p-6 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="font-mono text-[10px] uppercase tracking-[.2em] text-slate-400">SHE / Fleet telemetry</span><Radio size={16} className="signal-glow text-amber-400"/>
              </div>
              <div className="py-6"><div className="font-barlow text-6xl font-bold">24<span className="text-amber-400">/7</span></div><p className="mt-1 font-mono text-[10px] uppercase tracking-[.16em] text-slate-400">Dukungan operasional</p></div>
              <div className="space-y-1"><StatusIndicator label="Jaringan armada" status="Terhubung"/><StatusIndicator label="Respons servis" status="Siaga 24 jam"/><StatusIndicator label="Standar kerja" status="HSE Ready"/></div>
              <Link href="/tracking" className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-[10px] font-bold uppercase tracking-[.15em] text-slate-300 hover:text-amber-300">Lihat kapabilitas tracking <ArrowDownRight size={15}/></Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 h-px w-[min(88%,1200px)] -translate-x-1/2 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"/>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-2 border-x border-b border-white/[.08] bg-white/[.02] sm:grid-cols-4">
        {[{ value: "IoT", label: "Visibilitas armada", icon: Radio }, { value: "HSE", label: "Standar keselamatan", icon: ShieldCheck }, { value: "24/7", label: "Dukungan teknis", icon: Wrench }, { value: "Siaga", label: "Respons layanan", icon: Clock3 }].map(({value,label,icon:Icon}) => <div key={label} className="flex items-center gap-3 border-b border-r border-white/[.08] p-5 last:border-r-0 sm:border-b-0 sm:p-6"><Icon size={17} className="shrink-0 text-amber-400"/><div><div className="font-barlow text-xl font-bold tracking-wide sm:text-2xl">{value}</div><div className="mt-1 font-mono text-[9px] uppercase tracking-[.12em] text-slate-500 sm:text-[10px]">{label}</div></div></div>)}
      </section>

      <MarketTrendsSection fleetData={fleetData} partsData={partsData} />
      <OperationalAnalyticsSection projectsData={projectsData} shipmentsData={shipmentsData} fleetData={fleetData} />
      <RentalDemandSection rentalRequestsData={rentalRequestsData} />

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end">
          <div><p className="mb-2 font-mono text-[10px] uppercase tracking-[.24em] text-amber-400">Fleet condition / monitoring</p><h2 className="font-barlow text-4xl font-bold uppercase sm:text-5xl">Operational status</h2></div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Live equipment health</span>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="min-h-[300px] border border-white/[.08] bg-[#111827]/70 p-4 sm:p-6 lg:col-span-2"><MachineHealthChart /></div>
          <div className="border border-white/[.08] bg-[#111827]/70 p-6"><div className="mb-4 flex items-center justify-between"><h3 className="font-barlow text-xl font-bold uppercase">Component status</h3><span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"/></div><div><StatusIndicator label="Hidrolik" status="Optimal"/><StatusIndicator label="Sistem bahan bakar" status="Perlu perawatan" alert/><StatusIndicator label="Engine oil" status="Normal"/></div><p className="mt-5 border-l-2 border-amber-400/60 pl-3 text-xs leading-5 text-slate-400">Data kesehatan unit membantu tim merencanakan perawatan secara proaktif.</p></div>
        </div>
      </section>

      <section className="border-y border-white/[.06] bg-[#0d131f] px-5 py-20 sm:px-8"><div className="mx-auto max-w-7xl"><div className="mb-10 max-w-2xl"><p className="mb-2 font-mono text-[10px] uppercase tracking-[.24em] text-amber-400">Built around uptime</p><h2 className="font-barlow text-4xl font-bold uppercase sm:text-5xl">Partner yang siap di lapangan.</h2><p className="mt-4 text-sm leading-6 text-slate-400">Kinerja proyek ditopang oleh kesiapan unit, kru profesional, dan layanan yang dapat diandalkan.</p></div><FeatureGrid /></div></section>
      <FleetSection data={fleetData} />
    </main>
  );
}
