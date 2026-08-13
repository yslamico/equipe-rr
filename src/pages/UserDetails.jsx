import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Banknote,
  CalendarDays,
  Handshake,
  LoaderCircle,
  MessageCircle,
  ShieldCheck,
  Trophy,
  UserRound,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import BackgroundEffects from "../components/BackgroundEffects";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {
  getBloggerByUserId,
  getProfileById,
} from "../services/supabase/profiles";

function formatarData(value) {
  if (!value) return "Não informada";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Não informada";
  }

  return date.toLocaleString("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatarMoeda(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function initials(nome) {
  return String(nome || "US")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0] || "")
    .join("")
    .toUpperCase();
}

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [perfil, setPerfil] = useState(null);
  const [blogueiro, setBlogueiro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        setLoading(true);
        setError("");

        const perfilData = await getProfileById(id);
        const blogueiroData = await getBloggerByUserId(id);

        if (!ativo) return;

        setPerfil(perfilData);
        setBlogueiro(blogueiroData);
      } catch (err) {
        console.error(err);

        if (ativo) {
          setError(
            err?.message ||
              "Não foi possível carregar os dados do usuário.",
          );
        }
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    }

    carregar();

    return () => {
      ativo = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050816] text-slate-300">
        <LoaderCircle className="mr-3 animate-spin" />
        Carregando perfil...
      </div>
    );
  }

  if (error || !perfil) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#050816] p-6 text-center text-white">
        <p className="text-red-300">
          {error || "Usuário não encontrado."}
        </p>

        <button
          type="button"
          onClick={() => navigate("/usuarios")}
          className="rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white"
        >
          Voltar para usuários
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-transparent text-white lg:flex">
      <BackgroundEffects />
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Navbar />

        <main className="relative z-10 p-4 sm:p-6">
          <button
            type="button"
            onClick={() => navigate("/usuarios")}
            className="mb-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06]"
          >
            <ArrowLeft size={18} />
            Voltar para usuários
          </button>

          <section className="rounded-3xl border border-white/10 bg-[#0b1020]/90 p-5 shadow-xl sm:p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 text-2xl font-black text-white">
                {perfil.foto_url ? (
                  <img
                    src={perfil.foto_url}
                    alt={`Foto de ${perfil.nome}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials(perfil.nome)
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-black text-white">
                    {perfil.nome || "Usuário sem nome"}
                  </h1>

                  <span
                    className={[
                      "rounded-full px-3 py-1 text-xs font-semibold",
                      perfil.role === "admin"
                        ? "bg-emerald-500/10 text-emerald-300"
                        : "bg-purple-500/10 text-purple-300",
                    ].join(" ")}
                  >
                    {perfil.role || "blogueiro"}
                  </span>
                </div>

                <p className="mt-2 break-all text-sm text-slate-500">
                  ID: {perfil.id}
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  {perfil.whatsapp && (
                    <a
                      href={`https://wa.me/${String(
                        perfil.whatsapp,
                      ).replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-300"
                    >
                      <MessageCircle size={17} />
                      WhatsApp
                    </a>
                  )}

                  <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-slate-300">
                    <CalendarDays size={17} />
                    Cadastro: {formatarData(perfil.created_at)}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-white/10 bg-[#0b1020]/90 p-5">
              <UserRound
                size={22}
                className="text-purple-300"
              />

              <p className="mt-4 text-xs uppercase tracking-wide text-slate-500">
                Status
              </p>

              <strong className="mt-1 block text-xl text-white">
                {blogueiro?.status || "Não definido"}
              </strong>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0b1020]/90 p-5">
              <Trophy
                size={22}
                className="text-amber-300"
              />

              <p className="mt-4 text-xs uppercase tracking-wide text-slate-500">
                Nível
              </p>

              <strong className="mt-1 block text-xl text-white">
                {blogueiro?.nivel || "Não definido"}
              </strong>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0b1020]/90 p-5">
              <Handshake
                size={22}
                className="text-blue-300"
              />

              <p className="mt-4 text-xs uppercase tracking-wide text-slate-500">
                Cooperações
              </p>

              <strong className="mt-1 block text-xl text-white">
                {blogueiro?.cooperacoes_realizadas ?? 0}
              </strong>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0b1020]/90 p-5">
              <Banknote
                size={22}
                className="text-emerald-300"
              />

              <p className="mt-4 text-xs uppercase tracking-wide text-slate-500">
                Total ganho
              </p>

              <strong className="mt-1 block text-xl text-emerald-300">
                {formatarMoeda(blogueiro?.total_ganho)}
              </strong>
            </div>
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-[#0b1020]/90 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <UserRound className="text-purple-300" />
                <h2 className="text-xl font-bold">
                  Dados do blogueiro
                </h2>
              </div>

              {blogueiro ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Instagram
                    </p>
                    <p className="mt-1 text-white">
                      {blogueiro.instagram ||
                        "Não informado"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Telegram
                    </p>
                    <p className="mt-1 text-white">
                      {blogueiro.telegram ||
                        "Não informado"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Cidade
                    </p>
                    <p className="mt-1 text-white">
                      {[blogueiro.cidade, blogueiro.estado]
                        .filter(Boolean)
                        .join(" - ") ||
                        "Não informada"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      PIX
                    </p>
                    <p className="mt-1 break-all text-white">
                      {blogueiro.pix || "Não informado"}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="mt-5 text-sm leading-6 text-slate-400">
                  Este usuário ainda não possui um registro vinculado
                  na tabela de blogueiros.
                </p>
              )}
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0b1020]/90 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-emerald-300" />
                <h2 className="text-xl font-bold">
                  Conta
                </h2>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Função
                  </p>
                  <p className="mt-1 text-white">
                    {perfil.role || "blogueiro"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Criado em
                  </p>
                  <p className="mt-1 text-white">
                    {formatarData(perfil.created_at)}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Última atualização
                  </p>
                  <p className="mt-1 text-white">
                    {formatarData(perfil.updated_at)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-2">
            <div className="rounded-3xl border border-dashed border-purple-500/20 bg-purple-500/[0.04] p-6">
              <Handshake className="text-purple-300" />

              <h2 className="mt-4 text-xl font-bold text-white">
                Cooperações do blogueiro
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                No próximo passo ligamos esta área às cooperações reais
                do usuário.
              </p>
            </div>

            <div className="rounded-3xl border border-dashed border-emerald-500/20 bg-emerald-500/[0.04] p-6">
              <Banknote className="text-emerald-300" />

              <h2 className="mt-4 text-xl font-bold text-white">
                Histórico financeiro
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                No próximo passo ligamos pagamentos, pendências e
                comprovantes.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}