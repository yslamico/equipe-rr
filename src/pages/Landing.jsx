import { useEffect, useState } from "react";
import {
  ArrowRight,
  BadgeDollarSign,
  CalendarDays,
  CheckCircle2,
  Handshake,
  LogIn,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  WalletCards,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

import BackgroundEffects from "../components/BackgroundEffects";
import logoBoraCoop from "../assets/logo-boracoop.png";
import iconeBoraCoop from "../assets/icone-boracoop.png";
import { getCooperacoesPublicas } from "../services/supabase/publicCooperations";

const benefits = [
  {
    icon: Handshake,
    title: "Oportunidades em um só lugar",
    text: "Encontre campanhas e cooperações com informações claras sobre valores, requisitos e prazos.",
  },
  {
    icon: WalletCards,
    title: "Ganhos mais organizados",
    text: "Centralize valores, histórico e informações importantes sem depender de mensagens espalhadas.",
  },
  {
    icon: Trophy,
    title: "Evolução visível",
    text: "Acompanhe sua participação, nível e posição dentro da comunidade BoraCoop.",
  },
];

const quickBenefits = [
  "Cadastro gratuito",
  "Oportunidades reais",
  "Pagamentos organizados",
];

const faqs = [
  {
    question: "Preciso pagar para entrar na BoraCoop?",
    answer:
      "Não. O cadastro é gratuito e você pode conhecer as oportunidades disponíveis antes de decidir participar.",
  },
  {
    question: "Preciso ter muitos seguidores?",
    answer:
      "Não necessariamente. Cada cooperação pode ter seus próprios requisitos, então sempre haverá oportunidades com perfis diferentes.",
  },
  {
    question: "Como funcionam os pagamentos?",
    answer:
      "Cada cooperação informa as condições e valores. Dentro da plataforma você acompanha os dados da oportunidade e seu histórico.",
  },
  {
    question: "Como escolho uma cooperação?",
    answer:
      "Você vê as oportunidades disponíveis, confere requisitos, prazo e valores e entra na que fizer sentido para o seu perfil.",
  },
];

const steps = [
  {
    number: "01",
    title: "Crie seu acesso",
    text: "Faça seu cadastro gratuito e entre na plataforma.",
  },
  {
    number: "02",
    title: "Escolha uma oportunidade",
    text: "Compare valores, requisitos e prazos antes de participar.",
  },
  {
    number: "03",
    title: "Acompanhe seus ganhos",
    text: "Veja seu histórico e mantenha suas cooperações organizadas.",
  },
];

export default function Landing() {
  const [cooperacoes, setCooperacoes] = useState([]);
  const [loadingCoops, setLoadingCoops] = useState(true);
  const [erroCoops, setErroCoops] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarCooperacoes() {
      try {
        setLoadingCoops(true);
        setErroCoops("");

        const data = await getCooperacoesPublicas();

        if (!ativo) return;

        setCooperacoes((data || []).slice(0, 6));
      } catch (error) {
        console.error(error);

        if (ativo) {
          setErroCoops(
            "Não foi possível carregar as oportunidades agora.",
          );
        }
      } finally {
        if (ativo) {
          setLoadingCoops(false);
        }
      }
    }

    carregarCooperacoes();

    return () => {
      ativo = false;
    };
  }, []);

  function formatDate(value) {
    if (!value) return "Sem prazo informado";

    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return "Sem prazo informado";
    }

    return new Intl.DateTimeFormat("pt-BR").format(date);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      <BackgroundEffects />

      <header className="relative z-20 border-b border-white/5 bg-[#050816]/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex min-w-0 items-center gap-3"
          >
            <div className="h-11 w-11 shrink-0 overflow-hidden rounded-2xl border border-purple-400/20 bg-[#0b1020]">
              <img
                src={iconeBoraCoop}
                alt="BoraCoop"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0">
              <strong className="block truncate text-lg font-black">
                BoraCoop
              </strong>
              <span className="hidden text-xs text-slate-500 sm:block">
                Influência em resultado
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="hidden min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06] hover:text-white sm:flex"
            >
              <LogIn size={17} />
              Entrar
            </Link>

            <Link
              to="/cadastro"
              className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 px-4 text-sm font-bold text-white shadow-lg shadow-purple-950/30 transition hover:brightness-110"
            >
              Quero fazer parte
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid min-h-[calc(100vh-78px)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-purple-200">
              <Sparkles size={15} />
              Plataforma para influenciadores
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.02] sm:text-5xl lg:text-7xl">
              Bora transformar
              <span className="block bg-gradient-to-r from-purple-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
                influência em resultado?
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              Encontre cooperações, acompanhe seus ganhos e tenha pagamentos,
              ranking, contas demo e perfil organizados em uma única plataforma.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/cadastro"
                className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 px-6 font-bold text-white shadow-2xl shadow-purple-950/30 transition hover:scale-[1.01]"
              >
                Quero fazer parte
                <ArrowRight size={19} />
              </Link>

              <Link
                to="/login"
                className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-6 font-semibold text-slate-200 transition hover:bg-white/[0.06]"
              >
                Entrar na minha conta
                <LogIn size={18} />
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
              {quickBenefits.map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-emerald-400" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 rounded-full bg-purple-600/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-purple-500/20 bg-[#0b1020]/90 p-3 shadow-2xl shadow-purple-950/40 backdrop-blur-xl">
              <img
                src={logoBoraCoop}
                alt="BoraCoop"
                className="w-full rounded-[1.5rem] object-cover"
              />

              <div className="grid gap-3 p-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-4">
                  <BadgeDollarSign
                    size={21}
                    className="text-emerald-400"
                  />
                  <p className="mt-3 text-xs uppercase tracking-wide text-slate-500">
                    Ganhos organizados
                  </p>
                  <strong className="mt-1 block text-xl">
                    Tudo no painel
                  </strong>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-4">
                  <Users
                    size={21}
                    className="text-purple-300"
                  />
                  <p className="mt-3 text-xs uppercase tracking-wide text-slate-500">
                    Comunidade
                  </p>
                  <strong className="mt-1 block text-xl">
                    BoraCoop
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-purple-300">
                Oportunidades disponíveis
              </p>

              <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                Veja oportunidades antes mesmo de criar sua conta.
              </h2>

              <p className="mt-4 leading-7 text-slate-400">
                Compare valores, requisitos e prazos. Depois, crie sua conta gratuita para acessar todos os detalhes.
              </p>
            </div>

            <Link
              to="/cadastro"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-purple-500/20 bg-purple-500/10 px-5 text-sm font-bold text-purple-200 transition hover:bg-purple-500/15"
            >
              Criar conta para ver todas
              <ArrowRight size={17} />
            </Link>
          </div>

          {erroCoops && (
            <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-200">
              {erroCoops}
            </div>
          )}

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {loadingCoops ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="min-h-[310px] animate-pulse rounded-3xl border border-white/10 bg-[#0b1020]/80"
                />
              ))
            ) : cooperacoes.length > 0 ? (
              cooperacoes.map((coop) => (
                <article
                  key={coop.id}
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-[#0b1020]/85 shadow-xl transition duration-300 hover:-translate-y-1 hover:border-purple-500/30"
                >
                  <div className="relative aspect-[16/8] overflow-hidden bg-gradient-to-br from-indigo-600/20 via-purple-600/15 to-fuchsia-600/10">
                    {coop.imagem ? (
                      <img
                        src={coop.imagem}
                        alt={coop.nome}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Handshake
                          size={44}
                          className="text-purple-300/70"
                        />
                      </div>
                    )}

                    <div className="absolute left-3 top-3 rounded-full border border-emerald-400/20 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300 backdrop-blur">
                      {coop.status}
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-300">
                      {coop.categoria}
                    </p>

                    {coop.modeloPlataforma && (
                      <p className="mt-2 text-sm font-semibold leading-5 text-purple-200">
                        {coop.modeloPlataforma}
                      </p>
                    )}

                    <h3 className="mt-2 text-2xl font-black">
                      {coop.nome}
                    </h3>

                    {coop.descricao && (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
                        {coop.descricao}
                      </p>
                    )}

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-3">
                        <p className="text-xs text-slate-500">
                          Valor fixo
                        </p>
                        <strong className="mt-1 block text-lg text-white">
                          {coop.salario}
                        </strong>
                      </div>

                      <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.04] p-3">
                        <p className="text-xs text-slate-500">
                          Por depositante
                        </p>
                        <strong className="mt-1 block text-lg text-emerald-400">
                          {coop.valorDepositante}
                        </strong>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-slate-400">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-purple-300" />
                        Mínimo de {coop.minimoDepositantes} depositantes
                      </div>

                      <div className="flex items-center gap-2">
                        <CalendarDays size={16} className="text-purple-300" />
                        Encerra em {formatDate(coop.dataEncerramento)}
                      </div>
                    </div>

                    <Link
                      to="/cadastro"
                      className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 px-4 text-sm font-bold text-white shadow-lg shadow-purple-950/20 transition hover:brightness-110"
                    >
                      Quero participar
                      <Zap size={17} />
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-3xl border border-white/10 bg-[#0b1020]/80 p-8 text-center text-slate-400 md:col-span-2 xl:col-span-3">
                Nenhuma cooperação pública disponível no momento.
              </div>
            )}
          </div>
        </section>


        <section className="border-y border-white/5 bg-white/[0.015]">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-purple-300">
                O que você encontra
              </p>

              <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                Mais clareza para escolher melhor.
              </h2>

              <p className="mt-4 leading-7 text-slate-400">
                Oportunidades, ganhos e evolução organizados para você decidir com mais
                segurança onde vale a pena participar.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {benefits.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="rounded-3xl border border-white/10 bg-[#0b1020]/80 p-6 shadow-xl"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-300">
                      <Icon size={23} />
                    </div>

                    <h3 className="mt-5 text-xl font-black">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {item.text}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>


        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-purple-300">
                Como funciona
              </p>

              <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                Do cadastro à próxima coop em poucos passos.
              </h2>
            </div>

            <div className="space-y-4">
              {steps.map((step) => (
                <article
                  key={step.number}
                  className="flex gap-4 rounded-3xl border border-white/10 bg-[#0b1020]/80 p-5 sm:p-6"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600/30 to-purple-600/30 font-black text-purple-200">
                    {step.number}
                  </div>

                  <div>
                    <h3 className="text-lg font-black">
                      {step.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {step.text}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>


        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
          <div className="rounded-[2rem] border border-white/10 bg-[#0b1020]/85 p-6 shadow-xl backdrop-blur-xl sm:p-8">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-purple-300">
                Dúvidas frequentes
              </p>

              <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                Antes de entrar, tire suas dúvidas.
              </h2>
            </div>

            <div className="mt-7 grid gap-3 md:grid-cols-2">
              {faqs.map((item) => (
                <article
                  key={item.question}
                  className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"
                >
                  <h3 className="font-bold text-white">
                    {item.question}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {item.answer}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-7 border-t border-white/5 pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                Contato oficial
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <a
                href="https://instagram.com/boracoopoficial"
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-fuchsia-500/30 hover:bg-fuchsia-500/[0.06]"
              >
                <span className="text-2xl font-black text-fuchsia-300">@</span>
                <p className="mt-4 text-xs text-slate-500">
                  Instagram oficial
                </p>
                <strong className="mt-1 block text-sm text-white">
                  @boracoopoficial
                </strong>
              </a>

              <a
                href="https://wa.me/5589981515242"
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-emerald-500/30 hover:bg-emerald-500/[0.06]"
              >
                <MessageCircle
                  size={23}
                  className="text-emerald-400"
                />
                <p className="mt-4 text-xs text-slate-500">
                  WhatsApp
                </p>
                <strong className="mt-1 block text-sm text-white">
                  (89) 98151-5242
                </strong>
              </a>

              <a
                href="mailto:contato.boracoop@gmail.com"
                className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-indigo-500/30 hover:bg-indigo-500/[0.06]"
              >
                <Mail
                  size={23}
                  className="text-indigo-300"
                />
                <p className="mt-4 text-xs text-slate-500">
                  E-mail
                </p>
                <strong className="mt-1 block break-all text-sm text-white">
                  contato.boracoop@gmail.com
                </strong>
              </a>

              <a
                href="https://instagram.com/yslamico"
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-purple-500/30 hover:bg-purple-500/[0.06]"
              >
                <span className="text-2xl font-black text-purple-300">@</span>
                <p className="mt-4 text-xs text-slate-500">
                  Guilherme Araújo
                </p>
                <strong className="mt-1 block text-sm text-white">
                  Fundador & CEO · @yslamico
                </strong>
              </a>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
          <div className="overflow-hidden rounded-[2rem] border border-purple-500/20 bg-gradient-to-br from-indigo-700/25 via-purple-700/20 to-fuchsia-700/15 p-6 text-center shadow-2xl shadow-purple-950/20 sm:p-10 lg:p-14">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-purple-200">
              BoraCoop
            </p>

            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-black sm:text-4xl lg:text-5xl">
              Sua próxima oportunidade pode começar aqui.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Cadastre-se gratuitamente e veja todas as oportunidades disponíveis.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/cadastro"
                className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-white px-6 font-bold text-[#0b1020] transition hover:scale-[1.01]"
              >
                Criar minha conta grátis
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/login"
                className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.05] px-6 font-semibold text-white transition hover:bg-white/[0.08]"
              >
                Entrar
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/5 bg-[#050816]/80">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-start">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-2xl border border-purple-400/20 bg-[#0b1020]">
                  <img
                    src={iconeBoraCoop}
                    alt="BoraCoop"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <strong className="block text-lg font-black text-white">
                    BoraCoop
                  </strong>
                  <span className="text-xs text-slate-500">
                    Influência em resultado
                  </span>
                </div>
              </div>

              <p className="mt-4 max-w-md text-sm leading-6 text-slate-400">
                Cooperações, oportunidades e gestão para influenciadores em um só lugar.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href="https://instagram.com/boracoopoficial"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-slate-300 transition hover:border-purple-500/30 hover:bg-purple-500/[0.06] hover:text-white"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center font-black text-fuchsia-300">@</span>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Instagram BoraCoop</p>
                  <strong className="block truncate text-sm">@boracoopoficial</strong>
                </div>
              </a>

              <a
                href="https://wa.me/5589981515242"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-slate-300 transition hover:border-emerald-500/30 hover:bg-emerald-500/[0.06] hover:text-white"
              >
                <MessageCircle size={20} className="text-emerald-400" />
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">WhatsApp</p>
                  <strong className="block text-sm">(89) 98151-5242</strong>
                </div>
              </a>

              <a
                href="mailto:contato.boracoop@gmail.com"
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-slate-300 transition hover:border-indigo-500/30 hover:bg-indigo-500/[0.06] hover:text-white"
              >
                <Mail size={20} className="text-indigo-300" />
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">E-mail</p>
                  <strong className="block break-all text-sm">contato.boracoop@gmail.com</strong>
                </div>
              </a>

              <a
                href="https://instagram.com/yslamico"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-slate-300 transition hover:border-purple-500/30 hover:bg-purple-500/[0.06] hover:text-white"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center font-black text-purple-300">@</span>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">
                    Guilherme Araújo · Fundador & CEO
                  </p>
                  <strong className="block truncate text-sm">@yslamico</strong>
                </div>
              </a>

              <a
                href="tel:+5589981515242"
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-slate-300 transition hover:border-purple-500/30 hover:bg-white/[0.05] hover:text-white sm:col-span-2"
              >
                <Phone size={20} className="text-purple-300" />
                <div>
                  <p className="text-xs text-slate-500">Telefone</p>
                  <strong className="block text-sm">(89) 98151-5242</strong>
                </div>
              </a>
            </div>
          </div>

          <div className="mt-8 border-t border-white/5 pt-6 text-center text-sm text-slate-600">
            © {new Date().getFullYear()} BoraCoop. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}