import dynamic from "next/dynamic";
import Footer from "@/components/Footer";
import PublicNavbar from "@/components/PublicNavbar";

const AIConsultant = dynamic(() => import("@/components/AIConsultant"));
const ScrollToTopButton = dynamic(() => import("@/components/ScrollToTopButton"));
const ShareWebsiteButton = dynamic(() => import("@/components/ShareWebsiteButton"));

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
      <div className="flex-1 w-full">
        {children}

        <AIConsultant />

        <ShareWebsiteButton />

        <ScrollToTopButton />
      </div>

      <Footer />
    </div>
  );
}
