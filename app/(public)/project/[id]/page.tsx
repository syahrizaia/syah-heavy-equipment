import { createServerSupabase } from "@/lib/supabase-server";
import ProjectDetailContent from "@/components/ProjectDetailContent";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  // Ambil ID dari params
  const { id } = await params;
  const supabase = await createServerSupabase();

  // Fetch data dari Supabase
  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  // Jika data tidak ditemukan, tampilkan 404
  if (error || !project) {
    notFound();
  }

  return <ProjectDetailContent project={project} />;
}