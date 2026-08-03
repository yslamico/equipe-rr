const categorias = ["Todos", "Cassino", "Esportes", "Poker"];

export default function CooperationFilters({
  busca,
  setBusca,
  categoriaAtiva,
  setCategoriaAtiva,
}) {
  return (
    <div className="mb-6 rounded-3xl border border-white/10 bg-[#0b1020] p-4 shadow-xl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <input
          type="search"
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
          placeholder="Buscar cooperação..."
          className="w-full rounded-2xl border border-white/10 bg-[#070b18] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-purple-500/40 lg:max-w-md"
        />

        <div className="flex flex-wrap gap-2">
          {categorias.map((categoria) => (
            <button
              key={categoria}
              type="button"
              onClick={() => setCategoriaAtiva(categoria)}
              className={[
                "rounded-xl px-4 py-2 text-sm font-semibold transition",
                categoriaAtiva === categoria
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                  : "border border-white/10 bg-white/[0.03] text-slate-400 hover:text-white",
              ].join(" ")}
            >
              {categoria}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}