/* eslint-disable @typescript-eslint/no-explicit-any */
import { BarChart3, CheckCircle2, Compass, Globe, ShieldAlert, Truck } from "lucide-react";

interface OperationalAnalyticsProps {
  projectsData: any[] | null;
  shipmentsData: any[] | null;
  fleetData: any[] | null;
}

export default function OperationalAnalyticsSection({
  projectsData,
  shipmentsData,
  fleetData,
}: OperationalAnalyticsProps) {
  
  // 1. DATA ANALYTIC: Distribusi Sektor Proyek & Rata-rata Progres
  const totalProjects = projectsData?.length || 0;
  const ongoingProjects = projectsData?.filter((p) => p.status?.toLowerCase() === "ongoing").length || 0;
  
  const sectorCounts: Record<string, number> = { Mining: 0, Infrastructure: 0, "Oil & Gas": 0 };
  let totalProgress = 0;

  (projectsData || []).forEach((proj) => {
    if (sectorCounts[proj.sector] !== undefined) {
      sectorCounts[proj.sector] += 1;
    }
    totalProgress += proj.progress || 0;
  });

  const avgProjectProgress = totalProjects > 0 ? Math.round(totalProgress / totalProjects) : 0;

  // 2. DATA ANALYTIC: Performa Efisiensi Logistik (Shipments)
  const totalShipments = shipmentsData?.length || 0;
  const activeShipments = shipmentsData?.filter((s) => s.status?.toLowerCase() !== "delivered").length || 0;
  const successfulShipments = totalShipments - activeShipments;
  const deliverySuccessRate = totalShipments > 0 ? Math.round((successfulShipments / totalShipments) * 100) : 100;

  // 3. DATA SCIENCE: Fleet Health Index (Rata-rata Skor Kesehatan Seluruh Alat)
  const validFleets = (fleetData || []).filter((f) => f.health_score !== null);
  const avgHealthScore = validFleets.length > 0 
    ? Math.round(validFleets.reduce((acc, curr) => acc + (curr.health_score || 0), 0) / validFleets.length)
    : 100;

  return (
    <section className="py-12 md:py-16 px-4 md:px-6 max-w-7xl mx-auto border-t border-neutral-900">
      <div className="flex items-center gap-2 mb-2">
        <Compass className="text-yellow-600" size={20} />
        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Big Data & Operations</span>
      </div>
      <h2 className="text-3xl md:text-4xl font-barlow font-bold text-white mb-8 uppercase">Performa Ekosistem Bisnis</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CARD 1: FLEET HEALTH INDEX (DATA SCIENCE MODEL INDIKATOR) */}
        <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-yellow-600/10 flex items-center justify-center text-yellow-600">
                <BarChart3 size={20} />
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase bg-neutral-950 px-2 py-1 border border-neutral-800 rounded">
                Real-time Health
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Fleet Health Index (Rata-Rata)</p>
            <div className="flex items-baseline gap-2 mt-2">
              <h3 className="text-5xl font-bold font-mono tracking-tight text-white">{avgHealthScore}%</h3>
              <span className="text-xs text-emerald-400 font-medium">Kondisi Prima</span>
            </div>
            <p className="text-xs text-slate-400 mt-4 leading-relaxed">
              Skor agregat prediktif berbasis IoT yang memantau performa mesin secara langsung untuk mencegah kendala mekanis struktural di lapangan.
            </p>
          </div>

          {/* Mini Visualisasi Batang Kesehatan */}
          <div className="mt-6">
            <div className="w-full bg-neutral-950 rounded-full h-1.5 overflow-hidden border border-neutral-800">
              <div 
                className="bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500 h-full transition-all duration-500" 
                style={{ width: `${avgHealthScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* CARD 2: JEJAK SEKTOR INDUSTRI (PROJECT DISTRIBUTION ANALYTICS) */}
        <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-400">
                <Globe size={20} />
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase bg-neutral-950 px-2 py-1 border border-neutral-800 rounded">
                {ongoingProjects} Active Proj
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Diversifikasi Sektor Proyek</p>
            
            {/* List Progress Bar Sektor */}
            <div className="mt-4 space-y-3">
              {Object.entries(sectorCounts).map(([sector, count]) => {
                const percentage = totalProjects > 0 ? Math.round((count / totalProjects) * 100) : 0;
                return (
                  <div key={sector}>
                    <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                      <span>{sector}</span>
                      <span>{count} Proyek ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-neutral-950 h-2 rounded border border-neutral-800 overflow-hidden">
                      <div className="bg-blue-500 h-full" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-500 border-t border-neutral-800/60 pt-3 mt-4">
            Rata-rata penyelesaian proyek: <span className="text-white font-bold">{avgProjectProgress}%</span>
          </div>
        </div>

        {/* CARD 3: LOGISTICS SUPPLY CHAIN CAPACITY (SHIPMENT SPEED INDEX) */}
        <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Truck size={20} />
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase bg-neutral-950 px-2 py-1 border border-neutral-800 rounded">
                {activeShipments} In-Transit
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Akurasi Ketepatan Distribusi Alat</p>
            <div className="flex items-baseline gap-2 mt-2">
              <h3 className="text-5xl font-bold font-mono tracking-tight text-white">{deliverySuccessRate}%</h3>
              <span className="text-xs text-slate-400">On-Time Rate</span>
            </div>
            <p className="text-xs text-slate-400 mt-4 leading-relaxed">
              Sistem logistik terpantau GPS end-to-end. Menjamin distribusi komponen suku cadang dan mobilisasi armada berat tiba tepat waktu di lokasi proyek Anda.
            </p>
          </div>

          <div className="mt-4 flex gap-2">
            <div className="flex-1 bg-neutral-950 p-2 border border-neutral-800/80 rounded text-center">
              <span className="block text-[10px] uppercase text-slate-500">Selesai Antar</span>
              <span className="text-xs font-mono font-bold text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                <CheckCircle2 size={10} /> {successfulShipments} Log
              </span>
            </div>
            <div className="flex-1 bg-neutral-950 p-2 border border-neutral-800/80 rounded text-center">
              <span className="block text-[10px] uppercase text-slate-500">Dalam Perjalanan</span>
              <span className="text-xs font-mono font-bold text-yellow-500 flex items-center justify-center gap-1 mt-0.5">
                <ShieldAlert size={10} /> {activeShipments} Unit
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}