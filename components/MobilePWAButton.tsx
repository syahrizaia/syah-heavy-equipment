/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

export default function MobilePWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            console.log("Service Worker aktif pada scope:", reg.scope);
          })
          .catch((err) => {
            console.error("Gagal mendaftarkan Service Worker:", err);
          });
      });
    }

    const userAgent = navigator.userAgent;
    const isIosDevice = /iPhone|iPad|iPod/i.test(userAgent);
    const isAndroidOrOtherMobile = /Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isMobileSize = window.innerWidth < 768;

    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;

    // Jika aplikasi sudah dibuka lewat ikon PWA terinstal, sembunyikan komponen ini
    if (isStandalone) return;

    // Khusus perangkat iOS Safari: Tampilkan tombol petunjuk manual secara instan
    if (isIosDevice) {
      setIsIos(true);
      setIsVisible(true);
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Tombol instalasi di Android hanya akan muncul jika syarat manifest dan sw telah terpenuhi
      if (isAndroidOrOtherMobile || isMobileSize) {
        setIsVisible(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      alert("Panduan Pengguna iOS Safari: Klik tombol Bagikan (Share) di bagian bawah browser Anda, lalu gulir ke bawah dan pilih Tambahkan ke Layar Utama (Add to Home Screen).");
      return;
    }

    // Mencegah error jika fungsi pemicu belum tereksekusi sempurna oleh browser
    if (!deferredPrompt) return;
    
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
        <p className="text-xs text-slate-300 leading-tight">
          {isIos ? "Tambahkan Syah Heavy Equipment ke layar utama Anda." : "Instal Syah Heavy Equipment di layar utama Anda."}
        </p>
      </div>
      
      <div className="flex items-center gap-2 flex-shrink-0">
        <button 
          onClick={handleInstallClick}
          className="bg-yellow-600 hover:bg-yellow-500 text-neutral-950 px-3 py-2 rounded font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Download size={14} /> {isIos ? "Petunjuk" : "Instal"}
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