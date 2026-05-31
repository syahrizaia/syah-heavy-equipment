import { supabase } from "@/lib/supabase";
import ProjectList from "@/components/ProjectList";

export default async function ProyekPage() {
  const { data: projects, error } = await supabase.from("projects").select("*");

  if (error) {
    console.error("Error fetching projects:", error);
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Gagal memuat data proyek.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 pt-24 pb-16 px-4 md:px-6 w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto mb-12">
        <h2 className="text-yellow-600 font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase text-xs md:text-sm">
          Portfolio Utama
        </h2>
        <h1 className="text-4xl md:text-7xl font-bold font-barlow text-white uppercase mt-2">
          Rekam Jejak
        </h1>
      </div>
      
      {/* Komponen Client List sudah diatur responsif di file komponennya */}
      <ProjectList projects={projects || []} />
    </main>
  );
}