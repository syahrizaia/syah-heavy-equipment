import dynamic from "next/dynamic";
import PublicNavbar from "@/components/PublicNavbar";
import LandingPage from "./(public)/landing-page/page";
import Footer from "@/components/Footer";

const AIConsultant = dynamic(() => import("@/components/AIConsultant"));
const ShareWebsiteButton = dynamic(() => import("@/components/ShareWebsiteButton"));
const ScrollToTopButton = dynamic(() => import("@/components/ScrollToTopButton"));

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-white">
      {/* NAVBAR KHUSUS PUBLIK */}
      <PublicNavbar />

      {/* Konten Halaman - Berikan padding top/bottom jika navbar/footer Anda berposisi fixed */}
      <div className="flex-1 w-full">
        <LandingPage />

        <AIConsultant />

        <ShareWebsiteButton />

        <ScrollToTopButton />
      </div>

      <Footer />
    </div>
  );
}
