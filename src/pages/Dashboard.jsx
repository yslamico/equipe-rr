import { useMemo, useState } from "react";
import {
  BadgeDollarSign,
  Gem,
  LoaderCircle,
} from "lucide-react";

import BackgroundEffects from "../components/BackgroundEffects";
import CooperationCard from "../components/CooperationCard";
import CooperationFilters from "../components/CooperationFilters";
import ExecutiveStats from "../components/ExecutiveStats";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import RankingCard from "../components/RankingCard";
import Sidebar from "../components/Sidebar";

import useCooperations from "../hooks/useCooperations";
import { getBlogueiros } from "../services/bloggerStorage";
import { getPagamentos } from "../services/paymentStorage";

const ranking = [
  {
    nome: "Jonatas Silva",
    valor: "R$ 28.450",
    valorNumero: 28450,
    depositantes: 812,
  },
  {
    nome: "Fernando Santos",
    valor: "R$ 22.180",
    valorNumero: 22180,
    depositantes: 643,
  },
  {
    nome: "Maria Oliveira",
    valor: "R$ 17.910",
    valorNumero: 17910,
    depositantes: 521,
  },
];

function parseMoney(value) {
  const normalized = String(value || "")
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const number = Number(normalized);

  return Number.isFinite(number) ? number : 0;
}

function formatMoney(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function Dashboard() {
  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] =
    useState("Todos");

  const {
    cooperacoes,
    loading,
    error,
    refresh,
  } = useCooperations();

  const blogueiros = getBlogueiros();
  const pagamentos = getPagamentos();

  const resumo = useMemo(() => {
    const pagos = pagamentos.filter(
      (item) => item.status === "Pago",
    );

    const pendentes = pagamentos.filter(
      (item) => item.status === "Pendente",
    );

    return {
      totalPago: formatMoney(
        pagos.reduce(
          (acc, item) =>
            acc + parseMoney(item.valor),
          0,
        ),
      ),
      totalPendente: formatMoney(
        pendentes.reduce(
          (acc, item) =>
            acc + parseMoney(item.valor),
          0,
        ),
      ),
      blogueirosAtivos: blogueiros.filter(
        (item) => item.status === "Ativo",
      ).length,
      cooperacoesAtivas: cooperacoes.filter(
        (item) =>
          item.status !== "Oculta" &&
          item.status !== "Encerrada",
      ).length,
    };
  }, [pagamentos, blogueiros, cooperacoes]);

  const cooperacoesFiltradas = useMemo(() => {
    return cooperacoes.filter((coop) => {
      const nome = String(coop.nome || "")
        .toLowerCase();

      const correspondeBusca = nome.includes(
        busca.trim().toLowerCase(),
      );

      const correspondeCategoria =
        categoriaAtiva === "Todos" ||
        coop.categoria === categoriaAtiva;

      const statusVisivel =
        coop.status !== "Oculta" &&
        coop.status !== "Encerrada";

      return (
        correspondeBusca &&
        correspondeCategoria &&
        statusVisivel
      );
    });
  }, [cooperacoes, busca, categoriaAtiva]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-transparent text-white lg:flex">
      <BackgroundEffects />
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Navbar />

        <main className="relative z-10 px-3 pb-24 pt-3 sm:p-6">
          <div className="hidden sm:block">
            <Hero />
          </div>

          <section className="mb-5 rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-600/20 via-fuchsia-500/10 to-transparent p-4 shadow-xl shadow-purple-950/20 sm:hidden">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-purple-300">
              Destaques de hoje
            </p>

            <h1 className="mt-2 text-2xl font-black leading-tight text-white">
              Escolha sua próxima cooperação
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              Veja primeiro as oportunidades disponíveis e fale pelo WhatsApp.
            </p>
          </section>

          <div className="hidden sm:block sm:mt-5">
            <ExecutiveStats
              totalPago={resumo.totalPago}
              totalPendente={resumo.totalPendente}
              blogueirosAtivos={
                resumo.blogueirosAtivos
              }
              cooperacoesAtivas={
                resumo.cooperacoesAtivas
              }
            />
          </div>

          <section className="mt-0 sm:mt-8">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-black sm:text-3xl">
                  Cooperações disponíveis
                </h2>

                <p className="mt-1 text-slate-400">
                  Dados carregados diretamente do Supabase.
                </p>
              </div>

              <button
                type="button"
                onClick={refresh}
                disabled={loading}
                className="hidden rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06] disabled:opacity-50 sm:block"
              >
                Atualizar cooperações
              </button>
            </div>

            <CooperationFilters
              busca={busca}
              setBusca={setBusca}
              categoriaAtiva={categoriaAtiva}
              setCategoriaAtiva={setCategoriaAtiva}
            />

            {error && (
              <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center gap-3 rounded-3xl border border-white/10 bg-[#0b1020]/90 p-10 text-slate-400">
                <LoaderCircle className="animate-spin" />
                Carregando cooperações do Supabase...
              </div>
            ) : (
              <div className="space-y-4">
                {cooperacoesFiltradas.length > 0 ? (
                  cooperacoesFiltradas.map(
                    (coop) => (
                      <CooperationCard
                        key={coop.id}
                        {...coop}
                      />
                    ),
                  )
                ) : (
                  <div className="rounded-3xl border border-white/10 bg-[#0b1020]/90 p-8 text-center text-slate-400 backdrop-blur-xl">
                    Nenhuma cooperação encontrada.
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="mt-8 hidden gap-5 sm:grid lg:grid-cols-3">
            <article className="rounded-3xl border border-white/10 bg-[#0b1020]/90 p-6 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
                  <BadgeDollarSign
                    className="text-amber-400"
                    size={32}
                  />
                </div>

                <div>
                  <p className="text-slate-400">
                    Seu nível
                  </p>

                  <h3 className="text-2xl font-bold">
                    Nível Ouro
                  </h3>
                </div>
              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[77%] rounded-full bg-gradient-to-r from-amber-500 to-yellow-300" />
              </div>

              <p className="mt-3 text-sm text-slate-400">
                Faltam 1.150 XP para o nível Diamante.
              </p>
            </article>

            <RankingCard ranking={ranking} />

            <article className="rounded-3xl border border-white/10 bg-[#0b1020]/90 p-6 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <Gem className="text-purple-400" />

                <h3 className="text-xl font-bold">
                  Conquistas
                </h3>
              </div>

              <div className="mt-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-purple-500/10 p-5">
                <p className="font-semibold">
                  Mestre das Cooperações
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Pegue 50 cooperações
                </p>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-amber-500 to-yellow-300" />
                </div>

                <p className="mt-2 text-right text-sm text-amber-300">
                  47 / 50
                </p>
              </div>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}