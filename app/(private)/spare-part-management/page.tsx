/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { 
  Search, Plus, Edit2, Trash2, Wrench, 
  ChevronLeft, ChevronRight, AlertTriangle, 
  Package, PackageCheck, Layers, 
  Loader2,
  X,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  Scale,
  ImageIcon,
  Trash,
  Upload,
  Info,
  RefreshCw
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SparePartsManagement() {
  const [parts, setParts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCat, setActiveCat] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "warning" } | null>(null);
  
  // State untuk Modal Form (Add / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    part_number: "",
    category: "",
    price: 0,
    stock: 0,
    compatibility: "",
    image: [] as string[],
    description: "",   
    weight: "",        
    warranty: ""       
  });
  
  const ITEMS_PER_PAGE = 10; // Batasan maksimal 10 data per halaman

  const triggerToast = (message: string, type: "success" | "error" | "warning") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500); // Otomatis hilang dalam 3.5 detik
  };

  const fetchParts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("spare_parts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setParts(data || []);
    } catch (error: any) {
      triggerToast(`Gagal mengambil data: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParts();
  }, []);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(num);
  };

  const metrics = useMemo(() => {
    const totalSKU = parts.length;
    const totalStock = parts.reduce((acc, curr) => acc + (curr.stock || 0), 0);
    const lowStock = parts.filter(p => p.stock > 0 && p.stock <= 3).length;
    const outOfStock = parts.filter(p => p.stock === 0).length;
    return { totalSKU, totalStock, lowStock, outOfStock };
  }, [parts]);

  const categories = useMemo(() => {
    return ["Semua", ...Array.from(new Set(parts.map((p) => p.category))).sort()];
  }, [parts]);

  const filteredParts = useMemo(() => {
    return parts.filter((part) => {
      const matchesCategory = activeCat === "Semua" || part.category === activeCat;
      const matchesSearch =
        part.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        part.part_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        part.compatibility?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [parts, searchQuery, activeCat]);

  const totalPages = Math.ceil(filteredParts.length / ITEMS_PER_PAGE);
  const activePage = currentPage > totalPages && totalPages > 0 ? totalPages : currentPage;
  
  const paginatedParts = useMemo(() => {
    return filteredParts.slice((activePage - 1) * ITEMS_PER_PAGE, activePage * ITEMS_PER_PAGE);
  }, [filteredParts, activePage]);

  const handleOpenAddModal = () => {
    setModalMode("add");
    setFormData({ 
      id: "", 
      name: "", 
      part_number: "", 
      category: "Hidrolik", 
      price: 0, 
      stock: 0, 
      compatibility: "",
      image: [],
      description: "",   
      weight: "",        
      warranty: ""       
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (part: any) => {
    setModalMode("edit");

    let imageArray: string[] = [];
    if (Array.isArray(part.image)) {
      imageArray = part.image;
    } else if (typeof part.image === "string" && part.image !== "") {
      imageArray = [part.image];
    }

    setFormData({ 
      ...part,
      image: imageArray,
      description: part.description || "", 
      weight: part.weight || "",           
      warranty: part.warranty || ""         
    });
    setIsModalOpen(true);
  };

  const handleMultipleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newUploadedUrls = [...formData.image];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split(".").pop();
        // Membuat nama file acak yang unik agar tidak saling menimpa di storage
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        // Proses upload file ke bucket bernama 'spare-parts'
        const { error: uploadError } = await supabase.storage
          .from("spare-parts")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Ambil URL Publik file yang berhasil diunggah
        const { data } = supabase.storage
          .from("spare-parts")
          .getPublicUrl(filePath);

        if (data?.publicUrl) {
          newUploadedUrls.push(data.publicUrl);
        }
      }

      setFormData(prev => ({ ...prev, image: newUploadedUrls }));
      triggerToast(`${files.length} Gambar berhasil diunggah ke Storage!`, "success");
    } catch (error: any) {
      triggerToast(`Gagal mengunggah gambar: ${error.message}`, "error");
    } finally {
      setUploading(false);
      // Reset input file agar file yang sama bisa diupload ulang jika dibutuhkan
      e.target.value = "";
    }
  };

  const handleRemoveImageItem = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      image: prev.image.filter((_, idx) => idx !== indexToRemove)
    }));
    triggerToast("Gambar dihapus dari daftar.", "warning");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === "add") {
        const { id, ...insertPayload } = formData; 
        const { error } = await supabase.from("spare_parts").insert([insertPayload]);
        if (error) throw error;
        triggerToast("Suku cadang baru berhasil ditambahkan!", "success");
      } else {
        const { error } = await supabase
          .from("spare_parts")
          .update({
            name: formData.name,
            part_number: formData.part_number,
            category: formData.category,
            price: formData.price,
            stock: formData.stock,
            compatibility: formData.compatibility,
            image: formData.image,
            description: formData.description, 
            weight: formData.weight,           
            warranty: formData.warranty         
          })
          .eq("id", formData.id);
        if (error) throw error;
        triggerToast("Data suku cadang berhasil diperbarui!", "success");
      }
      setIsModalOpen(false);
      fetchParts(); // Refresh data
    } catch (error: any) {
      triggerToast(`Gagal menyimpan data: ${error.message}`, "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus suku cadang dengan ID: ${id}?`)) {
      try {
        const { error } = await supabase.from("spare_parts").delete().eq("id", id);
        if (error) throw error;
        triggerToast("Data suku cadang berhasil dihapus!", "warning");
        fetchParts(); // Refresh data
      } catch (error: any) {
        triggerToast(`Gagal menghapus: ${error.message}`, "error");
      }
    }
  };

  return (
    <div className="bg-black text-white min-h-screen py-12 px-4 md:px-6 max-w-7xl mx-auto w-full">

      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl transition-all duration-300 animate-bounce ${
          toast.type === "success" ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-400" :
          toast.type === "error" ? "bg-rose-950/90 border-rose-500/50 text-rose-400" :
          "bg-amber-950/90 border-amber-500/50 text-amber-400"
        }`}>
          {toast.type === "success" && <CheckCircle2 size={18} />}
          {toast.type === "error" && <AlertCircle size={18} />}
          {toast.type === "warning" && <AlertTriangle size={18} />}
          <span className="text-xs font-semibold tracking-wide">{toast.message}</span>
        </div>
      )}
      
      {/* JUDUL UTAMA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-neutral-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold font-barlow uppercase tracking-tight flex items-center gap-2">
            <Wrench className="text-yellow-600" size={24} /> Manajemen Suku Cadang
          </h1>
          <p className="text-xs text-slate-400 mt-1">Kelola inventaris, pantau ketersediaan stok, dan perbarui katalog suku cadang unit.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={fetchParts}
            className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg hover:bg-neutral-800 transition-colors text-slate-400 hover:text-white"
            title="Refresh Data"
          >
            <RefreshCw size={18} className={loading ? "animate-spin text-yellow-600" : ""} />
          </button>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-yellow-600 text-neutral-950 px-4 py-2.5 rounded-lg font-bold text-sm uppercase hover:bg-yellow-500"
          >
            <Plus size={16} /> Tambah Suku Cadang
          </button>
        </div>
      </div>

      {/* METRICS SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-neutral-900 border border-neutral-800/80 p-4 rounded-xl">
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Item (SKU)</span>
            <Layers size={16} className="text-blue-500" />
          </div>
          <div className="text-2xl font-bold font-mono">{metrics.totalSKU} <span className="text-xs text-slate-500 font-normal">Jenis</span></div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800/80 p-4 rounded-xl">
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Kuantitas Stok</span>
            <Package size={16} className="text-green-500" />
          </div>
          <div className="text-2xl font-bold font-mono">{metrics.totalStock} <span className="text-xs text-slate-500 font-normal">Pcs</span></div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800/80 p-4 rounded-xl">
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Stok Menipis (≤3)</span>
            <AlertTriangle size={16} className="text-yellow-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-yellow-500">{metrics.lowStock} <span className="text-xs text-slate-500 font-normal">Item</span></div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800/80 p-4 rounded-xl">
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Stok Habis (Kosong)</span>
            <PackageCheck size={16} className="text-red-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-red-500">{metrics.outOfStock} <span className="text-xs text-slate-500 font-normal">Item</span></div>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6 w-full">
        {/* Kolom Search */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            placeholder="Cari berdasarkan Nama atau Part Number..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white text-xs focus:outline-none focus:border-yellow-600/50 transition-colors"
          />
        </div>

        {/* Dropdown Filter Kategori */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <span className="text-xs text-slate-500 whitespace-nowrap">Filter Kategori:</span>
          <select
            value={activeCat}
            onChange={(e) => { setActiveCat(e.target.value); setCurrentPage(1); }}
            className="bg-neutral-900 border border-neutral-800 rounded-lg text-xs px-3 py-2.5 text-white focus:outline-none focus:border-yellow-600/50 cursor-pointer min-w-[140px]"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* MANAGEMENT DATA TABLE */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-24 text-slate-400 gap-2">
              <Loader2 className="animate-spin text-yellow-600" size={20} />
              <span>Memuat data dari Supabase...</span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950/50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6 w-24">ID</th>
                  <th className="py-4 px-6">Detail Suku Cadang</th>
                  <th className="py-4 px-6">Kategori</th>
                  <th className="py-4 px-6">Kesesuaian Unit</th>
                  <th className="py-4 px-6">Status Stok</th>
                  <th className="py-4 px-6 text-right">Estimasi Harga</th>
                  <th className="py-4 px-6 text-center w-28">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 text-xs">
                {paginatedParts.length > 0 ? (
                  paginatedParts.map((part) => (
                    <tr key={part.id} className="hover:bg-neutral-800/20 transition-colors group">
                      <td className="py-4 px-6 font-mono text-slate-500 font-bold">{part.id}</td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-200 group-hover:text-yellow-600 transition-colors">{part.name}</span>
                          <span className="text-[11px] font-mono text-slate-500 mt-0.5">P/N: {part.part_number}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-400">{part.category}</td>
                      <td className="py-4 px-6 text-slate-400 italic">{part.compatibility}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            part.stock === 0 ? "bg-red-500" : part.stock <= 3 ? "bg-yellow-500" : "bg-green-500"
                        }`} />
                          <span className="font-medium">
                            {part.stock === 0 ? "Habis" : part.stock <= 3 ? `${part.stock} Pcs (Limit)` : `${part.stock} Pcs`}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-slate-100 font-mono">{formatIDR(part.price)}</td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center items-center gap-1">
                          <Link 
                            href={`/spare-part/${part.id}`} 
                            className="p-2 border border-neutral-800 hover:border-emerald-600/50 rounded bg-neutral-950/40 text-slate-400 hover:text-emerald-400 transition-colors"
                            title="Lihat Detail"
                          >
                            <Info size={13} />
                          </Link>
                          <button 
                            onClick={() => handleOpenEditModal(part)} 
                            className="p-2 border border-neutral-800 hover:border-blue-600/50 rounded bg-neutral-950/40 text-slate-400 hover:text-blue-400 transition-colors"
                            title="Ubah Data"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button 
                            onClick={() => handleDelete(part.id)} 
                            className="p-2 border border-neutral-800 hover:border-red-600/50 rounded bg-neutral-950/40 text-slate-400 hover:text-red-400 transition-colors"
                            title="Hapus Data"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500 italic">
                      Tidak ditemukan data suku cadang yang sesuai.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* FOOTER NAVIGASI PAGINATION */}
        {totalPages > 1 && (
          <div className="border-t border-neutral-800 bg-neutral-950/20 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[11px] text-slate-400">
              Menampilkan <span className="font-bold text-white">{Math.min((activePage - 1) * ITEMS_PER_PAGE + 1, filteredParts.length)}</span> sampai{" "}
              <span className="font-bold text-white">{Math.min(activePage * ITEMS_PER_PAGE, filteredParts.length)}</span> dari{" "}
              <span className="font-bold text-white">{filteredParts.length}</span> SKU terdaftar
            </span>

            <div className="flex items-center gap-1">
              <button
                disabled={activePage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="p-2 border border-neutral-800 bg-neutral-950 rounded text-white hover:border-yellow-600 disabled:opacity-20 disabled:hover:border-neutral-800 transition-colors"
              >
                <ChevronLeft size={14} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 border rounded font-bold text-xs transition-all ${
                    activePage === page
                      ? "bg-yellow-600 border-yellow-600 text-neutral-950"
                      : "border-neutral-800 bg-neutral-950 text-white hover:border-yellow-600"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={activePage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="p-2 border border-neutral-800 bg-neutral-950 rounded text-white hover:border-yellow-600 disabled:opacity-20 disabled:hover:border-neutral-800 transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- MODAL DIALOG (CREATE / UPDATE) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl max-w-xl w-full overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center bg-neutral-950/60 px-6 py-4 border-b border-neutral-800 shrink-0">
              <h2 className="text-sm font-bold uppercase tracking-wider text-yellow-500">
                {modalMode === "add" ? "Tambah Suku Cadang Baru" : "Ubah Data Suku Cadang"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 text-xs overflow-y-auto flex-1 global-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">ID Kode Unit</label>
                  <input
                    type="text"
                    disabled
                    placeholder={modalMode === "add" ? "Dibuat Otomatis (Increase)" : "ID Terkunci"}
                    value={modalMode === "edit" ? formData.id : ""}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded p-2.5 text-yellow-600 font-bold disabled:opacity-60 focus:outline-none cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Part Number (P/N)</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 708-2L-00300"
                    value={formData.part_number}
                    onChange={(e) => setFormData({ ...formData, part_number: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded p-2.5 text-white focus:outline-none focus:border-yellow-600/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Nama Komponen / Suku Cadang</label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama lengkap barang..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2.5 text-white focus:outline-none focus:border-yellow-600/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Kategori</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Hidrolik, Filter"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded p-2.5 text-white focus:outline-none focus:border-yellow-600/50"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Jumlah Kuantitas Stok</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded p-2.5 text-white focus:outline-none focus:border-yellow-600/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Estimasi Harga (IDR / Rupiah Mentah)</label>
                <input
                  type="number"
                  required
                  min={0}
                  placeholder="Contoh: 450000"
                  value={formData.price || ""}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2.5 text-white font-mono focus:outline-none focus:border-yellow-600/50"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Kesesuaian Unit / Kompatibilitas</label>
                <input
                  type="text"
                  placeholder="Contoh: Excavator PC200-8"
                  value={formData.compatibility}
                  onChange={(e) => setFormData({ ...formData, compatibility: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2.5 text-white focus:outline-none focus:border-yellow-600/50"
                />
              </div>

              <div className="border border-dashed border-neutral-800 bg-neutral-950/40 p-4 rounded-lg">
                <label className="block text-slate-400 mb-2 font-medium flex items-center gap-1.5">
                  <ImageIcon size={14} className="text-slate-500" /> Unggah Foto Produk (Bisa Pilih Banyak)
                </label>
                
                <div className="flex items-center justify-center w-full mb-3">
                  <label className="w-full flex flex-col items-center px-4 py-4 bg-neutral-900 text-slate-400 rounded-lg border border-neutral-800 hover:border-yellow-600/40 cursor-pointer transition-all hover:text-slate-200">
                    {uploading ? (
                      <div className="flex items-center gap-2 py-1 text-xs text-yellow-600 font-medium">
                        <Loader2 className="animate-spin" size={16} />
                        <span>Sedang mengunggah file ke Supabase...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <Upload size={18} className="text-yellow-600" />
                        <span className="text-[11px] tracking-wide">Klik untuk memilih beberapa gambar produk</span>
                      </div>
                    )}
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      disabled={uploading}
                      onChange={handleMultipleImagesUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Grid Preview Alur Antrean Gambar */}
                {formData.image.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-2 bg-neutral-900/50 p-2 rounded-md border border-neutral-900">
                    {formData.image.map((url, idx) => (
                      <div key={idx} className="relative aspect-square rounded-md overflow-hidden border border-neutral-800 group/img">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="Preview" className="object-cover w-full h-full" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImageItem(idx)}
                          className="absolute inset-0 bg-red-600/80 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity text-white"
                          title="Hapus Gambar"
                        >
                          <Trash size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium flex items-center gap-1.5">
                    <Scale size={14} className="text-slate-500" /> Berat Estimasi (e.g. Kg/Gram)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 12.5 Kg atau 450 Gram"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded p-2.5 text-white focus:outline-none focus:border-yellow-600/50"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-slate-500" /> Masa Garansi Toko
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 6 Bulan, 1 Tahun, atau No Warranty"
                    value={formData.warranty}
                    onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded p-2.5 text-white focus:outline-none focus:border-yellow-600/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium flex items-center gap-1.5">
                  <FileText size={14} className="text-slate-500" /> Deskripsi Spesifikasi Suku Cadang
                </label>
                <textarea
                  rows={3}
                  placeholder="Tulis detail spesifikasi mekanis, nomor seri alternatif, atau instruksi kesesuaian unit..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2.5 text-white focus:outline-none focus:border-yellow-600/50 resize-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 mt-4 border-t border-neutral-800 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-neutral-950 border border-neutral-800 hover:bg-neutral-800 rounded text-slate-400 hover:text-white transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-neutral-950 font-bold rounded transition-colors"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}