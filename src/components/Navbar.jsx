import { useEffect, useRef, useState } from "react";
import {
  Bell,
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

export default function Navbar() {
  const { perfil, user, logout } = useAuth();
  const navigate = useNavigate();

  const [menuAberto, setMenuAberto] =
    useState(false);
  const [notificacoesAbertas, setNotificacoesAbertas] =
    useState(false);

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
      new CustomEvent("equipeRR:mobile-menu", {
        detail: { open: true },
      }),
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

            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-[#0b1020] bg-fuchsia-500" />
          </button>

          {notificacoesAbertas && (
            <div className="absolute right-0 top-[calc(100%+0.75rem)] w-80 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-white/10 bg-[#0b1020] shadow-2xl shadow-black/40">
              <div className="border-b border-white/10 px-4 py-3">
                <p className="text-sm font-black text-white">
                  Notificações
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Central da BoraCoop
                </p>
              </div>

              <div className="p-4">
                <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-4">
                  <p className="text-sm font-semibold text-white">
                    Tudo certo por aqui.
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    As próximas notificações vão aparecer neste espaço.
                  </p>
                </div>
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
                    navigate("/configuracoes");
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