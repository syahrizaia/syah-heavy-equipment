"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, HelpCircle, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";

// Data FAQ statis untuk mempercepat performa halaman
const faqData = [
  {
    id: "faq-1",
    category: "Penyewaan",
    question: "Bagaimana cara menyewa alat berat di Syah Heavy Equipment?",
    answer: "Anda dapat meninjau armada kami di halaman layanan, lalu menekan tombol Konsultasi Sekarang untuk mengisi formulir spesifikasi proyek. Tim kami akan segera menghubungi Anda guna mengirimkan surat penawaran resmi."
  },
  {
    id: "faq-2",
    category: "Penyewaan",
    question: "Berapa minimum durasi waktu penyewaan armada?",
    answer: "Untuk sistem sewa berbasis jam kerja, minimum kontrak adalah seratus jam kerja. Sedangkan untuk proyek borongan, durasi sewa minimum dapat disesuaikan sejak satu hari operasional penuh tergantung kesepakatan."
  },
  {
    id: "faq-3",
    category: "Suku Cadang",
    question: "Apakah seluruh suku cadang yang tersedia memiliki garansi?",
    answer: "Ya, kami menjamin keaslian seluruh komponen. Setiap suku cadang dilengkapi dengan garansi resmi dari pabrikan manufaktur yang durasinya bervariasi sesuai dengan jenis dan kategori part tersebut."
  },
  {
    id: "faq-4",
    category: "Suku Cadang",
    question: "Bagaimana jika suku cadang yang saya cari berstatus Indent?",
    answer: "Status Indent menandakan bahwa stok fisik di gudang pusat sedang kosong namun dapat kami pesan langsung ke manufaktur utama. Proses pengadaan barang jaminan indent berkisar antara tujuh hingga empat belas hari kerja."
  },
  {
    id: "faq-5",
    category: "Teknis",
    question: "Apakah biaya sewa sudah termasuk operator dan bahan bakar?",
    answer: "Kami menyediakan dua opsi fleksibel, yaitu sistem sewa lepas kunci tanpa operator dan bahan bakar, atau sistem sewa paket lengkap yang mencakup akomodasi operator berpengalaman serta suplai bahan bakar harian."
  },
  {
    id: "faq-6",
    category: "Teknis",
    question: "Bagaimana prosedur penanganan jika terjadi kendala mesin di lapangan?",
    answer: "Tim dukungan teknis lapangan kami siaga selama dua puluh empat jam. Jika terjadi kendala mekanis, mekanik terdekat akan segera dimobilisasi ke titik koordinat proyek Anda dalam waktu maksimal empat jam setelah laporan masuk."
  }
];

const categories = ["Semua", "Penyewaan", "Suku Cadang", "Teknis"];

export default function PusatBantuanPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  // Menyaring pertanyaan berdasarkan kata kunci dan kategori aktif
  const filteredFaqs = useMemo(() => {
    return faqData.filter((faq) => {
      const matchesCategory = activeCategory === "Semua" || faq.category === activeCategory;
      const matchesSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  return (
    <main className="min-h-screen bg-neutral-950 text-white pt-24 pb-16 px-4 md:px-6 w-full overflow-x-hidden">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Bagian Atas / Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center gap-2 text-yellow-600">
            <HelpCircle size={24} />
            <span className="text-xs font-bold uppercase tracking-widest font-barlow">Customer Support Hub</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-barlow uppercase tracking-tight">
            Pusat Bantuan
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base">
            Temukan jawaban instan seputar operasional, panduan pemesanan armada, pengadaan suku cadang, dan penanganan teknis darurat.
          </p>
        </div>

        {/* Bilah Pencarian & Filter Kategori */}
        <div className="space-y-4">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Ketik kata kunci pertanyaan Anda di sini..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:border-yellow-600/50 transition-colors placeholder:text-slate-500 font-medium"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setOpenId(null);
                }}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-yellow-600 border-yellow-600 text-neutral-950"
                    : "bg-neutral-900 border-neutral-800 text-slate-400 hover:text-white hover:border-neutral-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Daftar FAQ Utama */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl divide-y divide-neutral-800 overflow-hidden">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => {
                const isOpen = openId === faq.id;
                return (
                  <div key={faq.id} className="w-full">
                    <button
                      type="button"
                      onClick={() => toggleAccordion(faq.id)}
                      className="w-full p-5 flex justify-between items-center text-left hover:bg-neutral-900/60 transition-colors gap-4"
                    >
                      <span className="font-bold text-sm md:text-base text-slate-100 font-barlow tracking-wide">
                        {faq.question}
                      </span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-slate-500 flex-shrink-0"
                      >
                        <ChevronDown size={18} />
                      </motion.div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden bg-neutral-950/40"
                        >
                          <div className="p-5 text-sm text-slate-400 leading-relaxed border-t border-neutral-800/40">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center text-slate-500 space-y-2">
                <HelpCircle className="mx-auto text-neutral-700" size={36} />
                <p className="text-sm font-medium italic">Tidak ditemukan solusi yang cocok dengan pencarian Anda.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Bagian Kontak Tambahan */}
        <div className="bg-gradient-to-r from-neutral-900 to-neutral-950 border border-neutral-800 p-6 md:p-8 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold font-barlow uppercase text-white">Tidak Menemukan Jawaban?</h3>
            <p className="text-xs text-slate-400 max-w-md">
              Hubungi pusat layanan terpadu kami yang siap mendampingi kebutuhan proyek Anda secara langsung melalui saluran telepon resmi atau pesan instan.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-auto">
            <Link
              href="https://wa.me/6281228134488"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-500 text-neutral-950 px-5 py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors"
            >
              <MessageSquare size={14} /> Hubungi WhatsApp
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-5 py-3 rounded-lg font-bold text-xs uppercase tracking-wider border border-neutral-700 transition-colors"
            >
              Tiket Dukungan <ArrowRight size={14} />
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}