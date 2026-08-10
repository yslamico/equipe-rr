import { supabase } from "../supabaseClient";

function mapFromDatabase(row) {
  return {
    id: row.id,
    cooperacaoId: row.cooperacao_id || "",
    blogueiroId: row.blogueiro_id || "",
    cooperacaoNome: row.cooperacoes?.nome || "",
    blogueiroNome: row.blogueiros?.nome || "",
    usuario: row.usuario || "",
    senha: row.senha || "",
    observacao: row.observacao || "",
    status: row.status || "Disponível",
    criadoEm: row.created_at || "",
  };
}

function mapToDatabase(conta) {
  const blogueiroId =
    conta.blogueiroId?.trim() || null;

  return {
    cooperacao_id:
      conta.cooperacaoId?.trim() || null,
    blogueiro_id: blogueiroId,
    usuario: conta.usuario.trim(),
    senha: conta.senha,
    observacao:
      conta.observacao?.trim() || null,
    status: blogueiroId
      ? "Em uso"
      : "Disponível",
  };
}

export async function getContasDemoSupabase() {
  const { data, error } = await supabase
    .from("contas_demo")
    .select(`
      *,
      cooperacoes(nome),
      blogueiros(nome)
    `)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Erro ao buscar contas demo:",
      error,
    );
    throw error;
  }

  return (data || []).map(mapFromDatabase);
}

export async function saveContaDemoSupabase(
  conta,
) {
  const payload = mapToDatabase(conta);

  if (conta.id) {
    const { data, error } = await supabase
      .from("contas_demo")
      .update(payload)
      .eq("id", conta.id)
      .select(`
        *,
        cooperacoes(nome),
        blogueiros(nome)
      `)
      .single();

    if (error) {
      console.error(
        "Erro ao atualizar conta demo:",
        error,
      );
      throw error;
    }

    return mapFromDatabase(data);
  }

  const { data, error } = await supabase
    .from("contas_demo")
    .insert(payload)
    .select(`
      *,
      cooperacoes(nome),
      blogueiros(nome)
    `)
    .single();

  if (error) {
    console.error(
      "Erro ao criar conta demo:",
      error,
    );
    throw error;
  }

  return mapFromDatabase(data);
}

export async function saveContasDemoEmMassaSupabase({
  cooperacaoId,
  contas,
  observacao = "",
}) {
  const payload = contas.map((conta) => ({
    cooperacao_id: cooperacaoId || null,
    blogueiro_id: null,
    usuario: conta.usuario.trim(),
    senha: conta.senha,
    observacao:
      observacao.trim() || null,
    status: "Disponível",
  }));

  const { data, error } = await supabase
    .from("contas_demo")
    .insert(payload)
    .select(`
      *,
      cooperacoes(nome),
      blogueiros(nome)
    `);

  if (error) {
    console.error(
      "Erro ao criar contas demo em massa:",
      error,
    );
    throw error;
  }

  return (data || []).map(mapFromDatabase);
}

export async function removeContaDemoSupabase(
  id,
) {
  const { error } = await supabase
    .from("contas_demo")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(
      "Erro ao excluir conta demo:",
      error,
    );
    throw error;
  }
}