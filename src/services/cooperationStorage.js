const STORAGE_KEY = "equipeRRCooperacoes";

export function getCooperacoes() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Erro ao carregar cooperações:", error);
    return [];
  }
}

export function saveCooperacao(cooperacao) {
  const cooperacoes = getCooperacoes();

  const novaCooperacao = {
    ...cooperacao,
    id: cooperacao.id || crypto.randomUUID(),
    criadoEm: cooperacao.criadoEm || new Date().toISOString(),
  };

  const existe = cooperacoes.some(
    (item) => item.id === novaCooperacao.id,
  );

  const atualizadas = existe
    ? cooperacoes.map((item) =>
        item.id === novaCooperacao.id
          ? novaCooperacao
          : item,
      )
    : [novaCooperacao, ...cooperacoes];

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(atualizadas),
  );

  window.dispatchEvent(
    new Event("equipeRRCooperacoesAtualizadas"),
  );

  return novaCooperacao;
}

export function removeCooperacao(id) {
  const atualizadas = getCooperacoes().filter(
    (item) => item.id !== id,
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(atualizadas),
  );

  window.dispatchEvent(
    new Event("equipeRRCooperacoesAtualizadas"),
  );
}