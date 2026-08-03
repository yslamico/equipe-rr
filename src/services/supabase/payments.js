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
    blogueiroId: row.blogueiro_id || "",
    cooperacaoId: row.cooperacao_id || "",
    blogueiroNome: row.blogueiros?.nome || "",
    cooperacaoNome: row.cooperacoes?.nome || "",
    valor: formatCurrency(row.valor),
    data: row.data_pagamento || "",
    formaPagamento: row.forma_pagamento || "PIX",
    status: row.status || "Pendente",
    observacao: row.observacao || "",
    criadoEm: row.created_at || "",
  };
}

function mapToDatabase(pagamento) {
  return {
    blogueiro_id: pagamento.blogueiroId,
    cooperacao_id: pagamento.cooperacaoId,
    valor: toNumber(pagamento.valor),
    data_pagamento: pagamento.data,
    forma_pagamento: pagamento.formaPagamento || "PIX",
    status: pagamento.status || "Pendente",
    observacao: pagamento.observacao || null,
  };
}

export async function getPagamentosSupabase() {
  const { data, error } = await supabase
    .from("pagamentos")
    .select(`*, blogueiros(nome), cooperacoes(nome)`)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []).map(mapFromDatabase);
}

export async function savePagamentoSupabase(pagamento) {
  const payload = mapToDatabase(pagamento);

  const query = pagamento.id
    ? supabase.from("pagamentos").update(payload).eq("id", pagamento.id)
    : supabase.from("pagamentos").insert(payload);

  const { data, error } = await query
    .select(`*, blogueiros(nome), cooperacoes(nome)`)
    .single();

  if (error) throw error;
  return mapFromDatabase(data);
}

export async function removePagamentoSupabase(id) {
  const { error } = await supabase
    .from("pagamentos")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function getPagamentoSupabase(id) {
  const { data, error } = await supabase
    .from("pagamentos")
    .select(`*, blogueiros(nome), cooperacoes(nome)`)
    .eq("id", id)
    .single();

  if (error) throw error;
  return mapFromDatabase(data);
}