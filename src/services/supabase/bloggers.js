import { supabase } from "../supabaseClient";

function toNumber(value) {
  const normalized = String(value ?? "")
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const number = Number(normalized);

  return Number.isFinite(number) ? number : 0;
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function mapFromDatabase(row) {
  return {
    id: row.id,
    userId: row.user_id || "",
    nome: row.nome || "",
    foto: row.foto_url || "",
    whatsapp: row.whatsapp || "",
    instagram: row.instagram || "",
    telegram: row.telegram || "",
    cidade: row.cidade || "",
    estado: row.estado || "",
    pix: row.pix || "",
    cpf: row.cpf || "",
    status: row.status || "Ativo",
    nivel: row.nivel || "Bronze",
    cooperacoes: Number(
      row.cooperacoes_realizadas ?? 0,
    ),
    totalGanho: formatCurrency(
      row.total_ganho ?? 0,
    ),
    criadoEm: row.created_at || "",
  };
}

function mapToDatabase(blogueiro) {
  return {
    user_id: blogueiro.userId || null,
    nome: blogueiro.nome,
    foto_url: blogueiro.foto || null,
    whatsapp: blogueiro.whatsapp || null,
    instagram: blogueiro.instagram || null,
    telegram: blogueiro.telegram || null,
    cidade: blogueiro.cidade || null,
    estado: blogueiro.estado || null,
    pix: blogueiro.pix || null,
    cpf: blogueiro.cpf || null,
    status: blogueiro.status || "Ativo",
    nivel: blogueiro.nivel || "Bronze",
    cooperacoes_realizadas: Number(
      blogueiro.cooperacoes || 0,
    ),
    total_ganho: toNumber(
      blogueiro.totalGanho,
    ),
  };
}

export async function getBlogueirosSupabase() {
  const { data, error } = await supabase
    .from("blogueiros")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Erro ao buscar blogueiros no Supabase:",
      error,
    );

    throw error;
  }

  return (data || []).map(mapFromDatabase);
}

export async function saveBlogueiroSupabase(
  blogueiro,
) {
  const payload = mapToDatabase(blogueiro);

  if (blogueiro.id) {
    const { data, error } = await supabase
      .from("blogueiros")
      .update(payload)
      .eq("id", blogueiro.id)
      .select()
      .single();

    if (error) {
      console.error(
        "Erro ao atualizar blogueiro:",
        error,
      );

      throw error;
    }

    return mapFromDatabase(data);
  }

  const { data, error } = await supabase
    .from("blogueiros")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error(
      "Erro ao cadastrar blogueiro:",
      error,
    );

    throw error;
  }

  return mapFromDatabase(data);
}

export async function removeBlogueiroSupabase(
  id,
) {
  const { error } = await supabase
    .from("blogueiros")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(
      "Erro ao excluir blogueiro:",
      error,
    );

    throw error;
  }
}

export async function getBlogueiroSupabase(id) {
  const { data, error } = await supabase
    .from("blogueiros")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(
      "Erro ao buscar blogueiro:",
      error,
    );

    throw error;
  }

  return mapFromDatabase(data);
}