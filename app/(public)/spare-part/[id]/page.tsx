import { createServerSupabase } from "@/lib/supabase-server";
import PartDetailContent from "@/components/PartDetailContent";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://syahheavyequipment.com";

async function getPart(id: string) {
  const supabase = await createServerSupabase();

  // Hitungan view async (tidak memblokir render)
  supabase.rpc("increment_part_view", { target_id: id }).then(({ error }) => {
    if (error) console.error("Gagal mencatat tren view suku cadang:", error.message);
  });

  const { data: part, error } = await supabase
    .from("spare_parts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !part) return null;
  return part;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = await params;
  const part = await getPart(id);
  if (!part) return { title: "Suku Cadang Tidak Ditemukan" };

  const title = `${part.name} (P/N: ${part.part_number}) - Spare Parts Center`;
  const description = part.description || "Suku cadang asli untuk alat berat tambang, konstruksi, dan industri. Tersedia READY STOCK dan INDENT.";
  const image = Array.isArray(part.image)
    ? part.image[0]
    : part.image || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200";

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/spare-part/${id}` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/spare-part/${id}`,
      images: [{ url: image, width: 1200, height: 630, alt: part.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function PartDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const part = await getPart(id);
  if (!part) notFound();

  const image = Array.isArray(part.image) ? part.image[0] : part.image;
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: part.name,
    image: image || undefined,
    description: part.description || undefined,
    sku: part.part_number,
    mpn: part.part_number,
    brand: { "@type": "Brand", name: "Syah Heavy Equipment" },
    category: part.category || undefined,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/spare-part/${id}`,
      priceCurrency: "IDR",
      price: part.price || 0,
      availability: part.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <PartDetailContent part={part} />
    </>
  );
}
