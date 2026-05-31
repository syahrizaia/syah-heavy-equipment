/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Zap, Gauge, ShieldCheck, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function StatItem({ icon, label, value, valueColor = "text-white" }: { icon: any, label: string, value: string, valueColor?: string }) {
  return (
    <div className="flex gap-4 items-center">
      <div className="text-yellow-600 shrink-0">{icon}</div>
      <div>
        <div className="text-slate-500 text-[10px] md:text-xs uppercase tracking-widest">{label}</div>
        <div className={`font-bold text-sm md:text-base ${valueColor}`}>{value}</div>
      </div>
    </div>
  );
}

export default function FleetDetailContent({ fleet }: { fleet: any }) {
  // Fungsi untuk memastikan URL valid untuk Next/Image
  const sanitizeUrl = (url: string) => {
    if (!url) return "/placeholder.jpg";
    
    // Jika URL adalah link eksternal (http/https), biarkan
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    
    // Jika URL adalah file lokal, pastikan dimulai dengan "/"
    if (url.startsWith("/")) return url;
    
    // Jika tidak diawali "/", tambahkan "/" secara otomatis
    return `/${url}`;
  };

  // Mengolah array images dengan sanitasi
  const rawImages = Array.isArray(fleet.image_url) 
    ? fleet.image_url 
    : fleet.image_url ? [fleet.image_url] : ["/placeholder.jpg"];

  const images = rawImages.map(sanitizeUrl);

  const whatsappNumber = "6282114487163"; 

  const message = fleet.is_sold 
    ? `Halo, saya melihat unit "${fleet.title}" telah terjual. Apakah ada unit lain yang serupa atau ketersediaan stok baru untuk model ini? Terima kasih.`
    : `Halo, saya tertarik untuk membeli unit berikut:

Nama Unit: ${fleet.title || "-"}
Kategori: ${fleet.category || "-"}
Model: ${fleet.model || "-"}
Status: ${fleet.status || "-"}

Mohon informasi lebih lanjut mengenai ketersediaan dan prosedur pembeliannya. Terima kasih.`;

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  // Fungsi pembantu untuk memformat tanggal bawaan postgres (created_at)
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Menentukan warna teks berdasarkan status unit
  const getStatusColor = (status: string) => {
    if (status?.toLowerCase() === "active") return "text-green-400";
    if (status?.toLowerCase() === "maintenance") return "text-orange-400";
    return "text-red-400";
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white pt-24 pb-16 px-4 md:px-6 w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Navigation */}
        <Link href="/fleet" className="inline-flex items-center gap-2 text-slate-400 hover:text-yellow-600 mb-8 transition-colors text-sm cursor-pointer w-fit">
          <ArrowLeft size={16} /> Kembali ke Katalog
        </Link>

        {/* Hero Section dengan Multi-Image Scroll */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <span className="text-yellow-600 font-bold uppercase tracking-widest text-xs md:text-sm">{fleet.category}</span>
          <h1 className="text-3xl md:text-6xl font-bold font-barlow uppercase mt-2 mb-6 leading-tight">{fleet.title}</h1>
          
          {/* Scrollable Image Gallery */}
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x [scrollbar-width:thin] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:bg-neutral-700">
            {images.map((url: string, idx: number) => (
              <div key={idx} className="relative min-w-[300px] md:min-w-[600px] h-64 md:h-[450px] bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden snap-start shrink-0">
                <Image
                  src={url}
                  alt={`${fleet.title} - Image ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority={idx === 0}
                />
              </div>
            ))}
          </div>
          <p className="text-slate-500 text-xs mt-2 italic">Geser ke samping untuk melihat detail unit lainnya</p>
        </motion.div>

        {/* Body Section */}
        <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
          
          {/* Left Column: Description & Specs */}
          <div className="lg:col-span-2 space-y-8">
            <h3 className="text-xl md:text-2xl font-bold font-barlow text-white border-b border-neutral-800 pb-2">Deskripsi Unit</h3>
            <p className="text-slate-400 leading-relaxed text-sm md:text-base whitespace-pre-line">
              {/* Menampilkan deskripsi dinamis dari database, jika kosong beralih ke teks default */}
              {fleet.description || "Unit ini dirancang untuk performa maksimal di medan yang menantang. Dengan efisiensi bahan bakar yang optimal dan durabilitas tinggi, unit ini menjadi pilihan utama untuk operasional skala besar."}
            </p>
            
            <h3 className="text-xl md:text-2xl font-bold font-barlow pt-6 border-b border-neutral-800 pb-2">Spesifikasi Teknis</h3>
            {fleet.specs && Object.keys(fleet.specs).length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(fleet.specs).map(([key, value]: any) => (
                  <div key={key} className="p-4 border border-neutral-800 rounded-lg bg-neutral-900/40 hover:border-neutral-700 transition-colors">
                      <span className="text-slate-500 text-xs block uppercase mb-1 font-medium tracking-wider">{key}</span>
                      <span className="font-bold text-sm md:text-base text-white">{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm italic">Data spesifikasi teknis belum ditambahkan.</p>
            )}
          </div>

          {/* Right Column: Sidebar Stats (Menampilkan SEMUA Kolom Tabel) */}
          <div className="bg-neutral-900 border border-neutral-800 p-6 md:p-8 self-start rounded-xl shadow-lg space-y-6">
            <h4 className="font-bold font-barlow text-lg md:text-xl border-b border-neutral-800 pb-4 uppercase tracking-wider text-yellow-600">
              Ringkasan Unit
            </h4>
            
            <div className="space-y-5">
              {/* Menampilkan ID (bigint) */}
              <div className="text-[10px] bg-neutral-950 px-2.5 py-1 rounded border border-neutral-800 text-slate-500 w-fit font-mono">
                UNIT ID: #{fleet.id}
              </div>

              {/* Menampilkan Model */}
              <StatItem icon={<Gauge size={20}/>} label="Model" value={fleet.model || "-"} />
              
              {/* Menampilkan Kategori */}
              <StatItem icon={<Zap size={20}/>} label="Kategori" value={fleet.category || "-"} />
              
              {/* Menampilkan Status Dinamis */}
              <StatItem 
                icon={<MapPin size={20}/>} 
                label="Status Operasional" 
                value={fleet.status || "Active"} 
                valueColor={getStatusColor(fleet.status)}
              />

              {/* Menampilkan Health Score */}
              <StatItem 
                icon={<ShieldCheck size={20}/>} 
                label="Skor Kesehatan Alat" 
                value={`${fleet.health_score ?? 100}%`} 
                valueColor={fleet.health_score && fleet.health_score < 70 ? "text-red-400" : "text-yellow-500"}
              />

              {/* Menampilkan Tanggal Registrasi / created_at */}
              <StatItem icon={<Calendar size={20}/>} label="Tanggal Terdaftar" value={formatDate(fleet.created_at)} />
            </div>
            
            {/* Tombol Beli / Tanyakan Unit */}
            <div className="pt-4">
                <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`block text-center w-full py-3.5 font-bold uppercase tracking-widest transition-all text-xs md:text-sm rounded-lg shadow-lg cursor-pointer ${
                    fleet.is_sold 
                    ? "bg-neutral-800 text-slate-400 hover:bg-neutral-700" 
                    : "bg-yellow-600 text-neutral-950 hover:bg-white hover:text-black shadow-yellow-600/10"
                }`}
                >
                    {fleet.is_sold ? "Tanyakan Unit Serupa" : "Hubungi Pembelian"}
                </a>
                {fleet.is_sold && (
                <p className="text-[10px] text-slate-600 mt-2 text-center">
                    Unit ini sudah tidak tersedia.
                </p>
                )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}