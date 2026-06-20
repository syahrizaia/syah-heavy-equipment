/* eslint-disable @typescript-eslint/no-explicit-any */
import { Layers, MapPin, Sliders } from "lucide-react";

interface RentalDemandSectionProps {
  rentalRequestsData: any[] | null;
}

export default function RentalDemandSection({ rentalRequestsData }: RentalDemandSectionProps) {
  const requests = rentalRequestsData || [];
  const totalRequests = requests.length;

  // 1. ANALYTIC: Distribusi Jenis Alat yang Paling Banyak Disewa
  const equipmentMap: Record<string, number> = {};
  // 2. ANALYTIC: Sebaran Lokasi Proyek Klien
  const locationMap: Record<string, number> = {};

  requests.forEach((req) => {
    if (req.equipment_type) {
      equipmentMap[req.equipment_type] = (equipmentMap[req.equipment_type] || 0) + 1;
    }
    if (req.project_location) {
      locationMap[req.project_location] = (locationMap[req.project_location] || 0) + 1;
    }
  });

  const topEquipment = Object.entries(equipmentMap).sort((a, b) => b[1] - a[1])[0] || ["N/A", 0];
  const topLocation = Object.entries(locationMap).sort((a, b) => b[1] - a[1])[0] || ["N/A", 0];

  // 3. DATA SCIENCE SIMULATION: Rasio Konversi Kecepatan Layanan
  const processedRequests = requests.filter((r) => r.status?.toLowerCase() !== "pending").length;
  const conversionRate = totalRequests > 0 ? Math.round((processedRequests / totalRequests) * 100) : 100;

  return (
    <section className="py-12 md:py-16 px-4 md:px-6 max-w-7xl mx-auto border-t border-neutral-900">
      <div className="flex items-center gap-2 mb-2">
        <Sliders className="text-yellow-600" size={20} />
        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Demand Forecasting</span>
      </div>
      <h2 className="text-3xl md:text-4xl font-barlow font-bold text-white mb-8 uppercase">Analisis Proyeksi Kebutuhan Sewa</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Kebutuhan Alat Utama */}
        <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-yellow-600/10 flex items-center justify-center text-yellow-600 mb-4">
              <Layers size={20} />
            </div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Permintaan Unit Terbanyak</p>
            <h3 className="text-2xl font-bold font-barlow text-white mt-2 capitalize">{topEquipment[0]}</h3>
          </div>
          <p className="text-xs text-slate-500 mt-4 border-t border-neutral-800/60 pt-3">
            Dominasi sewa: <span className="text-yellow-600 font-bold">{topEquipment[1]} pengajuan</span> aktif bulan ini.
          </p>
        </div>

        {/* Card Pusat Lokasi Aktivitas */}
        <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-400 mb-4">
              <MapPin size={20} />
            </div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pusat Aktivitas Proyek</p>
            <h3 className="text-2xl font-bold font-barlow text-white mt-2 capitalize">{topLocation[0]}</h3>
          </div>
          <p className="text-xs text-slate-500 mt-4 border-t border-neutral-800/60 pt-3">
            Kepadatan wilayah operasional tertinggi terpantau di area ini.
          </p>
        </div>

        {/* Card DS: Response Confidence Velocity */}
        <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
              <Sliders size={20} />
            </div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Response Velocity Rate</p>
            <h3 className="text-4xl font-bold font-mono text-white mt-2">{conversionRate}%</h3>
          </div>
          <p className="text-xs text-slate-400 mt-4 border-t border-neutral-800/60 pt-3 leading-relaxed">
            Kecepatan peninjauan dokumen kelayakan spesifikasi proyek dan penawaran harga komersial.
          </p>
        </div>
      </div>
    </section>
  );
}