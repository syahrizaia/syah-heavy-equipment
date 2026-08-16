import { createServerSupabase } from "@/lib/supabase-server";
import FleetList from "@/components/FleetList";

export const revalidate = 60;

export default async function FleetPage() {
  const supabase = await createServerSupabase();
  const { data: fleet, error } = await supabase
    .from("fleet")
    .select("*");

  if (error) {
    console.error("Error fetching data:", error);
    return (
        <div className="min-h-screen flex items-center justify-center text-white">
            Gagal memuat data armada.
        </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white w-full overflow-x-hidden">
      <FleetList initialData={fleet || []} />
    </main>
  );
}