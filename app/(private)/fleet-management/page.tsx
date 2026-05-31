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
  Activity,
  X
} from "lucide-react";
import FleetTable from "@/components/FleetTable";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [newUnit, setNewUnit] = useState({ 
    title: "", 
    category: "", 
    model: "", 
    status: "Active", 
    health_score: 100, 
    description: "",
    image_url: ""
  });

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

  // Fungsi Tambah Unit ke Supabase
  const handleAddUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let uploadedUrls = newUnit.image_url ? (Array.isArray(newUnit.image_url) ? newUnit.image_url : [newUnit.image_url]) : [];
      
      // Jika ada file baru yang dipilih, upload
      if (selectedFiles.length > 0) {
        uploadedUrls = await uploadMultipleImages();
      }
      
      const unitToSave = {
        ...newUnit,
        image_url: uploadedUrls
      };

      // Gunakan .upsert() agar jika ada ID, dia update. Jika tidak, dia buat baru.
      const { error } = await supabase.from("fleet").upsert([unitToSave]);
      if (error) throw error;

      setIsModalOpen(false);
      resetForm();
      fetchFleetData();
    } catch (err: any) {
      alert("Gagal menyimpan data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setNewUnit(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("Yakin ingin menghapus unit ini?")) return;
    await supabase.from("fleet").delete().eq("id", id);
    fetchFleetData();
  };

  const resetForm = () => {
    setNewUnit({ title: "", category: "", model: "", status: "Active", health_score: 100, description: "", image_url: "" });
    setSelectedFiles([]);
  };

  const uploadMultipleImages = async () => {
    const imageUrls: string[] = [];

    // Gunakan Promise.all agar upload berjalan paralel (lebih cepat)
    await Promise.all(selectedFiles.map(async (file) => {
      const fileName = `${Date.now()}_${file.name}`;
      
      const { error } = await supabase.storage
        .from('fleet-images')
        .upload(fileName, file);

      if (!error) {
        const { data } = supabase.storage.from('fleet-images').getPublicUrl(fileName);
        imageUrls.push(data.publicUrl);
      }
    }));

    return imageUrls;
  };

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
          <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-yellow-600 text-neutral-950 px-4 py-2.5 rounded-lg font-bold text-sm uppercase hover:bg-yellow-500"
          >
            <Plus size={18} /> Tambah Unit
          </button>
        </div>
      </div>

      {/* --- MODAL TAMBAH UNIT --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <form onSubmit={handleAddUnit} className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl w-full max-w-lg space-y-4 my-8">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold text-white">Tambah Unit Armada</h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input required placeholder="Nama Unit" className="p-3 bg-neutral-950 border border-neutral-800 rounded text-white text-sm"
                onChange={(e) => setNewUnit({...newUnit, title: e.target.value})} />
              <input required placeholder="Kategori" className="p-3 bg-neutral-950 border border-neutral-800 rounded text-white text-sm"
                onChange={(e) => setNewUnit({...newUnit, category: e.target.value})} />
            </div>

            <input placeholder="Model" className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded text-white text-sm"
              onChange={(e) => setNewUnit({...newUnit, model: e.target.value})} />

            <div className="grid grid-cols-2 gap-4">
              <select className="p-3 bg-neutral-950 border border-neutral-800 rounded text-white text-sm"
                onChange={(e) => setNewUnit({...newUnit, status: e.target.value})}>
                <option value="Active">Active</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Critical">Critical</option>
              </select>
              <input type="number" placeholder="Health Score (0-100)" className="p-3 bg-neutral-950 border border-neutral-800 rounded text-white text-sm"
                onChange={(e) => setNewUnit({...newUnit, health_score: parseInt(e.target.value)})} />
            </div>

            <textarea placeholder="Deskripsi Unit..." className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded text-white text-sm h-24"
              onChange={(e) => setNewUnit({...newUnit, description: e.target.value})} />

            <div className="space-y-2 flex flex-col md:flex-row gap-2 md:gap-4">
              <label className="text-xs text-slate-400">Pilih Foto Unit:</label>
              <input 
                type="file" 
                multiple
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) {
                    setSelectedFiles(Array.from(e.target.files)); // Simpan sebagai array
                  }
                }}
                className="..." 
              />
            </div>

            <button type="submit" className="w-full bg-yellow-600 text-neutral-950 py-3 font-bold rounded hover:bg-yellow-500 transition-colors">
              Simpan Data Armada
            </button>
          </form>
        </div>
      )}

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
              <option value="Sold" className="bg-neutral-900">Sold</option>
            </select>
          </div>
        </div>
      </div>

      {/* --- TABEL DATA ARMADA --- */}
      <FleetTable
        data={filteredFleet} 
        loading={loading} 
        onEdit={handleEdit} 
        onDelete={handleDelete}
        getStatusBadge={getStatusBadge}
        getHealthBarColor={getHealthBarColor}
      />

    </div>
  );
}