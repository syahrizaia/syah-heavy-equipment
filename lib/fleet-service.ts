/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/lib/supabase";

export const fleetService = {
  async fetchAll() {
    const { data, error } = await supabase
      .from("fleet")
      .select("*")
      .order("title", { ascending: true });
    if (error) throw error;
    return data;
  },

  async uploadImages(files: File[]) {
    const imageUrls: string[] = [];
    await Promise.all(files.map(async (file) => {
      const fileName = `${Date.now()}_${file.name}`;
      const { error } = await supabase.storage.from('fleet-images').upload(fileName, file);
      if (!error) {
        const { data } = supabase.storage.from('fleet-images').getPublicUrl(fileName);
        imageUrls.push(data.publicUrl);
      }
    }));
    return imageUrls;
  },

  async upsert(unit: any) {
    const { error } = await supabase.from("fleet").upsert([unit]);
    if (error) throw error;
  },

  async delete(id: string | number) {
    const { error } = await supabase.from("fleet").delete().eq("id", id);
    if (error) throw error;
  }
};