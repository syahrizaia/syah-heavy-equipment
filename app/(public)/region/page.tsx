import { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowRight, HardHat, Building2, Anchor, ShieldCheck } from "lucide-react";

// 1. Optimasi SEO: Metadata Statis untuk Hub Wilayah
export const metadata: Metadata = {
  title: "Cakupan Wilayah Operasional | Syah Heavy Equipment",
  description: "Daftar wilayah layanan rental dan mobilisasi alat berat SHE. Kami melayani proyek strategis di Bekasi (Jabodetabek), Balikpapan (IKN & Kaltim), dan Morowali (Sulawesi).",
  keywords: ["wilayah sewa alat berat", "rental excavator bekasi", "alat berat balikpapan", "heavy equipment morowali"],
};

// Data wilayah operasional untuk mempermudah perulangan (looping) komponen
const daftarWilayah = [
  {
    slug: "bekasi",
    nama: "Bekasi & Jabodetabek",
    tagline: "Hub Logistik & Workshop Utama",
    deskripsi: "Pusat komando perawatan teknis, inspeksi kelayakan K3 (SILO/SIO), dan mobilisasi cepat armada darat untuk proyek infrastruktur di Pulau Jawa.",
    ikon: Building2,
    badge: "Workshop Pusat",
  },
  {
    slug: "balikpapan",
    nama: "Balikpapan & IKN",
    tagline: "Kawasan Tambang & Koridor IKN",
    deskripsi: "Dukungan masif unit ekskavator heavy-duty, buldozer, dan crane pancang untuk percepatan infrastruktur ibu kota baru dan site pertambangan batu bara.",
    ikon: Anchor,
    badge: "Situs Strategis",
  },
  {
    slug: "morowali",
    nama: "Morowali (Sulawesi)",
    deskripsi: "Penyediaan dump truck tronton berspesifikasi khusus dan alat berat pertambangan nikel dengan kepatuhan regulasi HSE korporat yang ketat.",
    tagline: "Kawasan Industri Nikel",
    ikon: HardHat,
    badge: "Area Pertambangan",
  },
];

export default function RegionLandingPage() {
  return (
    <main className="min-h-screen bg-neutral-950 pt-32 pb-20 px-4 md:px-6 w-full relative overflow-hidden">
      
      {/* Background Grid Pattern (Senada dengan Halaman Tracking) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-600/10 border border-yellow-500/20 rounded-full text-yellow-500 text-xs font-bold tracking-wider uppercase">
            <MapPin size={14} /> Jaringan Domestik SHE
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-barlow text-white uppercase tracking-tight">
            Wilayah Operasional
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Pilih wilayah proyek Anda untuk melihat ketersediaan armada alat berat standar HSE, spesifikasi workshop lokal, dan layanan penawaran harga khusus.
          </p>
        </div>

        {/* Grid Cards Wilayah */}
        <div className="grid md:grid-cols-3 gap-6">
          {daftarWilayah.map((wilayah) => {
            const IconComponent = wilayah.ikon;
            
            return (
              <div 
                key={wilayah.slug}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col justify-between group hover:border-neutral-700 hover:shadow-2xl hover:shadow-yellow-600/5 transition-all duration-300"
              >
                <div className="space-y-4">
                  {/* Bagian Atas Card */}
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg text-yellow-500 group-hover:bg-yellow-600 group-hover:text-neutral-950 transition-colors duration-300">
                      <IconComponent size={20} />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 bg-neutral-950 border border-neutral-800 rounded text-slate-400">
                      {wilayah.badge}
                    </span>
                  </div>

                  {/* Teks Deskripsi */}
                  <div>
                    <h2 className="text-xl font-bold font-barlow text-white uppercase tracking-tight group-hover:text-yellow-500 transition-colors">
                      {wilayah.nama}
                    </h2>
                    <p className="text-xs font-mono text-yellow-600 mt-0.5 font-semibold">
                      {wilayah.tagline}
                    </p>
                    <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                      {wilayah.deskripsi}
                    </p>
                  </div>
                </div>

                {/* Tombol Aksi Menuju Halaman Dinamis [city] */}
                <div className="pt-6 mt-6 border-t border-neutral-800/50">
                  <Link 
                    href={`/region/${wilayah.slug}`}
                    className="w-full bg-neutral-950 hover:bg-yellow-600 text-slate-300 hover:text-neutral-950 border border-neutral-800 hover:border-yellow-600 font-bold py-3 px-4 rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 group-hover:translate-y-0"
                  >
                    Jelajahi Wilayah <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Footer Standar Pelayanan */}
        <div className="mt-16 bg-neutral-900/30 border border-neutral-800/80 p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 text-slate-400">
            <ShieldCheck size={18} className="text-yellow-500 shrink-0" />
            <span>Proyek Anda berada di luar area di atas? Kami tetap melayani mobilisasi lintas pulau dengan syarat dan ketentuan khusus.</span>
          </div>
          <Link 
            href="/contact" 
            className="text-yellow-500 hover:text-yellow-400 font-bold uppercase tracking-wider whitespace-nowrap underline underline-offset-4"
          >
            Hubungi Logistik SHE &rarr;
          </Link>
        </div>

      </div>
    </main>
  );
}