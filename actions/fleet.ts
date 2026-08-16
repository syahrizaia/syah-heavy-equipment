"use server";

import { createServerSupabase } from "@/lib/supabase-server";

export async function markFleetAsSold(fleetId: number) {
  const supabase = await createServerSupabase();
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