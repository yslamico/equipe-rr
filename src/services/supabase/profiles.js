import { supabase } from "../supabaseClient";

export async function getProfilesSupabase() {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, nome, role, foto_url, whatsapp, created_at, updated_at"
    )
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Erro ao buscar usuários cadastrados:",
      error,
    );

    throw error;
  }

  return data || [];
}