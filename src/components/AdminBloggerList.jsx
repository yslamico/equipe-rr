import { useMemo, useState } from "react";
import {
  LoaderCircle,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";

import useBloggers from "../hooks/useBloggers";

const filtros = [
  "Todos",
  "Ativo",
  "Inativo",
  "Bloqueado",
];

export default function AdminBloggerList({
  onNovo,
  onEditar,
}) {
  const {
    blogueiros,
    loading,
    error,
    refresh,
    remove,
  } = useBloggers();

  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] =
    useState("Todos");

  const blogueirosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return blogueiros.filter((blogueiro) => {
      const bateStatus =
        filtroStatus === "Todos" ||
        blogueiro.status === filtroStatus;

      if (!bateStatus) {
        return false;
      }

      if (!termo) {
        return true;
      }

      const texto = [
        blogueiro.nome,
        blogueiro.instagram,
        blogueiro.whatsapp,
        blogueiro.cidade,
        blogueiro.estado,
        blogueiro.nivel,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return texto.includes(termo);
    });
  }, [blogueiros, busca, filtroStatus]);

  async function excluir(id) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este blogueiro?",
    );

    if (!confirmar) return;

    try {
      await remove(id);
    } catch (erro) {
      console.error(erro);

      window.alert(
        "Não foi possível excluir o blogueiro.",
      );
    }
  }

  function statusClass(status) {
    if (status === "Ativo") {
      return "bg-emerald-500/10 text-emerald-300";
    }

    if (status === "Bloqueado") {
      return "bg-red-500/10 text-red-300";
    }

    return "bg-slate-500/10 text-slate-300";
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-[#0b1020]/90 p-4 shadow-xl backdrop-blur-xl sm:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-purple-300">
            Blogueiros
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            Blogueiros cadastrados
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Consulte os blogueiros salvos no BoraCoop.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Atualizar
          </button>

          <button
            type="button"
            onClick={onNovo}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-950/30"
          >
            <Plus size={18} />
            Novo blogueiro
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_auto]">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#070b18] px-4 py-3 focus-within:border-purple-500/40">
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
            placeholder="Buscar por nome, Instagram, WhatsApp, cidade..."
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {filtros.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFiltroStatus(status)}
              className={[
                "rounded-xl border px-4 py-3 text-sm font-semibold transition",
                filtroStatus === status
                  ? "border-purple-500/30 bg-purple-500/15 text-purple-200"
                  : "border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-white",
              ].join(" ")}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-slate-500">
          {blogueirosFiltrados.length} de{" "}
          {blogueiros.length} blogueiros
        </p>

        {busca && (
          <button
            type="button"
            onClick={() => setBusca("")}
            className="text-purple-300 transition hover:text-purple-200"
          >
            Limpar busca
          </button>
        )}
      </div>

      {error && (
        <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-3 py-12 text-slate-400">
          <LoaderCircle className="animate-spin" />
          Carregando blogueiros...
        </div>
      ) : blogueirosFiltrados.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-[#070b18] p-8 text-center">
          <p className="font-semibold text-white">
            Nenhum blogueiro encontrado
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Tente mudar a busca ou o filtro selecionado.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-3 md:hidden">
            {blogueirosFiltrados.map((blogueiro) => (
              <article
                key={blogueiro.id}
                className="rounded-2xl border border-white/10 bg-[#070b18] p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 font-black text-white">
                    {blogueiro.foto ? (
                      <img
                        src={blogueiro.foto}
                        alt={`Foto de ${blogueiro.nome}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      String(blogueiro.nome || "BLG")
                        .slice(0, 3)
                        .toUpperCase()
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <strong className="block truncate text-white">
                      {blogueiro.nome}
                    </strong>

                    <span className="mt-1 block truncate text-xs text-slate-500">
                      {blogueiro.instagram ||
                        "Sem Instagram"}
                    </span>

                    <span className="mt-1 block text-xs text-slate-500">
                      {[blogueiro.cidade, blogueiro.estado]
                        .filter(Boolean)
                        .join(" - ") ||
                        "Cidade não informada"}
                    </span>
                  </div>

                  <span
                    className={[
                      "rounded-full px-3 py-1 text-xs font-semibold",
                      statusClass(blogueiro.status),
                    ].join(" ")}
                  >
                    {blogueiro.status || "Ativo"}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white/[0.03] p-3">
                    <span className="block text-xs text-slate-500">
                      WhatsApp
                    </span>

                    <strong className="mt-1 block truncate text-sm text-white">
                      {blogueiro.whatsapp ||
                        "Não informado"}
                    </strong>
                  </div>

                  <div className="rounded-xl bg-white/[0.03] p-3">
                    <span className="block text-xs text-slate-500">
                      Nível
                    </span>

                    <strong className="mt-1 block text-sm text-white">
                      {blogueiro.nivel || "Bronze"}
                    </strong>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEditar(blogueiro)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/15"
                  >
                    <Pencil size={17} />
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      excluir(blogueiro.id)
                    }
                    className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 transition hover:bg-red-500/15"
                    aria-label={`Excluir ${blogueiro.nome}`}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6 hidden overflow-x-auto md:block">
            <table className="w-full min-w-[900px] border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4">Blogueiro</th>
                  <th className="px-4">WhatsApp</th>
                  <th className="px-4">Cidade</th>
                  <th className="px-4">Status</th>
                  <th className="px-4">Nível</th>
                  <th className="px-4 text-right">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody>
                {blogueirosFiltrados.map(
                  (blogueiro) => (
                    <tr
                      key={blogueiro.id}
                      className="bg-[#070b18] text-sm text-slate-300"
                    >
                      <td className="rounded-l-2xl px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 font-black text-white">
                            {blogueiro.foto ? (
                              <img
                                src={blogueiro.foto}
                                alt={`Foto de ${blogueiro.nome}`}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              String(
                                blogueiro.nome || "BLG",
                              )
                                .slice(0, 3)
                                .toUpperCase()
                            )}
                          </div>

                          <div className="min-w-0">
                            <strong className="block max-w-[220px] truncate text-white">
                              {blogueiro.nome}
                            </strong>

                            <span className="block max-w-[220px] truncate text-xs text-slate-500">
                              {blogueiro.instagram ||
                                "Sem Instagram"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        {blogueiro.whatsapp ||
                          "Não informado"}
                      </td>

                      <td className="px-4 py-4">
                        {[blogueiro.cidade, blogueiro.estado]
                          .filter(Boolean)
                          .join(" - ") ||
                          "Não informada"}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={[
                            "rounded-full px-3 py-1 text-xs font-semibold",
                            statusClass(
                              blogueiro.status,
                            ),
                          ].join(" ")}
                        >
                          {blogueiro.status || "Ativo"}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        {blogueiro.nivel || "Bronze"}
                      </td>

                      <td className="rounded-r-2xl px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              onEditar(blogueiro)
                            }
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-300 transition hover:bg-blue-500/15"
                            title="Editar"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              excluir(blogueiro.id)
                            }
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 transition hover:bg-red-500/15"
                            title="Excluir"
                          >
                            <Trash2 size={17} />
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
  );
}