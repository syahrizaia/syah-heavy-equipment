import { supabase } from "@/lib/supabase";
import FleetDetailContent from "@/components/FleetDetailContent";
import { notFound } from "next/navigation";

export async function trackFleetView(fleetId: number) {
  const { error } = await supabase.rpc("increment_fleet_view", { 
    target_id: fleetId 
  });
  
  if (error) console.error("Gagal mencatat tren view armada:", error.message);
}

export async function markFleetAsSold(fleetId: number) {
  const { data, error } = await supabase
    .from("fleet")
    .update({ 
      status: "Sold", 
      is_sold: true 
    }) // Cukup ubah status ini
    .eq("id", fleetId);

  if (error) throw new Error(error.message);
  return data;
}

export default async function FleetDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  await supabase.rpc("increment_fleet_view", { target_id: id });

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