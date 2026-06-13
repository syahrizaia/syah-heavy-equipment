import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Compass, CheckCircle, ShieldCheck, MapPin, ArrowRight, ArrowLeft } from "lucide-react"; // Tambah ArrowLeft
import Link from "next/link";

interface Props {
  params: Promise<{ city: string }>;
}

// Data Kamus Lokal untuk Keperluan SEO Keyword Mapping
const cityInfo: Record<string, { nama: string; deskripsi: string; keyword: string }> = {
  bekasi: {
    nama: "Bekasi & Jabodetabek",
    deskripsi: "Pusat Workshop dan mobilisasi utama armada berat penunjang konstruksi infrastruktur perkotaan.",
    keyword: "Sewa Alat Berat Bekasi"
  },
  balikpapan: {
    nama: "Balikpapan & IKN",
    deskripsi: "Dukungan logistik masif ekskavator heavy-duty dan crane pemancangan untuk wilayah pertambangan dan kawasan industri baru.",
    keyword: "Rental Alat Berat Balikpapan"
  },
  morowali: {
    nama: "Morowali (Sulawesi)",
    deskripsi: "Penyediaan unit dump truck tronton dan alat berat berspesifikasi pertambangan nikel dengan regulasi HSE ketat.",
    keyword: "Sewa Alat Berat Tambang Morowali"
  }
};

// Generate Metadata Dinamis Berdasarkan Wilayah untuk Google Search
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params; 
  const cityKey = resolvedParams.city.toLowerCase();
  
  const data = cityInfo[cityKey];

  if (!data) return {};

  return {
    title: `${data.keyword} - Spesialis Armada HSE`,
    description: `Butuh unit cepat? Layanan ${data.keyword}. ${data.deskripsi} Pantau posisi pengiriman unit Anda dengan sistem Live Telemetri 3D.`,
  };
}

export default async function HalamanWilayah({ params }: Props) {
  const resolvedParams = await params; 
  const cityKey = resolvedParams.city.toLowerCase();
  
  const data = cityInfo[cityKey];

  if (!data) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white pt-32 pb-16 px-4 md:px-6 w-full">
      <div className="max-w-4xl mx-auto space-y-8"> {/* Diubah dari space-y-12 ke space-y-8 agar lebih padat */}
        
        {/* Navigasi Back ke Hub Direktori Wilayah */}
        <Link 
          href="/region" 
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-yellow-500 transition-colors group self-start"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> 
          Kembali ke Daftar Wilayah
        </Link>

        {/* Hero Section Wilayah */}
        <div className="border-b border-neutral-800 pb-8 pt-2">
          <div className="flex items-center gap-2 text-yellow-500 text-xs font-bold uppercase tracking-widest mb-3">
            <MapPin size={14} /> Cakupan Operasional Wilayah
          </div>
          <h1 className="text-3xl md:text-6xl font-bold font-barlow text-white uppercase">
            {data.keyword}
          </h1>
          <p className="text-slate-400 text-sm md:text-base mt-4 leading-relaxed max-w-2xl">
            Syah Heavy Equipment hadir secara lokal di <span className="text-white font-semibold">{data.nama}</span>. {data.deskripsi} Kami memastikan ketersediaan unit prima siap kerja tanpa hambatan operasional.
          </p>
        </div>

        {/* PROMOSI FITUR UNGGULAN: 3D Tracking Kampanye (Langkah 5 SEO) */}
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-yellow-600/20 p-6 md:p-8 rounded-xl flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-yellow-600/10 border border-yellow-500/20 rounded-full text-yellow-500 text-[10px] font-bold tracking-wider uppercase">
              <Compass size={12} className="animate-spin-slow" /> Transparansi Pengiriman Unit
            </div>
            <h2 className="text-xl md:text-2xl font-bold font-barlow uppercase text-slate-100">
              Pantau Mobilisasi dengan GPS Live Telemetri 3D
            </h2>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              Kami paham bahwa ketepatan waktu adalah segalanya bagi proyek Anda. Seluruh unit yang disewa menuju <span className="text-yellow-500 font-medium">{data.nama}</span> dapat Anda lacak posisinya secara akurat menggunakan Visualisasi Medan Makro 3D murni kami.
            </p>
          </div>
          <Link 
            href="/tracking" 
            className="bg-yellow-600 hover:bg-yellow-500 text-neutral-950 px-5 py-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shrink-0"
          >
            Coba Lacak Demo <ArrowRight size={14} />
          </Link>
        </div>

        {/* Keunggulan Standar HSE Lokal */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-neutral-900/50 border border-neutral-800 rounded-lg">
            <ShieldCheck className="text-yellow-500 mb-3" size={24} />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-2">Sertifikasi SILO & SIO Lengkap</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Seluruh mesin penunjang pekerjaan di area {data.nama} dipastikan lolos inspeksi K3 dan memiliki dokumen legalitas operator yang aktif.</p>
          </div>
          <div className="p-6 bg-neutral-900/50 border border-neutral-800 rounded-lg">
            <CheckCircle className="text-yellow-500 mb-3" size={24} />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-2">Mekanik Siaga Lapangan</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Downtime ditekan hingga batas minimal berkat kesiapan kru teknis lokal yang bersertifikasi pabrikan alat berat dunia.</p>
          </div>
        </div>

        {/* CTA Form Trigger */}
        <div className="text-center pt-4">
          <Link 
            href="/layanan" 
            className="inline-block border-b-2 border-yellow-600 text-yellow-500 hover:text-white hover:border-white font-bold uppercase tracking-widest text-xs transition-colors pb-1"
          >
            Minta Penawaran Harga Sewa Untuk Wilayah Ini &rarr;
          </Link>
        </div>

      </div>
    </main>
  );
}