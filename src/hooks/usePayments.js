import { useCallback, useEffect, useState } from "react";

import {
  getPagamentosSupabase,
  removePagamentoSupabase,
  savePagamentoSupabase,
} from "../services/supabase/payments";

export default function usePayments() {
  const [pagamentos, setPagamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getPagamentosSupabase();
      setPagamentos(data);
      return data;
    } catch (err) {
      console.error(err);
      setError(err?.message || "Erro ao carregar pagamentos.");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const save = useCallback(async (pagamento) => {
    const saved = await savePagamentoSupabase(pagamento);
    await refresh();
    return saved;
  }, [refresh]);

  const remove = useCallback(async (id) => {
    await removePagamentoSupabase(id);
    await refresh();
  }, [refresh]);

  return {
    pagamentos,
    loading,
    error,
    refresh,
    save,
    remove,
  };
}