import { useState } from "react";
import {
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  UserPlus,
  UserRound,
} from "lucide-react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import logoEquipeRR from "../assets/logo-equipe-rr.png";
import BackgroundEffects from "../components/BackgroundEffects";
import { cadastrarUsuario } from "../services/supabase/auth";

export default function Register() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] =
    useState("");
  const [mostrarSenha, setMostrarSenha] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const isError =
    mensagem.includes("Não foi") ||
    mensagem.includes("inválid") ||
    mensagem.includes("coincidem") ||
    mensagem.includes("mínimo");

  async function handleSubmit(event) {
    event.preventDefault();

    if (senha.length < 8) {
      setMensagem(
        "A senha precisa ter no mínimo 8 caracteres.",
      );
      return;
    }

    if (senha !== confirmarSenha) {
      setMensagem("As senhas não coincidem.");
      return;
    }

    try {
      setLoading(true);
      setMensagem("");

      const data = await cadastrarUsuario({
        nome: nome.trim(),
        email: email.trim(),
        senha,
      });

      if (data?.session) {
        navigate("/", { replace: true });
        return;
      }

      setMensagem(
        "Conta criada. Confira seu e-mail para confirmar o cadastro e depois faça login.",
      );
    } catch (error) {
      console.error(error);

      const message =
        error?.message ||
        "Não foi possível criar a conta.";

      if (
        message.toLowerCase().includes(
          "user already registered",
        )
      ) {
        setMensagem(
          "Este e-mail já possui uma conta.",
        );
      } else {
        setMensagem(message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050816] px-3 py-6 text-white sm:px-4 sm:py-10">
      <BackgroundEffects />

      <main className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0b1020]/95 shadow-2xl shadow-purple-950/40 backdrop-blur-xl lg:grid-cols-[0.95fr_1.05fr]">
        <section className="hidden min-h-[720px] flex-col justify-between bg-gradient-to-br from-indigo-700/50 via-purple-700/30 to-fuchsia-700/20 p-10 lg:flex">
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
                Novo acesso
              </p>

              <h1 className="mt-2 text-3xl font-black">
                EQUIPE RR
              </h1>
            </div>
          </div>

          <div>
            <p className="max-w-lg text-5xl font-black leading-tight">
              Crie sua conta de blogueiro.
            </p>

            <p className="mt-6 max-w-md text-lg leading-8 text-slate-300">
              Acompanhe cooperações, pagamentos e seus dados em um único painel.
            </p>
          </div>

          <p className="text-sm text-slate-400">
            Novas contas são criadas sempre como blogueiro.
          </p>
        </section>

        <section className="p-5 sm:p-10 lg:p-12">
          <div className="mx-auto max-w-md">
            <div className="mb-7 flex items-center gap-4 lg:hidden">
              <div className="h-14 w-14 overflow-hidden rounded-2xl border border-purple-400/20 bg-[#070b18]">
                <img
                  src={logoEquipeRR}
                  alt="Logo da EQUIPE RR"
                  className="h-full w-full object-cover"
                />
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-purple-300">
                  Novo acesso
                </p>

                <h1 className="mt-1 text-xl font-black">
                  EQUIPE RR
                </h1>
              </div>
            </div>

            <p className="text-xs uppercase tracking-[0.25em] text-purple-300 sm:text-sm">
              Cadastro
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Criar conta
            </h2>

            <p className="mt-3 text-sm text-slate-400 sm:text-base">
              Preencha os dados para criar seu acesso.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-7 space-y-4 sm:mt-8 sm:space-y-5"
            >
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-300">
                  Nome completo
                </span>

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#070b18] px-4 focus-within:border-purple-500/40 focus-within:ring-4 focus-within:ring-purple-500/5">
                  <UserRound
                    size={19}
                    className="text-slate-500"
                  />

                  <input
                    value={nome}
                    onChange={(event) => {
                      setNome(event.target.value);
                      setMensagem("");
                    }}
                    placeholder="Seu nome"
                    autoComplete="name"
                    className="w-full bg-transparent py-4 text-white outline-none placeholder:text-slate-600"
                    required
                  />
                </div>
              </label>

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
                      setMensagem("");
                    }}
                    placeholder="voce@email.com"
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
                      setMensagem("");
                    }}
                    placeholder="Mínimo de 8 caracteres"
                    autoComplete="new-password"
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

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-300">
                  Confirmar senha
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
                    value={confirmarSenha}
                    onChange={(event) => {
                      setConfirmarSenha(
                        event.target.value,
                      );
                      setMensagem("");
                    }}
                    placeholder="Digite a senha novamente"
                    autoComplete="new-password"
                    className="w-full bg-transparent py-4 text-white outline-none placeholder:text-slate-600"
                    required
                  />
                </div>
              </label>

              {mensagem && (
                <div
                  className={[
                    "rounded-2xl border p-4 text-sm",
                    isError
                      ? "border-red-500/20 bg-red-500/10 text-red-300"
                      : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
                  ].join(" ")}
                >
                  {mensagem}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 font-bold text-white shadow-lg shadow-purple-950/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <LoaderCircle
                    size={20}
                    className="animate-spin"
                  />
                ) : (
                  <UserPlus size={20} />
                )}

                {loading
                  ? "Criando conta..."
                  : "Criar minha conta"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-400">
              Já possui uma conta?{" "}
              <Link
                to="/login"
                className="font-semibold text-purple-300 transition hover:text-purple-200"
              >
                Entrar
              </Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}