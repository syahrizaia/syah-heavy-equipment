/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

export default function MobilePWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Memeriksa apakah pengguna menggunakan perangkat mobile
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768;

    // Memeriksa apakah aplikasi sudah berjalan dalam mode PWA terinstal
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;

    if (isMobileDevice && !isStandalone) {
      setIsVisible(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (isMobileDevice && !isStandalone) {
        setIsVisible(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Panduan edukasi khusus untuk pengguna iOS Safari yang tidak mendukung prompt otomatis
      alert("Untuk pengguna iOS: Klik ikon Bagikan (Share) di bawah browser Anda, lalu pilih Tambahkan ke Layar Utama (Add to Home Screen).");
      return;
    }
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 md:hidden bg-neutral-900 border border-neutral-800 p-4 rounded-xl shadow-2xl flex items-center justify-between gap-4">
      <div className="flex flex-col gap-0.5">
        <p className="text-xs font-bold uppercase tracking-wider text-yellow-600 font-barlow">Aplikasi Mobile</p>
        <p className="text-xs text-slate-300 leading-tight">Instal Syah Heavy Equipment di layar utama Anda.</p>
      </div>
      
      <div className="flex items-center gap-2 flex-shrink-0">
        <button 
          onClick={handleInstallClick}
          className="bg-yellow-600 hover:bg-yellow-500 text-neutral-950 px-3 py-2 rounded font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Download size={14} /> Instal
        </button>
        <button 
          onClick={() => setIsVisible(false)}
          className="p-2 text-slate-500 hover:text-white transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}