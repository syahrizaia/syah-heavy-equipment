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
  X,
  DollarSign
} from "lucide-react";
import FleetTable from "@/components/FleetTable";
import { toast } from "sonner";

interface FleetItem {
  id: string | number;
  title: string;
  category: string;
  status: string;
  health_score: number;
  is_sold?: boolean;
  price?: number | null;
}

export default function FleetPage() {
  const [fleet, setFleet] = useState<FleetItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [specs, setSpecs] = useState([
    { key: "", value: "" },
    { key: "power", value: "" },
    { key: "weight", value: "" },
    { key: "capacity", value: "" }
  ]);

  const [newUnit, setNewUnit] = useState<any>({ 
    id: null,
    title: "", 
    category: "", 
    model: "", 
    price: "",
    status: "Active", 
    health_score: 100, 
    description: "",
    image_url: "",
    specs: {}
  });

  // Fungsi untuk menambah baris baru
  const addSpecRow = () => {
    setSpecs([...specs, { key: "", value: "" }]);
  };

  const removeSpecRow = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  // Fungsi untuk mengupdate input spesifikasi
  const updateSpec = (index: number, field: 'key' | 'value', val: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = val;
    setSpecs(newSpecs);
  };

  // Fungsi mengambil data dari Supabase
  const fetchFleetData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("fleet")
        .select("id, title, category, status, health_score, model, description, image_url, specs, price")
        .order("title", { ascending: true });

      if (error) throw error;
      setFleet(data || []);
    } catch (error: any) {
      toast.error("Gagal memuat data armada:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFleetData();
  }, []);

  // Fungsi Tambah/Edit Unit ke Supabase
  const handleAddUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let uploadedUrls = newUnit.image_url ? (Array.isArray(newUnit.image_url) ? newUnit.image_url : [newUnit.image_url]) : [];
      
      // Jika ada file baru yang dipilih, upload
      if (selectedFiles.length > 0) {
        uploadedUrls = await uploadMultipleImages();
      }

      const specsObject = specs.reduce((acc, curr) => {
        if (curr.key) {
          // Ubah key menjadi huruf kecil semua dan hapus spasi di awal/akhir
          const normalizedKey = curr.key.trim().toLowerCase();
          acc[normalizedKey] = curr.value;
        }
        return acc;
      }, {} as Record<string, string>);

      const isEditing = newUnit.id !== null;
      
      const unitToSave = {
        ...newUnit,
        price: newUnit.price !== "" && newUnit.price !== null ? Number(newUnit.price) : null,
        is_sold: newUnit.status === "Sold",
        image_url: uploadedUrls,
        specs: specsObject
      };

      if (unitToSave.id === null) {
        delete unitToSave.id;
      }

      // Gunakan .upsert() agar jika ada ID, dia update. Jika tidak, dia buat baru.
      const { error } = await supabase.from("fleet").upsert([unitToSave]);
      if (error) throw error;

      setIsModalOpen(false);
      resetForm();
      await fetchFleetData();

      toast.success(
        isEditing 
          ? "Data unit armada berhasil diperbarui!" 
          : "Unit armada baru berhasil ditambahkan ke sistem!"
      );
    } catch (err: any) {
      toast.error(`Gagal menyimpan data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    const specsArray = item.specs && Object.keys(item.specs).length > 0
      ? Object.entries(item.specs).map(([key, value]) => ({ key, value: String(value) }))
      : [
          { key: "Power", value: "" },
          { key: "Weight", value: "" },
          { key: "Capacity", value: "" }
        ];

    setSpecs(specsArray);

    setNewUnit({
      id: item.id || null,
      title: item.title || "",
      category: item.category || "",
      model: item.model || "",
      price: item.price ?? "",
      status: item.is_sold || item.status === "Sold" ? "Sold" : (item.status || "Active"),
      health_score: item.health_score || 0,
      description: item.description || "",
      image_url: item.image_url || "",
      specs: item.specs || {}
    });
    
    setNewUnit((prev: any) => ({ ...prev, id: item.id })); 
    
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string | number) => {
    toast("Hapus Unit Armada?", {
      description: "Yakin ingin menghapus unit ini dari sistem?",
      duration: Infinity, // Toast tetap mengambang sampai user memilih tindakan
      action: {
        label: "Hapus",
        onClick: async () => {
          setLoading(true); // Aktifkan loading spinner pada tabel
          try {
            const { error } = await supabase.from("fleet").delete().eq("id", id);
            if (error) throw error;
            
            await fetchFleetData();
            toast.success("Unit armada berhasil dihapus dari sistem.");
          } catch (error: any) {
            toast.error(`Gagal menghapus unit: ${error.message}`);
          } finally {
            setLoading(false); // Matikan loading spinner
          }
        },
      },
      cancel: {
        label: "Batal",
        onClick: () => toast.dismiss(), // Tutup toast konfirmasi tanpa aksi apa pun
      },
    });
  };

  const resetForm = () => {
    setNewUnit({ 
      id: null, 
      title: "", 
      category: "", 
      model: "", 
      price: "",
      status: "Active", 
      health_score: 100, 
      description: "", 
      image_url: "", 
      specs: {} 
    });
    setSelectedFiles([]);
    // Reset spesifikasi ke default
    setSpecs([
      { key: "power", value: "" },
      { key: "weight", value: "" },
      { key: "capacity", value: "" }
    ]);
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
  const soldUnits = fleet.filter(f => f.status?.toLowerCase() === "sold" || f.is_sold).length;

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
      case "sold":
        return "bg-neutral-800 text-neutral-400 border-neutral-700/60 line-through opacity-60";
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
    <div className="p-6 py-12 space-y-6">

      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold font-barlow uppercase tracking-tight flex items-center gap-2">
            <Truck className="text-yellow-600" size={24} /> Manajemen Armada
          </h1>
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
        // Mengubah items-center menjadi items-start agar scrollable dari titik paling atas
        <div className="fixed inset-0 bg-black/80 flex justify-center items-start z-50 p-4 overflow-y-auto">
          {/* Menggunakan my-auto agar otomatis centering jika muat, dan beralih ke margin normal jika overflow */}
          <form onSubmit={handleAddUnit} className="bg-neutral-900 border border-neutral-800 p-5 sm:p-6 rounded-xl w-full max-w-lg space-y-4 my-auto sm:my-8">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold text-white">
                {newUnit.id ? "Edit Unit Armada" : "Tambah Unit Armada"}
              </h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors">
                <X size={20}/>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-medium">Nama Unit *</label>
                <input required placeholder="Contoh: Excavator PC200" className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded text-white text-sm focus:outline-none focus:border-yellow-600/50 transition-colors"
                  value={newUnit.title}
                  onChange={(e) => setNewUnit({...newUnit, title: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-medium">Kategori *</label>
                <input required placeholder="Contoh: Excavator" className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded text-white text-sm focus:outline-none focus:border-yellow-600/50 transition-colors"
                  value={newUnit.category}
                  onChange={(e) => setNewUnit({...newUnit, category: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-medium">Model *</label>
                <input required placeholder="Contoh: CAT 320D" className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded text-white text-sm focus:outline-none focus:border-yellow-600/50 transition-colors"
                  value={newUnit.model}
                  onChange={(e) => setNewUnit({...newUnit, model: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-medium">Harga (IDR) / Kosongkan jika Hubungi Kami</label>
                <input type="number" min="0" placeholder="Contoh: 1250000000" className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded text-white text-sm focus:outline-none focus:border-yellow-600/50 transition-colors"
                  value={newUnit.price}
                  onChange={(e) => setNewUnit({...newUnit, price: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-medium">Status Operasional</label>
                <select className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded text-white text-sm focus:outline-none focus:border-yellow-600/50 transition-colors cursor-pointer"
                  value={newUnit.status}
                  onChange={(e) => setNewUnit({...newUnit, status: e.target.value})}>
                  <option value="Active">Active</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Critical">Critical</option>
                  <option value="Sold">Sold</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-medium">Health Score (0-100)</label>
                <input type="number" min="0" max="100" placeholder="100" className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded text-white text-sm focus:outline-none focus:border-yellow-600/50 transition-colors"
                  value={newUnit.health_score}
                  onChange={(e) => setNewUnit({...newUnit, health_score: parseInt(e.target.value) || 0})} />
              </div>
            </div>

            {/* Antarmuka Spesifikasi Dibuat Lebih Responsif dengan min-w-0 agar tidak merusak layout HP */}
            <div className="space-y-3 pt-2">
              <label className="text-sm font-bold text-white block">Spesifikasi Alat</label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {specs.map((row, index) => (
                  <div key={index} className="flex gap-2 items-center w-full">
                    <input 
                      placeholder="Nama: e.g. Berat" 
                      className="flex-1 min-w-0 p-2.5 bg-neutral-950 border border-neutral-800 rounded text-white text-sm focus:outline-none focus:border-yellow-600/50 transition-colors capitalize"
                      value={row.key}
                      onChange={(e) => updateSpec(index, 'key', e.target.value)}
                    />
                    <input 
                      placeholder="Nilai: e.g. 20 Ton" 
                      className="flex-1 min-w-0 p-2.5 bg-neutral-950 border border-neutral-800 rounded text-white text-sm focus:outline-none focus:border-yellow-600/50 transition-colors"
                      value={row.value}
                      onChange={(e) => updateSpec(index, 'value', e.target.value)}
                    />
                    <button 
                      type="button" 
                      onClick={() => removeSpecRow(index)}
                      className="p-2.5 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
                      title="Hapus"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <button 
                type="button" 
                onClick={addSpecRow}
                className="text-xs text-yellow-600 hover:text-yellow-500 font-bold inline-flex items-center gap-1 mt-1 transition-colors"
              >
                + Tambah Spesifikasi
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 font-medium">Deskripsi</label>
              <textarea placeholder="Deskripsi kondisi unit, riwayat penggunaan, dll..." className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded text-white text-sm h-24 resize-none focus:outline-none focus:border-yellow-600/50 transition-colors"
                value={newUnit.description}
                onChange={(e) => setNewUnit({...newUnit, description: e.target.value})} />
            </div>
            
            {newUnit.image_url && !selectedFiles.length && (
              <div className="text-xs text-yellow-600 bg-yellow-600/5 border border-yellow-600/20 p-2 rounded">
                💡 Gambar lama sudah terpasang. Unggah file baru untuk menggantinya.
              </div>
            )}

            <div className="space-y-2 flex flex-col gap-2">
              <label className="text-xs font-medium text-slate-400">Foto Unit</label>
              <input 
                type="file" 
                multiple
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) {
                    setSelectedFiles(Array.from(e.target.files));
                  }
                }}
                className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-bold file:rounded file:bg-neutral-800 file:text-white hover:file:bg-neutral-700 file:cursor-pointer" 
              />
              {newUnit.image_url && (
                <div className="text-xs text-slate-500">
                  File saat ini: {Array.isArray(newUnit.image_url) ? newUnit.image_url.length : 1} foto terhubung.
                </div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-yellow-600 text-neutral-950 py-3 font-bold rounded-lg hover:bg-yellow-500 transition-colors text-sm uppercase tracking-wider mt-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                "Simpan Data Armada"
              )}
            </button>
          </form>
        </div>
      )}

      {/* --- KARTU RINGKASAN METRIK --- */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-neutral-900 border border-neutral-800/60 p-4 rounded-xl  col-span-2 sm:col-span-1 md:col-span-1">
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

        <div className="bg-neutral-900 border border-neutral-800/60 p-4 rounded-xl">
          <div className="flex justify-between items-center text-blue-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Terjual</span>
            <DollarSign size={18} />
          </div>
          <div className="text-2xl font-bold text-blue-400">{soldUnits} <span className="text-xs text-slate-500 font-normal">Unit</span></div>
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