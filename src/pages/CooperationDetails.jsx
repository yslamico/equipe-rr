import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  Gift,
  Headphones,
  MessageCircle,
  Package,
  ShieldCheck,
  Users,
  WalletCards,
} from "lucide-react";

import BackgroundEffects from "../components/BackgroundEffects";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function InfoCard({ icon: Icon, title, value, accent = "purple" }) {
  const accentClasses = {
    purple: "bg-purple-500/10 text-purple-300",
    green: "bg-emerald-500/10 text-emerald-300",
    blue: "bg-blue-500/10 text-blue-300",
    amber: "bg-amber-500/10 text-amber-300",
  };

  return (
    <article className="rounded-2xl border border-white/10 bg-[#0b1020]/90 p-5 backdrop-blur-xl">
      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${accentClasses[accent]}`}>
        <Icon size={21} />
      </div>

      <p className="mt-4 text-sm text-slate-500">{title}</p>
      <strong className="mt-1 block text-xl text-white">{value || "Não informado"}</strong>
    </article>
  );
}

export default function CooperationDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const coop = location.state?.coop;

  if (!coop) {
    return (
      <div className="relative min-h-screen overflow-x-hidden bg-transparent text-white lg:flex">
        <BackgroundEffects />
        <Sidebar />

        <div className="min-w-0 flex-1">
          <Navbar />

          <main className="relative z-10 flex min-h-[70vh] items-center justify-center p-6">
            <div className="max-w-lg rounded-3xl border border-white/10 bg-[#0b1020]/90 p-8 text-center backdrop-blur-xl">
              <h1 className="text-3xl font-black">Cooperação não encontrada</h1>

              <p className="mt-3 text-slate-400">
                Volte ao Dashboard e abra a cooperação novamente.
              </p>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="mt-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold"
              >
                Voltar ao Dashboard
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const mensagem = encodeURIComponent(
    String(
      coop.mensagemWhatsApp ||
        `Olá! Quero participar da cooperação ${coop.nome}. Meu ID é:`,
    ).replace("{PLATAFORMA}", coop.nome),
  );

  const whatsappUrl = `https://wa.me/?text=${mensagem}`;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-transparent text-white lg:flex">
      <BackgroundEffects />
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Navbar />

        <main className="relative z-10 p-4 sm:p-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>

          <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#0b1233] via-[#12104a] to-[#26105f] p-6 shadow-2xl sm:p-10">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center">
              <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-[#070b18] text-3xl font-black shadow-xl">
                {coop.imagem ? (
                  <img
                    src={coop.imagem}
                    alt={`Logo da ${coop.nome}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  String(coop.nome || "PLT").slice(0, 3).toUpperCase()
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-purple-500/15 px-3 py-1 text-xs font-semibold uppercase text-purple-200">
                    {coop.categoria || "Categoria"}
                  </span>

                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                    {coop.status || "Ativa"}
                  </span>
                </div>

                <h1 className="mt-4 text-4xl font-black sm:text-5xl">
                  {coop.nome}
                </h1>

                <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
                  {coop.descricao || "Detalhes completos da cooperação."}
                </p>
              </div>
            </div>
          </section>

          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <InfoCard
              icon={WalletCards}
              title="Salário do blogueiro"
              value={coop.salario}
              accent="green"
            />

            <InfoCard
              icon={Users}
              title="Valor por depositante"
              value={coop.valorDepositante || coop.depositante}
              accent="blue"
            />

            <InfoCard
              icon={Package}
              title="Contas demo"
              value={String(coop.contasDemo ?? coop.disponiveis ?? 0)}
              accent="purple"
            />

            <InfoCard
              icon={CalendarDays}
              title="Encerramento"
              value={coop.dataEncerramento || coop.prazo || "Sem prazo"}
              accent="amber"
            />
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
            <div className="space-y-6">
              <article className="rounded-3xl border border-white/10 bg-[#0b1020]/90 p-6 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-purple-300" />
                  <h2 className="text-2xl font-bold">Regras e proibições</h2>
                </div>

                <p className="mt-4 whitespace-pre-line leading-7 text-slate-300">
                  {coop.regras || "Nenhuma regra cadastrada."}
                </p>
              </article>

              <article className="rounded-3xl border border-white/10 bg-[#0b1020]/90 p-6 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <Gift className="text-amber-300" />
                  <h2 className="text-2xl font-bold">Benefícios e promoções</h2>
                </div>

                <p className="mt-4 whitespace-pre-line leading-7 text-slate-300">
                  {coop.beneficios || "Nenhum benefício cadastrado."}
                </p>
              </article>
            </div>

            <aside className="space-y-6">
              <article className="rounded-3xl border border-white/10 bg-[#0b1020]/90 p-6 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <Headphones className="text-blue-300" />
                  <h2 className="text-xl font-bold">Suporte</h2>
                </div>

                <p className="mt-4 text-slate-300">
                  {coop.suporte || "Suporte não informado."}
                </p>
              </article>

              <article className="rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-indigo-500/5 p-6">
                <h2 className="text-xl font-bold">Participar da cooperação</h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Faça o cadastro na plataforma e depois envie seu ID pelo WhatsApp.
                </p>

                <div className="mt-6 space-y-3">
                  {coop.linkCadastro ? (
                    <a
                      href={coop.linkCadastro}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 font-semibold text-white transition hover:brightness-110"
                    >
                      <ExternalLink size={18} />
                      Abrir link de cadastro
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="w-full cursor-not-allowed rounded-xl bg-white/5 px-5 py-3 font-semibold text-slate-500"
                    >
                      Link não cadastrado
                    </button>
                  )}

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 font-semibold text-emerald-300 transition hover:bg-emerald-500/15"
                  >
                    <MessageCircle size={18} />
                    Enviar ID no WhatsApp
                  </a>
                </div>
              </article>
            </aside>
          </section>

          <div className="mt-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-purple-300 hover:text-purple-200"
            >
              <CheckCircle2 size={17} />
              Voltar para todas as cooperações
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}