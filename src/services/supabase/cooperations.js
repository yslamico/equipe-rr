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

function sanitizeWhatsapp(value) {
  return String(value || "").replace(/\D/g, "");
}

function mapFromDatabase(row) {
  return {
    id: row.id,
    nome: row.nome,
    categoria: row.categoria,
    descricao: row.descricao || "",
    imagem: row.imagem_url || "",
    salario: formatCurrency(row.salario),
    valorDepositante: formatCurrency(
      row.valor_depositante,
    ),
    minimoDepositantes: String(
      row.minimo_depositantes ?? 0,
    ),
    distribuicao: row.distribuicao,
    contasDemo: String(row.contas_demo ?? 0),
    depositoMinimo: formatCurrency(
      row.deposito_minimo,
    ),
    saqueMinimo: formatCurrency(
      row.saque_minimo,
    ),
    dataEncerramento: row.data_encerramento || "",
    linkCadastro: row.link_cadastro || "",
    regras: row.regras || "",
    beneficios: row.beneficios || "",
    suporte: row.suporte || "",
    whatsappNumero: row.whatsapp_numero || "",
    mensagemWhatsApp: row.mensagem_whatsapp || "",
    status: row.status,
    nota: String(row.nota ?? "9.0"),
    pessoas: Number(row.pessoas ?? 0),
    criadoEm: row.created_at,
  };
}

function mapToDatabase(cooperacao) {
  return {
    nome: cooperacao.nome,
    categoria: cooperacao.categoria || "Cassino",
    descricao: cooperacao.descricao || null,
    imagem_url: cooperacao.imagem || null,
    salario: toNumber(cooperacao.salario),
    valor_depositante: toNumber(
      cooperacao.valorDepositante,
    ),
    minimo_depositantes: Number(
      cooperacao.minimoDepositantes || 0,
    ),
    distribuicao: cooperacao.distribuicao || "Alta",
    contas_demo: Number(cooperacao.contasDemo || 0),
    deposito_minimo: toNumber(
      cooperacao.depositoMinimo,
    ),
    saque_minimo: toNumber(cooperacao.saqueMinimo),
    data_encerramento:
      cooperacao.dataEncerramento || null,
    link_cadastro: cooperacao.linkCadastro || null,
    regras: cooperacao.regras || null,
    beneficios: cooperacao.beneficios || null,
    suporte: cooperacao.suporte || null,
    whatsapp_numero:
      sanitizeWhatsapp(cooperacao.whatsappNumero) ||
      null,
    mensagem_whatsapp:
      cooperacao.mensagemWhatsApp || null,
    status: cooperacao.status || "Ativa",
    nota: Number(cooperacao.nota || 9),
    pessoas: Number(cooperacao.pessoas || 0),
  };
}

export async function getCooperacoesSupabase() {
  const { data, error } = await supabase
    .from("cooperacoes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(
      "Erro ao buscar cooperações no Supabase:",
      error,
    );

    throw error;
  }

  return (data || []).map(mapFromDatabase);
}

export async function saveCooperacaoSupabase(
  cooperacao,
) {
  const payload = mapToDatabase(cooperacao);

  if (cooperacao.id) {
    const { data, error } = await supabase
      .from("cooperacoes")
      .update(payload)
      .eq("id", cooperacao.id)
      .select()
      .single();

    if (error) {
      console.error(
        "Erro ao atualizar cooperação:",
        error,
      );

      throw error;
    }

    return mapFromDatabase(data);
  }

  const { data, error } = await supabase
    .from("cooperacoes")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error(
      "Erro ao criar cooperação:",
      error,
    );

    throw error;
  }

  return mapFromDatabase(data);
}

export async function removeCooperacaoSupabase(id) {
  const { error } = await supabase
    .from("cooperacoes")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(
      "Erro ao excluir cooperação:",
      error,
    );

    throw error;
  }
}

export async function getCooperacaoSupabase(id) {
  const { data, error } = await supabase
    .from("cooperacoes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(
      "Erro ao buscar cooperação:",
      error,
    );

    throw error;
  }

  return mapFromDatabase(data);
}