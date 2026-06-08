/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart, Wrench, Settings, Package, Truck, CheckCircle2, AlertCircle, Share2, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface OrderItem {
  partId: string;
  currentStock: number;
  quantityBought: number;
}

export async function trackSparePartView(partId: string) {
  const { error } = await supabase.rpc("increment_part_view", { 
    target_id: partId 
  });
  
  if (error) console.error("Gagal mencatat tren view suku cadang:", error.message);
}

export async function processSparePartSale({ partId, currentStock, quantityBought }: OrderItem) {
  // Hitung sisa stok baru
  const newStock = currentStock - quantityBought;

  const { data, error } = await supabase
    .from("spare_parts")
    .update({ stock: newStock }) // Cukup kurangi stoknya saja
    .eq("id", partId);

  if (error) throw new Error(error.message);
  return data;
}

export default function PartDetailContent() {
  const params = useParams();
  const id = params?.id;
  const [part, setPart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [shareCopied, setShareCopied] = useState(false);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const WHATSAPP_NUMBER = "6281228134488";

  useEffect(() => {
    if (!id) return;

    const fetchPartDetail = async () => {
      setLoading(true);
      try {
        await supabase.rpc("increment_part_view", { target_id: id });

        const { data, error } = await supabase
          .from("spare_parts")
          .select("*")
          .eq("id", id)
          .single(); // Mengambil satu objek data saja sesuai ID

        if (error) throw error;
        setPart(data);
      } catch (error: any) {
        console.error("Gagal mengambil detail suku cadang:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPartDetail();
  }, [id]);

  const formatIDR = (num: number) => {
    if (!num) return "Rp0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(num);
  };

  // Handler untuk mengatur jumlah barang
  const handleDecrease = () => setQuantity((prev) => Math.max(1, prev - 1));
  const handleIncrease = () => {
    if (part.stock > 0 && quantity < part.stock) {
      setQuantity((prev) => prev + 1);
    } else if (part.stock === 0) {
      setQuantity((prev) => prev + 1); // Biarkan bisa nambah jika sistemnya Indent
    }
  };

  // Handler untuk membagikan produk
  const handleShare = async () => {
    const shareData = {
      title: part?.name || "Suku Cadang Tambang",
      text: `Cek suku cadang ${part?.name} (P/N: ${part?.part_number}) di Spare Parts Center Syah Heavy Equipment.`,
      url: window.location.href,
    };

    // Menggunakan Web Share API jika didukung oleh browser (terutama di HP)
    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error("Gagal membagikan:", error);
      }
    } else {
      // Fallback: Salin link ke clipboard jika di desktop browser
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000); // Reset status setelah 2 detik
      } catch (error) {
        console.error("Gagal menyalin tautan:", error);
      }
    }
  };

  // Generate Link WhatsApp dengan membawa data Jumlah (Quantity)
  const getWhatsAppLink = () => {
    const statusOrder = part.stock > 0 ? "READY STOCK" : "INDENT";
    
    const message = 
      `Halo Admin Spare Parts Center,\n\n` +
      `Saya ingin memesan suku cadang berikut:\n` +
      `--------------------------------------------------\n` +
      `• *Nama Barang* : ${part.name}\n` +
      `• *Part Number* : ${part.part_number}\n` +
      `• *Jumlah Pesanan* : *${quantity} pcs*\n` +
      `• *Harga Satuan* : ${part.price}\n` +
      `• *Status* : ${statusOrder}\n` +
      `--------------------------------------------------\n\n` +
      `Mohon konfirmasi ketersediaan dan total biaya beserta ongkos kirim. Terima kasih.`;

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  const imageList = Array.isArray(part?.image)
    ? part.image.filter((img: string) => img && img.trim() !== "")
    : part?.image ? [part.image] : ["https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600"];

  if (imageList.length === 0) imageList.push("https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600");

  const scrollToImage = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const width = container.clientWidth;
      container.scrollTo({
        left: width * index,
        behavior: "smooth"
      });
      setActiveImgIndex(index);
    }
  };

  const handleScrollDetect = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const index = Math.round(container.scrollLeft / container.clientWidth);
      if (index !== activeImgIndex) {
        setActiveImgIndex(index);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-slate-400 bg-neutral-950 gap-3">
        <Loader2 className="animate-spin text-yellow-600" size={36} />
        <span className="text-sm tracking-widest font-medium">Memuat detail produk...</span>
      </div>
    );
  }

  // Jika loading selesai tapi data tidak ditemukan
  if (!part) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-neutral-950 gap-4">
        <div className="text-slate-500 italic">Data Suku Cadang Tidak Ditemukan atau Terhapus.</div>
        <Link href="/spare-part" className="text-xs font-bold uppercase tracking-wider px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-yellow-600 hover:text-white transition-colors">
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white pt-24 pb-16 px-4 md:px-6 w-full overflow-x-hidden">
      <div className="max-w-6xl mx-auto w-full">
        
        {/* Navigasi Kembali */}
        <Link href="/spare-part" className="inline-flex items-center gap-2 text-slate-400 hover:text-yellow-600 mb-8 transition-colors text-sm font-medium">
          <ArrowLeft size={16} /> Kembali ke Katalog
        </Link>

        <div className="grid lg:grid-cols-2 gap-10 md:gap-16">
          
          {/* KOLOM KIRI: Gambar Produk */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="space-y-4"
          >
            {/* Box Frame Utama */}
            <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden group">
              
              {/* Container Scroll Snap Track */}
              <div 
                ref={scrollContainerRef}
                onScroll={handleScrollDetect}
                className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth style-scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {imageList.map((imgUrl: string, idx: number) => (
                  <div key={idx} className="w-full h-full shrink-0 snap-center relative">
                    <Image
                      src={imgUrl}
                      alt={`${part.name} - Tampilan ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 800px"
                      priority={idx === 0}
                    />
                  </div>
                ))}
              </div>

              {/* Badge Kategori */}
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-neutral-900/80 backdrop-blur-md text-slate-200 border border-neutral-700/50 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-md">
                  {part.category}
                </span>
              </div>

              {/* Petunjuk Geser / Swipe Hint (Hanya muncul jika gambar > 1) */}
              {imageList.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-neutral-900/80 backdrop-blur-md text-yellow-600 border border-neutral-800 text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-lg z-10 pointer-events-none animate-pulse">
                  Geser Foto ({activeImgIndex + 1}/{imageList.length}) →
                </div>
              )}
            </div>

            {/* Kontrol Strip Thumbnail Bawah (Hanya tampil jika multi-foto) */}
            {imageList.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1 custom-scrollbar-thin">
                {imageList.map((imgUrl: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => scrollToImage(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-neutral-900 border transition-all ${
                      activeImgIndex === idx 
                        ? "border-yellow-600 ring-2 ring-yellow-600/20 opacity-100" 
                        : "border-neutral-800 opacity-40 hover:opacity-80"
                    }`}
                  >
                    <Image
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* KOLOM KANAN: Detail Informasi */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="flex flex-col"
          >
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-yellow-600 font-mono text-sm tracking-wider">P/N: {part.part_number}</span>
                {part.stock > 0 ? (
                  <span className="flex items-center gap-1 text-xs font-bold uppercase px-2.5 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded">
                    <CheckCircle2 size={12} /> Tersedia ({part.stock})
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-bold uppercase px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded">
                    <AlertCircle size={12} /> Indent (Habis)
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold font-barlow uppercase leading-tight mb-4">
                {part?.name}
              </h1>
              
              <div className="text-3xl font-black text-white mb-6">
                {formatIDR(part?.price)}
              </div>

              <p className="text-slate-400 leading-relaxed text-sm md:text-base mb-8">
                {part?.description || "Suku cadang asli yang dirancang untuk daya tahan maksimal di lingkungan kerja yang ekstrem. Hubungi kami untuk memastikan kecocokan dengan unit Anda."}
              </p>
            </div>

            {/* Spesifikasi Kotak */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <Wrench size={16} />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Kesesuaian</span>
                </div>
                <div className="font-medium text-sm md:text-base text-slate-200">{part.compatibility}</div>
              </div>
              <div className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <Settings size={16} />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Kategori</span>
                </div>
                <div className="font-medium text-sm md:text-base text-slate-200">{part.category}</div>
              </div>
              <div className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <Package size={16} />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Berat Estimasi</span>
                </div>
                <div className="font-medium text-sm md:text-base text-slate-200">{part?.weight || "-"}</div>
              </div>
              <div className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <Truck size={16} />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Garansi</span>
                </div>
                <div className="font-medium text-sm md:text-base text-slate-200">{part?.warranty || "Tidak ada garansi"}</div>
              </div>
            </div>

            {/* Action Area (Quantity & Button) */}
            <div className="mt-auto pt-8 border-t border-neutral-800">
              <div className="flex flex-col sm:flex-row gap-4">
                
                {/* Quantity Selector */}
                <div className="flex items-center border border-neutral-700 bg-neutral-900 rounded-lg h-14 w-full sm:w-36">
                  <button 
                    onClick={handleDecrease}
                    className="w-12 h-full flex items-center justify-center text-2xl text-slate-400 hover:text-white hover:bg-neutral-800 transition-colors rounded-l-lg"
                  >
                    -
                  </button>
                  <div className="flex-1 text-center font-bold text-lg">
                    {quantity}
                  </div>
                  <button 
                    onClick={handleIncrease}
                    className="w-12 h-full flex items-center justify-center text-2xl text-slate-400 hover:text-white hover:bg-neutral-800 transition-colors rounded-r-lg"
                  >
                    +
                  </button>
                </div>

                {/* Tombol Pesan */}
                <Link
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 flex items-center justify-center gap-3 p-4 h-14 font-bold uppercase tracking-widest rounded-lg transition-all ${
                    part.stock > 0 
                      ? "bg-yellow-600 hover:bg-yellow-500 text-neutral-950" 
                      : "bg-neutral-800 border border-neutral-700 text-amber-500 hover:bg-neutral-700"
                  }`}
                >
                  <ShoppingCart size={24} />
                  {part.stock > 0 ? "Pesan via WhatsApp" : "Indent via WhatsApp"}
                </Link>

                <button
                  onClick={handleShare}
                  className="h-14 px-5 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800 rounded-lg flex items-center justify-center text-slate-300 hover:text-white transition-all gap-2 relative shrink-0 group/share"
                  title="Bagikan Produk"
                >
                  <Share2 size={18} className="group-hover/share:scale-110 transition-transform" />
                  <span className="text-xs font-bold uppercase tracking-widest sm:hidden lg:block">Bagikan</span>
                  
                  {/* Toast Toolkit Alert Kecil saat berhasil disalin */}
                  {shareCopied && (
                    <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-neutral-800 text-yellow-500 border border-neutral-700 text-xs px-3 py-1.5 rounded-md shadow-2xl whitespace-nowrap font-medium animate-bounce">
                      Tautan disalin!
                    </span>
                  )}
                </button>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </main>
  );
}