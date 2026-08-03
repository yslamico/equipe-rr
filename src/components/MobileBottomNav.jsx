import {
  Handshake,
  Home,
  User,
  Wallet,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const items = [
  {
    icon: Home,
    label: "Início",
    path: "/",
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

export default function MobileBottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#070b18]/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.label}
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