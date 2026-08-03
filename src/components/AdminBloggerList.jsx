import {
  LoaderCircle,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";

import useBloggers from "../hooks/useBloggers";

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

  return (
    <section className="rounded-3xl border border-white/10 bg-[#0b1020]/90 p-6 shadow-xl backdrop-blur-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-purple-300">
            Supabase
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            Blogueiros cadastrados
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Consulte, edite ou exclua os blogueiros salvos no banco online.
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
            Novo blogueiro
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
          Carregando blogueiros...
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[950px] border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4">Blogueiro</th>
                <th className="px-4">WhatsApp</th>
                <th className="px-4">Cidade</th>
                <th className="px-4">Status</th>
                <th className="px-4">Nível</th>
                <th className="px-4">Cooperações</th>
                <th className="px-4">Total ganho</th>
                <th className="px-4 text-right">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody>
              {blogueiros.map((blogueiro) => (
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

                      <div>
                        <strong className="block text-white">
                          {blogueiro.nome}
                        </strong>

                        <span className="text-xs text-slate-500">
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
                      .join(" - ") || "Não informada"}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={[
                        "rounded-full px-3 py-1 text-xs font-semibold",
                        blogueiro.status === "Ativo"
                          ? "bg-emerald-500/10 text-emerald-300"
                          : blogueiro.status ===
                              "Bloqueado"
                            ? "bg-red-500/10 text-red-300"
                            : "bg-slate-500/10 text-slate-300",
                      ].join(" ")}
                    >
                      {blogueiro.status}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    {blogueiro.nivel}
                  </td>

                  <td className="px-4 py-4">
                    {blogueiro.cooperacoes || 0}
                  </td>

                  <td className="px-4 py-4 text-emerald-400">
                    {blogueiro.totalGanho ||
                      "R$ 0,00"}
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
              ))}
            </tbody>
          </table>

          {blogueiros.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-[#070b18] p-8 text-center text-slate-400">
              Nenhum blogueiro cadastrado ainda.
            </div>
          )}
        </div>
      )}
    </section>
  );
}