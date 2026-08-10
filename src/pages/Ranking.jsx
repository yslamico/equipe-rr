import { useEffect, useMemo, useState } from "react";
import {
  Crown,
  LoaderCircle,
  Medal,
  Trophy,
} from "lucide-react";

import BackgroundEffects from "../components/BackgroundEffects";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import { getBlogueirosSupabase } from "../services/supabase/bloggers";

function parseMoney(value) {
  const normalized = String(value || "")
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const number = Number(normalized);

  return Number.isFinite(number) ? number : 0;
}

function podiumIcon(position) {
  if (position === 1) {
    return <Crown size={24} className="text-amber-300" />;
  }

  if (position === 2) {
    return <Medal size={23} className="text-slate-300" />;
  }

  if (position === 3) {
    return <Medal size={23} className="text-amber-600" />;
  }

  return (
    <span className="text-sm font-black text-slate-500">
      #{position}
    </span>
  );
}

export default function Ranking() {
  const [blogueiros, setBlogueiros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarRanking() {
      try {
        setLoading(true);
        setErro("");

        const dados = await getBlogueirosSupabase();

        if (!ativo) return;

        setBlogueiros(dados || []);
      } catch (error) {
        console.error(error);

        if (ativo) {
          setErro(
            error?.message ||
              "Não foi possível carregar o ranking.",
          );
        }
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    }

    carregarRanking();

    return () => {
      ativo = false;
    };
  }, []);

  const ranking = useMemo(() => {
    return [...blogueiros]
      .filter((item) => item.status === "Ativo")
      .sort((a, b) => {
        const ganhoA = parseMoney(a.totalGanho);
        const ganhoB = parseMoney(b.totalGanho);

        if (ganhoB !== ganhoA) {
          return ganhoB - ganhoA;
        }

        return (
          Number(b.cooperacoes || 0) -
          Number(a.cooperacoes || 0)
        );
      });
  }, [blogueiros]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-transparent text-white lg:flex">
      <BackgroundEffects />
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Navbar />

        <main className="relative z-10 px-3 pb-24 pt-4 sm:p-6">
          <header className="mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10">
                <Trophy
                  size={25}
                  className="text-amber-300"
                />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-purple-300">
                  BoraCoop
                </p>

                <h1 className="mt-1 text-3xl font-black sm:text-4xl">
                  Ranking
                </h1>
              </div>
            </div>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Os destaques da equipe com base nos ganhos e
              cooperações realizadas.
            </p>
          </header>

          {erro && (
            <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              {erro}
            </div>
          )}

          {loading ? (
            <div className="flex min-h-52 items-center justify-center gap-3 rounded-3xl border border-white/10 bg-[#0b1020]/90 text-slate-400">
              <LoaderCircle className="animate-spin" />
              Carregando ranking...
            </div>
          ) : ranking.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-[#0b1020]/90 p-8 text-center text-slate-400">
              Ainda não existem blogueiros no ranking.
            </div>
          ) : (
            <div className="space-y-3">
              {ranking.map((blogueiro, index) => {
                const position = index + 1;

                return (
                  <article
                    key={blogueiro.id}
                    className={[
                      "grid items-center gap-4 rounded-3xl border p-4 shadow-xl backdrop-blur-xl transition sm:grid-cols-[auto_1fr_auto_auto] sm:p-5",
                      position === 1
                        ? "border-amber-400/25 bg-gradient-to-r from-amber-500/10 via-[#0b1020]/95 to-purple-500/10"
                        : "border-white/10 bg-[#0b1020]/90",
                    ].join(" ")}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                      {podiumIcon(position)}
                    </div>

                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 font-black">
                        {blogueiro.foto ? (
                          <img
                            src={blogueiro.foto}
                            alt={blogueiro.nome}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          String(blogueiro.nome || "BC")
                            .split(" ")
                            .map((parte) => parte[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()
                        )}
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate text-lg font-black">
                          {blogueiro.nome}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                          Nível {blogueiro.nivel || "Bronze"}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-3 sm:min-w-36">
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        Cooperações
                      </p>

                      <strong className="mt-1 block text-lg">
                        {blogueiro.cooperacoes || 0}
                      </strong>
                    </div>

                    <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.04] p-3 sm:min-w-40">
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        Total ganho
                      </p>

                      <strong className="mt-1 block text-lg text-emerald-400">
                        {blogueiro.totalGanho || "R$ 0,00"}
                      </strong>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}