import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  LoaderCircle,
  LogOut,
  Mail,
  MapPin,
  Save,
  ShieldCheck,
  Smartphone,
  UserRound,
  WalletCards,
} from "lucide-react";

import BackgroundEffects from "../components/BackgroundEffects";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../services/supabaseClient";

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-[#070b18] px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-purple-500/40 focus:ring-4 focus:ring-purple-500/5";

function Field({ label, icon: Icon, children }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-300">
        {Icon && <Icon size={16} className="text-purple-300" />}
        {label}
      </span>

      {children}
    </label>
  );
}

export default function Profile() {
  const navigate = useNavigate();

  const {
    user,
    perfil,
    logout,
    refreshPerfil,
  } = useAuth();

  const [form, setForm] = useState({
    nome: "",
    foto_url: "",
    whatsapp: "",
    pix: "",
    cidade: "",
    estado: "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState("");

  useEffect(() => {
    setForm({
      nome: perfil?.nome || "",
      foto_url: perfil?.foto_url || "",
      whatsapp: perfil?.whatsapp || "",
      pix: perfil?.pix || "",
      cidade: perfil?.cidade || "",
      estado: perfil?.estado || "",
    });

    setPreview(perfil?.foto_url || "");
  }, [perfil]);

  const initials = useMemo(
    () =>
      String(form.nome || user?.email || "RR")
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    [form.nome, user?.email],
  );

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        name === "estado"
          ? value.toUpperCase().slice(0, 2)
          : value,
    }));

    setMessage("");
  }

  function handlePhoto(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const image = String(reader.result || "");

      setPreview(image);
      setForm((current) => ({
        ...current,
        foto_url: image,
      }));
      setMessage("");
    };

    reader.readAsDataURL(file);
  }

  async function saveProfile(event) {
    event.preventDefault();

    if (!user?.id) return;

    try {
      setSaving(true);
      setMessage("");

      const { error } = await supabase
        .from("profiles")
        .update({
          nome: form.nome.trim(),
          foto_url: form.foto_url || null,
          whatsapp: form.whatsapp.trim() || null,
          pix: form.pix.trim() || null,
          cidade: form.cidade.trim() || null,
          estado: form.estado.trim() || null,
        })
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      await refreshPerfil();

      setMessage("Perfil atualizado com sucesso.");
    } catch (error) {
      console.error(error);

      setMessage(
        error?.message ||
          "Não foi possível atualizar o perfil.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error(error);
      setMessage("Não foi possível sair da conta.");
    }
  }

  const isError =
    message.includes("Não foi") ||
    message.includes("erro");

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-transparent text-white lg:flex">
      <BackgroundEffects />
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Navbar />

        <main className="relative z-10 px-3 pb-24 pt-4 sm:p-6">
          <header className="mb-6 sm:mb-8">
            <p className="text-xs uppercase tracking-[0.25em] text-purple-300 sm:text-sm">
              Minha conta
            </p>

            <h1 className="mt-2 text-3xl font-black sm:mt-3 sm:text-4xl">
              Perfil
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
              Atualize seus dados pessoais, contato e chave PIX.
            </p>
          </header>

          <form
            onSubmit={saveProfile}
            className="grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)]"
          >
            <aside className="space-y-5">
              <section className="rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-600/15 via-[#0b1020] to-[#0b1020] p-5 shadow-xl shadow-purple-950/20">
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 text-3xl font-black shadow-xl shadow-purple-950/40">
                      {preview ? (
                        <img
                          src={preview}
                          alt="Foto do perfil"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        initials
                      )}
                    </div>

                    <label className="absolute -bottom-2 -right-2 flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border border-white/10 bg-[#11172a] text-purple-300 shadow-lg transition hover:bg-purple-500/15">
                      <Camera size={19} />

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhoto}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <h2 className="mt-5 text-2xl font-black capitalize">
                    {form.nome || "Usuário"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    {user?.email}
                  </p>

                  <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-purple-300">
                    <ShieldCheck size={15} />
                    {perfil?.role === "admin"
                      ? "Administrador"
                      : "Blogueiro"}
                  </span>
                </div>
              </section>

              <button
                type="button"
                onClick={handleLogout}
                className="flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 font-semibold text-red-300 transition hover:bg-red-500/15"
              >
                <LogOut size={20} />
                Sair da conta
              </button>
            </aside>

            <section className="rounded-3xl border border-white/10 bg-[#0b1020]/90 p-4 shadow-xl backdrop-blur-xl sm:p-6">
              <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.2em] text-purple-300">
                  Dados pessoais
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Informações do perfil
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Nome completo"
                  icon={UserRound}
                >
                  <input
                    name="nome"
                    value={form.nome}
                    onChange={updateField}
                    placeholder="Seu nome"
                    className={inputClass}
                    required
                  />
                </Field>

                <Field label="E-mail" icon={Mail}>
                  <input
                    value={user?.email || ""}
                    className={`${inputClass} cursor-not-allowed opacity-60`}
                    disabled
                  />
                </Field>

                <Field
                  label="WhatsApp"
                  icon={Smartphone}
                >
                  <input
                    name="whatsapp"
                    value={form.whatsapp}
                    onChange={updateField}
                    inputMode="tel"
                    placeholder="(11) 99999-9999"
                    className={inputClass}
                  />
                </Field>

                <Field
                  label="Chave PIX"
                  icon={WalletCards}
                >
                  <input
                    name="pix"
                    value={form.pix}
                    onChange={updateField}
                    placeholder="CPF, e-mail ou telefone"
                    className={inputClass}
                  />
                </Field>

                <Field label="Cidade" icon={MapPin}>
                  <input
                    name="cidade"
                    value={form.cidade}
                    onChange={updateField}
                    placeholder="Sua cidade"
                    className={inputClass}
                  />
                </Field>

                <Field label="Estado" icon={MapPin}>
                  <input
                    name="estado"
                    value={form.estado}
                    onChange={updateField}
                    placeholder="SP"
                    maxLength="2"
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="mt-7 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p
                  className={[
                    "min-h-5 text-sm font-semibold",
                    isError
                      ? "text-red-300"
                      : "text-emerald-400",
                  ].join(" ")}
                >
                  {message}
                </p>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 font-bold text-white shadow-lg shadow-purple-950/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {saving ? (
                    <LoaderCircle
                      size={20}
                      className="animate-spin"
                    />
                  ) : (
                    <Save size={20} />
                  )}

                  {saving
                    ? "Salvando..."
                    : "Salvar perfil"}
                </button>
              </div>
            </section>
          </form>
        </main>
      </div>
    </div>
  );
}