import { useMemo } from "react";
import {
  LoaderCircle,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";

import usePayments from "../hooks/usePayments";

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

export default function AdminPaymentList({
  onNovo,
  onEditar,
}) {
  const {
    pagamentos,
    loading,
    error,
    refresh,
    remove,
  } = usePayments();

  const resumo = useMemo(() => {
    const pagos = pagamentos.filter(
      (item) => item.status === "Pago",
    );

    const pendentes = pagamentos.filter(
      (item) => item.status === "Pendente",
    );

    return {
      totalPago: pagos.reduce(
        (acc, item) => acc + parseMoney(item.valor),
        0,
      ),
      totalPendente: pendentes.reduce(
        (acc, item) => acc + parseMoney(item.valor),
        0,
      ),
      quantidadePagos: pagos.length,
      quantidadePendentes: pendentes.length,
    };
  }, [pagamentos]);

  async function excluir(id) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este pagamento?",
    );

    if (!confirmar) return;

    try {
      await remove(id);
    } catch (erro) {
      console.error(erro);

      window.alert(
        "Não foi possível excluir o pagamento.",
      );
    }
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5">
          <p className="text-sm text-emerald-200">
            Total pago
          </p>

          <strong className="mt-2 block text-2xl text-white">
            {formatMoney(resumo.totalPago)}
          </strong>
        </article>

        <article className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-5">
          <p className="text-sm text-amber-200">
            Total pendente
          </p>

          <strong className="mt-2 block text-2xl text-white">
            {formatMoney(resumo.totalPendente)}
          </strong>
        </article>

        <article className="rounded-3xl border border-blue-500/20 bg-blue-500/10 p-5">
          <p className="text-sm text-blue-200">
            Pagamentos concluídos
          </p>

          <strong className="mt-2 block text-2xl text-white">
            {resumo.quantidadePagos}
          </strong>
        </article>

        <article className="rounded-3xl border border-purple-500/20 bg-purple-500/10 p-5">
          <p className="text-sm text-purple-200">
            Pagamentos pendentes
          </p>

          <strong className="mt-2 block text-2xl text-white">
            {resumo.quantidadePendentes}
          </strong>
        </article>
      </section>

      <section className="rounded-3xl border border-white/10 bg-[#0b1020]/90 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-purple-300">
              Supabase
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              Pagamentos cadastrados
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Consulte, edite ou exclua pagamentos salvos no banco online.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={refresh}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw size={17} />
              Atualizar
            </button>

            <button
              type="button"
              onClick={onNovo}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white"
            >
              <Plus size={18} />
              Novo pagamento
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-12 text-slate-400">
            <LoaderCircle className="animate-spin" />
            Carregando pagamentos...
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[950px] border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4">Blogueiro</th>
                  <th className="px-4">Cooperação</th>
                  <th className="px-4">Valor</th>
                  <th className="px-4">Data</th>
                  <th className="px-4">Forma</th>
                  <th className="px-4">Status</th>
                  <th className="px-4 text-right">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody>
                {pagamentos.map((pagamento) => (
                  <tr
                    key={pagamento.id}
                    className="bg-[#070b18] text-sm text-slate-300"
                  >
                    <td className="rounded-l-2xl px-4 py-4">
                      <strong className="text-white">
                        {pagamento.blogueiroNome ||
                          "Não informado"}
                      </strong>
                    </td>

                    <td className="px-4 py-4">
                      {pagamento.cooperacaoNome ||
                        "Não informada"}
                    </td>

                    <td className="px-4 py-4 font-semibold text-emerald-400">
                      {pagamento.valor || "R$ 0,00"}
                    </td>

                    <td className="px-4 py-4">
                      {pagamento.data || "Sem data"}
                    </td>

                    <td className="px-4 py-4">
                      {pagamento.formaPagamento ||
                        "Não informada"}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={[
                          "rounded-full px-3 py-1 text-xs font-semibold",
                          pagamento.status === "Pago"
                            ? "bg-emerald-500/10 text-emerald-300"
                            : pagamento.status ===
                                "Cancelado"
                              ? "bg-red-500/10 text-red-300"
                              : "bg-amber-500/10 text-amber-300",
                        ].join(" ")}
                      >
                        {pagamento.status}
                      </span>
                    </td>

                    <td className="rounded-r-2xl px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            onEditar(pagamento)
                          }
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-300 transition hover:bg-blue-500/15"
                          title="Editar"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            excluir(pagamento.id)
                          }
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 transition hover:bg-red-500/15"
                          title="Excluir"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {pagamentos.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-[#070b18] p-8 text-center text-slate-400">
                Nenhum pagamento cadastrado ainda.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}