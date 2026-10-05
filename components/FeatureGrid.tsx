"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Radio, Wrench, ArrowUpRight } from "lucide-react";

const features = [
  { icon: ShieldCheck, code: "01 / HSE", title: "Keselamatan jadi standar", desc: "Proses kerja mengutamakan kesiapan unit dan praktik keselamatan di lapangan.", size: "md:col-span-2" },
  { icon: Radio, code: "02 / TELEMETRY", title: "Visibilitas armada", desc: "Dukungan tracking dan pemantauan membantu tim memahami kondisi operasional.", size: "" },
  { icon: Wrench, code: "03 / AFTER SALES", title: "Dukungan teknis siaga", desc: "Tim servis siap membantu menjaga produktivitas unit dan kelancaran proyek.", size: "md:col-span-3" },
];

export default function FeatureGrid() {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {features.map(({ icon: Icon, code, title, desc, size }, i) => (
        <motion.article key={code} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45, delay: i * 0.08 }} whileHover={{ y: -4 }} className={`group relative overflow-hidden border border-white/[.09] bg-[#111827]/75 p-6 sm:p-8 ${size}`}>
          <div className="absolute left-0 top-0 h-px w-16 bg-amber-400 transition-all duration-300 group-hover:w-full" />
          <div className="mb-8 flex items-center justify-between"><span className="font-mono text-[10px] tracking-[.18em] text-slate-500">{code}</span><Icon size={21} strokeWidth={1.6} className="text-amber-400" /></div>
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><h3 className="font-barlow text-2xl font-bold uppercase tracking-wide text-white">{title}</h3><p className="mt-2 max-w-lg text-sm leading-6 text-slate-400">{desc}</p></div><ArrowUpRight size={18} className="shrink-0 text-slate-600 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-amber-400" /></div>
        </motion.article>
      ))}
    </div>
  );
}
