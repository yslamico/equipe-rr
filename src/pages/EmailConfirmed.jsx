import {
  CheckCircle2,
  LogIn,
  MailCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

import BackgroundEffects from "../components/BackgroundEffects";
import logoBoraCoop from "../assets/logo-boracoop.png";

export default function EmailConfirmed() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050816] px-4 py-10 text-white">
      <BackgroundEffects />

      <main className="relative z-10 w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b1020]/95 p-6 text-center shadow-2xl shadow-purple-950/40 backdrop-blur-xl sm:p-10">
        <div className="mx-auto h-24 w-24 overflow-hidden rounded-3xl border border-purple-400/20 bg-[#070b18] shadow-xl">
          <img
            src={logoBoraCoop}
            alt="BoraCoop"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="mx-auto mt-7 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10">
          <MailCheck
            size={31}
            className="text-emerald-300"
          />
        </div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-purple-300">
          BoraCoop
        </p>

        <h1 className="mt-3 text-3xl font-black sm:text-4xl">
          E-mail confirmado!
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-400 sm:text-base">
          Seu acesso foi confirmado com sucesso. Agora você já pode entrar na BoraCoop e acessar seu painel.
        </p>

        <div className="mt-6 space-y-3 rounded-2xl border border-white/5 bg-white/[0.025] p-4 text-left">
          <div className="flex items-start gap-3">
            <CheckCircle2
              size={19}
              className="mt-0.5 shrink-0 text-emerald-400"
            />

            <div>
              <strong className="text-sm text-white">
                Cadastro confirmado
              </strong>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Seu e-mail já está validado.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Sparkles
              size={19}
              className="mt-0.5 shrink-0 text-purple-300"
            />

            <div>
              <strong className="text-sm text-white">
                Próximo passo
              </strong>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Entre na sua conta para ver cooperações, pagamentos, ranking e muito mais.
              </p>
            </div>
          </div>
        </div>

        <Link
          to="/login"
          className="mt-7 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 px-6 font-bold text-white shadow-lg shadow-purple-950/30 transition hover:brightness-110"
        >
          <LogIn size={20} />
          Entrar na BoraCoop
        </Link>

        <Link
          to="/"
          className="mt-4 inline-block text-sm font-semibold text-slate-500 transition hover:text-purple-300"
        >
          Voltar para o início
        </Link>
      </main>
    </div>
  );
}