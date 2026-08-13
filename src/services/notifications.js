const EVENT_NAME =
  "boracoop:notificacoes-atualizadas";

function storageKey(userId) {
  return `boracoop:notificacoes:${userId || "visitante"}`;
}

function cursorKey(userId) {
  return `boracoop:notificacoes:cursor:${userId || "visitante"}`;
}

function read(userId) {
  try {
    const saved = localStorage.getItem(
      storageKey(userId),
    );

    if (!saved) return [];

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(
      "Erro ao carregar notificações:",
      error,
    );

    return [];
  }
}

function write(userId, notifications) {
  localStorage.setItem(
    storageKey(userId),
    JSON.stringify(notifications),
  );

  window.dispatchEvent(
    new Event(EVENT_NAME),
  );
}

export function getNotifications(userId) {
  return read(userId).sort(
    (a, b) =>
      new Date(b.criadaEm).getTime() -
      new Date(a.criadaEm).getTime(),
  );
}

export function addNotification(
  userId,
  notification,
) {
  const current = read(userId);

  if (
    notification.chave &&
    current.some(
      (item) =>
        item.chave === notification.chave,
    )
  ) {
    return null;
  }

  const created = {
    id: crypto.randomUUID(),
    chave: notification.chave || null,
    tipo: notification.tipo || "geral",
    titulo:
      notification.titulo || "Notificação",
    mensagem: notification.mensagem || "",
    rota: notification.rota || null,
    state: notification.state || null,
    lida: false,
    criadaEm:
      notification.criadaEm ||
      new Date().toISOString(),
  };

  write(userId, [created, ...current].slice(0, 50));

  return created;
}

export function markNotificationAsRead(
  userId,
  notificationId,
) {
  const updated = read(userId).map(
    (notification) =>
      notification.id === notificationId
        ? {
            ...notification,
            lida: true,
          }
        : notification,
  );

  write(userId, updated);
}

export function markAllNotificationsAsRead(
  userId,
) {
  const updated = read(userId).map(
    (notification) => ({
      ...notification,
      lida: true,
    }),
  );

  write(userId, updated);
}

export function clearNotifications(userId) {
  write(userId, []);
}

export function syncNewCooperationNotifications(
  userId,
  cooperacoes,
) {
  if (!userId) return;

  const agora = new Date().toISOString();

  const cursorSalvo = localStorage.getItem(
    cursorKey(userId),
  );

  if (!cursorSalvo) {
    localStorage.setItem(
      cursorKey(userId),
      agora,
    );

    return;
  }

  const cursorTime = new Date(
    cursorSalvo,
  ).getTime();

  if (!Number.isFinite(cursorTime)) {
    localStorage.setItem(
      cursorKey(userId),
      agora,
    );

    return;
  }

  const novas = (cooperacoes || [])
    .filter((coop) => {
      if (
        coop.status === "Oculta" ||
        coop.status === "Encerrada"
      ) {
        return false;
      }

      if (!coop.criadoEm) {
        return false;
      }

      const criadoEm = new Date(
        coop.criadoEm,
      ).getTime();

      return (
        Number.isFinite(criadoEm) &&
        criadoEm > cursorTime
      );
    })
    .sort(
      (a, b) =>
        new Date(a.criadoEm).getTime() -
        new Date(b.criadoEm).getTime(),
    );

  for (const coop of novas) {
    addNotification(userId, {
      chave: `coop:${coop.id}`,
      tipo: "cooperacao",
      titulo: "Nova cooperação disponível",
      mensagem: coop.nome
        ? `${coop.nome} acabou de ficar disponível.`
        : "Uma nova oportunidade acabou de ficar disponível.",
      rota: "/cooperacao",
      state: { coop },
      criadaEm: coop.criadoEm,
    });
  }

  localStorage.setItem(
    cursorKey(userId),
    agora,
  );
}