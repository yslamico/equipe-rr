const STORAGE_KEY = "equipeRRPagamentos";

function readPagamentos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Erro ao carregar pagamentos:", error);
    return [];
  }
}

function notifyUpdate() {
  window.dispatchEvent(
    new Event("equipeRRPagamentosAtualizados"),
  );
}

export function getPagamentos() {
  return readPagamentos();
}

export function savePagamento(pagamento) {
  const pagamentos = readPagamentos();

  const novoPagamento = {
    ...pagamento,
    id: pagamento.id || crypto.randomUUID(),
    criadoEm:
      pagamento.criadoEm || new Date().toISOString(),
  };

  const existe = pagamentos.some(
    (item) => item.id === novoPagamento.id,
  );

  const atualizados = existe
    ? pagamentos.map((item) =>
        item.id === novoPagamento.id
          ? novoPagamento
          : item,
      )
    : [novoPagamento, ...pagamentos];

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(atualizados),
  );

  notifyUpdate();

  return novoPagamento;
}

export function removePagamento(id) {
  const atualizados = readPagamentos().filter(
    (item) => item.id !== id,
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(atualizados),
  );

  notifyUpdate();
}

export function getPagamento(id) {
  return readPagamentos().find(
    (item) => item.id === id,
  );
}

export function clearPagamentos() {
  localStorage.removeItem(STORAGE_KEY);
  notifyUpdate();
}