/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Trash2, Edit2, Info, ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface FleetTableProps {
  data: any[];
  loading: boolean;
  onEdit: (item: any) => void;
  onDelete: (id: string | number) => void;
  getStatusBadge: (status: string) => string;
  getHealthBarColor: (score: number) => string;
}

export default function FleetTable({ data, loading, onEdit, onDelete, getStatusBadge, getHealthBarColor }: FleetTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  const sortedData = [...data].sort((a, b) => {
    const idA = typeof a.id === "number" ? a.id : parseInt(a.id) || 0;
    const idB = typeof b.id === "number" ? b.id : parseInt(b.id) || 0;
    return idB - idA;
  });

  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);

  const activePage = currentPage > totalPages && totalPages > 0 ? totalPages : currentPage;

  const paginatedData = sortedData.slice(
    (activePage - 1) * ITEMS_PER_PAGE,
    activePage * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-950/40 text-xs font-bold uppercase tracking-wider text-slate-400">
              <th className="py-4 px-6">Nama Unit</th>
              <th className="py-4 px-6">Kategori</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 w-64">Skor Kesehatan</th>
              <th className="py-4 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/50 text-sm">
            {loading ? (
              <tr><td colSpan={5} className="py-12 text-center text-slate-500">Memuat data...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={5} className="py-12 text-center text-slate-500">Tidak ada data.</td></tr>
            ) : (
              paginatedData.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-800/30 transition-colors group">
                  <td className="py-4 px-6 font-bold text-slate-100">{item.title}</td>
                  <td className="py-4 px-6 text-slate-400">{item.category}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${getStatusBadge(item.status)}`}>
                      {item.status}
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
                  <td className="py-4 px-6 flex justify-end gap-2">
                    <Link href={`/fleet/${item.id}`} className="p-2 text-slate-400 hover:text-yellow-400"><Info size={16}/></Link>
                    <button onClick={() => onEdit(item)} className="p-2 text-slate-400 hover:text-blue-400"><Edit2 size={16}/></button>
                    <button onClick={() => onDelete(item.id)} className="p-2 text-slate-400 hover:text-red-400"><Trash2 size={16}/></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- UI NAVIGASI PAGINATION TABLE --- */}
      {!loading && totalPages > 1 && (
        <div className="border-t border-neutral-800 bg-neutral-950/20 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Informasi Baris Data */}
          <span className="text-xs text-slate-400">
            Menampilkan <span className="font-bold text-white">{Math.min((activePage - 1) * ITEMS_PER_PAGE + 1, sortedData.length)}</span> sampai{" "}
            <span className="font-bold text-white">{Math.min(activePage * ITEMS_PER_PAGE, sortedData.length)}</span> dari{" "}
            <span className="font-bold text-white">{sortedData.length}</span> data unit
          </span>

          {/* Tombol Halaman */}
          <div className="flex items-center gap-1">
            <button
              disabled={activePage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="p-2 border border-neutral-800 bg-neutral-950 rounded text-white hover:border-yellow-600 disabled:opacity-20 disabled:hover:border-neutral-800 transition-colors"
              title="Sebelumnya"
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
              title="Selanjutnya"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}