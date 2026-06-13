import AIConsultant from "@/components/AIConsultant";
import Footer from "@/components/Footer";
import PublicNavbar from "@/components/PublicNavbar";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import ShareWebsiteButton from "@/components/ShareWebsiteButton";

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

        <AIConsultant />

        <ShareWebsiteButton />

        <ScrollToTopButton />
      </main>

      <Footer />
    </div>
  );
}