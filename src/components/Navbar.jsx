import {
  Bell,
  ChevronDown,
  Menu,
  Search,
  Sparkles,
} from "lucide-react";

import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { perfil, user } = useAuth();

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

  function abrirMenuMobile() {
    window.dispatchEvent(
      new CustomEvent("equipeRR:mobile-menu", {
        detail: { open: true },
      }),
    );
  }

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-[#070b18]/90 px-3 backdrop-blur-xl sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={abrirMenuMobile}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 transition hover:bg-white/[0.06] hover:text-white lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu size={21} />
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
            className="hidden items-center gap-2 rounded-xl border border-purple-500/20 bg-purple-500/10 px-4 py-3 text-sm font-semibold text-purple-200 transition hover:bg-purple-500/15 md:flex"
          >
            <Sparkles size={18} />
            Nova cooperação
          </button>
        )}

        <button
          type="button"
          className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#0b1020] text-slate-300 transition hover:border-purple-500/30 hover:text-white"
          aria-label="Notificações"
        >
          <Bell size={20} />

          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-[#0b1020] bg-fuchsia-500" />
        </button>

        <button
          type="button"
          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0b1020] p-1.5 text-left transition hover:border-purple-500/30 sm:p-2 sm:pr-3"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 text-sm font-black text-white shadow-lg shadow-purple-950/30">
            {iniciais || "RR"}
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
            className="hidden text-slate-500 md:block"
          />
        </button>
      </div>
    </header>
  );
}