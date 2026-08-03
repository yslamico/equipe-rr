import {
  Handshake,
  Hourglass,
  Users,
  WalletCards,
} from "lucide-react";

function StatBox({
  icon: Icon,
  label,
  value,
  helper,
  tone,
}) {
  const tones = {
    green: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    purple: "border-purple-500/20 bg-purple-500/10 text-purple-300",
    blue: "border-blue-500/20 bg-blue-500/10 text-blue-300",
    amber: "border-amber-500/20 bg-amber-500/10 text-amber-300",
  };

  return (
    <article className="rounded-3xl border border-white/10 bg-[#0b1020]/90 p-5 shadow-xl backdrop-blur-xl">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${tones[tone]}`}
      >
        <Icon size={22} />
      </div>

      <p className="mt-4 text-sm text-slate-400">
        {label}
      </p>

      <strong className="mt-1 block text-2xl text-white">
        {value}
      </strong>

      <p className="mt-2 text-xs text-slate-500">
        {helper}
      </p>
    </article>
  );
}

export default function ExecutiveStats({
  totalPago,
  totalPendente,
  blogueirosAtivos,
  cooperacoesAtivas,
}) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatBox
        icon={WalletCards}
        label="Total pago"
        value={totalPago}
        helper="Pagamentos com status Pago"
        tone="green"
      />

      <StatBox
        icon={Hourglass}
        label="Total pendente"
        value={totalPendente}
        helper="Pagamentos aguardando conclusão"
        tone="amber"
      />

      <StatBox
        icon={Users}
        label="Blogueiros ativos"
        value={String(blogueirosAtivos)}
        helper="Cadastros com status Ativo"
        tone="blue"
      />

      <StatBox
        icon={Handshake}
        label="Cooperações ativas"
        value={String(cooperacoesAtivas)}
        helper="Disponíveis na página inicial"
        tone="purple"
      />
    </section>
  );
}