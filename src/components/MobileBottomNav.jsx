import {
  Handshake,
  Home,
  Trophy,
  User,
  Wallet,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

const adminItems = [
  {
    icon: Home,
    label: "Início",
    path: "/app",
    end: true,
  },
  {
    icon: Handshake,
    label: "Coops",
    path: "/admin",
  },
  {
    icon: Wallet,
    label: "Financeiro",
    path: "/financeiro",
  },
  {
    icon: User,
    label: "Perfil",
    path: "/perfil",
  },
];

const bloggerItems = [
  {
    icon: Home,
    label: "Início",
    path: "/app",
    end: true,
  },
  {
    icon: Handshake,
    label: "Coops",
    path: "/cooperacoes",
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
];

export default function MobileBottomNav() {
  const { perfil } = useAuth();

  const items =
    perfil?.role === "admin"
      ? adminItems
      : bloggerItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#070b18]/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-4 gap-1">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={`${item.label}-${item.path}`}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                [
                  "flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[11px] font-semibold transition",
                  isActive
                    ? "bg-purple-500/15 text-purple-300"
                    : "text-slate-500 hover:bg-white/5 hover:text-white",
                ].join(" ")
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}