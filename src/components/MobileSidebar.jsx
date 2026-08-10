import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Handshake,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageCircle,
  Package,
  Settings,
  Trophy,
  User,
  Users,
  Wallet,
  X,
} from "lucide-react";
import {
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import logoBoraCoop from "../assets/icone-boracoop.png";
import { useAuth } from "../contexts/AuthContext";

const adminItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/app",
    end: true,
  },
  {
    icon: Handshake,
    label: "Cooperações",
    path: "/admin",
  },
  {
    icon: Users,
    label: "Blogueiros",
    path: "/blogueiros",
  },
  {
    icon: Wallet,
    label: "Financeiro",
    path: "/financeiro",
  },
  {
    icon: Package,
    label: "Contas Demo",
    path: "/contas-demo",
  },
  {
    icon: BarChart3,
    label: "Estatísticas",
    path: "/estatisticas",
  },
  {
    icon: Trophy,
    label: "Ranking",
    path: "/ranking",
  },
  {
    icon: User,
    label: "Perfil",
    path: "/perfil",
  },
  {
    icon: Settings,
    label: "Configurações",
    path: "/configuracoes",
  },
];

const bloggerItems = [
  {
    icon: LayoutDashboard,
    label: "Meu painel",
    path: "/app",
    end: true,
  },
  {
    icon: Handshake,
    label: "Cooperações",
    path: "/cooperacoes",
  },
  {
    icon: Package,
    label: "Contas Demo",
    path: "/contas-demo",
  },
  {
    icon: Trophy,
    label: "Ranking",
    path: "/ranking",
  },
  {
    icon: User,
    label: "Meu perfil",
    path: "/perfil",
  },
];

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const {
    perfil,
    user,
    logout,
  } = useAuth();

  const items = useMemo(
    () =>
      perfil?.role === "admin"
        ? adminItems
        : bloggerItems,
    [perfil?.role],
  );

  const nome =
    perfil?.nome ||
    user?.user_metadata?.nome ||
    user?.email?.split("@")[0] ||
    "Usuário";

  const cargo =
    perfil?.role === "admin"
      ? "Administrador"
      : "Blogueiro";

  useEffect(() => {
    function handleMenu(event) {
      setOpen(Boolean(event.detail?.open));
    }

    window.addEventListener(
      "equipeRR:mobile-menu",
      handleMenu,
    );

    return () => {
      window.removeEventListener(
        "equipeRR:mobile-menu",
        handleMenu,
      );
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  async function sairDoSistema() {
    try {
      await logout();
      setOpen(false);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error(error);
      window.alert("Não foi possível sair.");
    }
  }

  return (
    <div
      className={[
        "fixed inset-0 z-50 lg:hidden",
        open
          ? "pointer-events-auto"
          : "pointer-events-none",
      ].join(" ")}
      aria-hidden={!open}
    >
      <button
        type="button"
        onClick={() => setOpen(false)}
        className={[
          "absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        ].join(" ")}
        aria-label="Fechar menu"
      />

      <aside
        className={[
          "absolute left-0 top-0 flex h-full w-[86%] max-w-sm flex-col border-r border-white/10 bg-[#070b18] shadow-2xl shadow-black/60 transition-transform duration-300",
          open
            ? "translate-x-0"
            : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 overflow-hidden rounded-2xl border border-purple-400/20 bg-[#0b1020]">
              <img
                src={logoBoraCoop}
                alt="BoraCoop"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-lg font-black text-white">
                BoraCoop
              </h2>

              <p className="truncate text-xs capitalize text-slate-500">
                {nome} · {cargo}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300"
            aria-label="Fechar menu"
          >
            <X size={21} />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={`${item.label}-${item.path}`}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  [
                    "flex min-h-14 items-center gap-4 rounded-2xl px-4 text-sm font-semibold transition",
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-purple-950/30"
                      : "text-slate-400 hover:bg-white/5 hover:text-white",
                  ].join(" ")
                }
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05]">
                  <Icon size={20} />
                </span>

                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">

          <div className="mb-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-300">
              Suporte BoraCoop
            </p>

            <div className="mt-3 grid gap-2">
              <a
                href="https://wa.me/5589981515242"
                target="_blank"
                rel="noreferrer"
                className="flex min-h-11 items-center gap-3 rounded-xl bg-emerald-500/10 px-3 text-sm font-semibold text-emerald-300"
              >
                <MessageCircle size={17} />
                WhatsApp
              </a>

              <a
                href="mailto:contato.boracoop@gmail.com"
                className="flex min-h-11 items-center gap-3 rounded-xl bg-indigo-500/10 px-3 text-sm font-semibold text-indigo-300"
              >
                <Mail size={17} />
                E-mail
              </a>

              <a
                href="https://instagram.com/boracoopoficial"
                target="_blank"
                rel="noreferrer"
                className="flex min-h-11 items-center gap-3 rounded-xl bg-fuchsia-500/10 px-3 text-sm font-semibold text-fuchsia-300"
              >
                <span className="flex h-[17px] w-[17px] items-center justify-center text-sm font-black">
                  @
                </span>
                @boracoopoficial
              </a>

              <a
                href="https://instagram.com/yslamico"
                target="_blank"
                rel="noreferrer"
                className="flex min-h-11 items-center gap-3 rounded-xl bg-purple-500/10 px-3 text-sm font-semibold text-purple-300"
              >
                <span className="flex h-[17px] w-[17px] items-center justify-center text-sm font-black">
                  @
                </span>
                <span>
                  @yslamico
                  <span className="block text-[10px] font-medium text-slate-500">
                    Guilherme · Fundador & CEO
                  </span>
                </span>
              </a>
            </div>
          </div>

          <button
            type="button"
            onClick={sairDoSistema}
            className="flex min-h-14 w-full items-center gap-3 rounded-2xl border border-red-500/15 bg-red-500/10 px-4 text-sm font-semibold text-red-300 transition hover:bg-red-500/15"
          >
            <LogOut size={20} />
            Sair da conta
          </button>
        </div>
      </aside>
    </div>
  );
}