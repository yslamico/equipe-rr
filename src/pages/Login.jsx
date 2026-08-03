import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  LogIn,
  Mail,
} from "lucide-react";

import logoEquipeRR from "../assets/logo-equipe-rr.png";
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050816] px-4 py-10 text-white">
      <BackgroundEffects />

      <main className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b1020]/95 shadow-2xl shadow-purple-950/40 backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden min-h-[680px] flex-col justify-between bg-gradient-to-br from-indigo-700/50 via-purple-700/30 to-fuchsia-700/20 p-10 lg:flex">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 overflow-hidden rounded-3xl border border-white/15 bg-[#070b18] shadow-xl">
              <img
                src={logoEquipeRR}
                alt="Logo da EQUIPE RR"
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-purple-200">
                Sistema oficial
              </p>

              <h1 className="mt-2 text-3xl font-black">
                EQUIPE RR
              </h1>
            </div>
          </div>

          <div>
            <p className="max-w-lg text-5xl font-black leading-tight">
              Gestão de cooperações, blogueiros e pagamentos.
            </p>

            <p className="mt-6 max-w-md text-lg leading-8 text-slate-300">
              Entre com sua conta para acessar o painel da equipe.
            </p>
          </div>

          <p className="text-sm text-slate-400">
            Acesso protegido pelo Supabase Auth.
          </p>
        </section>

        <section className="p-6 sm:p-10 lg:p-12">
          <div className="mx-auto max-w-md">
            <div className="mb-8 flex items-center gap-4 lg:hidden">
              <div className="h-16 w-16 overflow-hidden rounded-2xl border border-purple-400/20 bg-[#070b18]">
                <img
                  src={logoEquipeRR}
                  alt="Logo da EQUIPE RR"
                  className="h-full w-full object-cover"
                />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-purple-300">
                  Sistema oficial
                </p>

                <h1 className="mt-1 text-2xl font-black">
                  EQUIPE RR
                </h1>
              </div>
            </div>

            <p className="text-sm uppercase tracking-[0.25em] text-purple-300">
              Bem-vindo
            </p>

            <h2 className="mt-3 text-4xl font-black">
              Entrar no painel
            </h2>

            <p className="mt-3 text-slate-400">
              Use o e-mail e a senha cadastrados no sistema.
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
                    className="text-slate-500"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setErro("");
                    }}
                    placeholder="voce@equiperr.com"
                    autoComplete="email"
                    className="w-full bg-transparent py-4 text-white outline-none placeholder:text-slate-600"
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
                    className="text-slate-500"
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
                    className="w-full bg-transparent py-4 text-white outline-none placeholder:text-slate-600"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setMostrarSenha(
                        (current) => !current,
                      )
                    }
                    className="text-slate-500 transition hover:text-white"
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
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 font-bold text-white shadow-lg shadow-purple-950/30 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
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

            <p className="mt-6 text-center text-sm text-slate-500">
              O cadastro de contas será controlado pelo administrador.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}