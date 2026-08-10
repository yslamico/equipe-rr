import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import BackgroundEffects from "../components/BackgroundEffects";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import { getBlogueirosSupabase } from "../services/supabase/bloggers";
import { getCooperacoesSupabase } from "../services/supabase/cooperations";
import {
  getContasDemoSupabase,
  removeContaDemoSupabase,
  saveContaDemoSupabase,
} from "../services/supabase/contasDemo";

const emptyForm = {
  id: "",
  cooperacaoId: "",
  blogueiroId: "",
  usuario: "",
  senha: "",
  observacao: "",
};

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-[#070b18] px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-purple-500/40 focus:ring-4 focus:ring-purple-500/5";

export default function DemoAccounts() {
  const [contas, setContas] = useState([]);
  const [cooperacoes, setCooperacoes] =
    useState([]);
  const [blogueiros, setBlogueiros] =
    useState([]);

  const [form, setForm] =
    useState(emptyForm);
  const [showForm, setShowForm] =
    useState(false);

  const [loading, setLoading] =
    useState(true);
  const [saving, setSaving] =
    useState(false);
  const [erro, setErro] =
    useState("");
  const [mensagem, setMensagem] =
    useState("");
  const [senhasVisiveis, setSenhasVisiveis] =
    useState({});

  async function carregarDados() {
    try {
      setLoading(true);
      setErro("");

      const [
        contasData,
        cooperacoesData,
        blogueirosData,
      ] = await Promise.all([
        getContasDemoSupabase(),
        getCooperacoesSupabase(),
        getBlogueirosSupabase(),
      ]);

      setContas(contasData || []);
      setCooperacoes(cooperacoesData || []);
      setBlogueiros(blogueirosData || []);
    } catch (error) {
      console.error(error);

      setErro(
        error?.message ||
          "Não foi possível carregar as contas demo.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  const resumo = useMemo(() => {
    const disponiveis = contas.filter(
      (item) =>
        item.status === "Disponível",
    ).length;

    const emUso = contas.filter(
      (item) => item.status === "Em uso",
    ).length;

    return {
      total: contas.length,
      disponiveis,
      emUso,
    };
  }, [contas]);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErro("");
    setMensagem("");
  }

  function abrirNovaConta() {
    setForm(emptyForm);
    setShowForm(true);
    setMensagem("");
    setErro("");
  }

  function editarConta(conta) {
    setForm({
      id: conta.id,
      cooperacaoId:
        conta.cooperacaoId || "",
      blogueiroId:
        conta.blogueiroId || "",
      usuario: conta.usuario || "",
      senha: conta.senha || "",
      observacao:
        conta.observacao || "",
    });

    setShowForm(true);
    setMensagem("");
    setErro("");
  }

  function fecharFormulario() {
    setShowForm(false);
    setForm(emptyForm);
  }

  async function salvar(event) {
    event.preventDefault();

    if (
      !form.cooperacaoId ||
      !form.usuario.trim() ||
      !form.senha
    ) {
      setErro(
        "Informe a cooperação, o usuário e a senha.",
      );
      return;
    }

    try {
      setSaving(true);
      setErro("");
      setMensagem("");

      await saveContaDemoSupabase(form);

      await carregarDados();

      setMensagem(
        form.id
          ? "Conta demo atualizada."
          : "Conta demo criada.",
      );

      fecharFormulario();
    } catch (error) {
      console.error(error);

      setErro(
        error?.message ||
          "Não foi possível salvar a conta demo.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function excluir(conta) {
    const confirmar = window.confirm(
      `Excluir a conta demo "${conta.usuario}"?`,
    );

    if (!confirmar) return;

    try {
      setErro("");
      setMensagem("");

      await removeContaDemoSupabase(
        conta.id,
      );

      setContas((current) =>
        current.filter(
          (item) => item.id !== conta.id,
        ),
      );

      setMensagem(
        "Conta demo excluída.",
      );
    } catch (error) {
      console.error(error);

      setErro(
        error?.message ||
          "Não foi possível excluir.",
      );
    }
  }

  async function copiarTexto(
    texto,
    label,
  ) {
    try {
      await navigator.clipboard.writeText(
        texto,
      );

      setMensagem(`${label} copiado.`);
    } catch {
      setErro(
        `Não foi possível copiar ${label.toLowerCase()}.`,
      );
    }
  }

  function toggleSenha(id) {
    setSenhasVisiveis((current) => ({
      ...current,
      [id]: !current[id],
    }));
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-transparent text-white lg:flex">
      <BackgroundEffects />
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Navbar />

        <main className="relative z-10 px-3 pb-24 pt-4 sm:p-6">
          <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-purple-300">
                BoraCoop
              </p>

              <h1 className="mt-2 text-3xl font-black sm:text-4xl">
                Contas Demo
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Gerencie acessos demo e vincule cada conta a uma cooperação e, quando necessário, a um blogueiro.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={carregarDados}
                disabled={loading}
                className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06] disabled:opacity-50"
              >
                <RefreshCw
                  size={18}
                  className={
                    loading
                      ? "animate-spin"
                      : ""
                  }
                />
                Atualizar
              </button>

              <button
                type="button"
                onClick={abrirNovaConta}
                className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 px-4 text-sm font-bold text-white shadow-lg shadow-purple-950/30 transition hover:brightness-110"
              >
                <Plus size={18} />
                Nova conta
              </button>
            </div>
          </header>

          <section className="grid gap-3 sm:grid-cols-3">
            <article className="rounded-3xl border border-white/10 bg-[#0b1020]/90 p-5">
              <p className="text-sm text-slate-400">
                Total
              </p>
              <strong className="mt-2 block text-3xl font-black">
                {resumo.total}
              </strong>
            </article>

            <article className="rounded-3xl border border-emerald-500/15 bg-emerald-500/[0.05] p-5">
              <p className="text-sm text-slate-400">
                Disponíveis
              </p>
              <strong className="mt-2 block text-3xl font-black text-emerald-400">
                {resumo.disponiveis}
              </strong>
            </article>

            <article className="rounded-3xl border border-purple-500/15 bg-purple-500/[0.05] p-5">
              <p className="text-sm text-slate-400">
                Em uso
              </p>
              <strong className="mt-2 block text-3xl font-black text-purple-300">
                {resumo.emUso}
              </strong>
            </article>
          </section>

          {(erro || mensagem) && (
            <div
              className={[
                "mt-5 rounded-2xl border p-4 text-sm",
                erro
                  ? "border-red-500/20 bg-red-500/10 text-red-300"
                  : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
              ].join(" ")}
            >
              {erro || mensagem}
            </div>
          )}

          {showForm && (
            <section className="mt-5 rounded-3xl border border-purple-500/20 bg-[#0b1020]/95 p-4 shadow-2xl shadow-purple-950/20 sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-purple-300">
                    {form.id
                      ? "Editar"
                      : "Cadastro"}
                  </p>

                  <h2 className="mt-1 text-2xl font-black">
                    {form.id
                      ? "Editar conta demo"
                      : "Nova conta demo"}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={fecharFormulario}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400"
                  aria-label="Fechar formulário"
                >
                  <X size={20} />
                </button>
              </div>

              <form
                onSubmit={salvar}
                className="grid gap-4 md:grid-cols-2"
              >
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-300">
                    Cooperação
                  </span>

                  <select
                    name="cooperacaoId"
                    value={form.cooperacaoId}
                    onChange={updateField}
                    className={inputClass}
                    required
                  >
                    <option value="">
                      Selecione
                    </option>

                    {cooperacoes.map(
                      (item) => (
                        <option
                          key={item.id}
                          value={item.id}
                        >
                          {item.nome}
                        </option>
                      ),
                    )}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-300">
                    Blogueiro responsável
                  </span>

                  <select
                    name="blogueiroId"
                    value={form.blogueiroId}
                    onChange={updateField}
                    className={inputClass}
                  >
                    <option value="">
                      Nenhum — disponível
                    </option>

                    {blogueiros.map(
                      (item) => (
                        <option
                          key={item.id}
                          value={item.id}
                        >
                          {item.nome}
                        </option>
                      ),
                    )}
                  </select>

                  <p className="mt-2 text-xs text-slate-500">
                    Se selecionar um blogueiro, o status muda automaticamente para “Em uso”.
                  </p>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-300">
                    Usuário / Login
                  </span>

                  <input
                    name="usuario"
                    value={form.usuario}
                    onChange={updateField}
                    placeholder="Login da conta demo"
                    className={inputClass}
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-300">
                    Senha
                  </span>

                  <input
                    name="senha"
                    value={form.senha}
                    onChange={updateField}
                    placeholder="Senha da conta demo"
                    className={inputClass}
                    required
                  />
                </label>

                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-slate-300">
                    Observação
                  </span>

                  <textarea
                    name="observacao"
                    value={form.observacao}
                    onChange={updateField}
                    placeholder="Informação adicional, se necessário"
                    rows="3"
                    className={`${inputClass} resize-none`}
                  />
                </label>

                <div className="flex flex-col gap-2 md:col-span-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={fecharFormulario}
                    className="min-h-12 rounded-2xl border border-white/10 px-5 text-sm font-semibold text-slate-300"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 text-sm font-bold text-white disabled:opacity-60"
                  >
                    {saving ? (
                      <LoaderCircle
                        size={18}
                        className="animate-spin"
                      />
                    ) : (
                      <Save size={18} />
                    )}

                    {saving
                      ? "Salvando..."
                      : "Salvar conta"}
                  </button>
                </div>
              </form>
            </section>
          )}

          <section className="mt-6">
            {loading ? (
              <div className="flex min-h-48 items-center justify-center gap-3 rounded-3xl border border-white/10 bg-[#0b1020]/90 text-slate-400">
                <LoaderCircle className="animate-spin" />
                Carregando contas...
              </div>
            ) : contas.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-[#0b1020]/90 p-8 text-center text-slate-400">
                Nenhuma conta demo cadastrada.
              </div>
            ) : (
              <div className="grid gap-4 xl:grid-cols-2">
                {contas.map((conta) => {
                  const senhaVisivel =
                    senhasVisiveis[
                      conta.id
                    ];

                  return (
                    <article
                      key={conta.id}
                      className="rounded-3xl border border-white/10 bg-[#0b1020]/90 p-4 shadow-xl backdrop-blur-xl sm:p-5"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={[
                                "rounded-full border px-3 py-1 text-xs font-bold",
                                conta.status ===
                                "Disponível"
                                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                                  : "border-purple-500/20 bg-purple-500/10 text-purple-300",
                              ].join(" ")}
                            >
                              {conta.status}
                            </span>

                            <span className="truncate text-sm text-slate-500">
                              {conta.cooperacaoNome ||
                                "Sem cooperação"}
                            </span>
                          </div>

                          <h2 className="mt-3 truncate text-xl font-black">
                            {conta.usuario}
                          </h2>

                          <p className="mt-1 text-sm text-slate-500">
                            {conta.blogueiroNome
                              ? `Com ${conta.blogueiroNome}`
                              : "Nenhum blogueiro vinculado"}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              editarConta(
                                conta,
                              )
                            }
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300"
                            aria-label="Editar"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              excluir(conta)
                            }
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/15 bg-red-500/10 text-red-300"
                            aria-label="Excluir"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-3">
                          <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
                            <UserRound size={15} />
                            Login
                          </div>

                          <div className="mt-2 flex items-center gap-2">
                            <code className="min-w-0 flex-1 truncate text-sm text-white">
                              {conta.usuario}
                            </code>

                            <button
                              type="button"
                              onClick={() =>
                                copiarTexto(
                                  conta.usuario,
                                  "Login",
                                )
                              }
                              className="text-slate-400 hover:text-white"
                              aria-label="Copiar login"
                            >
                              <Copy size={17} />
                            </button>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-3">
                          <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
                            <KeyRound size={15} />
                            Senha
                          </div>

                          <div className="mt-2 flex items-center gap-2">
                            <code className="min-w-0 flex-1 truncate text-sm text-white">
                              {senhaVisivel
                                ? conta.senha
                                : "••••••••••"}
                            </code>

                            <button
                              type="button"
                              onClick={() =>
                                toggleSenha(
                                  conta.id,
                                )
                              }
                              className="text-slate-400 hover:text-white"
                              aria-label="Mostrar ou ocultar senha"
                            >
                              {senhaVisivel ? (
                                <EyeOff
                                  size={17}
                                />
                              ) : (
                                <Eye
                                  size={17}
                                />
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                copiarTexto(
                                  conta.senha,
                                  "Senha",
                                )
                              }
                              className="text-slate-400 hover:text-white"
                              aria-label="Copiar senha"
                            >
                              <Copy size={17} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {conta.observacao && (
                        <p className="mt-4 rounded-2xl border border-white/5 bg-white/[0.02] p-3 text-sm leading-6 text-slate-400">
                          {conta.observacao}
                        </p>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}