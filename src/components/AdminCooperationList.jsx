import { useEffect, useState } from "react";
import {
  LoaderCircle,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";

import {
  getCooperacoesSupabase,
  removeCooperacaoSupabase,
} from "../services/supabase/cooperations";

export default function AdminCooperationList({
  onNova,
  onEditar,
}) {
  const [cooperacoes, setCooperacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  async function carregar() {
    try {
      setCarregando(true);
      setErro("");

      const dados = await getCooperacoesSupabase();
      setCooperacoes(dados);
    } catch (error) {
      console.error(error);
      setErro(
        "Não foi possível carregar as cooperações do Supabase.",
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function excluir(id) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir esta cooperação?",
    );

    if (!confirmar) return;

    try {
      await removeCooperacaoSupabase(id);
      await carregar();
    } catch (error) {
      console.error(error);

      window.alert(
        "Não foi possível excluir a cooperação.",
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
            Cooperações cadastradas
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Estes dados já vêm do banco online.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={carregar}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06]"
          >
            <RefreshCw size={17} />
            Atualizar
          </button>

          <button
            type="button"
            onClick={onNova}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white"
          >
            <Plus size={18} />
            Nova cooperação
          </button>
        </div>
      </div>

      {erro && (
        <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {erro}
        </div>
      )}

      {carregando ? (
        <div className="flex items-center justify-center gap-3 py-12 text-slate-400">
          <LoaderCircle className="animate-spin" />
          Carregando cooperações...
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[900px] border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4">Plataforma</th>
                <th className="px-4">Categoria</th>
                <th className="px-4">Status</th>
                <th className="px-4">Salário</th>
                <th className="px-4">Por depositante</th>
                <th className="px-4">Contas demo</th>
                <th className="px-4 text-right">Ações</th>
              </tr>
            </thead>

            <tbody>
              {cooperacoes.map((coop) => (
                <tr
                  key={coop.id}
                  className="bg-[#070b18] text-sm text-slate-300"
                >
                  <td className="rounded-l-2xl px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 font-black text-white">
                        {coop.imagem ? (
                          <img
                            src={coop.imagem}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          String(coop.nome || "PLT")
                            .slice(0, 3)
                            .toUpperCase()
                        )}
                      </div>

                      <strong className="text-white">
                        {coop.nome}
                      </strong>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    {coop.categoria}
                  </td>

                  <td className="px-4 py-4">
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                      {coop.status}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    {coop.salario}
                  </td>

                  <td className="px-4 py-4 text-emerald-400">
                    {coop.valorDepositante}
                  </td>

                  <td className="px-4 py-4">
                    {coop.contasDemo}
                  </td>

                  <td className="rounded-r-2xl px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEditar(coop)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-300 transition hover:bg-blue-500/15"
                        title="Editar"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        type="button"
                        onClick={() => excluir(coop.id)}
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

          {cooperacoes.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-[#070b18] p-8 text-center text-slate-400">
              Nenhuma cooperação foi salva no Supabase ainda.
            </div>
          )}
        </div>
      )}
    </section>
  );
}