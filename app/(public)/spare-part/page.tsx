/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Wrench, ChevronLeft, ChevronRight, ShoppingCart, Info, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Contoh Data Mock Suku Cadang Alat Berat / Armada
export const MOCK_PARTS = [
  { 
    id: "P001", 
    name: "Hydraulic Pump Assy", 
    part_number: "708-2L-00300", 
    category: "Hidrolik", 
    price: "Rp24.500.000", 
    stock: 3, 
    compatibility: "Excavator PC200-8", 
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=500",
    description: "Pompa hidrolik utama (main pump assy) berkualitas tinggi yang berfungsi mensuplai aliran oli bertekanan tinggi ke seluruh sistem actuator, silinder, dan motor penggerak excavator.",
    weight: "85 kg",
    warranty: "6 Bulan"
  },
  { 
    id: "P002", 
    name: "Oil Filter", 
    part_number: "600-211-1340", 
    category: "Filter", 
    price: "Rp350.000", 
    stock: 25, 
    compatibility: "Bulldozer D85ESS", 
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=500",
    description: "Filter oli mesin performa tinggi dengan media penyaringan mikron presisi untuk menangkap jelaga, gram besi, dan kontaminan berbahaya guna menjaga kebersihan sistem pelumasan mesin.",
    weight: "1.2 kg",
    warranty: "Tanpa Garansi (Habis Pakai)"
  },
  { 
    id: "P003", 
    name: "Track Shoe 600mm", 
    part_number: "20Y-32-11110", 
    category: "Undercarriage", 
    price: "Rp1.850.000", 
    stock: 40, 
    compatibility: "Excavator PC200", 
    image: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&q=80&w=500",
    description: "Tapak rantai (track shoe) komponen undercarriage ukuran lebar standar 600mm. Terbuat dari material baja cor paduan tinggi tahan aus, sangat ideal untuk traksi optimal di medan berlumpur maupun berbatu.",
    weight: "22 kg",
    warranty: "3 Bulan (Cacat Pabrik)"
  },
  { 
    id: "P004", 
    name: "Bucket Tooth Standard", 
    part_number: "205-70-19570", 
    category: "G.E.T (Tooth)", 
    price: "Rp450.000", 
    stock: 12, 
    compatibility: "Excavator PC200", 
    image: "https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&q=80&w=500",
    description: "Kuku bucket (bucket tooth) model standar tipe point. Memiliki ketahanan benturan tinggi dan penetrasi tajam yang dirancang khusus untuk mempermudah pengerukan tanah keras (hard soil).",
    weight: "5.5 kg",
    warranty: "Tanpa Garansi (Habis Pakai)"
  },
  { 
    id: "P005", 
    name: "Alternator 24V 60A", 
    part_number: "600-825-1160", 
    category: "Elektrikal", 
    price: "Rp3.200.000", 
    stock: 5, 
    compatibility: "Dump Truck HD785", 
    image: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?auto=format&fit=crop&q=80&w=500",
    description: "Dinamo ampere (alternator) sistem kelistrikan alat berat berkapasitas daya 24 Volt / 60 Ampere. Menghasilkan arus pengisian baterai aki yang stabil untuk mensuplai seluruh kebutuhan modul elektrikal.",
    weight: "8.5 kg",
    warranty: "3 Bulan"
  },
  { 
    id: "P006", 
    name: "Fuel Filter Pre-Filter", 
    part_number: "600-319-3550", 
    category: "Filter", 
    price: "Rp420.000", 
    stock: 0, 
    compatibility: "Excavator PC300-8", 
    image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=500",
    description: "Filter bahan bakar solar tahap awal (pre-filter) yang bertugas menyaring partikel kotoran kasar serta memisahkan kandungan air (water separator) agar pasokan bahan bakar ke pompa injeksi tetap murni.",
    weight: "1.0 kg",
    warranty: "Tanpa Garansi (Habis Pakai)"
  },
  { 
    id: "P007", 
    name: "V-Belt Set", 
    part_number: "04120-21753", 
    category: "Engine", 
    price: "Rp275.000", 
    stock: 15, 
    compatibility: "Greader GD511A", 
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=500",
    description: "Set tali kipas mesin (v-belt) bermaterial karet EPDM sintetis premium berpola serat penguat. Memiliki kelenturan tinggi, anti-selip, serta tahan terhadap paparan suhu panas ruang mesin yang ekstrem.",
    weight: "0.6 kg",
    warranty: "Tanpa Garansi"
  },
  { 
    id: "P008", 
    name: "Turbocharger Garrett", 
    part_number: "6505-67-5030", 
    category: "Engine", 
    price: "Rp14.800.000", 
    stock: 2, 
    compatibility: "Excavator PC400", 
    image: "https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?auto=format&fit=crop&q=80&w=500",
    description: "Komponen induksi paksa udara turbocharger performa tinggi besutan Garrett. Berfungsi memaksimalkan asupan volume udara bersih ke ruang bakar untuk mendongkrak tenaga mesin diesel silinder besar.",
    weight: "18 kg",
    warranty: "6 Bulan"
  },
  { 
    id: "P009", 
    name: "Track Roller Single", 
    part_number: "20Y-30-00040", 
    category: "Undercarriage", 
    price: "Rp2.100.000", 
    stock: 8, 
    compatibility: "Excavator PC200-8", 
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=500",
    description: "Roller penumpu bawah dengan tipe single flange (pinggiran roda tunggal). Menggunakan sistem pelumasan oli internal yang dilindungi oleh dual cone floating seal untuk mencegah kebocoran oli dan korosi pasir.",
    weight: "34 kg",
    warranty: "3 Bulan"
  },
  { 
    id: "P010", 
    name: "Sprocket Rim", 
    part_number: "14X-27-11110", 
    category: "Undercarriage", 
    price: "Rp5.400.000", 
    stock: 4, 
    compatibility: "Bulldozer D85ESS-2", 
    image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&q=80&w=500",
    description: "Lingkar gigi pemutar utama (sprocket rim) berkekuatan tinggi mekanis mekanis. Menggunakan proses hardening menyeluruh untuk memastikan kekuatan gerigi saat bergesekan intensif mendorong beban berat link assy.",
    weight: "48 kg",
    warranty: "3 Bulan"
  },
  { 
    id: "P011", 
    name: "Seal Kit Boom Cylinder", 
    part_number: "707-99-44110", 
    category: "Hidrolik", 
    price: "Rp1.150.000", 
    stock: 18, 
    compatibility: "Excavator PC200-7", 
    image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=500",
    description: "Satu set seal karet poliuretan kualitas tinggi khusus silinder boom. Menjamin pencegahan kebocoran tekanan oli hidrolik secara internal maupun eksternal guna memelihara daya angkat lengan arm tetap konstan.",
    weight: "0.4 kg",
    warranty: "Tanpa Garansi"
  },
  { 
    id: "P012", 
    name: "Air Filter Outer", 
    part_number: "600-185-4100", 
    category: "Filter", 
    price: "Rp850.000", 
    stock: 9, 
    compatibility: "All PC200 Series", 
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=500",
    description: "Elemen penyaring udara bagian luar (outer) berbahan dasar kertas filter densitas tinggi untuk menyaring partikel debu, debu kasar tambang, dan kotoran udara bebas sebelum diisap oleh mesin.",
    weight: "2.5 kg",
    warranty: "Tanpa Garansi (Habis Pakai)"
  },
  { 
    id: "P013", 
    name: "Main Relief Valve", 
    part_number: "723-40-51102", 
    category: "Hidrolik", 
    price: "Rp7.900.000", 
    stock: 1, 
    compatibility: "Excavator PC200-8", 
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=500",
    description: "Katup pengaman tekanan utama (main relief valve) yang dipasang pada control valve. Berfungsi membatasi batas tekanan hidrostatik maksimal sistem hidrolik agar terhindar dari risiko pecah selang/over-pressure.",
    weight: "4.2 kg",
    warranty: "3 Bulan"
  },
  { 
    id: "P014", 
    name: "Starting Motor / Dinamo Starter", 
    part_number: "600-813-5730", 
    category: "Elektrikal", 
    price: "Rp4.500.000", 
    stock: 0, 
    compatibility: "Bulldozer D85", 
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=500",
    description: "Motor starter elektrik (dinamo starter) heavy duty dengan dorongan torsi tinggi untuk menghentak fly-wheel mesin diesel silinder besar pada cuaca dingin sekalipun.",
    weight: "12.5 kg",
    warranty: "3 Bulan"
  }
];

