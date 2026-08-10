import { supabase } from "../supabaseClient";

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function mapFromDatabase(row) {
  return {
    id: row.id,
    nome: row.nome || "",
    categoria:
      row.categoria || "Cooperação",
    modeloPlataforma:
      row.modelo_plataforma || "",
    descricao: row.descricao || "",
    imagem: row.imagem_url || "",
    salario: formatCurrency(row.salario),
    valorDepositante: formatCurrency(
      row.valor_depositante,
    ),
    minimoDepositantes: Number(
      row.minimo_depositantes ?? 0,
    ),
    dataEncerramento:
      row.data_encerramento || "",
    status: row.status || "Ativa",
    nota: Number(row.nota ?? 0),
    pessoas: Number(row.pessoas ?? 0),
  };
}

export async function getCooperacoesPublicas() {
  const { data, error } = await supabase
    .from("cooperacoes_publicas")
    .select("*")
    .order("nome", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Erro ao buscar cooperações públicas:",
      error,
    );
    throw error;
  }

  return (data || []).map(mapFromDatabase);
}