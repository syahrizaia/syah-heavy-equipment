"use client";

import { ShieldCheck, Lock, Database, Eye } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-slate-300 pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-barlow text-white uppercase mb-6">Kebijakan Privasi</h1>
          <p className="text-slate-500">Terakhir diperbarui: 30 Mei 2026</p>
        </div>

        {/* Content Section */}
        <div className="space-y-12">
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Eye className="text-yellow-600" /> 1. Pendahuluan
            </h2>
            <p className="leading-relaxed">
              Syah Heavy Equipment berkomitmen untuk melindungi privasi data Anda. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda saat Anda menggunakan layanan kami, termasuk situs web kami dan platform monitoring IoT kami.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Database className="text-yellow-600" /> 2. Data yang Kami Kumpulkan
            </h2>
            <p className="leading-relaxed mb-4">Kami mengumpulkan informasi yang Anda berikan langsung kepada kami, seperti:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Informasi kontak perusahaan (nama, email, nomor telepon).</li>
              <li>Data operasional teknis yang dihasilkan oleh sistem IoT kami di lapangan.</li>
              <li>Data navigasi saat Anda menggunakan situs web kami.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Lock className="text-yellow-600" /> 3. Penggunaan Data
            </h2>
            <p className="leading-relaxed">
              Kami menggunakan data yang dikumpulkan untuk meningkatkan performa armada Anda, memberikan dukungan teknis yang lebih prediktif, serta untuk berkomunikasi mengenai pembaruan layanan dan penawaran yang relevan dengan kebutuhan proyek Anda.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <ShieldCheck className="text-yellow-600" /> 4. Keamanan Data
            </h2>
            <p className="leading-relaxed">
              Kami menerapkan langkah-langkah keamanan teknis dan organisasional yang canggih untuk melindungi data Anda dari akses yang tidak sah, pengungkapan, atau modifikasi. Data IoT yang ditransmisikan dari unit kami dienkripsi menggunakan protokol standar industri.
            </p>
          </section>

          <section className="bg-neutral-900 p-8 border border-neutral-800 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Hubungi Kami</h2>
            <p className="leading-relaxed mb-6">
              Jika Anda memiliki pertanyaan mengenai kebijakan privasi ini atau ingin mengakses, memperbaiki, atau menghapus data pribadi Anda, silakan hubungi kami di:
            </p>
            <div className="space-y-2 font-bold text-white">
              <p>Email: uluansyahroni57@gmail.com</p>
              <p>Telepon: +62 812 2813 4488</p>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}