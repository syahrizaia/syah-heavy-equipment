/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import { 
  Search, Plus, Edit2, Trash2, Wrench, 
  ChevronLeft, ChevronRight, AlertTriangle, 
  Package, PackageCheck, Layers 
} from "lucide-react";

// Data Awal Suku Cadang
const INITIAL_PARTS = [
  { id: "P001", name: "Hydraulic Pump Assy", part_number: "708-2L-00300", category: "Hidrolik", price: "Rp 24.500.000", stock: 3, compatibility: "Excavator PC200-8" },
  { id: "P002", name: "Oil Filter Heavy Duty", part_number: "600-211-1340", category: "Filter", price: "Rp 350.000", stock: 25, compatibility: "Bulldozer D85ESS" },
  { id: "P003", name: "Track Shoe 600mm", part_number: "20Y-32-11110", category: "Undercarriage", price: "Rp 1.850.000", stock: 40, compatibility: "Excavator PC200" },
  { id: "P004", name: "Bucket Tooth Standard", part_number: "205-70-19570", category: "G.E.T (Tooth)", price: "Rp 450.000", stock: 2, compatibility: "Excavator PC200" }, // Low Stock
  { id: "P005", name: "Alternator 24V 60A", part_number: "600-825-1160", category: "Elektrikal", price: "Rp 3.200.000", stock: 5, compatibility: "Dump Truck HD785" },
  { id: "P006", name: "Fuel Filter Pre-Filter", part_number: "600-319-3550", category: "Filter", price: "Rp 420.000", stock: 0, compatibility: "Excavator PC300-8" }, // Habis
  { id: "P007", name: "V-Belt Set", part_number: "04120-21753", category: "Engine", price: "Rp 275.000", stock: 15, compatibility: "Greader GD511A" },
  { id: "P008", name: "Turbocharger Garrett", part_number: "6505-67-5030", category: "Engine", price: "Rp 14.800.000", stock: 1, compatibility: "Excavator PC400" }, // Low Stock
  { id: "P009", name: "Track Roller Single", part_number: "20Y-30-00040", category: "Undercarriage", price: "Rp 2.100.000", stock: 8, compatibility: "Excavator PC200-8" },
  { id: "P010", name: "Sprocket Rim", part_number: "14X-27-11110", category: "Undercarriage", price: "Rp 5.400.000", stock: 4, compatibility: "Bulldozer D85ESS-2" },
  { id: "P011", name: "Seal Kit Boom Cylinder", part_number: "707-99-44110", category: "Hidrolik", price: "Rp 1.150.000", stock: 18, compatibility: "Excavator PC200-7" },
  { id: "P012", name: "Air Filter Outer", part_number: "600-185-4100", category: "Filter", price: "Rp 850.000", stock: 9, compatibility: "All PC200 Series" },
];

export default function SparePartsManagement() {
  const [parts, setParts] = useState(INITIAL_PARTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCat, setActiveCat] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  
  const ITEMS_PER_PAGE = 10; // Batasan maksimal 10 data per halaman

  // --- 1. KALKULASI METRIK SECARA REAL-TIME ---
  const metrics = useMemo(() => {
    const totalSKU = parts.length;
    const totalStock = parts.reduce((acc, curr) => acc + curr.stock, 0);
    const lowStock = parts.filter(p => p.stock > 0 && p.stock <= 3).length;
    const outOfStock = parts.filter(p => p.stock === 0).length;
    return { totalSKU, totalStock, lowStock, outOfStock };
  }, [parts]);

  // Ekstrak Kategori Unik untuk Filter Dropdown
  const categories = useMemo(() => {
    return ["Semua", ...Array.from(new Set(parts.map((p) => p.category))).sort()];
  }, [parts]);

  // --- 2. FILTER & SORTING DATA ---
  const filteredParts = useMemo(() => {
    return parts
      .filter((part) => {
        const matchesCategory = activeCat === "Semua" || part.category === activeCat;
        const matchesSearch =
          part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          part.part_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
          part.compatibility.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => b.id.localeCompare(a.id)); // Urutan ID terbaru di atas
  }, [parts, searchQuery, activeCat]);

  // --- 3. LOGIK PAGINATION ---
  const totalPages = Math.ceil(filteredParts.length / ITEMS_PER_PAGE);
  const activePage = currentPage > totalPages && totalPages > 0 ? totalPages : currentPage;
  
  const paginatedParts = useMemo(() => {
    return filteredParts.slice((activePage - 1) * ITEMS_PER_PAGE, activePage * ITEMS_PER_PAGE);
  }, [filteredParts, activePage]);

  // --- 4. HANDLER INTERAKSI (SIMULASI CRUD) ---
  const handleDelete = (id: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus suku cadang dengan ID: ${id}?`)) {
      setParts(parts.filter(p => p.id !== id));
    }
  };

  const handleEdit = (part: any) => {
    alert(`Fitur Ubah Data untuk "${part.name}" (P/N: ${part.part_number}) memicu pembukaan form/modal.`);
  };

  const handleAdd = () => {
    alert("Fitur Tambah Suku Cadang Baru memicu pendelegasian ke halaman form atau modul modal.");
  };

  return (
    <div className="bg-black text-white min-h-screen py-12 px-4 md:px-6 max-w-7xl mx-auto w-full">
      
      {/* JUDUL UTAMA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 border-b border-neutral-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold font-barlow uppercase tracking-tight flex items-center gap-2">
            <Wrench className="text-yellow-600" size={24} /> Manajemen Suku Cadang
          </h1>
          <p className="text-xs text-slate-400 mt-1">Kelola inventaris, pantau ketersediaan stok, dan perbarui katalog suku cadang unit.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-yellow-600 hover:bg-yellow-500 text-neutral-950 font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-lg flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
        >
          <Plus size={16} /> Tambah Suku Cadang
        </button>
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
                    {/* ID */}
                    <td className="py-4 px-6 font-mono text-slate-500 font-bold">{part.id}</td>
                    {/* Detail Nama & Part Number */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-200 group-hover:text-yellow-600 transition-colors">{part.name}</span>
                        <span className="text-[11px] font-mono text-slate-500 mt-0.5">P/N: {part.part_number}</span>
                      </div>
                    </td>
                    {/* Kategori */}
                    <td className="py-4 px-6 text-slate-400">{part.category}</td>
                    {/* Kesesuaian */}
                    <td className="py-4 px-6 text-slate-400 italic">{part.compatibility}</td>
                    {/* Status Ketersediaan Stok */}
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
                    {/* Harga */}
                    <td className="py-4 px-6 text-right font-bold text-slate-100 font-mono">{part.price}</td>
                    {/* Tombol Tindakan */}
                    <td className="py-4 px-6">
                      <div className="flex justify-center items-center gap-1">
                        <button 
                          onClick={() => handleEdit(part)} 
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
                    Tidak ditemukan data suku cadang yang sesuai dengan penyaringan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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

    </div>
  );
}