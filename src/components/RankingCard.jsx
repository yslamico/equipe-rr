import { Crown, Medal, TrendingUp } from "lucide-react";

const medalStyles = [
  {
    badge: "bg-amber-500/15 text-amber-300 border-amber-400/20",
    bar: "from-amber-500 to-yellow-300",
    icon: Crown,
  },
  {
    badge: "bg-slate-400/10 text-slate-300 border-slate-300/15",
    bar: "from-slate-400 to-slate-200",
    icon: Medal,
  },
  {
    badge: "bg-orange-500/10 text-orange-300 border-orange-400/15",
    bar: "from-orange-600 to-amber-400",
    icon: Medal,
  },
];

export default function RankingCard({ ranking = [] }) {
  const maxValor =
    ranking.length > 0
      ? Math.max(...ranking.map((item) => item.valorNumero || 0))
      : 1;

  return (
    <article className="rounded-3xl border border-white/10 bg-[#0b1020] p-6 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-purple-300">
            Destaques
          </p>

          <h3 className="mt-2 text-2xl font-bold text-white">
            Ranking de blogueiros
          </h3>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-300">
          <TrendingUp size={22} />
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {ranking.map((pessoa, index) => {
          const style = medalStyles[index] ?? medalStyles[2];
          const Icon = style.icon;

          const percentual = Math.max(
            12,
            Math.round(((pessoa.valorNumero || 0) / maxValor) * 100),
          );

          return (
            <div
              key={pessoa.nome}
              className="rounded-2xl border border-white/5 bg-white/[0.025] p-4"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${style.badge}`}
                >
                  <Icon size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-white">
                        {pessoa.nome}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {pessoa.depositantes} depositantes
                      </p>
                    </div>

                    <strong className="shrink-0 text-emerald-400">
                      {pessoa.valor}
                    </strong>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${style.bar}`}
                      style={{ width: `${percentual}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}