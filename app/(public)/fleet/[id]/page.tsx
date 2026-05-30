import { supabase } from "@/lib/supabase";
import FleetDetailContent from "@/components/FleetDetailContent";
import { notFound } from "next/navigation";

export default async function FleetDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  // Fetch data spesifik berdasarkan ID
  const { data: fleet, error } = await supabase
    .from("fleet")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !fleet) {
    notFound(); // Redirect ke halaman 404 jika data tidak ada
  }

  return <FleetDetailContent fleet={fleet} />;
}