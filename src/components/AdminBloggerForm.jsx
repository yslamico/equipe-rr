import { useEffect, useState } from "react";
import {
  Camera,
  LoaderCircle,
  Save,
  Upload,
  X,
} from "lucide-react";

import {
  saveBlogueiroSupabase,
} from "../services/supabase/bloggers";

const emptyForm = {
  nome: "",
  whatsapp: "",
  instagram: "",
  telegram: "",
  cidade: "",
  estado: "",
  pix: "",
  cpf: "",
  status: "Ativo",
  nivel: "Bronze",
  cooperacoes: 0,
  totalGanho: "R$ 0,00",
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

export default function AdminBloggerForm({
  initialData = null,
  onSaved,
}) {
  const [form, setForm] = useState(emptyForm);
  const [foto, setFoto] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    if (initialData) {
      setForm({
        ...emptyForm,
        ...initialData,
      });

      setFoto(initialData.foto || "");
    } else {
      setForm(emptyForm);
      setFoto("");
    }

    setMensagem("");
  }, [initialData]);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setMensagem("");
  }

  function handlePhoto(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setFoto(String(reader.result || ""));
      setMensagem("");
    };

    reader.readAsDataURL(file);
  }

  function removePhoto() {
    setFoto("");
    setMensagem("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSalvando(true);
      setMensagem("");

      const blogueiroSalvo =
        await saveBlogueiroSupabase({
          ...form,
          id: initialData?.id,
          userId: initialData?.userId,
          foto,
          cooperacoes: Number(
            form.cooperacoes || 0,
          ),
        });

      setMensagem(
        "Blogueiro salvo no Supabase com sucesso.",
      );

      onSaved?.(blogueiroSalvo);
    } catch (error) {
      console.error(error);

      setMensagem(
        error?.message ||
          "Não foi possível salvar o blogueiro.",
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
            Dados do blogueiro
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <div>
            <span className="mb-2 block text-sm font-semibold text-slate-300">
              Foto
            </span>

            <div className="relative flex h-52 items-center justify-center overflow-hidden rounded-3xl border border-dashed border-purple-400/30 bg-[#070b18]">
              {foto ? (
                <>
                  <img
                    src={foto}
                    alt="Foto do blogueiro"
                    className="h-full w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl bg-black/60 text-white backdrop-blur"
                  >
                    <X size={18} />
                  </button>
                </>
              ) : (
                <div className="text-center">
                  <Camera
                    size={38}
                    className="mx-auto text-purple-400"
                  />

                  <p className="mt-3 text-sm text-slate-400">
                    Escolha a foto do blogueiro
                  </p>
                </div>
              )}
            </div>

            <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-purple-500/20 bg-purple-500/10 px-4 py-3 text-sm font-semibold text-purple-200 transition hover:bg-purple-500/15">
              <Upload size={18} />
              Selecionar foto

              <input
                type="file"
                accept="image/*"
                onChange={handlePhoto}
                className="hidden"
              />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Nome completo">
              <input
                name="nome"
                value={form.nome}
                onChange={updateField}
                placeholder="Ex.: João Silva"
                className={inputClass}
                required
              />
            </Field>

            <Field label="WhatsApp">
              <input
                name="whatsapp"
                value={form.whatsapp}
                onChange={updateField}
                placeholder="(11) 99999-9999"
                className={inputClass}
                required
              />
            </Field>

            <Field label="Instagram">
              <input
                name="instagram"
                value={form.instagram}
                onChange={updateField}
                placeholder="@usuario"
                className={inputClass}
              />
            </Field>

            <Field label="Telegram">
              <input
                name="telegram"
                value={form.telegram}
                onChange={updateField}
                placeholder="@usuario"
                className={inputClass}
              />
            </Field>

            <Field label="Cidade">
              <input
                name="cidade"
                value={form.cidade}
                onChange={updateField}
                placeholder="Ex.: São Paulo"
                className={inputClass}
              />
            </Field>

            <Field label="Estado">
              <input
                name="estado"
                value={form.estado}
                onChange={updateField}
                placeholder="Ex.: SP"
                maxLength="2"
                className={inputClass}
              />
            </Field>

            <Field label="Chave PIX">
              <input
                name="pix"
                value={form.pix}
                onChange={updateField}
                placeholder="CPF, e-mail ou telefone"
                className={inputClass}
              />
            </Field>

            <Field label="CPF (opcional)">
              <input
                name="cpf"
                value={form.cpf}
                onChange={updateField}
                placeholder="000.000.000-00"
                className={inputClass}
              />
            </Field>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-[#0b1020]/90 p-6 shadow-xl backdrop-blur-xl">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">
            Desempenho
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            Status e resultados
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <Field label="Status">
            <select
              name="status"
              value={form.status}
              onChange={updateField}
              className={inputClass}
            >
              <option>Ativo</option>
              <option>Inativo</option>
              <option>Bloqueado</option>
            </select>
          </Field>

          <Field label="Nível">
            <select
              name="nivel"
              value={form.nivel}
              onChange={updateField}
              className={inputClass}
            >
              <option>Bronze</option>
              <option>Prata</option>
              <option>Ouro</option>
              <option>Diamante</option>
            </select>
          </Field>

          <Field label="Cooperações realizadas">
            <input
              name="cooperacoes"
              type="number"
              min="0"
              value={form.cooperacoes}
              onChange={updateField}
              className={inputClass}
            />
          </Field>

          <Field label="Total ganho">
            <input
              name="totalGanho"
              value={form.totalGanho}
              onChange={updateField}
              placeholder="R$ 0,00"
              className={inputClass}
            />
          </Field>
        </div>
      </section>

      <section className="rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-indigo-500/5 p-6">
        <div className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-[#070b18] p-5 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 text-xl font-black">
            {foto ? (
              <img
                src={foto}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              String(form.nome || "BLOG")
                .slice(0, 3)
                .toUpperCase()
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-2xl font-bold text-white">
                {form.nome || "Nome do blogueiro"}
              </h3>

              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                {form.status}
              </span>

              <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
                {form.nivel}
              </span>
            </div>

            <div className="mt-4 grid gap-3 text-sm text-slate-400 sm:grid-cols-3">
              <span>
                {form.whatsapp ||
                  "WhatsApp não informado"}
              </span>

              <span>
                {form.cooperacoes} cooperações
              </span>

              <span>{form.totalGanho}</span>
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
                : "Salvar blogueiro"}
          </button>
        </div>
      </section>
    </form>
  );
}