/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  MapPin, CheckCircle2, Clock, ArrowLeft
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation"; // Tambahkan useRouter di sini
import { toast } from "sonner";
import Equipment3DViewer from "@/components/tracking/Equipment3DViewer";

// Mock data dengan koordinat awal terintegrasi
const mockShipment = {
  id: "ship-9901",
  tracking_number: "SHE-TRK-20260614A",
  transaction_type: "rental", // sale | rental | repair
  item_name: "Excavator Komatsu PC200-8 (Unit #03)",
  item_type: "heavy_equipment",
  status: "in_transit",
  origin_address: "Workshop Utama SHE, Bekasi, Jawa Barat",
  destination_address: "Situs Proyek Tambang Batu Bara, Balikpapan, Kaltim",
  estimated_delivery: "18 Juni 2026, 16:00 WITA",
  current_lat: -1.2420432,
  current_lng: 116.8940224,
  current_stage_idx: 2
};

const mockLogs = [
  { id: "1", stage_name: "Order Diproses & Verifikasi Dokumen", description: "Surat Jalan dan Kontrak HSE disetujui admin.", location_name: "Head Office Jakarta", time: "12 Juni 2026, 09:00" },
  { id: "2", stage_name: "Mobilisasi & Loading Unit", description: "Excavator dinaikkan ke Truk Lowbed Trailer.", location_name: "Workshop SHE Bekasi", time: "13 Juni 2026, 14:00" },
  { id: "3", stage_name: "Dalam Perjalanan Laut (In Transit)", description: "Posisi armada berada di Selat Makassar menuju Pelabuhan Semayang.", location_name: "Koordinat Laut Jawa", time: "14 Juni 2026, 10:15" },
  { id: "4", stage_name: "Estimasi: Bongkar Muat & Delivery", description: "Unit diturunkan di lokasi situs proyek client.", location_name: "Situs Proyek Balikpapan", time: "Menunggu..." },
];

