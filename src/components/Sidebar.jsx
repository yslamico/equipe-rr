import { NavLink, useNavigate } from "react-router-dom";
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
} from "lucide-react";

import logoBoraCoop from "../assets/icone-boracoop.png";
import { useAuth } from "../contexts/AuthContext";
import MobileBottomNav from "./MobileBottomNav";
import MobileSidebar from "./MobileSidebar";

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

export default function Sidebar() {
  const navigate = useNavigate();

  const {
    perfil,
    logout,
  } = useAuth();

  const isAdmin =
    perfil?.role === "admin";

  const menuItems =
    isAdmin
      ? adminItems
      : bloggerItems;

  async function sairDoSistema() {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error(error);
      window.alert("Não foi possível sair.");
    }
  }

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-white/10 bg-[#070b18]/95 text-white backdrop-blur-xl lg:flex">
        <div className="border-b border-white/10 p-5">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-purple-400/20 bg-[#0b1020] shadow-lg shadow-purple-950/30">
              <img
                src={logoBoraCoop}
                alt="Logo da BoraCoop"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-xl font-black tracking-wide text-white">
                BoraCoop
              </h1>

              <p className="truncate text-xs text-slate-500">
                {isAdmin
                  ? "Painel administrativo"
                  : "Painel do blogueiro"}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={`${item.label}-${item.path}`}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  [
                    "group flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition duration-300",
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-purple-950/30"
                      : "text-slate-400 hover:translate-x-1 hover:bg-white/5 hover:text-white",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={[
                        "flex h-10 w-10 items-center justify-center rounded-xl transition duration-300",
                        isActive
                          ? "bg-white/10"
                          : "bg-white/[0.03] group-hover:scale-110 group-hover:bg-purple-500/10",
                      ].join(" ")}
                    >
                      <Icon size={20} />
                    </span>

                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          {isAdmin && (
            <div className="mb-4 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-indigo-500/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-purple-300">
                Acesso
              </p>

              <strong className="mt-2 block text-white">
                Administrador
              </strong>
            </div>
          )}


          <div className="mb-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-300">
              Suporte BoraCoop
            </p>

            <div className="mt-3 space-y-2">
              <a
                href="https://wa.me/5589981515242"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-emerald-300"
              >
                <MessageCircle size={16} />
                WhatsApp
              </a>

              <a
                href="mailto:contato.boracoop@gmail.com"
                className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-indigo-300"
              >
                <Mail size={16} />
                E-mail
              </a>

              <a
                href="https://instagram.com/boracoopoficial"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-fuchsia-300"
              >
                <span className="flex h-4 w-4 items-center justify-center text-xs font-black">
                  @
                </span>
                @boracoopoficial
              </a>

              <a
                href="https://instagram.com/yslamico"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-purple-300"
              >
                <span className="flex h-4 w-4 items-center justify-center text-xs font-black">
                  @
                </span>
                <span>
                  @yslamico
                  <span className="block text-[10px] text-slate-600">
                    Guilherme · Fundador & CEO
                  </span>
                </span>
              </a>
            </div>
          </div>

          <button
            type="button"
            onClick={sairDoSistema}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-400 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut size={19} />
            Sair
          </button>
        </div>
      </aside>

      <MobileSidebar />
      <MobileBottomNav />
    </>
  );
}