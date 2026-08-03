import { useState } from "react";

import AdminPaymentForm from "../components/AdminPaymentForm";
import AdminPaymentList from "../components/AdminPaymentList";
import BackgroundEffects from "../components/BackgroundEffects";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Finance() {
  const [tela, setTela] = useState("lista");
  const [pagamentoSelecionado, setPagamentoSelecionado] =
    useState(null);

  function abrirNovo() {
    setPagamentoSelecionado(null);
    setTela("formulario");
  }

  function abrirEdicao(pagamento) {
    setPagamentoSelecionado(pagamento);
    setTela("formulario");
  }

  function voltarParaLista() {
    setPagamentoSelecionado(null);
    setTela("lista");
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
              {tela === "lista"
                ? "Financeiro"
                : pagamentoSelecionado
                  ? "Editar pagamento"
                  : "Novo pagamento"}
            </h1>

            <p className="mt-2 max-w-2xl text-slate-400">
              {tela === "lista"
                ? "Acompanhe pagamentos pagos, pendentes e cancelados."
                : pagamentoSelecionado
                  ? "Altere os dados do pagamento e salve."
                  : "Registre um novo pagamento para um blogueiro."}
            </p>
          </header>

          {tela === "lista" ? (
            <AdminPaymentList
              onNovo={abrirNovo}
              onEditar={abrirEdicao}
            />
          ) : (
            <div>
              <button
                type="button"
                onClick={voltarParaLista}
                className="mb-5 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06]"
              >
                Voltar para a lista
              </button>

              <AdminPaymentForm
                initialData={pagamentoSelecionado}
                onSaved={voltarParaLista}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}