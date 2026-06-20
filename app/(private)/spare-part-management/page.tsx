/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { 
  Search, Plus, Edit2, Trash2, Wrench, 
  ChevronLeft, ChevronRight, AlertTriangle, 
  Package, PackageCheck, Layers, 
  Loader2, Info, RefreshCw
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import SparePartModalDialog from "@/components/SparePartModalDialog";

export default function SparePartsManagement() {
  const [parts, setParts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCat, setActiveCat] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  
  // State Baru untuk kontrol Modal Dialog
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedPart, setSelectedPart] = useState<any>(null);
  
  const ITEMS_PER_PAGE = 10;

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
      toast.error(`Gagal mengambil data: ${error.message}`);
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

  // Fungsi Pembuka Tambah Data
  const handleOpenAddModal = () => {
    setModalMode("add");
    setSelectedPart(null);
    setIsModalOpen(true);
  };

  // Fungsi Pembuka Edit Data beserta data item baris tabel
  const handleOpenEditModal = (part: any) => {
    setModalMode("edit");
    setSelectedPart(part);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const confirmToastId = toast.warning("Hapus Suku Cadang?", {
      description: `Apakah Anda yakin ingin menghapus secara permanen suku cadang dengan ID: ${id}?`,
      duration: Infinity, 
      action: {
        label: "Hapus",
        onClick: () => {
          toast.dismiss(confirmToastId);

          const deleteOperation = (async () => {
            const { data, error } = await supabase
              .from("spare_parts")
              .delete()
              .eq("id", id)
              .select();
            
            if (error) throw error;

            if (!data || data.length === 0) {
              throw new Error("RLS_ERR: Diizinkan oleh sistem, tetapi diblokir oleh RLS Policy DELETE di Supabase.");
            }
          })();

          toast.promise(deleteOperation, {
            loading: "Sedang menghapus data dari server...",
            success: () => {
              fetchParts(); // Pemicu render ulang tabel pasca sukses
              return "Data suku cadang berhasil dihapus!";
            },
            error: (err: any) => `${err.message || "Terjadi kesalahan"}`,
          });
        },
      },
      cancel: {
        label: "Batal",
        onClick: () => toast.dismiss(confirmToastId), 
      },
    });
  };

  return (
    <div className="bg-black text-white min-h-screen py-12 px-4 md:px-6 max-w-7xl mx-auto w-full">
      
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

      {/* --- MENGHUBUNGKAN MODAL DIALOG MENGGUNAKAN PROPS --- */}
      <SparePartModalDialog 
        isOpen={isModalOpen}
        mode={modalMode}
        selectedPart={selectedPart}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchParts}
      />
    </div>
  );
}