export default function SparePartsCatalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCat, setActiveCat] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  
  const ITEMS_PER_PAGE = 12; // 12 item agar pas di grid 2, 3, atau 4 kolom
//   const WHATSAPP_NUMBER = "6281228134488";
  const WHATSAPP_NUMBER = "6281228134488";

  const categories = useMemo(() => {
    return ["Semua", ...Array.from(new Set(MOCK_PARTS.map((item) => item.category))).sort()];
  }, []);

  const filteredParts = useMemo(() => {
    return MOCK_PARTS.filter((part) => {
      const matchesCategory = activeCat === "Semua" || part.category === activeCat;
      const matchesSearch =
        part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        part.part_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        part.compatibility.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCat]);

  const totalPages = Math.ceil(filteredParts.length / ITEMS_PER_PAGE);
  const paginatedParts = useMemo(() => {
    return filteredParts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  }, [filteredParts, currentPage]);

  // Handler Kategori agar page reset ke 1
  const handleCategoryChange = (cat: string) => {
    setActiveCat(cat);
    setCurrentPage(1);
  };

  // Handler Pencarian agar page reset ke 1
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const getWhatsAppLink = (part: any) => {
    const statusOrder = part.stock > 0 ? "READY STOCK" : "INDENT";
    
    const message = 
      `Halo Admin Spare Parts Center,\n\n` +
      `Saya tertarik untuk memesan suku cadang berikut ini:\n` +
      `--------------------------------------------------\n` +
      `• *Nama Barang* : ${part.name}\n` +
      `• *Part Number* : ${part.part_number}\n` +
      `• *Kategori* : ${part.category}\n` +
      `• *Kesesuaian* : ${part.compatibility}\n` +
      `• *Estimasi Harga* : ${part.price}\n` +
      `• *Status Unit* : *${statusOrder}*\n` +
      `--------------------------------------------------\n\n` +
      `Apakah suku cadang ini bisa segera diproses? Mohon informasi petunjuk transaksi selanjutnya. Terima kasih.`;

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  return (
    <section className="bg-black text-white min-h-screen py-24 px-4 md:px-6 max-w-7xl mx-auto w-full overflow-hidden">
      
      {/* HEADER SECTION */}
      <div className="mb-12 border-b border-neutral-800 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <Wrench className="text-yellow-600" size={28} />
          <span className="text-xs font-bold uppercase tracking-widest text-yellow-600 font-barlow">Spare Parts Center</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold font-barlow uppercase mb-4 tracking-tight">
          Katalog Suku Cadang
        </h1>
        <p className="text-slate-400 max-w-2xl text-sm md:text-base">
          Suku cadang asli dan berkualitas tinggi untuk memastikan unit alat berat Anda selalu beroperasi dengan performa maksimal tanpa kendala.
        </p>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10 w-full">
        {/* Kolom Input Cari */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Cari nama suku cadang, part number, atau kecocokan..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-11 pr-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-600/50 transition-colors placeholder:text-slate-500"
          />
        </div>

        {/* Scrollable Filter Kategori */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 whitespace-nowrap scrollbar-none [scrollbar-width:none]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 border font-bold uppercase text-xs tracking-wider transition-all rounded-md ${
                activeCat === cat
                  ? "bg-yellow-600 border-yellow-600 text-neutral-950"
                  : "border-neutral-800 bg-neutral-900/50 text-slate-400 hover:text-white hover:border-neutral-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* GRID KATALOG PRODUK */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {paginatedParts.length > 0 ? (
            paginatedParts.map((part) => (
              <motion.div
                key={part.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-neutral-900 border border-neutral-800/80 rounded-xl overflow-hidden flex flex-col justify-between hover:border-neutral-700 transition-all group shadow-lg"
              >
                {/* Bagian Atas: Info Produk */}
                <div className="relative h-44 w-full bg-neutral-950 overflow-hidden border-b border-neutral-800/60">
                    <Image
                        src={part.image} 
                        alt={part.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                        loading="lazy"
                        width={400}
                        height={300}
                    />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-neutral-800 text-slate-400 rounded tracking-wider">
                      {part.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded backdrop-blur-sm ${
                      part.stock > 0 
                        ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}>
                      {part.stock > 0 ? `Stok: ${part.stock}` : "Habis"}
                    </span>
                  </div>
                </div>

                {/* Konten Info Teknis */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-100 group-hover:text-yellow-500 transition-colors line-clamp-2 mb-1 min-h-[40px]">
                      {part.name}
                    </h3>
                    <p className="text-xs font-mono text-slate-500 mb-4">P/N: {part.part_number}</p>
                  </div>
                  
                  <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800/40 text-xs">
                    <span className="text-slate-500 block text-[10px] uppercase font-medium tracking-wider mb-0.5">Kesesuaian Unit:</span>
                    <span className="text-slate-300 font-medium line-clamp-1">{part.compatibility}</span>
                  </div>
                </div>

                {/* Bagian Bawah: Harga & Aksi */}
                <div className="px-5 pb-5 border-t border-neutral-800/40 bg-neutral-950/20 flex flex-col gap-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-slate-500 tracking-wider">Estimasi Harga</span>
                    <span className="text-lg font-black text-white">{part.price}</span>
                  </div>
                  
                  {/* Tombol Aksi */}
                  <div className="flex gap-2 w-full">
                    <Link 
                      href={`/spare-part/${part.id}`} 
                      className="p-2.5 border border-neutral-800 hover:border-neutral-600 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors aspect-square"
                      title="Detail Produk"
                    >
                      <Eye size={16} />
                    </Link>
                    
                    <Link
                      href={getWhatsAppLink(part)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 font-bold text-xs uppercase tracking-wider py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                        part.stock > 0 
                          ? "bg-yellow-600 hover:bg-yellow-500 text-neutral-950" 
                          : "bg-neutral-800 text-amber-500 hover:bg-neutral-700"
                      }`}
                    >
                      <ShoppingCart size={14} />
                      {part.stock > 0 ? "Pesan" : "Indent"}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-slate-500 border border-dashed border-neutral-800 rounded-xl bg-neutral-900/10">
              <Info className="mx-auto mb-3 text-slate-600" size={32} />
              <p className="italic text-sm">Tidak ada produk suku cadang yang cocok dengan kriteria pencarian Anda.</p>
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* COMPONENT PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-16 border-t border-neutral-900 pt-8">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="p-3 border border-neutral-800 bg-neutral-900/40 text-white hover:border-yellow-600 disabled:opacity-20 disabled:hover:border-neutral-800 rounded-lg transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-11 h-11 border font-bold text-xs rounded-lg transition-all ${
                currentPage === page
                  ? "bg-yellow-600 border-yellow-600 text-neutral-950"
                  : "border-neutral-800 bg-neutral-900/40 text-slate-400 hover:text-white hover:border-neutral-600"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="p-3 border border-neutral-800 bg-neutral-900/40 text-white hover:border-yellow-600 disabled:opacity-20 disabled:hover:border-neutral-800 rounded-lg transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
      
    </section>
  );
}