import { useEffect, useMemo, useState } from "react";
import {
  ImagePlus,
  LoaderCircle,
  Save,
  Upload,
  X,
} from "lucide-react";

import {
  saveCooperacaoSupabase,
} from "../services/supabase/cooperations";


const emptyForm = {
  nome: "",
  categoria: "Cassino",
  modeloPlataforma: "",
  descricao: "",
  salario: "",
  valorDepositante: "",
  minimoDepositantes: "",
  distribuicao: "Alta",
  contasDemo: "",
  depositoMinimo: "",
  saqueMinimo: "",
  dataEncerramento: "",
  linkCadastro: "",
  regras: "",
  beneficios: "",
  suporte: "",
  whatsappNumero: "",
  mensagemWhatsApp:
    "Olá! Quero participar da cooperação {PLATAFORMA}. Meu ID é:",
  status: "Ativa",
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

export default function AdminCooperationForm({
  initialData = null,
  onSaved,
}) {
  const [form, setForm] = useState(emptyForm);
  const [imagem, setImagem] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [savedCooperacaoId, setSavedCooperacaoId] = useState(
    initialData?.id || "",
  );

  useEffect(() => {
    if (initialData) {
      setForm({
        ...emptyForm,
        ...initialData,
      });

      setImagem(initialData.imagem || "");
      setSavedCooperacaoId(initialData.id || "");
    } else {
      setForm(emptyForm);
      setImagem("");
      setSavedCooperacaoId("");
    }

    setMensagem("");
  }, [initialData]);

  const preview = useMemo(
    () => ({
      nome: form.nome || "Nome da plataforma",
      categoria: form.categoria,
      modeloPlataforma:
        form.modeloPlataforma || "Modelo não informado",
      salario: form.salario || "R$ 0,00",
      valorDepositante:
        form.valorDepositante || "R$ 0,00",
      contasDemo: form.contasDemo || "0",
      status: form.status,
      whatsappNumero: form.whatsappNumero || "Número não informado",
    }),
    [form],
  );

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        name === "whatsappNumero"
          ? value.replace(/\D/g, "")
          : value,
    }));

    setMensagem("");
  }

  function handleImage(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setImagem(String(reader.result || ""));
      setMensagem("");
    };

    reader.readAsDataURL(file);
  }

  function limparImagem() {
    setImagem("");
    setMensagem("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSalvando(true);
      setMensagem("");

      const cooperacaoSalva =
        await saveCooperacaoSupabase({
          ...form,
          id: initialData?.id,
          imagem,
          pessoas: initialData?.pessoas ?? 0,
          nota: initialData?.nota ?? "9.0",
        });

      setMensagem("Cooperação salva no Supabase.");
      setSavedCooperacaoId(
        cooperacaoSalva?.id || initialData?.id || "",
      );

      onSaved?.(cooperacaoSalva);
    } catch (error) {
      console.error(error);
      setMensagem(
        "Não foi possível salvar. Confira o console do navegador.",
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
            Identificação
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            Informações principais
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
          <div>
            <span className="mb-2 block text-sm font-semibold text-slate-300">
              Logo ou foto
            </span>

            <div className="relative flex h-52 items-center justify-center overflow-hidden rounded-3xl border border-dashed border-purple-400/30 bg-[#070b18]">
              {imagem ? (
                <>
                  <img
                    src={imagem}
                    alt="Prévia da plataforma"
                    className="h-full w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={limparImagem}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl bg-black/60 text-white backdrop-blur"
                  >
                    <X size={18} />
                  </button>
                </>
              ) : (
                <div className="text-center">
                  <ImagePlus
                    size={36}
                    className="mx-auto text-purple-400"
                  />

                  <p className="mt-3 text-sm text-slate-400">
                    Escolha a imagem da plataforma
                  </p>
                </div>
              )}
            </div>

            <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-purple-500/20 bg-purple-500/10 px-4 py-3 text-sm font-semibold text-purple-200 transition hover:bg-purple-500/15">
              <Upload size={18} />
              Selecionar imagem

              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="hidden"
              />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Nome da plataforma">
              <input
                name="nome"
                value={form.nome}
                onChange={updateField}
                placeholder="Ex.: 777 Dots"
                className={inputClass}
                required
              />
            </Field>

            <Field label="Categoria">
              <select
                name="categoria"
                value={form.categoria}
                onChange={updateField}
                className={inputClass}
              >
                <option>Cassino</option>
                <option>Esportes</option>
                <option>Poker</option>
                <option>Slots</option>
                <option>Ao vivo</option>
                <option>Outra</option>
              </select>
            </Field>

            <div className="md:col-span-2">
              <Field label="Modelo da plataforma">
                <input
                  name="modeloPlataforma"
                  value={form.modeloPlataforma}
                  onChange={updateField}
                  placeholder="Ex.: Cassino + Esportes, Slots + Ao vivo, Plataforma completa..."
                  className={inputClass}
                />
              </Field>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Campo livre: escreva como você quer apresentar o modelo da plataforma.
              </p>
            </div>

            <div className="md:col-span-2">
              <Field label="Descrição">
                <textarea
                  name="descricao"
                  value={form.descricao}
                  onChange={updateField}
                  rows="4"
                  placeholder="Resumo da cooperação..."
                  className={inputClass}
                />
              </Field>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-[#0b1020]/90 p-6 shadow-xl backdrop-blur-xl">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">
            Valores e metas
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            Pagamentos da cooperação
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <Field label="Salário do blogueiro">
            <input
              name="salario"
              value={form.salario}
              onChange={updateField}
              placeholder="R$ 120,00"
              className={inputClass}
            />
          </Field>

          <Field label="Valor por depositante">
            <input
              name="valorDepositante"
              value={form.valorDepositante}
              onChange={updateField}
              placeholder="R$ 35,00"
              className={inputClass}
            />
          </Field>

          <Field label="Mínimo de depositantes">
            <input
              name="minimoDepositantes"
              type="number"
              min="0"
              value={form.minimoDepositantes}
              onChange={updateField}
              className={inputClass}
            />
          </Field>

          <Field label="Distribuição">
            <select
              name="distribuicao"
              value={form.distribuicao}
              onChange={updateField}
              className={inputClass}
            >
              <option>Alta</option>
              <option>Média</option>
              <option>Baixa</option>
            </select>
          </Field>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-[#0b1020]/90 p-6 shadow-xl backdrop-blur-xl">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.2em] text-blue-300">
            Operação
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            Regras e disponibilidade
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <Field label="Estoque de contas demo">
            <input
              name="contasDemo"
              type="number"
              min="0"
              value={form.contasDemo}
              onChange={updateField}
              className={inputClass}
            />
          </Field>

          <Field label="Depósito mínimo">
            <input
              name="depositoMinimo"
              value={form.depositoMinimo}
              onChange={updateField}
              placeholder="R$ 10,00"
              className={inputClass}
            />
          </Field>

          <Field label="Saque mínimo">
            <input
              name="saqueMinimo"
              value={form.saqueMinimo}
              onChange={updateField}
              placeholder="R$ 10,00"
              className={inputClass}
            />
          </Field>

          <Field label="Data de encerramento">
            <input
              name="dataEncerramento"
              type="date"
              value={form.dataEncerramento}
              onChange={updateField}
              className={inputClass}
            />
          </Field>

          <div className="md:col-span-2">
            <Field label="Link de cadastro">
              <input
                name="linkCadastro"
                value={form.linkCadastro}
                onChange={updateField}
                placeholder="https://..."
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Status">
            <select
              name="status"
              value={form.status}
              onChange={updateField}
              className={inputClass}
            >
              <option>Ativa</option>
              <option>Encerrada</option>
              <option>Oculta</option>
            </select>
          </Field>

          <Field label="Suporte / ouvidoria">
            <input
              name="suporte"
              value={form.suporte}
              onChange={updateField}
              placeholder="Suporte 24 horas"
              className={inputClass}
            />
          </Field>

          <div className="md:col-span-2">
            <Field label="Regras e proibições">
              <textarea
                name="regras"
                value={form.regras}
                onChange={updateField}
                rows="5"
                className={inputClass}
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label="Benefícios e promoções">
              <textarea
                name="beneficios"
                value={form.beneficios}
                onChange={updateField}
                rows="5"
                className={inputClass}
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label="Número do WhatsApp">
              <input
                name="whatsappNumero"
                value={form.whatsappNumero}
                onChange={updateField}
                inputMode="tel"
                placeholder="5511999999999"
                className={inputClass}
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label="Mensagem pronta do WhatsApp">
              <textarea
                name="mensagemWhatsApp"
                value={form.mensagemWhatsApp}
                onChange={updateField}
                rows="3"
                className={inputClass}
              />
            </Field>
          </div>
        </div>
      </section>

      {savedCooperacaoId ? (
        <CooperationMediaManager
          cooperacaoId={savedCooperacaoId}
        />
      ) : (
        <section className="rounded-3xl border border-dashed border-purple-500/20 bg-purple-500/[0.04] p-6 text-center">
          <Upload
            size={28}
            className="mx-auto text-purple-300"
          />

          <h2 className="mt-3 text-xl font-bold text-white">
            Mídias da plataforma
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">
            Salve a cooperação primeiro. Assim que ela for criada, você poderá
            selecionar várias fotos e vídeos de uma vez pelo PC ou pela galeria
            do celular.
          </p>
        </section>
      )}

      <section className="rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-indigo-500/5 p-6">
        <div className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-[#070b18] p-5 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 text-xl font-black">
            {imagem ? (
              <img
                src={imagem}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              preview.nome.slice(0, 3).toUpperCase()
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-2xl font-bold text-white">
              {preview.nome}
            </h3>

            <div className="mt-4 grid gap-3 text-sm text-slate-400 sm:grid-cols-5">
              <span>{preview.categoria}</span>
              <span>{preview.modeloPlataforma}</span>
              <span>{preview.salario}</span>
              <span>{preview.valorDepositante}</span>
              <span>WhatsApp: {preview.whatsappNumero}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p
            className={
              mensagem.includes("Não foi")
                ? "text-sm font-semibold text-red-300"
                : "text-sm font-semibold text-emerald-400"
            }
          >
            {mensagem ||
              "Ao salvar, os dados serão enviados ao Supabase."}
          </p>

          <button
            type="submit"
            disabled={salvando}
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
                : "Salvar cooperação"}
          </button>
        </div>
      </section>
    </form>
  );
}