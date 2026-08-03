import { useCallback, useEffect, useState } from "react";

import {
  getCooperacoesSupabase,
  removeCooperacaoSupabase,
  saveCooperacaoSupabase,
} from "../services/supabase/cooperations";

export default function useCooperations() {
  const [cooperacoes, setCooperacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCooperacoesSupabase();
      setCooperacoes(data);

      return data;
    } catch (err) {
      console.error("Erro no useCooperations:", err);
      setError(
        err?.message ||
          "Não foi possível carregar as cooperações.",
      );

      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const save = useCallback(
    async (cooperacao) => {
      try {
        setError("");

        const saved =
          await saveCooperacaoSupabase(cooperacao);

        await refresh();

        return saved;
      } catch (err) {
        console.error(
          "Erro ao salvar cooperação:",
          err,
        );

        setError(
          err?.message ||
            "Não foi possível salvar a cooperação.",
        );

        throw err;
      }
    },
    [refresh],
  );

  const remove = useCallback(
    async (id) => {
      try {
        setError("");

        await removeCooperacaoSupabase(id);
        await refresh();
      } catch (err) {
        console.error(
          "Erro ao excluir cooperação:",
          err,
        );

        setError(
          err?.message ||
            "Não foi possível excluir a cooperação.",
        );

        throw err;
      }
    },
    [refresh],
  );

  return {
    cooperacoes,
    loading,
    error,
    refresh,
    save,
    remove,
  };
}