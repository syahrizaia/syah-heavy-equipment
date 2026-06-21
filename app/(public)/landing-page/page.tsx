/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import FleetSection from "@/components/FleetSection";
import MachineHealthChart from "@/components/MachineHealthChart";
import FeatureGrid from "@/components/FeatureGrid";
import MarketTrendsSection from "@/components/MarketTrendsSection";
import OperationalAnalyticsSection from "@/components/OperationalAnalyticsSection";
import RentalDemandSection from "@/components/RentalDemandSection";
import MobilePWAButton from "@/components/MobilePWAButton";

// Helper untuk status indicator
function StatusIndicator({ label, status, alert }: any) {
  return (
    <div className="flex justify-between items-center p-3 border-b border-neutral-800">
      <span className="text-white text-sm">{label}</span>
      <span className={`text-xs font-bold px-2 py-1 rounded ${alert ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
        {status}
      </span>
    </div>
  );
}

export default async function LandingPage() {
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
    <main className="bg-neutral-950 min-h-screen text-white w-full overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center px-4 md:px-6">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none" />
        <div className="absolute right-0 top-0 w-full md:w-1/2 h-full bg-gradient-to-l from-yellow-600/10 to-transparent" />
        
        <div className="max-w-7xl mx-auto w-full relative z-10 pt-20">
          <h2 className="text-yellow-600 font-barlow font-bold tracking-[0.2em] md:tracking-[0.4em] uppercase mb-4 text-sm md:text-base">
            Membangun Masa Depan
          </h2>
          <h1 className="text-5xl md:text-9xl font-bold font-barlow leading-[0.9] mb-8">
            SYAH <br/><span className="stroke-white">HEAVY EQUIPMENT</span>
          </h1>
          <p className="max-w-lg text-slate-400 text-base md:text-lg mb-10 leading-relaxed">
            Solusi alat berat terintegrasi dengan teknologi IoT untuk efisiensi operasional maksimal.
          </p>
          <div className="flex gap-4">
            <MobilePWAButton />
            <Link href="/fleet" className="bg-yellow-600 text-neutral-950 px-6 md:px-8 py-3 md:py-4 font-bold uppercase tracking-widest hover:bg-white transition-colors text-sm md:text-base">
              Lihat Katalog
            </Link>
            <Link href="/contact" className="border border-yellow-600 text-yellow-600 px-6 md:px-8 py-3 md:py-4 font-bold uppercase tracking-widest hover:bg-yellow-600 hover:text-neutral-950 transition-colors text-sm md:text-base">
              Konsultasi Proyek
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Section Market & Fleet Trends ─── */}
      <MarketTrendsSection fleetData={fleetData} partsData={partsData} />

      {/* ─── Section 2: Performa Ekosistem & Big Data Operasional ─── */}
      <OperationalAnalyticsSection 
        projectsData={projectsData} 
        shipmentsData={shipmentsData} 
        fleetData={fleetData} 
      />

      {/* Menyisipkan Komponen Analisis Prediksi Sewa */}
      <RentalDemandSection rentalRequestsData={rentalRequestsData} />

      {/* Operational Status */}
      <section className="py-12 px-4 md:px-6 max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-barlow font-bold text-white mb-8">OPERATIONAL STATUS</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 w-full">
                <MachineHealthChart />
              </div>
              <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl w-full">
                <h4 className="text-slate-400 text-xs md:text-sm uppercase mb-4">Status Komponen</h4>
                <div className="space-y-2">
                    <StatusIndicator label="Hidrolik" status="Optimal" />
                    <StatusIndicator label="Sistem Bahan Bakar" status="Perlu Perawatan" alert />
                    <StatusIndicator label="Engine Oil" status="Normal" />
                </div>
              </div>
          </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-neutral-900/50">
        <FeatureGrid />
      </section>

      {/* Fleet Section */}
      <FleetSection data={fleetData || []} />

    </main>
  );
}