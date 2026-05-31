// app/(private)/layout.tsx
import PrivateSidebar from "@/components/PrivateSidebar";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-neutral-950 text-white overflow-hidden">
      
      <PrivateSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full pt-16 md:pt-0 overflow-y-auto">
        
        {/* Konten Utama Halaman (Akan memanjang ke bawah jika data statistik penuh) */}
        <main className="flex-1">
          {children}
        </main>

        <footer className="border-t border-neutral-900 bg-neutral-900/20 py-4 px-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-500 w-full mt-auto flex-shrink-0">
          <div>
            &copy; 2026 <span className="text-yellow-600 font-bold tracking-wide uppercase">Syah Heavy Equipment</span>. Hak Cipta Dilindungi.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> 
              v2.4.1-stable
            </span>
            <span className="text-neutral-700">|</span>
            <span>Sistem Telematika Internal</span>
          </div>
        </footer>

      </div>
    </div>
  );
}