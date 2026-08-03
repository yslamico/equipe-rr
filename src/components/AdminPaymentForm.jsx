import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  LoaderCircle,
  Save,
} from "lucide-react";

import usePayments from "../hooks/usePayments";
import {
  getBlogueirosSupabase,
} from "../services/supabase/bloggers";
import {
  getCooperacoesSupabase,
} from "../services/supabase/cooperations";

const emptyForm = {
  blogueiroId: "",
  cooperacaoId: "",
  valor: "",
  data: "",
  formaPagamento: "PIX",
  status: "Pendente",
  observacao: "",
};

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-300">
        {label}
      </span>

      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-[#070b18] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-purple-500/40 focus:ring-4 focus:ring-purple-500/5";

export default function AdminPaymentForm({
  initialData = null,
  onSaved,
}) {
  const { save } = usePayments();

  const [form, setForm] = useState(emptyForm);
  const [blogueiros, setBlogueiros] = useState([]);
  const [cooperacoes, setCooperacoes] = useState([]);
  const [carregandoOpcoes, setCarregandoOpcoes] =
    useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    async function carregarOpcoes() {
      try {
        setCarregandoOpcoes(true);
        setMensagem("");

        const [blogueirosData, cooperacoesData] =
          await Promise.all([
            getBlogueirosSupabase(),
            getCooperacoesSupabase(),
          ]);

        setBlogueiros(blogueirosData);
        setCooperacoes(cooperacoesData);
      } catch (error) {
        console.error(error);

        setMensagem(
          error?.message ||
            "Não foi possível carregar blogueiros e cooperações.",
        );
      } finally {
        setCarregandoOpcoes(false);
      }
    }

    carregarOpcoes();
  }, []);

  useEffect(() => {
    if (initialData) {
      setForm({
        ...emptyForm,
        ...initialData,
      });
    } else {
      setForm(emptyForm);
    }

    setMensagem("");
  }, [initialData]);

  const blogueiroSelecionado = useMemo(
    () =>
      blogueiros.find(
        (item) => item.id === form.blogueiroId,
      ),
    [blogueiros, form.blogueiroId],
  );

  const cooperacaoSelecionada = useMemo(
    () =>
      cooperacoes.find(
        (item) => item.id === form.cooperacaoId,
      ),
    [cooperacoes, form.cooperacaoId],
  );

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setMensagem("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSalvando(true);
      setMensagem("");

      const pagamentoSalvo = await save({
        ...form,
        id: initialData?.id,
      });

      setMensagem(
        "Pagamento salvo no Supabase com sucesso.",
      );

      onSaved?.(pagamentoSalvo);
    } catch (error) {
      console.error(error);

      setMensagem(
        error?.message ||
          "Não foi possível salvar o pagamento.",
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-[#0b1020]/90 p-6 shadow-xl backdrop-blur-xl">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.2em] text-purple-300">
            Financeiro
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            Dados do pagamento
          </h2>
        </div>

        {carregandoOpcoes ? (
          <div className="flex items-center justify-center gap-3 py-10 text-slate-400">
            <LoaderCircle className="animate-spin" />
            Carregando blogueiros e cooperações...
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Blogueiro">
              <select
                name="blogueiroId"
                value={form.blogueiroId}
                onChange={updateField}
                className={inputClass}
                required
              >
                <option value="">
                  Selecione um blogueiro
                </option>

                {blogueiros.map((blogueiro) => (
                  <option
                    key={blogueiro.id}
                    value={blogueiro.id}
                  >
                    {blogueiro.nome}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Cooperação">
              <select
                name="cooperacaoId"
                value={form.cooperacaoId}
                onChange={updateField}
                className={inputClass}
                required
              >
                <option value="">
                  Selecione uma cooperação
                </option>

                {cooperacoes.map((coop) => (
                  <option
                    key={coop.id}
                    value={coop.id}
                  >
                    {coop.nome}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Valor">
              <input
                name="valor"
                value={form.valor}
                onChange={updateField}
                placeholder="R$ 120,00"
                className={inputClass}
                required
              />
            </Field>

            <Field label="Data do pagamento">
              <input
                name="data"
                type="date"
                value={form.data}
                onChange={updateField}
                className={inputClass}
                required
              />
            </Field>

            <Field label="Forma de pagamento">
              <select
                name="formaPagamento"
                value={form.formaPagamento}
                onChange={updateField}
                className={inputClass}
              >
                <option>PIX</option>
                <option>Transferência</option>
                <option>Dinheiro</option>
                <option>Outro</option>
              </select>
            </Field>

            <Field label="Status">
              <select
                name="status"
                value={form.status}
                onChange={updateField}
                className={inputClass}
              >
                <option>Pendente</option>
                <option>Pago</option>
                <option>Cancelado</option>
              </select>
            </Field>

            <div className="md:col-span-2">
              <Field label="Observação">
                <textarea
                  name="observacao"
                  value={form.observacao}
                  onChange={updateField}
                  rows="4"
                  placeholder="Informações adicionais sobre o pagamento..."
                  className={inputClass}
                />
              </Field>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-indigo-500/5 p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-[#070b18] p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Blogueiro
            </p>

            <strong className="mt-2 block text-white">
              {blogueiroSelecionado?.nome ||
                "Não selecionado"}
            </strong>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#070b18] p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Cooperação
            </p>

            <strong className="mt-2 block text-white">
              {cooperacaoSelecionada?.nome ||
                "Não selecionada"}
            </strong>
          </div>

          <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.04] p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Valor
            </p>

            <strong className="mt-2 block text-xl text-emerald-400">
              {form.valor || "R$ 0,00"}
            </strong>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            {mensagem ? (
              <p
                className={
                  mensagem.includes("Não foi")
                    ? "text-sm font-semibold text-red-300"
                    : "text-sm font-semibold text-emerald-400"
                }
              >
                {mensagem}
              </p>
            ) : (
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <CalendarDays size={17} />
                Preencha os dados para registrar o pagamento.
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={
              salvando ||
              carregandoOpcoes ||
              blogueiros.length === 0 ||
              cooperacoes.length === 0
            }
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-950/30 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {salvando ? (
              <LoaderCircle
                size={19}
                className="animate-spin"
              />
            ) : (
              <Save size={19} />
            )}

            {salvando
              ? "Salvando..."
              : initialData
                ? "Salvar alterações"
                : "Salvar pagamento"}
          </button>
        </div>
      </section>

      {!carregandoOpcoes &&
        blogueiros.length === 0 && (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-200">
            Cadastre pelo menos um blogueiro antes de registrar pagamentos.
          </div>
        )}

      {!carregandoOpcoes &&
        cooperacoes.length === 0 && (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-200">
            Cadastre pelo menos uma cooperação antes de registrar pagamentos.
          </div>
        )}
    </form>
  );
}