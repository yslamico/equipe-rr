import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  LogIn,
  Mail,
} from "lucide-react";

import logoBoraCoop from "../assets/logo-boracoop.png";
import iconeBoraCoop from "../assets/icone-boracoop.png";
import BackgroundEffects from "../components/BackgroundEffects";
import { entrarComEmail } from "../services/supabase/auth";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setErro("");

      const { user } = await entrarComEmail({
        email,
        senha,
      });

      if (!user) {
        throw new Error(
          "Não foi possível identificar o usuário.",
        );
      }

      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);

      setErro(
        error?.message ||
          "E-mail ou senha inválidos.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050816] px-3 py-6 text-white sm:px-4 sm:py-10">
      <BackgroundEffects />

      <main className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b1020]/95 shadow-2xl shadow-purple-950/40 backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden min-h-[680px] flex-col justify-between bg-gradient-to-br from-indigo-700/50 via-purple-700/30 to-fuchsia-700/20 p-10 lg:flex">
          <div>
            <div className="max-w-[340px] overflow-hidden rounded-[1.75rem] border border-purple-400/20 bg-[#070b18]/80 p-3 shadow-2xl shadow-purple-950/40">
              <img
                src={logoBoraCoop}
                alt="BoraCoop"
                className="h-auto w-full object-contain"
              />
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-purple-200">
              Plataforma oficial
            </p>

            <h1 className="mt-4 max-w-lg text-5xl font-black leading-tight">
              Bora transformar influência em resultado?
            </h1>

            <p className="mt-6 max-w-md text-lg leading-8 text-slate-300">
              Cooperações, pagamentos e gestão de oportunidades em um só lugar.
            </p>
          </div>

          <p className="text-sm text-slate-400">
            Acesso protegido pelo Supabase Auth.
          </p>
        </section>

        <section className="p-5 sm:p-10 lg:p-12">
          <div className="mx-auto max-w-md">
            <div className="mb-8 flex items-center gap-4 lg:hidden">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-purple-400/20 bg-[#070b18] shadow-lg shadow-purple-950/30">
                <img
                  src={iconeBoraCoop}
                  alt="BoraCoop"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.3em] text-purple-300">
                  Plataforma oficial
                </p>

                <h1 className="mt-1 truncate text-2xl font-black">
                  BoraCoop
                </h1>
              </div>
            </div>

            <p className="text-sm uppercase tracking-[0.25em] text-purple-300">
              Bem-vindo
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Entrar no painel
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">
              Use seu e-mail e senha para acessar a BoraCoop.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-300">
                  E-mail
                </span>

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#070b18] px-4 focus-within:border-purple-500/40 focus-within:ring-4 focus-within:ring-purple-500/5">
                  <Mail
                    size={19}
                    className="shrink-0 text-slate-500"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setErro("");
                    }}
                    placeholder="voce@boracoop.com"
                    autoComplete="email"
                    className="min-w-0 w-full bg-transparent py-4 text-white outline-none placeholder:text-slate-600"
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-300">
                  Senha
                </span>

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#070b18] px-4 focus-within:border-purple-500/40 focus-within:ring-4 focus-within:ring-purple-500/5">
                  <LockKeyhole
                    size={19}
                    className="shrink-0 text-slate-500"
                  />

                  <input
                    type={
                      mostrarSenha ? "text" : "password"
                    }
                    value={senha}
                    onChange={(event) => {
                      setSenha(event.target.value);
                      setErro("");
                    }}
                    placeholder="Sua senha"
                    autoComplete="current-password"
                    className="min-w-0 w-full bg-transparent py-4 text-white outline-none placeholder:text-slate-600"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setMostrarSenha(
                        (current) => !current,
                      )
                    }
                    className="shrink-0 text-slate-500 transition hover:text-white"
                    aria-label={
                      mostrarSenha
                        ? "Ocultar senha"
                        : "Mostrar senha"
                    }
                  >
                    {mostrarSenha ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </label>

              {erro && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                  {erro}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 px-6 font-bold text-white shadow-lg shadow-purple-950/30 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <LoaderCircle
                    size={20}
                    className="animate-spin"
                  />
                ) : (
                  <LogIn size={20} />
                )}

                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <div className="mt-6 space-y-3 text-center">
              <p className="text-sm text-slate-400">
                Ainda não possui acesso?{" "}
                <Link
                  to="/cadastro"
                  className="font-semibold text-purple-300 transition hover:text-purple-200"
                >
                  Criar conta
                </Link>
              </p>

              <p className="text-xs text-slate-600">
                Novos cadastros entram como blogueiro.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}