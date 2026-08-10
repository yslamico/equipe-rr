import { useEffect, useMemo, useState } from "react";
import {
  BadgeDollarSign,
  BarChart3,
  Handshake,
  LoaderCircle,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";

import BackgroundEffects from "../components/BackgroundEffects";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import { getBlogueirosSupabase } from "../services/supabase/bloggers";
import { getCooperacoesSupabase } from "../services/supabase/cooperations";
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
    <article className="rounded-3xl border border-white/10 bg-[#0b1020]/90 p-5 shadow-xl backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">
            {label}
          </p>

          <strong className="mt-2 block text-2xl font-black text-white sm:text-3xl">
            {value}
          </strong>

          {helper && (
            <p className="mt-2 text-xs text-slate-500">
              {helper}
            </p>
          )}
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 text-purple-300">
          <Icon size={22} />
        </div>
      </div>
    </article>
  );
}

export default function Statistics() {
  const [blogueiros, setBlogueiros] = useState([]);
  const [cooperacoes, setCooperacoes] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarDados() {
      try {
        setLoading(true);
        setErro("");

        const [
          blogueirosData,
          cooperacoesData,
          pagamentosData,
        ] = await Promise.all([
          getBlogueirosSupabase(),
          getCooperacoesSupabase(),
          getPagamentosSupabase(),
        ]);

        if (!ativo) return;

        setBlogueiros(blogueirosData || []);
        setCooperacoes(cooperacoesData || []);
        setPagamentos(pagamentosData || []);
      } catch (error) {
        console.error(error);

        if (ativo) {
          setErro(
            error?.message ||
              "Não foi possível carregar as estatísticas.",
          );
        }
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    }

    carregarDados();

    return () => {
      ativo = false;
    };
  }, []);

  const resumo = useMemo(() => {
    const pagos = pagamentos.filter(
      (item) => item.status === "Pago",
    );

    const pendentes = pagamentos.filter(
      (item) => item.status === "Pendente",
    );

    const totalPago = pagos.reduce(
      (acc, item) => acc + parseMoney(item.valor),
      0,
    );

    const totalPendente = pendentes.reduce(
      (acc, item) => acc + parseMoney(item.valor),
      0,
    );

    const blogueirosAtivos = blogueiros.filter(
      (item) => item.status === "Ativo",
    ).length;

    const cooperacoesAtivas = cooperacoes.filter(
      (item) =>
        item.status !== "Oculta" &&
        item.status !== "Encerrada",
    ).length;

    return {
      totalPago,
      totalPendente,
      blogueirosAtivos,
      cooperacoesAtivas,
      totalPagamentos: pagamentos.length,
      totalCooperacoes: cooperacoes.length,
      totalBlogueiros: blogueiros.length,
    };
  }, [blogueiros, cooperacoes, pagamentos]);

  const topBlogueiros = useMemo(() => {
    return [...blogueiros]
      .sort(
        (a, b) =>
          parseMoney(b.totalGanho) -
          parseMoney(a.totalGanho),
      )
      .slice(0, 5);
  }, [blogueiros]);

  const categorias = useMemo(() => {
    const mapa = {};

    cooperacoes.forEach((item) => {
      const categoria =
        item.categoria || "Sem categoria";

      mapa[categoria] =
        (mapa[categoria] || 0) + 1;
    });

    return Object.entries(mapa)
      .map(([nome, total]) => ({
        nome,
        total,
      }))
      .sort((a, b) => b.total - a.total);
  }, [cooperacoes]);

  const statusPagamentos = useMemo(() => {
    const pagos = pagamentos.filter(
      (item) => item.status === "Pago",
    ).length;

    const pendentes = pagamentos.filter(
      (item) => item.status === "Pendente",
    ).length;

    const outros =
      pagamentos.length - pagos - pendentes;

    return {
      pagos,
      pendentes,
      outros,
    };
  }, [pagamentos]);

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-x-hidden bg-transparent text-white lg:flex">
        <BackgroundEffects />
        <Sidebar />

        <div className="min-w-0 flex-1">
          <Navbar />

          <main className="relative z-10 px-3 pb-24 pt-4 sm:p-6">
            <div className="flex min-h-[55vh] items-center justify-center gap-3 rounded-3xl border border-white/10 bg-[#0b1020]/90 text-slate-400">
              <LoaderCircle className="animate-spin" />
              Carregando estatísticas...
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-transparent text-white lg:flex">
      <BackgroundEffects />
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Navbar />

        <main className="relative z-10 px-3 pb-24 pt-4 sm:p-6">
          <header className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-300">
                <BarChart3 size={25} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-purple-300">
                  BoraCoop
                </p>

                <h1 className="mt-1 text-3xl font-black sm:text-4xl">
                  Estatísticas
                </h1>
              </div>
            </div>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Visão geral da operação com dados reais carregados do Supabase.
            </p>
          </header>

          {erro && (
            <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              {erro}
            </div>
          )}

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={BadgeDollarSign}
              label="Total pago"
              value={formatMoney(resumo.totalPago)}
              helper={`${statusPagamentos.pagos} pagamentos pagos`}
            />

            <StatCard
              icon={Wallet}
              label="Total pendente"
              value={formatMoney(
                resumo.totalPendente,
              )}
              helper={`${statusPagamentos.pendentes} pagamentos pendentes`}
            />

            <StatCard
              icon={Handshake}
              label="Cooperações ativas"
              value={resumo.cooperacoesAtivas}
              helper={`${resumo.totalCooperacoes} cooperações cadastradas`}
            />

            <StatCard
              icon={Users}
              label="Blogueiros ativos"
              value={resumo.blogueirosAtivos}
              helper={`${resumo.totalBlogueiros} blogueiros cadastrados`}
            />
          </section>

          <section className="mt-6 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
            <article className="rounded-3xl border border-white/10 bg-[#0b1020]/90 p-5 shadow-xl backdrop-blur-xl sm:p-6">
              <div className="flex items-center gap-3">
                <Trophy
                  size={22}
                  className="text-amber-300"
                />

                <div>
                  <h2 className="text-xl font-black">
                    Top blogueiros
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Ranking por total ganho.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {topBlogueiros.length > 0 ? (
                  topBlogueiros.map(
                    (blogueiro, index) => (
                      <div
                        key={blogueiro.id}
                        className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.025] p-3"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-sm font-black text-purple-300">
                          #{index + 1}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-white">
                            {blogueiro.nome}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {blogueiro.cooperacoes || 0} cooperações
                          </p>
                        </div>

                        <strong className="text-sm text-emerald-400 sm:text-base">
                          {blogueiro.totalGanho ||
                            "R$ 0,00"}
                        </strong>
                      </div>
                    ),
                  )
                ) : (
                  <p className="text-sm text-slate-500">
                    Nenhum blogueiro cadastrado.
                  </p>
                )}
              </div>
            </article>

            <article className="rounded-3xl border border-white/10 bg-[#0b1020]/90 p-5 shadow-xl backdrop-blur-xl sm:p-6">
              <h2 className="text-xl font-black">
                Pagamentos por status
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Distribuição dos pagamentos cadastrados.
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">
                      Pagos
                    </span>
                    <strong className="text-emerald-400">
                      {statusPagamentos.pagos}
                    </strong>
                  </div>

                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{
                        width: `${
                          resumo.totalPagamentos
                            ? (statusPagamentos.pagos /
                                resumo.totalPagamentos) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">
                      Pendentes
                    </span>
                    <strong className="text-amber-300">
                      {statusPagamentos.pendentes}
                    </strong>
                  </div>

                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-amber-500"
                      style={{
                        width: `${
                          resumo.totalPagamentos
                            ? (statusPagamentos.pendentes /
                                resumo.totalPagamentos) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {statusPagamentos.outros > 0 && (
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">
                        Outros
                      </span>
                      <strong className="text-purple-300">
                        {statusPagamentos.outros}
                      </strong>
                    </div>

                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-purple-500"
                        style={{
                          width: `${
                            resumo.totalPagamentos
                              ? (statusPagamentos.outros /
                                  resumo.totalPagamentos) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </article>
          </section>

          <section className="mt-5 rounded-3xl border border-white/10 bg-[#0b1020]/90 p-5 shadow-xl backdrop-blur-xl sm:p-6">
            <h2 className="text-xl font-black">
              Cooperações por categoria
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Quantidade cadastrada em cada categoria.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {categorias.length > 0 ? (
                categorias.map((categoria) => (
                  <div
                    key={categoria.nome}
                    className="rounded-2xl border border-white/5 bg-white/[0.025] p-4"
                  >
                    <p className="text-sm text-slate-400">
                      {categoria.nome}
                    </p>

                    <strong className="mt-2 block text-2xl font-black text-white">
                      {categoria.total}
                    </strong>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  Nenhuma categoria encontrada.
                </p>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}