/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Search, 
  Plus, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from "lucide-react";

interface ProjectItem {
  id: string | number;
  name: string;
  location: string;
  status: string; // Active, Planning, Completed, On Hold
  progress: number; // 0 - 100
  start_date: string;
  end_date: string;
  budget: number;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Fungsi mengambil data proyek dari Supabase
  const fetchProjectsData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("id, name, location, status, progress, start_date, end_date, budget")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      console.error("Gagal memuat data proyek:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectsData();
  }, []);

  // Hitung statistik proyek secara dinamis
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status?.toLowerCase() === "active").length;
  const planningProjects = projects.filter(p => p.status?.toLowerCase() === "planning").length;
  const completedProjects = projects.filter(p => p.status?.toLowerCase() === "completed").length;

  // Filter pencarian dan status
  const filteredProjects = projects.filter((item) => {
    const matchesSearch = 
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "All" || 
      item.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Helper format mata uang Rupiah
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(angka);
  };

  // Helper warna badge status
  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "planning":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "completed":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "on hold":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  // Helper warna progress bar
  const getProgressBarColor = (progress: number) => {
    if (progress === 100) return "bg-purple-500";
    if (progress >= 75) return "bg-green-500";
    if (progress >= 40) return "bg-yellow-600";
    return "bg-blue-500";
  };

  return (
    <div className="p-6 space-y-6">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Proyek Situs</h1>
          <p className="text-sm text-slate-400">Kelola lokasi penugasan alat berat dan lini masa proyek.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={fetchProjectsData}
            className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg hover:bg-neutral-800 transition-colors text-slate-400 hover:text-white"
            title="Refresh Data"
          >
            <RefreshCw size={18} className={loading ? "animate-spin text-yellow-600" : ""} />
          </button>
          <button className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-yellow-600 text-neutral-950 px-4 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wider transition-all hover:bg-yellow-500">
            <Plus size={18} strokeWidth={2.5} /> Proyek Baru
          </button>
        </div>
      </div>

      {/* --- STATISTIK RINGKASAN --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-neutral-800/60 p-4 rounded-xl">
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Proyek</span>
            <Briefcase size={18} />
          </div>
          <div className="text-2xl font-bold">{totalProjects} <span className="text-xs text-slate-500 font-normal">Situs</span></div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800/60 p-4 rounded-xl">
          <div className="flex justify-between items-center text-green-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Sedang Berjalan</span>
            <Clock size={18} />
          </div>
          <div className="text-2xl font-bold text-green-400">{activeProjects} <span className="text-xs text-slate-500 font-normal">Situs</span></div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800/60 p-4 rounded-xl">
          <div className="flex justify-between items-center text-blue-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Tahap Perencanaan</span>
            <AlertCircle size={18} />
          </div>
          <div className="text-2xl font-bold text-blue-400">{planningProjects} <span className="text-xs text-slate-500 font-normal">Situs</span></div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800/60 p-4 rounded-xl">
          <div className="flex justify-between items-center text-purple-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Selesai Kontrak</span>
            <CheckCircle2 size={18} />
          </div>
          <div className="text-2xl font-bold text-purple-400">{completedProjects} <span className="text-xs text-slate-500 font-normal">Situs</span></div>
        </div>
      </div>

      {/* --- FILTERS --- */}
      <div className="flex flex-col sm:flex-row gap-3 bg-neutral-900/50 p-4 rounded-xl border border-neutral-900">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Cari nama proyek atau lokasi wilayah..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-yellow-600/50 transition-colors"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-4 text-sm text-slate-200 focus:outline-none cursor-pointer focus:border-yellow-600/50"
        >
          <option value="All">Semua Status</option>
          <option value="Planning">Planning</option>
          <option value="Active">Active</option>
          <option value="On Hold">On Hold</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* --- GRID UTAMA KARTU PROYEK --- */}
      {loading ? (
        <div className="py-24 text-center text-slate-500 flex items-center justify-center gap-2 bg-neutral-900 border border-neutral-800 rounded-xl">
          <RefreshCw size={18} className="animate-spin text-yellow-600" />
          Menghubungkan ke pusat data proyek...
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="py-24 text-center text-slate-500 bg-neutral-900 border border-neutral-800 rounded-xl">
          Tidak ada proyek situs yang ditemukan.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div 
              key={project.id} 
              className="bg-neutral-900 border border-neutral-800/80 rounded-xl p-5 flex flex-col justify-between hover:border-neutral-700/60 transition-all duration-300 group shadow-lg"
            >
              <div>
                {/* Judul & Status */}
                <div className="flex justify-between items-start gap-2 mb-3">
                  <h3 className="font-bold text-slate-100 group-hover:text-yellow-600 transition-colors line-clamp-1">
                    {project.name}
                  </h3>
                  <span className={`px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded border shrink-0 ${getStatusStyle(project.status)}`}>
                    {project.status || "Unknown"}
                  </span>
                </div>

                {/* Lokasi */}
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                  <MapPin size={14} className="text-slate-600 shrink-0" />
                  <span className="truncate">{project.location || "Lokasi Belum Diatur"}</span>
                </div>

                {/* Anggaran Dana (Budget) */}
                <div className="bg-neutral-950/60 border border-neutral-950 rounded-lg p-3 flex items-center gap-3 mb-5">
                  <div className="p-2 bg-yellow-600/10 rounded-md text-yellow-500">
                    <DollarSign size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Alokasi Budget</p>
                    <p className="text-sm font-bold text-slate-200">{formatRupiah(project.budget || 0)}</p>
                  </div>
                </div>
              </div>

              {/* Batang Progress Operasional */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-medium">Progress Fisik</span>
                    <span className="font-bold text-slate-300">{project.progress ?? 0}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(project.progress ?? 0)}`}
                      style={{ width: `${project.progress ?? 0}%` }}
                    />
                  </div>
                </div>

                {/* Rentang Waktu Kontrak & Tombol Kelola */}
                <div className="border-t border-neutral-800/60 pt-3 flex justify-between items-center text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Calendar size={13} />
                    <span>{project.start_date ? new Date(project.start_date).toLocaleDateString('id-ID', {month: 'short', year: 'numeric'}) : "TBA"}</span>
                    <span>-</span>
                    <span>{project.end_date ? new Date(project.end_date).toLocaleDateString('id-ID', {month: 'short', year: 'numeric'}) : "TBA"}</span>
                  </div>
                  
                  <button className="text-xs font-bold text-slate-400 hover:text-white transition-colors">
                    Kelola &rarr;
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}