export default function TrackingPage() {
  const params = useParams();
  const router = useRouter(); // Inisialisasi router
  const shipmentId = params?.id;
  const [shipment, setShipment] = useState<any>(mockShipment);
  const [logs] = useState<any[]>(mockLogs);

  useEffect(() => {
    if (!shipmentId) return;

    const channel = supabase
      .channel("live-tracking")
      .on(
        "postgres_changes",
        { 
          event: "UPDATE", 
          filter: `id=eq.${shipmentId}`, 
          schema: "public", 
          table: "shipments" 
        },
        (payload) => {
          setShipment(payload.new);
          toast.info("Posisi alat berat diperbarui secara live!");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [shipmentId]);

  const getTransactionBadge = (type: string) => {
    switch (type) {
      case "sale": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "rental": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "repair": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      default: return "bg-neutral-500/10 text-neutral-400";
    }
  };

  const getTransactionLabel = (type: string) => {
    if (type === "sale") return "Jual Beli Suku Cadang/Unit";
    if (type === "rental") return "Penyewaan Alat Berat";
    return "Perbaikan / Maintenance Lokasi";
  };

  const currentStageIndex = Number(shipment.current_stage_idx);
  const progressPercent = logs.length > 1 && Number.isFinite(currentStageIndex)
    ? Math.min(100, Math.max(0, (currentStageIndex / (logs.length - 1)) * 100))
    : 0;

  return (
    <div className="bg-neutral-950 text-white min-h-screen flex flex-col md:flex-row pt-20">
      
      {/* PANEL KIRI: DETAIL & TAHAPAN LOGISTIK */}
      <div className="w-full md:w-[450px] bg-neutral-900 border-r border-neutral-800 p-6 flex flex-col h-screen overflow-y-auto global-scrollbar">
        
        {/* Navigasi Back Modifikasi (Menggunakan router.back) */}
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-yellow-500 mb-6 transition-colors group cursor-pointer bg-transparent border-none outline-none self-start"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Kembali ke Halaman Sebelumnya
        </button>

        {/* Info Utama Resi */}
        <div className="mb-6">
          <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded border ${getTransactionBadge(shipment.transaction_type)}`}>
            {getTransactionLabel(shipment.transaction_type)}
          </span>
          <h1 className="text-xl font-bold font-barlow uppercase tracking-tight mt-3 text-slate-100">
            {shipment.item_name}
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">No. Resi: <span className="text-yellow-500 font-bold">{shipment.tracking_number}</span></p>
        </div>

        {/* Card Estimasi & Alamat */}
        <div className="bg-neutral-950 border border-neutral-800/80 p-4 rounded-xl space-y-3.5 mb-6 text-xs">
          <div className="flex items-center gap-2.5">
            <Clock size={16} className="text-yellow-600 shrink-0" />
            <div>
              <p className="text-slate-500 font-medium">Estimasi Tiba di Lokasi</p>
              <p className="text-slate-200 font-bold">{shipment.estimated_delivery}</p>
            </div>
          </div>
          <div className="border-t border-neutral-900 my-2" />
          <div className="flex gap-2.5">
            <MapPin size={16} className="text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-slate-500 font-medium">Asal Pengiriman</p>
              <p className="text-slate-300">{shipment.origin_address}</p>
            </div>
          </div>
          <div className="flex gap-2.5">
            <MapPin size={16} className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-slate-500 font-medium">Tujuan Akhir Client</p>
              <p className="text-slate-300">{shipment.destination_address}</p>
            </div>
          </div>
        </div>

        {/* TAHAPAN PENGIRIMAN (STEPPER LOG) */}
        <div className="flex-1">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Tahapan Progress Mobilisasi</h3>
            <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-emerald-300">
              <span className="status-led h-1.5 w-1.5 rounded-full bg-emerald-400" /> Live
            </span>
          </div>

          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-slate-500">
              <span>Progress pengiriman</span>
              <span className="text-amber-300">{Math.round(progressPercent)}%</span>
            </div>
            <div
              className="h-1.5 overflow-hidden bg-neutral-800"
              role="progressbar"
              aria-label="Progress mobilisasi"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progressPercent)}
            >
              <div className="mobilization-progress h-full transition-[width] duration-700" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
          
          <div className="relative ml-3.5">
            {logs.map((log, index) => {
              const isCompleted = index <= shipment.current_stage_idx;
              const isCurrent = index === shipment.current_stage_idx;
              const hasNextStage = index < logs.length - 1;

              return (
                <div key={log.id} className={`relative pl-6 ${hasNextStage ? "pb-6" : ""}`}>
                  {hasNextStage && (
                    <span
                      aria-hidden="true"
                      className={`absolute bottom-0 left-[7px] top-4 w-0.5 ${
                        index < shipment.current_stage_idx
                          ? "timeline-flow-complete"
                          : isCurrent
                            ? "timeline-flow-active"
                            : "timeline-flow-pending"
                      }`}
                    />
                  )}
                  <span className={`absolute left-0 top-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all ${
                    isCurrent 
                      ? "bg-yellow-600 border-yellow-500 scale-125 shadow-lg shadow-yellow-600/30 ring-4 ring-neutral-900" 
                      : isCompleted 
                        ? "bg-neutral-900 border-yellow-600 text-yellow-500" 
                        : "bg-neutral-950 border-neutral-800"
                  }`}>
                    {isCurrent && <span aria-hidden="true" className="stage-ripple absolute inset-0 rounded-full border border-amber-300" />}
                    {isCompleted && !isCurrent && <CheckCircle2 size={10} className="fill-yellow-600 text-neutral-950" />}
                  </span>

                  <div className={`text-xs ${isCurrent ? "opacity-100" : isCompleted ? "opacity-80" : "opacity-40"}`}>
                    <h4 className={`font-bold ${isCurrent ? "text-yellow-500 text-sm" : "text-slate-200"}`}>
                      {log.stage_name}
                    </h4>
                    <p className="text-slate-400 mt-1 leading-relaxed">{log.description}</p>
                    <div className="flex items-center gap-4 mt-1.5 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1"><MapPin size={11} /> {log.location_name}</span>
                      <span>•</span>
                      <span>{log.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* PANEL KANAN: VIEWER ALAT BERAT DAN TELEMETRI LIVE */}
      <div className="flex-1 relative h-[70vh] md:h-screen bg-neutral-950">
        <Equipment3DViewer id={String(shipmentId)} itemName={shipment.item_name} />
      </div>

    </div>
  );
}
