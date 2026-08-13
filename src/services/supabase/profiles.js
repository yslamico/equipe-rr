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

export async function getProfileById(id) {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, nome, role, foto_url, whatsapp, created_at, updated_at"
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error(
      "Erro ao buscar perfil do usuário:",
      error,
    );

    throw error;
  }

  return data;
}

export async function getBloggerByUserId(userId) {
  const { data, error } = await supabase
    .from("blogueiros")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error(
      "Erro ao buscar dados do blogueiro:",
      error,
    );

    throw error;
  }

  return data;
}