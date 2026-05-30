import Footer from "@/components/Footer";
import Navbar from "@/components/PublicNavbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* NAVBAR KHUSUS PUBLIK */}
      <Navbar />

      {/* Konten Halaman */}
      <div className="flex-1">
        {children}
      </div>

      <Footer />
    </div>
  );
}