import { useNavigate } from "react-router-dom";
import {
  Clock3,
  Eye,
  MessageCircle,
  Package,
  Star,
  Users,
} from "lucide-react";

function limparNumeroWhatsApp(numero) {
  return String(numero || "").replace(/\D/g, "");
}

export default function CooperationCard({
  nome,
  categoria,
  contasDemo,
  disponiveis,
  salario,
  valorDepositante,
  depositante,
  pessoas = 0,
  prazo,
  dataEncerramento,
  nota = "9.0",
  imagem,
  whatsappNumero,
  mensagemWhatsApp,
  ...rest
}) {
  const navigate = useNavigate();

  const demo = Number(contasDemo ?? disponiveis ?? 0);
  const valorPorDepositante =
    valorDepositante || depositante || "R$ 0,00";

  const prazoExibido =
    prazo || dataEncerramento || "Sem prazo";

  const iniciais = String(nome || "PLT")
    .split(" ")
    .map((palavra) => palavra[0])
    .join("")
    .slice(0, 3);

  const percentualEstoque = Math.min(demo * 5, 100);

  const numeroWhatsAppLimpo =
    limparNumeroWhatsApp(whatsappNumero);

  const mensagemFinal = String(
    mensagemWhatsApp ||
      "Olá! Quero participar da cooperação {PLATAFORMA}. Meu ID é:",
  ).replaceAll("{PLATAFORMA}", nome || "");

  const linkWhatsApp = numeroWhatsAppLimpo
    ? `https://wa.me/${numeroWhatsAppLimpo}?text=${encodeURIComponent(
        mensagemFinal,
      )}`
    : "";

  const cooperationData = {
    nome,
    categoria,
    contasDemo: demo,
    salario,
    valorDepositante: valorPorDepositante,
    pessoas,
    prazo,
    dataEncerramento,
    nota,
    imagem,
    whatsappNumero: numeroWhatsAppLimpo,
    mensagemWhatsApp: mensagemFinal,
    ...rest,
  };

  function abrirDetalhes() {
    navigate("/cooperacao", {
      state: {
        coop: cooperationData,
      },
    });
  }

  function abrirWhatsApp() {
    if (!linkWhatsApp) {
      window.alert(
        "O número do WhatsApp desta cooperação ainda não foi cadastrado.",
      );

      return;
    }

    window.open(
      linkWhatsApp,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <article className="group relative overflow-hidden rounded-[1.75rem] border border-purple-500/20 bg-[#0b1020]/95 p-4 shadow-xl shadow-purple-950/20 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-purple-500/40 sm:rounded-3xl sm:p-5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-purple-600/10 to-transparent" />

      <div className="relative grid gap-5 xl:grid-cols-[1.25fr_1fr_auto] xl:items-center">
        <div className="flex items-start gap-3 sm:gap-3 sm:p-4">
          <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 text-2xl font-black shadow-lg shadow-purple-950/50">
            {imagem ? (
              <img
                src={imagem}
                alt={`Logo da plataforma ${nome}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="relative z-10">
                {iniciais}
              </span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-xl font-black leading-tight text-white sm:text-2xl">
                {nome}
              </h3>

              <span className="rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1 text-xs font-semibold uppercase text-purple-300">
                {categoria}
              </span>

              <span className="flex items-center gap-1 rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
                <Star size={13} fill="currentColor" />
                {nota}
              </span>
            </div>

            <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
              <Package size={16} />

              <span>
                {demo} contas demo disponíveis
              </span>
            </div>

            <div className="mt-3 h-2.5 w-64 max-w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 transition-all duration-500"
                style={{
                  width: `${percentualEstoque}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Salário
            </p>

            <strong className="mt-2 block text-lg font-black text-white sm:text-xl">
              {salario || "R$ 0,00"}
            </strong>
          </div>

          <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.06] p-3 sm:p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Por depositante
            </p>

            <strong className="mt-2 block text-lg font-black text-emerald-400 sm:text-xl">
              {valorPorDepositante}
            </strong>
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-400">
            <Users size={17} />
            <span>{pessoas} participantes</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-400">
            <Clock3 size={17} />
            <span>{prazoExibido}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 xl:flex xl:flex-col">
          <button
            type="button"
            onClick={abrirDetalhes}
            className="order-2 flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08] xl:order-1 xl:px-6"
          >
            <Eye size={18} />
            Ver detalhes
          </button>

          <button
            type="button"
            onClick={abrirWhatsApp}
            className="order-1 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-3 text-sm font-black text-white shadow-lg shadow-emerald-950/30 transition hover:brightness-110 xl:order-2 xl:px-6"
          >
            <MessageCircle size={18} />
            WhatsApp
          </button>
        </div>
      </div>
    </article>
  );
}