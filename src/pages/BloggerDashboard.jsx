import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeDollarSign,
  Clock3,
  CreditCard,
  Handshake,
  LoaderCircle,
  Trophy,
  UserRound,
  WalletCards,
} from "lucide-react";
import { Link } from "react-router-dom";

import BackgroundEffects from "../components/BackgroundEffects";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../contexts/AuthContext";

import useCooperations from "../hooks/useCooperations";
import { getBlogueirosSupabase } from "../services/supabase/bloggers";
import { getPagamentosSupabase } from "../services/supabase/payments";

function parseMoney(value) {
  const normalized = String(value || "")
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const number = Number(normalized);
  return Number.isFinite(number) ? number : 0;
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function StatCard({
  icon: Icon,
  label,
  value,
  helper,
}) {
  return (
    <article className="rounded-3xl border border-white/10 bg-[#0b1020]/90 p-4 shadow-xl backdrop-blur-xl sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-slate-400">{label}</p>
          <strong className="mt-2 block truncate text-2xl font-black text-white sm:text-3xl">
            {value}
          </strong>
          {helper && (
            <p className="mt-2 text-xs text-slate-500">
              {helper}
            </p>
          )}
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 text-purple-300">
          <Icon size={21} />
        </div>
      </div>
    </article>
  );
}

export default function BloggerDashboard() {
  const { user, perfil } = useAuth();

  const [blogueiro, setBlogueiro] = useState(null);
  const [pagamentos, setPagamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const { cooperacoes } = useCooperations();

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      if (!user?.id) return;

      try {
        setLoading(true);
        setErro("");

        const [blogueirosData, pagamentosData] =
          await Promise.all([
            getBlogueirosSupabase(),
            getPagamentosSupabase(),
          ]);

        if (!ativo) return;

        const atual =
          (blogueirosData || []).find(
            (item) => item.userId === user.id,
          ) || null;

        setBlogueiro(atual);

        setPagamentos(
          atual
            ? (pagamentosData || []).filter(
                (item) =>
                  item.blogueiroId === atual.id,
              )
            : [],
        );
      } catch (error) {
        console.error(error);
        if (ativo) {
          setErro(
            error?.message ||
              "Não foi possível carregar seu painel.",
          );
        }
      } finally {
        if (ativo) setLoading(false);
      }
    }

    carregar();

    return () => {
      ativo = false;
    };
  }, [user?.id]);

  const nome =
    blogueiro?.nome ||
    perfil?.nome ||
    user?.user_metadata?.nome ||
    user?.email?.split("@")[0] ||
    "Blogueiro";

  const primeiroNome =
    String(nome).split(" ")[0];

  const resumo = useMemo(() => {
    const pagos = pagamentos.filter(
      (item) => item.status === "Pago",
    );

    const pendentes = pagamentos.filter(
      (item) => item.status === "Pendente",
    );

    return {
      totalPago: pagos.reduce(
        (acc, item) =>
          acc + parseMoney(item.valor),
        0,
      ),
      totalPendente: pendentes.reduce(
        (acc, item) =>
          acc + parseMoney(item.valor),
        0,
      ),
      pagos: pagos.length,
      pendentes: pendentes.length,
      coopsAtivas: cooperacoes.filter(
        (item) =>
          item.status !== "Oculta" &&
          item.status !== "Encerrada",
      ).length,
    };
  }, [pagamentos, cooperacoes]);

  const ultimosPagamentos = pagamentos.slice(0, 5);

  const oportunidadesDisponiveis = useMemo(
    () =>
      cooperacoes
        .filter(
          (item) =>
            item.status !== "Oculta" &&
            item.status !== "Encerrada",
        )
        .slice(0, 3),
    [cooperacoes],
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-transparent text-white lg:flex">
      <BackgroundEffects />
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Navbar />

        <main className="relative z-10 px-3 pb-24 pt-4 sm:p-6">
          <section className="overflow-hidden rounded-[2rem] border border-purple-500/20 bg-gradient-to-br from-purple-600/20 via-[#0b1020]/95 to-fuchsia-500/10 p-5 shadow-2xl shadow-purple-950/20 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-purple-300">
              BoraCoop
            </p>

            <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
              Olá, {primeiroNome} 👋
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Veja seus ganhos, pagamentos e as melhores oportunidades disponíveis para participar agora.
            </p>

            <div className="mt-6">
              <p className="text-sm text-slate-400">
                Total recebido
              </p>
              <strong className="mt-1 block text-4xl font-black sm:text-5xl">
                {formatMoney(resumo.totalPago)}
              </strong>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/cooperacoes"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 px-5 text-sm font-bold text-white shadow-lg shadow-purple-950/30"
              >
                <Handshake size={18} />
                Ver oportunidades
                <ArrowRight size={17} />
              </Link>

              <Link
                to="/perfil"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.07]"
              >
                <UserRound size={17} />
                Meu perfil
              </Link>
            </div>
          </section>

          {erro && (
            <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-200">
              {erro}
            </div>
          )}

          <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={BadgeDollarSign}
              label="Total recebido"
              value={formatMoney(resumo.totalPago)}
              helper={`${resumo.pagos} pagamento(s)`}
            />

            <StatCard
              icon={Clock3}
              label="A receber"
              value={formatMoney(
                resumo.totalPendente,
              )}
              helper={`${resumo.pendentes} pagamento(s)`}
            />

            <StatCard
              icon={Handshake}
              label="Oportunidades"
              value={resumo.coopsAtivas}
              helper="Oportunidades disponíveis"
            />

            <StatCard
              icon={Trophy}
              label="Nível"
              value={blogueiro?.nivel || "Bronze"}
              helper={
                blogueiro?.cooperacoes
                  ? `${blogueiro.cooperacoes} cooperações realizadas`
                  : "Continue evoluindo"
              }
            />
          </section>

          <section className="mt-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-300">
                  Oportunidades
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  Cooperações disponíveis agora
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Confira algumas oportunidades e abra os detalhes antes de participar.
                </p>
              </div>

              <Link
                to="/cooperacoes"
                className="inline-flex items-center gap-2 text-sm font-bold text-purple-300 hover:text-purple-200"
              >
                Ver todas
                <ArrowRight size={16} />
              </Link>
            </div>

            {oportunidadesDisponiveis.length ? (
              <div className="mt-4 grid gap-3 lg:grid-cols-3">
                {oportunidadesDisponiveis.map((coop) => (
                  <Link
                    key={coop.id}
                    to="/cooperacao"
                    state={{ coop }}
                    className="group rounded-3xl border border-white/10 bg-[#0b1020]/90 p-5 shadow-xl transition hover:-translate-y-0.5 hover:border-purple-500/25 hover:bg-[#0d1326]"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#070b18] font-black text-white">
                        {coop.imagem ? (
                          <img
                            src={coop.imagem}
                            alt={`Logo da ${coop.nome}`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          String(coop.nome || "CO")
                            .slice(0, 2)
                            .toUpperCase()
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-300">
                            {coop.status || "Ativa"}
                          </span>

                          {coop.categoria && (
                            <span className="rounded-full bg-purple-500/10 px-2.5 py-1 text-[11px] font-semibold text-purple-200">
                              {coop.categoria}
                            </span>
                          )}
                        </div>

                        <h3 className="mt-3 truncate text-lg font-black text-white">
                          {coop.nome}
                        </h3>

                        <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-400">
                          {coop.descricao ||
                            "Abra para conferir os detalhes desta cooperação."}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-2">
                      <div className="rounded-2xl bg-white/[0.03] p-3">
                        <p className="text-[11px] uppercase tracking-wide text-slate-500">
                          Valor fixo
                        </p>
                        <strong className="mt-1 block text-sm text-emerald-300">
                          {coop.salario || "Consultar"}
                        </strong>
                      </div>

                      <div className="rounded-2xl bg-white/[0.03] p-3">
                        <p className="text-[11px] uppercase tracking-wide text-slate-500">
                          Por depositante
                        </p>
                        <strong className="mt-1 block text-sm text-white">
                          {coop.valorDepositante ||
                            coop.depositante ||
                            "Consultar"}
                        </strong>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                      <span className="text-xs text-slate-500">
                        {coop.dataEncerramento ||
                          coop.prazo ||
                          "Sem prazo informado"}
                      </span>

                      <span className="inline-flex items-center gap-1 text-sm font-bold text-purple-300 transition group-hover:text-purple-200">
                        Ver detalhes
                        <ArrowRight size={15} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-7 text-center">
                <Handshake
                  size={28}
                  className="mx-auto text-slate-600"
                />

                <p className="mt-3 text-sm text-slate-400">
                  Nenhuma cooperação disponível neste momento.
                </p>
              </div>
            )}
          </section>

          <section className="mt-6 grid gap-4 lg:grid-cols-2">
            <article className="rounded-3xl border border-white/10 bg-[#0b1020]/90 p-5 shadow-xl">
              <div className="flex items-center gap-3">
                <WalletCards
                  size={21}
                  className="text-purple-300"
                />
                <h2 className="text-xl font-black">
                  Minha chave PIX
                </h2>
              </div>

              <div className="mt-5 rounded-2xl border border-white/5 bg-white/[0.025] p-4">
                <strong className="block break-all text-lg">
                  {blogueiro?.pix ||
                    perfil?.pix ||
                    "Nenhuma chave cadastrada"}
                </strong>
              </div>

              <Link
                to="/perfil"
                className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-purple-500/20 bg-purple-500/10 px-4 text-sm font-semibold text-purple-200"
              >
                <UserRound size={17} />
                Editar perfil
              </Link>
            </article>

            <article className="rounded-3xl border border-white/10 bg-[#0b1020]/90 p-5 shadow-xl">
              <h2 className="text-xl font-black">
                Acessos rápidos
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Vá direto para as áreas que você mais usa.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <Link
                  to="/cooperacoes"
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <Handshake
                    size={21}
                    className="text-purple-300"
                  />
                  <strong className="mt-3 block text-sm">
                    Cooperações
                  </strong>
                </Link>

                <Link
                  to="/contas-demo"
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <CreditCard
                    size={21}
                    className="text-purple-300"
                  />
                  <strong className="mt-3 block text-sm">
                    Contas Demo
                  </strong>
                </Link>

                <Link
                  to="/ranking"
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <Trophy
                    size={21}
                    className="text-amber-300"
                  />
                  <strong className="mt-3 block text-sm">
                    Ranking
                  </strong>
                </Link>

                <Link
                  to="/perfil"
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <UserRound
                    size={21}
                    className="text-purple-300"
                  />
                  <strong className="mt-3 block text-sm">
                    Perfil
                  </strong>
                </Link>
              </div>
            </article>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-black">
              Últimos pagamentos
            </h2>

            <div className="mt-4 rounded-3xl border border-white/10 bg-[#0b1020]/90 p-4 shadow-xl sm:p-5">
              {loading ? (
                <div className="flex items-center justify-center gap-3 py-10 text-slate-400">
                  <LoaderCircle className="animate-spin" />
                  Carregando pagamentos...
                </div>
              ) : ultimosPagamentos.length ? (
                <div className="space-y-3">
                  {ultimosPagamentos.map(
                    (pagamento) => (
                      <div
                        key={pagamento.id}
                        className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-white/[0.025] p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <strong>
                            {pagamento.cooperacaoNome ||
                              "Pagamento"}
                          </strong>
                          <p className="mt-1 text-xs text-slate-500">
                            {pagamento.data ||
                              "Sem data"}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <span
                            className={[
                              "rounded-full border px-3 py-1 text-xs font-bold",
                              pagamento.status ===
                              "Pago"
                                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                                : "border-amber-500/20 bg-amber-500/10 text-amber-200",
                            ].join(" ")}
                          >
                            {pagamento.status}
                          </span>

                          <strong className="text-emerald-400">
                            {pagamento.valor}
                          </strong>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <p className="py-6 text-center text-sm text-slate-500">
                  Você ainda não possui pagamentos registrados.
                </p>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}