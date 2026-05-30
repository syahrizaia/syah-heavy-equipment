import Footer from "@/components/Footer";
import PublicNavbar from "@/components/PublicNavbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-white">
      {/* NAVBAR KHUSUS PUBLIK */}
      <PublicNavbar />

      {/* Konten Halaman - Berikan padding top/bottom jika navbar/footer Anda berposisi fixed */}
      <main className="flex-1 w-full">
        {children}
      </main>

      <Footer />
    </div>
  );
}