/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Truck, 
  Briefcase, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Layers,
  Wrench,
  Clock
} from "lucide-react";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalFleet: 0,
    activeFleet: 0,
    maintenanceFleet: 0,
    totalProjects: 0,
    miningProjects: 0,
    infraProjects: 0,
    oilGasProjects: 0,
    criticalAlerts: 0
  });

  useEffect(() => {
    async function getDashboardStats() {
      try {
        setLoading(true);

        const { data: fleetData, error: fleetError } = await supabase
          .from("fleet")
          .select("status, health_score");
        if (fleetError) throw fleetError;

        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .select("sector, status");
        if (projectError) throw projectError;

        // Kumpulan perhitungan statistik dari basis data
        const fleet = fleetData || [];
        const projects = projectData || [];

        const activeF = fleet.filter(f => f.status?.toLowerCase() === "active" || f.status?.toLowerCase() === "optimal").length;
        const maintenanceF = fleet.filter(f => f.status?.toLowerCase() === "maintenance" || f.status?.toLowerCase() === "perlu perawatan").length;
        const criticalA = fleet.filter(f => f.health_score < 70 || f.status?.toLowerCase() === "critical").length;

        const miningP = projects.filter(p => p.sector?.toLowerCase() === "mining").length;
        const infraP = projects.filter(p => p.sector?.toLowerCase() === "infrastructure").length;
        const oilGasP = projects.filter(p => p.sector?.toLowerCase() === "oil & gas").length;

        setData({
          totalFleet: fleet.length,
          activeFleet: activeF,
          maintenanceFleet: maintenanceF,
          totalProjects: projects.length,
          miningProjects: miningP,
          infraProjects: infraP,
          oilGasProjects: oilGasP,
          criticalAlerts: criticalA || 1 // fallback dummy alert untuk simulasi jika data kosong
        });

      } catch (error: any) {
        console.error("Gagal mengambil data statistik:");
        console.error("Message:", error.message);
        console.error("Details:", error.details);
        console.error("Hint:", error.hint);
      } finally {
        setLoading(false);
      }
    }

    getDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs uppercase tracking-widest text-slate-400">Sinkronisasi Sistem Telematika...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white pt-24 pb-16 px-4 md:px-6 w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Dashboard */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-900 pb-6">
          <div>
            <span className="text-yellow-600 font-bold tracking-[0.2em] uppercase text-xs">
              Syah Heavy Equipment Control Center
            </span>
            <h1 className="text-3xl md:text-4xl font-bold font-barlow uppercase mt-1">
              Statistik & Real-time Analytics
            </h1>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-lg flex items-center gap-3 self-start md:self-auto">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">IoT Server Terhubung</span>
          </div>
        </div>

        {/* Baris 1: Ringkasan Metrik Utama (4 Kolom) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Total Fleet */}
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">Total Fleet</p>
                <h3 className="text-4xl font-bold font-barlow mt-2">{data.totalFleet} <span className="text-sm text-slate-500 font-sans font-normal">Unit</span></h3>
              </div>
              <div className="p-3 bg-neutral-950 border border-neutral-800 text-yellow-600 rounded-lg">
                <Truck size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-green-500">
              <TrendingUp size={14} /> <span>{data.activeFleet} Unit Beroperasi Optimal</span>
            </div>
          </div>

          {/* Card 2: Proyek Aktif */}
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">Proyek Berjalan</p>
                <h3 className="text-4xl font-bold font-barlow mt-2">{data.totalProjects} <span className="text-sm text-slate-500 font-sans font-normal">Situs</span></h3>
              </div>
              <div className="p-3 bg-neutral-950 border border-neutral-800 text-yellow-600 rounded-lg">
                <Briefcase size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
              <Layers size={14} /> <span>Tersebar di 3 Sektor Strategis</span>
            </div>
          </div>

          {/* Card 3: Unit Maintenance */}
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">Dalam Perawatan</p>
                <h3 className="text-4xl font-bold font-barlow mt-2">{data.maintenanceFleet} <span className="text-sm text-slate-500 font-sans font-normal">Unit</span></h3>
              </div>
              <div className="p-3 bg-neutral-950 border border-neutral-800 text-orange-500 rounded-lg">
                <Wrench size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-orange-400">
              <Clock size={14} /> <span>Menjaga Efisiensi Siklus Kerja</span>
            </div>
          </div>

          {/* Card 4: Alergi Kritis */}
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">Peringatan Sistem</p>
                <h3 className="text-4xl font-bold font-barlow mt-2">{data.criticalAlerts} <span className="text-sm text-slate-500 font-sans font-normal">Isu</span></h3>
              </div>
              <div className="p-3 bg-neutral-950 border border-neutral-800 text-red-500 rounded-lg">
                <AlertTriangle size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-red-400">
              <CheckCircle size={14} /> <span>Butuh Tindakan Preventif Segera</span>
            </div>
          </div>

        </div>

        {/* Baris 2: Sebaran Distribusi Sektor & Status Kerja */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Box Sebaran Proyek berdasarkan Sektor */}
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Distribusi Alokasi Sektor</h4>
            <div className="space-y-4">
              {/* Sektor Mining */}
              <div>
                <div className="flex justify-between text-xs uppercase tracking-wider mb-2 text-slate-400">
                  <span>Sektor Pertambangan (Mining)</span>
                  <span className="text-white font-bold">{data.miningProjects} Proyek</span>
                </div>
                <div className="w-full bg-neutral-950 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-yellow-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${data.totalProjects ? (data.miningProjects / data.totalProjects) * 100 : 35}%` }}
                  />
                </div>
              </div>

              {/* Sektor Infrastruktur */}
              <div>
                <div className="flex justify-between text-xs uppercase tracking-wider mb-2 text-slate-400">
                  <span>Infrastruktur & Konstruksi</span>
                  <span className="text-white font-bold">{data.infraProjects} Proyek</span>
                </div>
                <div className="w-full bg-neutral-950 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-yellow-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${data.totalProjects ? (data.infraProjects / data.totalProjects) * 100 : 45}%` }}
                  />
                </div>
              </div>

              {/* Sektor Gas & Oil */}
              <div>
                <div className="flex justify-between text-xs uppercase tracking-wider mb-2 text-slate-400">
                  <span>Energi (Oil & Gas)</span>
                  <span className="text-white font-bold">{data.oilGasProjects} Proyek</span>
                </div>
                <div className="w-full bg-neutral-950 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-yellow-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${data.totalProjects ? (data.oilGasProjects / data.totalProjects) * 100 : 20}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Box Log Aktivitas Telematika Komponen */}
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-4">Log Sensor Kritis Sistem</h4>
            <div className="divide-y divide-neutral-800">
              <div className="py-3 flex justify-between items-center text-xs md:text-sm">
                <span className="text-slate-400">Pompa Hidrolik Utama EX-300</span>
                <span className="px-2 py-1 bg-green-500/10 text-green-400 font-bold rounded">94% Optimal</span>
              </div>
              <div className="py-3 flex justify-between items-center text-xs md:text-sm">
                <span className="text-slate-400">Sistem Filter Bahan Bakar DT-12</span>
                <span className="px-2 py-1 bg-red-500/10 text-red-400 font-bold rounded animate-pulse">Perlu Perawatan</span>
              </div>
              <div className="py-3 flex justify-between items-center text-xs md:text-sm">
                <span className="text-slate-400">Tekanan Oli Mesin SD-100</span>
                <span className="px-2 py-1 bg-green-500/10 text-green-400 font-bold rounded">Normal</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}