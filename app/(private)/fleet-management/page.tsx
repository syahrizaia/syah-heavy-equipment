/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Truck, 
  Wrench, 
  AlertTriangle, 
  Search, 
  Plus, 
  SlidersHorizontal,
  RefreshCw,
  Activity
} from "lucide-react";

interface FleetItem {
  id: string | number;
  title: string;
  category: string;
  status: string;
  health_score: number;
}

export default function FleetPage() {
  const [fleet, setFleet] = useState<FleetItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Fungsi mengambil data dari Supabase
  const fetchFleetData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("fleet")
        .select("id, title, category, status, health_score")
        .order("title", { ascending: true });

      if (error) throw error;
      setFleet(data || []);
    } catch (error: any) {
      console.error("Gagal memuat data armada:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFleetData();
  }, []);

  // Hitung ringkasan statistik secara dinamis
  const totalUnits = fleet.length;
  const activeUnits = fleet.filter(f => f.status?.toLowerCase() === "active").length;
  const maintenanceUnits = fleet.filter(f => f.status?.toLowerCase() === "maintenance").length;
  const criticalUnits = fleet.filter(f => f.status?.toLowerCase() === "critical" || (f.health_score && f.health_score < 70)).length;

  // Filter & Pencarian Data
  const filteredFleet = fleet.filter((item) => {
    const matchesSearch = 
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "All" || 
      item.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Helper warna badge status
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "maintenance":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "critical":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  // Helper warna bar indikator kesehatan
  const getHealthBarColor = (score: number) => {
    if (score >= 85) return "bg-green-500";
    if (score >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="p-6 space-y-6">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Manajemen Fleet</h1>
          <p className="text-sm text-slate-400">Pantau kondisi operasional dan kesehatan alat berat.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={fetchFleetData}
            className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg hover:bg-neutral-800 transition-colors text-slate-400 hover:text-white"
            title="Refresh Data"
          >
            <RefreshCw size={18} className={loading ? "animate-spin text-yellow-600" : ""} />
          </button>
          <button className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-yellow-600 text-neutral-950 px-4 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wider transition-all hover:bg-yellow-500">
            <Plus size={18} strokeWidth={2.5} /> Tambah Unit
          </button>
        </div>
      </div>

      {/* --- KARTU RINGKASAN METRIK --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-neutral-800/60 p-4 rounded-xl">
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Fleet</span>
            <Truck size={18} />
          </div>
          <div className="text-2xl font-bold">{totalUnits} <span className="text-xs text-slate-500 font-normal">Unit</span></div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800/60 p-4 rounded-xl">
          <div className="flex justify-between items-center text-green-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Operasional</span>
            <Activity size={18} />
          </div>
          <div className="text-2xl font-bold text-green-400">{activeUnits} <span className="text-xs text-slate-500 font-normal">Unit</span></div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800/60 p-4 rounded-xl">
          <div className="flex justify-between items-center text-yellow-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Perawatan</span>
            <Wrench size={18} />
          </div>
          <div className="text-2xl font-bold text-yellow-400">{maintenanceUnits} <span className="text-xs text-slate-500 font-normal">Unit</span></div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800/60 p-4 rounded-xl">
          <div className="flex justify-between items-center text-red-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Kondisi Kritis</span>
            <AlertTriangle size={18} />
          </div>
          <div className="text-2xl font-bold text-red-400">{criticalUnits} <span className="text-xs text-slate-500 font-normal">Unit</span></div>
        </div>
      </div>

      {/* --- KONTROL PENCARIAN & FILTER --- */}
      <div className="flex flex-col md:flex-row gap-3 bg-neutral-900/50 p-4 rounded-xl border border-neutral-900">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Cari nama armada atau tipe alat berat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-yellow-600/50 transition-colors"
          />
        </div>
        
        <div className="flex gap-2">
          <div className="relative flex items-center bg-neutral-950 border border-neutral-800 rounded-lg px-3 text-slate-400">
            <SlidersHorizontal size={16} className="mr-2 text-slate-600" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-sm text-slate-200 focus:outline-none py-2.5 pr-4 cursor-pointer appearance-none"
            >
              <option value="All" className="bg-neutral-950">Semua Status</option>
              <option value="Active" className="bg-neutral-950">Active</option>
              <option value="Maintenance" className="bg-neutral-950">Maintenance</option>
              <option value="Critical" className="bg-neutral-950">Critical</option>
            </select>
          </div>
        </div>
      </div>

      {/* --- TABEL DATA ARMADA --- */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/40 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="py-4 px-6">Nama Unit</th>
                <th className="py-4 px-6">Kategori / Tipe</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 w-64">Skor Kesehatan</th>
                <th className="py-4 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw size={16} className="animate-spin text-yellow-600" />
                      Memproses sinkronisasi data Supabase...
                    </div>
                  </td>
                </tr>
              ) : filteredFleet.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    Tidak ada armada yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredFleet.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-800/30 transition-colors group">
                    <td className="py-4 px-6 font-bold text-slate-100 group-hover:text-yellow-600 transition-colors">
                      {item.title}
                    </td>
                    <td className="py-4 px-6 text-slate-400">
                      {item.category || "Heavy Equipment"}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 text-xs font-bold tracking-wide rounded-full border ${getStatusBadge(item.status)}`}>
                        {item.status || "Unknown"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-500">Health Index</span>
                          <span className="font-bold">{item.health_score ?? 0}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${getHealthBarColor(item.health_score ?? 0)}`}
                            style={{ width: `${item.health_score ?? 0}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-xs font-bold text-yellow-600 hover:text-white bg-yellow-600/5 hover:bg-yellow-600 border border-yellow-600/20 px-3 py-1.5 rounded-md transition-all">
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}