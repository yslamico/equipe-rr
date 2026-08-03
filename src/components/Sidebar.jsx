import { NavLink, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Gift,
  Handshake,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  Trophy,
  User,
  Users,
  Wallet,
} from "lucide-react";

import logoEquipeRR from "../assets/logo-equipe-rr.png";
import { useAuth } from "../contexts/AuthContext";
import MobileBottomNav from "./MobileBottomNav";
import MobileSidebar from "./MobileSidebar";

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/",
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
    icon: Gift,
    label: "Brindes",
    path: "/brindes",
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

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

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
      <aside className="hidden min-h-screen w-72 shrink-0 border-r border-white/10 bg-[#070b18]/95 backdrop-blur-xl lg:flex lg:flex-col">
        <div className="border-b border-white/10 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-purple-400/20 bg-[#0b1020] shadow-lg shadow-purple-950/40">
              <img
                src={logoEquipeRR}
                alt="Logo da EQUIPE RR"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-xl font-black tracking-wide text-white">
                EQUIPE RR
              </h1>

              <p className="truncate text-xs text-slate-500">
                Blogueiros e agentes
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.label}
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
          <div className="mb-4 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-indigo-500/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-purple-300">
              Seu nível
            </p>

            <div className="mt-2 flex items-center justify-between">
              <strong className="text-white">Ouro</strong>
              <span className="text-xs text-amber-300">
                77%
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[77%] rounded-full bg-gradient-to-r from-amber-500 to-yellow-300" />
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