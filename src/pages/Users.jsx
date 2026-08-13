import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  LoaderCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import BackgroundEffects from "../components/BackgroundEffects";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { getProfilesSupabase } from "../services/supabase/profiles";

const filtros = [
  { value: "todos", label: "Todos" },
  { value: "blogueiro", label: "Blogueiros" },
  { value: "admin", label: "Admins" },
];

function formatarData(value) {
  if (!value) return "Não informada";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Não informada";
  }

  return date.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function initials(nome) {
  return String(nome || "US")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0] || "")
    .join("")
    .toUpperCase();
}

export default function Users() {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("todos");

  async function carregar() {
    try {
      setLoading(true);
      setError("");

      const data = await getProfilesSupabase();
      setUsuarios(data);
    } catch (err) {
      console.error(err);

      setError(
        err?.message ||
          "Não foi possível carregar os usuários cadastrados.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const usuariosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return usuarios.filter((usuario) => {
      const bateFiltro =
        filtro === "todos" ||
        usuario.role === filtro;

      if (!bateFiltro) return false;

      if (!termo) return true;

      const texto = [
        usuario.nome,
        usuario.role,
        usuario.whatsapp,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return texto.includes(termo);
    });
  }, [usuarios, busca, filtro]);

  const totais = useMemo(() => {
    return {
      total: usuarios.length,
      blogueiros: usuarios.filter(
        (usuario) => usuario.role === "blogueiro",
      ).length,
      admins: usuarios.filter(
        (usuario) => usuario.role === "admin",
      ).length,
    };
  }, [usuarios]);

  function abrirPerfil(id) {
    navigate(`/usuarios/${id}`);
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-transparent text-white lg:flex">
      <BackgroundEffects />
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Navbar />

        <main className="relative z-10 p-4 sm:p-6">
          <header className="mb-8">
            <p className="text-sm uppercase tracking-[0.25em] text-purple-300">
              Painel administrativo
            </p>

            <h1 className="mt-3 text-4xl font-black text-white">
              Usuários cadastrados
            </h1>

            <p className="mt-2 max-w-2xl text-slate-400">
              Veja todas as pessoas que já criaram uma conta no BoraCoop.
            </p>
          </header>

          <section className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-[#0b1020]/90 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-300">
                  <UsersRound size={21} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Total
                  </p>

                  <strong className="text-2xl text-white">
                    {totais.total}
                  </strong>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0b1020]/90 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
                  <UserRound size={21} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Blogueiros
                  </p>

                  <strong className="text-2xl text-white">
                    {totais.blogueiros}
                  </strong>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0b1020]/90 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
                  <ShieldCheck size={21} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Admins
                  </p>

                  <strong className="text-2xl text-white">
                    {totais.admins}
                  </strong>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-3xl border border-white/10 bg-[#0b1020]/90 p-4 shadow-xl backdrop-blur-xl sm:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-[#070b18] px-4 py-3 focus-within:border-purple-500/40">
                <Search
                  size={18}
                  className="shrink-0 text-slate-500"
                />

                <input
                  type="search"
                  value={busca}
                  onChange={(event) =>
                    setBusca(event.target.value)
                  }
                  placeholder="Buscar por nome, WhatsApp ou função..."
                  className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {filtros.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      setFiltro(item.value)
                    }
                    className={[
                      "rounded-xl border px-4 py-3 text-sm font-semibold transition",
                      filtro === item.value
                        ? "border-purple-500/30 bg-purple-500/15 text-purple-200"
                        : "border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-white",
                    ].join(" ")}
                  >
                    {item.label}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={carregar}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06] disabled:opacity-50"
                >
                  <RefreshCw
                    size={17}
                    className={
                      loading ? "animate-spin" : ""
                    }
                  />
                  Atualizar
                </button>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              Exibindo {usuariosFiltrados.length} de{" "}
              {usuarios.length} usuários.
            </p>

            {error && (
              <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center gap-3 py-12 text-slate-400">
                <LoaderCircle className="animate-spin" />
                Carregando usuários...
              </div>
            ) : usuariosFiltrados.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-white/10 bg-[#070b18] p-8 text-center text-slate-400">
                Nenhum usuário encontrado.
              </div>
            ) : (
              <>
                <div className="mt-6 grid gap-3 md:hidden">
                  {usuariosFiltrados.map((usuario) => (
                    <article
                      key={usuario.id}
                      className="rounded-2xl border border-white/10 bg-[#070b18] p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 font-black text-white">
                          {usuario.foto_url ? (
                            <img
                              src={usuario.foto_url}
                              alt={`Foto de ${usuario.nome}`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            initials(usuario.nome)
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <strong className="block truncate text-white">
                            {usuario.nome ||
                              "Usuário sem nome"}
                          </strong>

                          <span className="mt-1 block text-xs text-slate-500">
                            {usuario.whatsapp ||
                              "WhatsApp não informado"}
                          </span>
                        </div>

                        <span
                          className={[
                            "rounded-full px-3 py-1 text-xs font-semibold",
                            usuario.role === "admin"
                              ? "bg-emerald-500/10 text-emerald-300"
                              : "bg-purple-500/10 text-purple-300",
                          ].join(" ")}
                        >
                          {usuario.role ||
                            "blogueiro"}
                        </span>
                      </div>

                      <div className="mt-4 rounded-xl bg-white/[0.03] p-3">
                        <span className="block text-xs text-slate-500">
                          Cadastrado em
                        </span>

                        <strong className="mt-1 block text-sm text-white">
                          {formatarData(
                            usuario.created_at,
                          )}
                        </strong>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          abrirPerfil(usuario.id)
                        }
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-purple-500/20 bg-purple-500/10 px-4 py-3 text-sm font-semibold text-purple-200 transition hover:bg-purple-500/15"
                      >
                        <Eye size={17} />
                        Ver perfil
                      </button>
                    </article>
                  ))}
                </div>

                <div className="mt-6 hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[900px] border-separate border-spacing-y-3">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                        <th className="px-4">
                          Usuário
                        </th>
                        <th className="px-4">
                          WhatsApp
                        </th>
                        <th className="px-4">
                          Função
                        </th>
                        <th className="px-4">
                          Cadastro
                        </th>
                        <th className="px-4">
                          Atualização
                        </th>
                        <th className="px-4 text-right">
                          Ações
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {usuariosFiltrados.map(
                        (usuario) => (
                          <tr
                            key={usuario.id}
                            className="bg-[#070b18] text-sm text-slate-300"
                          >
                            <td className="rounded-l-2xl px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 font-black text-white">
                                  {usuario.foto_url ? (
                                    <img
                                      src={
                                        usuario.foto_url
                                      }
                                      alt={`Foto de ${usuario.nome}`}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    initials(
                                      usuario.nome,
                                    )
                                  )}
                                </div>

                                <div>
                                  <strong className="block text-white">
                                    {usuario.nome ||
                                      "Usuário sem nome"}
                                  </strong>

                                  <span className="text-xs text-slate-500">
                                    {String(
                                      usuario.id,
                                    ).slice(0, 8)}
                                    ...
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-4">
                              {usuario.whatsapp ||
                                "Não informado"}
                            </td>

                            <td className="px-4 py-4">
                              <span
                                className={[
                                  "rounded-full px-3 py-1 text-xs font-semibold",
                                  usuario.role ===
                                  "admin"
                                    ? "bg-emerald-500/10 text-emerald-300"
                                    : "bg-purple-500/10 text-purple-300",
                                ].join(" ")}
                              >
                                {usuario.role ||
                                  "blogueiro"}
                              </span>
                            </td>

                            <td className="px-4 py-4">
                              {formatarData(
                                usuario.created_at,
                              )}
                            </td>

                            <td className="px-4 py-4">
                              {formatarData(
                                usuario.updated_at,
                              )}
                            </td>

                            <td className="rounded-r-2xl px-4 py-4">
                              <div className="flex justify-end">
                                <button
                                  type="button"
                                  onClick={() =>
                                    abrirPerfil(
                                      usuario.id,
                                    )
                                  }
                                  className="inline-flex items-center gap-2 rounded-xl border border-purple-500/20 bg-purple-500/10 px-4 py-2.5 text-sm font-semibold text-purple-200 transition hover:bg-purple-500/15"
                                >
                                  <Eye size={17} />
                                  Ver perfil
                                </button>
                              </div>
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}