"use server";

import { supabase } from "@/lib/supabase";

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