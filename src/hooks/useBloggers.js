import { useCallback, useEffect, useState } from "react";

import {
  getBlogueirosSupabase,
  removeBlogueiroSupabase,
  saveBlogueiroSupabase,
} from "../services/supabase/bloggers";

export default function useBloggers() {
  const [blogueiros, setBlogueiros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getBlogueirosSupabase();
      setBlogueiros(data);

      return data;
    } catch (err) {
      console.error("Erro no useBloggers:", err);

      setError(
        err?.message ||
          "Não foi possível carregar os blogueiros.",
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
    async (blogueiro) => {
      try {
        setError("");

        const saved =
          await saveBlogueiroSupabase(blogueiro);

        await refresh();

        return saved;
      } catch (err) {
        console.error(
          "Erro ao salvar blogueiro:",
          err,
        );

        setError(
          err?.message ||
            "Não foi possível salvar o blogueiro.",
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

        await removeBlogueiroSupabase(id);
        await refresh();
      } catch (err) {
        console.error(
          "Erro ao excluir blogueiro:",
          err,
        );

        setError(
          err?.message ||
            "Não foi possível excluir o blogueiro.",
        );

        throw err;
      }
    },
    [refresh],
  );

  return {
    blogueiros,
    loading,
    error,
    refresh,
    save,
    remove,
  };
}