/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Truck, 
  User, 
  MapPin, 
  Calendar, 
  Search, 
  Plus, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Building2,
  Check,
  Play,
  Ban,
  X,
} from "lucide-react";

interface RentalItem {
  id: string | number;
  created_at: string;
  full_name: string;
  company_name: string | null;
  equipment_type: string;
  duration: string;
  project_location: string;
  start_date: string;
  additional_notes: string | null;
  status: string; // pending, active, completed, cancelled
  estimated_cost?: number; // Opsional: jika Anda ingin menambahkan kolom biaya nantinya
}

export default function RentalsPage() {
  const [rentals, setRentals] = useState<RentalItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedRental, setSelectedRental] = useState<RentalItem | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fungsi mengambil data penyewaan dari Supabase
  const fetchRentalsData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("rental_requests")
        .select("id, created_at, full_name, company_name, equipment_type, duration, project_location, start_date, additional_notes, status")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRentals(data || []);
    } catch (error: any) {
      console.error("Gagal memuat data penyewaan:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentalsData();
  }, []);

  const handleUpdateStatus = async (id: string | number, newStatus: string) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("rental_requests")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      // Update state lokal secara instan tanpa reload halaman full
      setRentals((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
      
      // Tutup modal setelah berhasil
      setSelectedRental(null);
    } catch (error: any) {
      console.error("Gagal memperbarui status:", error.message);
      alert("Terjadi kesalahan saat memperbarui status order.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Hitung statistik penyewaan secara dinamis
  const totalRentals = rentals.length;
  const pendingRentals = rentals.filter(r => r.status?.toLowerCase() === "pending").length;
  const activeRentals = rentals.filter(r => r.status?.toLowerCase() === "active").length;
  const completedRentals = rentals.filter(r => r.status?.toLowerCase() === "completed").length;

  // Filter pencarian dan status
  const filteredRentals = rentals.filter((item) => {
    const matchesSearch = 
      item.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.equipment_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.project_location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.company_name && item.company_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = 
      statusFilter === "All" || 
      item.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Helper format mata uang Rupiah (Jika kolom biaya diaktifkan di masa depan)
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(angka);
  };

  // Helper warna badge status sewa
  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "completed":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="p-6 py-12 space-y-6 text-white">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold font-barlow uppercase tracking-tight flex items-center gap-2">
            <Truck className="text-yellow-600" size={24} /> Manajemen Penyewaan Armada
          </h1>
          <p className="text-sm text-slate-400">Pantau masuknya formulir sewa, kontrak unit, dan durasi operasional alat berat.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={fetchRentalsData}
            className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg hover:bg-neutral-800 transition-colors text-slate-400 hover:text-white"
            title="Refresh Data"
          >
            <RefreshCw size={18} className={loading ? "animate-spin text-yellow-600" : ""} />
          </button>
          <button className="flex items-center gap-2 bg-yellow-600 text-neutral-950 px-4 py-2.5 rounded-lg font-bold text-sm uppercase hover:bg-yellow-500">
            <Plus size={18} strokeWidth={2.5} /> Sewa Manual
          </button>
        </div>
      </div>

      {/* --- STATISTIK RINGKASAN --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-neutral-800/60 p-4 rounded-xl">
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Request</span>
            <Truck size={18} />
          </div>
          <div className="text-2xl font-bold">{totalRentals} <span className="text-xs text-slate-500 font-normal">Order</span></div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800/60 p-4 rounded-xl">
          <div className="flex justify-between items-center text-yellow-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Butuh Review</span>
            <AlertCircle size={18} />
          </div>
          <div className="text-2xl font-bold text-yellow-500">{pendingRentals} <span className="text-xs text-slate-500 font-normal">Pending</span></div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800/60 p-4 rounded-xl">
          <div className="flex justify-between items-center text-green-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Unit Beroperasi</span>
            <Clock size={18} />
          </div>
          <div className="text-2xl font-bold text-green-400">{activeRentals} <span className="text-xs text-slate-500 font-normal">Aktif</span></div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800/60 p-4 rounded-xl">
          <div className="flex justify-between items-center text-purple-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Selesai Masa Sewa</span>
            <CheckCircle2 size={18} />
          </div>
          <div className="text-2xl font-bold text-purple-400">{completedRentals} <span className="text-xs text-slate-500 font-normal">Selesai</span></div>
        </div>
      </div>

      {/* --- FILTERS --- */}
      <div className="flex flex-col sm:flex-row gap-3 bg-neutral-900/50 p-4 rounded-xl border border-neutral-900">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Cari nama klien, instansi perusahaan, atau tipe alat berat..."
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
          <option value="Pending">Pending Review</option>
          <option value="Active">Active Operational</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* --- GRID UTAMA KARTU PENYEWAAN --- */}
      {loading ? (
        <div className="py-24 text-center text-slate-500 flex items-center justify-center gap-2 bg-neutral-900 border border-neutral-800 rounded-xl">
          <RefreshCw size={18} className="animate-spin text-yellow-600" />
          Sinkronisasi pusat data penyewaan armada...
        </div>
      ) : filteredRentals.length === 0 ? (
        <div className="py-24 text-center text-slate-500 bg-neutral-900 border border-neutral-800 rounded-xl">
          Tidak ada data log penyewaan armada yang cocok.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRentals.map((rental) => (
            <div 
              key={rental.id} 
              className="bg-neutral-900 border border-neutral-800/80 rounded-xl p-5 flex flex-col justify-between hover:border-neutral-700/60 transition-all duration-300 group shadow-lg"
            >
              <div>
                {/* Jenis Alat Berat & Status Badge */}
                <div className="flex justify-between items-start gap-2 mb-3">
                  <h3 className="font-bold text-slate-100 group-hover:text-yellow-600 transition-colors line-clamp-1">
                    {rental.equipment_type}
                  </h3>
                  <span className={`px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded border shrink-0 ${getStatusStyle(rental.status)}`}>
                    {rental.status || "Unknown"}
                  </span>
                </div>

                {/* Info Klien & Instansi */}
                <div className="space-y-1 mb-4">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <User size={13} className="text-yellow-600/70 shrink-0" />
                    <span className="font-medium truncate">{rental.full_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Building2 size={13} className="text-slate-600 shrink-0" />
                    <span className="truncate">{rental.company_name || "Personal / Perorangan"}</span>
                  </div>
                </div>

                {/* Detail Box: Durasi Sewa Kontrak */}
                <div className="bg-neutral-950/60 border border-neutral-950 rounded-lg p-3 flex items-center gap-3 mb-4">
                  <div className="p-2 bg-yellow-600/10 rounded-md text-yellow-500">
                    <Clock size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Durasi Pemakaian</p>
                    <p className="text-sm font-bold text-slate-200">{rental.duration}</p>
                  </div>
                  {rental.estimated_cost && (
                    <div className="text-right border-l border-neutral-800 pl-3">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Estimasi Nilai</p>
                      <p className="text-xs font-bold text-yellow-600">{formatRupiah(rental.estimated_cost)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Catatan Lapangan & Lokasi Mobilisasi */}
              <div className="space-y-3 pt-2 border-t border-neutral-800/60">
                <div className="flex items-start gap-2 text-xs text-slate-400">
                  <MapPin size={14} className="text-slate-600 mt-0.5 shrink-0" />
                  <span className="line-clamp-1">{rental.project_location}</span>
                </div>

                {rental.additional_notes && (
                  <p className="text-[11px] text-slate-500 bg-neutral-950/30 p-2 rounded border border-neutral-800/40 line-clamp-2 italic">
                    &quot;{rental.additional_notes}&quot;
                  </p>
                )}

                {/* Lini Masa & Tombol Aksi */}
                <div className="pt-1 flex justify-between items-center text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Calendar size={13} />
                    <span>Mulai: {rental.start_date ? new Date(rental.start_date).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'}) : "TBA"}</span>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedRental(rental)}
                    className="text-xs font-bold text-yellow-600 hover:text-yellow-500 transition-colors cursor-pointer"
                  >
                    Kelola Order &rarr;
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ─── MODAL PANEL MANAJEMEN STATUS ORDER ─── */}
      {selectedRental && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl w-full max-w-md space-y-6 shadow-2xl">
            
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <div>
                <h2 className="text-lg font-bold font-barlow uppercase tracking-wider">Panel Kontrol Sewa</h2>
                <p className="text-xs text-slate-400 mt-0.5">ID Order: #{selectedRental.id.toString().slice(0, 8)}...</p>
              </div>
              <button 
                onClick={() => setSelectedRental(null)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-neutral-800 transition-colors"
                disabled={isUpdating}
              >
                <X size={18} />
              </button>
            </div>

            {/* Resume Singkat Klien */}
            <div className="space-y-2 bg-neutral-950/60 p-4 border border-neutral-950 rounded-lg text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Unit Alat:</span><span className="font-bold text-slate-200">{selectedRental.equipment_type}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Nama Klien:</span><span className="font-medium text-slate-300">{selectedRental.full_name}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Durasi Kontrak:</span><span className="text-slate-300 font-semibold">{selectedRental.duration}</span></div>
              <div className="flex justify-between items-center pt-2 border-t border-neutral-800">
                <span className="text-slate-500">Status Saat Ini:</span>
                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${getStatusStyle(selectedRental.status)}`}>
                  {selectedRental.status}
                </span>
              </div>
            </div>

            {/* Opsi Aksi Perubahan Status */}
            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Ubah Status Operasional</label>
              
              <div className="grid grid-cols-1 gap-2">
                {/* 1. Tombol Set ke Active */}
                {selectedRental.status !== "active" && selectedRental.status !== "completed" && (
                  <button
                    onClick={() => handleUpdateStatus(selectedRental.id, "active")}
                    disabled={isUpdating}
                    className="w-full flex items-center gap-3 p-3 bg-neutral-950 border border-neutral-800 hover:border-green-500/40 hover:bg-green-500/5 text-slate-300 hover:text-green-400 rounded-lg text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-40"
                  >
                    <Play size={14} className="text-green-500" /> Mulai Operasional Alat (Active)
                  </button>
                )}

                {/* 2. Tombol Set ke Completed */}
                {selectedRental.status === "active" && (
                  <button
                    onClick={() => handleUpdateStatus(selectedRental.id, "completed")}
                    disabled={isUpdating}
                    className="w-full flex items-center gap-3 p-3 bg-neutral-950 border border-neutral-800 hover:border-purple-500/40 hover:bg-purple-500/5 text-slate-300 hover:text-purple-400 rounded-lg text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-40"
                  >
                    <Check size={14} className="text-purple-500" /> Selesaikan Kontrak Sewa (Completed)
                  </button>
                )}

                {/* 3. Tombol Set ke Cancelled */}
                {selectedRental.status === "pending" && (
                  <button
                    onClick={() => handleUpdateStatus(selectedRental.id, "cancelled")}
                    disabled={isUpdating}
                    className="w-full flex items-center gap-3 p-3 bg-neutral-950 border border-neutral-800 hover:border-red-500/40 hover:bg-red-500/5 text-slate-300 hover:text-red-400 rounded-lg text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-40"
                  >
                    <Ban size={14} className="text-red-500" /> Tolak / Batalkan Order (Cancelled)
                  </button>
                )}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setSelectedRental(null)}
                className="text-xs text-slate-500 hover:text-slate-300 font-medium transition-colors"
                disabled={isUpdating}
              >
                Kembali ke Dashboard
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}