import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#0b1233] via-[#12104a] to-[#26105f] p-6 shadow-2xl sm:p-10">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="absolute -bottom-24 left-20 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-4 py-2 text-sm font-semibold text-purple-200">
          <Sparkles size={16} />
          EQUIPE RR
        </div>

        <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">
          As melhores{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-500 bg-clip-text text-transparent">
            cooperações
          </span>
          <br />
          para blogueiros.
        </h1>

        <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
          Encontre oportunidades, acompanhe seu desempenho e envie seu ID
          pelo WhatsApp em poucos segundos.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-950/40 transition hover:scale-[1.02]"
          >
            Ver cooperações
            <ArrowRight size={18} />
          </button>

          <button
            type="button"
            className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 font-semibold text-slate-200 transition hover:bg-white/[0.06]"
          >
            Ver ranking
          </button>
        </div>
      </div>
    </section>
  );
}
