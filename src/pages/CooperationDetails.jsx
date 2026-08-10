import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Download,
  DownloadCloud,
  ExternalLink,
  Film,
  Gift,
  Image as ImageIcon,
  Images,
  LoaderCircle,
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
import {
  getDownloadUrlMidia,
  getMidiasCooperacaoSupabase,
} from "../services/supabase/cooperationMedia";

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

  const [midias, setMidias] = useState([]);
  const [carregandoMidias, setCarregandoMidias] =
    useState(false);
  const [erroMidias, setErroMidias] = useState("");
  const [baixandoTodas, setBaixandoTodas] =
    useState(false);

  useEffect(() => {
    let ativo = true;

    async function carregarMidias() {
      if (!coop?.id) {
        return;
      }

      try {
        setCarregandoMidias(true);
        setErroMidias("");

        const data =
          await getMidiasCooperacaoSupabase(
            coop.id,
          );

        if (ativo) {
          setMidias(data || []);
        }
      } catch (error) {
        console.error(error);

        if (ativo) {
          setErroMidias(
            error?.message ||
              "Não foi possível carregar as mídias.",
          );
        }
      } finally {
        if (ativo) {
          setCarregandoMidias(false);
        }
      }
    }

    carregarMidias();

    return () => {
      ativo = false;
    };
  }, [coop?.id]);

  async function baixarMidia(midia) {
    try {
      setErroMidias("");

      const url = await getDownloadUrlMidia(
        midia.arquivoPath,
      );

      if (!url) {
        throw new Error(
          "Link de download indisponível.",
        );
      }

      window.open(
        url,
        "_blank",
        "noopener,noreferrer",
      );
    } catch (error) {
      console.error(error);
      setErroMidias(
        error?.message ||
          "Não foi possível baixar a mídia.",
      );
    }
  }

  async function baixarTodasMidias() {
    if (!midias.length || baixandoTodas) {
      return;
    }

    try {
      setBaixandoTodas(true);
      setErroMidias("");

      for (let index = 0; index < midias.length; index += 1) {
        const midia = midias[index];

        const url = await getDownloadUrlMidia(
          midia.arquivoPath,
        );

        if (!url) {
          continue;
        }

        const link = document.createElement("a");
        link.href = url;
        link.download =
          midia.titulo || `midia-${index + 1}`;
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        document.body.appendChild(link);
        link.click();
        link.remove();

        await new Promise((resolve) =>
          setTimeout(resolve, 350),
        );
      }
    } catch (error) {
      console.error(error);
      setErroMidias(
        error?.message ||
          "Não foi possível baixar todas as mídias.",
      );
    } finally {
      setBaixandoTodas(false);
    }
  }

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

  const whatsappNumero = String(
    coop.whatsappNumero || "",
  ).replace(/\D/g, "");

  const whatsappUrl = whatsappNumero
    ? `https://wa.me/${whatsappNumero}?text=${mensagem}`
    : `https://wa.me/?text=${mensagem}`;

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

                {coop.modeloPlataforma && (
                  <p className="mt-2 text-sm font-semibold text-purple-200 sm:text-base">
                    {coop.modeloPlataforma}
                  </p>
                )}

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

          <section className="mt-6 rounded-3xl border border-white/10 bg-[#0b1020]/90 p-5 backdrop-blur-xl sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <Images className="text-fuchsia-300" />
                  <h2 className="text-2xl font-bold">
                    Mídias da plataforma
                  </h2>
                </div>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Banners, artes e vídeos disponíveis para divulgação.
                </p>
              </div>

              {midias.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="w-fit rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-200">
                    {midias.length} arquivo(s)
                  </span>

                  <button
                    type="button"
                    onClick={baixarTodasMidias}
                    disabled={baixandoTodas}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 text-xs font-bold text-emerald-300 transition hover:bg-emerald-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {baixandoTodas ? (
                      <LoaderCircle
                        size={16}
                        className="animate-spin"
                      />
                    ) : (
                      <DownloadCloud size={16} />
                    )}

                    {baixandoTodas
                      ? "Baixando..."
                      : "Baixar todas"}
                  </button>
                </div>
              )}
            </div>

            {erroMidias && (
              <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                {erroMidias}
              </div>
            )}

            {carregandoMidias ? (
              <div className="mt-5 flex items-center justify-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-sm text-slate-400">
                <LoaderCircle
                  size={20}
                  className="animate-spin"
                />
                Carregando materiais...
              </div>
            ) : midias.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center text-sm text-slate-500">
                Nenhuma mídia disponível para esta cooperação ainda.
              </div>
            ) : (
              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {midias.map((midia) => (
                  <article
                    key={midia.id}
                    className="overflow-hidden rounded-3xl border border-white/10 bg-[#070b18]"
                  >
                    <div className="aspect-video overflow-hidden bg-black/30">
                      {midia.tipo === "video" ? (
                        <video
                          src={midia.url}
                          controls
                          playsInline
                          preload="metadata"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <a
                          href={midia.url}
                          target="_blank"
                          rel="noreferrer"
                          className="block h-full w-full"
                        >
                          <img
                            src={midia.url}
                            alt={
                              midia.titulo ||
                              "Material da plataforma"
                            }
                            className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]"
                          />
                        </a>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex items-center gap-2">
                        {midia.tipo === "video" ? (
                          <Film
                            size={17}
                            className="shrink-0 text-fuchsia-300"
                          />
                        ) : (
                          <ImageIcon
                            size={17}
                            className="shrink-0 text-purple-300"
                          />
                        )}

                        <p className="min-w-0 flex-1 truncate text-sm font-semibold text-white">
                          {midia.titulo || "Material"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          baixarMidia(midia)
                        }
                        className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 text-sm font-bold text-white transition hover:brightness-110"
                      >
                        <Download size={17} />
                        Baixar mídia
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
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