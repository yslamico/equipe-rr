import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings,
  Sparkles,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import useCooperations from "../hooks/useCooperations";
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  syncNewCooperationNotifications,
} from "../services/notifications";

export default function Navbar() {
  const { perfil, user, logout } = useAuth();
  const { cooperacoes } = useCooperations();
  const navigate = useNavigate();

  const [menuAberto, setMenuAberto] =
    useState(false);
  const [notificacoesAbertas, setNotificacoesAbertas] =
    useState(false);
  const [notificacoes, setNotificacoes] =
    useState([]);

  const perfilRef = useRef(null);
  const notificacoesRef = useRef(null);

  const nome =
    perfil?.nome ||
    user?.user_metadata?.nome ||
    user?.email?.split("@")[0] ||
    "Usuário";

  const cargo =
    perfil?.role === "admin"
      ? "Administrador"
      : "Blogueiro";

  const iniciais = nome
    .split(" ")
    .filter(Boolean)
    .map((parte) => parte[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const userId = user?.id || "visitante";

  const naoLidas = useMemo(
    () =>
      notificacoes.filter(
        (notificacao) => !notificacao.lida,
      ).length,
    [notificacoes],
  );

  useEffect(() => {
    setNotificacoes(
      getNotifications(userId),
    );
  }, [userId]);

  useEffect(() => {
    if (!user?.id) return;

    syncNewCooperationNotifications(
      userId,
      cooperacoes,
    );

    setNotificacoes(
      getNotifications(userId),
    );
  }, [cooperacoes, user?.id, userId]);

  useEffect(() => {
    function handleAtualizacao() {
      setNotificacoes(
        getNotifications(userId),
      );
    }

    window.addEventListener(
      "boracoop:notificacoes-atualizadas",
      handleAtualizacao,
    );

    return () => {
      window.removeEventListener(
        "boracoop:notificacoes-atualizadas",
        handleAtualizacao,
      );
    };
  }, [userId]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        perfilRef.current &&
        !perfilRef.current.contains(event.target)
      ) {
        setMenuAberto(false);
      }

      if (
        notificacoesRef.current &&
        !notificacoesRef.current.contains(
          event.target,
        )
      ) {
        setNotificacoesAbertas(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  function abrirMenuMobile() {
    window.dispatchEvent(
      new CustomEvent(
        "equipeRR:mobile-menu",
        {
          detail: { open: true },
        },
      ),
    );
  }

  async function sairDoSistema() {
    try {
      await logout();
      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error(error);
      window.alert(
        "Não foi possível sair da conta.",
      );
    }
  }

  function abrirNovaCooperacao() {
    navigate("/admin");
  }

  function abrirNotificacao(notificacao) {
    markNotificationAsRead(
      userId,
      notificacao.id,
    );

    setNotificacoes(
      getNotifications(userId),
    );
    setNotificacoesAbertas(false);

    if (notificacao.rota) {
      navigate(notificacao.rota, {
        state:
          notificacao.state || undefined,
      });
    }
  }

  function marcarTodasComoLidas() {
    markAllNotificationsAsRead(userId);

    setNotificacoes(
      getNotifications(userId),
    );
  }

  function formatarTempo(data) {
    if (!data) return "";

    const agora = Date.now();
    const criada = new Date(data).getTime();

    if (!Number.isFinite(criada)) {
      return "";
    }

    const minutos = Math.max(
      0,
      Math.floor((agora - criada) / 60000),
    );

    if (minutos < 1) return "agora";
    if (minutos < 60) {
      return `${minutos} min`;
    }

    const horas = Math.floor(
      minutos / 60,
    );

    if (horas < 24) {
      return `${horas} h`;
    }

    const dias = Math.floor(horas / 24);
    return `${dias} d`;
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#050816]/90 px-3 py-3 backdrop-blur-xl sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          onClick={abrirMenuMobile}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0b1020] text-slate-300 lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu size={20} />
        </button>

        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-[#0b1020] px-3 py-3 shadow-lg shadow-black/10 transition focus-within:border-purple-500/40 focus-within:ring-4 focus-within:ring-purple-500/5 sm:max-w-xl sm:px-4">
          <Search
            size={19}
            className="shrink-0 text-slate-500"
          />

          <input
            type="search"
            placeholder="Buscar cooperações..."
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
          />

          <span className="hidden rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1 text-[11px] font-semibold text-slate-500 sm:block">
            CTRL K
          </span>
        </div>
      </div>

      <div className="ml-2 flex items-center gap-2 sm:ml-4 sm:gap-3">
        {perfil?.role === "admin" && (
          <button
            type="button"
            onClick={abrirNovaCooperacao}
            className="hidden items-center gap-2 rounded-xl border border-purple-500/20 bg-purple-500/10 px-4 py-3 text-sm font-semibold text-purple-200 transition hover:bg-purple-500/15 md:flex"
          >
            <Sparkles size={18} />
            Nova cooperação
          </button>
        )}

        <div
          ref={notificacoesRef}
          className="relative"
        >
          <button
            type="button"
            onClick={() =>
              setNotificacoesAbertas(
                (current) => !current,
              )
            }
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#0b1020] text-slate-300 transition hover:border-purple-500/30 hover:text-white"
            aria-label="Notificações"
          >
            <Bell size={20} />

            {naoLidas > 0 && (
              <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#0b1020] bg-fuchsia-500 px-1 text-[10px] font-black text-white">
                {naoLidas > 9
                  ? "9+"
                  : naoLidas}
              </span>
            )}
          </button>

          {notificacoesAbertas && (
            <div className="absolute right-0 top-[calc(100%+0.75rem)] w-[22rem] max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-white/10 bg-[#0b1020] shadow-2xl shadow-black/40">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                <div>
                  <p className="text-sm font-black text-white">
                    Notificações
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {naoLidas
                      ? `${naoLidas} não lida(s)`
                      : "Tudo em dia"}
                  </p>
                </div>

                {naoLidas > 0 && (
                  <button
                    type="button"
                    onClick={
                      marcarTodasComoLidas
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-purple-300 transition hover:bg-purple-500/10"
                  >
                    <CheckCheck size={15} />
                    Ler todas
                  </button>
                )}
              </div>

              <div className="max-h-[28rem] overflow-y-auto p-2">
                {notificacoes.length ? (
                  <div className="space-y-1">
                    {notificacoes.map(
                      (notificacao) => (
                        <button
                          key={notificacao.id}
                          type="button"
                          onClick={() =>
                            abrirNotificacao(
                              notificacao,
                            )
                          }
                          className={[
                            "w-full rounded-xl border p-3 text-left transition",
                            notificacao.lida
                              ? "border-transparent bg-transparent hover:bg-white/[0.03]"
                              : "border-purple-500/10 bg-purple-500/[0.06] hover:bg-purple-500/[0.09]",
                          ].join(" ")}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={[
                                "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                                notificacao.lida
                                  ? "bg-white/[0.04] text-slate-500"
                                  : "bg-purple-500/15 text-purple-300",
                              ].join(" ")}
                            >
                              {notificacao.lida ? (
                                <Check size={16} />
                              ) : (
                                <Bell size={16} />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <p
                                  className={[
                                    "text-sm",
                                    notificacao.lida
                                      ? "font-semibold text-slate-300"
                                      : "font-bold text-white",
                                  ].join(" ")}
                                >
                                  {
                                    notificacao.titulo
                                  }
                                </p>

                                <span className="shrink-0 text-[10px] text-slate-600">
                                  {formatarTempo(
                                    notificacao.criadaEm,
                                  )}
                                </span>
                              </div>

                              <p className="mt-1 text-xs leading-5 text-slate-500">
                                {
                                  notificacao.mensagem
                                }
                              </p>
                            </div>
                          </div>
                        </button>
                      ),
                    )}
                  </div>
                ) : (
                  <div className="p-2">
                    <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-5 text-center">
                      <Bell
                        size={24}
                        className="mx-auto text-slate-600"
                      />

                      <p className="mt-3 text-sm font-semibold text-white">
                        Nenhuma notificação ainda
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Novas cooperações e avisos vão aparecer aqui.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div
          ref={perfilRef}
          className="relative"
        >
          <button
            type="button"
            onClick={() =>
              setMenuAberto(
                (current) => !current,
              )
            }
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0b1020] p-1.5 text-left transition hover:border-purple-500/30 sm:p-2 sm:pr-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 text-sm font-black text-white shadow-lg shadow-purple-950/30">
              {iniciais || "BC"}
            </div>

            <div className="hidden leading-tight md:block">
              <p className="max-w-28 truncate text-sm font-semibold capitalize text-white">
                {nome}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {cargo}
              </p>
            </div>

            <ChevronDown
              size={17}
              className={[
                "hidden text-slate-500 transition md:block",
                menuAberto
                  ? "rotate-180"
                  : "",
              ].join(" ")}
            />
          </button>

          {menuAberto && (
            <div className="absolute right-0 top-[calc(100%+0.75rem)] w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#0b1020] shadow-2xl shadow-black/40">
              <div className="border-b border-white/10 p-4">
                <p className="truncate text-sm font-black text-white">
                  {nome}
                </p>

                <p className="mt-1 truncate text-xs text-slate-500">
                  {user?.email || cargo}
                </p>
              </div>

              <div className="p-2">
                <button
                  type="button"
                  onClick={() => {
                    setMenuAberto(false);
                    navigate("/perfil");
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                  <User size={18} />
                  Meu perfil
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuAberto(false);
                    navigate(
                      "/configuracoes",
                    );
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                  <Settings size={18} />
                  Configurações
                </button>

                <button
                  type="button"
                  onClick={sairDoSistema}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-300 transition hover:bg-red-500/10"
                >
                  <LogOut size={18} />
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}