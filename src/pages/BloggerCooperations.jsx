import { useMemo, useState } from "react";
import { LoaderCircle } from "lucide-react";

import BackgroundEffects from "../components/BackgroundEffects";
import CooperationCard from "../components/CooperationCard";
import CooperationFilters from "../components/CooperationFilters";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import useCooperations from "../hooks/useCooperations";

export default function BloggerCooperations() {
  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] =
    useState("Todos");

  const {
    cooperacoes,
    loading,
    error,
    refresh,
  } = useCooperations();

  const cooperacoesFiltradas = useMemo(() => {
    return cooperacoes.filter((coop) => {
      const nome = String(
        coop.nome || "",
      ).toLowerCase();

      const correspondeBusca =
        nome.includes(
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
  }, [
    cooperacoes,
    busca,
    categoriaAtiva,
  ]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-transparent text-white lg:flex">
      <BackgroundEffects />
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Navbar />

        <main className="relative z-10 px-3 pb-24 pt-4 sm:p-6">
          <header className="mb-6 rounded-[2rem] border border-purple-500/20 bg-gradient-to-br from-purple-600/15 via-[#0b1020]/95 to-transparent p-5 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-purple-300">
              Oportunidades
            </p>

            <h1 className="mt-2 text-3xl font-black sm:text-4xl">
              Cooperações
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Escolha sua próxima cooperação sem distrações.
            </p>
          </header>

          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <strong className="text-xl">
                {cooperacoesFiltradas.length}
              </strong>
              <span className="ml-2 text-sm text-slate-500">
                disponíveis
              </span>
            </div>

            <button
              type="button"
              onClick={refresh}
              disabled={loading}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06] disabled:opacity-50"
            >
              Atualizar
            </button>
          </div>

          <CooperationFilters
            busca={busca}
            setBusca={setBusca}
            categoriaAtiva={categoriaAtiva}
            setCategoriaAtiva={
              setCategoriaAtiva
            }
          />

          {error && (
            <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center gap-3 rounded-3xl border border-white/10 bg-[#0b1020]/90 p-10 text-slate-400">
              <LoaderCircle className="animate-spin" />
              Carregando cooperações...
            </div>
          ) : cooperacoesFiltradas.length ? (
            <div className="space-y-4">
              {cooperacoesFiltradas.map(
                (coop) => (
                  <CooperationCard
                    key={coop.id}
                    {...coop}
                  />
                ),
              )}
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-[#0b1020]/90 p-8 text-center text-slate-400">
              Nenhuma cooperação disponível.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}