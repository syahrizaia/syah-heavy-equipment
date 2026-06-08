/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import FleetSection from "@/components/FleetSection";
import MachineHealthChart from "@/components/MachineHealthChart";
import FeatureGrid from "@/components/FeatureGrid";
import { ArrowUpRight, Lightbulb, Search, ShoppingBag, TrendingUp, Wrench } from "lucide-react";

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
  const { data: fleetData } = await supabase.from("fleet").select("*");

  // Proses data tren armada (Terjual & Dicari)
  const fleetSoldMap: Record<string, number> = {};
  const fleetSearchMap: Record<string, number> = {};
  const fleetMaintenanceMap: Record<string, number> = {};

  (fleetData || []).forEach((item) => {
    // Kategori Terjual
    if (item.is_sold || item.status?.toLowerCase() === "sold") {
      fleetSoldMap[item.category] = (fleetSoldMap[item.category] || 0) + 1;
    }
    // Kategori Dicari (Menggunakan tracking view_count/search_count dari DB, jika belum ada fallback ke angka basic)
    const searchWeight = item.view_count || item.search_count || 1;
    fleetSearchMap[item.category] = (fleetSearchMap[item.category] || 0) + searchWeight;

    // Data Pendukung Tren Rekomendasi (Kategori paling sering maintenance/kritis)
    if (item.status?.toLowerCase() === "maintenance" || item.status?.toLowerCase() === "critical") {
      fleetMaintenanceMap[item.category] = (fleetMaintenanceMap[item.category] || 0) + 1;
    }
  });

  const topFleetSold = Object.entries(fleetSoldMap).sort((a, b) => b[1] - a[1])[0] || ["Ekskavator", 0];
  const topFleetSearched = Object.entries(fleetSearchMap).sort((a, b) => b[1] - a[1])[0] || ["Bulldozer", 0];
  const topMaintenanceCategory = Object.entries(fleetMaintenanceMap).sort((a, b) => b[1] - a[1])[0] || ["Heavy Truck", 0];

  // Ambil dan proses data tren dari tabel spare_parts
  const { data: partsData } = await supabase.from("spare_parts").select("*");
  const partsSoldMap: Record<string, number> = {};
  const partsSearchMap: Record<string, number> = {};

  (partsData || []).forEach((item) => {
    const soldWeight = item.sold_count || (item.is_sold ? 1 : 0);
    const searchWeight = item.search_count || item.view_count || 1;
    partsSoldMap[item.category] = (partsSoldMap[item.category] || 0) + soldWeight;
    partsSearchMap[item.category] = (partsSearchMap[item.category] || 0) + searchWeight;
  });

  const topPartsSold = Object.entries(partsSoldMap).sort((a, b) => b[1] - a[1])[0] || ["Sistem Hidrolik", 0];
  const topPartsSearched = Object.entries(partsSearchMap).sort((a, b) => b[1] - a[1])[0] || ["Filter Engine", 0];

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
      <section className="py-12 md:py-16 px-4 md:px-6 max-w-7xl mx-auto border-t border-neutral-900">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="text-yellow-600" size={20} />
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Live Analytics</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-barlow font-bold text-white mb-8 uppercase">Tren Pasar & Industri</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Fleet Terjual */}
          <div className="bg-neutral-900/60 border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between group hover:border-yellow-600/30 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
                <ShoppingBag size={20} />
              </div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Armada Terjual Terbanyak</p>
              <h3 className="text-2xl font-bold font-barlow text-white mt-2 capitalize">{topFleetSold[0]}</h3>
            </div>
            <div className="text-xs text-emerald-400 font-mono mt-6 flex items-center gap-1">
              Permintaan Tinggi <ArrowUpRight size={14} />
            </div>
          </div>

          {/* Card 2: Fleet Dicari */}
          <div className="bg-neutral-900/60 border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between group hover:border-yellow-600/30 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 mb-4">
                <Search size={20} />
              </div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Kategori Armada Paling Dicari</p>
              <h3 className="text-2xl font-bold font-barlow text-white mt-2 capitalize">{topFleetSearched[0]}</h3>
            </div>
            <div className="text-xs text-yellow-500 font-mono mt-6 flex items-center gap-1">
              Banyak Dilihat Pengunjung <ArrowUpRight size={14} />
            </div>
          </div>

          {/* Card 3: Suku Cadang Terjual */}
          <div className="bg-neutral-900/60 border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between group hover:border-yellow-600/30 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">
                <ShoppingBag size={20} />
              </div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Suku Cadang Terlaris</p>
              <h3 className="text-2xl font-bold font-barlow text-white mt-2 capitalize">{topPartsSold[0]}</h3>
            </div>
            <div className="text-xs text-blue-400 font-mono mt-6 flex items-center gap-1">
              Perputaran Stok Cepat <ArrowUpRight size={14} />
            </div>
          </div>

          {/* Card 4: Suku Cadang Dicari */}
          <div className="bg-neutral-900/60 border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between group hover:border-yellow-600/30 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4">
                <Search size={20} />
              </div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Suku Cadang Paling Dicari</p>
              <h3 className="text-2xl font-bold font-barlow text-white mt-2 capitalize">{topPartsSearched[0]}</h3>
            </div>
            <div className="text-xs text-purple-400 font-mono mt-6 flex items-center gap-1">
              Restock Direkomendasikan <ArrowUpRight size={14} />
            </div>
          </div>

          {/* Card 5 & 6: Rekomendasi Tren Berbasis Data Operasional */}
          <div className="bg-neutral-900/60 border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between group hover:border-yellow-600/30 transition-colors md:col-span-2 lg:col-span-2">
            <div>
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 mb-4">
                <Lightbulb size={20} />
              </div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Saran Pengadaan & Tren Perawatan Alat</p>
              <div className="mt-3 space-y-2">
                <p className="text-sm text-slate-300 leading-relaxed">
                  Berdasarkan matriks kesehatan mesin, kategori <strong className="text-yellow-600 font-semibold capitalize">{topMaintenanceCategory[0]}</strong> saat ini mencatat tingkat pemeliharaan tertinggi di lapangan. 
                </p>
                <p className="text-xs text-slate-500">
                  💡 <strong>Rekomendasi Strategis:</strong> Alokasikan anggaran ekstra pada penyediaan komponen fast-moving untuk kategori tersebut guna menjamin zero downtime operasional proyek berikutnya.
                </p>
              </div>
            </div>
            <div className="text-xs text-orange-400 font-mono mt-4 flex items-center gap-1">
              Predictive Insights Aktif <Wrench size={12} />
            </div>
          </div>

        </div>
      </section>

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