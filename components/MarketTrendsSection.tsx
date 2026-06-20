/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowUpRight, Lightbulb, Search, ShoppingBag, TrendingUp, Wrench } from "lucide-react";

interface MarketTrendsSectionProps {
  fleetData: any[] | null;
  partsData: any[] | null;
}

export default function MarketTrendsSection({ fleetData, partsData }: MarketTrendsSectionProps) {
  const fleetSoldMap: Record<string, number> = {};
  const fleetSearchMap: Record<string, number> = {};
  const fleetMaintenanceMap: Record<string, number> = {};

  (fleetData || []).forEach((item) => {
    if (item.is_sold || item.status?.toLowerCase() === "sold") {
      fleetSoldMap[item.category] = (fleetSoldMap[item.category] || 0) + 1;
    }
    
    const searchWeight = item.view_count || item.search_count || 1;
    fleetSearchMap[item.category] = (fleetSearchMap[item.category] || 0) + searchWeight;

    if (item.status?.toLowerCase() === "maintenance" || item.status?.toLowerCase() === "critical") {
      fleetMaintenanceMap[item.category] = (fleetMaintenanceMap[item.category] || 0) + 1;
    }
  });

  const topFleetSold = Object.entries(fleetSoldMap).sort((a, b) => b[1] - a[1])[0] || ["Ekskavator", 0];
  const topFleetSearched = Object.entries(fleetSearchMap).sort((a, b) => b[1] - a[1])[0] || ["Bulldozer", 0];
  const topMaintenanceCategory = Object.entries(fleetMaintenanceMap).sort((a, b) => b[1] - a[1])[0] || ["Heavy Truck", 0];

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
  );
}