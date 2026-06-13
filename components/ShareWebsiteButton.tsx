"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";

export default function ShareWebsiteButton() {
  const SITE_URL = "https://syahheavyequipment.vercel.app";

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "PT Syah Heavy Equipment",
          text: "Solusi penyewaan alat berat dan penyediaan suku cadang mekanikal terbaik.",
          url: SITE_URL,
        });
        toast.success("Berhasil membagikan website!");
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          toast.error("Gagal membagikan tautan.");
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(SITE_URL);
        toast.success("Tautan website berhasil disalin ke clipboard!");
      } catch (err) {
        toast.error("Gagal menyalin tautan.");
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex items-center gap-4 bg-neutral-900 hover:bg-neutral-800 text-slate-300 hover:text-white pl-4 pr-3 py-3 rounded-l-xl border-l border-t border-b border-neutral-800 shadow-2xl transition-all duration-200 group text-sm font-semibold tracking-wide"
      title="Bagikan Website"
    >
      <Share2 
        size={18} 
        className="text-yellow-600 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-200" 
      />
      <span className="hidden sm:inline">Bagikan Website</span>
    </button>
  );
}