const STORAGE_KEY = "equipeRRBlogueiros";

function readBlogueiros() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Erro ao carregar blogueiros:", error);
    return [];
  }
}

function notifyUpdate() {
  window.dispatchEvent(
    new Event("equipeRRBlogueirosAtualizados"),
  );
}

export function getBlogueiros() {
  return readBlogueiros();
}

export function saveBlogueiro(blogueiro) {
  const blogueiros = readBlogueiros();

  const novoBlogueiro = {
    ...blogueiro,
    id: blogueiro.id || crypto.randomUUID(),
    criadoEm:
      blogueiro.criadoEm || new Date().toISOString(),
  };

  const existe = blogueiros.some(
    (item) => item.id === novoBlogueiro.id,
  );

  const atualizados = existe
    ? blogueiros.map((item) =>
        item.id === novoBlogueiro.id
          ? novoBlogueiro
          : item,
      )
    : [novoBlogueiro, ...blogueiros];

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(atualizados),
  );

  notifyUpdate();

  return novoBlogueiro;
}

export function removeBlogueiro(id) {
  const atualizados = readBlogueiros().filter(
    (item) => item.id !== id,
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(atualizados),
  );

  notifyUpdate();
}

export function getBlogueiro(id) {
  return readBlogueiros().find(
    (item) => item.id === id,
  );
}

export function clearBlogueiros() {
  localStorage.removeItem(STORAGE_KEY);
  notifyUpdate();
}