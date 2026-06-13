"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Fungsi untuk memantau posisi gulir layar
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Fungsi untuk mengeksekusi gulir mulus ke paling atas
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 left-6 z-50 p-3 bg-yellow-600 hover:bg-yellow-500 text-neutral-950 rounded-full shadow-2xl transition-all duration-300 animate-fade-in hover:-translate-y-1 focus:outline-none border border-yellow-500/20"
      title="Kembali ke Atas"
      aria-label="Scroll to top"
    >
      <ChevronUp size={22} className="stroke-[2.5]" />
    </button>
  );
}