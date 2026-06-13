import PublicNavbar from "@/components/PublicNavbar";
import LandingPage from "./(public)/landing-page/page";
import Footer from "@/components/Footer";
import AIConsultant from "@/components/AIConsultant";
import ShareWebsiteButton from "@/components/ShareWebsiteButton";
import ScrollToTopButton from "@/components/ScrollToTopButton";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-white">
      {/* NAVBAR KHUSUS PUBLIK */}
      <PublicNavbar />

      {/* Konten Halaman - Berikan padding top/bottom jika navbar/footer Anda berposisi fixed */}
      <main className="flex-1 w-full">
        <LandingPage />

        <AIConsultant />

        <ShareWebsiteButton />

        <ScrollToTopButton />
      </main>

      <Footer />
    </div>
  );
}
