import {
  ArrowRight,
  Bell,
  ShieldCheck,
  UserRound,
  Wrench,
} from "lucide-react";
import { Link } from "react-router-dom";

import BackgroundEffects from "../components/BackgroundEffects";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../contexts/AuthContext";

export default function Settings() {
  const { perfil, user } = useAuth();

  const nome =
    perfil?.nome ||
    user?.user_metadata?.nome ||
    user?.email?.split("@")[0] ||
    "Administrador";

  const email = user?.email || "Não informado";

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-transparent text-white lg:flex">
      <BackgroundEffects />
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Navbar />

        <main className="relative z-10 p-4 sm:p-6">
          <header className="mb-8">
            <p className="text-sm uppercase tracking-[0.25em] text-purple-300">
              Painel administrativo
            </p>

            <h1 className="mt-3 text-4xl font-black text-white">
              Configurações
            </h1>

            <p className="mt-2 max-w-2xl text-slate-400">
              Centralize as configurações da sua conta e do painel BoraCoop.
            </p>
          </header>

          <section className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-3xl border border-white/10 bg-[#0b1020]/90 p-6 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-300">
                  <UserRound size={21} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Conta
                  </p>

                  <h2 className="text-xl font-black text-white">
                    Dados do administrador
                  </h2>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Nome
                  </p>

                  <strong className="mt-1 block text-white">
                    {nome}
                  </strong>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    E-mail
                  </p>

                  <strong className="mt-1 block break-all text-white">
                    {email}
                  </strong>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Função
                  </p>

                  <strong className="mt-1 block text-emerald-300">
                    Administrador
                  </strong>
                </div>
              </div>

              <Link
                to="/perfil"
                className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-purple-500/20 bg-purple-500/10 px-4 text-sm font-semibold text-purple-200 transition hover:bg-purple-500/15"
              >
                Editar meu perfil
                <ArrowRight size={17} />
              </Link>
            </article>

            <article className="rounded-3xl border border-white/10 bg-[#0b1020]/90 p-6 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
                  <ShieldCheck size={21} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Sistema
                  </p>

                  <h2 className="text-xl font-black text-white">
                    Preferências do painel
                  </h2>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.025] p-4">
                  <Bell
                    size={20}
                    className="shrink-0 text-purple-300"
                  />

                  <div>
                    <strong className="block text-sm text-white">
                      Notificações
                    </strong>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      O sistema de notificações está ativo no painel.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.025] p-4">
                  <Wrench
                    size={20}
                    className="shrink-0 text-amber-300"
                  />

                  <div>
                    <strong className="block text-sm text-white">
                      Mais configurações em breve
                    </strong>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Este espaço já fica preparado para novas preferências administrativas.
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}