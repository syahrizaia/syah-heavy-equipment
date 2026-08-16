import { createServerSupabase } from "@/lib/supabase-server";
import FleetDetailContent from "@/components/FleetDetailContent";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://syahheavyequipment.com";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data: fleet } = await supabase
    .from("fleet")
    .select("*")
    .eq("id", id)
    .single();

  if (!fleet) return { title: "Unit Tidak Ditemukan" };

  const title = `${fleet.title} ${fleet.model ? "- " + fleet.model : ""} - Syah Heavy Equipment`;
  const description = fleet.description || `${fleet.title} ${fleet.model || ""} - solusi alat berat untuk tambang, konstruksi, dan industri. Sewa atau beli unit terbaik.`;
  const image = Array.isArray(fleet.image_url)
    ? fleet.image_url[0]
    : fleet.image_url || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200";

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/fleet/${id}` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/fleet/${id}`,
      images: [{ url: image, width: 1200, height: 630, alt: fleet.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function FleetDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const supabase = await createServerSupabase();

  // Hitungan view async (tidak memblokir render)
  supabase.rpc("increment_fleet_view", { target_id: id }).then(({ error }) => {
    if (error) console.error("Gagal mencatat tren view armada:", error.message);
  });

  // Fetch data spesifik berdasarkan ID
  const { data: fleet, error } = await supabase
    .from("fleet")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !fleet) {
    notFound(); // Redirect ke halaman 404 jika data tidak ada
  }

  const image = Array.isArray(fleet.image_url) ? fleet.image_url[0] : fleet.image_url;
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${fleet.title} ${fleet.model || ""}`.trim(),
    image: image || undefined,
    description: fleet.description || undefined,
    brand: { "@type": "Brand", name: "Syah Heavy Equipment" },
    category: fleet.category || undefined,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/fleet/${id}`,
      priceCurrency: "IDR",
      price: fleet.price || 0,
      availability: fleet.is_sold ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <FleetDetailContent fleet={fleet} />
    </>
  );
}