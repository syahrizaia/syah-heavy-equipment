/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Trash2, Edit2, Info } from "lucide-react";
import Link from "next/link";

interface FleetTableProps {
  data: any[];
  loading: boolean;
  onEdit: (item: any) => void;
  onDelete: (id: string | number) => void;
  getStatusBadge: (status: string) => string;
  getHealthBarColor: (score: number) => string;
}

export default function FleetTable({ data, loading, onEdit, onDelete, getStatusBadge, getHealthBarColor }: FleetTableProps) {
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
              data.map((item) => (
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
    </div>
  );
}