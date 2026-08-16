"use server";

import { createServerSupabase } from "@/lib/supabase-server";

interface OrderItem {
  partId: string;
  currentStock: number;
  quantityBought: number;
}

export async function processSparePartSale({ partId, currentStock, quantityBought }: OrderItem) {
  const supabase = await createServerSupabase();
  // Hitung sisa stok baru
  const newStock = currentStock - quantityBought;

  const { data, error } = await supabase
    .from("spare_parts")
    .update({ stock: newStock }) // Cukup kurangi stoknya saja
    .eq("id", partId);

  if (error) throw new Error(error.message);
  return data;
}